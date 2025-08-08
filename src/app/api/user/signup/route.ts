import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { addUser, getAllUsers } from '@/services/lowdb.service';
import imageProcesser from '@/utils/imageProcessor';
import { TopicCreateTransaction, TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import crypto from 'crypto';
import { hederaClient } from '@/services/hedera.client';
import {config} from '@/config/config';

const client = hederaClient();

type User = {
  id: string;
  institutionId?: string;
  institutionName?: string;
  patientName?: string;
  walletAddress: string;
  did: string;
  salt: Buffer;
  type: 'hospital' | 'patient';
  createdAt: string;
};

export async function POST(req: NextRequest) {
  const data = await req.json();

  const allUsers = getAllUsers();
  const existingUser = allUsers.find(
    (u) => u.walletAddress === data.walletAddress
  );
  if (existingUser) {
    return NextResponse.json({
      error: `A ${data.type === 'hospital' ? 'hospital' : 'patient'} with this wallet address is already registered.`
    }, { status: 409 });
  }
  const now = new Date().toISOString();

  const txResponse = await new TopicCreateTransaction().execute(client);
  const receipt = await txResponse.getReceipt(client);
  const topicId = receipt.topicId?.toString();

  const salt = crypto.randomBytes(16); // ⚠️ Save this for future use
  const privateKey = imageProcesser.deriveHederaPrivateKey(data.privateKey, salt);
  const pubKey = privateKey.publicKey.toStringDer();
  const did = `did:hedera:${config.hedera.network}:${imageProcesser.encodeBs58(`${pubKey}${topicId}`)}_${topicId}`;
  const didDocument = {
      '@context': 'https://www.w3.org/ns/did/v1',
        id: did,
        verificationMethod: [
        {
            id: `${did}#did-root-key`,
            type: 'Ed25519VerificationKey2018',
            controller: did,
            publicKeyBase58: imageProcesser.encodeBs58(pubKey),
        },
        ],
        assertionMethod: [`${did}#did-root-key`],
        authentication: [`${did}#did-root-key`],
    };

    const message = {
        operation: 'create',
        did,
        event: imageProcesser.encodeJsonToBase64(didDocument),
        timestamp: new Date().toISOString(),
    };

    const messageDocument = {
        message,
        signature: imageProcesser.signJsonWithPrivateKey(privateKey, message.event),
    };
    // create document and add to HCS
    await new TopicMessageSubmitTransaction({
        topicId,
        message: JSON.stringify(messageDocument, null, 2),
    }).execute(client);

  const user: User = {
    id: uuid(),
    institutionId: data.institutionId,
    institutionName: data.institutionName,
    patientName: data.patientName,
    walletAddress: data.walletAddress,
    type: data.type,
    createdAt: now,
    did,
    salt,
  };
  const newUser = await addUser(user);
  return NextResponse.json(newUser);
}
