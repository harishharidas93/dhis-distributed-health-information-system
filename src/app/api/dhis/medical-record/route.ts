/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PinataSDK } from 'pinata';
import { config } from '@/config/config';
import imageProcessor from '@/utils/imageProcessor';
import crypto from 'crypto';
import { PublicKey, PrivateKey, Client, TopicMessageSubmitTransaction, FileCreateTransaction, Hbar } from '@hashgraph/sdk';
import mirrorNode from '@/utils/mirrorNode';
import { hederaClient } from '@/services/hedera.client';
import { getUserById } from '@/services/lowdb.service';

const client = hederaClient();
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
const patientPublicKey = PublicKey.fromStringECDSA(PATIENT_PUBLIC_KEY_HEX);
const patientPrivateKey = PrivateKey.fromStringECDSA(PATIENT_PRIVATE_KEY_HEX);

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

// 🟢 Verify Access Rights by Querying Mirror Node
async function verifyProviderAccess(providerDID: string, fileCid: string): Promise<boolean> {
  try {
    // 1. Get patient topic ID from DID
    const didParts = providerDID.split(/[:_]/);
    const patientTopicId = didParts[didParts.length - 1];
    
    if (!patientTopicId) {
      console.error('Invalid provider DID format');
      return false;
    }

    // 2. Query mirror node for messages
    const messages = await mirrorNode.fetchAllTopicMessages(patientTopicId);
    
    // 3. Find the most recent approval message for this file
    const approval = messages.reverse().find(msg => {
      try {
        const content = JSON.parse(msg.message);
        return content.type === 'access-approval' && 
               content.recordDetails?.metadataCid === fileCid;
      } catch {
        return false;
      }
    });

    if (!approval) {
      console.log('No approval found for file:', fileCid);
      return false;
    }

    const approvalData = JSON.parse(approval.message);
    
    // 4. Check expiration for time-based access
    if (approvalData.expirationTime) {
      const isValid = new Date(approvalData.expirationTime) > new Date();
      if (!isValid) console.log('Access has expired');
      return isValid;
    }

    // 5. Check usage count for single-use access
    if (approvalData.usageCount !== undefined) {
      const isValid = approvalData.usageCount > 0;
      if (!isValid) console.log('Access limit reached');
      return isValid;
    }

    return true;

  } catch (error) {
    console.error('Access verification failed:', error);
    return false;
  }
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
    const ephemeralKey = PrivateKey.generateED25519();
    const ephemeralPublicKey = ephemeralKey.publicKey;

    // Compute shared secret
    const sharedSecret = await computeHederaSharedSecret(ephemeralKey, patientPublicKey);
    
    // Derive encryption key
    const derivedKey = Buffer.from(
      crypto.hkdfSync(
        'sha256',
        sharedSecret,
        Buffer.from(''),
        Buffer.from(''),
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

    if (!payload.patientDID) {
      payload.patientDID = 'did:hedera:testnet:3AumERAwTJtNV23xW5mvaWJRFUBEk14X8dr3gQfGvpeXLBarYPXGnRPXDU7CgzdS1xR5UuvK3EPiG1DE1RZGhPGP8QUbMkLcSrLGLRv_0.0.6495109';
    }

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
    console.error('PUT /api/dhis/medical-record error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500, headers: corsHeaders }
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

    // 1. Verify access rights by querying mirror node
    const hasAccess = await verifyProviderAccess(providerDID, metadataCid);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access not granted or expired' },
        { status: 403 }
      );
    }

    // 2. Get original metadata
    const metadataRes = await axios.get(`${config.pinata.gatewayUrl}${metadataCid}`);
    const metadata = metadataRes.data;

    // 3. Get provider-specific encrypted key (from HCS approval message)
    const approval = await mirrorNode.findApprovalForFile(providerDID, metadataCid);
    if (!approval?.storageLocation) {
      return NextResponse.json(
        { error: 'No access key found' },
        { status: 404 }
      );
    }

    let encryptedForProvider: Buffer;
    if (approval.storageLocation.startsWith('hfs:')) {
      const fileId = approval.storageLocation.split(':')[1];
      encryptedForProvider = await mirrorNode.getFileContents(fileId);
    } else {
      const cid = approval.storageLocation.split(':')[1];
      const res = await axios.get(`${config.pinata.gatewayUrl}${cid}`, { 
        responseType: 'arraybuffer' 
      });
      encryptedForProvider = Buffer.from(res.data);
    }

    // 4. Decrypt with provider's key
    const iv = Buffer.from(metadata.properties.iv, 'hex');
    const providerPubKey = PublicKey.fromStringECDSA(providerKey);
    const sharedSecret = await computeHederaSharedSecret(patientPrivateKey, providerPubKey);
    
    const derivedKey = Buffer.from(
      crypto.hkdfSync(
        'sha256',
        sharedSecret,
        Buffer.from(''),
        Buffer.from(''),
        32
      )
    );

    const keyDecipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
    keyDecipher.setAuthTag(Buffer.from(metadata.properties.keyAuthTag, 'hex'));
    const aesKey = Buffer.concat([
      keyDecipher.update(encryptedForProvider),
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

// 🟢 POST — Request Access (Provider)
export async function POST(request: NextRequest) {
  try {
    const { 
      nftId,
      reason,
      accessType,
      requestedDuration,
      urgency,
      patientId,
      instituitionId,
      requestedAt,
      requestType,
    } = await request.json();
    
    if (!nftId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userDetails = getUserById(patientId);
    const institutionDetails = getUserById(instituitionId);
    if (!userDetails || !institutionDetails) {
      return NextResponse.json(
        { error: 'Invalid patient or institution ID' },
        { status: 400 }
      );
    }

    // 1. Fetch NFT details
    let nftDetails;
    try {
      nftDetails = await mirrorNode.fetchNFTInfo(nftId);
    } catch (err) {
      return NextResponse.json({ error: 'Failed to fetch NFT details' }, { status: 500 });
    }

    // 2. Get metadata CID from NFT details
    let metadataCid;
    if (nftDetails && nftDetails.metadata) {
      try {
        metadataCid = Buffer.from(nftDetails.metadata, 'base64').toString('utf-8');
      } catch (err) {
        return NextResponse.json({ error: 'Invalid NFT metadata encoding' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'NFT metadata not found' }, { status: 404 });
    }

    // 3. Get topic id from patientDID
    const didParts = userDetails.did.split(/[:_]/);
    const patientTopicId = didParts[didParts.length - 1];
    if (!patientTopicId) {
      return NextResponse.json({ error: 'Invalid patient DID format' }, { status: 400 });
    }

    const requestId = crypto.randomUUID();

    // Submit to HCS
    const message = JSON.stringify({
      requestType,
      urgency,
      requestedAt,
      requestId,
      patientDetails: {
        id: userDetails.id,
        name: userDetails.patientName,
        did: userDetails.did,
      },
      nftId,
      reason,
      accessType,
      requestedDuration,
      institutionDetails: {
        id: institutionDetails.id,
        name: institutionDetails.institutionName,
        did: institutionDetails.did,
      },
      recordDetails: {
        nftId,
        metadataCid,
        name: nftDetails.name,
        description: nftDetails.description,
      },
      timestamp: new Date().toISOString()
    });

    const submitTx = await new TopicMessageSubmitTransaction()
      .setTopicId(patientTopicId)
      .setMessage(message)
      .execute(client);

    return NextResponse.json({
      success: true,
      requestId,
      transactionId: submitTx.transactionId.toString(),
      message
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
      duration,
      providerDID
    } = await request.json();

    // 1. Get original encrypted file metadata
    const metadataRes = await axios.get(`${config.pinata.gatewayUrl}${fileCid}`);
    const metadata = metadataRes.data;

    // 2. Decrypt AES key
    const iv = Buffer.from(metadata.properties.iv, 'hex');
    const encryptedAesKey = Buffer.from(metadata.properties.encryptedAesKey, 'base64');
    const ephemeralPublicKey = PublicKey.fromStringECDSA(metadata.properties.ephemeralPublicKey);
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
    const providerPubKey = PublicKey.fromStringECDSA(providerPublicKey);
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
    let storageLocation;
    if (config.hedera.hfsKey) {
      const fileTx = await new FileCreateTransaction()
        .setContents(encryptedForProvider)
        .setKeys([PublicKey.fromStringECDSA(config.hedera.hfsKey.publicKey)])
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

    // 5. Get patient topic ID from DID
    const didParts = metadata.properties.patientDID.split(/[:_]/);
    const patientTopicId = didParts[didParts.length - 1];

    // 6. Submit approval to HCS
    const approvalMessage = JSON.stringify({
      type: 'access-approval',
      requestId,
      providerDID,
      fileCid,
      storageLocation,
      accessType,
      expirationTime: accessType === 'time-based' 
        ? new Date(Date.now() + duration * 1000).toISOString()
        : null,
      timestamp: new Date().toISOString()
    });

    const submitTx = await new TopicMessageSubmitTransaction()
      .setTopicId(patientTopicId)
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