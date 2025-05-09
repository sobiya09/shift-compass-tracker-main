
import { NavLink } from "react-router-dom";
import { X, Clock, Calendar, User, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        
        <nav className="mt-6 space-y-1">
          <MobileNavItem to="/" icon={<Clock />} text="Dashboard" onClick={onClose} />
          <MobileNavItem to="/shifts" icon={<Calendar />} text="My Shifts" onClick={onClose} />
          <MobileNavItem to="/profile" icon={<User />} text="Profile" onClick={onClose} />
          
          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin
                </div>
              </div>
              <MobileNavItem to="/admin/employees" icon={<Users />} text="Employees" onClick={onClose} />
              <MobileNavItem to="/admin/settings" icon={<Settings />} text="Settings" onClick={onClose} />
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

type MobileNavItemProps = {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
};

function MobileNavItem({ to, icon, text, onClick }: MobileNavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary"
      )}
      onClick={onClick}
      end={to === "/"}
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}
