import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Podcast Studio" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const { bookings, searchQuery, setSearchQuery } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);

  // Group bookings by day for May 2025
  const bookingsByDay = useMemo(() => {
    const grouped: Record<number, any[]> = {};
    bookings.forEach((b) => {
      // Assuming mock data format like "25 May 2025"
      if (b.date.includes("May")) {
        const dayMatch = b.date.match(/^(\d{1,2})/);
        if (dayMatch) {
          const day = parseInt(dayMatch[1], 10);
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(b);
        }
      }
    });
    return grouped;
  }, [bookings]);

  const cells: { num: number; muted: boolean }[] = [];
  [27, 28, 29, 30].forEach((n) => cells.push({ num: n, muted: true }));
  for (let i = 1; i <= 31; i++) cells.push({ num: i, muted: false });

  // Upcoming bookings for the sidebar
  const upcomingBookings = [...bookings]
    .filter((b) => b.status === "Confirmed" || b.status === "Pending")
    .slice(0, 5);

  const getVariantColor = (sv: string) => {
    switch (sv) {
      case "success": return "bg-success/15 text-success-foreground border-l-4 border-success";
      case "warning": return "bg-warning/20 text-warning-foreground border-l-4 border-warning";
      case "destructive": return "bg-destructive/15 text-destructive border-l-4 border-destructive";
      case "primary": return "bg-accent text-primary border-l-4 border-primary";
      default: return "bg-info/15 text-info border-l-4 border-info";
    }
  };

  const getDotColor = (sv: string) => {
    switch (sv) {
      case "success": return "bg-success";
      case "warning": return "bg-warning";
      case "destructive": return "bg-destructive";
      case "primary": return "bg-primary";
      default: return "bg-info";
    }
  };

  return (
    <DashboardLayout
      title="Calendar"
      subtitle="View and manage all studio bookings"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              placeholder="Search bookings..." 
              className="h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 rounded-lg border border-border text-sm">Today</button>
              <button className="size-9 rounded-lg border border-border grid place-items-center"><ChevronLeft className="size-4" /></button>
              <button className="size-9 rounded-lg border border-border grid place-items-center"><ChevronRight className="size-4" /></button>
              <h2 className="text-lg font-semibold ml-2">May 2025</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <button className="px-4 py-1.5 rounded-md text-sm bg-primary text-primary-foreground font-medium">Month</button>
                <button className="px-4 py-1.5 rounded-md text-sm">Week</button>
                <button className="px-4 py-1.5 rounded-md text-sm">Day</button>
              </div>
              <button className="h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5"><Filter className="size-4" /> Filter</button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-sm text-muted-foreground border-b border-border">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-2 font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((c, i) => {
              const dayBookings = !c.muted ? bookingsByDay[c.num] : undefined;
              const today = !c.muted && c.num === 15;
              return (
                <div key={i} className="min-h-[110px] border-r border-b border-border p-2 last:border-r-0">
                  <div className={`text-sm mb-1 ${c.muted ? "text-muted-foreground/50" : ""} ${today ? "" : ""}`}>
                    {today ? <span className="inline-grid place-items-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">{c.num}</span> : c.num}
                  </div>
                  {dayBookings && dayBookings.map((b, idx) => (
                    <div key={idx} className={`rounded-md p-1.5 text-[10px] mb-1 ${getVariantColor(b.sv)}`}>
                      <div className="font-medium">{b.time.split(" - ")[0]}</div>
                      <div className="font-semibold truncate text-foreground">{b.guest}</div>
                      <div className="text-muted-foreground truncate">{b.studio}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" /> Confirmed</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" /> Pending</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Completed</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> Cancelled</span>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={() => setFormOpen(true)} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-90">
            <Plus className="size-4" /> New Booking
          </button>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <button><ChevronLeft className="size-4" /></button>
              <div className="font-semibold">May 2025</div>
              <button><ChevronRight className="size-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="text-muted-foreground p-1">{d}</div>)}
              {cells.map((c, i) => (
                <div key={i} className={`p-1.5 rounded-md ${c.muted ? "text-muted-foreground/40" : ""} ${c.num === 15 && !c.muted ? "bg-primary text-primary-foreground font-semibold" : ""}`}>
                  {c.num}
                  {bookingsByDay[c.num] && !c.muted && <div className="size-1 bg-primary rounded-full mx-auto mt-0.5"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Filter by Studio</label>
              <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"><option>All Studios</option></select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Filter by Status</label>
              <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"><option>All Statuses</option></select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Upcoming Bookings</h3>
              <a className="text-xs text-primary">View All</a>
            </div>
            <div className="space-y-3 text-sm">
              {upcomingBookings.map((u) => (
                <div key={u.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <span className={`size-2 rounded-full mt-1.5 ${getDotColor(u.sv)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">{u.date}, {u.time.split(" - ")[0]}</div>
                    <div className="font-medium truncate">{u.guest}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.studio}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${getVariantColor(u.sv).split(' ')[0]} ${getVariantColor(u.sv).split(' ')[1]}`}>
                    {u.status}
                  </span>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">No upcoming bookings</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <BookingFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </DashboardLayout>
  );
}
