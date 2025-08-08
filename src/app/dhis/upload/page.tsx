/* eslint-disable */
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Lock, FileText, Coins, ArrowLeft, CheckCircle } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useUploadMedicalRecord } from '@/services/user.service';
import axios from "axios";

const UploadRecord = () => {
  const uploadMedicalRecordMutation = useUploadMedicalRecord();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftId, setNftId] = useState("");
  const [cid, setCid] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEncryptAndUpload = async () => {
    if (!file || !title) return;
    
    setIsEncrypting(true);
    // Simulate encryption and IPFS upload
    // setTimeout(() => {
    //   setCid("QmX8Y9Z3A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T");
    //   setIsEncrypting(false);
    //   setStep(3);
    //   toast({
    //     title: "File Encrypted & Uploaded",
    //     description: "Your medical record has been securely uploaded to IPFS.",
    //   });
    // }, 2000);

    const response = await uploadMedicalRecordMutation.mutateAsync({
        name: title,
        description,
        document: file || undefined,
        walletAddress: user?.walletAddress || '',
      });
      return response;
  };

  const handleMintNFT = async () => {
    setIsMinting(true);
    // Simulate NFT minting
    setTimeout(() => {
      setNftId("dhis-nft-" + Math.random().toString(36).substr(2, 9));
      setIsMinting(false);
      setStep(4);
      toast({
        title: "NFT Successfully Minted!",
        description: "Your health record is now tokenized and secured on the blockchain.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dhis">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">Upload New Record</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <div className={`w-16 h-0.5 ${step > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <div className={`w-16 h-0.5 ${step > 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              3
            </div>
            <div className={`w-16 h-0.5 ${step > 3 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 4 ? 'bg-success text-success-foreground' : 'bg-muted'}`}>
              ✓
            </div>
          </div>
        </div>

        {/* Step 1: File Upload & Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Select Medical Record</span>
              </CardTitle>
              <CardDescription>
                Upload your medical record (PDF, image, or document)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
                {file && (
                  <Badge variant="outline" className="mt-2">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </Badge>
                )}
              </div>
              
              <div>
                <Label htmlFor="title">Record Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Blood Test Results - Jan 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes about this medical record..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!file || !title}
                className="w-full"
              >
                Continue to Encryption
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review & Confirm */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Review Record Details</span>
              </CardTitle>
              <CardDescription>
                Confirm your record details before encryption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>File:</Label>
                <Badge variant="outline">{file?.name}</Badge>
              </div>
              
              <div className="space-y-2">
                <Label>Title:</Label>
                <p className="text-sm">{title}</p>
              </div>

              {description && (
                <div className="space-y-2">
                  <Label>Description:</Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium flex items-center space-x-2 mb-2">
                  <Lock className="h-4 w-4" />
                  <span>Encryption & Upload Process</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• File will be encrypted with AES-256</li>
                  <li>• Uploaded securely to IPFS/Filecoin</li>
                  <li>• Content Identifier (CID) generated</li>
                  <li>• Only you control access to this data</li>
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={handleEncryptAndUpload}
                  disabled={isEncrypting}
                  className="flex-1"
                >
                  {isEncrypting ? (
                    <>
                      <Lock className="h-4 w-4 mr-2 animate-spin" />
                      Encrypting & Uploading...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Encrypt & Upload
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Mint NFT */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Mint NFT</span>
              </CardTitle>
              <CardDescription>
                Create your health record NFT on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-success/10 p-4 rounded-lg">
                <h4 className="font-medium text-success mb-2">✓ File Successfully Encrypted & Uploaded</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <Label>IPFS CID:</Label>
                    <Badge variant="outline" className="ml-2 font-mono text-xs">
                      {cid}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">NFT Metadata Preview</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {title}</div>
                  <div><strong>Description:</strong> {description || "Medical record stored securely"}</div>
                  <div><strong>Encrypted CID:</strong> {cid}</div>
                  <div><strong>Encryption:</strong> AES-256</div>
                </div>
              </div>

              <Button 
                onClick={handleMintNFT}
                disabled={isMinting}
                className="w-full"
              >
                {isMinting ? (
                  <>
                    <Coins className="h-4 w-4 mr-2 animate-spin" />
                    Minting NFT...
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4 mr-2" />
                    Mint NFT
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span>NFT Successfully Created!</span>
              </CardTitle>
              <CardDescription>
                Your health record is now tokenized and secured on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-success/10 p-6 rounded-lg text-center">
                <Coins className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Health Record NFT</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="font-mono">
                    NFT ID: {nftId}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Your medical record is now stored as a dynamic NFT with full ownership control
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button asChild>
                  <Link href="/dhis">
                    Return to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadRecord;
