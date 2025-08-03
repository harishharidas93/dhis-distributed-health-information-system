'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Wallet, ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import heroImage from "@/assets/healthcare-hero.jpg";
import Link from "next/link";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username) {
      toast({
        title: "Missing Credentials",
        description: "Please enter your username.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: "Welcome to dHIS Patient Portal",
      });
      setIsLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your crypto wallet",
      });
      setIsLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      />
      
      {/* Header */}
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

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-96px)]">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Patient Signup</CardTitle>
              <CardDescription>
                Create your account to take control of your health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Login Method Toggle */}

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({ ...credentials, username: e.target.value })
                    }
                    required
                  />
                </div>
              </form>
              <div className="space-y-4 mt-4">
                <Button onClick={handleWalletLogin} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing up...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Signup using wallet
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              {/* Security Notice */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Your data is encrypted and secured with blockchain technology</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
    </div>
  );
};

export default Login;
