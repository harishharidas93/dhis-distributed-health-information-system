/* eslint-disable */
'use client';

import React, { useEffect, useState } from "react";
import { useSignup } from '@/services/user.service';
import { useStore } from "@/store/store";
import { userAPI } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Wallet, ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import heroImage from "@/assets/healthcare-hero.jpg";
import Link from "next/link";
import { getConnectedAccountIds, getHashConnect } from '@/services/hashconnect';

const Signup = () => {
  // Remove isLoading, use mutation.isPending instead
  const [name, setName] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { walletAddress, setUser, setWalletAddress } = useStore();
  const isWalletConnected = !!walletAddress;
  
  useEffect(() => {
    // Only trigger signup if walletAddress is set and form fields are filled
    if (walletAddress && name && privateKey) {
      signupMutation.mutate(
        { patientName: name, walletAddress, type: "patient", privateKey },
        {
          onSuccess: (user) => {
            setUser(user);
            toast({
              title: "Signup Successful",
              description: `Welcome, ${user.patientName}`,
            });
            router.push("/dashboard");
          },
          onError: (error: any) => {
            toast({
              title: "Signup Failed",
              description: error?.message || "An error occurred during signup.",
              variant: "destructive",
            });
          },
        }
      );
    }
  }, [walletAddress, name, privateKey]);

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

  const signupMutation = useSignup();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !privateKey) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    // Connect wallet first; when walletAddress is set, useEffect will trigger signup
    handleWalletConnection();
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
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Create your account as a patient or hospital
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Login Method Toggle */}

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="patientName" className="block text-sm font-medium">Name</label>
                  <input
                    id="patientName"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="privateKey" className="block text-sm font-medium">Private Key</label>
                  <input
                    id="privateKey"
                    type="password"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter a private key"
                    value={privateKey}
                    onChange={e => setPrivateKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This key will be used whenever you need to allow hospital access to a record.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                  {signupMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing up...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Sign Up with Wallet
                    </>
                  )}
                </Button>
              </form>

              {/* <Separator /> */}
              <div className="mt-6">
                <Separator />
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href={"/login"}>
                      <Button variant="link" className="p-0 h-auto font-medium">
                        Sign in
                      </Button>
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-4 pt-4 border-t">
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

export default Signup;
