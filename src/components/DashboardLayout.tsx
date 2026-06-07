import { Link, useLocation } from "@tanstack/react-router";
import { useAppContext } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Calendar,
  Mic2,
  CreditCard,
  Package,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bookings", label: "Studio Bookings", icon: CalendarDays },
  { to: "/guests", label: "Guests", icon: Users },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/episodes", label: "Episodes / Shows", icon: Mic2 },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/packages", label: "Packages", icon: Package },
  { to: "/users", label: "Users", icon: UserCog },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useAppContext();

  const sidebarContent = (
    <>
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="size-11 rounded-xl bg-sidebar-accent/20 grid place-items-center">
          <Mic2 className="size-6 text-sidebar-accent" strokeWidth={2.2} />
        </div>
        <div className="leading-tight flex-1">
          <div className="font-bold tracking-wide">PODCAST</div>
          <div className="text-sidebar-accent text-sm font-semibold tracking-[0.2em]">STUDIO</div>
        </div>
        <button
          className="lg:hidden text-sidebar-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-white/5"
              }`}
            >
              <Icon className="size-[18px]" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-5 grid place-items-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
          <div className="size-9 rounded-full bg-sidebar-accent/20 grid place-items-center">
            <HelpCircle className="size-5 text-sidebar-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Need Help?</div>
            <div className="text-xs text-sidebar-muted">Contact Support</div>
          </div>
          <ChevronRight className="size-4 text-sidebar-muted" />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] flex flex-col bg-sidebar text-sidebar-foreground h-full overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-background border-b border-border px-4 lg:px-8 py-5 flex items-center gap-3 lg:gap-4 flex-wrap">
          <button
            className="lg:hidden size-10 rounded-lg border border-border bg-card grid place-items-center hover:bg-muted"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {actions}
            {pathname === "/" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative size-10 rounded-lg border border-border bg-card grid place-items-center hover:bg-muted">
                    <Bell className="size-4" />
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-4 grid place-items-center">5</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New booking from Rahul Verma</DropdownMenuItem>
                  <DropdownMenuItem>Payment received: ₹6,000</DropdownMenuItem>
                  <DropdownMenuItem>Studio A maintenance scheduled</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-primary justify-center">View all notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left">
                    <img
                      src="https://i.pravatar.cc/64?img=12"
                      alt=""
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="hidden sm:block leading-tight">
                      <div className="font-semibold text-sm">Admin</div>
                      <div className="text-xs text-muted-foreground">Super Admin</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCog className="mr-2 size-4" /> Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" /> Studio Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <X className="mr-2 size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendType = "up",
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  tone?: "primary" | "success" | "warning" | "info" | "pink" | "destructive";
}) {
  const tones: Record<string, string> = {
    primary: "bg-accent text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    info: "bg-info/15 text-info",
    pink: "bg-pink/20 text-pink-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  const trendColor =
    trendType === "up" ? "text-success" : trendType === "down" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
      <div className={`size-12 rounded-xl grid place-items-center ${tones[tone]}`}>
        <Icon className="size-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold mt-0.5">{value}</div>
        {trend && <div className={`text-xs mt-1 ${trendColor}`}>{trend}</div>}
      </div>
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "primary" | "pink";
}) {
  const v: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/15 text-success-foreground border border-success/30",
    warning: "bg-warning/20 text-warning-foreground border border-warning/40",
    destructive: "bg-destructive/10 text-destructive border border-destructive/30",
    info: "bg-info/15 text-info-foreground border border-info/30",
    primary: "bg-accent text-primary border border-primary/20",
    pink: "bg-pink/20 text-pink-foreground border border-pink/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${v[variant]}`}>
      {children}
    </span>
  );
}
