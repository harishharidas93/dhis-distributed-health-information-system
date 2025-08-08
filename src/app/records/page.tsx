'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  FileText, 
  Eye, 
  Share, 
  ShieldOff, 
  Edit, 
  Coins,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { useNFTs } from "@/services/user.service";

// interface MedicalRecord {
//   id: string;
//   nftId: string;
//   title: string;
//   date: string;
//   cid: string;
//   lastUpdated: string;
//   sharedWith: number;
// }

const MyRecords = () => {
  const { user } = useStore();

  const { data: nfts } = useNFTs(user?.walletAddress || '');

  // Mock data
  const records: any[] = (nfts || []).map(nft => ({
    id: nft.id,
    nftId: `${nft.id}`,
    title: nft.name,
    date: nft.createdAt,
    // cid: nft.cid,
    // lastUpdated: nft.lastUpdated,
    // sharedWith: nft.sharedWith
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">My Medical Records</h1>
            <Badge variant="outline" className="ml-auto">
              {records.length} NFTs Owned
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Records Table */}
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
                  <TableHead>Date</TableHead>
                  <TableHead>NFT ID</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Shared With</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{record.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {record.nftId}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.lastUpdated}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {record.sharedWith} providers
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

            {records.length === 0 && (
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
  );
};

export default MyRecords;