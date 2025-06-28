'use client';
// This is a client component in Next.js 13+ with the app directory
import React, { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('mint'); // 'mint' or 'collection'
  const [viewTab, setViewTab] = useState('nfts'); // 'nfts' or 'collections'
  const [userNFTs] = useState([
    { id: 1, name: "Cosmic Cat #001", image: "🐱", chain: "Ethereum", status: "Minted", collection: "Cosmic Cats" },
    { id: 2, name: "Digital Dawn", image: "🌅", chain: "Solana", status: "Minted", collection: "Nature Series" },
    { id: 3, name: "Pixel Punk", image: "👾", chain: "Polygon", status: "Pending", collection: "Pixel Art" },
    { id: 4, name: "Abstract Art #42", image: "🎨", chain: "Hedera", status: "Minted", collection: "Abstract Collection" },
    { id: 5, name: "Galaxy Explorer", image: "🚀", chain: "Ethereum", status: "Minted", collection: "Space Series" },
    { id: 6, name: "Neon Dreams", image: "💎", chain: "Solana", status: "Minted", collection: "Neon Collection" },
    { id: 7, name: "Cyber Wolf", image: "🐺", chain: "Ethereum", status: "Minted", collection: "Cyber Pack" },
    { id: 8, name: "Ocean Wave", image: "🌊", chain: "Solana", status: "Minted", collection: "Nature Series" },
  ]);

  const [userCollections] = useState([
    { id: 1, name: "Cosmic Cats", nftCount: 15, chain: "Ethereum", description: "A collection of cosmic feline adventures", image: "🐱" },
    { id: 2, name: "Nature Series", nftCount: 8, chain: "Solana", description: "Beautiful nature-inspired digital art", image: "🌅" },
    { id: 3, name: "Pixel Art", nftCount: 23, chain: "Polygon", description: "Retro pixel art collection", image: "👾" },
    { id: 4, name: "Abstract Collection", nftCount: 12, chain: "Hedera", description: "Modern abstract digital pieces", image: "🎨" },
    { id: 5, name: "Space Series", nftCount: 6, chain: "Ethereum", description: "Explore the galaxy through art", image: "🚀" },
    { id: 6, name: "Neon Collection", nftCount: 4, chain: "Solana", description: "Vibrant neon-themed artwork", image: "💎" },
    { id: 7, name: "Cyber Pack", nftCount: 9, chain: "Ethereum", description: "Futuristic cyberpunk collection", image: "🐺" },
  ]);

  // Get recent NFTs for preview
  const recentNFTs = userNFTs.slice(-4);
  const totalCollections = userCollections.length;
  const mintedCount = userNFTs.filter(nft => nft.status === 'Minted').length;
  const pendingCount = userNFTs.filter(nft => nft.status === 'Pending').length;

  const scrollToNFTs = () => {
    document.getElementById('nft-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        {/* Stats Preview Bar */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              {/* Left - Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userNFTs.length}</div>
                  <div className="text-xs text-gray-400">Total NFTs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalCollections}</div>
                  <div className="text-xs text-gray-400">Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{mintedCount}</div>
                  <div className="text-xs text-gray-400">Minted</div>
                </div>
                {pendingCount > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
                    <div className="text-xs text-gray-400">Pending</div>
                  </div>
                )}
              </div>

              {/* Center - Recent NFTs Preview */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400 mr-2">Recent:</span>
                {recentNFTs.map((nft) => (
                  <div key={nft.id} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-lg hover:scale-110 transition-transform duration-200">
                    {nft.image}
                  </div>
                ))}
              </div>

              {/* Right - View All Button */}
              <button 
                onClick={scrollToNFTs}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-white rounded-lg border border-white/10 transition-all duration-200 group"
              >
                <span className="text-sm">View All</span>
                <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Create Section */}
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
                {activeTab === 'mint' && (
                  <div className='mt-6'>
                    <label className="block text-lg font-semibold text-gray-300 mb-2">Collection</label>
                    <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                      <option>No Collection</option>
                      <option>My Art Collection</option>
                      <option>Digital Assets</option>
                    </select>
                  </div>
                )}
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

                  <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105">
                    {activeTab === 'mint' ? '🚀 Mint NFT' : '📁 Create Collection'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Section with Tabs */}
        <div id="nft-section" className="mb-8">
          {/* View Tab Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-black/30 rounded-lg p-1">
              <button
                onClick={() => setViewTab('nfts')}
                className={`py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  viewTab === 'nfts'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                🖼️ Your NFTs ({userNFTs.length})
              </button>
              <button
                onClick={() => setViewTab('collections')}
                className={`py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  viewTab === 'collections'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                📁 Collections ({userCollections.length})
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none">
                <option>All Chains</option>
                <option>Ethereum</option>
                <option>Solana</option>
                <option>Polygon</option>
                <option>Hedera</option>
              </select>
            </div>
          </div>

          {/* NFTs Tab Content */}
          {viewTab === 'nfts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userNFTs.map((nft) => (
                <div key={nft.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group">
                  <div className="aspect-square bg-gray-800 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                    {nft.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 truncate">{nft.name}</h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">{nft.chain}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        nft.status === 'Minted' 
                          ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                          : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {nft.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{nft.collection}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Collections Tab Content */}
          {viewTab === 'collections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCollections.map((collection) => (
                <div key={collection.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-300">
                    {collection.image}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-white mb-2 text-lg">{collection.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{collection.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{collection.nftCount}</div>
                          <div className="text-xs text-gray-400">NFTs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-blue-400">{collection.chain}</div>
                          <div className="text-xs text-gray-400">Chain</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-blue-300 rounded-lg border border-blue-500/30 transition-all duration-200 text-sm">
                        View Collection
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
