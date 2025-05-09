
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { useAuth } from "@/context/auth-context";
import { 
  User, 
  LogOut, 
  Menu 
} from "lucide-react";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation */}
      <header className="border-b shadow-sm bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 
              className="text-xl font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              ShiftCompass
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden sm:inline-block">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <Sidebar className="hidden md:block w-64 border-r" />

        {/* Mobile navigation */}
        <MobileNav 
          isOpen={mobileNavOpen} 
          onClose={() => setMobileNavOpen(false)} 
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
