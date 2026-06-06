import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, Badge } from "@/components/DashboardLayout";
import { Bell, Calendar, CreditCard, Mic2, UserPlus, CheckCircle2, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Podcast Studio" }] }),
  component: Notifications,
});

type Notification = {
  id: string;
  icon: typeof Bell;
  color: string;
  title: string;
  time: string;
  unread: boolean;
  category: string;
};

const initialItems: Notification[] = [
  { id: "n1", icon: Calendar, color: "bg-accent text-primary", title: "New booking received for 'Tech Talk'", time: "10 minutes ago", unread: true, category: "Bookings" },
  { id: "n2", icon: CreditCard, color: "bg-success/15 text-success", title: "Payment of ₹4,000 received from Sneha Sharma", time: "2 hours ago", unread: true, category: "Payments" },
  { id: "n3", icon: UserPlus, color: "bg-info/15 text-info", title: "New user Sneha Sharma added to your team", time: "5 hours ago", unread: true, category: "System" },
  { id: "n4", icon: Mic2, color: "bg-warning/20 text-warning-foreground", title: "Episode 'Mindset Ep. 12' published successfully", time: "1 day ago", unread: true, category: "Episodes" },
  { id: "n5", icon: Bell, color: "bg-pink/20 text-pink-foreground", title: "Reminder: Booking 'Marketing Podcast' starts in 1 hour", time: "1 day ago", unread: true, category: "Bookings" },
  { id: "n6", icon: CheckCircle2, color: "bg-muted text-muted-foreground", title: "Weekly studio report is ready to view", time: "3 days ago", unread: false, category: "System" },
  { id: "n7", icon: Calendar, color: "bg-muted text-muted-foreground", title: "Booking 'Creators Hub' was rescheduled", time: "4 days ago", unread: false, category: "Bookings" },
];

function Notifications() {
  const [items, setItems] = useState<Notification[]>(initialItems);
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Unread", "Bookings", "Payments", "Episodes", "System"];

  const unreadCount = items.filter((n) => n.unread).length;

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items;
    if (activeTab === "Unread") return items.filter((n) => n.unread);
    return items.filter((n) => n.category === activeTab);
  }, [items, activeTab]);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const handleToggleRead = (id: string) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay updated with all studio activities"
      actions={
        <button onClick={handleMarkAllRead} className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted">
          Mark all as read
        </button>
      }
    >
      <div className="bg-card border border-border rounded-2xl p-2 flex gap-1 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            {t}
            {t === "Unread" && unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border">
        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No notifications in this category.</div>
        )}
        {filteredItems.map((n) => {
          const Ic = n.icon;
          return (
            <div key={n.id} className={`flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors group ${n.unread ? "bg-accent/30" : ""}`}>
              <div className={`size-10 rounded-xl ${n.color} grid place-items-center shrink-0`}>
                <Ic className="size-5" />
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => handleToggleRead(n.id)}>
                <div className={`text-sm ${n.unread ? "font-medium" : ""}`}>{n.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.time}</div>
              </div>
              <div className="flex items-center gap-2">
                {n.unread && <span className="size-2 rounded-full bg-primary mt-2" />}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="size-7 rounded-md border border-border grid place-items-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                  title="Delete"
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
