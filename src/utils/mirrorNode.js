import { create } from 'axios';
import concat from 'lodash.concat';
import { AccountInfoQuery } from '@hashgraph/sdk';
import { hederaClient } from '../services/hedera.client';
import { mirrorNodeBaseUrl } from '../config/config';
import { splitcertificateId } from '../utils/nftUtil';

const client = hederaClient();

const instance = create({
  baseURL: mirrorNodeBaseUrl,
});

async function fetchAccountInfo(accountId) {
  const { data } = await instance.get(`/accounts/${accountId}`);
  return data;
}

async function fetchTokenInfo(collectionId) {
  try {
    const { data } = await instance.get(`/tokens/${collectionId}`);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
}

async function fetchNFTInfo(certificateId) {
  const { collectionId, serialNumber } = splitcertificateId(certificateId);
  const { data } = await instance.get(`/tokens/${collectionId}/nfts/${serialNumber}`);
  return data;
}

async function fetchNftTransactions(certificateId, nextLink) {
  const { collectionId, serialNumber } = splitcertificateId(certificateId);
  // Fetch data from the API
  const { data } = await instance.get(
    nextLink ? nextLink.split(`api/v1/`)[1] : `/tokens/${collectionId}/nfts/${serialNumber}/transactions`
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

async function fetchAccountTokenRelations(collectionId, accountId) {
  const info = await new AccountInfoQuery().setAccountId(accountId).execute(client);
  const tokenInfo = {};
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

async function fetchAllNFTs(accountId, collectionId, nextLink) {
  const { data } = await instance.get(
    nextLink ? nextLink.split(`api/v1/`)[1] : `/accounts/${accountId}/nfts?token.id=${collectionId}&order=asc`
  );

  // eslint-disable-next-line no-param-reassign
  nextLink = undefined;

  let { nfts } = data;

  if (data.links.next) {
    // eslint-disable-next-line no-param-reassign
    nextLink = data.links.next;
  }

  if (nextLink) {
    const nextLinkNfts = await fetchAllNFTs(accountId, collectionId, nextLink);

    nfts = concat(nfts, nextLinkNfts);
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