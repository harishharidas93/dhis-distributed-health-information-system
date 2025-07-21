# Mint Bridge

A unified, open-source NFT minting platform that connects all your wallets and chains in one beautiful interface. Built for seamless multi-chain NFT creation, with a focus on Hedera.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, SSR/SSG)
- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** React Query (@tanstack/react-query)
- **Blockchain:** Hedera SDK, HashConnect
- **UI Components:** Custom + Shadcn UI
- **Other:** Pinata (IPFS), Lucide Icons

---

## 🛠️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/mint-bridge.git
cd mint-bridge
```

### 2. Install dependencies
```bash
yarn install
# or
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory. Example:
```env
# Pinata IPFS Configuration, you can get your JWT from Pinata dashboard. Use any email to create an account.
# For more information, visit: https://docs.pinata.cloud/overview
PINATA_JWT=access_jwt_from_pinata_dashboard
# Gateway URL can stay the same
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/

# Hedera Configuration
HEDERA_NETWORK=testnet

# Mirror Node Configuration, we are mirror node for getting data like historical records. Data will be bit slow but free of cost.
HEDERA_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1

NEXT_PUBLIC_API_URL=http://localhost:3000

# (Add any other required variables here)
```

### 4. Run the development server
```bash
yarn dev
# or
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Build for production
```bash
yarn build && yarn start
# or
npm run build && npm start
```

---

## 📁 Basic File Structure

```
mint-bridge/
├── src/
│   ├── app/                # Next.js app directory (routes, pages, API)
│   │   ├── dashboard/      # Main dashboard UI
│   │   └── api/            # API routes (Hedera, Ethereum, etc.)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API clients, utilities
│   ├── services/           # Blockchain and wallet logic
│   ├── store/              # Zustand store
│   ├── utils/              # Utility functions
│   └── assets/             # Static assets (images, etc.)
├── public/                 # Static files
├── styles/                 # Global styles
├── LICENSE                 # MIT License
├── README.md               # This file
└── ...
```

---

## 📝 Documentation

- **Next.js:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **React Query:** [https://tanstack.com/query/latest/docs/framework/react/overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- **Zustand:** [https://docs.pmnd.rs/zustand/getting-started/introduction](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Hedera SDK:** [https://hedera.com/docs](https://hedera.com/docs)
- **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 🛡️ License

This project is licensed under the [MIT License](./LICENSE) © 2025 Harish Haridas.
