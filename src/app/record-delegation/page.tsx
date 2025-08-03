"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Settings, Shield, ArrowLeft, Trash2, Edit } from "lucide-react";
import Link from "next/link";

interface Delegation {
  id: string;
  proxyName: string;
  proxyWallet: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const RecordDelegation = () => {
  const [delegations, setDelegations] = useState<Delegation[]>([
    {
      id: "del-001",
      proxyName: "Dr. John Smith (Primary Care)",
      proxyWallet: "0x1234...5678",
      permissions: ["view-records", "request-access", "emergency-access"],
      isActive: true,
      createdAt: "2024-01-10T14:30:00Z",
      expiresAt: "2024-12-31T23:59:59Z",
    },
    {
      id: "del-002",
      proxyName: "Sarah Johnson (Spouse)",
      proxyWallet: "0x9876...5432",
      permissions: ["view-records", "emergency-access"],
      isActive: true,
      createdAt: "2024-01-05T09:15:00Z",
    },
  ]);

  const [newDelegation, setNewDelegation] = useState({
    proxyName: "",
    proxyWallet: "",
    description: "",
  });

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "view-records",
      name: "View Records",
      description: "Can view and download medical records",
      enabled: false,
    },
    {
      id: "request-access",
      name: "Request Access",
      description: "Can request access to records on behalf of patient",
      enabled: false,
    },
    {
      id: "approve-requests",
      name: "Approve Requests",
      description: "Can approve or reject access requests",
      enabled: false,
    },
    {
      id: "emergency-access",
      name: "Emergency Access",
      description: "Can access records during medical emergencies",
      enabled: false,
    },
    {
      id: "delegate-control",
      name: "Delegate Control",
      description: "Can delegate control to other trusted parties",
      enabled: false,
    },
  ]);

  const { toast } = useToast();

  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(permissions.map(perm => 
      perm.id === permissionId 
        ? { ...perm, enabled: !perm.enabled }
        : perm
    ));
  };

  const handleCreateDelegation = () => {
    if (!newDelegation.proxyName || !newDelegation.proxyWallet) {
      toast({
        title: "Missing Information",
        description: "Please provide proxy name and wallet address.",
        variant: "destructive",
      });
      return;
    }

    const enabledPermissions = permissions.filter(p => p.enabled).map(p => p.id);
    if (enabledPermissions.length === 0) {
      toast({
        title: "No Permissions Selected",
        description: "Please select at least one permission for the delegate.",
        variant: "destructive",
      });
      return;
    }

    const delegation: Delegation = {
      id: `del-${Date.now()}`,
      proxyName: newDelegation.proxyName,
      proxyWallet: newDelegation.proxyWallet,
      permissions: enabledPermissions,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setDelegations([...delegations, delegation]);
    setNewDelegation({ proxyName: "", proxyWallet: "", description: "" });
    setPermissions(permissions.map(p => ({ ...p, enabled: false })));

    toast({
      title: "Delegation Created",
      description: "Trusted proxy has been granted the specified permissions.",
    });
  };

  const handleToggleDelegation = (delegationId: string) => {
    setDelegations(delegations.map(del => 
      del.id === delegationId 
        ? { ...del, isActive: !del.isActive }
        : del
    ));
    
    const delegation = delegations.find(d => d.id === delegationId);
    toast({
      title: delegation?.isActive ? "Delegation Deactivated" : "Delegation Activated",
      description: `Proxy access has been ${delegation?.isActive ? "disabled" : "enabled"}.`,
    });
  };

  const handleRemoveDelegation = (delegationId: string) => {
    setDelegations(delegations.filter(del => del.id !== delegationId));
    toast({
      title: "Delegation Removed",
      description: "Trusted proxy has been removed from your account.",
    });
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
            <h1 className="text-2xl font-bold">Record Delegation</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Flow Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Flow 4: Record Delegation
            </CardTitle>
            <CardDescription>
              Patient delegates control to a trusted proxy with defined permissions
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Delegation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create New Delegation
              </CardTitle>
              <CardDescription>
                Grant trusted parties specific permissions to manage your records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="proxyName">Proxy Name *</Label>
                <Input
                  id="proxyName"
                  placeholder="e.g., Dr. John Smith or Family Member"
                  value={newDelegation.proxyName}
                  onChange={(e) =>
                    setNewDelegation({ ...newDelegation, proxyName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proxyWallet">Proxy Wallet Address *</Label>
                <Input
                  id="proxyWallet"
                  placeholder="0x..."
                  value={newDelegation.proxyWallet}
                  onChange={(e) =>
                    setNewDelegation({ ...newDelegation, proxyWallet: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the relationship or purpose..."
                  value={newDelegation.description}
                  onChange={(e) =>
                    setNewDelegation({ ...newDelegation, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Permissions *</Label>
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{permission.name}</h4>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateDelegation} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Delegation
              </Button>
            </CardContent>
          </Card>

          {/* Active Delegations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Active Delegations
              </CardTitle>
              <CardDescription>
                Manage your trusted proxies and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {delegations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No delegations created yet
                </div>
              ) : (
                <div className="space-y-4">
                  {delegations.map((delegation) => (
                    <div key={delegation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{delegation.proxyName}</h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            {delegation.proxyWallet}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={delegation.isActive ? "default" : "secondary"}>
                            {delegation.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {delegation.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {permissions.find(p => p.id === perm)?.name || perm}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground mb-3">
                        Created: {new Date(delegation.createdAt).toLocaleDateString()}
                        {delegation.expiresAt && (
                          <span className="ml-3">
                            Expires: {new Date(delegation.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleDelegation(delegation.id)}
                        >
                          {delegation.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveDelegation(delegation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordDelegation;
