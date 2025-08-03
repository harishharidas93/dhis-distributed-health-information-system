import { AccountId, LedgerId, Transaction } from '@hashgraph/sdk';

let hc: any = null;
let hcInitPromise: Promise<void> | null = null;

export const getHashConnect = async () => {
  if (!hc) {
    const { HashConnect } = await import('hashconnect'); // ✅ dynamic import

    const appMetadata = {
      name: 'Mint bridge',
      description: 'One minting platform, bridging across chains and wallets',
      icons: ['https://i.ibb.co/pvsCcrh3/mint-bridge-icon.png'],
      url: typeof window !== 'undefined' ? window.location.hostname : '',
    };

    const projectId = '6e0af2dc263d2c3e5add3544c2b5b5c2';

    hc = new HashConnect(
      LedgerId.fromString('testnet'),
      projectId,
      appMetadata,
      true
    );

    hcInitPromise = hc.init();
  }

  return hc;
};

export const getInitPromise = async () => {
  await getHashConnect();
  return hcInitPromise!;
};

export const getConnectedAccountIds = async () => {
  await getHashConnect();
  return hc.connectedAccountIds;
};

export const disconnectHashConnect = async () => {
  if (hc) {
    hc.disconnect();
    hc = null;
    hcInitPromise = null;
  }
};

export const executeTransaction = async (accountIdForSigning: AccountId | string, trans: Transaction) => {
  const accountIds = await getConnectedAccountIds();
  if (!accountIds) {
    throw new Error('No connected accounts');
  }

  const isAccountIdForSigningPaired = accountIds.some((id: any) => id.toString() === accountIdForSigning.toString());
  if (!isAccountIdForSigningPaired) {
    hc.disconnect();
    window.location.href = '/';
    throw new Error(`Logging out due to inactivity`);
  }

  const result = await hc.sendTransaction(accountIdForSigning as any, trans as any);
  return result;
};
