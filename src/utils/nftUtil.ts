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
  const dashParts = certificateId.split('-');
  if (dashParts.length === 2) {
    return {
      tokenId: dashParts[0],
      serialNumber: dashParts[1]
    };
  }

  // Handle format like "1.1.1.1" (tokenId: 1.1.1, serialNumber: 1)
  const dotParts = certificateId.split('.');
  if (dotParts.length === 4) {
    return {
      tokenId: dotParts.slice(0, 3).join('.'),
      serialNumber: dotParts[3]
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
