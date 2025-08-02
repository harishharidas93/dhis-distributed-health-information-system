'use client';

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

interface AccessRequest {
  id: string;
  providerDID: string;
  providerName: string;
  reason: string;
  requestedRecords: string[];
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
}

const AccessRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: "1",
      providerDID: "did:hedera:testnet:z6MkjcWWGZ8JjCW3YX2bVX9QK1mZ2aX3bY4cZ5dA6eB7fC8g",
      providerName: "Dr. Sarah Johnson",
      reason: "Review blood test results for follow-up consultation",
      requestedRecords: ["Blood Test Results - Jan 2024"],
      date: "2024-01-16 14:30",
      status: 'pending',
      urgency: 'medium'
    },
    {
      id: "2", 
      providerDID: "did:hedera:testnet:z6MkhTYXcWGZ8jjCW3YX2bVX9QK1mZ2aX3bY4cZ5dA6eB7fC",
      providerName: "City General Hospital",
      reason: "Emergency access for current treatment",
      requestedRecords: ["MRI Scan - Knee Injury", "Annual Physical Exam"],
      date: "2024-01-16 09:15",
      status: 'pending',
      urgency: 'high'
    },
    {
      id: "3",
      providerDID: "did:hedera:testnet:z6MkbcDEFGH8jjCW3YX2bVX9QK1mZ2aX3bY4cZ5dA6eB7fC",
      providerName: "Dr. Michael Chen",
      reason: "Second opinion consultation requested by patient",
      requestedRecords: ["Blood Test Results - Jan 2024"],
      date: "2024-01-15 16:45",
      status: 'approved',
      urgency: 'low'
    }
  ]);

  const handleGrantAccess = async (requestId: string) => {
    // Generate temporary access key (simulation)
    const tempKey = "tmp_" + Math.random().toString(36).substr(2, 16);
    
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));

    toast({
      title: "Access Granted",
      description: `Temporary decryption key generated: ${tempKey}`,
    });
  };

  const handleRejectAccess = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));

    toast({
      title: "Access Rejected",
      description: "The access request has been denied.",
      variant: "destructive"
    });
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getProviderInitials = (name: string) => {
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
              {pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-warning">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {getProviderInitials(request.providerName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.providerName}</CardTitle>
                          <CardDescription className="font-mono text-xs">
                            {request.providerDID.substring(0, 40)}...
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
                          {request.requestedRecords.map((record, index) => (
                            <Badge key={index} variant="outline">
                              {record}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Requested: {request.date}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleGrantAccess(request.id)}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Grant Access
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRejectAccess(request.id)}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
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
              {processedRequests.map((request) => (
                <Card key={request.id} className={`opacity-75 ${
                  request.status === 'approved' ? 'border-l-4 border-l-success' : 'border-l-4 border-l-destructive'
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getProviderInitials(request.providerName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{request.providerName}</h4>
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
                      {request.requestedRecords.map((record, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {record}
                        </Badge>
                      ))}
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
