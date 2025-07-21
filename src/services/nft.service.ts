import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_CONFIG } from '@/lib/api';
import { Transaction } from '@hashgraph/sdk';
import { Buffer } from 'buffer';
import { executeTransaction } from './hashconnect';

// Types
export interface NFTData {
  name: string;
  description: string;
  blockchain: string;
  collection?: { id: string; name: string } | null; // Optional collection object
  image?: File;
  walletAddress: string;
  timestamp: string;
}

export interface CollectionData {
  name: string;
  description: string;
  blockchain: string;
  image?: File;
  walletAddress: string;
  timestamp: string;
}

export interface TransactionData {
  id: string;
  data: string;
  gasEstimate: string;
  blockchain: string;
}

export interface NFTResponse {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  collection: string;
  imageUrl: string;
  image?: string; // For backward compatibility with UI
  chain?: string; // For backward compatibility with UI
  transactionHash: string;
  deleted: boolean;
  createdAt: string;
}

export interface CollectionResponse {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  imageUrl: string;
  image?: string; // For backward compatibility with UI
  chain?: string; // For backward compatibility with UI
  nftCount: number;
  transactionHash: string;
  createdAt: string;
}

// Query Keys
export const QUERY_KEYS = {
  NFTS: 'nfts',
  NFT: 'nft',
  COLLECTIONS: 'collections',
  COLLECTION: 'collection',
  TRANSACTION_STATUS: 'transactionStatus',
} as const;

// API Functions
export const nftAPI = {
  // Mint NFT
  mintNFT: async (nftData: NFTData): Promise<NFTResponse> => {
    const formData = new FormData();
    formData.append('name', nftData.name);
    formData.append('description', nftData.description);
    formData.append('blockchain', nftData.blockchain);
    formData.append('walletAddress', nftData.walletAddress);
    formData.append('timestamp', nftData.timestamp);
    console.log(nftData.collection);
    if (nftData.collection) {
      formData.append('collectionId', nftData.collection.id);
      formData.append('collectionName', nftData.collection.name);
    }
    
    if (nftData.image) {
      formData.append('image', nftData.image);
    }

    const response = await apiClient.put(API_CONFIG.ENDPOINTS.MINT_NFT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const transaction = Transaction.fromBytes(Buffer.from(response.data.transaction, 'hex'))
    await executeTransaction(nftData.walletAddress, transaction);
    return response.data;
  },

  // Get user's NFTs
  getUserNFTs: async (walletAddress: string): Promise<NFTResponse[]> => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.GET_NFTS}?walletAddress=${walletAddress}`);
    return response.data;
  },

  // Get NFT by ID
  getNFTById: async (nftId: string): Promise<NFTResponse> => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.GET_NFT_BY_ID}/${nftId}`);
    return response.data;
  },

  // Create Collection
  createCollection: async (collectionData: CollectionData): Promise<CollectionResponse> => {
    const formData = new FormData();
    formData.append('name', collectionData.name);
    formData.append('description', collectionData.description);
    formData.append('blockchain', collectionData.blockchain);
    formData.append('walletAddress', collectionData.walletAddress);
    formData.append('timestamp', collectionData.timestamp);
    
    if (collectionData.image) {
      formData.append('image', collectionData.image);
    }

    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CREATE_COLLECTION, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // API now returns the collection object directly
    // Submitting and signing
    const transaction = Transaction.fromBytes(Buffer.from(response.data.transaction, 'hex'))
    await executeTransaction(collectionData.walletAddress, transaction);
    return response.data;
  },

  // Get user's collections
  getUserCollections: async (walletAddress: string): Promise<CollectionResponse[]> => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.GET_COLLECTIONS}?walletAddress=${walletAddress}`);
    return response.data;
  },

  // Submit transaction (combines sign and submit)
  submitTransaction: async (transactionData: any): Promise<any> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.SUBMIT_TRANSACTION, transactionData);
    return response.data;
  },
};

// React Query Hooks
export const useNFTs = (walletAddress: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NFTS, walletAddress],
    queryFn: () => nftAPI.getUserNFTs(walletAddress),
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useNFT = (nftId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NFT, nftId],
    queryFn: () => nftAPI.getNFTById(nftId),
    enabled: !!nftId,
  });
};

export const useCollections = (walletAddress: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COLLECTIONS, walletAddress],
    queryFn: () => nftAPI.getUserCollections(walletAddress),
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useMintNFT = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: nftAPI.mintNFT,
    onSuccess: (data, variables) => {
      // Invalidate and refetch NFTs and collections
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NFTS, variables.walletAddress] });
      if (variables.collection) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLLECTIONS, variables.walletAddress] });
      }
    },
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: nftAPI.createCollection,
    onSuccess: (data, variables) => {
      // Invalidate and refetch collections
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLLECTIONS, variables.walletAddress] });
    },
  });
};

export const useSubmitTransaction = () => {
  return useMutation({
    mutationFn: nftAPI.submitTransaction,
  });
};

// Simplified hook for backward compatibility
export const useSignTransaction = () => {
  return useMutation({
    mutationFn: nftAPI.submitTransaction, // Using submit transaction as it handles the full flow
  });
};
