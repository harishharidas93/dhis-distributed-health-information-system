'use client';

import { useGrantAccessRequest, useRejectAccessRequest, useFetchAccessRequests } from "@/services/user.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Users, 
  Check, 
  X, 
  Clock, 
  Shield,
  Key,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { AccessRequest, AccessRequestPayload } from "@/types/accessRequest";

const AccessRequests = () => {
  const { user } = useStore();
  const grantMutation = useGrantAccessRequest();
  const rejectMutation = useRejectAccessRequest();
  
  const walletAddress = user?.walletAddress || '';
  const userDid = user?.did || '';
  const { data: requests = [], isLoading, isError, error, refetch } = useFetchAccessRequests(walletAddress, userDid, 'request');

  const handleGrantAccess = (requestId: string, nftId: string, instituitionId: string) => {
    const request = requests.find((r: { requestId: string; }) => r.requestId === requestId);
    if (!request) return;
    const payload: AccessRequestPayload = {
      requestType: "access-approval",
      requestId,
      instituitionId,
      patientId: user?.id || "",
      nftId,
    };
    grantMutation.mutate(payload, {
      onSuccess: () => refetch()
    });
  };

  const handleRejectAccess = (requestId: string, nftId: string, instituitionId: string) => {
    const payload: AccessRequestPayload = {
      requestType: "access-reject",
      requestId,
      instituitionId,
      patientId: user?.id || "",
      nftId,
    };
    rejectMutation.mutate(payload, {
      onSuccess: () => refetch()
    });
  };

  const pendingRequests = requests.filter((req: AccessRequest) => req.status === 'pending');
  const processedRequests = requests.filter((req: AccessRequest) => req.status !== 'pending');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getProviderInitials = (name: string) => {
    if (!name) return 'HP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
            <h1 className="text-2xl font-bold text-primary">Access Requests</h1>
            <Badge variant="outline" className="ml-auto">
              {pendingRequests.length} Pending
            </Badge>
          </div>
        </div>
      </header>
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <span className="text-muted-foreground text-lg">Loading access requests...</span>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center py-16">
          <span className="text-destructive text-lg">{error instanceof Error ? error.message : 'Failed to load access requests'}</span>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Pending Requests */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-warning" />
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <Badge variant="outline">{pendingRequests.length}</Badge>
          </div>

          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  You have no pending access requests at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request: AccessRequest) => (
                <Card key={request.requestId} className="border-l-4 border-l-warning">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {getProviderInitials(request.institutionDetails.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.institutionDetails.name}</CardTitle>
                          <CardDescription className="font-mono text-xs">
                            {request.institutionDetails.did.substring(0, 40)}...
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getUrgencyColor(request.urgency)}>
                          {request.urgency} priority
                        </Badge>
                        {request.urgency === 'high' && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Reason for Access:</h4>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Requested Records:</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            {request.recordDetails.name}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Requested: {request.requestedAt}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleGrantAccess(request.requestId, request.nftId, request.institutionDetails.id)}
                          className="flex-1"
                          disabled={grantMutation.isPending || rejectMutation.isPending}
                        >
                          {grantMutation.isPending ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-4 w-4 mr-2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                              </svg>
                              Granting...
                            </span>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Grant Access
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRejectAccess(request.requestId, request.nftId, request.institutionDetails.id)}
                          className="flex-1"
                          disabled={grantMutation.isPending || rejectMutation.isPending}
                        >
                          {rejectMutation.isPending ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-4 w-4 mr-2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                              </svg>
                              Rejecting...
                            </span>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Access History */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Access History</h2>
            <Badge variant="outline">{processedRequests.length}</Badge>
          </div>

          {processedRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Access History</h3>
                <p className="text-muted-foreground">
                  Your processed access requests will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {processedRequests.map((request: AccessRequest) => (
                <Card key={request.requestId} className={`opacity-75 ${
                  request.status === 'approved' ? 'border-l-4 border-l-success' : 'border-l-4 border-l-destructive'
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getProviderInitials(request.institutionDetails.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{request.institutionDetails.name}</h4>
                          <p className="text-xs text-muted-foreground">{request.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                          {request.status === 'approved' ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Approved
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Rejected
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">
                        {request.recordDetails.name}
                      </Badge>
                    </div>
                    {request.status === 'approved' && (
                      <div className="mt-2 flex items-center space-x-2 text-xs text-success">
                        <Key className="h-3 w-3" />
                        <span>Temporary access key generated</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessRequests;
