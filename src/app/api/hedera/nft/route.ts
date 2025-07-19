/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import mirrorNode from '@/utils/mirrorNode';
import axios from 'axios';

import { TokenType, PrivateKey, TokenMintTransaction, TransactionId, Timestamp, NftId, PublicKey, AccountId, TokenId, TokenCreateTransaction, TransferTransaction, TokenBurnTransaction, TokenWipeTransaction, TokenDeleteTransaction, TokenPauseTransaction, TokenUnpauseTransaction, TokenFreezeTransaction, TokenUnfreezeTransaction, TokenGrantKycTransaction, TokenRevokeKycTransaction, TokenAssociateTransaction, TokenDissociateTransaction, AccountAllowanceApproveTransaction, AccountAllowanceDeleteTransaction, TokenSupplyType } from '@hashgraph/sdk';

const { PinataSDK } = require('pinata-web3');
import imageProcessor from '@/utils/imageProcessor';
import { config } from '@/config/config';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

const pinata = new PinataSDK({
  pinataJwt: config.pinata.jwt,
  pinataGateway: config.pinata.gatewayUrl,
});

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
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    
    const nfts = await mirrorNode.fetchAllNFTs(walletAddress as string); // Example collectionId
    for (const nft of nfts) {
      if (nft.metadata) {
        // Decode base64 metadata to get CID
        const cid = Buffer.from(nft.metadata, 'base64').toString('utf-8');
        const metadataUrl = `${config.pinata.gatewayUrl}${cid}`;
        try {
          const response = await axios.get(metadataUrl);
          const meta = response.data;
          nft.name = meta.name || nft.name;
          nft.image = meta.image || nft.image;
          nft.collection = meta.properties?.collection_name || nft.collection;
        } catch (err) {
          // Optionally log or handle fetch error
        }
      }
    }
    return NextResponse.json(nfts, { headers: corsHeaders });

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
    const formData = await request.formData();
    
    const payload = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      collectionId: formData.get('collectionId') as string,
      collectionName: formData.get('collectionName') as string,
      walletAddress: formData.get('walletAddress') as string,
      timestamp: formData.get('timestamp') as string,
    };
            const file = formData.get('image'); 
            let imageBuffer;
            if (file && file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
            } else {
        return NextResponse.json({
          success: false,
          error: 'No file provided or file is not a valid Blob',
        }, { status: 400 });
            }
        //   const imageBuffer = file.buffer;
          // const originalImageChecksum = imageProcessor.generateChecksum(imageBuffer);
    
          // const originialImgBlob = new Blob([imageBuffer], { type: 'image/png' });
          // const originalImgFile = new File([originialImgBlob], 'image.jpg', { type: 'image/png' });
    
          // // Create IPFS hash of Resized Image
          // const imagesHash = await pinata.upload.file(originalImgFile);
    
    
          // const metaData = {
          //   name: payload.name,
          //   description: payload.description,
          //   creator: payload.walletAddress,
          //   format: 'HIP412@2.0.0',
          //   image: `${config.pinata.gatewayUrl}${imagesHash.IpfsHash}`,
          //   checksum: originalImageChecksum,
          //   type: 'image/png',
          //   files: [
          //     {
          //       checksum: originalImageChecksum,
          //       is_default_file: true,
          //       type: 'image/png',
          //       uri: `${config.pinata.gatewayUrl}${imagesHash.IpfsHash}`,
          //     },
          //   ],
          //   properties: {
          //         collection_id: payload.collectionId,
          //         collection_name: payload.collectionName,
          //       },
          // };
    
          // const metadataUpload = await pinata.upload.json(metaData);
          // const metadatCid = metadataUpload.IpfsHash;
          const metadatCid = 'bafkreicd4grxsau7e4sg4gzqvc4g5k24km5ukfoksd2fvc6clspgl2x7me';
const metadataBytes = new Uint8Array(Buffer.from(metadatCid)); // Convert CID string to Uint8Array

  const mintTx = new TokenMintTransaction().setTokenId(payload.collectionId).setMetadata([metadataBytes])
    .setTransactionId(TransactionId.generate(payload.walletAddress))
    .setNodeAccountIds([new AccountId(3)])
    .freeze();

  return NextResponse.json({transaction: mintTx.toBytes()}, { headers: corsHeaders });
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
