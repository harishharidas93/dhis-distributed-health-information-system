'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Wallet, Mail, ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import heroImage from "@/assets/healthcare-hero.jpg";
import Link from "next/link";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "wallet">("email");
  const { toast } = useToast();
  const router = useRouter();
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both email and password.",
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
              <CardTitle className="text-2xl">Patient Login</CardTitle>
              <CardDescription>
                Access your health records and manage your medical data securely
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
                  Email
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
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
                        Sign In with Email
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
                    <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Connect Your Wallet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your crypto wallet to access your health records securely
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
                    Don&apos;t have an account?{" "}
                    <Button variant="link" className="p-0 h-auto font-medium">
                      Sign up for free
                    </Button>
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
