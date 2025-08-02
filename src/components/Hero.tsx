'use client';

import { Button } from "@/components/ui/button";
import { Shield, Lock, Users, ArrowRight } from "lucide-react";
import Link from 'next/link';
import heroImage from "@/assets/healthcare-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-hero overflow-hidden">
      {/* Top Navigation */}
      <header className="relative z-20 flex items-center justify-between p-6">
        <Link 
          className="flex items-center space-x-3 cursor-pointer"
          href="/"
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elegant">
            <span className="text-white font-bold text-lg">dH</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">dHIS</h1>
            <p className="text-xs text-muted-foreground">Distributed Health Info</p>
          </div>
        </Link>
        <Link href="/hospital-login">
          <Button 
            variant="ghost" 
            className="gap-2"
          >
            Healthcare Portal
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="w-5 h-5 text-trust-blue" />
              <span className="text-sm font-medium">Secure</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Lock className="w-5 h-5 text-trust-green" />
              <span className="text-sm font-medium">Private</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="w-5 h-5 text-security-purple" />
              <span className="text-sm font-medium">Patient-Owned</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Take Ownership of Your Health Data
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            dHIS empowers you to store, manage, and share medical records securely with blockchain, NFTs, and DIDs. 
            Your health data, your control, your future.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-white shadow-medium px-8 py-6 text-lg font-semibold rounded-xl transition-smooth">
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-soft px-8 py-6 text-lg font-semibold rounded-xl transition-smooth"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slide-up">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Patient Controlled</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-secondary mb-2">256-bit</div>
              <div className="text-muted-foreground">AES Encryption</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold text-trust-blue mb-2">Zero</div>
              <div className="text-muted-foreground">Data Breaches</div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default Hero;