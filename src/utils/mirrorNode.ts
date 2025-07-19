/* eslint-disable */
import axios from 'axios';
import { AccountInfoQuery } from '@hashgraph/sdk';
import { hederaClient } from '../services/hedera.client';
import {config} from '@/config/config';
import { splitcertificateId } from '../utils/nftUtil';
import https from 'https';

const client = hederaClient();

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
  const { data } = await axiosInstance.get(`/accounts/${accountId}`);
  return data;
}

async function fetchTokenInfo(collectionId: string) {
  try {
    const { data } = await axiosInstance.get(`/tokens/${collectionId}`);
    return data;
  } catch (e) {
    return null;
  }
}

async function fetchNFTInfo(certificateId: string) {
  const { tokenId: collectionId, serialNumber } = splitcertificateId(certificateId);
  const { data } = await axiosInstance.get(`/tokens/${collectionId}/nfts/${serialNumber}`);
  return data;
}

async function fetchNftTransactions(certificateId: string, nextLink?: string): Promise<any[]> {
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

async function fetchAccountTokenRelations(collectionId: string, accountId: string) {
  const info = await new AccountInfoQuery().setAccountId(accountId).execute(client);
  const tokenInfo: any = {};
  let matchFound = false;
  // eslint-disable-next-line no-restricted-syntax, no-unused-vars
  for (const [token, relationship] of info.tokenRelationships.__map.entries()) {
    if (token.toString() === collectionId) {
      matchFound = true;
      tokenInfo.freeze_status = relationship.isFrozen ? 'FROZEN' : 'UNFROZEN';
      tokenInfo.kyc_status = relationship.isKycGranted ? 'NOT_APPLICABLE' : 'UNFROZEN';
    }
  }
  return matchFound ? tokenInfo : matchFound;
}

async function fetchAllNFTs(accountId: string, collectionId?: string, nextLink?: string): Promise<any[]> {
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
  fetchAccountTokenRelations,
  fetchAllNFTs,
};

export default exportedFunctions;
