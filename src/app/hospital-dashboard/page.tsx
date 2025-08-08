'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  FileText,
  Shield,
  Upload, 
  Search, 
  Eye,
  Clock,
  ArrowRight,
  LogOut,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { disconnectHashConnect } from "@/services/hashconnect";
import { useHospitalDashboardQueries } from "@/services/user.service";

const HospitalDashboard = () => {
  const router = useRouter();
  const { user, setUser } = useStore();
  
  // Use the custom hook for hospital dashboard queries
  const {
    accessRequestsData,
    pendingRequestsCount,
    isLoading,
    isError
  } = useHospitalDashboardQueries(user?.did || '');

  console.log("Hospital Access Requests:", accessRequestsData);
  console.log("Pending Requests Count:", pendingRequestsCount);

  const handleLogout = () => {
    disconnectHashConnect();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{user?.institutionName || user?.name || "Institution"}</h1>
                <p className="text-sm text-muted-foreground">Healthcare Provider Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} asChild variant="outline">
                <Link href="/hospital-login">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Button asChild size="lg" className="h-20 flex-col gap-2">
            <Link href="/hospital-record-creation">
              <Upload className="h-6 w-6" />
              Upload Record
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-20 flex-col gap-2">
            <Link href="/hospital-access-request">
              <Search className="h-6 w-6" />
              Request Access
            </Link>
          </Button>
          <Button 
            disabled={accessRequestsData.length === 0} 
            size="lg" 
            variant="outline" 
            className="h-20 flex-col gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background"
            onClick={() => {
              if (accessRequestsData.length > 0) {
                router.push('/hospital-access-request?tab=manage');
              }
            }}
          >
            <Clock className="h-6 w-6" />
            Pending Requests {accessRequestsData.length > 0 ? `(${accessRequestsData.length})` : ''}
          </Button>
        </div>
        
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
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive">Failed to load access requests</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Platform Features
              </CardTitle>
              <CardDescription>
                Access key functionalities of the dHIS platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Record Management
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create, upload, and manage encrypted patient records with Dynamic NFT assignment
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/hospital-record-creation">
                    Create Record
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Access Requests
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Request access to patient records from other healthcare providers
                </p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/hospital-access-request">
                    Request Access
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
