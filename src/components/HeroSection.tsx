'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import futuristicBg from "@/assets/futuristic-bg.jpg";
import { WalletConnectionModal } from "@/components/WalletConnectionModal";
import { useEffect, useState } from "react";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { walletAddress, setWalletAddress } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (walletAddress) {
      router.push('/dashboard');
      setIsWalletModalOpen(false);
    }
  }, [walletAddress, router]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Futuristic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${futuristicBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Side - Main Content */}
        <div className="lg:col-span-7 text-center lg:text-left">
          {/* Badge */}
          <div className="mb-8 animate-fade-in">
            <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary-glow px-4 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Open Source • Multi-Chain • Zero Setup
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Mint Across Chains.
            </span>
            <br />
            <span className="text-foreground">
              No Setup. Just Click.
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl">
            Bridge Wallets. Bridge Chains. Mint Seamlessly.
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
            The unified, open-source NFT minting platform that connects all your wallets and chains in one beautiful interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Button 
              variant="neon" 
              size="lg" 
              className="text-lg px-8 py-6 h-auto animate-glow"
              onClick={() => setIsWalletModalOpen(true)}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Minting Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto border-primary/50 hover:bg-primary/10"
            >
              View on GitHub
            </Button>
          </div>

          {/* Supported Chains */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <div className="chain-ethereum px-4 py-2 rounded-full text-sm font-medium">
              Ethereum
            </div>
            <div className="chain-solana px-4 py-2 rounded-full text-sm font-medium">
              Solana
            </div>
            <div className="chain-hedera px-4 py-2 rounded-full text-sm font-medium">
              Hedera
            </div>
            <div className="chain-polygon px-4 py-2 rounded-full text-sm font-medium">
              Polygon
            </div>
          </div>
        </div>

      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal 
        open={isWalletModalOpen} 
        onOpenChange={setIsWalletModalOpen} 
      />
    </section>
  );
};