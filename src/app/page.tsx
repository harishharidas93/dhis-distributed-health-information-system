import WalletConnectButton from '@/components/WalletConnectButton';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            MintBridge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Unified NFT Minting Across All Blockchains
          </p>
        </div>

        {/* Subtitle */}
        <div className="mb-12">
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Connect any wallet. Mint on any chain. Create, manage, and showcase your NFTs 
            across Ethereum, Solana, Hedera, and Polygon — all in one place.
          </p>
        </div>

        {/* Main CTA Button - 50% width, 20% height */}
        <WalletConnectButton></WalletConnectButton>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-2xl mb-2">🔗</div>
            <p className="text-sm text-gray-300">Multi-Chain</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-2xl mb-2">👛</div>
            <p className="text-sm text-gray-300">Any Wallet</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-2xl mb-2">🎨</div>
            <p className="text-sm text-gray-300">Easy Minting</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-2xl mb-2">🔓</div>
            <p className="text-sm text-gray-300">Open Source</p>
          </div>
        </div>
      </div>
    </div>
  );
}