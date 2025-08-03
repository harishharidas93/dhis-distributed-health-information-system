"use client";

import { useState, useEffect } from "react";
import { getConnectedAccountIds, getHashConnect } from '@/services/hashconnect';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSignup } from "@/services/user.service";
import { useStore } from "@/store/store";
import { Building2, Shield, Users, ArrowRight, Wallet } from "lucide-react";
import Link from "next/link";
import heroImage from "@/assets/healthcare-hero.jpg";

const HospitalSignup = () => {
  // Removed unused isLoading state
  const [form, setForm] = useState({
    institutionId: "",
    institutionName: "",
    privateKey: "",
  });
  const router = useRouter();
  const { toast } = useToast();
  const signupMutation = useSignup();
  const {setUser, walletAddress} = useStore();
  const isWalletConnected = !!walletAddress;
  
  useEffect(() => {
    if (walletAddress) {
      signupMutation.mutate(
        {
          institutionId: form.institutionId,
          institutionName: form.institutionName,
          walletAddress,
          type: "hospital",
          privateKey: form.privateKey,
        },
        {
          onSuccess: (data) => {
            setUser(data);
            toast({
              title: "Signup Successful",
              description: `Institution ${data.name} registered with dHIS.`,
            });
            router.push("/hospital-dashboard");
          },
          onError: (error: any) => {
            let description = "An error occurred during signup.";
            if (error?.response?.data?.error) {
              description = error.response.data.error;
            } else if (error?.message) {
              description = error.message;
            }
            toast({
              title: "Signup Failed",
              description,
              variant: "destructive",
            });
          },
        }
      );
    }
  }, [walletAddress]);

  const handleWalletSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institutionId || !form.institutionName || !form.privateKey) {
      toast({
        title: "Missing Information",
        description: "Please enter Institution ID, Institution Name, and Private Key.",
        variant: "destructive",
      });
      return;
    }
    // Connect wallet first; when walletAddress is set, useEffect will trigger signup
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
        <Button asChild variant="ghost" className="flex items-center space-x-3 cursor-pointer p-0">
          <Link href="/">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elegant">
              <span className="text-white font-bold text-lg">dH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">dHIS Healthcare Portal</h1>
              <p className="text-xs text-muted-foreground">Institutional Access</p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/">
            Patient Portal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-96px)]">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Institution Signup</CardTitle>
              <CardDescription>
                Register your healthcare institution to access dHIS features and manage patient records securely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleWalletSignup}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="institutionId">Institution ID</Label>
                    <Input
                      id="institutionId"
                      type="text"
                      placeholder="Enter institution ID"
                      value={form.institutionId}
                      onChange={e => setForm(f => ({ ...f, institutionId: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Institution Name</Label>
                    <Input
                      id="institutionName"
                      type="text"
                      placeholder="Enter institution name"
                      value={form.institutionName}
                      onChange={e => setForm(f => ({ ...f, institutionName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privateKey">Private Key</Label>
                    <Input
                      id="privateKey"
                      type="password"
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter a private key"
                      value={form.privateKey}
                      onChange={e => setForm(f => ({ ...f, privateKey: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      This key will be used whenever you need to allow hospital access to a record.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                    {signupMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Sign Up with Wallet
                      </>
                    )}
                  </Button>
                </div>
              </form>
              <div className="mt-6">
                <Separator />
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Button asChild variant="link" className="p-0 h-auto font-medium">
                      <Link href="/hospital-login">Login</Link>
                    </Button>
                  </p>
                </div>
              </div>
              {/* Features Overview */}
              <div className="mt-4 pt-6 border-t">
                <h3 className="font-medium mb-4 text-center">Platform Features</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Encrypted record management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Patient consent management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Institutional access controls</span>
                  </div>
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

export default HospitalSignup;
