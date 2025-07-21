'use client';

import { useCallback, useEffect } from 'react';
import { getConnectedAccountIds, getInitPromise, getHashConnect } from './hashconnect';
import { useStore } from '@/store/store';

const HashConnectClient = () => {
  const { walletAddress, setWalletAddress } = useStore();
  const syncWithHashConnect = useCallback(async () => {
    const connectedAccountIds = await getConnectedAccountIds();
    if (connectedAccountIds.length > 0) {
      console.log('Connected Account IDs:', connectedAccountIds);
      setWalletAddress(connectedAccountIds[0].toString());
      // dispatch(setIsConnected(true));
      // dispatch(setPairingString(hc.pairingString ?? ''));
    } else {
      setWalletAddress('');
      // dispatch(setIsConnected(false));
      // dispatch(setPairingString(hc.pairingString ?? ''));
    }
  }, [setWalletAddress]);

  useEffect(() => {
    // syncWithHashConnect();
    // hcInitPromise.then(() => {
    //   syncWithHashConnect();
    // });
    // hc.pairingEvent.on(syncWithHashConnect);
    // hc.disconnectionEvent.on(() => {
    //   // dispatch(userLogout(''));
    //   setWalletAddress('');
    //   syncWithHashConnect();
    // });
    // hc.connectionStatusChangeEvent.on(syncWithHashConnect);
    let hc: any;

    (async () => {

      hc = await getHashConnect();
      await getInitPromise();
      syncWithHashConnect();

      hc.pairingEvent.on(syncWithHashConnect);
      hc.disconnectionEvent.on(() => {
        setWalletAddress('');
        syncWithHashConnect();
      });
      hc.connectionStatusChangeEvent.on(syncWithHashConnect);
    })();
  }, [syncWithHashConnect, setWalletAddress]);

  return null;
};

export default HashConnectClient;
