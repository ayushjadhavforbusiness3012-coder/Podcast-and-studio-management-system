import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { Users, CheckCircle2, UserPlus, CalendarPlus, Star, Search, Download, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, RotateCcw, FileText } from "lucide-react";
import { useAppContext, type Guest } from "@/contexts/AppContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { GuestFormDialog } from "@/components/GuestFormDialog";
import { GuestDetailsDialog } from "@/components/GuestDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/guests")({
  head: () => ({ meta: [{ title: "Guests — Podcast Studio" }] }),
  component: Guests,
});

function Guests() {
  const { guests, deleteGuest, deleteGuests } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  
  const [tempStatus, setTempStatus] = useState("All Status");
  const [tempDate, setTempDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
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
      // Run search function evaluating against string values in both fields simultaneously
      const matchesSearch = !q || g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All Status" || g.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter) {
        try {
          const gDate = new Date(g.date);
          const fDate = new Date(dateFilter);
          matchesDate = gDate.getFullYear() === fDate.getFullYear() &&
                        gDate.getMonth() === fDate.getMonth() &&
                        gDate.getDate() === fDate.getDate();
        } catch {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [guests, searchQuery, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGuests.slice(start, start + itemsPerPage);
  }, [filteredGuests, currentPage, itemsPerPage]);

  const handleToggleAll = () => {
    if (selectedIds.size === filteredGuests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGuests.map(g => g.id)));
    }
  };

  const handleApplyFilters = () => {
    setStatusFilter(tempStatus);
    setDateFilter(tempDate);
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setTempStatus("All Status");
    setTempDate("");
    setStatusFilter("All Status");
    setDateFilter("");
    setSearchQuery("");
    setSelectedIds(new Set());
    setCurrentPage(1);
    toast.info("Filters reset");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    deleteGuests(Array.from(selectedIds));
    toast.success(`${selectedIds.size} guests deleted`);
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    setExportOpen(true);
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground font-semibold" htmlFor="filter-date">Date</label>
            <input 
              id="filter-date"
              type="date"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none" 
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              title="Select date"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-semibold" htmlFor="filter-status">Status</label>
            <select 
              id="filter-status"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={tempStatus}
              onChange={(e) => {
                setTempStatus(e.target.value);
              }}
              title="Status"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleApplyFilters} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-sm">
              <Filter className="size-4" /> Filter
            </button>
            <button 
              onClick={handleReset} 
              className="h-10 w-10 rounded-lg border border-border grid place-items-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Reset Filters"
              aria-label="Reset Filters"
            >
              <RotateCcw className="size-4" />
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
                    title="Select all guests"
                    aria-label="Select all guests"
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
              {paginatedGuests.map((g) => (
                <tr key={g.id} className={`border-t border-border transition-colors ${selectedIds.has(g.id) ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(g.id)}
                      onChange={() => handleToggleSelect(g.id)}
                      className="size-4 rounded border-border"
                      title={`Select guest ${g.name}`}
                      aria-label={`Select guest ${g.name}`}
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
                      <button onClick={() => handleView(g)} className="size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors cursor-pointer" title="View details" aria-label="View details"><Eye className="size-4" /></button>
                      <button onClick={() => handleEdit(g)} className="size-8 rounded-md border border-border grid place-items-center text-warning-foreground hover:bg-warning/10 transition-colors cursor-pointer" title="Edit guest" aria-label="Edit guest"><Pencil className="size-4" /></button>
                      <button onClick={() => { if (window.confirm("Are you sure you want to delete this guest?")) { deleteGuest(g.id); toast.success("Guest deleted"); } }} className="size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" title="Delete guest" aria-label="Delete guest"><Trash2 className="size-4" /></button>
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
        <div className="flex items-center justify-between p-4 text-sm border-t border-border flex-wrap gap-2">
          <div className="text-muted-foreground">
            Showing {Math.min(filteredGuests.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredGuests.length, currentPage * itemsPerPage)} of {filteredGuests.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="First page" aria-label="First page"><ChevronsLeft className="size-4" /></button>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="Previous page" aria-label="Previous page"><ChevronLeft className="size-4" /></button>
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`size-8 rounded-md text-xs font-semibold cursor-pointer ${
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
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="Next page" aria-label="Next page"><ChevronRight className="size-4" /></button>
            <button onClick={() => setCurrentPage(totalPages || 1)} disabled={currentPage === totalPages || totalPages === 0} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="Last page" aria-label="Last page"><ChevronsRight className="size-4" /></button>
          </div>
        </div>
      </div>
      
      <GuestFormDialog open={formOpen} onOpenChange={setFormOpen} guestToEdit={selectedGuest || undefined} />
      <GuestDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} guest={selectedGuest} />

      {/* Export Guests Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Export Guests</DialogTitle>
            <DialogDescription>Select your preferred format for the exported guests list.</DialogDescription>
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
                
                // If there are selectedIds, we export only those. Otherwise, export filteredGuests
                const guestsToExport = selectedIds.size > 0 
                  ? guests.filter(g => selectedIds.has(g.id))
                  : filteredGuests;

                let csvContent = "data:text/csv;charset=utf-8," 
                  + "Guest ID,Name,Phone,Email,Topic,Status,Date Joined,Total Bookings\n";
                
                guestsToExport.forEach((g) => {
                  const row = [
                    g.id,
                    `"${g.name.replace(/"/g, '""')}"`,
                    `"${g.phone.replace(/"/g, '""')}"`,
                    g.email,
                    `"${g.topic.replace(/"/g, '""')}"`,
                    g.status,
                    g.date,
                    g.bookings
                  ].join(",");
                  csvContent += row + "\n";
                });
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `guests_export_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Guests CSV downloaded successfully!");
              }}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 cursor-pointer transition-all bg-transparent"
            >
              <Download className="size-8 text-success mb-2" />
              <span className="font-semibold text-sm">Spreadsheet (CSV)</span>
              <span className="text-[10px] text-muted-foreground mt-1 text-center">Export raw guests for Excel / Google Sheets</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
