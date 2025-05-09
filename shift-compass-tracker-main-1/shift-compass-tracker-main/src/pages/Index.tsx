
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ShiftControls } from "@/components/shifts/shift-controls";
import { ShiftStatus } from "@/components/shifts/shift-status";
import { ShiftTimer } from "@/components/shifts/shift-timer";
import { LocationMap } from "@/components/shifts/location-map";
import { ShiftStatistics } from "@/components/shifts/shift-statistics";

const Index = () => {
  const { isAuthenticated, isLoading,user } = useAuth();
  
  // Ensure the page title is set
  useEffect(() => {
    document.title = "ShiftCompass - Employee Shift Tracker";
  }, []);
  
  // If loading auth state, show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
    if (user?.role === "admin") {
    return <Navigate to="/admin/employees" />;
       
    
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <ShiftStatus />
                <ShiftTimer />
              </div>
              
              <ShiftControls />
            </CardContent>
          </Card>
          
          {/* Location Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationMap />
            </CardContent>
          </Card>
          
          {/* Statistics Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ShiftStatistics />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
