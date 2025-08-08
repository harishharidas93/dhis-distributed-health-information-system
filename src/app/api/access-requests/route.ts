import { NextRequest, NextResponse } from 'next/server';
import mirrorNode from '@/utils/mirrorNode';
import axios from 'axios';
import { config } from '@/config/config';
import crypto from 'crypto';
import { FileCreateTransaction, PrivateKey, PublicKey, TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import { hederaClient } from '@/services/hedera.client';
import { getUserById } from '@/services/lowdb.service';
import imageProcessor from '@/utils/imageProcessor';
import { PinataSDK } from 'pinata';


const pinata = new PinataSDK({
  pinataJwt: config.pinata.jwt,
  pinataGateway: config.pinata.gatewayUrl,
});

const client = hederaClient();
// Helper to get topicId from userDid
function getTopicIdFromDid(did: string) {
  if (!did) return config.hedera.hcsTopicId;
  const didParts = did.split(/[:_]/);
  return didParts.length > 0 ? didParts[didParts.length - 1] : null;
}

function getStatusForType(type: string) {
    switch (type) {
        case 'access-request': return 'pending';
        case 'access-approval': return 'approved';
        case 'access-revoke': return 'revoked';
        case 'access-reject': return 'rejected';
        case 'access-timed-out': return 'expired';
        default: return 'unknown';
    }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userDid = searchParams.get('userDid');

    // Get topicId from userDid
    const topicId = getTopicIdFromDid(userDid as string);
    if (!topicId) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing userDid' },
        { status: 400 }
      );
    }
    const messages = await mirrorNode.fetchAllTopicMessages(topicId as string);

    const decoded = messages.map((msg: any) => {
      try {
        const jsonStr = Buffer.from(msg.message, 'base64').toString('utf-8');
        const data = JSON.parse(jsonStr);
        return { ...data, consensus_timestamp: msg.consensus_timestamp };
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Group and merge messages by requestId
    const requestMap = new Map<string, any>();
    for (const msg of decoded) {
      if (!msg.requestId) continue;
      msg.status = getStatusForType(msg.requestType);
      const existing = requestMap.get(msg.requestId);
      if (!existing) {
        requestMap.set(msg.requestId, msg);
      } else {
        // If requestType is different, combine and assign status based on latest
        if (existing.requestType !== msg.requestType) {
          // Merge fields, prefer latest
          const latest = existing.consensus_timestamp > msg.consensus_timestamp ? existing : msg;
          const combined = { ...existing, ...msg };
          combined.status = getStatusForType(latest.requestType);
          combined.consensus_timestamp = latest.consensus_timestamp;
          requestMap.set(msg.requestId, combined);
        } else {
          // If same requestType, keep the latest one
          const latest = existing.consensus_timestamp > msg.consensus_timestamp ? existing : msg;
          latest.status = getStatusForType(latest.requestType);
          requestMap.set(msg.requestId, latest);
        }
      }
    }

    // Filter by type if needed
    const result = Array.from(requestMap.values());
    const bypassList = ['2841eb51-873b-4936-b73c-873fab6706b0'];

    // Only include requests with requestedAt >= 2025-08-08T00:00:00.000Z
    const minDate = new Date('2025-08-07T16:30:00.000Z');
    const filtered = result.filter((msg: any) => {
      if (bypassList.includes(msg.requestId)) return false;
      if (!msg.requestedAt) return false;
      const reqDate = new Date(msg.requestedAt);
      return reqDate >= minDate;
    });
    // if (typeFilter === 'request') {
    //   result = result.filter((msg: any) => msg.requestType === 'access-request');
    // } else if (typeFilter === 'approval') {
    //   result = result.filter((msg: any) => msg.requestType === 'access-approval');
    // }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch topic messages' },
      { status: 500 }
    );
  }
}

async function computeHederaSharedSecret(privateKey: PrivateKey, publicKey: PublicKey): Promise<Buffer> {
  const ecdh = crypto.createECDH('secp256k1');
  ecdh.setPrivateKey(Buffer.from(privateKey.toBytesRaw()));
  return ecdh.computeSecret(Buffer.from(publicKey.toBytesRaw()));
}

