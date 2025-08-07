Medical Record Management API
This API provides endpoints for managing encrypted medical records on IPFS using the Hedera Consensus Service (HCS) for access control. It supports uploading, accessing, requesting, and approving access to medical records with cryptographic security.
Overview
The API is built using Next.js and integrates with:

Pinata for IPFS storage
Hedera Hashgraph for consensus and file storage
Crypto module for encryption/decryption
Axios for HTTP requests
ImageProcessor for checksum generation
LowDB for user data management

The system ensures secure storage and access control for medical records, using ECDH key exchange and AES-256-GCM encryption.
Prerequisites

Node.js (v16 or higher)
Hedera testnet account
Pinata account with JWT and gateway URL
Environment variables in .env.local:PINATA_JWT=your_pinata_jwt
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/
HEDERA_OPERATOR_ID=your_hedera_account_id
HEDERA_OPERATOR_KEY=your_hedera_private_key
HEDERA_HFS_KEY_PUBLIC=your_hedera_file_service_public_key
HEDERA_HFS_KEY_PRIVATE=your_hedera_file_service_private_key



Installation

Clone the repository:
git clone <repository-url>
cd <repository-directory>


Install dependencies:
npm install


Set up environment variables in .env.local.

Run the development server:
npm run dev



API Endpoints
1. OPTIONS - Handle CORS Preflight

Method: OPTIONS
Purpose: Responds to CORS preflight requests to allow cross-origin requests from http://localhost:8080.
Response: 200 OK with CORS headers.

2. PUT - Encrypt and Upload Medical Record (Patient)

Method: PUT
Path: /api/dhis/medical-record
Purpose: Encrypts and uploads a medical record to IPFS, storing metadata and encryption details.
Request Body (multipart/form-data):
name: Record name
description: Record description
collectionId: Collection identifier
collectionName: Collection name
walletAddress: Patient's wallet address
patientDID: Patient's Decentralized Identifier (DID)
document: PDF file to upload


Workflow:
Validate form data and file.
Generate checksum using imageProcessor.generateChecksum.
Generate AES-256-GCM key and IV.
Encrypt the file using AES-256-GCM.
Generate an ephemeral ED25519 key pair.
Compute ECDH shared secret with patient’s public key.
Derive encryption key using HKDF.
Encrypt the AES key with the derived key.
Upload encrypted file to IPFS via Pinata.
Create and upload metadata with encryption details.
Return metadata and file CIDs.


Response:
Success: { metadataCid, fileCid }
Error: { success: false, error: string }



3. GET - Decrypt and Serve Medical Record (Provider)

Method: GET
Path: /api/dhis/medical-record?cid=<metadataCid>&providerKey=<publicKey>&providerDID=<did>
Purpose: Decrypts and serves a medical record to an authorized provider.
Query Parameters:
cid: Metadata CID
providerKey: Provider’s public key (ECDSA)
providerDID: Provider’s DID


Workflow:
Validate query parameters.
Verify access rights using verifyProviderAccess.
Fetch metadata from IPFS.
Retrieve provider-specific encrypted AES key from HCS or IPFS.
Compute shared secret with provider’s public key and patient’s private key.
Derive decryption key using HKDF.
Decrypt the AES key.
Fetch and decrypt the file using AES-256-GCM.
Serve the decrypted PDF.


Response:
Success: Decrypted PDF file (application/pdf)
Error: { success: false, error: string }



4. POST - Request Access (Provider)

Method: POST
Path: /api/dhis/medical-record
Purpose: Submits an access request for a medical record to HCS.
Request Body (JSON):
nftId: NFT identifier
reason: Reason for access
accessType: Type of access (e.g., time-based, single-use)
requestedDuration: Duration in seconds (for time-based access)
urgency: Urgency level
patientId: Patient ID
instituitionId: Institution ID
requestedAt: Request timestamp
requestType: Request type


Workflow:
Validate request body.
Fetch user and institution details using getUserById.
Fetch NFT details from mirror node.
Extract metadata CID from NFT.
Extract patient topic ID from DID.
Generate a unique request ID.
Submit access request to HCS via TopicMessageSubmitTransaction.
Return request details.


