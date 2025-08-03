import crypto from 'crypto';
import { PrivateKey } from '@hashgraph/sdk';
import { WithImplicitCoercion } from 'buffer';
import bs58 from 'bs58';

const generateChecksum = (buffer: any) => crypto.createHash('sha256').update(buffer).digest('hex');

const deriveHederaPrivateKey = (password: string, salt: Buffer): PrivateKey => {
  const derivedSeed = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  return PrivateKey.fromBytesED25519(derivedSeed);
};

/**
 * Signs a JSON object with a private key.
 * @param {any} privateKey - The private key to sign the message with.
 * @param {any} messageJson - The JSON object to sign.
 * @returns {string} - The base64 encoded signature of the signed message.
 */
const signJsonWithPrivateKey = (privateKey: any, messageJson: any) => {
  const minifiedJson = JSON.stringify(messageJson);
  const messageBytes = Buffer.from(minifiedJson);
  const signature = privateKey.sign(messageBytes);
  const base64Signature = Buffer.from(signature).toString('base64');

  return base64Signature;
};

const encodeBs58 = (subject: any) => {
  const bytes = Buffer.from(subject);
  const encoded = bs58.encode(bytes);
  return encoded;
};

const decodeFromBase58 = (base58String: string) => {
  const buffer = bs58.decode(base58String);
  return Buffer.from(buffer).toString();
};

const encodeJsonToBase64 = (jsonObj: any) => {
  const jsonString = JSON.stringify(jsonObj);
  const base64Encoded = Buffer.from(jsonString).toString('base64');
  return base64Encoded;
};

const decodeBase64 = (base64String: WithImplicitCoercion<string>) => {
  return Buffer.from(base64String, 'base64').toString('utf-8');
};

export default {
  generateChecksum,
  deriveHederaPrivateKey,
  signJsonWithPrivateKey,
  encodeBs58,
  decodeFromBase58,
  encodeJsonToBase64,
  decodeBase64,
};
