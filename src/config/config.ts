// Configuration file for environment variables
export const config = {
  // Pinata IPFS Configuration
  pinata: {
    jwt: process.env.PINATA_JWT || '',
    gatewayUrl: process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/',
  },
  
  // Hedera Configuration
  hedera: {
    network: process.env.HEDERA_NETWORK || 'testnet',
    accountId: process.env.HEDERA_ACCOUNT_ID || '',
    privateKey: process.env.HEDERA_PRIVATE_KEY || '',
    mirrorNodeUrl: process.env.HEDERA_MIRROR_NODE_URL || 'https://testnet.mirrornode.hedera.com',
    hfsKey: {
      publicKey: process.env.HEDERA_HFS_PUBLIC_KEY || '',
      privateKey: process.env.HEDERA_HFS_PRIVATE_KEY || '',
    },
    hcsTopicId: 'test',
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    mockApiCalls: process.env.MOCK_API_CALLS || null,
  }
};

// Validation function to check if required environment variables are set
export function validateConfig() {
  const requiredVars = [
    'PINATA_JWT',
    'HEDERA_ACCOUNT_ID',
    'HEDERA_PRIVATE_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please check your .env.local file');
  }
  
  return missing.length === 0;
}

// Legacy exports for backward compatibility
export const ipfsApiKey = config.pinata.jwt;
export const ipfsGatewayUrl = config.pinata.gatewayUrl;
export const mirrorNodeBaseUrl = config.hedera.mirrorNodeUrl;
