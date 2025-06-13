"use client";

import { useState } from "react";

export default function ConnectWallet() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const handleConnectWallet = async () => {
        const response = await fetch('/api/connect-hedera');
        setWalletAddress(response.ok ? '0.01234567890' : null); // Mock address for demonstration
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            {!walletAddress ? <>
                <h1 className="text-2xl font-bold">Connect Wallet</h1>
                <button onClick={handleConnectWallet} className="px-4 py-2 text-white bg-blue-500 rounded">
                    Connect
                </button>
            </> : 
            walletAddress}
            
        </div>
    );
}
