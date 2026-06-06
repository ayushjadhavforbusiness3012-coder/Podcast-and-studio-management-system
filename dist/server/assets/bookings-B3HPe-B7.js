import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { B as Badge, D as DashboardLayout, S as StatCard, a as DropdownMenu, b as DropdownMenuTrigger, c as DropdownMenuContent, d as DropdownMenuItem } from "./DashboardLayout-DBeZ8czl.js";
import { CalendarDays, CheckCircle2, Clock, XCircle, Eye, Pencil, MoreVertical, Trash2, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { B as BookingFormDialog } from "./BookingFormDialog-CglGHWqr.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-C98mXwhl.js";
import { useState, useMemo } from "react";
import "@tanstack/react-router";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
import "@radix-ui/react-dialog";
function BookingDetailsDialog({
  booking,
  open,
  onOpenChange
}) {
  if (!booking) return null;
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      "Booking Details - ",
      booking.id
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "py-4 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Guest Name" }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: booking.guest })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Status" }),
        /* @__PURE__ */ jsx(Badge, { variant: booking.sv, children: booking.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Studio" }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: booking.studio })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Package" }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: booking.pkg })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Date" }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: booking.date })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Time" }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: booking.time })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Amount" }),
        /* @__PURE__ */ jsx("div", { className: "font-medium text-primary", children: booking.amt })
      ] })
    ] }) })
  ] }) });
}
function Bookings() {
  const {
    bookings,
    deleteBooking,
    searchQuery,
    setSearchQuery
  } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const handleEdit = (b) => {
    setSelectedBooking(b);
    setFormOpen(true);
  };
  const handleView = (b) => {
    setSelectedBooking(b);
    setDetailsOpen(true);
  };
  const handleNew = () => {
    setSelectedBooking(null);
    setFormOpen(true);
  };
  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings;
    const q = searchQuery.toLowerCase();
    return bookings.filter((b) => b.guest.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.studio.toLowerCase().includes(q));
  }, [bookings, searchQuery]);
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Studio Bookings", subtitle: "Manage all studio bookings and reservations", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
      /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search bookings...", className: "h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: handleNew, className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      " New Booking"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: CalendarDays, label: "Total Bookings", value: bookings.length.toString(), trend: "↑ 18.6% vs last month", tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { icon: CheckCircle2, label: "Confirmed", value: bookings.filter((b) => b.status === "Confirmed").length.toString(), trend: "84% of total", tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Clock, label: "Pending", value: bookings.filter((b) => b.status === "Pending").length.toString(), trend: "↑ 5% vs last month", tone: "warning" }),
      /* @__PURE__ */ jsx(StatCard, { icon: XCircle, label: "Cancelled", value: bookings.filter((b) => b.status === "Cancelled").length.toString(), trend: "↓ 2% vs last month", trendType: "down", tone: "destructive" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Booking ID" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Guest" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Studio" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Package" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Date & Time" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: filteredBookings.map((r) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "p-4 font-medium text-primary", children: r.id }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: r.guest }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: r.studio }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: r.pkg }),
          /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
            /* @__PURE__ */ jsx("div", { children: r.date }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: r.time })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-4 font-medium", children: r.amt }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: r.sv, children: r.status }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => handleView(r), className: "size-8 rounded-md border border-border grid place-items-center text-info hover:bg-accent", children: /* @__PURE__ */ jsx(Eye, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(r), className: "size-8 rounded-md border border-border grid place-items-center hover:bg-accent", children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" }) }),
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-accent", children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" }) }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => handleView(r), children: "View Details" }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => handleEdit(r), children: "Edit Booking" }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:bg-destructive/10 focus:text-destructive", onClick: () => {
                  deleteBooking(r.id);
                  toast.success(`Booking ${r.id} deleted`);
                }, children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "mr-2 size-4" }),
                  " Delete"
                ] })
              ] })
            ] })
          ] }) })
        ] }, r.id)) })
      ] }),
      filteredBookings.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-muted-foreground", children: [
        'No bookings found matching "',
        searchQuery,
        '"'
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(BookingFormDialog, { open: formOpen, onOpenChange: setFormOpen, bookingToEdit: selectedBooking || void 0 }),
    /* @__PURE__ */ jsx(BookingDetailsDialog, { open: detailsOpen, onOpenChange: setDetailsOpen, booking: selectedBooking })
  ] });
}
export {
  Bookings as component
};