Response:
Success: { success: true, requestId, transactionId, message }
Error: { error: string }



5. PATCH - Approve Access (Patient)

Method: PATCH
Path: /api/dhis/medical-record
Purpose: Approves a provider’s access request by re-encrypting the AES key and submitting approval to HCS.
Request Body (JSON):
requestId: Access request ID
providerPublicKey: Provider’s public key (ECDSA)
fileCid: File metadata CID
accessType: Access type (e.g., time-based)
duration: Access duration in seconds
providerDID: Provider’s DID


Workflow:
Fetch metadata from IPFS.
Decrypt the AES key using patient’s private key and ephemeral public key.
Compute shared secret with provider’s public key.
Re-encrypt the AES key for the provider.
Store encrypted key on HFS or IPFS.
Extract patient topic ID from DID.
Submit approval message to HCS.
Return transaction details.


Response:
Success: { success: true, transactionId, storageLocation }
Error: { error: string }



Key Functions
computeHederaSharedSecret(privateKey: PrivateKey, publicKey: PublicKey): Promise<Buffer>

Purpose: Computes an ECDH shared secret using a private-public key pair.
Parameters:
privateKey: Hedera PrivateKey object
publicKey: Hedera PublicKey object


Returns: Shared secret as a Buffer.
Logic:
Initialize ECDH with secp256k1 curve.
Set private key.
Compute shared secret with public key.



verifyProviderAccess(providerDID: string, fileCid: string): Promise<boolean>

Purpose: Verifies if a provider has access to a file by checking HCS messages.
Parameters:
providerDID: Provider’s DID
fileCid: File metadata CID


Returns: true if access is granted, false otherwise.
Logic:
Extract patient topic ID from DID.
Fetch all topic messages from mirror node.
Find the latest approval message for the file.
Check expiration (for time-based access) or usage count (for single-use access).
Return access status.



Workflow Logic

Patient Uploads Record (PUT):

Patient submits a medical record with metadata.
File is encrypted with AES-256-GCM.
AES key is encrypted with a shared secret derived from an ephemeral key pair and patient’s public key.
Encrypted file and metadata are uploaded to IPFS.
CIDs are returned for reference.


Provider Requests Access (POST):

Provider submits an access request with NFT details and reason.
Request is validated and submitted to HCS as a topic message.
Patient is notified of the request.


Patient Approves Access (PATCH):

Patient retrieves the original AES key by decrypting with their private key.
AES key is re-encrypted for the provider using a shared secret.
Encrypted key is stored on HFS or IPFS.
Approval is submitted to HCS with storage location.


Provider Accesses Record (GET):

Provider requests the record with their DID and public key.
Access is verified via HCS messages.
Encrypted AES key is retrieved and decrypted.
File is fetched from IPFS and decrypted.
Decrypted PDF is served.



Security Features

Encryption: AES-256-GCM for file and key encryption.
Key Exchange: ECDH with secp256k1 for secure key sharing.
Access Control: HCS-based approval system with expiration and usage limits.
Integrity: Checksums ensure file integrity.
CORS: Restricted to http://localhost:8080 for development.

Error Handling

Validates inputs and returns appropriate HTTP status codes (400, 403, 404, 500).
Logs errors for debugging.
Returns JSON error responses with descriptive messages.

Testing

Start the server: npm run dev
Test endpoints using tools like Postman or cURL.
Example requests:
PUT: Upload a PDF with form data.
POST: Submit an access request with JSON payload.
PATCH: Approve access with provider details.
GET: Retrieve a decrypted file with query parameters.



Limitations

Hardcoded patient keys for testing (replace with secure key management in production).
Assumes localhost:8080 for CORS (update for production).
Hedera testnet is used; switch to mainnet for production.

Future Improvements

Implement secure key storage (e.g., HSM or wallet integration).
Add rate limiting for API endpoints.
Support multiple file types beyond PDF.
Enhance access control with fine-grained policies.
