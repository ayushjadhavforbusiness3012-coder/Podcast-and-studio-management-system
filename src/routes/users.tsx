import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { Users, CheckCircle2, ShieldCheck, Pencil, Eye, Filter, RotateCcw, ChevronLeft, ChevronRight, UserCog, Trash2, CheckCircle, Plus, Download, FileText } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users — Podcast Studio" }] }),
  component: UsersPage,
});

function UsersPage() {
  const { users, addUser, updateUser, deleteUser, formatDate } = useAppContext();

  const [tempRole, setTempRole] = useState("All Roles");
  const [tempStatus, setTempStatus] = useState("All Statuses");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [exportOpen, setExportOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Editor");

  const filteredUsers = useMemo(() => {
    return users
      .map((u, i) => ({ ...u, _idx: i }))
      .filter((u) => {
        const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
        const matchesStatus = statusFilter === "All Statuses" || u.status === statusFilter;
        return matchesRole && matchesStatus;
      });
  }, [users, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

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

  const handleApplyFilters = () => {
    setRoleFilter(tempRole);
    setStatusFilter(tempStatus);
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setTempRole("All Roles");
    setTempStatus("All Statuses");
    setRoleFilter("All Roles");
    setStatusFilter("All Statuses");
    setSelectedIdxs(new Set());
    setCurrentPage(1);
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
          {selectedIdxs.size > 0 && (
            <button onClick={handleDeleteSelected} className="h-10 px-4 rounded-lg border border-destructive/30 text-destructive bg-destructive/10 text-sm font-medium inline-flex items-center gap-2 cursor-pointer">
              <Trash2 className="size-4" /> Delete ({selectedIdxs.size})
            </button>
          )}
          <button 
            onClick={() => setExportOpen(true)}
            className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2 hover:bg-muted transition-colors cursor-pointer"
          >
            <Download className="size-4" /> Export
          </button>
          <button 
            onClick={() => {
              setNewName("");
              setNewEmail("");
              setNewRole("Editor");
              setShowAddDialog(true);
            }} 
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm cursor-pointer"
          >
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs text-muted-foreground font-medium" htmlFor="filter-role">Role</label>
                <select id="filter-role" className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={tempRole} onChange={(e) => setTempRole(e.target.value)} title="Role">
                  <option>All Roles</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium" htmlFor="filter-status">Status</label>
                <select id="filter-status" className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={tempStatus} onChange={(e) => setTempStatus(e.target.value)} title="Status">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleApplyFilters} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-sm">
                  <Filter className="size-4" /> Filter
                </button>
                <button
                  onClick={handleReset}
                  className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                  title="Reset Filters"
                  aria-label="Reset Filters"
                >
                  <RotateCcw className="size-4" /> Reset
                </button>
              </div>
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
                        title="Select all users"
                        aria-label="Select all users"
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
                  {paginatedUsers.map((u) => {
                    let statusBorderClass = "border-l-4 border-l-transparent";
                    if (u.status === "Active") statusBorderClass = "border-l-4 border-l-success";
                    else if (u.status === "Inactive") statusBorderClass = "border-l-4 border-l-destructive";

                    return (
                      <tr key={u._idx} className={`border-t border-border transition-colors ${selectedIdxs.has(u._idx) ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                        <td className={`p-4 ${statusBorderClass}`}>
                          <input
                            type="checkbox"
                            checked={selectedIdxs.has(u._idx)}
                            onChange={() => handleToggleSelect(u._idx)}
                            className="size-4 rounded border-border ml-1"
                            title={`Select user ${u.name}`}
                            aria-label={`Select user ${u.name}`}
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
                        <td className="p-4">{formatDate(u.joined)}</td>
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
                    );
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No users found matching your filters.</div>
              )}
            </div>
            <div className="flex items-center justify-between p-4 text-sm border-t border-border flex-wrap gap-2">
              <div className="text-muted-foreground font-medium">
                Showing {Math.min(filteredUsers.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredUsers.length, currentPage * itemsPerPage)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Previous page"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`size-8 rounded-md text-xs font-semibold transition-all ${
                      currentPage === p
                        ? "bg-primary text-primary-foreground font-bold"
                        : "border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    title={`Page ${p}`}
                    aria-label={`Page ${p}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Next page"
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
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
                { icon: UserCog, color: "bg-info/15 text-info", title: "Sneha Sharma updated settings", time: "Today, 09:20 AM" },
                { icon: Pencil, color: "bg-warning/20 text-warning-foreground", title: "Amit Kumar updated studio booking", time: "Yesterday, 05:45 PM" },
                { icon: UserCog, color: "bg-pink/20 text-pink-foreground", title: "Karan Malhotra modified user permissions", time: "5 Feb 2025, 02:10 PM" },
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
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Invite a new team member to your podcast studio management system.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newName.trim() || !newEmail.trim()) {
                toast.error("Please fill in all required fields");
                return;
              }
              
              let roleV = "info";
              if (newRole === "Super Admin") roleV = "primary";
              else if (newRole === "Viewer") roleV = "warning";
              
              addUser({
                name: newName.trim(),
                email: newEmail.trim(),
                role: newRole,
                roleV,
                status: "Active",
                joined: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                last: "Never active",
                img: Math.floor(Math.random() * 70)
              });
              
              setShowAddDialog(false);
              toast.success(`User '${newName}' invited successfully!`);
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <label htmlFor="new-user-name" className="text-sm font-medium">Full Name</label>
              <input
                id="new-user-name"
                type="text"
                required
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="new-user-email" className="text-sm font-medium">Email Address</label>
              <input
                id="new-user-email"
                type="email"
                required
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="new-user-role" className="text-sm font-medium">Role</label>
              <select
                id="new-user-role"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <DialogFooter className="pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent cursor-pointer"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer"
              >
                Add User
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Export Users Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Export Users</DialogTitle>
            <DialogDescription>Select your preferred format for the exported users list.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => {
                setExportOpen(false);
                toast.success("Preparing PDF print layout...");
                setTimeout(() => {
                  window.print();
                }, 500);
              }}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 cursor-pointer transition-all bg-transparent"
            >
              <FileText className="size-8 text-primary mb-2" />
              <span className="font-semibold text-sm">Print / PDF</span>
              <span className="text-[10px] text-muted-foreground mt-1 text-center">Print layout optimized for paper or PDF</span>
            </button>
            <button
              onClick={() => {
                setExportOpen(false);
                let csvContent = "data:text/csv;charset=utf-8," 
                  + "Name,Email,Role,Status,Joined On,Last Active\n";
                
                filteredUsers.forEach((u) => {
                  const row = [
                    `"${u.name.replace(/"/g, '""')}"`,
                    u.email,
                    u.role,
                    u.status,
                    u.joined,
                    `"${u.last.replace(/"/g, '""')}"`
                  ].join(",");
                  csvContent += row + "\n";
                });
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Users CSV downloaded successfully!");
              }}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 cursor-pointer transition-all bg-transparent"
            >
              <Download className="size-8 text-success mb-2" />
              <span className="font-semibold text-sm">Spreadsheet (CSV)</span>
              <span className="text-[10px] text-muted-foreground mt-1 text-center">Export raw users for Excel / Google Sheets</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
