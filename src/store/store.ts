import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  user: any;
  walletAddress: string;
  accessToken: string;
  setWalletAddress: (address: string) => void;
  setUser: (user: any) => void;
  setAccessToken: (token: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      walletAddress: '',
      accessToken: '',
      setWalletAddress: (address) => set({ walletAddress: address }),
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
    }),
    {
      name: 'mint-bridge-store', // localStorage key
    }
  )
);
