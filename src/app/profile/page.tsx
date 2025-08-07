'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Key, Download, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Profile = () => {
  const [copied, setCopied] = useState(false);
  
  // Mock user data
  const userDID = "did:hedera:testnet:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK";
  const publicKey = "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK...";
  
  const handleCopyDID = () => {
    navigator.clipboard.writeText(userDID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">dHIS</h1>
              <Badge variant="outline" className="text-sm">
                My Profile
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/records" className="text-muted-foreground hover:text-primary transition-colors">My Records</Link>
              <Link href="/access-requests" className="text-muted-foreground hover:text-primary transition-colors">Access Requests</Link>
              <Link href="/profile" className="text-foreground hover:text-primary transition-colors">Profile</Link>
              <Button variant="outline" size="sm">Logout</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Profile</h2>
          <p className="text-muted-foreground">Manage your identity and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Identity Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Identity Information</span>
              </CardTitle>
              <CardDescription>
                Your decentralized identity details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="did">Decentralized Identifier (DID)</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    id="did" 
                    value={userDID} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyDID}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="publicKey">Public Key</Label>
                <Input 
                  id="publicKey" 
                  value={publicKey} 
                  readOnly 
                  className="font-mono text-xs mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="walletAddress">Connected Wallet</Label>
                <Input 
                  id="walletAddress" 
                  value="0x742d35Cc4Bf8374C51c41E13a7d4B51"
                  readOnly 
                  className="font-mono text-xs mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Keys</span>
              </CardTitle>
              <CardDescription>
                Manage your cryptographic keys and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Private Key</h4>
                  <p className="text-sm text-muted-foreground">Securely stored locally</p>
                </div>
                <Badge variant="secondary" className="text-success">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Regenerate Key Pair
              </Button>
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Backup Credentials
              </Button>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Your dHIS platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <p className="text-sm text-muted-foreground">Records Minted</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">8</div>
                  <p className="text-sm text-muted-foreground">Access Grants</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <p className="text-sm text-muted-foreground">Total Interactions</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-success">Active</div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Profile Activity</CardTitle>
              <CardDescription>Latest security and identity events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-success rounded-full"></div>
                  <span className="text-sm">Profile last accessed</span>
                  <span className="text-xs text-muted-foreground ml-auto">Just now</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm">DID verified successfully</span>
                  <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-warning rounded-full"></div>
                  <span className="text-sm">Key pair regenerated</span>
                  <span className="text-xs text-muted-foreground ml-auto">1 week ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
