/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import mirrorNode from '@/utils/mirrorNode';
import axios from 'axios';
// import { TokenMintTransaction, TransactionId, AccountId } from '@hashgraph/sdk';
import { PinataSDK } from 'pinata';
import { config } from '@/config/config';
import imageProcessor from '@/utils/imageProcessor';
import crypto from 'crypto';
import fs from 'fs';
import { Readable } from 'stream';


// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

const pinata = new PinataSDK({
  pinataJwt: config.pinata.jwt,
  pinataGateway: config.pinata.gatewayUrl,
});

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

function bufferToStream(buffer: any) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function timestampToHuman(timestamp: string): string {
  const date = new Date(parseFloat(timestamp) * 1000);
  return date.toLocaleString();
}

export async function GET(request: NextRequest) {
  try {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${metadata.cid}`;
    const metadataRes = await axios.get(ipfsUrl, { responseType: 'arraybuffer' });
    const encryptedBuffer = Buffer.from(metadataRes.image);

    // 2. Decrypt AES key
    const encryptedAesKeyBuffer = Buffer.from(metadata.encryptedAesKey, 'base64');
    const aesKey = crypto.privateDecrypt(
      {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      encryptedAesKeyBuffer
    );

    // 3. Decrypt the file (PDF)
    const iv = Buffer.from(metadata.iv, 'hex');
    const authTag = Buffer.from(metadata.authTag, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
    decipher.setAuthTag(authTag);

    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);

    // 4. Return PDF to frontend
    return new NextResponse(decryptedBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="decrypted.pdf"',
      },
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to fetch Hedera NFT',
        data: []
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

function encryptFileAES(buffer: crypto.BinaryLike, aesKey = crypto.randomBytes(32)) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    aesKey: aesKey.toString('hex'),
  };
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

    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const publicKey = fs.readFileSync('public.pem', 'utf-8');
    const privateKey = fs.readFileSync('private.pem', 'utf-8');

    const originalImageChecksum = imageProcessor.generateChecksum(imageBuffer);
    const { encryptedData, iv, authTag, aesKey } = encryptFileAES(imageBuffer);

    const encryptedAesKey = crypto.publicEncrypt(publicKey, Buffer.from(aesKey, 'hex'));

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
            checksum: originalImageChecksum,
            type: 'application/octet-stream',
        })
        
    const metaData = {
          name: payload.name,
          description: payload.description,
          creator: payload.walletAddress,
          format: 'HIP412@2.0.0',
          image: `${config.pinata.gatewayUrl}${fileHash.cid}`,
          checksum: originalImageChecksum,
          type: 'application/octet-stream',
          files: [
            {
              checksum: originalImageChecksum,
              is_default_file: true,
              type: 'application/octet-stream',
              uri: `${config.pinata.gatewayUrl}${fileHash.cid}`,
            },
          ],
          properties: {
            collection_id: payload.collectionId,
            collection_name: payload.collectionName,
          },
        };
    
        const metadataUpload = await pinata.upload.public.json(metaData);
        const metadataCid = metadataUpload.cid;
    return NextResponse.json({
      fileHash: fileHash.cid,
      metadataCid,
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to fetch Hedera NFTs',
        data: []
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
