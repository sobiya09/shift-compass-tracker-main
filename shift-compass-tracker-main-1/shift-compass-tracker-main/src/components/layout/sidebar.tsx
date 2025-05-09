
import { NavLink } from "react-router-dom";
import { 
  Clock, 
  Calendar, 
  User, 
  Settings,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside className={cn("bg-background", className)}>
      <div className="flex flex-col h-full py-4">
        <div className="px-4 mb-6">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>

        <nav className="space-y-1 px-2 flex-1">
          {!isAdmin && (
            <>
              <NavItem to="/" icon={<Clock />} text="Dashboard" />
              <NavItem to="/shifts" icon={<Calendar />} text="My Shifts" />
            </>
          )}

          <NavItem to="/profile" icon={<User />} text="Profile" />

          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin
                </div>
              </div>
              <NavItem to="/admin/employees" icon={<Users />} text="Employees" />
              {/* <NavItem to="/admin/settings" icon={<Settings />} text="Settings" /> */}
            </>
          )}
        </nav>

        <div className="px-4 py-2 mt-auto">
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ShiftCompass
          </div>
        </div>
      </div>
    </aside>
  );
}

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  text: string;
};

function NavItem({ to, icon, text }: NavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-2 py-2 text-sm rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary"
      )}
      end={to === "/"}
    >
      {icon}
      {text}
    </NavLink>
  );
}
