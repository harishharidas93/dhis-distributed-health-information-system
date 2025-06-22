
type NFT = {
  id: string;
  image: React.ReactNode;
  name: string;
  chain: string;
  status: string;
};

export default async function NftsDashboard() {
    const userNFTs: NFT[] = await fetch('api/hedera/nfts').then(res => res.json());

  return (
    <div className="mb-8">
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
    </div>
  );
}
