// Utility functions for NFT operations

/**
 * Split certificate ID into parts
 * @param certificateId - The certificate ID to split
 * @returns Object with split parts
 */
export function splitcertificateId(certificateId: string): { tokenId: string; serialNumber: string } {
  if (!certificateId) {
    return { tokenId: '', serialNumber: '' };
  }

  // Handle Hedera token format like "0.0.123456-1"
  const parts = certificateId.split('-');
  
  if (parts.length === 2) {
    return {
      tokenId: parts[0],
      serialNumber: parts[1]
    };
  }

  // If no serial number, assume it's just a token ID
  return {
    tokenId: certificateId,
    serialNumber: '1'
  };
}

/**
 * Create certificate ID from token ID and serial number
 * @param tokenId - The token ID
 * @param serialNumber - The serial number
 * @returns Combined certificate ID
 */
export function createCertificateId(tokenId: string, serialNumber: string | number): string {
  return `${tokenId}-${serialNumber}`;
}

/**
 * Validate Hedera token ID format
 * @param tokenId - Token ID to validate
 * @returns True if valid format
 */
export function isValidTokenId(tokenId: string): boolean {
  const hederaTokenRegex = /^\d+\.\d+\.\d+$/;
  return hederaTokenRegex.test(tokenId);
}

/**
 * Format token ID for display
 * @param tokenId - Token ID to format
 * @returns Formatted token ID
 */
export function formatTokenId(tokenId: string): string {
  if (!isValidTokenId(tokenId)) {
    return tokenId;
  }
  
  return tokenId;
}
