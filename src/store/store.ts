import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  walletAddress: string;
  type: 'hospital' | 'patient';
  createdAt: string;
  did: string;
  institutionId?: string;
  institutionName?: string;
  patientName?: string;
}

interface StoreState {
  user: User | null;
  walletAddress: string;
  accessToken: string;
  setWalletAddress: (address: string) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      walletAddress: '',
      accessToken: '',
      setWalletAddress: (address: string) => set({ walletAddress: address }),
      setUser: (user: User | null) => set({ user }),
      setAccessToken: (token: string) => set({ accessToken: token }),
    }),
    {
      name: 'mint-bridge-store', // localStorage key
    }
  )
);
