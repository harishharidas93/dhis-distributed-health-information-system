## 🌐 Overview

This project is a privacy‑first, blockchain‑backed medical record sharing platform that gives patients cryptographic control over who can access their medical data, for how long, and under what conditions. It combines modern web tooling (Next.js + TypeScript), Hedera’s Consensus Service (HCS), IPFS via Pinata, and end‑to‑end encryption (AES‑256‑GCM + ECDH) to deliver a tamper‑evident, decentralized, and secure exchange of medical records between patients and healthcare providers.

Why this matters:
- Centralized health data stores are breach‑prone and opaque. Patients rarely have fine‑grained control.
- Regulators demand auditability, explicit consent, and time‑bound access.
- Decentralized logs (HCS) + off‑chain encrypted storage (IPFS) provide verifiable access records without leaking contents.

Key guarantees:
- Ownership: Patients keep cryptographic control of access to their records.
- Minimization: Encrypted data is off‑chain; on‑chain/consensus only stores approvals, expiries, and audit trails.
- Auditability: Every request/approval/revocation/expiry is immutably recorded via HCS and queryable via Mirror Node.

---

## 🎯 Motivation

Problem
- Health data is locked in silos, duplicated across providers, and shared through brittle, centralized workflows.
- Breaches expose sensitive data; access recourse is weak; logs are mutable or incomplete.

Goal
- A decentralized access‑control system where:
  - Patients own/approve access and can revoke at any time.
  - Files are encrypted client‑side and stored off‑chain (IPFS/Pinata).
  - Access decisions are immutable and publicly verifiable (Hedera HCS).
  - Access is time‑bound and auto‑expires (with scheduled expiry signals).

---

## 🔑 Core Features

For patients
- Upload medical records; files are encrypted locally before leaving the device.
- Approve/deny provider requests with explicit expiry windows.
- Revoke access at will; see immutable logs of all access events.

For healthcare providers
- Discover and request patient records using DIDs.
- Receive approval via HCS; retrieve and decrypt within the permitted window.
- Session controls in‑app: start, stop (local pause), complete (finalize + purge keys).

---

## 🔧 Tech Stack

| Layer                    | Technology                                      |
|--------------------------|--------------------------------------------------|
| Frontend (dApp)          | Next.js 14, React, TypeScript                   |
| State/Data               | Zustand, TanStack Query                          |
| Backend API              | Next.js API Routes                               |
| Blockchain Layer         | Hedera Hashgraph (HCS)                           |
| Storage                  | IPFS via Pinata                                  |
| Encryption               | AES‑256‑GCM (content), ECDH (key exchange)       |
| Identity (DID)           | Hedera‑anchored DID with public keys             |
| Scheduling               | Node timers (server) for access expiry signals   |
| Hedera Integration       | Hedera SDK + Mirror Node API                     |

---

## 🏗️ Architecture

High‑level data flow
1) Patient Upload
- File picked → random AES‑256‑GCM key generated → file encrypted.
- AES key sealed for the patient using ECDH (Hedera ECDSA curve) → metadata (iv, authTag, ephemeral pubkey, encrypted AES key, file CID) created and uploaded to IPFS.

2) Provider Request (HCS)
- Provider posts a signed request (DID, public key, reason) to a patient/hospital Hedera topic. The message is immutable and timestamped.

3) Patient Approval (HCS)
- Patient reviews requests (Mirror Node). On approval, patient decrypts AES key, re‑encrypts it for the provider’s public key (ECDH), sets optional expiry, and posts an approval message (with meta CID + expiry) to HCS. If a duration is set, a server‑side timer schedules an expiry message. Also the hospital is accessing a copy of the data from Hedera File service. If expiry is set, then it will be auto-deleted.

4) Provider Retrieval
- Provider fetches approval from Mirror Node, downloads encrypted file + metadata from IPFS, decrypts AES key with their private key, then decrypts the file.

5) Access Expiry / Completion
- On expiry, the server posts an access‑expired message to HCS and prevents further decryption by removing provider key material (e.g., deleting HFS blobs). If a session is completed early, we cancel scheduled expiries and delete derived keys.

