import { NextRequest, NextResponse } from 'next/server';
import mirrorNode from '@/utils/mirrorNode';
import axios from 'axios';
import { TokenMintTransaction, TransactionId, AccountId } from '@hashgraph/sdk';
// import { PinataSDK } from 'pinata-web3';
import { config } from '@/config/config';
// import imageProcessor from '@/utils/imageProcessor';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// const pinata = new PinataSDK({
//   pinataJwt: config.pinata.jwt,
//   pinataGateway: config.pinata.gatewayUrl,
// });

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

function timestampToHuman(timestamp: string): string {
  const date = new Date(parseFloat(timestamp) * 1000);
  return date.toLocaleString();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    
    const nfts = await mirrorNode.fetchAllNFTs(walletAddress as string);
    const cutoffTimestamp = 1754650500.0; // 2025-08-04T00:00:00Z UTC
    const filteredNFTs = nfts.filter(nft => parseFloat(nft.created_timestamp) >= cutoffTimestamp);
    for (const nft of filteredNFTs) {
      if (nft.metadata) {
        // Decode base64 metadata to get CID
        const cid = Buffer.from(nft.metadata, 'base64').toString('utf-8');
        const metadataUrl = `${config.pinata.gatewayUrl}${cid}`;
        try {
          const response = await axios.get(metadataUrl);
          const meta = response.data;
          nft.id = `${nft.token_id}.${nft.serial_number}`;
          nft.name = meta.name || nft.name;
          // nft.imageUrl = meta.image || nft.image;
          nft.collection = nft.token_id;
          nft.description = meta.description || nft.description;
          nft.createdAt = timestampToHuman(nft.created_timestamp);
        } catch (err) {
          console.error('Error fetching metadata:', err);
        }
      }
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
    const formData = await request.formData();
    
    const payload = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      collectionId: formData.get('collectionId') as string,
      walletAddress: formData.get('walletAddress') as string,
      timestamp: formData.get('timestamp') as string,
      metadataCid: formData.get('metadataCid') as string,
    };
    
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
    //     collection_id: payload.collectionId,
    //   },
    // };

    // const metadataUpload = await pinata.upload.json(metaData);
    // const metadatCid = metadataUpload.IpfsHash;
    const metadataBytes = new Uint8Array(Buffer.from(payload.metadataCid)); // Convert CID string to Uint8Array

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
