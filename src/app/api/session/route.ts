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
const patientPublicKey = PublicKey.fromStringECDSA(PATIENT_PUBLIC_KEY_HEX);
const patientPrivateKey = PrivateKey.fromStringECDSA(PATIENT_PRIVATE_KEY_HEX);

// Initialize Hedera client
// let hederaClient: Client | null = null;
// async function getHederaClient() {
//   if (!hederaClient) {
//     hederaClient = Client.forName(config.hedera.network);
//     hederaClient.setOperator(
//       config.hedera.accountId, 
//       PrivateKey.fromStringECDSA(config.hedera.privateKey)
//     );
//   }
//   return hederaClient;
// }

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

// 🟢 GET — Decrypt and Serve PDF (Provider)
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { metadataCid, providerKey, providerDID, patientPrivateKey: patientPrivateKeyHex } = payload;
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
    const providerPubKey = PublicKey.fromStringECDSA(providerKey);
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