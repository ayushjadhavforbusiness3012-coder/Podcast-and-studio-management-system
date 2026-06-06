import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { B as Badge, D as DashboardLayout, S as StatCard } from "./DashboardLayout-DBeZ8czl.js";
import { Users, CheckCircle2, UserPlus, CalendarPlus, Star, RotateCcw, Filter, Eye, Pencil, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Search, Download, Plus } from "lucide-react";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-C98mXwhl.js";
import "@tanstack/react-router";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
import "@radix-ui/react-dialog";
function GuestFormDialog({
  open,
  onOpenChange,
  guestToEdit
}) {
  const { addGuest, updateGuest } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("Active");
  useEffect(() => {
    if (open && guestToEdit) {
      setName(guestToEdit.name);
      setEmail(guestToEdit.email);
      setPhone(guestToEdit.phone);
      setTopic(guestToEdit.topic);
      setStatus(guestToEdit.status);
    } else if (open) {
      setName("");
      setEmail("");
      setPhone("");
      setTopic("");
      setStatus("Active");
    }
  }, [open, guestToEdit]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in required fields.");
      return;
    }
    if (guestToEdit) {
      updateGuest(guestToEdit.id, {
        name,
        email,
        phone,
        topic,
        status
      });
      toast.success("Guest updated successfully!");
    } else {
      addGuest({
        name,
        email,
        phone,
        topic,
        status,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        bookings: 0,
        img: Math.floor(Math.random() * 70)
        // Random avatar
      });
      toast.success("New guest added successfully!");
    }
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: guestToEdit ? "Edit Guest" : "Add Guest" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Guest Name *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            autoFocus: true,
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            placeholder: "e.g. Rahul Verma",
            value: name,
            onChange: (e) => setName(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Email *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "rahul@example.com",
              value: email,
              onChange: (e) => setEmail(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Phone" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "+91 98765 43210",
              value: phone,
              onChange: (e) => setPhone(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Expertise / Topic" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            placeholder: "Technology",
            value: topic,
            onChange: (e) => setTopic(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Status" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            value: status,
            onChange: (e) => setStatus(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { children: "Active" }),
              /* @__PURE__ */ jsx("option", { children: "Inactive" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "pt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "px-4 py-2 text-sm border border-border rounded-md hover:bg-accent",
            onClick: () => onOpenChange(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90",
            children: guestToEdit ? "Save Changes" : "Add Guest"
          }
        )
      ] })
    ] })
  ] }) });
}
function GuestDetailsDialog({
  guest,
  open,
  onOpenChange
}) {
  if (!guest) return null;
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Guest Profile" }) }),
    /* @__PURE__ */ jsxs("div", { className: "py-4 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("img", { src: `https://i.pravatar.cc/64?img=${guest.img}`, className: "size-16 rounded-full object-cover border border-border", alt: "" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: guest.name }),
          /* @__PURE__ */ jsx(Badge, { variant: guest.status === "Active" ? "success" : "destructive", children: guest.status })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Email" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm break-all", children: guest.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Phone" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: guest.phone || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Expertise / Topic" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: guest.topic || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Joined On" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: guest.date })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Total Bookings" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-primary text-xl", children: guest.bookings })
        ] })
      ] })
    ] })
  ] }) });
}
function Guests() {
  const {
    guests,
    deleteGuest,
    deleteGuests
  } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchBy, setSearchBy] = useState("Name");
  const [selectedIds, setSelectedIds] = useState(/* @__PURE__ */ new Set());
  const handleEdit = (g) => {
    setSelectedGuest(g);
    setFormOpen(true);
  };
  const handleView = (g) => {
    setSelectedGuest(g);
    setDetailsOpen(true);
  };
  const handleNew = () => {
    setSelectedGuest(null);
    setFormOpen(true);
  };
  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const q = searchQuery.toLowerCase();
      let matchesSearch = true;
      if (q) {
        if (searchBy === "Name") matchesSearch = g.name.toLowerCase().includes(q);
        else if (searchBy === "Email") matchesSearch = g.email.toLowerCase().includes(q);
      }
      const matchesStatus = statusFilter === "All Status" || g.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [guests, searchQuery, searchBy, statusFilter]);
  const handleToggleAll = () => {
    if (selectedIds.size === filteredGuests.length) {
      setSelectedIds(/* @__PURE__ */ new Set());
    } else {
      setSelectedIds(new Set(filteredGuests.map((g) => g.id)));
    }
  };
  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setSearchBy("Name");
    setSelectedIds(/* @__PURE__ */ new Set());
    toast.info("Filters reset");
  };
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    deleteGuests(Array.from(selectedIds));
    toast.success(`${selectedIds.size} guests deleted`);
    setSelectedIds(/* @__PURE__ */ new Set());
  };
  const handleExport = () => {
    const count = selectedIds.size > 0 ? selectedIds.size : guests.length;
    toast.success(`Exporting ${count} guests as CSV...`);
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Guests Management", subtitle: "Manage all registered guests and their information", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
      /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search guests...", className: "h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
    ] }),
    selectedIds.size > 0 && /* @__PURE__ */ jsxs("button", { onClick: handleDeleteSelected, className: "h-10 px-4 rounded-lg border border-destructive/30 text-destructive bg-destructive/10 text-sm font-medium inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Trash2, { className: "size-4" }),
      " Delete Selected (",
      selectedIds.size,
      ")"
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: handleExport, className: "h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Download, { className: "size-4" }),
      " Export"
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: handleNew, className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      " Add Guest"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: Users, label: "Total Guests", value: guests.length.toString(), trend: "↑ 15% from last month", tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { icon: CheckCircle2, label: "Active Guests", value: guests.filter((g) => g.status === "Active").length.toString(), trend: "84% of total", tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { icon: UserPlus, label: "New This Month", value: "24", trend: "↑ 20%", tone: "warning" }),
      /* @__PURE__ */ jsx(StatCard, { icon: CalendarPlus, label: "Total Bookings", value: guests.reduce((acc, g) => acc + g.bookings, 0).toString(), trend: "↑ 18% from last month", tone: "info" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Star, label: "Frequent Guests", value: guests.filter((g) => g.bookings >= 3).length.toString(), trend: "16% of total", tone: "pink" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl p-5", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3 items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Search by" }),
        /* @__PURE__ */ jsxs("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: searchBy, onChange: (e) => setSearchBy(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { children: "Name" }),
          /* @__PURE__ */ jsx("option", { children: "Email" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground invisible", children: "x" }),
        /* @__PURE__ */ jsx("input", { placeholder: "Search...", className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsxs("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { children: "All Status" }),
          /* @__PURE__ */ jsx("option", { children: "Active" }),
          /* @__PURE__ */ jsx("option", { children: "Inactive" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Joined Date" }),
        /* @__PURE__ */ jsx("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Time" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("button", { onClick: handleReset, className: "h-10 px-3 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-1.5 hover:bg-muted", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "size-4" }),
          " Reset"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => toast.success("Filters applied"), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5 hover:opacity-90", children: [
          /* @__PURE__ */ jsx(Filter, { className: "size-4" }),
          " Filter"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left", children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.size === filteredGuests.length && filteredGuests.length > 0, onChange: handleToggleAll, className: "size-4 rounded border-border" }) }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Guest" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Email / Phone" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Expertise / Topic" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Joined On" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Total Bookings" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: filteredGuests.map((g) => /* @__PURE__ */ jsxs("tr", { className: `border-t border-border transition-colors ${selectedIds.has(g.id) ? "bg-primary/5" : "hover:bg-muted/30"}`, children: [
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.has(g.id), onChange: () => handleToggleSelect(g.id), className: "size-4 rounded border-border" }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("img", { src: `https://i.pravatar.cc/64?img=${g.img}`, className: "size-10 rounded-full object-cover", alt: "" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: g.name }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: g.phone })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-muted-foreground", children: g.email }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: g.topic }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: g.status === "Active" ? "success" : "destructive", children: g.status }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: g.date }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: g.bookings }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => handleView(g), className: "size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors", children: /* @__PURE__ */ jsx(Eye, { className: "size-4" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(g), className: "size-8 rounded-md border border-border grid place-items-center text-warning-foreground hover:bg-warning/10 transition-colors", children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => {
                deleteGuest(g.id);
                toast.success("Guest deleted");
              }, className: "size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10 transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" }) })
            ] }) })
          ] }, g.id)) })
        ] }),
        filteredGuests.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No guests found matching your filters." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 text-sm border-t border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground", children: [
          "Showing ",
          filteredGuests.length,
          " of ",
          guests.length,
          " entries"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronsLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md bg-primary text-primary-foreground", children: "1" }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border hover:bg-muted", children: "2" }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" }) }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronsRight, { className: "size-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(GuestFormDialog, { open: formOpen, onOpenChange: setFormOpen, guestToEdit: selectedGuest || void 0 }),
    /* @__PURE__ */ jsx(GuestDetailsDialog, { open: detailsOpen, onOpenChange: setDetailsOpen, guest: selectedGuest })
  ] });
}
export {
  Guests as component
};
