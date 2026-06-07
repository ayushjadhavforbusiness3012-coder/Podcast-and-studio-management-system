import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Search,
  Pencil,
  Eye,
  MoreVertical,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext, type Booking } from "@/contexts/AppContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "Studio Bookings — Podcast Studio" }] }),
  component: Bookings,
});

function Bookings() {
  const { bookings, deleteBooking, searchQuery, setSearchQuery } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter Bar state
  const [studioFilter, setStudioFilter] = useState("All Studios");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [targetDate, setTargetDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const handleEdit = (b: Booking) => {
    setSelectedBooking(b);
    setFormOpen(true);
  };
  
  const handleView = (b: Booking) => {
    setSelectedBooking(b);
    setDetailsOpen(true);
  };
  
  const handleNew = () => {
    setSelectedBooking(null);
    setFormOpen(true);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search filter
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        b.guest.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.studio.toLowerCase().includes(q);

      // Studio filter
      const matchesStudio = studioFilter === "All Studios" || b.studio === studioFilter;

      // Status filter
      const matchesStatus = statusFilter === "All Statuses" || b.status === statusFilter;

      // Date filter
      let matchesDate = true;
      if (targetDate) {
        try {
          const bDate = new Date(b.date);
          const fDate = new Date(targetDate);
          matchesDate = bDate.getFullYear() === fDate.getFullYear() &&
                        bDate.getMonth() === fDate.getMonth() &&
                        bDate.getDate() === fDate.getDate();
        } catch (e) {
          console.error(e);
        }
      }

      return matchesSearch && matchesStudio && matchesStatus && matchesDate;
    });
  }, [bookings, searchQuery, studioFilter, statusFilter, targetDate]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const getDuration = (b: Booking) => {
    if (b.duration !== undefined) return `${b.duration} Hours`;
    if (b.time.includes("10:00 AM - 12:00 PM")) return "2 Hours";
    if (b.time.includes("11:00 AM - 01:00 PM")) return "2 Hours";
    if (b.time.includes("01:00 PM - 02:30 PM")) return "1.5 Hours";
    if (b.time.includes("10:30 AM - 12:00 PM")) return "1.5 Hours";
    if (b.time.includes("02:00 PM - 03:30 PM")) return "1.5 Hours";
    return "2 Hours"; 
  };

  const getPaymentStatus = (status: string) => {
    switch (status) {
      case "Confirmed": return { label: "Paid", var: "success" };
      case "Pending": return { label: "Pending", var: "warning" };
      case "Cancelled": return { label: "Refunded", var: "destructive" };
      case "Completed": return { label: "Paid", var: "success" };
      default: return { label: "Unpaid", var: "default" };
    }
  };

  const handleReset = () => {
    setStudioFilter("All Studios");
    setStatusFilter("All Statuses");
    setTargetDate("");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("Filters reset");
  };

  return (
    <DashboardLayout
      title="Studio Bookings"
      subtitle="Manage all studio bookings and reservations"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              placeholder="Search bookings..." 
              className="h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button onClick={handleNew} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <Plus className="size-4" /> New Booking
          </button>
        </>
      }
    >
      {/* Metric Box Header: Statistical summary row enclosed inside panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total Bookings" value={bookings.length.toString()} trend="↑ 18.6% vs last month" tone="primary" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={bookings.filter(b => b.status === "Confirmed").length.toString()} trend="84% of total" tone="success" />
        <StatCard icon={Clock} label="Pending" value={bookings.filter(b => b.status === "Pending").length.toString()} trend="↑ 5% vs last month" tone="warning" />
        <StatCard icon={XCircle} label="Cancelled" value={bookings.filter(b => b.status === "Cancelled").length.toString()} trend="↓ 2% vs last month" trendType="down" tone="destructive" />
      </div>

      {/* Filter Bardirectly underneath the metrics */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Filter by Studio</label>
            <select 
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={studioFilter}
              onChange={(e) => {
                setStudioFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Studios</option>
              <option>Studio A</option>
              <option>Studio B</option>
              <option>Studio C</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Filter by Status</label>
            <select 
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Statuses</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Date</label>
            <input 
              type="date"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toast.success("Filters applied")} 
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-sm"
            >
              Filter
            </button>
            <button 
              onClick={handleReset} 
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Data Grid Table Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 text-left font-semibold">Booking ID</th>
                <th className="p-4 text-left font-semibold">Studio</th>
                <th className="p-4 text-left font-semibold">Guest / Client</th>
                <th className="p-4 text-left font-semibold">Date & Time</th>
                <th className="p-4 text-left font-semibold">Duration</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Amount</th>
                <th className="p-4 text-left font-semibold">Payment Status</th>
                <th className="p-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((r) => {
                const payStatus = getPaymentStatus(r.status);
                
                // Set color indicator on the left side of the row cell block
                let statusBorderClass = "border-l-4 border-l-transparent";
                if (r.status === "Confirmed") statusBorderClass = "border-l-4 border-l-success";
                else if (r.status === "Pending") statusBorderClass = "border-l-4 border-l-warning";
                else if (r.status === "Cancelled") statusBorderClass = "border-l-4 border-l-destructive";
                else if (r.status === "Completed") statusBorderClass = "border-l-4 border-l-primary";

                return (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className={`p-4 font-semibold text-primary ${statusBorderClass}`}>
                      {r.id}
                    </td>
                    <td className="p-4 font-medium text-foreground">{r.studio}</td>
                    <td className="p-4">{r.guest}</td>
                    <td className="p-4">
                      <div className="font-medium">{r.date}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.time}</div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{getDuration(r)}</td>
                    <td className="p-4">
                      <Badge variant={r.sv}>{r.status}</Badge>
                    </td>
                    <td className="p-4 font-semibold text-foreground">{r.amt}</td>
                    <td className="p-4">
                      <Badge variant={payStatus.var as any}>{payStatus.label}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleView(r)} className="size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-all cursor-pointer" title="View details"><Eye className="size-4" /></button>
                        <button onClick={() => handleEdit(r)} className="size-8 rounded-md border border-border grid place-items-center text-foreground hover:bg-muted transition-all cursor-pointer" title="Edit booking"><Pencil className="size-4" /></button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete booking ${r.id}?`)) {
                              deleteBooking(r.id);
                              toast.success(`Booking ${r.id} deleted`);
                            }
                          }}
                          className="size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10 transition-all cursor-pointer" 
                          title="Delete booking"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No bookings found matching the current filters.
            </div>
          )}
        </div>

        {/* Pagination footer at the bottom-right of the table card */}
        <div className="flex items-center justify-between p-4 text-sm border-t border-border flex-wrap gap-2">
          <div className="text-muted-foreground font-medium">
            Showing {Math.min(filteredBookings.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredBookings.length, currentPage * itemsPerPage)} of {filteredBookings.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`size-8 rounded-md text-xs font-semibold transition-all ${
                  currentPage === p
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      
      <BookingFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        bookingToEdit={selectedBooking || undefined} 
      />
      <BookingDetailsDialog 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        booking={selectedBooking} 
      />
    </DashboardLayout>
  );
}
