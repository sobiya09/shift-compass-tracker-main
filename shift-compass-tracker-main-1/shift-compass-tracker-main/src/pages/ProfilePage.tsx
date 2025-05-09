
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/auth/require-auth";
import { User, Mail } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  
  // Ensure the page title is set
  useEffect(() => {
    document.title = "Profile - ShiftCompass";
  }, []);
  
  return (
    <RequireAuth>
      <AppLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Name</span>
                </div>
                <div className="font-medium">{user?.name}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email</span>
                </div>
                <div className="font-medium">{user?.email}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Account Type</span>
                </div>
                <div className="font-medium capitalize">{user?.role}</div>
              </div>
              
              <Button 
                variant="destructive"
                onClick={() => logout()}
              >
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </RequireAuth>
  );
};

export default ProfilePage;
