import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { D as DashboardLayout, S as StatCard, B as Badge } from "./DashboardLayout-DBeZ8czl.js";
import { Tag, CheckCircle2, CalendarDays, TrendingUp, Filter, RotateCcw, Infinity, Building2, Diamond, Zap, Crown, Star, Pencil, MoreVertical, Clock, Mic2, Headphones, FileText, Plus, Gift, ArrowRight, Search, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-C98mXwhl.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
function PackageFormDialog({
  open,
  onOpenChange,
  packageToEdit
}) {
  const { addPackage, updatePackage } = useAppContext();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Basic");
  const [catV, setCatV] = useState("primary");
  const [dur, setDur] = useState("1 Hour");
  const [price, setPrice] = useState("₹0");
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    if (open && packageToEdit) {
      setName(packageToEdit.name);
      setDesc(packageToEdit.desc);
      setCat(packageToEdit.cat);
      setCatV(packageToEdit.catV);
      setDur(packageToEdit.dur);
      setPrice(packageToEdit.price);
      setFeatures(packageToEdit.features);
    } else if (open) {
      setName("");
      setDesc("");
      setCat("Basic");
      setCatV("primary");
      setDur("1 Hour");
      setPrice("₹0");
      setFeatures([]);
    }
  }, [open, packageToEdit]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Package name is required.");
      return;
    }
    const pkgData = {
      iconName: packageToEdit?.iconName || "Star",
      color: packageToEdit?.color || "bg-primary",
      name,
      desc,
      cat,
      catV,
      dur,
      price,
      features,
      extra: "+ more",
      bookings: packageToEdit?.bookings ?? 0,
      popular: packageToEdit?.popular
    };
    if (packageToEdit) {
      updatePackage(packageToEdit.id, pkgData);
      toast.success("Package updated.");
    } else {
      addPackage(pkgData);
      toast.success("Package added.");
    }
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: packageToEdit ? "Edit Package" : "Add Package" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            autoFocus: true,
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            value: name,
            onChange: (e) => setName(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Description" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            value: desc,
            onChange: (e) => setDesc(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "pt-4 flex justify-end gap-2", children: [
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
            children: packageToEdit ? "Save" : "Add"
          }
        )
      ] })
    ] })
  ] }) });
}
function Packages() {
  const {
    packages,
    addPackage,
    updatePackage,
    deletePackage
  } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(void 0);
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Packages & Pricing", subtitle: "Manage studio packages, features and pricing plans", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
      /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search packages...", className: "h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm" })
    ] }),
    /* @__PURE__ */ jsxs("button", { className: "h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Layers, { className: "size-4" }),
      " Categories"
    ] }),
    /* @__PURE__ */ jsxs("button", { className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2", onClick: () => {
      setSelectedPackage(void 0);
      setFormOpen(true);
    }, children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      " Add Package"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: Tag, label: "Total Packages", value: packages.length.toString(), trend: "Active packages", tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { icon: CheckCircle2, label: "Most Popular", value: "Pro Package", trend: "42% of bookings", tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Tag, label: "Avg. Price", value: "₹4,167", trend: "Across all packages", tone: "warning" }),
      /* @__PURE__ */ jsx(StatCard, { icon: CalendarDays, label: "Total Bookings", value: "1,248", trend: "This month", tone: "info" }),
      /* @__PURE__ */ jsx(StatCard, { icon: TrendingUp, label: "Revenue", value: "₹5,20,000", trend: "This month", tone: "pink" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mt-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl p-5", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3 items-end", children: [
          /* @__PURE__ */ jsx("input", { placeholder: "Search packages...", className: "h-10 rounded-lg border border-border bg-card px-3 text-sm" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Category" }),
            /* @__PURE__ */ jsx("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Categories" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsx("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Status" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("button", { className: "h-10 px-4 rounded-lg border border-border text-sm inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Filter, { className: "size-4" }),
              " Filter"
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "size-4" }),
              " Reset"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Package" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Category" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Duration" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Price" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Features" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Bookings" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: packages.map((p) => {
            const iconMap = {
              Star,
              Crown,
              Zap,
              Diamond,
              Building2,
              InfinityIcon: Infinity
            };
            const Ic = iconMap[p.iconName] || Star;
            return /* @__PURE__ */ jsxs("tr", { className: "border-t border-border hover:bg-muted/30", children: [
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: `size-12 rounded-xl ${p.color} grid place-items-center text-white`, children: /* @__PURE__ */ jsx(Ic, { className: "size-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: p.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: p.desc })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: p.catV, children: p.cat }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: p.dur }),
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: p.price }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: p.price === "Custom" ? "Contact Us" : "per session" })
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                p.features.map((f) => /* @__PURE__ */ jsxs("div", { className: "text-xs flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3 text-success" }),
                  " ",
                  f
                ] }, f)),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-primary mt-0.5", children: p.extra })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: "success", children: "Active" }) }),
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { children: p.bookings }),
                p.popular && /* @__PURE__ */ jsx(Badge, { variant: "warning", children: "Most Popular" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", onClick: () => {
                  setSelectedPackage(p);
                  setFormOpen(true);
                }, children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-destructive/10 hover:text-destructive text-muted-foreground", onClick: () => deletePackage(p.id), children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" }) })
              ] }) })
            ] }, p.id);
          }) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Package Highlights" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [{
            icon: Clock,
            color: "bg-accent text-primary",
            title: "Flexible Durations",
            desc: "Choose from 1 to 4 hours sessions"
          }, {
            icon: Mic2,
            color: "bg-info/15 text-info",
            title: "Premium Equipment",
            desc: "High-quality audio & video equipment"
          }, {
            icon: Headphones,
            color: "bg-warning/20 text-warning-foreground",
            title: "Expert Support",
            desc: "Technical assistance during sessions"
          }, {
            icon: FileText,
            color: "bg-success/15 text-success",
            title: "Easy Booking",
            desc: "Instant confirmation & easy rescheduling"
          }].map((h) => {
            const Ic = h.icon;
            return /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `size-10 rounded-lg ${h.color} grid place-items-center shrink-0`, children: /* @__PURE__ */ jsx(Ic, { className: "size-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: h.title }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: h.desc })
              ] })
            ] }, h.title);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Popular Add-ons" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm", children: [{
            name: "Extra Hour",
            price: "₹1,500"
          }, {
            name: "Video Recording",
            price: "₹2,000"
          }, {
            name: "Audio Editing",
            price: "₹1,000"
          }, {
            name: "Thumbnail Design",
            price: "₹800"
          }].map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Clock, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { children: a.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: a.price }),
              /* @__PURE__ */ jsx("button", { className: "size-7 rounded-md border border-border grid place-items-center", children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" }) })
            ] })
          ] }, a.name)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx(Gift, { className: "size-8 mb-3" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Create Custom Package" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs opacity-90 mt-1", children: "Need a custom package for your specific needs?" }),
          /* @__PURE__ */ jsxs("button", { className: "mt-4 w-full bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2", children: [
            "Create Custom Package ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(PackageFormDialog, { open: formOpen, onOpenChange: setFormOpen, packageToEdit: selectedPackage })
  ] });
}
export {
  Packages as component
};
