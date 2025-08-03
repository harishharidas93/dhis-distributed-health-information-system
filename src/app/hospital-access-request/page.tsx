"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Clock, ArrowLeft, Send, FileText } from "lucide-react";
import Link from "next/link";

interface AccessRequest {
  id: string;
  patientId: string;
  patientName: string;
  recordType: string;
  reason: string;
  urgency: "low" | "medium" | "high" | "emergency";
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "active" | "expired";
  sessionDuration?: number;
}

const HospitalAccessRequest = () => {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [newRequest, setNewRequest] = useState({
    patientId: "",
    recordType: "",
    reason: "",
    urgency: "medium" as const,
    sessionDuration: "60",
  });

  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: "req-001",
      patientId: "P-2024-001",
      patientName: "John Doe",
      recordType: "Medical Imaging",
      reason: "Emergency consultation required",
      urgency: "high",
      requestedAt: "2024-01-15T10:30:00Z",
      status: "pending",
    },
    {
      id: "req-002",
      patientId: "P-2024-002",
      patientName: "Jane Smith",
      recordType: "Lab Results",
      reason: "Follow-up treatment planning",
      urgency: "medium",
      requestedAt: "2024-01-15T09:15:00Z",
      status: "approved",
      sessionDuration: 45,
    },
    {
      id: "req-003",
      patientId: "P-2024-003",
      patientName: "Bob Johnson",
      recordType: "Consultation Notes",
      reason: "Second opinion",
      urgency: "low",
      requestedAt: "2024-01-14T16:20:00Z",
      status: "active",
      sessionDuration: 30,
    },
  ]);

  const { toast } = useToast();

  const handleSubmitRequest = () => {
    if (!newRequest.patientId || !newRequest.recordType || !newRequest.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const request: AccessRequest = {
      id: `req-${Date.now()}`,
      patientId: newRequest.patientId,
      patientName: "Patient Name", // Would be fetched from patient lookup
      recordType: newRequest.recordType,
      reason: newRequest.reason,
      urgency: newRequest.urgency,
      requestedAt: new Date().toISOString(),
      status: "pending",
    };
    setRequests([request, ...requests]);
    setNewRequest({
      patientId: "",
      recordType: "",
      reason: "",
      urgency: "medium",
      sessionDuration: "60",
    });
    toast({
      title: "Access Request Submitted",
      description: "Your request has been sent to the patient for approval.",
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-500/20 text-red-700 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-700 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "approved": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "rejected": return "bg-red-500/20 text-red-700 border-red-500/30";
      case "active": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "expired": return "bg-gray-500/20 text-gray-700 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
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
            <h1 className="text-2xl font-bold">Patient Record Access</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Flow Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Flow 2: Record Access Request
            </CardTitle>
            <CardDescription>
              Hospital requests access → patient approves or rejects → session begins and ends
            </CardDescription>
          </CardHeader>
        </Card>
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 w-fit">
          <Button
            variant={activeTab === "create" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("create")}
          >
            Create Request
          </Button>
          <Button
            variant={activeTab === "manage" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("manage")}
          >
            Manage Requests
          </Button>
        </div>
        {/* Create Request Tab */}
        {activeTab === "create" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Request Patient Record Access
              </CardTitle>
              <CardDescription>
                Submit a request to access a patient&apos;s medical records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID *</Label>
                  <Input
                    id="patientId"
                    placeholder="Enter patient identifier"
                    value={newRequest.patientId}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, patientId: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recordType">Record Type *</Label>
                  <Select
                    value={newRequest.recordType}
                    onValueChange={(value) =>
                      setNewRequest({ ...newRequest, recordType: value })
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
                      <SelectItem value="all-records">All Records</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    value={newRequest.urgency}
                    onValueChange={(value) =>
                      setNewRequest({ ...newRequest, urgency: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionDuration">Requested Session Duration (minutes)</Label>
                  <Input
                    id="sessionDuration"
                    type="number"
                    placeholder="60"
                    value={newRequest.sessionDuration}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, sessionDuration: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Access *</Label>
                <Textarea
                  id="reason"
                  placeholder="Provide a detailed explanation for why you need access to this patient's records..."
                  value={newRequest.reason}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, reason: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Request Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about the medical reason for access</li>
                  <li>• Only request the minimum necessary records</li>
                  <li>• Emergency requests are processed immediately</li>
                  <li>• Sessions automatically expire after the specified duration</li>
                </ul>
              </div>
              <Button onClick={handleSubmitRequest} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Access Request
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Manage Requests Tab */}
        {activeTab === "manage" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Access Request Management
              </CardTitle>
              <CardDescription>
                Monitor and manage your submitted access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{request.patientName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Patient ID: {request.patientId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Record Type</p>
                        <p className="text-sm text-muted-foreground">{request.recordType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Requested At</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      {request.sessionDuration && (
                        <div>
                          <p className="text-sm font-medium">Session Time</p>
                          <p className="text-sm text-muted-foreground">
                            {request.sessionDuration} minutes
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Reason</p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                    {request.status === "active" && (
                      <div className="bg-blue-500/10 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-600 font-medium">Session Active</span>
                          <span className="text-sm text-muted-foreground">
                            - You currently have access to this patient&apos;s records
                          </span>
                        </div>
                      </div>
                    )}
                    {request.status === "approved" && (
                      <Button size="sm" className="mt-2">
                        <FileText className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    )}
                    {request.status === "pending" && (
                      <div className="text-sm text-muted-foreground">
                        Waiting for patient approval...
                      </div>
                    )}
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No access requests found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HospitalAccessRequest;
