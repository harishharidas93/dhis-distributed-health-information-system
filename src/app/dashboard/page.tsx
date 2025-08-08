'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Users, Lock, Coins, Edit, Eye, Share, ShieldOff } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/store/store";
import { nftAPI, QUERY_KEYS, fetchAccessRequests } from "@/services/user.service";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { disconnectHashConnect } from "@/services/hashconnect";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const Dashboard = () => {
  const router = useRouter();
  const { 
    user, 
    setUser, 
    walletAddress,
  } = useStore();
  
  // Memoize the parameters to prevent unnecessary re-renders
  const requestParams = useMemo(() => ({
    walletAddress: user?.walletAddress || '',
    userDid: user?.did || '',
    type: 'request' as const
  }), [user?.walletAddress, user?.did]);

  // Parallel queries using useQueries for better performance
  const results = useQueries({
    queries: [
      {
        queryKey: [QUERY_KEYS.NFTS, walletAddress],
        queryFn: () => nftAPI.getUserNFTs(walletAddress),
        enabled: !!walletAddress,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['accessRequests', requestParams.userDid],
        queryFn: () => fetchAccessRequests({ 
          userDid: requestParams.userDid, 
        }),
        enabled: !!requestParams.userDid,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      }
    ]
  });

  const nftsData = results[0].data || [];
  const accessRequestsData = results[1].data || [];

  const currentNFTCount = nftsData?.length || 0;
  const currentPendingCount = accessRequestsData?.filter((req: any) => req.status === 'pending').length || 0;

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
              <Link href="/access-requests" className="text-muted-foreground hover:text-primary transition-colors">Access Requests</Link>
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

        {/* Summary Tiles & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button asChild className="h-32 flex-col bg-primary hover:bg-primary/90 text-white">
            <Link href="/upload">
              <Upload className="h-8 w-8 mb-2" />
              <span className="text-lg font-semibold">Upload Record</span>
              <span className="text-xs text-white/80">Add new medical record</span>
            </Link>
          </Button>

          <Card className="bg-gradient-subtle">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{currentNFTCount}</div>
              <p className="text-xs text-muted-foreground">
                NFTs minted and secured
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle hover:bg-muted">
            <Link href="/access-requests">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Users className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{currentPendingCount}</div>
                <p className="text-xs text-muted-foreground">
                  Access requests awaiting approval
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Records Table */}
        <div id="records-table" className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Your Tokenized Health Records</span>
              </CardTitle>
              <CardDescription>
                Manage and control access to your medical record NFTs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record Name</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>NFT ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nftsData.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium">{record.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {record.id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ShieldOff className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {nftsData.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Records Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t uploaded any medical records yet.
                  </p>
                  <Button asChild>
                    <Link href="/upload">
                      Upload Your First Record
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
