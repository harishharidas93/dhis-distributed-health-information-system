/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PinataSDK } from 'pinata';
import { config } from '@/config/config';
import imageProcessor from '@/utils/imageProcessor';
import crypto from 'crypto';
import { Readable } from 'stream';
import { PublicKey, PrivateKey, Client, TopicMessageSubmitTransaction, FileCreateTransaction, Hbar } from '@hashgraph/sdk';

// Setup Pinata
const pinata = new PinataSDK({
  pinataJwt: config.pinata.jwt,
  pinataGateway: config.pinata.gatewayUrl,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// HARDCODED TEST KEYS
const PATIENT_PUBLIC_KEY_HEX = '02d5778d3acaf2e0c98d833e91bb3112b77ddeedf46850d6af5dd56a613490ed9e';
const PATIENT_PRIVATE_KEY_HEX = '3d4f8e48e193f416e44362da7d34f068a5ce8f358a6ab8e2a20d0b9abd9bd853';

// Convert to usable key objects
const patientPublicKey = PublicKey.fromString(PATIENT_PUBLIC_KEY_HEX);
const patientPrivateKey = PrivateKey.fromString(PATIENT_PRIVATE_KEY_HEX);

// Initialize Hedera client
let hederaClient: Client | null = null;
async function getHederaClient() {
  if (!hederaClient) {
    hederaClient = Client.forName(config.hedera.network);
    hederaClient.setOperator(
      config.hedera.accountId, 
      PrivateKey.fromString(config.hedera.privateKey)
    );
  }
  return hederaClient;
}

// Helper function to compute ECDH shared secret
async function computeHederaSharedSecret(privateKey: PrivateKey, publicKey: PublicKey): Promise<Buffer> {
  const ecdh = crypto.createECDH('secp256k1');
  ecdh.setPrivateKey(Buffer.from(privateKey.toBytesRaw()));
  return ecdh.computeSecret(Buffer.from(publicKey.toBytesRaw()));
}

// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// 🟢 PUT — Encrypt and Upload (Patient)
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    const payload = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      collectionId: formData.get('collectionId') as string,
      collectionName: formData.get('collectionName') as string,
      walletAddress: formData.get('walletAddress') as string,
      patientDID: formData.get('patientDID') as string,
    };

    const file = formData.get('document');
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, error: 'Invalid file' }, { status: 400 });
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
    const sharedSecret = await computeHederaSharedSecret(ephemeralKey, patientPublicKey);
    
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

    // Upload to IPFS
    const fileHash = await pinata.upload.public
      .file(encryptedFile)
      .name("medical_record.pdf")
      .keyvalues({
        checksum,
        type: 'application/octet-stream',
        patientDID: payload.patientDID,
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
        collection_id: payload.collectionId,
        collection_name: payload.collectionName,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        encryptedAesKey: encryptedAesKey.toString('base64'),
        ephemeralPublicKey: ephemeralPublicKey.toStringRaw(),
        keyAuthTag: keyAuthTag.toString('hex'),
        patientDID: payload.patientDID,
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
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// 🟢 POST — Request Access (Provider)
export async function POST(request: NextRequest) {
  try {
    const { 
      providerPublicKey,
      fileCid,
      reason,
      accessType,
      requestedDuration,
      providerDID
    } = await request.json();

    if (!providerPublicKey || !fileCid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await getHederaClient();
    const requestId = crypto.randomUUID();

    // Submit to HCS
    const message = JSON.stringify({
      type: 'access-request',
      requestId,
      providerPublicKey,
      providerDID,
      fileCid,
      reason,
      accessType,
      requestedDuration,
      timestamp: new Date().toISOString()
    });

    const submitTx = await new TopicMessageSubmitTransaction()
      .setTopicId(config.hedera.hcsTopicId)
      .setMessage(message)
      .execute(client);

    return NextResponse.json({
      success: true,
      requestId,
      transactionId: submitTx.transactionId.toString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    );
  }
}

// 🟢 PATCH — Approve Access (Patient)
export async function PATCH(request: NextRequest) {
  try {
    const { 
      requestId,
      providerPublicKey,
      fileCid,
      accessType,
      duration 
    } = await request.json();

    // 1. Get original encrypted file metadata
    const metadataRes = await axios.get(`${config.pinata.gatewayUrl}${fileCid}`);
    const metadata = metadataRes.data;

    // 2. Decrypt AES key (using existing patient decryption logic)
    const iv = Buffer.from(metadata.properties.iv, 'hex');
    const authTag = Buffer.from(metadata.properties.authTag, 'hex');
    const encryptedAesKey = Buffer.from(metadata.properties.encryptedAesKey, 'base64');
    const ephemeralPublicKey = PublicKey.fromString(metadata.properties.ephemeralPublicKey);
    const keyAuthTag = Buffer.from(metadata.properties.keyAuthTag, 'hex');

    const sharedSecret = await computeHederaSharedSecret(patientPrivateKey, ephemeralPublicKey);
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

    const keyDecipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
    keyDecipher.setAuthTag(keyAuthTag);
    const aesKey = Buffer.concat([
      keyDecipher.update(encryptedAesKey),
      keyDecipher.final()
    ]);

    // 3. Re-encrypt for provider
    const providerPubKey = PublicKey.fromString(providerPublicKey);
    const providerSharedSecret = await computeHederaSharedSecret(patientPrivateKey, providerPubKey);
    
    const providerDerivedKey = Buffer.from( 
      crypto.hkdfSync(
      'sha256',
      providerSharedSecret,
      Buffer.from(''),
      Buffer.from(''),
      32
    )
  )

    const keyCipher = crypto.createCipheriv('aes-256-gcm', providerDerivedKey, iv);
    const encryptedForProvider = Buffer.concat([
      keyCipher.update(aesKey),
      keyCipher.final()
    ]);
    const providerAuthTag = keyCipher.getAuthTag();

    // 4. Store encrypted key
    const client = await getHederaClient();
    let storageLocation;

    if (config.hedera.hfsKey) {
      const fileTx = await new FileCreateTransaction()
        .setContents(encryptedForProvider)
        .setKeys([PublicKey.fromString(config.hedera.hfsKey.publicKey)])
        .execute(client);
        
      const receipt = await fileTx.getReceipt(client);
      storageLocation = `hfs:${receipt.fileId!.toString()}`;
    } else {
      const file = new File([encryptedForProvider], `provider-key-${requestId}.bin`, {
        type: 'application/octet-stream',
        lastModified: Date.now()
      });

      const upload = await pinata.upload.public.file(file);
      storageLocation = `ipfs:${upload.cid}`;

    }

    // 5. Submit approval to HCS
    const approvalMessage = JSON.stringify({
      type: 'access-approval',
      requestId,
      storageLocation,
      accessType,
      expirationTime: accessType === 'time-based' 
        ? new Date(Date.now() + duration * 1000).toISOString()
        : null,
      timestamp: new Date().toISOString()
    });

    const submitTx = await new TopicMessageSubmitTransaction()
      .setTopicId(config.hedera.hcsTopicId)
      .setMessage(approvalMessage)
      .execute(client);

    return NextResponse.json({
      success: true,
      transactionId: submitTx.transactionId.toString(),
      storageLocation
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Approval failed' },
      { status: 500 }
    );
  }
}

// 🟢 GET — Decrypt and Serve PDF (Provider)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metadataCid = searchParams.get('cid');
    const providerKey = searchParams.get('providerKey');
    const providerDID = searchParams.get('providerDID');
    
    if (!metadataCid || !providerKey || !providerDID) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 1. Verify access rights
    // For now, assuming access is granted if the encrypted key exists

    // 2. Get original metadata
    const metadataRes = await axios.get(`${config.pinata.gatewayUrl}${metadataCid}`);
    const metadata = metadataRes.data;

    // 3. Get provider-specific encrypted key
    const encryptedAesKey = Buffer.from(metadata.properties.encryptedAesKey, 'base64');
    const iv = Buffer.from(metadata.properties.iv, 'hex');
    const keyAuthTag = Buffer.from(metadata.properties.keyAuthTag, 'hex');

    // 4. Decrypt with provider's key
    const providerPubKey = PublicKey.fromString(providerKey);
    const sharedSecret = await computeHederaSharedSecret(patientPrivateKey, providerPubKey);
    
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

    const keyDecipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
    keyDecipher.setAuthTag(keyAuthTag);
    const aesKey = Buffer.concat([
      keyDecipher.update(encryptedAesKey),
      keyDecipher.final()
    ]);

    // 5. Fetch and decrypt file
    const fileRes = await axios.get(metadata.image, { responseType: 'arraybuffer' });
    const encryptedBuffer = Buffer.from(fileRes.data);
    const authTag = Buffer.from(metadata.properties.authTag, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

    return new NextResponse(decrypted, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="decrypted.pdf"',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}