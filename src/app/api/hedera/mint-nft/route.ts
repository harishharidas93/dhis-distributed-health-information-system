/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { TokenMintTransaction, AccountId, TransactionId } from '@hashgraph/sdk';

export async function POST(request: NextRequest) {
  try {
    const {nftDetails, collectionId, walletAddress} = await request.json(); 
  const metadatCid = nftDetails.map((nft: any) => Buffer.from(nft.metadata));
  const mintTx = new TokenMintTransaction().setTokenId(collectionId).setMetadata(metadatCid)
    .setTransactionId(TransactionId.generate(walletAddress))
    .setNodeAccountIds([new AccountId(3)])
    .freeze();

  return {
    status: 'success',
    transaction: mintTx.toBytes(),
  };
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to fetch Hedera NFTs',
        data: []
      },
      { status: 500 }
    );
  }
}