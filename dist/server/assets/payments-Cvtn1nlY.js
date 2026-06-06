import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { B as Badge, D as DashboardLayout, S as StatCard, a as DropdownMenu, b as DropdownMenuTrigger, c as DropdownMenuContent, d as DropdownMenuItem } from "./DashboardLayout-DBeZ8czl.js";
import { Mail, Printer, Download, Wallet, FileText, Clock, XCircle, Filter, RotateCcw, Eye, MoreVertical, Pencil, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowUp, ArrowDown, Search, Calendar, Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-C98mXwhl.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
function InvoiceFormDialog({
  open,
  onOpenChange,
  invoiceToEdit
}) {
  const { addInvoice, updateInvoice } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState("");
  const [date, setDate] = useState("");
  const [due, setDue] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  useEffect(() => {
    if (open && invoiceToEdit) {
      setName(invoiceToEdit.name);
      setEmail(invoiceToEdit.email);
      setShow(invoiceToEdit.show);
      setDate(invoiceToEdit.date);
      setDue(invoiceToEdit.due);
      setAmount(invoiceToEdit.amount);
      setStatus(invoiceToEdit.status);
    } else if (open) {
      setName("");
      setEmail("");
      setShow("");
      setDate((/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
      const dueDate = /* @__PURE__ */ new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      setDue(dueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
      setAmount("");
      setStatus("Pending");
    }
  }, [open, invoiceToEdit]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) {
      toast.error("Please fill in required fields.");
      return;
    }
    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, {
        name,
        email,
        show,
        date,
        due,
        amount,
        status
      });
      toast.success("Invoice updated successfully!");
    } else {
      addInvoice({
        name,
        email,
        show,
        date,
        due,
        amount,
        status
      });
      toast.success("New invoice created successfully!");
    }
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: invoiceToEdit ? "Edit Invoice" : "Create Invoice" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Guest / Client Name *" }),
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
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Email" }),
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
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Booking / Episode" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            placeholder: "e.g. Tech Talk",
            value: show,
            onChange: (e) => setShow(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Invoice Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              value: date,
              onChange: (e) => setDate(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Due Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              value: due,
              onChange: (e) => setDue(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Amount *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "₹5,000",
              value: amount,
              onChange: (e) => setAmount(e.target.value)
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
                /* @__PURE__ */ jsx("option", { value: "Paid", children: "Paid" }),
                /* @__PURE__ */ jsx("option", { value: "Pending", children: "Pending" }),
                /* @__PURE__ */ jsx("option", { value: "Overdue", children: "Overdue" })
              ]
            }
          )
        ] })
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
            children: invoiceToEdit ? "Save Changes" : "Create Invoice"
          }
        )
      ] })
    ] })
  ] }) });
}
function InvoiceDetailsDialog({
  open,
  onOpenChange,
  invoice
}) {
  if (!invoice) return null;
  const statusVariant2 = { Paid: "success", Pending: "warning", Overdue: "destructive" };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Invoice Details" }),
      /* @__PURE__ */ jsx(Badge, { variant: statusVariant2[invoice.status], children: invoice.status })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "py-4 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Invoice ID" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-lg", children: invoice.id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Amount" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-xl text-primary", children: invoice.amount })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Billed To" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("img", { src: `https://i.pravatar.cc/64?img=${invoice.img}`, className: "size-8 rounded-full", alt: "" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: invoice.name }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: invoice.email })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Booking / Show" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: invoice.show })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Invoice Date" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: invoice.date })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Due Date" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: invoice.due })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "sm:justify-between pt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toast.success("Invoice sent to email"),
            className: "px-3 py-2 text-sm border border-border rounded-md hover:bg-accent inline-flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
              " Email"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toast.success("Printing invoice..."),
            className: "px-3 py-2 text-sm border border-border rounded-md hover:bg-accent inline-flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Printer, { className: "size-4" }),
              " Print"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            toast.success("Downloading PDF...");
            onOpenChange(false);
          },
          className: "px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 inline-flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsx(Download, { className: "size-4" }),
            " Download PDF"
          ]
        }
      )
    ] })
  ] }) });
}
const statusVariant = {
  Paid: "success",
  Pending: "warning",
  Overdue: "destructive"
};
function Donut() {
  const segments = [{
    color: "#22c55e",
    val: 76
  }, {
    color: "#eab308",
    val: 17
  }, {
    color: "#ef4444",
    val: 7
  }];
  let offset = 0;
  const r = 60, c = 2 * Math.PI * r;
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 160 160", className: "w-44 h-44 -rotate-90", children: [
    /* @__PURE__ */ jsx("circle", { cx: "80", cy: "80", r, fill: "none", stroke: "#f1f5f9", strokeWidth: "18" }),
    segments.map((s, i) => {
      const len = s.val / 100 * c;
      const dash = `${len} ${c - len}`;
      const el = /* @__PURE__ */ jsx("circle", { cx: "80", cy: "80", r, fill: "none", stroke: s.color, strokeWidth: "18", strokeDasharray: dash, strokeDashoffset: -offset }, i);
      offset += len;
      return el;
    })
  ] });
}
function Payments() {
  const {
    invoices,
    deleteInvoice
  } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const handleEdit = (i) => {
    setSelectedInvoice(i);
    setFormOpen(true);
  };
  const handleView = (i) => {
    setSelectedInvoice(i);
    setDetailsOpen(true);
  };
  const handleNew = () => {
    setSelectedInvoice(null);
    setFormOpen(true);
  };
  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter((i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.show.toLowerCase().includes(q));
  }, [invoices, searchQuery]);
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Payments & Invoices", subtitle: "Track payments, invoices and transactions", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
      /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search invoices...", className: "h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "size-10 rounded-lg border border-border bg-card grid place-items-center", children: /* @__PURE__ */ jsx(Calendar, { className: "size-4" }) }),
    /* @__PURE__ */ jsxs("button", { className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90", onClick: handleNew, children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      " New Invoice"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: Wallet, label: "Total Revenue", value: "₹1,45,000", trend: "↑ 24% from last month", tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { icon: FileText, label: "Paid Amount", value: "₹1,10,000", trend: "↑ 20% from last month", tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Clock, label: "Pending Amount", value: "₹25,000", trend: "↑ 15% from last month", tone: "warning" }),
      /* @__PURE__ */ jsx(StatCard, { icon: XCircle, label: "Overdue Amount", value: "₹10,000", trend: "↓ 8% from last month", trendType: "down", tone: "destructive" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex border-b border-border px-5", children: [
          /* @__PURE__ */ jsx("button", { className: "px-4 py-3 border-b-2 border-primary text-primary font-medium text-sm", children: "Invoices" }),
          /* @__PURE__ */ jsx("button", { className: "px-4 py-3 text-muted-foreground text-sm hover:text-foreground", children: "Transactions" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end", children: [
          /* @__PURE__ */ jsx("select", { className: "h-10 rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Status" }) }),
          /* @__PURE__ */ jsx("select", { className: "h-10 rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Payment Methods" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "From Date" }),
            /* @__PURE__ */ jsx("input", { placeholder: "Select date", className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "To Date" }),
            /* @__PURE__ */ jsx("input", { placeholder: "Select date", className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("button", { className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Filter, { className: "size-4" }),
              " Filter"
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "size-4" }),
              " Reset"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
          /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Invoice ID" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Guest / Client" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Booking / Episode" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Invoice Date" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Due Date" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Amount" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: filteredInvoices.map((i) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border hover:bg-muted/30 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: `w-1 h-8 rounded ${i.bar}` }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: i.id })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("img", { src: `https://i.pravatar.cc/64?img=${i.img}`, className: "size-8 rounded-full", alt: "" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: i.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: i.email })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { children: i.show }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: i.date })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: i.date }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: i.due }),
              /* @__PURE__ */ jsx("td", { className: "p-4 font-medium", children: i.amount }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: statusVariant[i.status], children: i.status }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors", onClick: () => handleView(i), children: /* @__PURE__ */ jsx(Eye, { className: "size-4" }) }),
                /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-accent", children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" }) }) }),
                  /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleView(i), children: [
                      /* @__PURE__ */ jsx(Eye, { className: "mr-2 size-4" }),
                      " View Details"
                    ] }),
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleEdit(i), children: [
                      /* @__PURE__ */ jsx(Pencil, { className: "mr-2 size-4" }),
                      " Edit Invoice"
                    ] }),
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => toast.success("Invoice downloaded as PDF"), children: [
                      /* @__PURE__ */ jsx(Download, { className: "mr-2 size-4" }),
                      " Download"
                    ] }),
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:bg-destructive/10 focus:text-destructive", onClick: () => {
                      deleteInvoice(i.id);
                      toast.success("Invoice deleted");
                    }, children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "mr-2 size-4" }),
                      " Delete"
                    ] })
                  ] })
                ] })
              ] }) })
            ] }, i.id)) })
          ] }),
          filteredInvoices.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-muted-foreground", children: [
            'No invoices found matching "',
            searchQuery,
            '".'
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 text-sm border-t border-border", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground", children: [
            "Showing ",
            filteredInvoices.length,
            " invoices"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronsLeft, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md bg-primary text-primary-foreground", children: "1" }),
            /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border hover:bg-muted", children: "2" }),
            /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border hover:bg-muted", children: "3" }),
            /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronsRight, { className: "size-4" }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Payment Overview" }),
            /* @__PURE__ */ jsx("select", { className: "text-xs border border-border rounded-md px-2 py-1 bg-card", children: /* @__PURE__ */ jsx("option", { children: "This Month" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Donut, {}),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-center", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-bold", children: "₹1,45,000" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: "Total Revenue" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: "Paid" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "₹1,10,000 (76%)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-warning" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: "Pending" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "₹25,000 (17%)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-destructive" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: "Overdue" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "₹10,000 (7%)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Payment Methods" }),
            /* @__PURE__ */ jsx("select", { className: "text-xs border border-border rounded-md px-2 py-1 bg-card", children: /* @__PURE__ */ jsx("option", { children: "This Month" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm", children: [{
            label: "UPI",
            amt: "₹70,000 (48%)",
            w: "48%",
            color: "bg-primary"
          }, {
            label: "Card",
            amt: "₹40,000 (28%)",
            w: "28%",
            color: "bg-info"
          }, {
            label: "Bank Transfer",
            amt: "₹25,000 (17%)",
            w: "17%",
            color: "bg-success"
          }, {
            label: "Cash",
            amt: "₹10,000 (7%)",
            w: "7%",
            color: "bg-warning"
          }].map((m) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [
              /* @__PURE__ */ jsx("span", { children: m.label }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: m.amt })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full ${m.color}`, style: {
              width: m.w
            } }) })
          ] }, m.label)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Recent Transactions" }),
            /* @__PURE__ */ jsx("a", { className: "text-xs text-primary hover:underline cursor-pointer", children: "View All" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm", children: [{
            icon: ArrowUp,
            color: "text-success",
            title: "Payment received from Rahul Verma",
            id: "INV-1008",
            amt: "₹3,000",
            date: "15 May 2025"
          }, {
            icon: ArrowUp,
            color: "text-success",
            title: "Payment received from Amit Kumar",
            id: "INV-1006",
            amt: "₹3,000",
            date: "14 May 2025"
          }, {
            icon: Clock,
            color: "text-warning",
            title: "Payment pending from Sneha Sharma",
            id: "INV-1007",
            amt: "₹2,500",
            date: "15 May 2025"
          }, {
            icon: ArrowDown,
            color: "text-destructive",
            title: "Payment overdue from Neha Singh",
            id: "INV-1004",
            amt: "₹2,500",
            date: "10 May 2025"
          }].map((t, i) => {
            const Ic = t.icon;
            return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 pb-3 border-b border-border last:border-0", children: [
              /* @__PURE__ */ jsx("div", { className: `size-8 rounded-full bg-muted grid place-items-center ${t.color}`, children: /* @__PURE__ */ jsx(Ic, { className: "size-4" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs", children: t.title }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: t.id })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: t.amt }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: t.date })
              ] })
            ] }, i);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => toast.success("Downloading report..."), className: "w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-90", children: [
          /* @__PURE__ */ jsx(Download, { className: "size-4" }),
          " Download Report"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(InvoiceFormDialog, { open: formOpen, onOpenChange: setFormOpen, invoiceToEdit: selectedInvoice || void 0 }),
    /* @__PURE__ */ jsx(InvoiceDetailsDialog, { open: detailsOpen, onOpenChange: setDetailsOpen, invoice: selectedInvoice })
  ] });
}
export {
  Payments as component
};
