import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

type RequireAuthProps = {
  children: React.ReactNode;
  allowedRoles?: Array<"employee" | "admin">;
};

export function RequireAuth({ 
  children, 
  allowedRoles = ["employee", "admin"] 
}: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // While checking authentication status, show nothing
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
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user doesn't have the required role, show unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }
  
  // Otherwise, render children
  return <>{children}</>;
}
