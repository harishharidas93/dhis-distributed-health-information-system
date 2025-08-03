"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building2, Shield, Users, ArrowRight, Wallet, Mail } from "lucide-react";
import Link from "next/link";
import heroImage from "@/assets/healthcare-hero.jpg";

const HospitalLogin = () => {
  const [credentials, setCredentials] = useState({
    institutionId: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "wallet">("email");
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.institutionId || !credentials.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Institution ID and password.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: "Welcome to dHIS Healthcare Portal",
      });
      setIsLoading(false);
      window.location.href = "/hospital-dashboard";
    }, 2000);
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to healthcare institution wallet",
      });
      setIsLoading(false);
      window.location.href = "/hospital-dashboard";
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
              <CardTitle className="text-2xl">Healthcare Institution Login</CardTitle>
              <CardDescription>
                Access the dHIS platform to manage patient records and healthcare data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Login Method Toggle */}
              <div className="flex gap-2 mb-6">
                <Button
                  type="button"
                  variant={loginMethod === "email" ? "default" : "outline"}
                  onClick={() => setLoginMethod("email")}
                  className="flex-1 gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Institution ID
                </Button>
                <Button
                  type="button"
                  variant={loginMethod === "wallet" ? "default" : "outline"}
                  onClick={() => setLoginMethod("wallet")}
                  className="flex-1 gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Button>
              </div>
              {loginMethod === "email" ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="institutionId">Institution ID</Label>
                    <Input
                      id="institutionId"
                      type="text"
                      placeholder="Enter your institution ID"
                      value={credentials.institutionId}
                      onChange={(e) =>
                        setCredentials({ ...credentials, institutionId: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Sign In with Institution ID
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
                    <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Connect Institution Wallet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your institution&apos;s crypto wallet for secure access
                    </p>
                  </div>
                  <Button onClick={handleWalletLogin} className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </div>
              )}
              <div className="mt-6">
                <Separator />
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Need institutional access?{" "}
                    <Button variant="link" className="p-0 h-auto font-medium">
                      Contact administrator
                    </Button>
                  </p>
                </div>
              </div>
              {/* Features Overview */}
              <div className="mt-8 pt-6 border-t">
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

export default HospitalLogin;
