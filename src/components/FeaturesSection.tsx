'use client';

import { Card } from "@/components/ui/card";
import { 
  Wallet, 
  Link, 
  Upload, 
  Zap, 
  GitBranch, 
  BarChart3,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Multi-Wallet Support",
    description: "Connect MetaMask, WalletConnect, Phantom, HashPack and more. All from one interface.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Link,
    title: "Multi-Chain Minting",
    description: "Mint on Ethereum, Solana, Hedera, Polygon without switching wallets or interfaces.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Upload,
    title: "Intuitive UX",
    description: "Connect wallet, Upload image, enter metadata, mint. Simple 4-step process.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Zero Wallet Switching",
    description: "Manage all your wallets and chains from one unified dashboard.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: GitBranch,
    title: "Open Source & Modular",
    description: "Built for developers. Fork, customize, and contribute to the future of NFT minting.",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboard",
    description: "Track your mint history, analyze performance, and monitor all chains in real-time.",
    gradient: "from-red-500 to-pink-500"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="text-primary font-semibold">Core Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-foreground">to Mint Anywhere</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for both beginners and power users. 
            One platform, infinite possibilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-neon p-8 group cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Secure</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <Layers className="w-4 h-4" />
            <span>Modular</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <GitBranch className="w-4 h-4" />
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </section>
  );
};