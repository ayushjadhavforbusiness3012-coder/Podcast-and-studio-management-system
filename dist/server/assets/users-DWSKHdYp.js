import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout, S as StatCard, B as Badge } from "./DashboardLayout-DBeZ8czl.js";
import { Users, CheckCircle2, ShieldCheck, Pencil, Eye, RotateCcw, Trash2, UserCog, CheckCircle, UserPlus, Plus, ArrowRight, X, Search } from "lucide-react";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import "@tanstack/react-router";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
function UsersPage() {
  const {
    users,
    addUser,
    updateUser,
    deleteUser
  } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedIdxs, setSelectedIdxs] = useState(/* @__PURE__ */ new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Viewer");
  const filteredUsers = useMemo(() => {
    return users.map((u, i) => ({
      ...u,
      _idx: i
    })).filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All Statuses" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);
  const handleToggleSelect = (idx) => {
    const next = new Set(selectedIdxs);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedIdxs(next);
  };
  const handleToggleAll = () => {
    if (selectedIdxs.size === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedIdxs(/* @__PURE__ */ new Set());
    } else {
      setSelectedIdxs(new Set(filteredUsers.map((u) => u._idx)));
    }
  };
  const handleReset = () => {
    setSearchQuery("");
    setRoleFilter("All Roles");
    setStatusFilter("All Statuses");
    setSelectedIdxs(/* @__PURE__ */ new Set());
    toast.info("Filters reset");
  };
  const handleDeleteSelected = () => {
    const sorted = Array.from(selectedIdxs).sort((a, b) => b - a);
    sorted.forEach((i) => deleteUser(i));
    toast.success(`${sorted.length} user(s) deleted`);
    setSelectedIdxs(/* @__PURE__ */ new Set());
  };
  const handleToggleStatus = (idx) => {
    const u = users[idx];
    const newStatus = u.status === "Active" ? "Inactive" : "Active";
    updateUser(idx, {
      status: newStatus
    });
    toast.success(`${u.name} is now ${newStatus}`);
  };
  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const roleV = newRole === "Super Admin" || newRole === "Admin" ? "primary" : newRole === "Editor" ? "info" : "warning";
    addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      roleV,
      status: "Active",
      joined: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      last: "Just now",
      img: Math.floor(Math.random() * 70)
    });
    toast.success(`${newName} added successfully`);
    setNewName("");
    setNewEmail("");
    setNewRole("Viewer");
    setShowAddDialog(false);
  };
  const activeCount = users.filter((u) => u.status === "Active").length;
  const adminCount = users.filter((u) => u.role === "Super Admin" || u.role === "Admin").length;
  const editorCount = users.filter((u) => u.role === "Editor").length;
  const viewerCount = users.filter((u) => u.role === "Viewer").length;
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Users Management", subtitle: "Manage team members and user permissions", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
      /* @__PURE__ */ jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search users by name, email...", className: "h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
    ] }),
    selectedIdxs.size > 0 && /* @__PURE__ */ jsxs("button", { onClick: handleDeleteSelected, className: "h-10 px-4 rounded-lg border border-destructive/30 text-destructive bg-destructive/10 text-sm font-medium inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Trash2, { className: "size-4" }),
      " Delete (",
      selectedIdxs.size,
      ")"
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: () => setShowAddDialog(true), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      " Add User"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: Users, label: "Total Users", value: users.length.toString(), trend: `${activeCount} active`, tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { icon: CheckCircle2, label: "Active Users", value: activeCount.toString(), trend: `${Math.round(activeCount / users.length * 100)}% of total`, tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { icon: ShieldCheck, label: "Admins", value: adminCount.toString(), trend: `${Math.round(adminCount / users.length * 100)}% of total`, tone: "warning" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Pencil, label: "Editors", value: editorCount.toString(), trend: `${Math.round(editorCount / users.length * 100)}% of total`, tone: "info" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Eye, label: "Viewers", value: viewerCount.toString(), trend: `${Math.round(viewerCount / users.length * 100)}% of total`, tone: "pink" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl p-5", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3 items-end", children: [
          /* @__PURE__ */ jsx("input", { placeholder: "Search users...", className: "h-10 rounded-lg border border-border bg-card px-3 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Role" }),
            /* @__PURE__ */ jsxs("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { children: "All Roles" }),
              /* @__PURE__ */ jsx("option", { children: "Super Admin" }),
              /* @__PURE__ */ jsx("option", { children: "Admin" }),
              /* @__PURE__ */ jsx("option", { children: "Editor" }),
              /* @__PURE__ */ jsx("option", { children: "Viewer" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxs("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { children: "All Statuses" }),
              /* @__PURE__ */ jsx("option", { children: "Active" }),
              /* @__PURE__ */ jsx("option", { children: "Inactive" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: handleReset, className: "h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 hover:bg-muted", children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "size-4" }),
            " Reset"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left", children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIdxs.size === filteredUsers.length && filteredUsers.length > 0, onChange: handleToggleAll, className: "size-4 rounded border-border" }) }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "User" }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Email" }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Role" }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Joined On" }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Last Active" }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-left font-medium", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: filteredUsers.map((u) => /* @__PURE__ */ jsxs("tr", { className: `border-t border-border transition-colors ${selectedIdxs.has(u._idx) ? "bg-primary/5" : "hover:bg-muted/30"}`, children: [
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIdxs.has(u._idx), onChange: () => handleToggleSelect(u._idx), className: "size-4 rounded border-border" }) }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("img", { src: `https://i.pravatar.cc/64?img=${u.img}`, className: "size-9 rounded-full", alt: "" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: u.name }),
                    u.you && /* @__PURE__ */ jsx(Badge, { variant: "primary", children: "You" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "p-4 text-muted-foreground", children: u.email }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: u.roleV, children: u.role }) }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("button", { onClick: () => handleToggleStatus(u._idx), className: "cursor-pointer", children: /* @__PURE__ */ jsx(Badge, { variant: u.status === "Active" ? "success" : "destructive", children: u.status }) }) }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: u.joined }),
                /* @__PURE__ */ jsx("td", { className: "p-4 text-muted-foreground", children: u.last }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => handleToggleStatus(u._idx), className: "size-8 rounded-md border border-border grid place-items-center hover:bg-muted", title: "Toggle status", children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    deleteUser(u._idx);
                    toast.success(`${u.name} deleted`);
                    setSelectedIdxs(/* @__PURE__ */ new Set());
                  }, className: "size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10", title: "Delete user", children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" }) })
                ] }) })
              ] }, u._idx)) })
            ] }),
            filteredUsers.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No users found matching your filters." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between p-4 text-sm border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground", children: [
            "Showing ",
            filteredUsers.length,
            " of ",
            users.length,
            " users"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "User Roles" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [{
            icon: ShieldCheck,
            color: "bg-accent text-primary",
            title: "Super Admin",
            desc: "Full access to all features and settings"
          }, {
            icon: UserCog,
            color: "bg-info/15 text-info",
            title: "Admin",
            desc: "Manage users, bookings and content"
          }, {
            icon: Pencil,
            color: "bg-warning/20 text-warning-foreground",
            title: "Editor",
            desc: "Create and edit content, manage episodes"
          }, {
            icon: Eye,
            color: "bg-pink/20 text-pink-foreground",
            title: "Viewer",
            desc: "View and access limited content"
          }].map((r) => {
            const Ic = r.icon;
            return /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `size-10 rounded-lg ${r.color} grid place-items-center shrink-0`, children: /* @__PURE__ */ jsx(Ic, { className: "size-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: r.title }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: r.desc })
              ] })
            ] }, r.title);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Recent Activity" }),
            /* @__PURE__ */ jsx("a", { className: "text-xs text-primary cursor-pointer", children: "View All" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm", children: [{
            icon: CheckCircle,
            color: "bg-success/15 text-success",
            title: "Rahul Verma logged in",
            time: "Today, 10:30 AM"
          }, {
            icon: UserPlus,
            color: "bg-info/15 text-info",
            title: "Sneha Sharma added a new episode",
            time: "Today, 09:20 AM"
          }, {
            icon: Pencil,
            color: "bg-warning/20 text-warning-foreground",
            title: "Amit Kumar updated studio booking",
            time: "Yesterday, 05:45 PM"
          }, {
            icon: UserPlus,
            color: "bg-pink/20 text-pink-foreground",
            title: "Karan Malhotra invited as viewer",
            time: "5 Feb 2025, 02:10 PM"
          }].map((a, i) => {
            const Ic = a.icon;
            return /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `size-8 rounded-full ${a.color} grid place-items-center shrink-0`, children: /* @__PURE__ */ jsx(Ic, { className: "size-4" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs", children: a.title }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: a.time })
              ] })
            ] }, i);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx(UserPlus, { className: "size-8 mb-3" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Add New User" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs opacity-90 mt-1", children: "Invite new team members and manage access." }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setShowAddDialog(true), className: "mt-4 w-full bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
            " Add User ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
          ] })
        ] })
      ] })
    ] }),
    showAddDialog && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", onClick: () => setShowAddDialog(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-xl", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Add New User" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAddDialog(false), className: "size-8 rounded-lg border border-border grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsx(X, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Full Name" }),
          /* @__PURE__ */ jsx("input", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "Enter full name" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Email Address" }),
          /* @__PURE__ */ jsx("input", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: newEmail, onChange: (e) => setNewEmail(e.target.value), placeholder: "Enter email", type: "email" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Role" }),
          /* @__PURE__ */ jsxs("select", { className: "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", value: newRole, onChange: (e) => setNewRole(e.target.value), children: [
            /* @__PURE__ */ jsx("option", { children: "Viewer" }),
            /* @__PURE__ */ jsx("option", { children: "Editor" }),
            /* @__PURE__ */ jsx("option", { children: "Admin" }),
            /* @__PURE__ */ jsx("option", { children: "Super Admin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-6", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAddDialog(false), className: "flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: handleAddUser, className: "flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium", children: "Add User" })
      ] })
    ] }) })
  ] });
}
export {
  UsersPage as component
};
