/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PinataSDK } from 'pinata';
import { config } from '@/config/config';
import imageProcessor from '@/utils/imageProcessor';
import crypto from 'crypto';
import { PublicKey, PrivateKey, Client, TopicMessageSubmitTransaction, FileCreateTransaction, Hbar, FileContentsQuery } from '@hashgraph/sdk';
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

// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// 🟢 GET — Decrypt and Serve PDF (Provider)
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { metadataCid, providerKey, providerDID, patientPrivateKey: patientPrivateKeyHex } = payload;

    const {nftId, recordDetails, passkey, patientDetails} = payload;

    const institutionDetails = getUserById(payload.institutionDetails.id);
    if (!institutionDetails) {
      return NextResponse.json(
        { error: 'Invalid institution ID' },
        { status: 400 }
      );
    }

    // if (!metadataCid || !providerKey || !providerDID) {
    //   return NextResponse.json(
    //     { error: 'Missing required parameters' },
    //     { status: 400 }
    //   );
    // }

    // let nftDetails;
    // try {
    //   nftDetails = await mirrorNode.fetchNFTInfo(nftId);
    // } catch (err) {
    //   console.error('Failed to fetch NFT details:', err);
    //   return NextResponse.json({ error: 'Failed to fetch NFT details' }, { status: 500 });
    // }

    // 2. Get metadata CID from NFT details
    // let metadataCid;
    // if (nftDetails && nftDetails.metadata) {
    //   try {
    //     metadataCid = Buffer.from(nftDetails.metadata, 'base64').toString('utf-8');
    //   } catch (err) {
    //     console.error('Invalid NFT metadata encoding:', err);
    //     return NextResponse.json({ error: 'Invalid NFT metadata encoding' }, { status: 500 });
    //   }
    // } else {
    //   return NextResponse.json({ error: 'NFT metadata not found' }, { status: 404 });
    // }

    // 3. Fetch metadata JSON from Pinata/IPFS
    let metadata;
    try {
      const metaRes = await axios.get(`${config.pinata.gatewayUrl}${recordDetails.metadataCid}`);
      metadata = metaRes.data;
    } catch (err) {
      console.error('Failed to fetch NFT metadata JSON:', err);
      return NextResponse.json({ error: 'Failed to fetch NFT metadata JSON' }, { status: 500 });
    }
    // get metadata cid from nft
    // provider key - passkey from prompt
    // provider did from instution details
    // patient private key no chance to get

    // 1. Verify access rights
    // For now, assuming access is granted if the encrypted key exists

    // 2. Get original metadata
    // const metadataRes = await axios.get(`${config.pinata.gatewayUrl}${metadataCid}`);
    // const metadata = metadataRes.data;

    // 3. Get provider-specific encrypted key
    // get file id from 
    const query = new FileContentsQuery()
      .setFileId(payload.aesLockLocation.replace('hfs:', ''));

    //Sign with client operator private key and submit the query to a Hedera network
    const encryptedAesKey = await query.execute(client);

    // console.log(contents.toString());
    // const encryptedAesKey = Buffer.from(metadata.properties.encryptedAesKey, 'base64');
    const iv = Buffer.from(payload.aesIv.data);
    const keyAuthTag = Buffer.from(payload.providerAuthTag.data);

    // // 4. Decrypt with provider's key - here it should be prov, private key and patient private key
    const patientPublicKey = imageProcessor.getPublicKeyFromDID(patientDetails.did);
    if (!patientPublicKey) {
      return NextResponse.json({ error: 'Invalid patient DID format' }, { status: 400 });
    }

    const salt = institutionDetails.salt;
    const saltBuffer = Buffer.from(salt.data);
    const providerPrivateKey = imageProcessor.deriveHederaPrivateKey(passkey, saltBuffer);
    
    const sharedSecret = await imageProcessor.computeHederaSharedSecret(providerPrivateKey, patientPublicKey);
    
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

    // const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(payload.aesKey.data), iv);
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