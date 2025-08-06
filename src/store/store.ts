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


import type { NFTResponse } from '@/services/user.service';

interface StoreState {
  user: User | null;
  walletAddress: string;
  accessToken: string;
  nfts: NFTResponse[];
  nftCount: number;
  collection: string | null;
  setWalletAddress: (address: string) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string) => void;
  setNFTs: (nfts: NFTResponse[]) => void;
  setNFTCount: (count: number) => void;
  setCollection: (collection: string | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      walletAddress: '',
      accessToken: '',
      nfts: [],
      nftCount: 0,
      collection: null,
      setWalletAddress: (address: string) => set({ walletAddress: address }),
      setUser: (user: User | null) => set({ user }),
      setAccessToken: (token: string) => set({ accessToken: token }),
      setNFTs: (nfts: NFTResponse[]) => set({ nfts }),
      setNFTCount: (count: number) => set({ nftCount: count }),
      setCollection: (collection: string | null) => set({ collection }),
    }),
    {
      name: 'mint-bridge-store', // localStorage key
    }
  )
);
