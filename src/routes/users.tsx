import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { Users, CheckCircle2, ShieldCheck, Pencil, Eye, Plus, Search, Filter, RotateCcw, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserPlus, ArrowRight, CheckCircle, UserCog, Trash2, X } from "lucide-react";
import { useAppContext, type User } from "@/contexts/AppContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users — Podcast Studio" }] }),
  component: UsersPage,
});

function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Add user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Viewer");

  const filteredUsers = useMemo(() => {
    return users
      .map((u, i) => ({ ...u, _idx: i }))
      .filter((u) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
        const matchesStatus = statusFilter === "All Statuses" || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleToggleSelect = (idx: number) => {
    const next = new Set(selectedIdxs);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedIdxs(next);
  };

  const handleToggleAll = () => {
    if (selectedIdxs.size === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedIdxs(new Set());
    } else {
      setSelectedIdxs(new Set(filteredUsers.map((u) => u._idx)));
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setRoleFilter("All Roles");
    setStatusFilter("All Statuses");
    setSelectedIdxs(new Set());
    toast.info("Filters reset");
  };

  const handleDeleteSelected = () => {
    const sorted = Array.from(selectedIdxs).sort((a, b) => b - a);
    sorted.forEach((i) => deleteUser(i));
    toast.success(`${sorted.length} user(s) deleted`);
    setSelectedIdxs(new Set());
  };

  const handleToggleStatus = (idx: number) => {
    const u = users[idx];
    const newStatus = u.status === "Active" ? "Inactive" : "Active";
    updateUser(idx, { status: newStatus });
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
      joined: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      last: "Just now",
      img: Math.floor(Math.random() * 70),
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

  return (
    <DashboardLayout
      title="Users Management"
      subtitle="Manage team members and user permissions"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search users by name, email..."
              className="h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {selectedIdxs.size > 0 && (
            <button onClick={handleDeleteSelected} className="h-10 px-4 rounded-lg border border-destructive/30 text-destructive bg-destructive/10 text-sm font-medium inline-flex items-center gap-2">
              <Trash2 className="size-4" /> Delete ({selectedIdxs.size})
            </button>
          )}
          <button onClick={() => setShowAddDialog(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2">
            <Plus className="size-4" /> Add User
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Users" value={users.length.toString()} trend={`${activeCount} active`} tone="primary" />
        <StatCard icon={CheckCircle2} label="Active Users" value={activeCount.toString()} trend={`${Math.round((activeCount / users.length) * 100)}% of total`} tone="success" />
        <StatCard icon={ShieldCheck} label="Admins" value={adminCount.toString()} trend={`${Math.round((adminCount / users.length) * 100)}% of total`} tone="warning" />
        <StatCard icon={Pencil} label="Editors" value={editorCount.toString()} trend={`${Math.round((editorCount / users.length) * 100)}% of total`} tone="info" />
        <StatCard icon={Eye} label="Viewers" value={viewerCount.toString()} trend={`${Math.round((viewerCount / users.length) * 100)}% of total`} tone="pink" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <input
                placeholder="Search users..."
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div>
                <label className="text-xs text-muted-foreground">Role</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option>All Roles</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Status</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <button onClick={handleReset} className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 hover:bg-muted">
                <RotateCcw className="size-4" /> Reset
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIdxs.size === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleToggleAll}
                        className="size-4 rounded border-border"
                      />
                    </th>
                    <th className="p-4 text-left font-medium">User</th>
                    <th className="p-4 text-left font-medium">Email</th>
                    <th className="p-4 text-left font-medium">Role</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Joined On</th>
                    <th className="p-4 text-left font-medium">Last Active</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._idx} className={`border-t border-border transition-colors ${selectedIdxs.has(u._idx) ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIdxs.has(u._idx)}
                          onChange={() => handleToggleSelect(u._idx)}
                          className="size-4 rounded border-border"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://i.pravatar.cc/64?img=${u.img}`} className="size-9 rounded-full" alt="" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{u.name}</span>
                            {u.you && <Badge variant="primary">You</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4"><Badge variant={u.roleV as any}>{u.role}</Badge></td>
                      <td className="p-4">
                        <button onClick={() => handleToggleStatus(u._idx)} className="cursor-pointer">
                          <Badge variant={u.status === "Active" ? "success" : "destructive"}>{u.status}</Badge>
                        </button>
                      </td>
                      <td className="p-4">{u.joined}</td>
                      <td className="p-4 text-muted-foreground">{u.last}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleToggleStatus(u._idx)}
                            className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"
                            title="Toggle status"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => {
                              deleteUser(u._idx);
                              toast.success(`${u.name} deleted`);
                              setSelectedIdxs(new Set());
                            }}
                            className="size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10"
                            title="Delete user"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No users found matching your filters.</div>
              )}
            </div>
            <div className="flex items-center justify-between p-4 text-sm border-t border-border">
              <div className="text-muted-foreground">Showing {filteredUsers.length} of {users.length} users</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4">User Roles</h3>
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, color: "bg-accent text-primary", title: "Super Admin", desc: "Full access to all features and settings" },
                { icon: UserCog, color: "bg-info/15 text-info", title: "Admin", desc: "Manage users, bookings and content" },
                { icon: Pencil, color: "bg-warning/20 text-warning-foreground", title: "Editor", desc: "Create and edit content, manage episodes" },
                { icon: Eye, color: "bg-pink/20 text-pink-foreground", title: "Viewer", desc: "View and access limited content" },
              ].map((r) => {
                const Ic = r.icon;
                return (
                  <div key={r.title} className="flex gap-3">
                    <div className={`size-10 rounded-lg ${r.color} grid place-items-center shrink-0`}><Ic className="size-5" /></div>
                    <div>
                      <div className="font-medium text-sm">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <a className="text-xs text-primary cursor-pointer">View All</a>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { icon: CheckCircle, color: "bg-success/15 text-success", title: "Rahul Verma logged in", time: "Today, 10:30 AM" },
                { icon: UserPlus, color: "bg-info/15 text-info", title: "Sneha Sharma added a new episode", time: "Today, 09:20 AM" },
                { icon: Pencil, color: "bg-warning/20 text-warning-foreground", title: "Amit Kumar updated studio booking", time: "Yesterday, 05:45 PM" },
                { icon: UserPlus, color: "bg-pink/20 text-pink-foreground", title: "Karan Malhotra invited as viewer", time: "5 Feb 2025, 02:10 PM" },
              ].map((a, i) => {
                const Ic = a.icon;
                return (
                  <div key={i} className="flex gap-3">
                    <div className={`size-8 rounded-full ${a.color} grid place-items-center shrink-0`}><Ic className="size-4" /></div>
                    <div>
                      <div className="text-xs">{a.title}</div>
                      <div className="text-[10px] text-muted-foreground">{a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-5">
            <UserPlus className="size-8 mb-3" />
            <div className="font-semibold">Add New User</div>
            <div className="text-xs opacity-90 mt-1">Invite new team members and manage access.</div>
            <button onClick={() => setShowAddDialog(true)} className="mt-4 w-full bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2">
              <Plus className="size-4" /> Add User <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddDialog(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Add New User</h2>
              <button onClick={() => setShowAddDialog(false)} className="size-8 rounded-lg border border-border grid place-items-center hover:bg-muted"><X className="size-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Full Name</label>
                <input className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter full name" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email Address</label>
                <input className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter email" type="email" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Role</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option>Viewer</option>
                  <option>Editor</option>
                  <option>Admin</option>
                  <option>Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddDialog(false)} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleAddUser} className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add User</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