export async function PATCH(request: NextRequest) {
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
      requestId: requestIdFromUI,
      requestType,
      passkey
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
    // 1. Fetch NFT details (from mirror node or your NFT API)
    let nftDetails;
    try {
      nftDetails = await mirrorNode.fetchNFTInfo(nftId);
    } catch (err) {
      console.error('Failed to fetch NFT details:', err);
      return NextResponse.json({ error: 'Failed to fetch NFT details' }, { status: 500 });
    }

    // 2. Get metadata CID from NFT details
    let metadataCid;
    if (nftDetails && nftDetails.metadata) {
      try {
        metadataCid = Buffer.from(nftDetails.metadata, 'base64').toString('utf-8');
      } catch (err) {
        console.error('Invalid NFT metadata encoding:', err);
        return NextResponse.json({ error: 'Invalid NFT metadata encoding' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'NFT metadata not found' }, { status: 404 });
    }

    // 3. Fetch metadata JSON from Pinata/IPFS
    let metadataJson;
    try {
      const metaRes = await axios.get(`${config.pinata.gatewayUrl}${metadataCid}`);
      metadataJson = metaRes.data;
    } catch (err) {
      console.error('Failed to fetch NFT metadata JSON:', err);
      return NextResponse.json({ error: 'Failed to fetch NFT metadata JSON' }, { status: 500 });
    }

    // 5. Get topic id from patientDID (last part after last colon or underscore)
    const patientTopicId = getTopicIdFromDid(userDetails.did);
    if (!patientTopicId) {
      return NextResponse.json({ error: 'Invalid patient DID format' }, { status: 400 });
    }

    let aesKeyToUnlock = null, storageLocation = null, aesIv = null, providerAuthTag = null;
    if (requestType === 'access-approval') {
      const iv = Buffer.from(metadataJson.properties.iv, 'hex');
      aesIv = iv;
      const authTag = Buffer.from(metadataJson.properties.authTag, 'hex');
      const encryptedAesKey = Buffer.from(metadataJson.properties.encryptedAesKey, 'base64');
      const ephemeralPublicKey = PublicKey.fromStringECDSA(metadataJson.properties.ephemeralPublicKey);
      const keyAuthTag = Buffer.from(metadataJson.properties.keyAuthTag, 'hex');
      
      const salt = userDetails.salt;
      const saltBuffer = Buffer.from(salt.data);
      const patientPrivateKey = imageProcessor.deriveHederaPrivateKey(passkey, saltBuffer);
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
      aesKeyToUnlock = Buffer.concat([
        keyDecipher.update(encryptedAesKey),
        keyDecipher.final()
      ]);

      const providerPublicKey = imageProcessor.getPublicKeyFromDID(institutionDetails.did);
      if (!providerPublicKey) {
        return NextResponse.json({ error: 'Invalid institution DID format' }, { status: 400 });
      }
      // // 3. Re-encrypt for provider
      const providerSharedSecret = await computeHederaSharedSecret(patientPrivateKey, providerPublicKey);
      
      const providerDerivedKey = Buffer.from( 
          crypto.hkdfSync(
          'sha256',
          providerSharedSecret,
          Buffer.from(''),
          Buffer.from(''),
          32
        )
      );
      
          const keyCipher = crypto.createCipheriv('aes-256-gcm', providerDerivedKey, iv);
          const encryptedForProvider = Buffer.concat([
            keyCipher.update(aesKeyToUnlock),
            keyCipher.final()
          ]);
          providerAuthTag = keyCipher.getAuthTag();

      // const file = new File([encryptedForProvider], `provider-key-${requestId}.bin`, {
      //   type: 'application/octet-stream',
      //   lastModified: Date.now()
      // });

      // const upload = await pinata.upload.public.file(file);
      // storageLocation = `ipfs:${upload.cid}`;
      const fileTx = await new FileCreateTransaction()
        .setContents(encryptedForProvider)
        .setKeys([PublicKey.fromStringECDSA(config.hedera.hfsKey.publicKey)])
        .freezeWith(client);
      const signTx = await fileTx.sign(PrivateKey.fromStringECDSA(config.hedera.hfsKey.privateKey));
      const submitTx = await signTx.execute(client);
      const receipt = await submitTx.getReceipt(client);
      storageLocation = `hfs:${receipt.fileId!.toString()}`;

    }

    const requestId = requestIdFromUI || crypto.randomUUID();
    // Submit to HCS
    const message = JSON.stringify({
      requestType,
      aesLockLocation: storageLocation,
      aesIv,
      providerAuthTag: providerAuthTag,
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
        name: metadataJson.name,
        description: metadataJson.description,
      }
    });

    await new TopicMessageSubmitTransaction()
      .setTopicId(patientTopicId)
      .setMessage(message)
      .execute(client);

    // Send to hospital topic (from institutionDetails.did)
    let hospitalTopicId = null;
    if (institutionDetails.did) {
      const instDidParts = institutionDetails.did.split(/[:_]/);
      if (instDidParts.length > 0) {
        hospitalTopicId = instDidParts[instDidParts.length - 1];
      }
    }
    if (hospitalTopicId) {
      await new TopicMessageSubmitTransaction()
        .setTopicId(hospitalTopicId)
        .setMessage(message)
        .execute(client);
    }

    return NextResponse.json({
      success: true,
      requestId,
      message
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    );
  }
}

