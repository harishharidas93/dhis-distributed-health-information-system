'use client';

import React, { useEffect } from "react";
import { useSignIn } from '@/services/user.service';
import { getConnectedAccountIds, getHashConnect } from '@/services/hashconnect';
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Wallet, ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import heroImage from "@/assets/healthcare-hero.jpg";
import Link from "next/link";

const Login = () => {
  const { toast } = useToast();
  const router = useRouter();
  const {setUser, walletAddress} = useStore();
  const isWalletConnected = !!walletAddress;

  const signInMutation = useSignIn();

  useEffect(() => {
    if (walletAddress) {
      signInMutation.mutate(
        { walletAddress, type: "patient" },
        {
          onSuccess: (user) => {
            setUser(user);
            toast({
              title: "Login Successful",
              description: `Welcome, ${user.patientName}`,
            });
            router.push("/dashboard");
          },
          onError: (error: any) => {
            toast({
              title: "Login Failed",
              description: error?.message || "An error occurred during login.",
              variant: "destructive",
            });
          },
        }
      );
    }
  }, [walletAddress]);

  const handleWalletLogin = async () => {
    const hc = await getHashConnect();
    if (isWalletConnected) {
      const connectedAccountIds = await getConnectedAccountIds();
      if (connectedAccountIds.length > 0) {
        hc.disconnect();
      }
    } else {
      hc.openPairingModal();
    }
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
              <CardTitle className="text-2xl">Patient Login</CardTitle>
              <CardDescription>
                Access your health records and manage your medical data securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Login Method Toggle */}

              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
                  <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your crypto wallet to access your health records securely
                  </p>
                </div>
                <Button onClick={handleWalletLogin} className="w-full" disabled={signInMutation.isPending}>
                  {signInMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6">
                <Separator />
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href={"/signup"}>
                      <Button variant="link" className="p-0 h-auto font-medium">
                        Sign up for free
                      </Button>
                    </Link>
                  </p>
                </div>
              </div>

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
