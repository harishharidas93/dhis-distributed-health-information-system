import axios from 'axios';
import {config} from '@/config/config';
import { splitcertificateId } from '../utils/nftUtil';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // This bypasses SSL certificate validation
});

const axiosInstance = axios.create({
  baseURL: config.hedera.mirrorNodeUrl,
  httpsAgent: httpsAgent,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; NFT-API/1.0)',
  }
});

async function fetchAccountInfo(accountId: string) {
  if (config.api.mockApiCalls) {
    return {
      account: accountId,
      key: { key: "302a300506032b65700321004f8b8c0d8b6b2d5f7e3a9c1b8d4e6f2a5c7e9b3d1f4a6c8e0b2d5f7a9c1b3e5f7" }
    };
  }
  const { data } = await axiosInstance.get(`/accounts/${accountId}`);
  return data;
}

async function fetchTokenInfo(collectionId: string) {
  if (config.api.mockApiCalls) {
    return {
      token_id: collectionId,
      name: "Mock Collection",
      symbol: "MOCK",
      total_supply: 100,
      deleted: false,
      treasury_account_id: "0.0.6359539"
    };
  }
  try {
    const { data } = await axiosInstance.get(`/tokens/${collectionId}`);
    return data;
  } catch (e: any) {
    console.error('Error fetching token info:', e); 
    return null;
  }
}

async function fetchNFTInfo(certificateId: string) {
  if (config.api.mockApiCalls) {
    return {
      token_id: "0.0.1234567",
      serial_number: 1,
      owner_account_id: "0.0.6359539",
      metadata: "mocked-metadata"
    };
  }
  const { tokenId: collectionId, serialNumber } = splitcertificateId(certificateId);
  const { data } = await axiosInstance.get(`/tokens/${collectionId}/nfts/${serialNumber}`);
  return data;
}

async function fetchNftTransactions(certificateId: string, nextLink?: string): Promise<any[]> {
  if (config.api.mockApiCalls) {
        return [
      { transaction_id: "0.0.1-1234567890-000000001", type: "TRANSFER", status: "SUCCESS" }
    ];
  }
  const { tokenId: collectionId, serialNumber } = splitcertificateId(certificateId);
  // Fetch data from the API
  const { data } = await axiosInstance.get(
    nextLink ? nextLink : `/tokens/${collectionId}/nfts/${serialNumber}/transactions`
  );

  let { transactions } = data;
  const nextPage = data.links?.next;

  // If there's more data, recursively fetch and merge
  if (nextPage) {
    const nextTransactions = await fetchNftTransactions(certificateId, nextPage);
    transactions = transactions.concat(nextTransactions);
  }

  return transactions;
}

async function fetchAllNFTs(accountId: string, collectionId?: string, nextLink?: string): Promise<any[]> {
  if (config.api.mockApiCalls) {
    return [
      { token_id: collectionId, serial_number: 1, owner_account_id: accountId, metadata: "mocked-metadata" }
    ];
  }
  const { data } = await axiosInstance.get(
    nextLink ? nextLink : `/accounts/${accountId}/nfts?${collectionId ? `token.id=${collectionId}&` : ''}`
  );

  // eslint-disable-next-line no-param-reassign
  nextLink = undefined;

  let { nfts } = data;

  if (data.links.next) {
    // eslint-disable-next-line no-param-reassign
    nextLink = data.links.next;
  }

  if (nextLink) {
    const nextLinkNfts = await fetchAllNFTs(accountId, collectionId, nextLink.replace('/api/v1', ''));

    nfts = [...nfts, ...nextLinkNfts];
  }

  return nfts;
}

const exportedFunctions = {
  fetchAccountInfo,
  fetchTokenInfo,
  fetchNFTInfo,
  fetchNftTransactions,
  fetchAllNFTs,
};

export default exportedFunctions;
