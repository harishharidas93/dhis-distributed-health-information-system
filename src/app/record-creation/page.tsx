'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RecordCreation = () => {
  const [recordData, setRecordData] = useState({
    patientId: "",
    recordType: "",
    description: "",
    file: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRecordData({ ...recordData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordData.patientId || !recordData.recordType || !recordData.file) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate record creation and NFT assignment
    setTimeout(() => {
      toast({
        title: "Record Created Successfully",
        description: "Encrypted record uploaded and Dynamic NFT assigned to patient.",
      });
      setIsUploading(false);
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
                <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
                </Button>
            </Link>
            <h1 className="text-2xl font-bold">Record Creation</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Flow Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Flow 1: Record Creation
            </CardTitle>
            <CardDescription>
              Hospital uploads encrypted record → assigns via Dynamic NFT to patient
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Medical Record</CardTitle>
            <CardDescription>
              Create an encrypted medical record and assign it to a patient via Dynamic NFT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID *</Label>
                  <Input
                    id="patientId"
                    placeholder="Enter patient identifier"
                    value={recordData.patientId}
                    onChange={(e) =>
                      setRecordData({ ...recordData, patientId: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recordType">Record Type *</Label>
                  <Select
                    value={recordData.recordType}
                    onValueChange={(value) =>
                      setRecordData({ ...recordData, recordType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab-results">Lab Results</SelectItem>
                      <SelectItem value="imaging">Medical Imaging</SelectItem>
                      <SelectItem value="consultation">Consultation Notes</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="surgery">Surgery Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter record description..."
                  value={recordData.description}
                  onChange={(e) =>
                    setRecordData({ ...recordData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                  />
                  <Label htmlFor="file" className="cursor-pointer">
                    <div className="text-sm text-muted-foreground">
                      {recordData.file ? (
                        <span className="text-foreground font-medium">
                          {recordData.file.name}
                        </span>
                      ) : (
                        <>
                          <span className="font-medium">Click to upload</span> or drag and drop
                          <br />
                          PDF, JPG, PNG, DICOM files up to 10MB
                        </>
                      )}
                    </div>
                  </Label>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-2">Security & Privacy</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• File will be encrypted using AES-256 encryption</li>
                      <li>• Dynamic NFT will be assigned to patient&apos;s wallet</li>
                      <li>• Only authorized parties can access the record</li>
                      <li>• All actions are logged on the blockchain</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Record & Assigning NFT...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Create Record & Assign NFT
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordCreation;