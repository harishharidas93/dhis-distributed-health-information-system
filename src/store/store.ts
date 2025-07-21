import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  user: any;
  walletAddress: string;
  accessToken: string;
  blockchainType: string;
  setWalletAddress: (address: string) => void;
  setUser: (user: any) => void;
  setAccessToken: (token: string) => void;
  setBlockchainType: (type: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      walletAddress: '',
      accessToken: '',
      blockchainType: '',
      setWalletAddress: (address) => set({ walletAddress: address }),
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setBlockchainType: (type) => set({ blockchainType: type }),
    }),
    {
      name: 'mint-bridge-store', // localStorage key
    }
  )
);
