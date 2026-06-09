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
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter,
  Download,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext, type Booking } from "@/contexts/AppContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { shouldHideBookingPayment } from "@/lib/booking-display";
import { useState, useMemo } from "react";


export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "Studio Bookings — Podcast Studio" }] }),
  component: Bookings,
});

function Bookings() {
  const { bookings, deleteBooking, searchQuery, setSearchQuery, formatDate, formatTime } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Filter Bar draft state
  const [tempStudio, setTempStudio] = useState("All Studios");
  const [tempStatus, setTempStatus] = useState("All Statuses");
  const [tempDate, setTempDate] = useState("");

  // Filter Bar applied state
  const [studioFilter, setStudioFilter] = useState("All Studios");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [targetDate, setTargetDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const selectedBooking = selectedBookingId ? bookings.find((booking) => booking.id === selectedBookingId) ?? null : null;
  
  const handleEdit = (b: Booking) => {
    setSelectedBookingId(b.id);
    setFormOpen(true);
  };
  
  const handleView = (b: Booking) => {
    setSelectedBookingId(b.id);
    setDetailsOpen(true);
  };
  
  const handleNew = () => {
    setSelectedBookingId(null);
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

  const getPaymentStatus = (status: Booking["paymentStatus"]) => {
    switch (status) {
      case "Paid": return { label: "Paid", var: "success" };
      case "Partially Paid": return { label: "Partially Paid", var: "info" };
      case "Refunded": return { label: "Refunded", var: "destructive" };
      default: return { label: "Unpaid", var: "warning" };
    }
  };

  const handleApplyFilters = () => {
    setStudioFilter(tempStudio);
    setStatusFilter(tempStatus);
    setTargetDate(tempDate);
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setTempStudio("All Studios");
    setTempStatus("All Statuses");
    setTempDate("");
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
          <button 
            onClick={() => setExportOpen(true)}
            className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2 hover:bg-muted transition-colors cursor-pointer"
          >
            <Download className="size-4" /> Export
          </button>
          <button onClick={handleNew} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <Plus className="size-4" /> New Booking
          </button>
        </>
      }
    >
      {/* Metric Box Header: Statistical summary row enclosed inside panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total Bookings" value={bookings.length.toString()} trend="All local records" tone="primary" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={bookings.filter(b => b.status === "Confirmed").length.toString()} trend="Confirmed records" tone="success" />
        <StatCard icon={Clock} label="Pending" value={bookings.filter(b => b.status === "Pending").length.toString()} trend="Awaiting confirmation" tone="warning" />
        <StatCard icon={XCircle} label="Cancelled" value={bookings.filter(b => b.status === "Cancelled").length.toString()} trend="Cancelled records" trendType="down" tone="destructive" />
      </div>

      {/* Filter Bardirectly underneath the metrics */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="filter-studio">Filter by Studio</label>
            <select 
              id="filter-studio"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={tempStudio}
              onChange={(e) => {
                setTempStudio(e.target.value);
              }}
              title="Filter by Studio"
            >
              <option>All Studios</option>
              <option>Studio A</option>
              <option>Studio B</option>
              <option>Studio C</option>
              <option>Main Studio</option>
              <option>Mini Studio</option>
              <option>Premium Studio</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="filter-status">Filter by Status</label>
            <select 
              id="filter-status"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={tempStatus}
              onChange={(e) => {
                setTempStatus(e.target.value);
              }}
              title="Filter by Status"
            >
              <option>All Statuses</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="filter-date">Date</label>
            <input 
              id="filter-date"
              type="date"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={tempDate}
              onChange={(e) => {
                setTempDate(e.target.value);
              }}
              title="Select date"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleApplyFilters} 
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-sm"
            >
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
                const payStatus = getPaymentStatus(r.paymentStatus);
                const hidePayment = shouldHideBookingPayment(r);
                
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
                      <div className="font-medium">{formatDate(r.date)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{formatTime(r.time)}</div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{getDuration(r)}</td>
                    <td className="p-4">
                      <Badge variant={r.sv}>{r.status}</Badge>
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {hidePayment ? <span className="text-muted-foreground">Hidden</span> : r.amt}
                    </td>
                    <td className="p-4">
                      {hidePayment ? (
                        <span className="text-xs text-muted-foreground">Finalized</span>
                      ) : (
                        <>
                          <Badge variant={payStatus.var as any}>{payStatus.label}</Badge>
                          <div className="text-[10px] text-muted-foreground mt-1">Paid {r.paidAmount}</div>
                        </>
                      )}
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
                    ? "bg-primary text-primary-foreground"
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
              className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-all"
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      
      <BookingFormDialog 
        open={formOpen} 
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedBookingId(null);
        }}
        bookingToEdit={selectedBooking || undefined} 
      />
      <BookingDetailsDialog 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        booking={selectedBooking} 
      />

      {/* Export Bookings Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Export Bookings</DialogTitle>
            <DialogDescription>Select your preferred format for the exported studio bookings list.</DialogDescription>
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
                // CSV formatting:
                let csvContent = "data:text/csv;charset=utf-8," 
                  + "Booking ID,Studio,Guest / Client,Date,Time,Duration,Status,Amount,Payment Status,Paid Amount\n";
                
                filteredBookings.forEach((b) => {
                  const row = [
                    b.id,
                    b.studio,
                    `"${b.guest.replace(/"/g, '""')}"`,
                    b.date,
                    `"${b.time.replace(/"/g, '""')}"`,
                    b.duration !== undefined ? `${b.duration} Hours` : "2 Hours",
                    b.status,
                    `"${b.amt.replace(/"/g, '""')}"`,
                    b.paymentStatus,
                    `"${b.paidAmount.replace(/"/g, '""')}"`
                  ].join(",");
                  csvContent += row + "\n";
                });
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Bookings CSV downloaded successfully!");
              }}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 cursor-pointer transition-all bg-transparent"
            >
              <Download className="size-8 text-success mb-2" />
              <span className="font-semibold text-sm">Spreadsheet (CSV)</span>
              <span className="text-[10px] text-muted-foreground mt-1 text-center">Export raw bookings for Excel / Google Sheets</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
