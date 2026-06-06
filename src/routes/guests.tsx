import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { Users, CheckCircle2, UserPlus, CalendarPlus, Star, Search, Download, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, RotateCcw } from "lucide-react";
import { useAppContext, type Guest } from "@/contexts/AppContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { GuestFormDialog } from "@/components/GuestFormDialog";
import { GuestDetailsDialog } from "@/components/GuestDetailsDialog";

export const Route = createFileRoute("/guests")({
  head: () => ({ meta: [{ title: "Guests — Podcast Studio" }] }),
  component: Guests,
});

function Guests() {
  const { guests, deleteGuest, deleteGuests } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchBy, setSearchBy] = useState("Name");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleEdit = (g: Guest) => {
    setSelectedGuest(g);
    setFormOpen(true);
  };
  
  const handleView = (g: Guest) => {
    setSelectedGuest(g);
    setDetailsOpen(true);
  };
  
  const handleNew = () => {
    setSelectedGuest(null);
    setFormOpen(true);
  };

  const handleToggleSelect = (id: string) => {
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
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGuests.map(g => g.id)));
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setSearchBy("Name");
    setSelectedIds(new Set());
    toast.info("Filters reset");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    deleteGuests(Array.from(selectedIds));
    toast.success(`${selectedIds.size} guests deleted`);
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    const count = selectedIds.size > 0 ? selectedIds.size : guests.length;
    toast.success(`Exporting ${count} guests as CSV...`);
  };

  return (
    <DashboardLayout
      title="Guests Management"
      subtitle="Manage all registered guests and their information"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              placeholder="Search guests..." 
              className="h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {selectedIds.size > 0 && (
            <button onClick={handleDeleteSelected} className="h-10 px-4 rounded-lg border border-destructive/30 text-destructive bg-destructive/10 text-sm font-medium inline-flex items-center gap-2">
              <Trash2 className="size-4" /> Delete Selected ({selectedIds.size})
            </button>
          )}
          <button onClick={handleExport} className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2">
            <Download className="size-4" /> Export
          </button>
          <button onClick={handleNew} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2">
            <Plus className="size-4" /> Add Guest
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Guests" value={guests.length.toString()} trend="↑ 15% from last month" tone="primary" />
        <StatCard icon={CheckCircle2} label="Active Guests" value={guests.filter(g => g.status === "Active").length.toString()} trend="84% of total" tone="success" />
        <StatCard icon={UserPlus} label="New This Month" value="24" trend="↑ 20%" tone="warning" />
        <StatCard icon={CalendarPlus} label="Total Bookings" value={guests.reduce((acc, g) => acc + g.bookings, 0).toString()} trend="↑ 18% from last month" tone="info" />
        <StatCard icon={Star} label="Frequent Guests" value={guests.filter(g => g.bookings >= 3).length.toString()} trend="16% of total" tone="pink" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Search by</label>
            <select 
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option>Name</option>
              <option>Email</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-muted-foreground invisible">x</label>
            <input 
              placeholder="Search..." 
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Status</label>
            <select 
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Joined Date</label>
            <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm">
              <option>All Time</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReset} className="h-10 px-3 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-1.5 hover:bg-muted">
              <RotateCcw className="size-4" /> Reset
            </button>
            <button onClick={() => toast.success("Filters applied")} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5 hover:opacity-90">
              <Filter className="size-4" /> Filter
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
                    checked={selectedIds.size === filteredGuests.length && filteredGuests.length > 0}
                    onChange={handleToggleAll}
                    className="size-4 rounded border-border"
                  />
                </th>
                <th className="p-4 text-left font-medium">Guest</th>
                <th className="p-4 text-left font-medium">Email / Phone</th>
                <th className="p-4 text-left font-medium">Expertise / Topic</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Joined On</th>
                <th className="p-4 text-left font-medium">Total Bookings</th>
                <th className="p-4 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((g) => (
                <tr key={g.id} className={`border-t border-border transition-colors ${selectedIds.has(g.id) ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(g.id)}
                      onChange={() => handleToggleSelect(g.id)}
                      className="size-4 rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/64?img=${g.img}`} className="size-10 rounded-full object-cover" alt="" />
                      <div>
                        <div className="font-medium">{g.name}</div>
                        <div className="text-xs text-muted-foreground">{g.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{g.email}</td>
                  <td className="p-4">{g.topic}</td>
                  <td className="p-4"><Badge variant={g.status === "Active" ? "success" : "destructive"}>{g.status}</Badge></td>
                  <td className="p-4">{g.date}</td>
                  <td className="p-4">{g.bookings}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => handleView(g)} className="size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors"><Eye className="size-4" /></button>
                      <button onClick={() => handleEdit(g)} className="size-8 rounded-md border border-border grid place-items-center text-warning-foreground hover:bg-warning/10 transition-colors"><Pencil className="size-4" /></button>
                      <button onClick={() => { deleteGuest(g.id); toast.success("Guest deleted"); }} className="size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredGuests.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No guests found matching your filters.
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4 text-sm border-t border-border">
          <div className="text-muted-foreground">Showing {filteredGuests.length} of {guests.length} entries</div>
          <div className="flex items-center gap-1">
            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronsLeft className="size-4" /></button>
            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronLeft className="size-4" /></button>
            <button className="size-8 rounded-md bg-primary text-primary-foreground">1</button>
            <button className="size-8 rounded-md border border-border hover:bg-muted">2</button>
            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronRight className="size-4" /></button>
            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronsRight className="size-4" /></button>
          </div>
        </div>
      </div>
      
      <GuestFormDialog open={formOpen} onOpenChange={setFormOpen} guestToEdit={selectedGuest || undefined} />
      <GuestDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} guest={selectedGuest} />
    </DashboardLayout>
  );
}
