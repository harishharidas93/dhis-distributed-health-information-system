# 🏥 Decentralized health Information System (dHiS)

This project is a prototype for securely storing, encrypting, and sharing **medical records** as **dynamic NFTs** on the **Hedera blockchain**, with data stored on **IPFS** and identities managed via **DID**.

It is designed for **hackathon/demo use**, with a minimal, database-less backend and secure cryptographic flows.

---

## 🔧 Tech Stack

| Layer                    | Technology                             |
|--------------------------|-----------------------------------------|
| Frontend (dApp)          | Next.js 14 / React                      |
| Backend API              | Next.js API routes                      |
| Blockchain               | Hedera Hashgraph                        |
| NFT Standard             | HIP-412 Metadata + Dynamic NFTs         |
| Storage                  | IPFS (via Pinata)                       |
| Encryption               | AES-256-GCM + RSA (OpenSSL)            |
| Identity (DID)           | Custom Hedera-based DID with public keys|
| Upload SDK               | Pinata SDK                              |

---

## 🗂 Folder Structure with Routes

- src/
  - app/
    - access/
      - page.tsx  — `/access` → Patient or provider accesses decrypted medical records
    - upload/
      - page.tsx  — `/upload` → Hospital uploads encrypted medical record and metadata
    - layout.tsx — App-wide layout (header, footer, etc.)
    - globals.css — Global styles
  - api/
    - dhis/
      - medical-record/
        - route.ts — `/api/dhis/medical-record`
          - `PUT`: Encrypt + upload PDF to IPFS, generate metadata
          - `GET`: Decrypt PDF using RSA + AES and return to frontend
  - components/
    - ui/
      - button.tsx, input.tsx, etc. — Reusable UI elements
    - layout/
      - Page wrappers or grid layouts (optional)
  - utils/
    - mirrorNode.ts — Mirror Node helpers for querying Hedera topics
    - imageProcessor.ts — SHA-256 checksum generation for file integrity
    - encryption.ts — AES/RSA encryption logic (optional helper functions)
  - config/
    - config.ts — Central config file for Pinata keys, gateway URL, etc.

- public.pem — RSA public key (used to encrypt AES key)
- private.pem — RSA private key (used to decrypt AES key)
- .env.local — Environment configuration
- yarn.lock — Yarn dependency lock file
- README.md — Project documentation



---

## 🔐 Security Flow

1. **Encrypt PDF** with AES-256-GCM
2. **Encrypt AES key** using the receiver's (patient’s) public RSA key
3. **Upload encrypted PDF** to IPFS via Pinata
4. **Store metadata** (iv, auth tag, encrypted AES key, and CID) to IPFS
5. **Decrypt** using private key only when access is granted

---

## 🧪 API Overview

### 📤 PUT `/api/dhis/medical-record`

**Purpose:** Encrypt a PDF file and store it on IPFS, along with AES metadata  
**Request Type:** `multipart/form-data`

**Form fields:**

- `document` - PDF file (Blob)
- `name` - NFT name
- `description` - NFT description
- `collectionId` - Hedera NFT collection ID
- `collectionName` - NFT collection name
- `walletAddress` - Issuer/creator wallet address

**Response:**
```json
{
  "fileHash": "QmEncryptedCID...",
  "metadataCid": "QmMetadataCID..."
}

```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/dhis-medical-records.git
```

### 2. Install Dependencies

yarn install

### 3. Setup Environment Variables

Create a .env.local file in the root directory with the following:

```bash
PINATA_JWT=your_pinata_jwt_token
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Update values as required for your environment.

### 4. Start the Development Server
yarn dev

Access the app at: http://localhost:3000