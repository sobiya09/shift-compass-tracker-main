
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { RequireAuth } from "@/components/auth/require-auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Map, Bell } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const AdminSettingsPage = () => {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [mapApiKey, setMapApiKey] = useState("");
  const [companyName, setCompanyName] = useState("ShiftCompass Inc.");
  
  // Ensure the page title is set
  useEffect(() => {
    document.title = "Settings - Admin - ShiftCompass";
  }, []);
  
const saveSettings = async () => {
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    toast.error("Authentication token missing.");
    return;
  }

  try {
    const response = await fetch('/api/save-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        companyName,
        mapApiKey,
        emailNotificationsEnabled
      })
    });

    const result = await response.json();
    if (response.ok) {
      toast.success('Settings saved successfully!');
    } else {
      toast.error(result.message || 'Failed to save settings');
    }
  } catch (err) {
    toast.error('Settings save failed. Please try again later.');
  }
};


  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AppLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            
            <Button onClick={saveSettings} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>Configure your organization settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Map Configuration
                </CardTitle>
                <CardDescription>Configure map integration settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mapApiKey">Map API Key</Label>
                    <Input 
                      id="mapApiKey" 
                      type="password"
                      value={mapApiKey} 
                      onChange={(e) => setMapApiKey(e.target.value)} 
                      placeholder="Enter your Google Maps or Mapbox API key" 
                    />
                    <p className="text-sm text-muted-foreground">
                      To enable enhanced map features, add your API key from Google Maps or Mapbox
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure notification settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="block">Email Notifications</Label>
                      <span className="text-sm text-muted-foreground">
                        Send email notifications when shifts are completed
                      </span>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      checked={emailNotificationsEnabled}
                      onCheckedChange={setEmailNotificationsEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </RequireAuth>
  );
};

export default AdminSettingsPage;
