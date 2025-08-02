/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PinataSDK } from 'pinata';
import { config } from '@/config/config';
import imageProcessor from '@/utils/imageProcessor';
import crypto from 'crypto';
import fs from 'fs';
import { Readable } from 'stream';

// Setup
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

const bufferToStream = (buffer: Buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// 🟢 PUT — Encrypt and Upload
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
    const fileBuffer = Buffer.from(arrayBuffer);
    const checksum = imageProcessor.generateChecksum(fileBuffer);

    const publicKey = fs.readFileSync('public.pem', 'utf-8');
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    const encryptedData = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const encryptedAesKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      aesKey
    );

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
            checksum: checksum,
            type: 'application/octet-stream',
        })

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
      },
    };

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

// 🟢 GET — Decrypt and Serve PDF
export async function GET() {
  try {
    // Replace with actual metadata CID
    const metadataCid = "bafkreibxponbwspacls5faxispafx7chircsde7ayyoi3pdv5abmiilppi"; // replace manually or from request param
    const privateKeyPem = fs.readFileSync('private.pem', 'utf-8');

    // Fetch metadata JSON
    const metadataRes = await axios.get(`${config.pinata.gatewayUrl}${metadataCid}`);
    const metadata = metadataRes.data;

    const iv = Buffer.from(metadata.properties.iv, 'hex');
    const authTag = Buffer.from(metadata.properties.authTag, 'hex');
    const encryptedAesKey = Buffer.from(metadata.properties.encryptedAesKey, 'base64');

    const aesKey = crypto.privateDecrypt(
      {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      encryptedAesKey
    );

    // Fetch encrypted file
    const fileRes = await axios.get(metadata.image, { responseType: 'arraybuffer' });
    const encryptedBuffer = Buffer.from(fileRes.data);

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
