import { AccessRequestPayload } from "@/types/accessRequest";

export const useFetchAccessRequests = (userDid: string) => {
  return useQuery({
    queryKey: ['accessRequests', userDid],
    queryFn: () => fetchAccessRequests({ userDid }),
    enabled: !!userDid,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGrantAccessRequest = () => {
  return useMutation({
    mutationFn: grantAccessRequest,
  });
};

export const useRejectAccessRequest = () => {
  return useMutation({
    mutationFn: rejectAccessRequest,
  });
};
export async function fetchAccessRequests({ userDid }: { userDid: string; }) {
  const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.ACCESS_REQUESTS}?userDid=${encodeURIComponent(userDid)}`);
  return response.data;
}

export async function grantAccessRequest(payload: AccessRequestPayload) {
  const response = await apiClient.patch(API_CONFIG.ENDPOINTS.ACCESS_REQUESTS, payload);
  return response.data;
}

export async function rejectAccessRequest(payload: AccessRequestPayload) {
  const response = await apiClient.patch(API_CONFIG.ENDPOINTS.ACCESS_REQUESTS, payload);
  return response.data;
}

export const accessRequestByProvider = async (payload: any): Promise<any> => {
  const response = await apiClient.patch(API_CONFIG.ENDPOINTS.ACCESS_REQUESTS, payload);
  return response.data;
};

export const useAccessRequestByProvider = () => {
  return useMutation({
    mutationFn: accessRequestByProvider,
  });
};
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAPI, SignupPayload, SignupResponse, LoginPayload } from '@/lib/api/user';
// Login React Query Hook
export const useSignIn = () => {
  return useMutation<SignupResponse, unknown, LoginPayload>({
    mutationFn: userAPI.login,
  });
};
// Signup React Query Hook
export const useSignup = () => {
  return useMutation<SignupResponse, unknown, SignupPayload>({
    mutationFn: userAPI.signup,
  });
};
import { apiClient, API_CONFIG } from '@/lib/api';
import { Transaction } from '@hashgraph/sdk';
import { Buffer } from 'buffer';
import { executeTransaction } from './hashconnect';
import { toast } from '@/components/ui/use-toast';

// Types
export interface NFTData {
  name: string;
  description: string;
  collection?: string | null; // Optional collection object
  image?: File;
  walletAddress: string;
  metadataCid: string;
  timestamp: string;
}

export interface MedicalRecord {
  name: string;
  description: string;
  collection?: string | null; // Optional collection object
  document?: File;
}

export interface CollectionData {
  name: string;
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
  collection?: string | null;
  imageUrl?: string;
  transactionHash?: string;
  deleted: boolean;
  createdAt: string;
  token_id?: string;
}

export interface CollectionResponse {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  imageUrl: string;
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
  MEDICAL_RECORDS: 'medicalRecords',
} as const;

// API Functions
export const nftAPI = {
  // Mint NFT
  mintNFT: async (nftData: NFTData): Promise<{ serial: string; nftReceipt: any }> => {
    const formData = new FormData();
    formData.append('name', nftData.name);
    formData.append('description', nftData.description);
    formData.append('walletAddress', nftData.walletAddress);
    formData.append('timestamp', nftData.timestamp);
    formData.append('metadataCid', nftData.metadataCid);
    if (nftData.collection) {
      formData.append('collectionId', nftData.collection);
      // formData.append('collectionName', nftData.collection.name);
    }

    const response = await apiClient.put(API_CONFIG.ENDPOINTS.MINT_NFT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const transaction = Transaction.fromBytes(Buffer.from(response.data.transaction, 'hex'));
    toast({ title: 'Minting NFT...', description: 'Please sign the mint transaction in your wallet.' });
    const nftReceipt = await executeTransaction(nftData.walletAddress, transaction);
    if (nftReceipt?.status?.toString() !== 'SUCCESS') {
      throw new Error(nftReceipt.error?.response?.data?.message || nftReceipt.error?.message || 'Error occurred while minting NFT');
    }
    const serialNumbers = nftReceipt.serials?.map((serial: { toString: () => any }) => serial.toString()) || [];
    const serial = serialNumbers[0];
    toast({ title: 'NFT minted successfully! 🎉', description: `NFT #${serial} minted.` });
    return { serial, nftReceipt };
  },
  uploadMedicalRecord: async (medicalRecord: MedicalRecord): Promise<{ metadataCid: string; fileCid: any }> => {
    const formData = new FormData();
    formData.append('name', medicalRecord.name);
    formData.append('description', medicalRecord.description);
    if (medicalRecord.collection) {
      formData.append('collectionId', medicalRecord.collection);
      // formData.append('collectionName', medicalRecord.collection.name);
    }
    if (medicalRecord.document) {
      formData.append('document', medicalRecord.document);
    }

    const response = await apiClient.put(API_CONFIG.ENDPOINTS.UPLOAD_MEDICAL_RECORD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // const transaction = Transaction.fromBytes(Buffer.from(response.data.transaction, 'hex'));
    // toast({ title: 'Minting NFT...', description: 'Please sign the mint transaction in your wallet.' });
    // const nftReceipt = await executeTransaction(nftData.walletAddress, transaction);
    // if (nftReceipt?.status?.toString() !== 'SUCCESS') {
    //   throw new Error(nftReceipt.error?.response?.data?.message || nftReceipt.error?.message || 'Error occurred while minting NFT');
    // }
    // const serialNumbers = nftReceipt.serials?.map((serial: { toString: () => any }) => serial.toString()) || [];
    // const serial = serialNumbers[0];
    // toast({ title: 'NFT minted successfully! 🎉', description: `NFT #${serial} minted.` });
    // return { serial, nftReceipt };
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
  createCollection: async (collectionData: CollectionData): Promise<{ collectionId: string; receipt: any }> => {
    const formData = new FormData();
    formData.append('name', collectionData.name);
    formData.append('walletAddress', collectionData.walletAddress);
    formData.append('timestamp', collectionData.timestamp);

    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CREATE_COLLECTION, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const transaction = Transaction.fromBytes(Buffer.from(response.data.transaction, 'hex'));
    toast({ title: 'Creating collection...', description: 'Please sign the transaction in your wallet.' });
    const receipt = await executeTransaction(collectionData.walletAddress, transaction);
    if (receipt.status.toString() !== 'SUCCESS') {
      throw new Error(receipt.error?.response?.data?.message || receipt.error?.message || 'Error occurred while creating collection');
    }
    const collectionId = receipt.tokenId?.toString() ?? '';
    toast({ title: 'Collection created!', description: `Collection ID: ${collectionId}` });
    return { collectionId, receipt };
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
    },
  });
};

export const useUploadMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: nftAPI.uploadMedicalRecord,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data, variables) => {
      // Invalidate and refetch medical records
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEDICAL_RECORDS] });
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

// Hospital Dashboard Queries
export const useHospitalDashboardQueries = (hospitalDid: string) => {
  // Single query for access requests
  const { data: accessRequestsData = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['hospitalAccessRequests', hospitalDid],
    queryFn: () => fetchAccessRequests({ userDid: hospitalDid }),
    enabled: !!hospitalDid,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Calculate derived values
  const pendingRequestsCount = accessRequestsData?.filter((req: any) => req.status === 'pending').length || 0;
  const approvedRequestsCount = accessRequestsData?.filter((req: any) => req.status === 'approved').length || 0;
  const rejectedRequestsCount = accessRequestsData?.filter((req: any) => req.status === 'rejected').length || 0;
  const totalRequestsCount = accessRequestsData?.length || 0;

  return {
    accessRequestsData,
    pendingRequestsCount,
    approvedRequestsCount,
    rejectedRequestsCount,
    totalRequestsCount,
    isLoading,
    isError,
    refetch
  };
};
