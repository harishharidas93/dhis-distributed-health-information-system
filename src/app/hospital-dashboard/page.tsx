'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  FileText, 
  Users, 
  Shield, 
  Upload, 
  Search, 
  Activity,
  Eye,
  Clock,
  ArrowRight,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { disconnectHashConnect } from "@/services/hashconnect";

interface StatsCard {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
}

interface RecentActivity {
  id: string;
  type: "record_created" | "access_requested" | "access_granted" | "nft_minted";
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

const HospitalDashboard = () => {
    const router = useRouter();
      const {user, setUser} = useStore();
  const stats: StatsCard[] = [
    {
      title: "Total Records",
      value: "1,247",
      change: "+12%",
      icon: FileText,
      trend: "up",
    },
    {
      title: "Active Patients",
      value: "892",
      change: "+5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Pending Requests",
      value: "23",
      change: "-8%",
      icon: Clock,
      trend: "down",
    },
    {
      title: "NFTs Issued",
      value: "2,156",
      change: "+18%",
      icon: Shield,
      trend: "up",
    },
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "record_created",
      description: "Lab results uploaded for Patient #P-2024-001",
      timestamp: "2024-01-15T14:30:00Z",
      status: "completed",
    },
    {
      id: "2",
      type: "access_requested",
      description: "Access requested for Patient #P-2024-002 medical imaging",
      timestamp: "2024-01-15T13:45:00Z",
      status: "pending",
    },
    {
      id: "3",
      type: "nft_minted",
      description: "Dynamic NFT minted for Patient #P-2024-003",
      timestamp: "2024-01-15T12:20:00Z",
      status: "completed",
    },
    {
      id: "4",
      type: "access_granted",
      description: "Access granted for Patient #P-2024-004 consultation notes",
      timestamp: "2024-01-15T11:15:00Z",
      status: "completed",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "record_created": return FileText;
      case "access_requested": return Eye;
      case "access_granted": return Shield;
      case "nft_minted": return Activity;
      default: return FileText;
    }
  };

  const handleLogout = () => {
    disconnectHashConnect();
    setUser(null);
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "failed": return "bg-red-500/20 text-red-700 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}>
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest actions and updates in your healthcare system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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