Hedera usage
- HCS Topics: All request/approval/revoke/expired/completed messages are broadcast to patient and hospital topics for full auditability.
- Mirror Node: Efficiently reads topic messages, including chunked payloads; we merge multi‑part base64 messages back into a single JSON.

---

## 🔐 Security Model

Encryption and keys
- Content: AES‑256‑GCM (fast, authenticated encryption).
- Key exchange: ECDH to derive shared secrets; patient re‑encrypts the AES key for providers.
- Transport: HCS carries only metadata, DIDs, approvals, and pointers (never plaintext).

Data storage
- Files and metadata are stored on IPFS via Pinata; only encrypted blobs are stored off‑chain.
- Integrity is guaranteed by IPFS CIDs; contents are immutable.
- Original file uploaded, is not decrypted and changed at any point. Instead the AES key is decrypted and shared across, that too in Hedera file service.

Access control
- All access changes (requested/approved/rejected/completed/expired) are recorded on HCS.
- Sessions: UI supports Start (decrypt + view), Stop (local pause—no API), Complete (finalize; delete provider key blob, cancel expiry timers, emit completion).

---

## 🔄 Example Workflow

Patient
1. Selects X‑ray.pdf → encrypts with AES key K.
2. AES key is sealed with patient’s ECDH public key; encrypted file uploaded to IPFS → fileCID.
3. Metadata (iv, authTag, encrypted AES key, ephemeral pk, fileCID) → IPFS → metaCID.
4. Waits for provider requests (via HCS).

Provider
1. Posts request to HCS with DID, public key, reason.
2. Receives approval message containing re‑encrypted AES key + expiry.
3. Downloads file from IPFS, decrypts AES key, decrypts file.

---

## ✅ Benefits

- Privacy‑first: Patients explicitly authorize access.
- Decentralized: No central database of plaintext records.
- Auditable: HCS provides immutable, timestamped logs.
- Interoperable: DIDs and CIDs compose across systems.
- Time‑bound: Automatic expiry + manual completion/revocation.

---

## 🗂 Folder Structure (selected)

- `src/app/*` — Next.js app routes for patient and hospital flows (dashboard, access‑requests, upload, etc.)
- `src/app/api/*` — API routes for access‑requests, medical‑record encryption/decryption.
- `src/services/*` — Hedera, user, and query hooks (`useHospitalDashboardQueries`, `useModifyAccessRequest`, etc.).
- `src/utils/*` — Mirror Node client, IPFS helpers, cryptography helpers, expiry job scheduler.
- `src/config/config.ts` — Centralized configuration sourced from environment variables.

---

## ⚙️ Configuration

Create `.env.local` from the template below (or from `.env.example` if present):

```env
PINATA_JWT=
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/

HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=
HEDERA_PRIVATE_KEY=
HEDERA_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1

NEXT_PUBLIC_API_URL=http://localhost:3000

HEDERA_HFS_PUBLIC_KEY=
HEDERA_HFS_PRIVATE_KEY=

# Optional: set to "1" to mock external calls in development
MOCK_API_CALLS=
```

Notes
- Do not commit `.env.local`.
- Ensure the Mirror Node URL ends with `/api/v1`.

---

## 🚀 Getting Started

1) Install dependencies
```bash
yarn install
```

2) Run the dev server
```bash
yarn dev
```

Visit `http://localhost:3000`.

---

## 🧪 API Overview

Medical Record API — `/api/dhis/medical-record`
- Upload/Encrypt (multipart): encrypts PDF with AES‑GCM, uploads to IPFS, returns metadata CID.
- Session decrypt (POST/stream): decrypts the IPFS file for an approved session.

Access Requests API — `/api/access-requests`
- GET: Reads HCS topic messages via Mirror Node; merges chunked messages.
- PATCH: Processes access‑request lifecycle: request/approve/reject/revoke/completed; on approval, re‑encrypts AES key for provider; on completion, cancels expiry timers and deletes provider key blob from HFS.

---

## 📎 Legal & Scope

This is a prototype intended for demonstrations and hackathons. It is not medical advice software, nor has it undergone clinical, privacy, or security certifications required for production healthcare deployments.