'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, Copy, ExternalLink, LogOut, Settings, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WalletInfo = () => {
  const [isConnected] = useState(true); // In real app, this would come from wallet context
  const { toast } = useToast();

  // Mock wallet data - in real app, this would come from wallet provider
  const walletData = {
    address: "0x742d35Cc6644C0532925a3b8b8d88f4434b0C8bb",
    balance: "12.345",
    network: "Ethereum",
    ens: null,
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address);
    toast({
      title: "Address copied",
      description: "Wallet address has been copied to clipboard.",
    });
  };

  const handleDisconnect = () => {
    // In real app, this would disconnect the wallet
    toast({
      title: "Wallet disconnected",
      description: "You have been disconnected from your wallet.",
    });
  };

  if (!isConnected) {
    return (
      <Button variant="outline">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-3 px-4 py-6 h-auto">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${walletData.address}`} />
            <AvatarFallback>
              <Wallet className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {walletData.ens || shortenAddress(walletData.address)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {walletData.network}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {walletData.balance} ETH
            </span>
          </div>
          
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${walletData.address}`} />
                  <AvatarFallback>
                    <Wallet className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {walletData.ens || shortenAddress(walletData.address)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {walletData.balance} ETH
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Wallet Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};