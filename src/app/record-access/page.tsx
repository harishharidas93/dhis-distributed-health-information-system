"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Clock, CheckCircle, XCircle, ArrowLeft, Shield, Eye } from "lucide-react";
import Link from "next/link";

interface AccessRequest {
  id: string;
  requesterName: string;
  requesterType: "hospital" | "clinic" | "specialist";
  recordId: string;
  recordType: string;
  reason: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "active" | "expired" | "completed" | "revoked";
  sessionDuration?: number;
}

const RecordAccess = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: "req-001",
      requesterName: "General Hospital",
      requesterType: "hospital",
      recordId: "record-123",
      recordType: "Lab Results",
      reason: "Patient consultation for ongoing treatment",
      requestedAt: "2024-01-15T10:30:00Z",
      status: "pending",
    },
    {
      id: "req-002",
      requesterName: "Dr. Sarah Wilson",
      requesterType: "specialist",
      recordId: "record-124",
      recordType: "Medical Imaging",
      reason: "Second opinion on MRI results",
      requestedAt: "2024-01-15T09:15:00Z",
      status: "active",
      sessionDuration: 45,
    },
    {
      id: "req-003",
      requesterName: "City Clinic",
      requesterType: "clinic",
      recordId: "record-125",
      recordType: "Prescription",
      reason: "Emergency medication refill",
      requestedAt: "2024-01-14T16:20:00Z",
      status: "expired",
    },
  ]);

  const { toast } = useToast();

  const handleApprove = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: "approved" as const }
        : req
    ));
    toast({
      title: "Access Approved",
      description: "Healthcare provider can now access your medical record.",
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: "rejected" as const }
        : req
    ));
    toast({
      title: "Access Rejected",
      description: "Access request has been denied.",
      variant: "destructive",
    });
  };

  const handleEndSession = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: "expired" as const }
        : req
    ));
    toast({
      title: "Session Ended",
      description: "Access session has been terminated.",
    });
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

  const getRequesterIcon = (type: string) => {
    switch (type) {
      case "hospital": return "🏥";
      case "clinic": return "🏪";
      case "specialist": return "👨‍⚕️";
      default: return "🏥";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Record Access Management</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Flow Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Flow 2: Record Access
            </CardTitle>
            <CardDescription>
              Hospital requests access → patient approves or rejects → session begins and ends
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Active Sessions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Currently active access sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.filter(req => req.status === "active").length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active sessions
              </div>
            ) : (
              <div className="space-y-4">
                {requests.filter(req => req.status === "active").map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-blue-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getRequesterIcon(request.requesterType)}</span>
                        <div>
                          <h4 className="font-medium">{request.requesterName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Accessing: {request.recordType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Clock className="h-4 w-4" />
                          {request.sessionDuration} min remaining
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEndSession(request.id)}
                        >
                          End Session
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Access Requests</CardTitle>
            <CardDescription>
              Manage incoming requests for your medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getRequesterIcon(request.requesterType)}</span>
                      <div>
                        <h4 className="font-medium">{request.requesterName}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {request.requesterType}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Reason for Access</p>
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(request.id)}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {request.status === "active" && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">Session Active</span>
                        <span className="text-muted-foreground">
                          - Provider has temporary access to this record
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordAccess;
