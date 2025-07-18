import { Client, PrivateKey, AccountId } from '@hashgraph/sdk';
import { config } from '@/config/config';

let client: Client | null = null;

export function hederaClient(): Client {
  if (client) {
    return client;
  }

  try {
    // Create client based on network
    if (config.hedera.network === 'testnet') {
      client = Client.forTestnet();
    } else if (config.hedera.network === 'mainnet') {
      client = Client.forMainnet();
    } else {
      // Default to testnet
      client = Client.forTestnet();
    }

    // Set operator if we have account ID and private key
    if (config.hedera.accountId && config.hedera.privateKey) {
      const operatorId = AccountId.fromString(config.hedera.accountId);
      const operatorKey = PrivateKey.fromString(config.hedera.privateKey);
      
      client.setOperator(operatorId, operatorKey);
    }

    return client;
  } catch (error) {
    console.error('Failed to create Hedera client:', error);
    // Return a basic testnet client as fallback
    return Client.forTestnet();
  }
}

export function closeClient(): void {
  if (client) {
    client.close();
    client = null;
  }
}
