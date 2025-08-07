'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { useHospitalDashboardQueries } from "@/services/user.service";
import { AccessRequest } from "@/types/accessRequest";

const HospitalPendingRequests = () => {
  const { user } = useStore();
  
  // Use the same hook as hospital dashboard - React Query will use cached data
  const { accessRequestsData, isLoading, isError } = useHospitalDashboardQueries(user?.did || '');
  
  // Filter only pending requests
  const pendingRequests = accessRequestsData?.filter((req: AccessRequest) => req.status === 'pending') || [];

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
              <Link href="/hospital-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">Pending Access Requests</h1>
            <Badge variant="outline" className="ml-auto">
              {pendingRequests.length} Pending
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading pending requests...</p>
          </div>
        )}
        
        {/* Error State */}
        {isError && (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive">Failed to load pending requests</p>
          </div>
        )}

        {/* Pending Requests List */}
        {!isLoading && !isError && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">
                    You don&apos;t have any pending access requests at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request: AccessRequest) => (
                <Card key={request.requestId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getProviderInitials(request.institutionDetails?.name || '')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {request.institutionDetails?.name || 'Unknown Institution'}
                            </h3>
                            <Badge variant={getUrgencyColor(request.urgency)}>
                              {request.urgency} Priority
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">
                            Requesting access to: <strong>{request.recordDetails?.name}</strong>
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {request.reason}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Duration: {request.requestedDuration} minutes</span>
                            <span>Type: {request.accessType}</span>
                            <span>Requested: {new Date(request.requestedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalPendingRequests; 