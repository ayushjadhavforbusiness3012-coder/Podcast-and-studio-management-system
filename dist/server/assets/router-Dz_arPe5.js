import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, createContext, useContext, useEffect } from "react";
import { Toaster } from "sonner";
const appCss = "/assets/styles-ChKWxTHE.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const initialUsers = [
  { name: "Rahul Verma", email: "rahul@example.com", role: "Super Admin", roleV: "primary", status: "Active", joined: "12 Jan 2025", last: "Today, 10:30 AM", img: 12, you: true },
  { name: "Sneha Sharma", email: "sneha@example.com", role: "Admin", roleV: "info", status: "Active", joined: "15 Jan 2025", last: "Today, 09:15 AM", img: 47 },
  { name: "Amit Kumar", email: "amit@example.com", role: "Editor", roleV: "info", status: "Active", joined: "18 Jan 2025", last: "Yesterday, 05:45 PM", img: 33 },
  { name: "Neha Singh", email: "neha@example.com", role: "Editor", roleV: "info", status: "Active", joined: "20 Jan 2025", last: "Yesterday, 11:20 AM", img: 45 },
  { name: "Vikram Joshi", email: "vikram@example.com", role: "Editor", roleV: "info", status: "Active", joined: "25 Jan 2025", last: "Today, 08:05 AM", img: 51 },
  { name: "Pooja Iyer", email: "pooja@example.com", role: "Viewer", roleV: "warning", status: "Active", joined: "28 Jan 2025", last: "2 days ago", img: 49 },
  { name: "Arjun Mehta", email: "arjun@example.com", role: "Viewer", roleV: "warning", status: "Active", joined: "01 Feb 2025", last: "5 days ago", img: 60 },
  { name: "Karan Malhotra", email: "karan@example.com", role: "Viewer", roleV: "warning", status: "Inactive", joined: "05 Feb 2025", last: "10 days ago", img: 64 }
];
const initialBookings = [
  { id: "BK-1024", guest: "Rahul Verma", studio: "Studio A", pkg: "Pro Package", date: "25 May 2025", time: "10:00 AM - 12:00 PM", status: "Confirmed", sv: "success", amt: "₹6,000" },
  { id: "BK-1023", guest: "Sneha Sharma", studio: "Studio B", pkg: "Premium Package", date: "25 May 2025", time: "01:00 PM - 02:30 PM", status: "Confirmed", sv: "success", amt: "₹8,500" },
  { id: "BK-1022", guest: "Amit Kumar", studio: "Studio A", pkg: "Standard Package", date: "26 May 2025", time: "11:00 AM - 01:00 PM", status: "Pending", sv: "warning", amt: "₹4,000" },
  { id: "BK-1021", guest: "Vikram Joshi", studio: "Studio C", pkg: "Basic Package", date: "27 May 2025", time: "10:30 AM - 12:00 PM", status: "Confirmed", sv: "success", amt: "₹2,500" },
  { id: "BK-1020", guest: "Neha Singh", studio: "Studio A", pkg: "Pro Package", date: "28 May 2025", time: "02:00 PM - 03:30 PM", status: "Pending", sv: "warning", amt: "₹6,000" }
];
const initialGuests = [
  { id: "G-1", name: "Rahul Verma", phone: "+91 98765 43210", email: "rahul@example.com", topic: "Technology", status: "Active", date: "10 May 2025", bookings: 5, img: 12 },
  { id: "G-2", name: "Sneha Sharma", phone: "+91 91234 56789", email: "sneha@example.com", topic: "Business", status: "Active", date: "09 May 2025", bookings: 4, img: 47 },
  { id: "G-3", name: "Amit Kumar", phone: "+91 99887 76655", email: "amit@example.com", topic: "Marketing", status: "Active", date: "12 May 2025", bookings: 6, img: 33 },
  { id: "G-4", name: "Vikram Joshi", phone: "+91 88776 65544", email: "vikram@example.com", topic: "Entrepreneurship", status: "Active", date: "11 May 2025", bookings: 3, img: 51 },
  { id: "G-5", name: "Neha Singh", phone: "+91 77665 54433", email: "neha@example.com", topic: "Health & Wellness", status: "Active", date: "13 May 2025", bookings: 4, img: 45 },
  { id: "G-6", name: "Arjun Mehta", phone: "+91 66554 43322", email: "arjun@example.com", topic: "Finance", status: "Active", date: "14 May 2025", bookings: 2, img: 60 },
  { id: "G-7", name: "Pooja Iyer", phone: "+91 55443 32211", email: "pooja@example.com", topic: "Education", status: "Inactive", date: "08 May 2025", bookings: 1, img: 49 },
  { id: "G-8", name: "Karan Malhotra", phone: "+91 44332 21100", email: "karan@example.com", topic: "Self Improvement", status: "Active", date: "15 May 2025", bookings: 3, img: 64 }
];
const initialEpisodes = [
  { id: "EP-107", ep: "07", title: "The Future of AI", show: "Tech Talk", guest: "Rahul Verma", img: 12, dur: "45:32", status: "Published", sv: "success", date: "15 May 2025", time: "02:00 PM", color: "bg-primary" },
  { id: "EP-106", ep: "06", title: "Digital Marketing Basics", show: "Marketing Minds", guest: "Sneha Sharma", img: 47, dur: "38:15", status: "Published", sv: "success", date: "12 May 2025", time: "05:00 PM", color: "bg-info" },
  { id: "EP-105", ep: "05", title: "Startup Journey", show: "Founders Hub", guest: "Amit Kumar", img: 33, dur: "50:20", status: "Published", sv: "success", date: "10 May 2025", time: "11:00 AM", color: "bg-accent-foreground" },
  { id: "EP-104", ep: "04", title: "Investment 101", show: "Finance Simplified", guest: "Neha Singh", img: 45, dur: "42:10", status: "Scheduled", sv: "warning", date: "20 May 2025", time: "04:00 PM", color: "bg-warning" },
  { id: "EP-103", ep: "03", title: "Mindset Matters", show: "Success Stories", guest: "Vikram Joshi", img: 51, dur: "36:45", status: "Scheduled", sv: "warning", date: "22 May 2025", time: "03:00 PM", color: "bg-primary" },
  { id: "EP-102", ep: "02", title: "Content Creation Tips", show: "Creator Corner", guest: "Pooja Iyer", img: 49, dur: "27:18", status: "Draft", sv: "info", date: "—", time: "", color: "bg-destructive" },
  { id: "EP-101", ep: "01", title: "Welcome to Podcast Studio", show: "Podcast Studio", guest: "Admin", img: 12, dur: "15:30", status: "Draft", sv: "info", date: "—", time: "", color: "bg-pink" },
  { id: "EP-100", ep: "00", title: "Trailer - Podcast Studio", show: "Podcast Studio", guest: "Admin", img: 12, dur: "02:45", status: "Archived", sv: "default", date: "01 May 2025", time: "12:00 PM", color: "bg-muted-foreground" }
];
const initialInvoices = [
  { id: "INV-1008", name: "Rahul Verma", email: "rahul@example.com", show: "Tech Talk", date: "15 May 2025", due: "15 May 2025", amount: "₹3,000", status: "Paid", img: 12, bar: "bg-success" },
  { id: "INV-1007", name: "Sneha Sharma", email: "sneha@example.com", show: "Marketing Podcast", date: "15 May 2025", due: "20 May 2025", amount: "₹2,500", status: "Pending", img: 47, bar: "bg-warning" },
  { id: "INV-1006", name: "Amit Kumar", email: "amit@example.com", show: "Health & Wellness", date: "14 May 2025", due: "21 May 2025", amount: "₹3,000", status: "Paid", img: 33, bar: "bg-success" },
  { id: "INV-1005", name: "Vikram Joshi", email: "vikram@example.com", show: "Entrepreneur Hour", date: "12 May 2025", due: "19 May 2025", amount: "₹5,000", status: "Pending", img: 51, bar: "bg-warning" },
  { id: "INV-1004", name: "Neha Singh", email: "neha@example.com", show: "Investment 101", date: "10 May 2025", due: "15 May 2025", amount: "₹2,500", status: "Overdue", img: 45, bar: "bg-destructive" },
  { id: "INV-1003", name: "Digital Creators", email: "hello@digital.com", show: "Digital Marketing Basics", date: "08 May 2025", due: "13 May 2025", amount: "₹6,000", status: "Paid", img: 60, bar: "bg-success" },
  { id: "INV-1002", name: "Pooja Iyer", email: "pooja@example.com", show: "Creator's Journey", date: "05 May 2025", due: "12 May 2025", amount: "₹2,500", status: "Paid", img: 49, bar: "bg-success" },
  { id: "INV-1001", name: "The Startup Talk", email: "info@startup.com", show: "The Startup Talk", date: "01 May 2025", due: "08 May 2025", amount: "₹3,000", status: "Overdue", img: 64, bar: "bg-destructive" }
];
const initialPackages = [
  { id: "PKG-1", iconName: "Star", color: "bg-primary", name: "Basic Package", desc: "Perfect for beginners", cat: "Basic", catV: "primary", dur: "1 Hour", price: "₹2,500", features: ["Studio Access", "Basic Equipment"], extra: "+ 2 more", bookings: 156 },
  { id: "PKG-2", iconName: "Crown", color: "bg-info", name: "Standard Package", desc: "Great for growing podcasts", cat: "Standard", catV: "info", dur: "2 Hours", price: "₹4,000", features: ["Studio Access", "Professional Equipment"], extra: "+ 3 more", bookings: 312 },
  { id: "PKG-3", iconName: "Zap", color: "bg-success", name: "Pro Package", desc: "Most popular choice", cat: "Popular", catV: "success", dur: "2 Hours", price: "₹6,000", features: ["Studio Access", "Premium Equipment"], extra: "+ 4 more", bookings: 523, popular: true },
  { id: "PKG-4", iconName: "Diamond", color: "bg-warning", name: "Premium Package", desc: "For professional creators", cat: "Premium", catV: "warning", dur: "3 Hours", price: "₹8,500", features: ["Studio Access", "Premium Equipment"], extra: "+ 5 more", bookings: 189 },
  { id: "PKG-5", iconName: "Building2", color: "bg-primary", name: "Business Package", desc: "For teams & businesses", cat: "Business", catV: "primary", dur: "4 Hours", price: "₹12,000", features: ["Studio Access", "All Equipment"], extra: "+ 6 more", bookings: 42 },
  { id: "PKG-6", iconName: "InfinityIcon", color: "bg-destructive", name: "Enterprise Package", desc: "Custom solutions", cat: "Enterprise", catV: "destructive", dur: "Custom", price: "Custom", features: ["Custom Access", "Custom Equipment"], extra: "+ more", bookings: 26 }
];
const AppContext = createContext(void 0);
function AppProvider({ children }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [guests, setGuests] = useState(initialGuests);
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [packages, setPackages] = useState(initialPackages);
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const addInvoice = (i) => {
    const newId = `INV-${1009 + invoices.length}`;
    let bar = "bg-primary";
    if (i.status === "Paid") bar = "bg-success";
    if (i.status === "Pending") bar = "bg-warning";
    if (i.status === "Overdue") bar = "bg-destructive";
    setInvoices((prev) => [{ ...i, id: newId, img: Math.floor(Math.random() * 70), bar }, ...prev]);
  };
  const updateInvoice = (id, updates) => {
    setInvoices(
      (prev) => prev.map((i) => {
        if (i.id === id) {
          const updated = { ...i, ...updates };
          if (updated.status === "Paid") updated.bar = "bg-success";
          if (updated.status === "Pending") updated.bar = "bg-warning";
          if (updated.status === "Overdue") updated.bar = "bg-destructive";
          return updated;
        }
        return i;
      })
    );
  };
  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };
  const addPackage = (p) => {
    const newId = `PKG-${Date.now()}`;
    setPackages((prev) => [...prev, { ...p, id: newId }]);
  };
  const updatePackage = (id, updates) => {
    setPackages((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p));
  };
  const deletePackage = (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };
  const addEpisode = (e) => {
    const epNum = episodes.length.toString().padStart(2, "0");
    const newId = `EP-1${epNum}`;
    let sv = "default";
    if (e.status === "Published") sv = "success";
    if (e.status === "Scheduled") sv = "warning";
    if (e.status === "Draft") sv = "info";
    const colors = ["bg-primary", "bg-info", "bg-warning", "bg-pink", "bg-accent-foreground", "bg-destructive"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setEpisodes((prev) => [{ ...e, id: newId, ep: epNum, img: Math.floor(Math.random() * 70), sv, color }, ...prev]);
  };
  const updateEpisode = (id, updates) => {
    setEpisodes(
      (prev) => prev.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...updates };
          if (updated.status === "Published") updated.sv = "success";
          if (updated.status === "Scheduled") updated.sv = "warning";
          if (updated.status === "Draft") updated.sv = "info";
          if (updated.status === "Archived") updated.sv = "default";
          return updated;
        }
        return e;
      })
    );
  };
  const deleteEpisode = (id) => {
    setEpisodes((prev) => prev.filter((e) => e.id !== id));
  };
  const addGuest = (g) => {
    const newId = `G-${Date.now()}`;
    setGuests((prev) => [{ ...g, id: newId }, ...prev]);
  };
  const updateGuest = (id, updates) => {
    setGuests(
      (prev) => prev.map((g) => g.id === id ? { ...g, ...updates } : g)
    );
  };
  const deleteGuest = (id) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };
  const deleteGuests = (ids) => {
    setGuests((prev) => prev.filter((g) => !ids.includes(g.id)));
  };
  const addBooking = (b) => {
    const newId = `BK-${1025 + bookings.length}`;
    let sv = "default";
    if (b.status === "Confirmed") sv = "success";
    if (b.status === "Pending") sv = "warning";
    if (b.status === "Cancelled") sv = "destructive";
    if (b.status === "Completed") sv = "primary";
    setBookings((prev) => [{ ...b, id: newId, sv }, ...prev]);
  };
  const updateBooking = (id, updates) => {
    setBookings(
      (prev) => prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, ...updates };
          if (updated.status === "Confirmed") updated.sv = "success";
          if (updated.status === "Pending") updated.sv = "warning";
          if (updated.status === "Cancelled") updated.sv = "destructive";
          if (updated.status === "Completed") updated.sv = "primary";
          return updated;
        }
        return b;
      })
    );
  };
  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };
  const addUser = (u) => {
    setUsers((prev) => [{ ...u, img: Math.floor(Math.random() * 70), you: false }, ...prev]);
  };
  const updateUser = (index, updates) => {
    setUsers((prev) => prev.map((u, i) => i === index ? { ...u, ...updates } : u));
  };
  const deleteUser = (index) => {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  };
  return /* @__PURE__ */ jsx(AppContext.Provider, { value: {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    deleteGuests,
    episodes,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    packages,
    addPackage,
    updatePackage,
    deletePackage,
    users,
    addUser,
    updateUser,
    deleteUser,
    searchQuery,
    setSearchQuery
  }, children });
}
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(AppProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$a = () => import("./users-DWSKHdYp.js");
const Route$a = createFileRoute("/users")({
  head: () => ({
    meta: [{
      title: "Users — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./settings-qsRjvb0j.js");
const Route$9 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./reports-BtcMzx9z.js");
const Route$8 = createFileRoute("/reports")({
  head: () => ({
    meta: [{
      title: "Reports — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./payments-Cvtn1nlY.js");
const Route$7 = createFileRoute("/payments")({
  head: () => ({
    meta: [{
      title: "Payments — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./packages-DsXGlzfF.js");
const Route$6 = createFileRoute("/packages")({
  head: () => ({
    meta: [{
      title: "Packages — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./notifications-DAyh6t3r.js");
const Route$5 = createFileRoute("/notifications")({
  head: () => ({
    meta: [{
      title: "Notifications — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./guests-DCVxL9L1.js");
const Route$4 = createFileRoute("/guests")({
  head: () => ({
    meta: [{
      title: "Guests — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./episodes-CJV0x9uL.js");
const Route$3 = createFileRoute("/episodes")({
  head: () => ({
    meta: [{
      title: "Episodes — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./calendar-DrL7OYAz.js");
const Route$2 = createFileRoute("/calendar")({
  head: () => ({
    meta: [{
      title: "Calendar — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./bookings-B3HPe-B7.js");
const Route$1 = createFileRoute("/bookings")({
  head: () => ({
    meta: [{
      title: "Studio Bookings — Podcast Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DmOuRjYE.js");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Dashboard — Podcast Studio"
    }, {
      name: "description",
      content: "Overview of your podcast studio: bookings, revenue, and upcoming schedule."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UsersRoute = Route$a.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => Route$b
});
const SettingsRoute = Route$9.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$b
});
const ReportsRoute = Route$8.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$b
});
const PaymentsRoute = Route$7.update({
  id: "/payments",
  path: "/payments",
  getParentRoute: () => Route$b
});
const PackagesRoute = Route$6.update({
  id: "/packages",
  path: "/packages",
  getParentRoute: () => Route$b
});
const NotificationsRoute = Route$5.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$b
});
const GuestsRoute = Route$4.update({
  id: "/guests",
  path: "/guests",
  getParentRoute: () => Route$b
});
const EpisodesRoute = Route$3.update({
  id: "/episodes",
  path: "/episodes",
  getParentRoute: () => Route$b
});
const CalendarRoute = Route$2.update({
  id: "/calendar",
  path: "/calendar",
  getParentRoute: () => Route$b
});
const BookingsRoute = Route$1.update({
  id: "/bookings",
  path: "/bookings",
  getParentRoute: () => Route$b
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const rootRouteChildren = {
  IndexRoute,
  BookingsRoute,
  CalendarRoute,
  EpisodesRoute,
  GuestsRoute,
  NotificationsRoute,
  PackagesRoute,
  PaymentsRoute,
  ReportsRoute,
  SettingsRoute,
  UsersRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  useAppContext as u
};
