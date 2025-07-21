'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useStore } from '@/store/store';
import { getConnectedAccountIds, getHashConnect } from '@/services/hashconnect';

const wallets = [
  { name: "MetaMask", color: "from-orange-500 to-yellow-500", active: false },
  { name: "WalletConnect", color: "from-blue-500 to-cyan-500", active: false },
  { name: "Phantom", color: "from-purple-500 to-pink-500", active: false },
  { name: "HashPack", color: "from-green-500 to-emerald-500", active: true }
];

interface WalletConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletConnectionModal = ({ open, onOpenChange }: WalletConnectionModalProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { walletAddress } = useStore();
  const isWalletConnected = !!walletAddress;
  
  const handleWalletConnection = async () => {
    const hc = await getHashConnect();
    // TODO: may not be needed, checks if hc is already initialized
    // await getInitPromise();
    if (isWalletConnected) {
      const connectedAccountIds = await getConnectedAccountIds();
      if (connectedAccountIds.length > 0) {
        hc.disconnect();
      }
    } else {
      hc.openPairingModal();
    }
  };

  const handleWalletConnect = (walletName: string) => {
    // Simulate wallet connection


    if (walletName === "HashPack") {
      // hc.pairingEvent.on(() => {
      //   const connectedAccountIds = getConnectedAccountIds();
      //   if (connectedAccountIds.length > 0) {
      //     toast({
      //       title: "Wallet Connected",
      //       description: `Successfully connected to ${walletName}`,
      //     });
      //     onOpenChange(false);
      //     router.push("/dashboard");
      //   } else {
      //     toast({
      //       title: "Connection Failed",
      //       description: "Please try again.",
      //       variant: "destructive",
      //     });
      //   }
      // });

      handleWalletConnection();
    } else {
      setTimeout(() => {
        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${walletName}`,
        });
        onOpenChange(false);
        router.push("/dashboard");
      }, 1000);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-sm border-border/50">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose from our supported wallets to start minting
          </DialogDescription>
        </DialogHeader>

        {/* Wallet Options */}
        <div className="space-y-3 mb-6">
          {wallets.map((wallet, index) => (
            <Button
              key={index}
              disabled={!wallet.active || isWalletConnected}
              variant="outline"
              className="w-full justify-between p-4 h-auto border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              onClick={() => handleWalletConnect(wallet.name)}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 bg-gradient-to-r ${wallet.color} rounded-lg mr-3 flex items-center justify-center`}>
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-foreground" >{wallet.name}</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                {wallet.active ? <CheckCircle className="w-4 h-4 text-green-500" /> : null}
              </div>
            </Button>
          ))}
        </div>

        <div className="text-center">
            <Button 
              variant="connect-wallet" 
              className="w-full text-lg py-6 h-auto"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            Secure connection • Your keys, your NFTs
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
