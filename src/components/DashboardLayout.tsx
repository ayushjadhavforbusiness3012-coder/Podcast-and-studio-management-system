import { Link, useLocation } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
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
  CheckCircle2,
  Crown,
  UserPlus,
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
  { to: "/notifications", label: "Notifications", icon: Bell },
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
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const {
    notifications,
    logout,
    adminProfile,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useAppContext();

  const unreadCount = notifications.filter((n) => n.unread).length;

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
          const displayBadge = item.to === "/notifications" ? (unreadCount > 0 ? unreadCount : undefined) : undefined;
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
              {displayBadge !== undefined && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-5 grid place-items-center">
                  {displayBadge}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative size-10 rounded-lg border border-border bg-card grid place-items-center hover:bg-muted" title="View notifications">
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-4 grid place-items-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <span className="font-semibold text-sm">Notifications ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-primary hover:underline font-medium animate-fade-in"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-border">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">No notifications</div>
                  ) : (
                    notifications.slice(0, 5).map((n) => {
                      const Icon = getIconComponent(n.iconName);
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-2.5 p-3 hover:bg-muted/40 transition-colors group rounded-md ${n.unread ? "bg-accent/10" : ""}`}
                        >
                          <div className={`size-8 rounded-lg ${n.color} grid place-items-center shrink-0 mt-0.5`}>
                            <Icon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => markNotificationRead(n.id)}>
                            <div className={`text-xs text-foreground leading-tight ${n.unread ? "font-semibold" : ""}`}>
                              {n.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-destructive hover:bg-destructive/10 rounded"
                            title="Delete"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <DropdownMenuSeparator />
                <Link to="/notifications" className="block text-center text-xs text-primary font-semibold py-2 hover:bg-muted/50 rounded-md">
                  View all notifications
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left" title="Account settings">
                    <img
                      src={`https://i.pravatar.cc/64?img=${adminProfile.avatarIndex}`}
                      alt=""
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="hidden sm:block leading-tight">
                      <div className="font-semibold text-sm">{adminProfile.name}</div>
                      <div className="text-xs text-muted-foreground">{adminProfile.role}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setProfileModalOpen(true)} className="cursor-pointer">
                    <UserCog className="mr-2 size-4" /> Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <X className="mr-2 size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 space-y-6">{children}</main>
      </div>
      
      <ProfileSettingsModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
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

function getIconComponent(name: string) {
  switch (name) {
    case "Calendar": return Calendar;
    case "CreditCard": return CreditCard;
    case "UserPlus": return UserPlus;
    case "Mic2": return Mic2;
    case "CheckCircle2": return CheckCircle2;
    case "Crown": return Crown;
    case "Package": return Package;
    default: return Bell;
  }
}

function ProfileSettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { adminProfile, updateAdminProfile } = useAppContext();
  const [name, setName] = useState(adminProfile.name);
  const [email, setEmail] = useState(adminProfile.email);
  const [password, setPassword] = useState("••••••••");
  const [bio, setBio] = useState(adminProfile.bio || "");
  const [avatarIndex, setAvatarIndex] = useState(adminProfile.avatarIndex);

  const avatars = [12, 33, 45, 47, 49, 51, 60, 64];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and Email are required.");
      return;
    }
    updateAdminProfile({
      name,
      email,
      bio,
      avatarIndex,
    });
    toast.success("Profile updated successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Admin Profile Settings</DialogTitle>
          <DialogDescription>
            Update your personal details, profile picture and credentials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Select Profile Avatar</label>
            <div className="flex gap-3 justify-between items-center py-2 px-3 bg-muted/30 border border-border rounded-xl">
              <img
                src={`https://i.pravatar.cc/128?img=${avatarIndex}`}
                alt="Selected avatar"
                className="size-16 rounded-xl object-cover ring-2 ring-primary ring-offset-2 shrink-0 bg-background"
              />
              <div className="flex flex-wrap gap-2 justify-end">
                {avatars.map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarIndex(idx)}
                    title={`Avatar option ${idx}`}
                    aria-label={`Select avatar option ${idx}`}
                    className={`size-9 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${avatarIndex === idx ? "border-primary ring-1 ring-primary" : "border-transparent"}`}
                  >
                    <img src={`https://i.pravatar.cc/64?img=${idx}`} alt="" className="object-cover size-full" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              required
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              title="Full Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="profile-email">Email Address</label>
            <input
              id="profile-email"
              type="email"
              required
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              title="Email Address"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="profile-pwd">Password</label>
            <input
              id="profile-pwd"
              type="password"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              title="Password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="profile-bio">Bio / Account Information</label>
            <textarea
              id="profile-bio"
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              title="Bio / Account Information"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-border gap-2">
            <button
              type="button"
              className="h-10 px-4 text-sm border border-border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-4 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer"
            >
              Save Changes
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
