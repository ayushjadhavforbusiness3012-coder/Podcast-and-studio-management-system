import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Badge } from "@/components/DashboardLayout";
import { Bell, Calendar, CreditCard, Mic2, UserPlus, CheckCircle2, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Podcast Studio" }] }),
  component: Notifications,
});
import { useAppContext } from "@/contexts/AppContext";
import { Crown, Package as PackageIcon } from "lucide-react";

function getIcon(name: string) {
  switch (name) {
    case "Calendar": return Calendar;
    case "CreditCard": return CreditCard;
    case "UserPlus": return UserPlus;
    case "Mic2": return Mic2;
    case "CheckCircle2": return CheckCircle2;
    case "Crown": return Crown;
    case "Package": return PackageIcon;
    default: return Bell;
  }
}

function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useAppContext();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Unread", "Bookings", "Payments", "Episodes", "System"];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return notifications;
    if (activeTab === "Unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success("All notifications marked as read");
  };

  const handleToggleRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast.success("Notification deleted");
  };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay updated with all studio activities"
      actions={
        unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted transition-colors cursor-pointer shadow-sm">
            Mark all as read
          </button>
        )
      }
    >
      <div className="bg-card border border-border rounded-2xl p-2 flex gap-1 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm transition-all cursor-pointer inline-flex items-center gap-1.5 ${activeTab === t ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
          >
            {t}
            {t === "Unread" && unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {filteredItems.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">No notifications in this category.</div>
        )}
        {filteredItems.map((n) => {
          const Ic = getIcon(n.iconName);
          return (
            <div key={n.id} className={`flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors group ${n.unread ? "bg-accent/10" : ""}`}>
              <div className={`size-10 rounded-xl ${n.color} grid place-items-center shrink-0`}>
                <Ic className="size-5" />
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => handleToggleRead(n.id)}>
                <div className={`text-sm ${n.unread ? "font-bold text-foreground" : "text-foreground/85"}`}>{n.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.time}</div>
              </div>
              <div className="flex items-center gap-3">
                {n.unread && <span className="size-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="size-7 rounded-md border border-border grid place-items-center text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 cursor-pointer"
                  title="Delete Notification"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
