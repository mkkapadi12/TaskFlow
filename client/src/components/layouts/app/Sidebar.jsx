import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/auth.slice";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { ICONS } from "@/lib/icons/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constant";

const Sidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground">
              <DASHBOARD_ICONS.LAYOUTDASHBOARD size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">TaskFlow</span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <ICONS.X size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User section */}
        <div className="border-t border-sidebar-border px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold uppercase">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <DASHBOARD_ICONS.LOGOUT size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
