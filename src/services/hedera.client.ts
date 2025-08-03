import { Client, Hbar, PrivateKey } from '@hashgraph/sdk';

import {config} from '@/config/config';

let client: any;

const hederaClient = () => {
  const operatorPrivateKey = PrivateKey.fromStringED25519(config.hedera.privateKey);
  const operatorAccount = config.hedera.accountId;
  return hederaClientLocal(operatorAccount, operatorPrivateKey);
};

const hederaClientLocal = (operatorAccount: string, operatorPrivateKey: PrivateKey) => {
  if (client) return client;
  switch (config.hedera.network.toUpperCase()) {
    case 'TESTNET':
      client = Client.forTestnet();
      break;
    case 'MAINNET':
      client = Client.forMainnet();
      break;
  }
  client.setOperator(operatorAccount, operatorPrivateKey);
  // Set the default maximum transaction fee (in Hbar)
  client.setDefaultMaxTransactionFee(new Hbar(5));

  // Set the maximum payment for queries (in Hbar)
  client.setMaxQueryPayment(new Hbar(50));
  return client;
};

export {
  hederaClient,
  hederaClientLocal,
};
