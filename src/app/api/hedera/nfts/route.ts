import { NextRequest, NextResponse } from 'next/server';

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

// Hardcoded Hedera NFT data
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
    owner: "0.0.7654321"
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
    owner: "0.0.7654321"
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
    owner: "0.0.7654321"
  },
  {
    id: "hedera_004",
    name: "Consensus Dragon",
    description: "Ancient dragon guardian of consensus",
    image: "🐉",
    tokenId: "0.0.1234570",
    serialNumber: 1,
    chain: "Hedera",
    status: "Minted",
    collection: "Dragon Guardians",
    attributes: [
      { trait_type: "Rarity", value: "Mythic" },
      { trait_type: "Element", value: "Wind" },
      { trait_type: "Power", value: "99" }
    ],
    mintedAt: "2024-01-18T16:45:00Z",
    owner: "0.0.7654321"
  },
  {
    id: "hedera_005",
    name: "HBAR Phoenix",
    description: "Legendary phoenix born from HBAR flames",
    image: "🔥",
    tokenId: "0.0.1234571",
    serialNumber: 1,
    chain: "Hedera",
    status: "Minted",
    attributes: [
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Element", value: "Fire" },
      { trait_type: "Power", value: "97" }
    ],
    mintedAt: "2024-01-19T11:30:00Z",
    owner: "0.0.7654321"
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const status = searchParams.get('status');
    const collection = searchParams.get('collection');

    let filteredNFTs = [...HARDCODED_NFTS];

    // Apply filters if provided
    if (owner) {
      filteredNFTs = filteredNFTs.filter(nft => nft.owner === owner);
    }

    if (status) {
      filteredNFTs = filteredNFTs.filter(nft => nft.status === status);
    }

    if (collection) {
      filteredNFTs = filteredNFTs.filter(nft => nft.collection === collection);
    }

    return NextResponse.json({
      success: true,
      data: filteredNFTs,
      total: filteredNFTs.length,
      chain: 'Hedera'
    });

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
