
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Ensure the page title is set
  useEffect(() => {
    document.title = "Login - ShiftCompass";
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to ShiftCompass</h1>
          <p className="text-muted-foreground mt-2">
            Log in to track your work hours and location
          </p>
        </div>
        
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <LoginForm />
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ShiftCompass. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
