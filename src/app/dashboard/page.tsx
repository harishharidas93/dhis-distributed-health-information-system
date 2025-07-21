'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { 
  Wallet, 
  Upload, 
  Image as ImageIcon, 
  TrendingUp, 
  Delete, 
  CheckCircle, 
  ArrowDown,
  Zap,
  Loader2,
  X
} from "lucide-react";
import { useStore } from '@/store/store';
import { getHashConnect } from '@/services/hashconnect';
import { useRouter } from "next/navigation";
import { useMintNFT, useCreateCollection, useNFTs } from '@/services/nft.service';
import { useMemo } from 'react';

const Index = () => {
  const { walletAddress, setWalletAddress, blockchainType } = useStore();

  // const { walletAddress } = store;
  const router = useRouter();

  // React Query hooks
  const mintNFTMutation = useMintNFT();
  const createCollectionMutation = useCreateCollection();
  
  // Fetch data with react-query
  const { data: userNFTs = [], isLoading: nftsLoading } = useNFTs(walletAddress);

  const userCollections = useMemo(() => {
    const map = new Map();
    userNFTs.forEach(nft => {
      if (nft.token_id && nft.collection) {
        if (!map.has(nft.token_id)) {
          map.set(nft.token_id, { id: nft.token_id, name: nft.collection });
        }
      }
    });
    return Array.from(map.values());
  }, [userNFTs]);

  // Loading state
  const isLoading = mintNFTMutation.isPending || createCollectionMutation.isPending;

  // Form states
  const [nftForm, setNftForm] = useState<{
    name: string;
    description: string;
    collection: string;
    image: File | null;
    imagePreview: string | null;
    newCollectionName?: string;
  }>({
    name: '',
    description: '',
    collection: '',
    image: null,
    imagePreview: null,
    newCollectionName: ''
  });
  
  // Calculate stats from API data
  const recentNFTs = userNFTs.slice(0, 4);
  const totalCollections = userCollections.length;

  // File upload handler (for NFTs only)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPG, PNG, GIF, WEBP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview for NFT
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imagePreview = e.target?.result as string;
      
      setNftForm(prev => ({
        ...prev,
        image: file,
        imagePreview
      }));
    };
    reader.readAsDataURL(file);
  };

  // Clear NFT image
  const clearNFTImage = () => {
    setNftForm(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  // Handle NFT minting with real API
  const handleMintNFT = async () => {
    // Validate form
    if (!nftForm.name || !nftForm.collection || !nftForm.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let collectionObj: { id: string; name: string } | null = null;
    let collectionId: string = '';
    let collectionName: string = '';
    try {
      if (nftForm.collection === "__new__" || userCollections.length === 0) {
        if (!nftForm.newCollectionName) {
          toast({
            title: "Missing collection name",
            description: "Please enter a name for the new collection.",
            variant: "destructive",
          });
          return;
        }
        const { collectionId: newCollectionId } = await createCollectionMutation.mutateAsync({
          name: nftForm.newCollectionName,
          blockchain: blockchainType || 'hedera',
          walletAddress: walletAddress,
          timestamp: new Date().toISOString()
        });
        collectionId = newCollectionId;
        collectionName = nftForm.newCollectionName ?? '';
        collectionObj = { id: String(collectionId), name: String(collectionName) };
      } else {
        // Use existing collection
        const found = userCollections.find(c => c.id === nftForm.collection);
        if (found) {
          collectionObj = { id: found.id, name: found.name };
          collectionId = found.id;
          collectionName = found.name;
        }
      }

      // Mint NFT (signing and receipt handled in service)
      const { serial } = await mintNFTMutation.mutateAsync({
        name: nftForm.name,
        description: nftForm.description,
        blockchain: blockchainType || 'hedera',
        collection: collectionObj,
        image: nftForm.image || undefined,
        walletAddress: walletAddress,
        timestamp: new Date().toISOString()
      });

      setNftForm({
        name: '',
        description: '',
        collection: '',
        image: null,
        imagePreview: null,
        newCollectionName: ''
      });

      toast({
        title: "NFT minted successfully! 🎉",
        description: `${nftForm.name} (NFT #${serial}) minted in collection ${collectionName}`,
      });
    } catch (error: any) {
      toast({
        title: "Error minting NFT",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const scrollToNFTs = () => {
    document.getElementById('nft-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      const hc = await getHashConnect();
      hc.disconnect();
      setWalletAddress('');
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">
            MintBridge
          </h1>
          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2 card-gradient border">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Connected:</span>
                <span className="text-sm font-medium">{walletAddress}</span>
              </div>
            </Card>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Preview Bar */}
        <Card className="card-gradient border glow-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Left - Stats */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">{totalCollections}</div>
                  <div className="text-sm text-muted-foreground">Collections</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{userNFTs.length}</div>
                  <div className="text-sm text-muted-foreground">Total NFTs</div>
                </div>
              </div>

              {/* Center - Recent NFTs Preview */}
              <div className="flex items-center space-x-4">
                {nftsLoading ? (
                  <span className="flex items-center text-sm text-muted-foreground"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...</span>
                ) : recentNFTs.length > 0 ? (
                  <>
                    <span className="text-sm text-muted-foreground">Recent:</span>
                    <div className="flex items-center space-x-2">
                      {recentNFTs.map((nft) => (
                        <div key={nft.id} className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform duration-200 border">
                          {nft.imageUrl ? (
                            <Image src={nft.imageUrl} alt={nft.name} width={50} height={50} className="object-cover w-full h-full" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No Recent Activity</span>
                )}
              </div>

              {/* Right - View All Button */}
              <Button 
                onClick={scrollToNFTs}
                className="button-gradient-secondary glow-effect"
                size="lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View All
                <ArrowDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Section */}
        <Card className="card-gradient border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image Upload (NFT only) */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload NFT Image</h3>
                  <Card className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer card-gradient">
                    <CardContent className="p-8 text-center">
                      {nftForm.imagePreview ? (
                        <div className="relative">
                          <Image src={nftForm.imagePreview} width={300} height={300} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />
                          <Button
                            onClick={clearNFTImage}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg mb-2">Drag & drop your image here</p>
                          <p className="text-muted-foreground text-sm mb-4">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload-nft"
                      />
                      <label htmlFor="file-upload-nft">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" asChild>
                          <div>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Choose File
                          </div>
                        </Button>
                      </label>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">NFT Details</h3>
                {/* Collection selection/creation logic */}
                <div>
                  <label className="block text-sm font-medium mb-2">Collection</label>
                  {userCollections.length === 0 ? (
                    <>
                      <Input
                        value={nftForm.collection}
                        onChange={e => setNftForm(prev => ({ ...prev, collection: e.target.value }))}
                        placeholder="Enter new collection name..."
                        className="bg-muted/50"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        No collections found. A new collection will be created before minting your NFT.
                      </p>
                    </>
                  ) : (
                    <>
                      <Select
                        value={nftForm.collection}
                        onValueChange={value => setNftForm(prev => ({ ...prev, collection: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__new__">Create New Collection</SelectItem>
                          {userCollections.map(collection => (
                            <SelectItem key={collection.id} value={collection.id}>
                              {collection.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {nftForm.collection === "__new__" && (
                        <>
                          <Input
                            value={nftForm.newCollectionName || ''}
                            onChange={e => setNftForm(prev => ({ ...prev, newCollectionName: e.target.value }))}
                            placeholder="Enter new collection name..."
                            className="bg-muted/50 mt-2"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            A new collection will be created before minting your NFT.
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">NFT Name</label>
                    <Input
                      value={nftForm.name}
                      onChange={e => setNftForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter NFT name..."
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input
                      value={nftForm.description}
                      onChange={e => setNftForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your NFT..."
                      className="bg-muted/50"
                    />
                  </div>
                  <Button 
                    onClick={handleMintNFT}
                    className="w-full button-gradient glow-effect"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Mint NFT
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Section with Tabs */}
        <div id="nft-section">
          <div className="flex items-center mb-6 text-lg font-semibold">
            <ImageIcon className="w-4 h-4 mr-2" />
            Your NFTs ({userNFTs.length})
            {nftsLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userNFTs.map((nft) => (
              <Card key={nft.id} className="card-gradient border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {nft.imageUrl ? (
                    <Image src={nft.imageUrl} alt={nft.name} width={200} height={200} className="object-cover w-full h-full" />
                  ) : null}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{nft.name}</h3>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <Badge variant="outline">Hedera</Badge>
                    <Badge className={!nft.deleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {!nft.deleted ? <CheckCircle className="w-3 h-3 mr-1" /> : <Delete className="w-3 h-3 mr-1" />}
                      {nft.deleted ? 'Deleted' : 'Active'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{nft.collection}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

