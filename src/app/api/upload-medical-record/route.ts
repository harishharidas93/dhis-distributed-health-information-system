import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';
import { config } from '@/config/config';
import imageProcessor from '@/utils/imageProcessor';
import crypto from 'crypto';
import { PrivateKey } from '@hashgraph/sdk';
import { getUserByWalletAddress } from '@/services/lowdb.service';

const pinata = new PinataSDK({
  pinataJwt: config.pinata.jwt,
  pinataGateway: config.pinata.gatewayUrl,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    const payload = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      collectionId: formData.get('collectionId') as string,
      collectionName: formData.get('collectionName') as string,
      walletAddress: formData.get('walletAddress') as string,
    };

    const file = formData.get('document');
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, error: 'Invalid file' }, { status: 400 });
    }

    const patientDetails = getUserByWalletAddress(payload.walletAddress);
    if (!patientDetails) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const checksum = imageProcessor.generateChecksum(fileBuffer);

    // Generate AES key and IV
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    // Encrypt the file
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    const encryptedData = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Generate ephemeral key pair
    const ephemeralKey = PrivateKey.generateECDSA();
    const ephemeralPublicKey = ephemeralKey.publicKey;

    // Compute shared secret
    // The shared secret is generated using ECDH (Elliptic Curve Diffie-Hellman). It enables two parties to derive the same secret key without directly sending any secret over the network.
    // patientPublicKey from did
    const sharedSecret = await imageProcessor.computeHederaSharedSecret(ephemeralKey, imageProcessor.getPublicKeyFromDID(patientDetails.did));

    // Derive decryption key with proper typing
    const derivedKey = Buffer.from(
      crypto.hkdfSync(
        'sha256',
        sharedSecret,
        Buffer.from(''), // salt
        Buffer.from(''), // info
        32
      )
    );
    
    // Encrypt the AES key
    const keyCipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
    const encryptedAesKey = Buffer.concat([
      keyCipher.update(aesKey),
      keyCipher.final()
    ]);
    const keyAuthTag = keyCipher.getAuthTag();

    // Prepare for Pinata upload
    const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });
    const encryptedFile = new File(
      [encryptedBlob],
      'encrypted_medical_record.pdf',
      { type: 'application/octet-stream', lastModified: Date.now() }
    );

    const fileHash = await pinata.upload.public
      .file(encryptedFile)
      .name("medical_record.pdf")
      .keyvalues({
        checksum,
        type: 'application/octet-stream',
        patientDID: patientDetails.did,
      });

    // Build metadata
    const metadata = {
      name: payload.name,
      description: payload.description,
      creator: payload.walletAddress,
      format: 'HIP412@2.0.0',
      type: 'application/octet-stream',
      checksum,
      image: `${config.pinata.gatewayUrl}${fileHash.cid}`,
      files: [
        {
          checksum,
          is_default_file: true,
          type: 'application/octet-stream',
          uri: `${config.pinata.gatewayUrl}${fileHash.cid}`,
        },
      ],
      properties: {
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        encryptedAesKey: encryptedAesKey.toString('base64'),
        ephemeralPublicKey: ephemeralPublicKey.toStringDer(),
        keyAuthTag: keyAuthTag.toString('hex'),
        patientDID: patientDetails.did,
      },
    };

    // Upload metadata
    const metadataUpload = await pinata.upload.public.json(metadata);

    return NextResponse.json(
      {
        metadataCid: metadataUpload.cid,
        fileCid: fileHash.cid,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('PUT while encryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
