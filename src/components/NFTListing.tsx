import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreVertical, DollarSign, Eye, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - in a real app, this would come from an API
const mockNFTs = [
  {
    id: 1,
    name: "Digital Sunset #1",
    image: "/placeholder.svg",
    category: "Art",
    price: "2.5 ETH",
    status: "Listed",
    views: 1250,
    likes: 89,
  },
  {
    id: 2,
    name: "Cyber Cat Collection",
    image: "/placeholder.svg",
    category: "Gaming",
    price: "1.8 ETH",
    status: "Owned",
    views: 892,
    likes: 156,
  },
  {
    id: 3,
    name: "Abstract Dreams",
    image: "/placeholder.svg",
    category: "Art",
    price: "3.2 ETH",
    status: "Listed",
    views: 2100,
    likes: 234,
  },
];

export const NFTListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredNFTs = mockNFTs.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || nft.category.toLowerCase() === selectedCategory;
    const matchesStatus = selectedStatus === "all" || nft.status.toLowerCase() === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="art">Art</SelectItem>
            <SelectItem value="photography">Photography</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="gaming">Gaming</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="collectibles">Collectibles</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="owned">Owned</SelectItem>
            <SelectItem value="listed">Listed</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* NFT Grid */}
      {filteredNFTs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" ? (
                <p>No NFTs match your current filters.</p>
              ) : (
                <div>
                  <p className="mb-2">You don't have any NFTs yet.</p>
                  <p className="text-sm">Start by minting your first NFT!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <Card key={nft.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DollarSign className="h-4 w-4 mr-2" />
                          {nft.status === "Listed" ? "Update Price" : "List for Sale"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant={nft.status === "Listed" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {nft.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-base mb-2 line-clamp-1">{nft.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{nft.category}</span>
                    <span className="font-medium text-foreground">{nft.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{nft.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>♥</span>
                      <span>{nft.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant={nft.status === "Listed" ? "outline" : "default"} 
                  size="sm" 
                  className="w-full"
                >
                  {nft.status === "Listed" ? "Manage Listing" : "List for Sale"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};