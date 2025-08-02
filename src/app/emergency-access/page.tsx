'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, Users, Clock, Plus, Trash2, Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const EmergencyAccess = () => {
  const [emergencyEnabled, setEmergencyEnabled] = useState(true);
  const [newProviderDID, setNewProviderDID] = useState("");
  
  // Mock data for pre-authorized providers
  const [authorizedProviders, setAuthorizedProviders] = useState([
    {
      id: 1,
      name: "City General Hospital",
      did: "did:hedera:testnet:z6MkhospitalA1234567890abcdef",
      enabled: true,
      accessDuration: "24 hours"
    },
    {
      id: 2,
      name: "Emergency Medical Services",
      did: "did:hedera:testnet:z6MkemsA9876543210fedcba0987",
      enabled: true,
      accessDuration: "12 hours"
    }
  ]);

  const handleToggleProvider = (id: number) => {
    setAuthorizedProviders(providers =>
      providers.map(provider =>
        provider.id === id ? { ...provider, enabled: !provider.enabled } : provider
      )
    );
  };

  const handleRemoveProvider = (id: number) => {
    setAuthorizedProviders(providers =>
      providers.filter(provider => provider.id !== id)
    );
  };

  const handleAddProvider = () => {
    if (newProviderDID.trim()) {
      const newProvider = {
        id: Date.now(),
        name: "New Provider",
        did: newProviderDID,
        enabled: true,
        accessDuration: "24 hours"
      };
      setAuthorizedProviders([...authorizedProviders, newProvider]);
      setNewProviderDID("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">dHIS</h1>
              <Badge variant="outline" className="text-sm">
                Emergency Access
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/records" className="text-muted-foreground hover:text-primary transition-colors">My Records</Link>
              <Link href="/access-requests" className="text-muted-foreground hover:text-primary transition-colors">Access Requests</Link>
              <Link href="/emergency-access" className="text-foreground hover:text-primary transition-colors">Emergency Access</Link>
              <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">Profile</Link>
              <Button variant="outline" size="sm">Logout</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Emergency Access Settings</h2>
          <p className="text-muted-foreground">Configure pre-authorized access for emergency situations</p>
        </div>

        {/* Emergency Status Overview */}
        <Card className="mb-8 border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              <span>Emergency Access Status</span>
            </CardTitle>
            <CardDescription>
              Current emergency access configuration and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Master Emergency Toggle</p>
                <p className="text-sm text-muted-foreground">
                  {emergencyEnabled ? "Emergency access is enabled" : "Emergency access is disabled"}
                </p>
              </div>
              <Switch 
                checked={emergencyEnabled} 
                onCheckedChange={setEmergencyEnabled}
              />
            </div>
            
            {emergencyEnabled && (
              <div className="mt-4 p-4 bg-gradient-subtle rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {authorizedProviders.filter(p => p.enabled).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Active Providers</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">24h</div>
                    <p className="text-sm text-muted-foreground">Max Access Duration</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">0</div>
                    <p className="text-sm text-muted-foreground">Active Emergency Sessions</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pre-authorized Providers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Pre-authorized Providers</span>
              </CardTitle>
              <CardDescription>
                Healthcare providers with emergency access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authorizedProviders.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {provider.did.substring(0, 40)}...
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">{provider.accessDuration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={provider.enabled && emergencyEnabled} 
                      onCheckedChange={() => handleToggleProvider(provider.id)}
                      disabled={!emergencyEnabled}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveProvider(provider.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Provider */}
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <Label htmlFor="newProvider">Add New Provider DID</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    id="newProvider"
                    placeholder="did:hedera:testnet:..."
                    value={newProviderDID}
                    onChange={(e) => setNewProviderDID(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button onClick={handleAddProvider} disabled={!newProviderDID.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Access Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Emergency Access Logs</span>
              </CardTitle>
              <CardDescription>
                History of emergency access activations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Emergency access activated</p>
                    <p className="text-xs text-muted-foreground">City General Hospital - 3 days ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Expired</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Provider added</p>
                    <p className="text-xs text-muted-foreground">Emergency Medical Services - 1 week ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Completed</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Access permissions granted</p>
                    <p className="text-xs text-muted-foreground">City General Hospital - 2 weeks ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Completed</Badge>
                </div>

                {authorizedProviders.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No emergency access logs yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How Emergency Access Works</CardTitle>
            <CardDescription>Important information about emergency healthcare access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">For Patients</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pre-authorize trusted healthcare providers</li>
                  <li>• Emergency access works even if you&apos;re unconscious</li>
                  <li>• Access is time-limited and logged on blockchain</li>
                  <li>• You can revoke access at any time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">For Healthcare Providers</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Must be pre-authorized by the patient</li>
                  <li>• Access requires emergency protocol activation</li>
                  <li>• All access is recorded and auditable</li>
                  <li>• Limited time windows for data access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyAccess;
