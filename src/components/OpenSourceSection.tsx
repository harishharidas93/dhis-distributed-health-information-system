'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Github, 
  Star, 
  GitFork, 
  Users, 
  Code, 
  ArrowRight,
  Heart,
  Zap
} from "lucide-react";

const stats = [
  { icon: Star, label: "GitHub Stars", value: "2.4K+", color: "text-yellow-500" },
  { icon: GitFork, label: "Forks", value: "340+", color: "text-blue-500" },
  { icon: Users, label: "Contributors", value: "89", color: "text-green-500" },
  { icon: Code, label: "Commits", value: "1.2K+", color: "text-purple-500" }
];

const features = [
  {
    title: "Modular Architecture",
    description: "Built with composable components. Use what you need, extend what you want.",
    icon: GitBranch
  },
  {
    title: "Developer Friendly",
    description: "Clean APIs, extensive documentation, and TypeScript support out of the box.",
    icon: Code
  },
  {
    title: "Community Driven",
    description: "Built by developers, for developers. Your contributions shape the future.",
    icon: Users
  }
];

export const OpenSourceSection = () => {
  return (
    <section className="py-24 px-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400 mb-6 px-4 py-2">
            <Heart className="w-4 h-4 mr-2" />
            Open Source
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Built by</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Developers, for Developers
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MintBridge is completely open source. Fork it, customize it, contribute to it. 
            Build the future of NFT minting together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="card-neon p-6 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* GitHub CTA */}
          <Card className="card-neon p-8 text-center">
            <Github className="w-12 h-12 mx-auto mb-6 text-foreground" />
            <h3 className="text-2xl font-bold mb-4">Explore the Code</h3>
            <p className="text-muted-foreground mb-6">
              Dive into the codebase, explore the architecture, and see how we built 
              the most flexible NFT minting platform.
            </p>
            <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>

          {/* Contribute CTA */}
          <Card className="card-neon p-8 text-center">
            <Zap className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-bold mb-4">Start Contributing</h3>
            <p className="text-muted-foreground mb-6">
              Join our growing community of contributors. From bug fixes to new features, 
              every contribution matters.
            </p>
            <Button variant="neon" size="lg">
              <GitBranch className="w-5 h-5 mr-2" />
              Contribute Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Licensed under MIT • Free forever • No vendor lock-in
          </p>
        </div>
      </div>
    </section>
  );
};