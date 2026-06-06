import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout } from "./DashboardLayout-DBeZ8czl.js";
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { B as BookingFormDialog } from "./BookingFormDialog-CglGHWqr.js";
import { useState, useMemo } from "react";
import "@tanstack/react-router";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
import "sonner";
import "./dialog-C98mXwhl.js";
import "@radix-ui/react-dialog";
function CalendarPage() {
  const {
    bookings,
    searchQuery,
    setSearchQuery
  } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const bookingsByDay = useMemo(() => {
    const grouped = {};
    bookings.forEach((b) => {
      if (b.date.includes("May")) {
        const dayMatch = b.date.match(/^(\d{1,2})/);
        if (dayMatch) {
          const day = parseInt(dayMatch[1], 10);
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(b);
        }
      }
    });
    return grouped;
  }, [bookings]);
  const cells = [];
  [27, 28, 29, 30].forEach((n) => cells.push({
    num: n,
    muted: true
  }));
  for (let i = 1; i <= 31; i++) cells.push({
    num: i,
    muted: false
  });
  const upcomingBookings = [...bookings].filter((b) => b.status === "Confirmed" || b.status === "Pending").slice(0, 5);
  const getVariantColor = (sv) => {
    switch (sv) {
      case "success":
        return "bg-success/15 text-success-foreground border-l-4 border-success";
      case "warning":
        return "bg-warning/20 text-warning-foreground border-l-4 border-warning";
      case "destructive":
        return "bg-destructive/15 text-destructive border-l-4 border-destructive";
      case "primary":
        return "bg-accent text-primary border-l-4 border-primary";
      default:
        return "bg-info/15 text-info border-l-4 border-info";
    }
  };
  const getDotColor = (sv) => {
    switch (sv) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "destructive":
        return "bg-destructive";
      case "primary":
        return "bg-primary";
      default:
        return "bg-info";
    }
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Calendar", subtitle: "View and manage all studio bookings", actions: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
    /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
    /* @__PURE__ */ jsx("input", { placeholder: "Search bookings...", className: "h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
  ] }) }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("button", { className: "h-9 px-4 rounded-lg border border-border text-sm", children: "Today" }),
            /* @__PURE__ */ jsx("button", { className: "size-9 rounded-lg border border-border grid place-items-center", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "size-9 rounded-lg border border-border grid place-items-center", children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold ml-2", children: "May 2025" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex bg-muted rounded-lg p-1", children: [
              /* @__PURE__ */ jsx("button", { className: "px-4 py-1.5 rounded-md text-sm bg-primary text-primary-foreground font-medium", children: "Month" }),
              /* @__PURE__ */ jsx("button", { className: "px-4 py-1.5 rounded-md text-sm", children: "Week" }),
              /* @__PURE__ */ jsx("button", { className: "px-4 py-1.5 rounded-md text-sm", children: "Day" })
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Filter, { className: "size-4" }),
              " Filter"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 text-center text-sm text-muted-foreground border-b border-border", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => /* @__PURE__ */ jsx("div", { className: "py-2 font-medium", children: d }, d)) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", children: cells.map((c, i) => {
          const dayBookings = !c.muted ? bookingsByDay[c.num] : void 0;
          const today = !c.muted && c.num === 15;
          return /* @__PURE__ */ jsxs("div", { className: "min-h-[110px] border-r border-b border-border p-2 last:border-r-0", children: [
            /* @__PURE__ */ jsx("div", { className: `text-sm mb-1 ${c.muted ? "text-muted-foreground/50" : ""} ${today ? "" : ""}`, children: today ? /* @__PURE__ */ jsx("span", { className: "inline-grid place-items-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold", children: c.num }) : c.num }),
            dayBookings && dayBookings.map((b, idx) => /* @__PURE__ */ jsxs("div", { className: `rounded-md p-1.5 text-[10px] mb-1 ${getVariantColor(b.sv)}`, children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: b.time.split(" - ")[0] }),
              /* @__PURE__ */ jsx("div", { className: "font-semibold truncate text-foreground", children: b.guest }),
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground truncate", children: b.studio })
            ] }, idx))
          ] }, i);
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 mt-4 text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success" }),
            " Confirmed"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-warning" }),
            " Pending"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-primary" }),
            " Completed"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-destructive" }),
            " Cancelled"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setFormOpen(true), className: "w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-90", children: [
          /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
          " New Booking"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("button", { children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "May 2025" }),
            /* @__PURE__ */ jsx("button", { children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-7 gap-1 text-center text-xs", children: [
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => /* @__PURE__ */ jsx("div", { className: "text-muted-foreground p-1", children: d }, d)),
            cells.map((c, i) => /* @__PURE__ */ jsxs("div", { className: `p-1.5 rounded-md ${c.muted ? "text-muted-foreground/40" : ""} ${c.num === 15 && !c.muted ? "bg-primary text-primary-foreground font-semibold" : ""}`, children: [
              c.num,
              bookingsByDay[c.num] && !c.muted && /* @__PURE__ */ jsx("div", { className: "size-1 bg-primary rounded-full mx-auto mt-0.5" })
            ] }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Filter by Studio" }),
            /* @__PURE__ */ jsx("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Studios" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Filter by Status" }),
            /* @__PURE__ */ jsx("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Statuses" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Upcoming Bookings" }),
            /* @__PURE__ */ jsx("a", { className: "text-xs text-primary", children: "View All" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
            upcomingBookings.map((u) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 pb-3 border-b border-border last:border-0", children: [
              /* @__PURE__ */ jsx("span", { className: `size-2 rounded-full mt-1.5 ${getDotColor(u.sv)}` }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  u.date,
                  ", ",
                  u.time.split(" - ")[0]
                ] }),
                /* @__PURE__ */ jsx("div", { className: "font-medium truncate", children: u.guest }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground truncate", children: u.studio })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-md ${getVariantColor(u.sv).split(" ")[0]} ${getVariantColor(u.sv).split(" ")[1]}`, children: u.status })
            ] }, u.id)),
            upcomingBookings.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground text-center py-4", children: "No upcoming bookings" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(BookingFormDialog, { open: formOpen, onOpenChange: setFormOpen })
  ] });
}
export {
  CalendarPage as component
};
