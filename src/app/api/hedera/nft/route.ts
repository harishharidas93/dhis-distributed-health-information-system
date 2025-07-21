import { NextRequest, NextResponse } from 'next/server';
import mirrorNode from '@/utils/mirrorNode';
import axios from 'axios';
import { TokenMintTransaction, TransactionId, AccountId } from '@hashgraph/sdk';
import { PinataSDK } from 'pinata-web3';
import { config } from '@/config/config';
import imageProcessor from '@/utils/imageProcessor';

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
    
    const nfts = await mirrorNode.fetchAllNFTs(walletAddress as string); // Example collectionId
    for (const nft of nfts) {
      if (nft.metadata) {
        // Decode base64 metadata to get CID
        const cid = Buffer.from(nft.metadata, 'base64').toString('utf-8');
        const metadataUrl = `${config.pinata.gatewayUrl}${cid}`;
        try {
          const response = await axios.get(metadataUrl);
          const meta = response.data;
          nft.id = `${nft.token_id}.${nft.serial_number}`;
          nft.name = meta.name || nft.name;
          nft.imageUrl = meta.image || nft.image;
          nft.collection = meta.properties?.collection_name || nft.collection;
          nft.description = meta.description || nft.description;
          nft.createdAt = timestampToHuman(nft.created_timestamp);
        } catch (err) {
          console.error('Error fetching metadata:', err);
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
    // const imageBuffer = file.buffer;
    const originalImageChecksum = imageProcessor.generateChecksum(imageBuffer);

    const originialImgBlob = new Blob([imageBuffer], { type: 'image/png' });
    const originalImgFile = new File([originialImgBlob], 'image.jpg', { type: 'image/png' });

    // Create IPFS hash of Resized Image
    const imagesHash = await pinata.upload.file(originalImgFile);


    const metaData = {
      name: payload.name,
      description: payload.description,
      creator: payload.walletAddress,
      format: 'HIP412@2.0.0',
      image: `${config.pinata.gatewayUrl}${imagesHash.IpfsHash}`,
      checksum: originalImageChecksum,
      type: 'image/png',
      files: [
        {
          checksum: originalImageChecksum,
          is_default_file: true,
          type: 'image/png',
          uri: `${config.pinata.gatewayUrl}${imagesHash.IpfsHash}`,
        },
      ],
      properties: {
        collection_id: payload.collectionId,
        collection_name: payload.collectionName,
      },
    };

    const metadataUpload = await pinata.upload.json(metaData);
    const metadatCid = metadataUpload.IpfsHash;
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
