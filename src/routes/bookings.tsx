import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { CalendarDays, CheckCircle2, Clock, XCircle, Plus, Search, Pencil, Eye, MoreVertical, Trash2 } from "lucide-react";
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
    if (!searchQuery) return bookings;
    const q = searchQuery.toLowerCase();
    return bookings.filter(
      (b) =>
        b.guest.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.studio.toLowerCase().includes(q)
    );
  }, [bookings, searchQuery]);

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
              className="h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={handleNew} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2"><Plus className="size-4" /> New Booking</button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total Bookings" value={bookings.length.toString()} trend="↑ 18.6% vs last month" tone="primary" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={bookings.filter(b => b.status === "Confirmed").length.toString()} trend="84% of total" tone="success" />
        <StatCard icon={Clock} label="Pending" value={bookings.filter(b => b.status === "Pending").length.toString()} trend="↑ 5% vs last month" tone="warning" />
        <StatCard icon={XCircle} label="Cancelled" value={bookings.filter(b => b.status === "Cancelled").length.toString()} trend="↓ 2% vs last month" trendType="down" tone="destructive" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 text-left font-medium">Booking ID</th>
                <th className="p-4 text-left font-medium">Guest</th>
                <th className="p-4 text-left font-medium">Studio</th>
                <th className="p-4 text-left font-medium">Package</th>
                <th className="p-4 text-left font-medium">Date & Time</th>
                <th className="p-4 text-left font-medium">Amount</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-primary">{r.id}</td>
                  <td className="p-4">{r.guest}</td>
                  <td className="p-4">{r.studio}</td>
                  <td className="p-4">{r.pkg}</td>
                  <td className="p-4">
                    <div>{r.date}</div>
                    <div className="text-xs text-muted-foreground">{r.time}</div>
                  </td>
                  <td className="p-4 font-medium">{r.amt}</td>
                  <td className="p-4"><Badge variant={r.sv}>{r.status}</Badge></td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => handleView(r)} className="size-8 rounded-md border border-border grid place-items-center text-info hover:bg-accent"><Eye className="size-4" /></button>
                      <button onClick={() => handleEdit(r)} className="size-8 rounded-md border border-border grid place-items-center hover:bg-accent"><Pencil className="size-4" /></button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-accent"><MoreVertical className="size-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(r)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(r)}>Edit Booking</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => {
                              deleteBooking(r.id);
                              toast.success(`Booking ${r.id} deleted`);
                            }}
                          >
                            <Trash2 className="mr-2 size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No bookings found matching "{searchQuery}"
            </div>
          )}
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
