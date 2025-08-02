'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Coins,
  Lock
} from "lucide-react";
import Link from "next/link";

interface MedicalRecord {
  id: string;
  nftId: string;
  title: string;
  date: string;
  cid: string;
  lastUpdated: string;
  sharedWith: number;
}

const MyRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data
  const records: MedicalRecord[] = [
    {
      id: "1",
      nftId: "dhis-nft-abc123",
      title: "Blood Test Results - Jan 2024",
      date: "2024-01-15",
      cid: "QmX8Y9Z3A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T",
      lastUpdated: "2024-01-15",
      sharedWith: 2
    },
    {
      id: "2", 
      nftId: "dhis-nft-def456",
      title: "MRI Scan - Knee Injury",
      date: "2024-01-10",
      cid: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W",
      lastUpdated: "2024-01-12",
      sharedWith: 1
    },
    {
      id: "3",
      nftId: "dhis-nft-ghi789", 
      title: "Annual Physical Exam",
      date: "2023-12-20",
      cid: "QmB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X",
      lastUpdated: "2023-12-20",
      sharedWith: 0
    }
  ];

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button asChild>
            <Link href="/upload">
              <FileText className="h-4 w-4 mr-2" />
              Upload New Record
            </Link>
          </Button>
        </div>

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
                  <TableHead>CID</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Shared With</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
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
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="font-mono text-xs">
                          {record.cid.substring(0, 8)}...
                        </Badge>
                      </div>
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

            {filteredRecords.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Records Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No records match your search." : "You haven't uploaded any medical records yet."}
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

        {/* NFT Preview Cards */}
        {filteredRecords.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">NFT Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.slice(0, 3).map((record) => (
                <Card key={record.id} className="bg-gradient-subtle border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Coins className="h-6 w-6 text-primary" />
                      <Badge variant="secondary" className="text-xs">NFT</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">{record.title}</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>Token ID: {record.nftId}</div>
                      <div>Created: {record.date}</div>
                      <div className="flex items-center space-x-1">
                        <Lock className="h-3 w-3" />
                        <span>Encrypted & Secured</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecords;