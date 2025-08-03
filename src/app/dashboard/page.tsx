'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Shield, Users, Lock, Activity } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { disconnectHashConnect } from "@/services/hashconnect";

const Dashboard = () => {
  const router = useRouter();
  const {user, setUser} = useStore();
  const handleLogout = () => {
    disconnectHashConnect();
    setUser(null);
    router.push("/login");
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
                Patient Dashboard
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/records" className="text-muted-foreground hover:text-primary transition-colors">My Records</Link>
              <Link href="/access-requests" className="text-muted-foreground hover:text-primary transition-colors">Access Requests</Link>
              <Link href="/emergency-access" className="text-muted-foreground hover:text-primary transition-colors">Emergency Access</Link>
              <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">Profile</Link>
              <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back{user?.patientName ? `, ${user.patientName}` : ""}!
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Your DID:</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {user?.did?.substring(0, 30)}...
            </Badge>
            <Lock className="h-4 w-4 text-success" />
          </div>
        </div>

        {/* Summary Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-subtle">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-xs text-muted-foreground">
                NFTs minted and secured
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">3</div>
              <p className="text-xs text-muted-foreground">
                Access requests awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Access</CardTitle>
              <Shield className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Active</div>
              <p className="text-xs text-muted-foreground">
                2 providers pre-authorized
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex-col">
              <Link href="/upload">
                <Upload className="h-6 w-6 mb-2" />
                Upload Record
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/records">
                <FileText className="h-6 w-6 mb-2" />
                View Records
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/access-requests">
                <Users className="h-6 w-6 mb-2" />
                Grant Access
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates to your health records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span className="text-sm">Blood test results uploaded and minted as NFT</span>
                <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span className="text-sm">Access granted to Dr. Sarah Johnson</span>
                <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-warning rounded-full"></div>
                <span className="text-sm">Emergency access activated for City Hospital</span>
                <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
