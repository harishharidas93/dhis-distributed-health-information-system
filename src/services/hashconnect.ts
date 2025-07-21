import { AccountId, LedgerId, Transaction } from '@hashgraph/sdk';
// import { HashConnect } from 'hashconnect';
// import axios from '../../api/axiosWithAuth';

// const appMetadata = {
//   name: 'Dgverse',
//   description: 'Mint and manage your certificates',
//   icons: ['https://www.hashpack.app/img/logo.svg'],
//   url: 'www.mint-bridgse.com',
// };

// const projectId = 'bfa190dbe93fcf30377b932b31129d05';

let hc: any = null;
let hcInitPromise: Promise<void> | null = null;

export const getHashConnect = async () => {
  if (!hc) {
    const { HashConnect } = await import('hashconnect'); // ✅ dynamic import

    const appMetadata = {
      name: 'Dgverse',
      description: 'Mint and manage your certificates',
      icons: ['https://www.hashpack.app/img/logo.svg'],
      url: typeof window !== 'undefined' ? window.location.hostname : '',
    };

    const projectId = 'bfa190dbe93fcf30377b932b31129d05';

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

// export const hc = new HashConnect(LedgerId.fromString('testnet'), projectId, appMetadata, true);
export const getConnectedAccountIds = async () => {
  console.log('Fetching connected account IDs...');
  await getHashConnect();
  return hc.connectedAccountIds;
};
// export const hcInitPromise = hc.init();

export const executeTransaction = async (accountIdForSigning: AccountId | string, trans: Transaction) => {
  // await hcInitPromise;
  // await getHashConnect();

  const accountIds = await getConnectedAccountIds();
  if (!accountIds) {
    throw new Error('No connected accounts');
  }

  const isAccountIdForSigningPaired = accountIds.some((id: any) => id.toString() === accountIdForSigning.toString());
  if (!isAccountIdForSigningPaired) {
    // await axios('/v1/auth/logout');
    hc.disconnect();
    window.location.href = '/';
    throw new Error(`Logging out due to inactivity`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await hc.sendTransaction(accountIdForSigning as any, trans as any);
  return result;
};
