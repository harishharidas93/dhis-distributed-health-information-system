'use client';
// This is a client component in Next.js 13+ with the app directory
import React, { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('mint'); // 'mint' or 'collection'
//   const [userNFTs] = useState([
//     { id: 1, name: "Cosmic Cat #001", image: "🐱", chain: "Ethereum", status: "Minted" },
//     { id: 2, name: "Digital Dawn", image: "🌅", chain: "Solana", status: "Minted" },
//     { id: 3, name: "Pixel Punk", image: "👾", chain: "Polygon", status: "Pending" },
//     { id: 4, name: "Abstract Art #42", image: "🎨", chain: "Hedera", status: "Minted" },
//     { id: 5, name: "Galaxy Explorer", image: "🚀", chain: "Ethereum", status: "Minted" },
//     { id: 6, name: "Neon Dreams", image: "💎", chain: "Solana", status: "Minted" },
//   ]);
    // const userNFTs = await fetch('api/hedera/nfts').then(res => res.json());

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            MintBridge
          </h1>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-white/10">
              <span className="text-sm text-gray-300">Connected: </span>
              <span className="text-white font-medium">0x1234...5678</span>
            </div>
            <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg border border-red-500/30 transition-colors">
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Half - Create Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-black/30 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('mint')}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'mint'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                🎨 Mint NFT
              </button>
              <button
                onClick={() => setActiveTab('collection')}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'collection'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                📁 Create Collection
              </button>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image Upload */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {activeTab === 'mint' ? 'Upload NFT Image' : 'Collection Image'}
                </h3>
                <div className="border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-xl p-8 text-center transition-colors duration-300 bg-gray-900/50">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-gray-300 mb-2">Drag & drop your image here</p>
                  <p className="text-gray-500 text-sm mb-4">PNG, JPG, GIF up to 10MB</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-200">
                    Choose File
                  </button>
                </div>
              </div>

              {/* Right Side - Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {activeTab === 'mint' ? 'NFT Details' : 'Collection Details'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {activeTab === 'mint' ? 'NFT Name' : 'Collection Name'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder={activeTab === 'mint' ? 'Enter NFT name...' : 'Enter collection name...'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                      placeholder="Describe your NFT or collection..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Blockchain</label>
                    <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                      <option>Ethereum</option>
                      <option>Solana</option>
                      <option>Polygon</option>
                      <option>Hedera</option>
                    </select>
                  </div>

                  {activeTab === 'mint' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Collection (Optional)</label>
                      <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                        <option>No Collection</option>
                        <option>My Art Collection</option>
                        <option>Digital Assets</option>
                      </select>
                    </div>
                  )}

                  <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105">
                    {activeTab === 'mint' ? '🚀 Mint NFT' : '📁 Create Collection'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Half - User's NFTs */}
        {/* <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your NFTs</h2>
            <div className="text-sm text-gray-400">
              {userNFTs.length} NFTs
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userNFTs.map((nft) => (
              <div key={nft.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group">
                <div className="aspect-square bg-gray-800 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {nft.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 truncate">{nft.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{nft.chain}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      nft.status === 'Minted' 
                        ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                        : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {nft.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Bottom Navigation Strip */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8">
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-white rounded-lg border border-white/10 transition-all duration-200">
              <span>🖼️</span>
              <span>All NFTs</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-white rounded-lg border border-white/10 transition-all duration-200">
              <span>📚</span>
              <span>All Collections</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}