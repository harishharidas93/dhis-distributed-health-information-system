"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Users, ArrowLeft, Coins, CheckCircle } from "lucide-react";
import Link from "next/link";

interface PatientData {
  patientId: string;
  walletAddress: string;
  name: string;
  email: string;
  phone: string;
}

const HospitalRecordCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [recordData, setRecordData] = useState({
    patientId: "",
    recordType: "",
    description: "",
    diagnosis: "",
    treatment: "",
    file: null as File | null,
  });
  
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: "",
    walletAddress: "",
    name: "",
    email: "",
    phone: "",
  });

  const [nftSettings, setNftSettings] = useState({
    assignToPatient: true,
    enableSharing: true,
    expiryDate: "",
    accessLevel: "standard",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRecordData({ ...recordData, file: e.target.files[0] });
    }
  };

  const handlePatientLookup = () => {
    if (!recordData.patientId) {
      toast({
        title: "Patient ID Required",
        description: "Please enter a patient ID to lookup",
        variant: "destructive",
      });
      return;
    }
    // Simulate patient lookup
    setPatientData({
      patientId: recordData.patientId,
      walletAddress: "0x1234567890abcdef...",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
    });
    toast({
      title: "Patient Found",
      description: "Patient data retrieved successfully",
    });
    setCurrentStep(2);
  };

  const handleCreateAndMint = async () => {
    if (!recordData.file || !recordData.recordType) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    // Simulate record creation and NFT minting process
    setTimeout(() => {
      toast({
        title: "Record Created & NFT Minted",
        description: "Patient record has been encrypted and Dynamic NFT has been assigned",
      });
      setIsProcessing(false);
      setCurrentStep(4);
    }, 4000);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setRecordData({
      patientId: "",
      recordType: "",
      description: "",
      diagnosis: "",
      treatment: "",
      file: null,
    });
    setPatientData({
      patientId: "",
      walletAddress: "",
      name: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/hospital-dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Healthcare Record Creation</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Flow 1: Record Creation & NFT Assignment
            </CardTitle>
            <CardDescription>
              Upload encrypted record → assign via Dynamic NFT to patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-24 h-1 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Patient ID</span>
              <span>Record Details</span>
              <span>NFT Settings</span>
              <span>Complete</span>
            </div>
          </CardContent>
        </Card>
        {/* Step 1: Patient Identification */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Step 1: Patient Identification
              </CardTitle>
              <CardDescription>
                Enter patient ID to lookup and verify patient information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input
                  id="patientId"
                  placeholder="Enter patient identifier (e.g., P-2024-001)"
                  value={recordData.patientId}
                  onChange={(e) =>
                    setRecordData({ ...recordData, patientId: e.target.value })
                  }
                />
              </div>
              <Button onClick={handlePatientLookup} className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Lookup Patient
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Step 2: Record Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Patient Name</Label>
                    <p className="font-medium">{patientData.name}</p>
                  </div>
                  <div>
                    <Label>Wallet Address</Label>
                    <p className="font-mono text-sm">{patientData.walletAddress}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{patientData.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{patientData.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Record Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Step 2: Medical Record Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="discharge">Discharge Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    placeholder="Primary diagnosis"
                    value={recordData.diagnosis}
                    onChange={(e) =>
                      setRecordData({ ...recordData, diagnosis: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Input
                    id="treatment"
                    placeholder="Treatment provided"
                    value={recordData.treatment}
                    onChange={(e) =>
                      setRecordData({ ...recordData, treatment: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the medical record..."
                    value={recordData.description}
                    onChange={(e) =>
                      setRecordData({ ...recordData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Medical File *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx"
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
                            PDF, JPG, PNG, DICOM, DOC files up to 50MB
                          </>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(3)} className="w-full">
                  Continue to NFT Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Step 3: NFT Settings */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Step 3: Dynamic NFT Configuration
              </CardTitle>
              <CardDescription>
                Configure the Dynamic NFT settings for this medical record
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assignToPatient"
                    checked={nftSettings.assignToPatient}
                    onCheckedChange={(checked) =>
                      setNftSettings({ ...nftSettings, assignToPatient: checked as boolean })
                    }
                  />
                  <Label htmlFor="assignToPatient" className="text-sm font-medium">
                    Assign NFT to patient&apos;s wallet
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableSharing"
                    checked={nftSettings.enableSharing}
                    onCheckedChange={(checked) =>
                      setNftSettings({ ...nftSettings, enableSharing: checked as boolean })
                    }
                  />
                  <Label htmlFor="enableSharing" className="text-sm font-medium">
                    Enable controlled sharing capabilities
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select
                    value={nftSettings.accessLevel}
                    onValueChange={(value) =>
                      setNftSettings({ ...nftSettings, accessLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Access</SelectItem>
                      <SelectItem value="standard">Standard Access</SelectItem>
                      <SelectItem value="extended">Extended Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Access Expiry (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={nftSettings.expiryDate}
                    onChange={(e) =>
                      setNftSettings({ ...nftSettings, expiryDate: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* NFT Preview */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">NFT Configuration Summary</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Patient:</strong> {patientData.name}</p>
                  <p><strong>Record Type:</strong> {recordData.recordType}</p>
                  <p><strong>Assigned to:</strong> {patientData.walletAddress}</p>
                  <p><strong>Access Level:</strong> {nftSettings.accessLevel}</p>
                  <p><strong>Sharing Enabled:</strong> {nftSettings.enableSharing ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleCreateAndMint} className="flex-1" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      Create Record & Mint NFT
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Step 4: Completion */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Record Created Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                The medical record has been encrypted and the Dynamic NFT has been assigned to the patient&apos;s wallet.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
                <h3 className="font-medium mb-2">Transaction Details</h3>
                <div className="text-sm space-y-1">
                  <p><strong>NFT ID:</strong> #DHIS-{Date.now()}</p>
                  <p><strong>Patient:</strong> {patientData.name}</p>
                  <p><strong>Record Type:</strong> {recordData.recordType}</p>
                  <p><strong>Blockchain:</strong> Ethereum Mainnet</p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetForm}>
                  Create Another Record
                </Button>
                <Button asChild variant="outline">
                  <Link href="/hospital-dashboard">
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

export default HospitalRecordCreation;
