'use client';

import { useCallback, useEffect } from 'react';
import { getConnectedAccountIds, getInitPromise, getHashConnect } from './hashconnect';
import { useStore } from '@/store/store';

const HashConnectClient = () => {
  const { setWalletAddress } = useStore();
  const syncWithHashConnect = useCallback(async () => {
    const connectedAccountIds = await getConnectedAccountIds();
    if (connectedAccountIds.length > 0) {
      console.log('Connected Account IDs:', connectedAccountIds);
      setWalletAddress(connectedAccountIds[0].toString());
    } else {
      setWalletAddress('');
    }
  }, [setWalletAddress]);

  useEffect(() => {
    // Initialize HashConnect and sync with store
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
