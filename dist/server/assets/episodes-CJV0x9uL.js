import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { B as Badge, D as DashboardLayout, S as StatCard, a as DropdownMenu, b as DropdownMenuTrigger, c as DropdownMenuContent, d as DropdownMenuItem } from "./DashboardLayout-DBeZ8czl.js";
import { Mic2, Clock, CalendarDays, PlayCircle, CheckCircle2, FileEdit, Trash2, Filter, RotateCcw, Eye, Pencil, MoreVertical, ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
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
function EpisodeFormDialog({
  open,
  onOpenChange,
  episodeToEdit
}) {
  const { addEpisode, updateEpisode } = useAppContext();
  const [title, setTitle] = useState("");
  const [show, setShow] = useState("Podcast Studio");
  const [guest, setGuest] = useState("");
  const [dur, setDur] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Draft");
  useEffect(() => {
    if (open && episodeToEdit) {
      setTitle(episodeToEdit.title);
      setShow(episodeToEdit.show);
      setGuest(episodeToEdit.guest);
      setDur(episodeToEdit.dur);
      setDate(episodeToEdit.date);
      setTime(episodeToEdit.time);
      setStatus(episodeToEdit.status);
    } else if (open) {
      setTitle("");
      setShow("Podcast Studio");
      setGuest("");
      setDur("");
      setDate("");
      setTime("");
      setStatus("Draft");
    }
  }, [open, episodeToEdit]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please provide an episode title.");
      return;
    }
    if (episodeToEdit) {
      updateEpisode(episodeToEdit.id, {
        title,
        show,
        guest,
        dur,
        date,
        time,
        status
      });
      toast.success("Episode updated successfully!");
    } else {
      addEpisode({
        title,
        show,
        guest: guest || "Admin",
        dur: dur || "00:00",
        date: date || "—",
        time,
        status
      });
      toast.success("New episode created successfully!");
    }
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: episodeToEdit ? "Edit Episode" : "New Episode" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Episode Title *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            autoFocus: true,
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            placeholder: "e.g. The Future of AI",
            value: title,
            onChange: (e) => setTitle(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Show / Series" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              value: show,
              onChange: (e) => setShow(e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { children: "Podcast Studio" }),
                /* @__PURE__ */ jsx("option", { children: "Tech Talk" }),
                /* @__PURE__ */ jsx("option", { children: "Marketing Minds" }),
                /* @__PURE__ */ jsx("option", { children: "Founders Hub" }),
                /* @__PURE__ */ jsx("option", { children: "Finance Simplified" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Guest" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "Rahul Verma",
              value: guest,
              onChange: (e) => setGuest(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "15 May 2025",
              value: date,
              onChange: (e) => setDate(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Time" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "02:00 PM",
              value: time,
              onChange: (e) => setTime(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Duration" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "45:30",
              value: dur,
              onChange: (e) => setDur(e.target.value)
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
                /* @__PURE__ */ jsx("option", { children: "Published" }),
                /* @__PURE__ */ jsx("option", { children: "Scheduled" }),
                /* @__PURE__ */ jsx("option", { children: "Draft" }),
                /* @__PURE__ */ jsx("option", { children: "Archived" })
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
            children: episodeToEdit ? "Save Changes" : "Save Episode"
          }
        )
      ] })
    ] })
  ] }) });
}
function EpisodeDetailsDialog({
  episode,
  open,
  onOpenChange
}) {
  if (!episode) return null;
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Episode Details" }) }),
    /* @__PURE__ */ jsxs("div", { className: "py-4 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: `size-16 rounded-xl ${episode.color} grid place-items-center text-white relative shadow-sm`, children: [
          /* @__PURE__ */ jsx(Mic2, { className: "size-6" }),
          /* @__PURE__ */ jsxs("span", { className: "absolute bottom-1 right-1 text-[9px] bg-black/40 px-1 rounded", children: [
            "EP #",
            episode.ep
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-lg font-bold leading-tight", children: episode.title }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: episode.show })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Status" }),
          /* @__PURE__ */ jsx(Badge, { variant: episode.sv, children: episode.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Duration" }),
          /* @__PURE__ */ jsxs("div", { className: "font-medium text-sm flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Clock, { className: "size-3" }),
            " ",
            episode.dur
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Guest" }),
          /* @__PURE__ */ jsxs("div", { className: "font-medium text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("img", { src: `https://i.pravatar.cc/64?img=${episode.img}`, className: "size-5 rounded-full", alt: "" }),
            episode.guest
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Date" }),
          /* @__PURE__ */ jsxs("div", { className: "font-medium text-sm flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "size-3" }),
            " ",
            episode.date
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function Episodes() {
  const {
    episodes,
    deleteEpisode
  } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState("All Shows");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const handleEdit = (e) => {
    setSelectedEpisode(e);
    setFormOpen(true);
  };
  const handleView = (e) => {
    setSelectedEpisode(e);
    setDetailsOpen(true);
  };
  const handleNew = () => {
    setSelectedEpisode(null);
    setFormOpen(true);
  };
  const handleReset = () => {
    setSearchQuery("");
    setShowFilter("All Shows");
    setStatusFilter("All Status");
    toast.info("Filters reset");
  };
  const filteredEpisodes = useMemo(() => {
    return episodes.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.guest.toLowerCase().includes(q);
      const matchesShow = showFilter === "All Shows" || e.show === showFilter;
      const matchesStatus = statusFilter === "All Status" || e.status === statusFilter;
      return matchesSearch && matchesShow && matchesStatus;
    });
  }, [episodes, searchQuery, showFilter, statusFilter]);
  const shows = ["All Shows", ...new Set(episodes.map((e) => e.show))];
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Episodes / Shows Management", subtitle: "Create, manage and organize all podcast episodes", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
      /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search episodes...", className: "h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: handleNew, className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90", children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      " Add New Episode"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: PlayCircle, label: "Total Episodes", value: episodes.length.toString(), trend: "↑ 12% from last month", tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { icon: CheckCircle2, label: "Published", value: episodes.filter((e) => e.status === "Published").length.toString(), trend: "67% of total", tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Clock, label: "Scheduled", value: episodes.filter((e) => e.status === "Scheduled").length.toString(), trend: "16% of total", tone: "warning" }),
      /* @__PURE__ */ jsx(StatCard, { icon: FileEdit, label: "Drafts", value: episodes.filter((e) => e.status === "Draft").length.toString(), trend: "12% of total", tone: "info" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Trash2, label: "Archived", value: episodes.filter((e) => e.status === "Archived").length.toString(), trend: "5% of total", tone: "destructive" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl p-5", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-3 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Search Episodes" }),
        /* @__PURE__ */ jsx("input", { placeholder: "Search by title or guest...", className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Show / Series" }),
        /* @__PURE__ */ jsx("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: showFilter, onChange: (e) => setShowFilter(e.target.value), children: shows.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsxs("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { children: "All Status" }),
          /* @__PURE__ */ jsx("option", { children: "Published" }),
          /* @__PURE__ */ jsx("option", { children: "Scheduled" }),
          /* @__PURE__ */ jsx("option", { children: "Draft" }),
          /* @__PURE__ */ jsx("option", { children: "Archived" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Published Date" }),
        /* @__PURE__ */ jsx("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: /* @__PURE__ */ jsx("option", { children: "All Time" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => toast.success("Filters applied"), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5 hover:opacity-90", children: [
          /* @__PURE__ */ jsx(Filter, { className: "size-4" }),
          " Filter"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: handleReset, className: "h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 hover:bg-muted", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "size-4" }),
          " Reset"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Episode" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Show / Series" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Guest" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Duration" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Published Date" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: filteredEpisodes.map((e) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: `size-12 rounded-lg ${e.color} grid place-items-center text-white relative`, children: [
                /* @__PURE__ */ jsx(Mic2, { className: "size-5" }),
                /* @__PURE__ */ jsxs("span", { className: "absolute bottom-0.5 left-0.5 text-[8px] bg-black/40 px-1 rounded", children: [
                  "EP #",
                  e.ep
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium max-w-[200px] truncate", children: e.title }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  "Episode #",
                  e.ep
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: e.show }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("img", { src: `https://i.pravatar.cc/64?img=${e.img}`, className: "size-8 rounded-full", alt: "" }),
              /* @__PURE__ */ jsx("span", { children: e.guest })
            ] }) }),
            /* @__PURE__ */ jsxs("td", { className: "p-4 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock, { className: "size-3.5 inline mr-1" }),
              e.dur
            ] }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: e.sv, children: e.status }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: e.date === "—" ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { children: e.date }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: e.time })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => handleView(e), className: "size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors", children: /* @__PURE__ */ jsx(Eye, { className: "size-4" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(e), className: "size-8 rounded-md border border-border grid place-items-center text-warning-foreground hover:bg-warning/10 transition-colors", children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" }) }),
              /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-accent", children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" }) }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => handleView(e), children: "View Details" }),
                  /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => handleEdit(e), children: "Edit Episode" }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:bg-destructive/10 focus:text-destructive", onClick: () => {
                    deleteEpisode(e.id);
                    toast.success(`Episode deleted`);
                  }, children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "mr-2 size-4" }),
                    " Delete"
                  ] })
                ] })
              ] })
            ] }) })
          ] }, e.id)) })
        ] }),
        filteredEpisodes.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No episodes found matching your filters." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 text-sm border-t border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground", children: [
          "Showing ",
          filteredEpisodes.length,
          " of ",
          episodes.length,
          " episodes"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md bg-primary text-primary-foreground", children: "1" }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border hover:bg-muted", children: "2" }),
          /* @__PURE__ */ jsx("button", { className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(EpisodeFormDialog, { open: formOpen, onOpenChange: setFormOpen, episodeToEdit: selectedEpisode || void 0 }),
    /* @__PURE__ */ jsx(EpisodeDetailsDialog, { open: detailsOpen, onOpenChange: setDetailsOpen, episode: selectedEpisode })
  ] });
}
export {
  Episodes as component
};
