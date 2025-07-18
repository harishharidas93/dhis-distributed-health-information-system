/* eslint-disable */
const { PinataSDK } = require('pinata-web3');
import { NextRequest, NextResponse } from 'next/server';
import { TokenMintTransaction, AccountId, TransactionId } from '@hashgraph/sdk';
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

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { collectionId, tokenDetails } = await request.json();
  let { nftDetails } = await request.json();
    nftDetails = JSON.parse(nftDetails);
      const formData = await request.formData();
        const file = formData.get('file'); 
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
      const originalImageChecksum = imageProcessor.generateChecksum(imageBuffer);

      const originialImgBlob = new Blob([imageBuffer], { type: 'image/png' });
      const originalImgFile = new File([originialImgBlob], 'image.jpg', { type: 'image/png' });

      // Create IPFS hash of Resized Image
      const imagesHash = await pinata.upload.file(originalImgFile);


      const metaData = {
        name: nftDetails.name,
        description: nftDetails.description,
        creator: tokenDetails.user.user_name,
        format: 'HIP412@2.0.0',
        image: `${config.pinata.gatewayUrl}${imagesHash.IpfsHash}/image.jpg`,
        checksum: originalImageChecksum,
        type: 'image/png',
        files: [
          {
            checksum: originalImageChecksum,
            is_default_file: true,
            type: 'image/png',
            uri: `${config.pinata.gatewayUrl}${imagesHash.IpfsHash}/image.jpg`, // Preview Img
          },
        ],
        properties: {
              collection_id: collectionId,
              collection_name: tokenDetails.name,
            },
      };

      const metadataUpload = await pinata.upload.json(metaData);

    return NextResponse.json({
        success: true,
        data: metadataUpload.IpfsHash,
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to upload metadata to IPFS',
        data: []
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
