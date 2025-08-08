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
import { useStore } from "@/store/store";
import { useAccessRequestByProvider, useHospitalDashboardQueries } from '@/services/user.service';
import { Eye, Clock, ArrowLeft, Send, FileText, CircleX } from "lucide-react";
import { AccessRequest, AccessRequestPayload } from "@/types/accessRequest";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const initialRequestDetails = {
  patientId: "",
  nftId: "",
  reason: "",
  urgency: "medium" as const,
  requestedDuration: "60",
};

const HospitalAccessRequest = () => {
  const { user } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  // Set initial tab based on URL param
  const initialTab = (searchParams?.get("tab") === "manage") ? "manage" : "create";
  const [activeTab, setActiveTab] = useState<"create" | "manage">(initialTab);
  const [newRequest, setNewRequest] = useState(initialRequestDetails);

  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const {
    accessRequestsData,
    pendingRequestsCount,
    isLoading,
    isError
  } = useHospitalDashboardQueries(user?.did || '');

  console.log("Hospital Access Requests:", accessRequestsData);
  console.log("Pending Requests Count:", pendingRequestsCount);
  const { toast } = useToast();
  const accessRequestMutation = useAccessRequestByProvider();

  const handleSubmitRequest = async () => {
    if (!newRequest.patientId || !newRequest.nftId || !newRequest.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const payload: AccessRequestPayload = {
      requestType: "access-request",
      urgency: newRequest.urgency,
      instituitionId: user?.id || "",
      requestedAt: new Date().toISOString(),
      patientId: newRequest.patientId,
      nftId: newRequest.nftId,
      reason: newRequest.reason,
      requestedDuration: Number(newRequest.requestedDuration) || 60,
    };
    try {
      const response = await accessRequestMutation.mutateAsync(payload);
      setRequests([response.message, ...requests]);
      setNewRequest(initialRequestDetails);
      toast({
        title: "Access Request Submitted",
        description: "Your request has been sent to the patient for approval.",
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error?.message || "Could not submit access request.",
        variant: "destructive",
      });
    }
  };

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [pendingSessionRequest, setPendingSessionRequest] = useState<AccessRequest | null>(null);

  const handleAccess = (request: AccessRequest) => {
    setPendingSessionRequest(request);
    setShowPasskeyModal(true);
  };

  const handleSessionStart = async () => {
    if (!pendingSessionRequest || !passkey) return;
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...pendingSessionRequest, passkey }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Session Start Failed',
          description: errorData?.error || 'Could not start session. Please check your passkey or try again.',
          variant: 'destructive',
        });
        setFileUrl(null);
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      }
    } catch (err) {
      toast({
        title: 'Session Start Failed',
        description: 'Could not start session. Please try again.',
        variant: 'destructive',
      });
      setFileUrl(null);
    }
    setShowPasskeyModal(false);
    setPasskey("");
    setPendingSessionRequest(null);
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
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading access requests...</p>
          </div>
        )}
        {/* Error State */}
        {isError && (
          <div className="text-center py-8">
            <span className="inline-block bg-destructive/10 text-destructive px-4 py-2 rounded mb-2">Failed to load access requests</span>
          </div>
        )}
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 w-fit">
          <Button
            variant={activeTab === "create" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setActiveTab("create");
              router.replace("/hospital-access-request?tab=create");
            }}
          >
            Create Request
          </Button>
          <Button
            variant={activeTab === "manage" ? "default" : "ghost"}
            disabled={accessRequestsData.length === 0}
            size="sm"
            onClick={() => {
              setActiveTab("manage");
              router.replace("/hospital-access-request?tab=manage");
            }}
          >
            Manage Requests {accessRequestsData.length > 0 ? `(${accessRequestsData.length})` : ''}
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
                  <Label htmlFor="nftId">NFT ID *</Label>
                  <Input
                    id="nftId"
                    placeholder="Enter NFT ID"
                    value={newRequest.nftId}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, nftId: e.target.value })
                    }
                  />
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
                  <Label htmlFor="requestedDuration">Requested Session Duration (minutes)</Label>
                  <Input
                    id="requestedDuration"
                    type="number"
                    placeholder="60"
                    value={newRequest.requestedDuration}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, requestedDuration: e.target.value })
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
              <Button onClick={handleSubmitRequest} className="w-full" disabled={accessRequestMutation.isPending}>
                {accessRequestMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Access Request
                  </>
                )}
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
                {[...requests, ...accessRequestsData].map((request) => (
                  <div key={request.requestId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{request.patientDetails.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Patient ID: {request.patientDetails.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          NFT ID: {request.nftId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <Badge className={getStatusColor(request.status as 'pending' | 'approved' | 'rejected' | 'active' | 'expired')}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Requested At</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      {request.requestedDuration && (
                        <div>
                          <p className="text-sm font-medium">Session Time</p>
                          <p className="text-sm text-muted-foreground">
                            {request.requestedDuration} minutes
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Reason</p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                    {request.status === "approved" && (
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
                      <Button onClick={() => handleAccess(request)} size="sm" className="mt-2">
                        <FileText className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    )}
      {/* <div>
        {showPasskeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Enter Passkey</h2>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Enter your passkey"
                value={passkey}
                onChange={e => setPasskey(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleSessionStart}
                  disabled={!passkey}
                >
                  Start Session
                </Button>
                <Button variant="ghost" onClick={() => { setShowPasskeyModal(false); setPasskey(""); setPendingSessionRequest(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div> */}
                    {request.status === "rejected" && (
                      <div className="text-sm text-destructive">
                        Your request was rejected by the patient
                      </div>
                    )}
                    {request.status === "pending" && (
                      <Button size="sm" className="mt-2 bg-gray-500 hover:bg-gray-400">
                        <CircleX className="h-4 w-4 mr-2" />
                        Revoke request
                      </Button>
                    )}
                    {request.status === "pending" && (
                      <div className="text-sm text-muted-foreground">
                        Waiting for patient approval...
                      </div>
                    )}
                    {fileUrl && (
                      <iframe
                        src={fileUrl}
                        width="100%"
                        height="800px"
                        title="Decrypted PDF"
                      />
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
      <Dialog open={showPasskeyModal} onOpenChange={setShowPasskeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Passkey</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Enter your passkey"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
          />
          <DialogFooter>
            <Button
                  onClick={handleSessionStart}
                  disabled={!passkey}
                >
                  Start Session
                </Button>
                <Button variant="ghost" onClick={() => { setShowPasskeyModal(false); setPasskey(""); setPendingSessionRequest(null); }}>
                  Cancel
                </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalAccessRequest;
