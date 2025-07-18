import { NextRequest, NextResponse } from 'next/server';
import { TokenType, PrivateKey, TokenMintTransaction, TransactionId, Timestamp, NftId, PublicKey, AccountId, TokenId, TokenCreateTransaction, TransferTransaction, TokenBurnTransaction, TokenWipeTransaction, TokenDeleteTransaction, TokenPauseTransaction, TokenUnpauseTransaction, TokenFreezeTransaction, TokenUnfreezeTransaction, TokenGrantKycTransaction, TokenRevokeKycTransaction, TokenAssociateTransaction, TokenDissociateTransaction, AccountAllowanceApproveTransaction, AccountAllowanceDeleteTransaction, TokenSupplyType } from '@hashgraph/sdk';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  serialNumber: number;
  chain: 'Hedera';
  status: 'Minted' | 'Pending' | 'Failed';
  collection?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  mintedAt: string;
  owner: string;
}

// Hardcoded Hedera NFT data (same as nfts route for consistency)
const HARDCODED_NFTS: NFT[] = [
  {
    id: "hedera_001",
    name: "Hedera Genesis #001",
    description: "First NFT in the Hedera Genesis collection",
    image: "🌟",
    tokenId: "0.0.1234567",
    serialNumber: 1,
    chain: "Hedera",
    status: "Minted",
    collection: "Genesis Collection",
    attributes: [
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Element", value: "Fire" },
      { trait_type: "Power", value: "95" }
    ],
    mintedAt: "2024-01-15T10:30:00Z",
    owner: "0.0.6359539"
  },
  {
    id: "hedera_002",
    name: "Hashgraph Warrior",
    description: "Powerful warrior from the Hashgraph realm",
    image: "⚔️",
    tokenId: "0.0.1234568",
    serialNumber: 1,
    chain: "Hedera",
    status: "Minted",
    attributes: [
      { trait_type: "Rarity", value: "Epic" },
      { trait_type: "Element", value: "Lightning" },
      { trait_type: "Power", value: "88" }
    ],
    mintedAt: "2024-01-16T14:20:00Z",
    owner: "0.0.6359539"
  },
  {
    id: "hedera_003",
    name: "DLT Crystal",
    description: "Mystical crystal containing DLT energy",
    image: "💎",
    tokenId: "0.0.1234569",
    serialNumber: 1,
    chain: "Hedera",
    status: "Pending",
    collection: "Crystal Series",
    attributes: [
      { trait_type: "Rarity", value: "Rare" },
      { trait_type: "Element", value: "Earth" },
      { trait_type: "Power", value: "72" }
    ],
    mintedAt: "2024-01-17T09:15:00Z",
    owner: "0.0.6359539"
  }
];

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const status = searchParams.get('status');
    const collection = searchParams.get('collection');

    let filteredNFTs = [...HARDCODED_NFTS];

    // Apply filters if provided
    if (walletAddress) {
      filteredNFTs = filteredNFTs.filter(nft => nft.owner === walletAddress);
    }

    if (status) {
      filteredNFTs = filteredNFTs.filter(nft => nft.status === status);
    }

    if (collection) {
      filteredNFTs = filteredNFTs.filter(nft => nft.collection === collection);
    }

    return NextResponse.json(filteredNFTs, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to fetch Hedera NFT',
        data: []
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {nftDetails, collectionId, walletAddress} = await request.json(); 
  const metadatCid = nftDetails.map((nft: any) => Buffer.from(nft.metadata));
  const mintTx = new TokenMintTransaction().setTokenId(collectionId).setMetadata(metadatCid)
    .setTransactionId(TransactionId.generate(walletAddress))
    .setNodeAccountIds([new AccountId(3)])
    .freeze();

  return NextResponse.json({
    status: 'success',
    transaction: mintTx.toBytes(),
  }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to fetch Hedera NFTs',
        data: []
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
