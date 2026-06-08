import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChevronLeft, ChevronRight, Plus, Search, RotateCcw } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Podcast Studio" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const { bookings, searchQuery, setSearchQuery, formatDate, formatTime } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState("");

  // Real-time system machine date anchor (June 2026 based on metadata system time)
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Local filter states (applied ONLY when dedicated "Filter" button is clicked)
  const [tempStudio, setTempStudio] = useState("All Studios");
  const [tempStatus, setTempStatus] = useState("All Statuses");
  const [activeStudio, setActiveStudio] = useState("All Studios");
  const [activeStatus, setActiveStatus] = useState("All Statuses");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to parse dates correctly
  const parseBookingDate = (dateStr: string) => {
    try {
      return new Date(dateStr);
    } catch {
      return new Date(0);
    }
  };

  // Check if dates match exactly (year, month, day)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Main calendar grid computation
  const mainCells = useMemo(() => {
    const cellsList: { date: Date; num: number; muted: boolean }[] = [];
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      cellsList.push({ date: new Date(year, month - 1, d), num: d, muted: true });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      cellsList.push({ date: new Date(year, month, i), num: i, muted: false });
    }
    // Next month padding days to complete grid rows
    const remaining = 42 - cellsList.length;
    for (let i = 1; i <= remaining; i++) {
      cellsList.push({ date: new Date(year, month + 1, i), num: i, muted: true });
    }
    return cellsList;
  }, [year, month]);

  // Mini sidebar calendar cells (uses same currentDate year/month)
  const miniCells = useMemo(() => {
    const cellsList: { date: Date; num: number; muted: boolean }[] = [];
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      cellsList.push({ date: new Date(year, month - 1, d), num: d, muted: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cellsList.push({ date: new Date(year, month, i), num: i, muted: false });
    }
    const remaining = 42 - cellsList.length;
    for (let i = 1; i <= remaining; i++) {
      cellsList.push({ date: new Date(year, month + 1, i), num: i, muted: true });
    }
    return cellsList;
  }, [year, month]);

  // Filtered Bookings for the calendar cells
  const getFilteredBookingsForCell = (cellDate: Date) => {
    return bookings.filter((b) => {
      const bDate = parseBookingDate(b.date);
      if (!isSameDay(bDate, cellDate)) return false;

      // Studio filter
      if (activeStudio !== "All Studios" && b.studio !== activeStudio) return false;
      // Status filter
      if (activeStatus !== "All Statuses" && b.status !== activeStatus) return false;

      // Search filter
      const q = searchQuery.toLowerCase();
      if (q) {
        return b.guest.toLowerCase().includes(q) || b.studio.toLowerCase().includes(q);
      }
      return true;
    });
  };

  // Trigger modal when clicking on a calendar cell day
  const handleCellClick = (cellDate: Date) => {
    const formatted = cellDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    setSelectedDateForModal(formatted);
    setFormOpen(true);
  };

  // Sidebar Filter execution logic
  const handleApplyFilter = () => {
    setActiveStudio(tempStudio);
    setActiveStatus(tempStatus);
    toast.success("Filters applied successfully!");
  };

  const handleResetFilters = () => {
    setTempStudio("All Studios");
    setTempStatus("All Statuses");
    setActiveStudio("All Studios");
    setActiveStatus("All Statuses");
    setSearchQuery("");
    setCurrentDate(new Date());
    toast.info("Filters reset");
  };

  // Chronological upcoming bookings sorting
  const sortedUpcomingBookings = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return bookings
      .filter((b) => {
        const bDate = parseBookingDate(b.date);
        const isUpcoming = b.status === "Confirmed" || b.status === "Pending";
        return isUpcoming && bDate >= startOfToday;
      })
      .sort((a, b) => parseBookingDate(a.date).getTime() - parseBookingDate(b.date).getTime());
  }, [bookings]);

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

  const currentMonthYearName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

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
              className="h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        
        {/* Main Calendar Section */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevMonth}
                className="size-9 rounded-lg border border-border grid place-items-center hover:bg-muted cursor-pointer transition-colors"
                title="Previous month"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="size-9 rounded-lg border border-border grid place-items-center hover:bg-muted cursor-pointer transition-colors"
                title="Next month"
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </button>
              <h2 className="text-lg font-bold ml-2 text-foreground">{currentMonthYearName}</h2>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-sm text-muted-foreground border-b border-border">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2.5 font-bold uppercase tracking-wider text-xs">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 border-l border-t border-border">
            {mainCells.map((c, i) => {
              const dayBookings = getFilteredBookingsForCell(c.date);
              const isToday = isSameDay(c.date, new Date());
              return (
                <div 
                  key={i} 
                  onClick={() => handleCellClick(c.date)}
                  className={`min-h-[135px] border-r border-b border-border p-2 cursor-pointer hover:bg-muted/10 transition-colors flex flex-col justify-between ${c.muted ? "bg-muted/5 opacity-55" : ""}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    {isToday ? (
                      <span className="inline-grid place-items-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                        {c.num}
                      </span>
                    ) : (
                      <span className={`text-xs font-semibold ${c.muted ? "text-muted-foreground/50" : "text-foreground"}`}>
                        {c.num}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[90px] flex-1 pr-0.5">
                    {dayBookings.map((b) => (
                      <div key={b.id} className={`rounded-md p-1.5 text-[10px] ${getVariantColor(b.sv)} leading-tight`}>
                        <div className="font-bold truncate">{b.time.includes("to") ? b.time : b.time.split(" - ")[0]}</div>
                        <div className="font-semibold truncate text-foreground/90">{b.guest}</div>
                        <div className="opacity-75 truncate">{b.studio}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 mt-5 text-xs text-muted-foreground border-t border-border pt-4">
            <span className="flex items-center gap-1.5 font-medium"><span className="size-2.5 rounded-full bg-success" /> Confirmed</span>
            <span className="flex items-center gap-1.5 font-medium"><span className="size-2.5 rounded-full bg-warning" /> Pending</span>
            <span className="flex items-center gap-1.5 font-medium"><span className="size-2.5 rounded-full bg-primary" /> Completed</span>
            <span className="flex items-center gap-1.5 font-medium"><span className="size-2.5 rounded-full bg-destructive" /> Cancelled</span>
          </div>
        </div>

        {/* Right Sidebar Widget Stack */}
        <div className="space-y-6">
          <button 
            onClick={() => {
              setSelectedDateForModal("");
              setFormOpen(true);
            }} 
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Plus className="size-4" /> New Booking
          </button>

          {/* Mini Sidebar Calendar */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <button onClick={handlePrevMonth} className="hover:bg-muted p-1 rounded cursor-pointer transition-colors" title="Previous month" aria-label="Previous month"><ChevronLeft className="size-4" /></button>
              <div className="font-bold text-sm text-foreground">{currentMonthYearName}</div>
              <button onClick={handleNextMonth} className="hover:bg-muted p-1 rounded cursor-pointer transition-colors" title="Next month" aria-label="Next month"><ChevronRight className="size-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground mb-1">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="p-1 uppercase">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {miniCells.map((c, i) => {
                const dayBookings = getFilteredBookingsForCell(c.date);
                const hasEvents = dayBookings.length > 0;
                const isToday = isSameDay(c.date, new Date());
                return (
                  <button 
                    key={i} 
                    onClick={() => setCurrentDate(c.date)}
                    className={`p-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer relative hover:bg-muted/50 ${c.muted ? "text-muted-foreground/35" : "text-foreground"} ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}`}
                  >
                    {c.num}
                    {hasEvents && !isToday && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter automation widget */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-foreground">Filter Bookings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-semibold" htmlFor="calendar-filter-studio">Filter by Studio</label>
                <select 
                  id="calendar-filter-studio"
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none"
                  value={tempStudio}
                  onChange={(e) => setTempStudio(e.target.value)}
                  title="Filter by Studio"
                >
                  <option value="All Studios">All Studios</option>
                  <option value="Studio A">Studio A</option>
                  <option value="Studio B">Studio B</option>
                  <option value="Studio C">Studio C</option>
                  <option value="Main Studio">Main Studio</option>
                  <option value="Mini Studio">Mini Studio</option>
                  <option value="Premium Studio">Premium Studio</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold" htmlFor="calendar-filter-status">Filter by Status</label>
                <select 
                  id="calendar-filter-status"
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none"
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  title="Filter by Status"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            {/* Filter automation execution buttons */}
            <div className="flex gap-2 mt-2">
              <button 
                onClick={handleApplyFilter}
                className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                Filter
              </button>
              <button 
                onClick={handleResetFilters}
                className="h-10 w-10 shrink-0 rounded-lg border border-border grid place-items-center text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
                title="Reset Filters"
                aria-label="Reset Filters"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </div>

          {/* Upcoming Bookings chronological stack with vertical scrolling */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-sm text-foreground mb-3">Upcoming Bookings</h3>
            <div className="space-y-3 text-sm overflow-y-auto max-h-60 pr-1">
              {sortedUpcomingBookings.map((u) => (
                <div key={u.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <span className={`size-2 rounded-full mt-2 shrink-0 ${getDotColor(u.sv)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-muted-foreground font-medium">{formatDate(u.date)}, {formatTime(u.time.includes("to") ? u.time : u.time.split(" - ")[0])}</div>
                    <div className="font-semibold text-xs text-foreground truncate mt-0.5">{u.guest}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{u.studio}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 ${getVariantColor(u.sv).split(' ')[0]} ${getVariantColor(u.sv).split(' ')[1]}`}>
                    {u.status}
                  </span>
                </div>
              ))}
              {sortedUpcomingBookings.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-6">No upcoming bookings</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <BookingFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        defaultDate={selectedDateForModal}
      />
    </DashboardLayout>
  );
}
