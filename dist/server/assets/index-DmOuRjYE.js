import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { D as DashboardLayout, B as Badge } from "./DashboardLayout-DBeZ8czl.js";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { B as BookingFormDialog } from "./BookingFormDialog-CglGHWqr.js";
import { useState } from "react";
import { CalendarDays, Wallet, Package, Users, CalendarCheck, MoreVertical, Crown, ArrowRight, Search, Plus } from "lucide-react";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
import "sonner";
import "./dialog-C98mXwhl.js";
import "@radix-ui/react-dialog";
const topShows = [{
  name: "Tech Talk with Rahul",
  downloads: 5632,
  growth: "28.4%"
}, {
  name: "Mindset Matters",
  downloads: 4812,
  growth: "22.7%"
}, {
  name: "Creators Hub",
  downloads: 4156,
  growth: "16.3%"
}, {
  name: "Business Talk",
  downloads: 3245,
  growth: "18.9%"
}, {
  name: "Health Hour",
  downloads: 2945,
  growth: "14.8%"
}];
const schedule = [{
  time: "10:00 AM",
  name: "Tech Talk with Rahul",
  studio: "Studio A",
  color: "bg-success"
}, {
  time: "01:00 PM",
  name: "Mindset Matters",
  studio: "Studio B",
  color: "bg-success"
}, {
  time: "03:00 PM",
  name: "Marketing Podcast",
  studio: "Studio C",
  color: "bg-warning"
}];
function Sparkline({
  color = "stroke-primary",
  fill = "fill-primary/10"
}) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 60", className: "w-full h-14", children: [
    /* @__PURE__ */ jsx("path", { d: "M0,40 L20,35 L40,42 L60,28 L80,32 L100,20 L120,25 L140,15 L160,22 L180,10 L200,15 L200,60 L0,60 Z", className: fill }),
    /* @__PURE__ */ jsx("path", { d: "M0,40 L20,35 L40,42 L60,28 L80,32 L100,20 L120,25 L140,15 L160,22 L180,10 L200,15", className: `${color} fill-none`, strokeWidth: "2" })
  ] });
}
function Dashboard() {
  const {
    bookings,
    searchQuery,
    setSearchQuery
  } = useAppContext();
  const recentBookings = bookings.slice(0, 5);
  const [formOpen, setFormOpen] = useState(false);
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Dashboard", subtitle: "Welcome back, Admin! Here's what's happening with your studio.", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
      /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search anything...", className: "h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: () => setFormOpen(true), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90", children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      " New Booking"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "size-11 rounded-xl bg-accent text-primary grid place-items-center", children: /* @__PURE__ */ jsx(CalendarDays, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Total Bookings" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "1,248" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-success mt-0.5", children: "↑ 18.6% vs last month" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Sparkline, {})
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "size-11 rounded-xl bg-success/15 text-success grid place-items-center", children: /* @__PURE__ */ jsx(Wallet, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Total Revenue" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "₹5,20,000" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-success mt-0.5", children: "↑ 24.4% vs last month" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Sparkline, { color: "stroke-success", fill: "fill-success/10" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "size-11 rounded-xl bg-info/15 text-info grid place-items-center", children: /* @__PURE__ */ jsx(Package, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Active Packages" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "6" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-success mt-0.5", children: "↑ 12.5% vs last month" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Sparkline, { color: "stroke-info", fill: "fill-info/10" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "size-11 rounded-xl bg-warning/20 text-warning-foreground grid place-items-center", children: /* @__PURE__ */ jsx(Users, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Total Users" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "18" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-success mt-0.5", children: "↑ 12.0% vs last month" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Sparkline, { color: "stroke-warning", fill: "fill-warning/15" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "size-11 rounded-xl bg-pink/20 text-pink-foreground grid place-items-center", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Upcoming Bookings" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "7" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-primary mt-0.5", children: "View calendar" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Sparkline, { color: "stroke-pink", fill: "fill-pink/15" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold", children: "Recent Bookings" }),
          /* @__PURE__ */ jsx(Link, { to: "/bookings", className: "text-sm text-primary font-medium", children: "View All" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          recentBookings.map((b) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-2", children: [
            /* @__PURE__ */ jsx("div", { className: "size-10 rounded-lg bg-accent grid place-items-center text-primary text-[10px] font-bold", children: b.guest.split(" ")[0].slice(0, 4).toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm truncate", children: b.guest }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: b.studio })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right hidden sm:block", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: b.date }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: b.time })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: b.sv, children: b.status }),
            /* @__PURE__ */ jsx(Link, { to: "/bookings", className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" }) })
          ] }, b.id)),
          recentBookings.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-4 text-center text-sm text-muted-foreground", children: "No bookings found" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold", children: "Booking Overview" }),
          /* @__PURE__ */ jsx("select", { className: "text-xs border border-border rounded-md px-2 py-1 bg-card", children: /* @__PURE__ */ jsx("option", { children: "This Month" }) })
        ] }),
        /* @__PURE__ */ jsx(Sparkline, {}),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2 mt-4 text-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-primary" }),
              "Total"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-bold", children: "1,248" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success" }),
              "Done"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-bold", children: "1,056" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-destructive" }),
              "Cancel"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-bold", children: "96" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-warning" }),
              "Pending"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-bold", children: "96" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold", children: "Upcoming Schedule" }),
          /* @__PURE__ */ jsx(Link, { to: "/calendar", className: "text-sm text-primary font-medium", children: "View Calendar" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold", children: "25" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-4", children: "May 2025" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: schedule.map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-2 border-t border-border first:border-0 pt-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground w-16", children: s.time }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: s.name }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.studio })
          ] }),
          /* @__PURE__ */ jsx("span", { className: `size-2 rounded-full ${s.color}` })
        ] }, s.time)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 xl:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold", children: "Top Performing Shows" }),
          /* @__PURE__ */ jsx("select", { className: "text-xs border border-border rounded-md px-2 py-1 bg-card", children: /* @__PURE__ */ jsx("option", { children: "By Downloads" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: topShows.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-2 border-t border-border first:border-0 pt-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground w-5", children: i + 1 }),
          /* @__PURE__ */ jsx("div", { className: "size-9 rounded-lg bg-accent grid place-items-center text-primary text-[10px] font-bold", children: s.name.split(" ")[0].slice(0, 4).toUpperCase() }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 font-medium text-sm", children: s.name }),
          /* @__PURE__ */ jsx("div", { className: "text-sm", children: s.downloads.toLocaleString() }),
          /* @__PURE__ */ jsxs("div", { className: "text-success text-sm", children: [
            "↑ ",
            s.growth
          ] })
        ] }, s.name)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-6 flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "size-11 rounded-xl bg-white/15 grid place-items-center mb-4", children: /* @__PURE__ */ jsx(Crown, { className: "size-5" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Upgrade Your Studio" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90 mt-1", children: "Unlock advanced features and grow your podcast faster." }),
        /* @__PURE__ */ jsxs(Link, { to: "/packages", className: "mt-auto bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 mt-6", children: [
          "Explore Plans ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(BookingFormDialog, { open: formOpen, onOpenChange: setFormOpen })
  ] });
}
export {
  Dashboard as component
};
