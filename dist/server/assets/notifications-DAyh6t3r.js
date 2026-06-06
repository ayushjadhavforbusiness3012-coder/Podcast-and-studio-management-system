import { jsxs, jsx } from "react/jsx-runtime";
import { D as DashboardLayout, B as Badge } from "./DashboardLayout-DBeZ8czl.js";
import { Calendar, CreditCard, UserPlus, Mic2, Bell, CheckCircle2, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import "@tanstack/react-router";
import "./router-Dz_arPe5.js";
import "@tanstack/react-query";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
const initialItems = [{
  id: "n1",
  icon: Calendar,
  color: "bg-accent text-primary",
  title: "New booking received for 'Tech Talk'",
  time: "10 minutes ago",
  unread: true,
  category: "Bookings"
}, {
  id: "n2",
  icon: CreditCard,
  color: "bg-success/15 text-success",
  title: "Payment of ₹4,000 received from Sneha Sharma",
  time: "2 hours ago",
  unread: true,
  category: "Payments"
}, {
  id: "n3",
  icon: UserPlus,
  color: "bg-info/15 text-info",
  title: "New user Sneha Sharma added to your team",
  time: "5 hours ago",
  unread: true,
  category: "System"
}, {
  id: "n4",
  icon: Mic2,
  color: "bg-warning/20 text-warning-foreground",
  title: "Episode 'Mindset Ep. 12' published successfully",
  time: "1 day ago",
  unread: true,
  category: "Episodes"
}, {
  id: "n5",
  icon: Bell,
  color: "bg-pink/20 text-pink-foreground",
  title: "Reminder: Booking 'Marketing Podcast' starts in 1 hour",
  time: "1 day ago",
  unread: true,
  category: "Bookings"
}, {
  id: "n6",
  icon: CheckCircle2,
  color: "bg-muted text-muted-foreground",
  title: "Weekly studio report is ready to view",
  time: "3 days ago",
  unread: false,
  category: "System"
}, {
  id: "n7",
  icon: Calendar,
  color: "bg-muted text-muted-foreground",
  title: "Booking 'Creators Hub' was rescheduled",
  time: "4 days ago",
  unread: false,
  category: "Bookings"
}];
function Notifications() {
  const [items, setItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Unread", "Bookings", "Payments", "Episodes", "System"];
  const unreadCount = items.filter((n) => n.unread).length;
  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items;
    if (activeTab === "Unread") return items.filter((n) => n.unread);
    return items.filter((n) => n.category === activeTab);
  }, [items, activeTab]);
  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({
      ...n,
      unread: false
    })));
    toast.success("All notifications marked as read");
  };
  const handleToggleRead = (id) => {
    setItems((prev) => prev.map((n) => n.id === id ? {
      ...n,
      unread: !n.unread
    } : n));
  };
  const handleDelete = (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Notifications", subtitle: "Stay updated with all studio activities", actions: /* @__PURE__ */ jsx("button", { onClick: handleMarkAllRead, className: "h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted", children: "Mark all as read" }), children: [
    /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl p-2 flex gap-1 flex-wrap", children: tabs.map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab(t), className: `px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`, children: [
      t,
      t === "Unread" && unreadCount > 0 && /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: unreadCount })
    ] }, t)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl divide-y divide-border", children: [
      filteredItems.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No notifications in this category." }),
      filteredItems.map((n) => {
        const Ic = n.icon;
        return /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors group ${n.unread ? "bg-accent/30" : ""}`, children: [
          /* @__PURE__ */ jsx("div", { className: `size-10 rounded-xl ${n.color} grid place-items-center shrink-0`, children: /* @__PURE__ */ jsx(Ic, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 cursor-pointer", onClick: () => handleToggleRead(n.id), children: [
            /* @__PURE__ */ jsx("div", { className: `text-sm ${n.unread ? "font-medium" : ""}`, children: n.title }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: n.time })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            n.unread && /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-primary mt-2" }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(n.id), className: "size-7 rounded-md border border-border grid place-items-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10", title: "Delete", children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }) })
          ] })
        ] }, n.id);
      })
    ] })
  ] });
}
export {
  Notifications as component
};
