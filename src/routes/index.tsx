import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { useAppContext } from "@/contexts/AppContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { GuestFormDialog } from "@/components/GuestFormDialog";
import { EpisodeFormDialog } from "@/components/EpisodeFormDialog";
import { bookingRevenue, currencySymbol, formatCurrency, totalRevenue as calculateTotalRevenue, invoiceRevenue } from "@/lib/money";
import { useState, useMemo } from "react";
import {
  CalendarDays,
  Wallet,
  Users,
  CalendarCheck,
  Plus,
  Mic2,
  FileText,
  BellRing,
  UserPlus,
  ShieldAlert
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Podcast Studio" },
      { name: "description", content: "Overview of your podcast studio: bookings, revenue, and upcoming schedule." },
    ],
  }),
  component: Dashboard,
});

const studioColors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#14b8a6"];

function parseRecordDate(dateStr: string) {
  if (!dateStr || dateStr === "—" || dateStr === "â€”") return null;
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function Dashboard() {
  const { bookings, guests, episodes, invoices, settings, addNotification, formatDate, formatTime } = useAppContext();
  const moneySymbol = currencySymbol(settings.payment.currency);

  // Helper to format recent booking dates stripping the year value
  const formatRecentBookingTime = (dateStr: string, timeStr: string) => {
    return `${formatDate(dateStr)}, ${formatTime(timeStr).split(" - ")[0]}`;
  };
  const [formOpen, setFormOpen] = useState(false);
  const [guestFormOpen, setGuestFormOpen] = useState(false);
  const [episodeFormOpen, setEpisodeFormOpen] = useState(false);

  // Selector state for Booking Overview
  const [selectedMonth, setSelectedMonth] = useState(
    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][new Date().getMonth()]
  );

  // Selector state for Revenue Overview
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Dynamic calculations based on database-backed state
  const totalBookings = bookings.length;
  const totalGuests = guests.length;
  const totalRevenue = calculateTotalRevenue(bookings, invoices);
  const upcomingBookingsCount = bookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
  const episodesPublishedCount = episodes.filter(e => e.status === "Published").length;

  const recentBookings = bookings.slice(0, 5);
  const upcomingList = useMemo(() => {
    return bookings
      .filter(b => b.status === "Confirmed" || b.status === "Pending")
      .slice(0, 3)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [bookings]);

  const monthNames = useMemo(() => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ], []);

  // Booking overview uses real bookings for the selected month in the current year.
  const bookingOverviewData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const selIdx = monthNames.indexOf(selectedMonth);
    const totalDays = new Date(currentYear, selIdx + 1, 0).getDate();

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1;
      const count = bookings.filter((booking) => {
        const date = parseRecordDate(booking.date);
        return date?.getFullYear() === currentYear && date.getMonth() === selIdx && date.getDate() === day;
      }).length;
      return { name: `${selectedMonth.substring(0, 3)} ${day}`, bookings: count };
    });
  }, [selectedMonth, monthNames, bookings]);

  // Status summary counts real bookings for the selected month in the current year.
  const statusSummaryCounts = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const selIdx = monthNames.indexOf(selectedMonth);
    const bookingsForMonth = bookings.filter((booking) => {
      const date = parseRecordDate(booking.date);
      return date?.getFullYear() === currentYear && date.getMonth() === selIdx;
    });

    return {
      confirmed: bookingsForMonth.filter(b => b.status === "Confirmed").length,
      pending: bookingsForMonth.filter(b => b.status === "Pending").length,
      completed: bookingsForMonth.filter(b => b.status === "Completed").length,
      cancelled: bookingsForMonth.filter(b => b.status === "Cancelled").length
    };
  }, [selectedMonth, monthNames, bookings]);

  // Revenue overview groups paid invoices by month for the selected year.
  const revenueOverviewData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, idx) => {
      const revenue = invoices
        .filter((invoice) => {
          const date = parseRecordDate(invoice.date);
          return date?.getFullYear() === selectedYear && date.getMonth() === idx;
        })
        .reduce((sum, invoice) => sum + invoiceRevenue(invoice), 0);
      const bookingRevenueTotal = bookings
        .filter((booking) => {
          const date = parseRecordDate(booking.date);
          return date?.getFullYear() === selectedYear && date.getMonth() === idx;
        })
        .reduce((sum, booking) => sum + bookingRevenue(booking), 0);
      return { name: m, revenue: revenue + bookingRevenueTotal };
    });
  }, [selectedYear, invoices, bookings]);

  const totalEarnedThisYear = useMemo(() => {
    return revenueOverviewData.reduce((sum, item) => sum + item.revenue, 0);
  }, [revenueOverviewData]);

  const studioData = useMemo(() => {
    const counts = bookings.reduce<Record<string, number>>((acc, booking) => {
      acc[booking.studio] = (acc[booking.studio] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, count], index) => ({
      name,
      count,
      value: bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0,
      color: studioColors[index % studioColors.length],
    }));
  }, [bookings]);

  // Dynamic years dropdown starting from genesis year 2026
  const targetYears = useMemo(() => {
    const startYear = 2026;
    const currentYear = new Date().getFullYear();
    const endYear = Math.max(currentYear + 5, 2030);
    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  }, []);

  return (
    <DashboardLayout
      title="Welcome back, Admin!"
      subtitle="Here's what's happening with your podcast studio today."
      actions={
        <>
          <button onClick={() => setFormOpen(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <Plus className="size-4" /> New Booking
          </button>
        </>
      }
    >
      {/* Top Metric Panels Grid - 5 columns side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={CalendarDays} label="Total Bookings" value={totalBookings.toLocaleString()} trend="All local records" tone="primary" />
        <StatCard icon={Users} label="Total Guests" value={totalGuests.toLocaleString()} trend="All local records" tone="info" />
        <StatCard icon={Wallet} label="Total Revenue" value={formatCurrency(totalRevenue, moneySymbol)} trend="Paid invoices" tone="success" />
        <StatCard icon={CalendarCheck} label="Upcoming Bookings" value={upcomingBookingsCount.toString()} trend="Active schedule" tone="pink" />
        <StatCard icon={Mic2} label="Episodes Published" value={episodesPublishedCount.toString()} trend="Published episodes" tone="warning" />
      </div>

      {/* Upper Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Booking Overview Area Chart - Spans 5 columns */}
        <div className="bg-card rounded-2xl border border-border p-3 flex flex-col shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-semibold text-foreground text-sm">Booking Overview</h2>
            <select
              className="text-xs border border-border rounded-md px-2 py-1 bg-card cursor-pointer focus:outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              title="Select Month"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
            <div className="md:col-span-2 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingOverviewData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} allowDecimals={false} domain={[0, "dataMax"]} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="linear" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 3 }} isAnimationActive={false} className="booking-overview-line" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Status Count Summary lane */}
            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-3 space-y-2">
              <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Status Summary</h4>
             <div className="flex justify-between items-center text-xs w-full min-w-0 gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 bg-muted"><span className="size-2 rounded-full bg-success" />Confirmed</span>
                <span className="font-semibold text-foreground">{statusSummaryCounts.confirmed}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" /> Pending</span>
                <span className="font-semibold text-foreground">{statusSummaryCounts.pending}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Completed</span>
                <span className="font-semibold text-foreground">{statusSummaryCounts.completed}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> Cancelled</span>
                <span className="font-semibold text-foreground">{statusSummaryCounts.cancelled}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Overview Bar Chart - Spans 4 columns */}
        <div className="bg-card rounded-2xl border border-border p-3 flex flex-col shadow-sm lg:col-span-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-semibold text-foreground text-sm">Revenue Overview</h2>
            <select
              className="text-xs border border-border rounded-md px-2 py-1 bg-card cursor-pointer focus:outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              title="Select Year"
            >
              {targetYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {/* Dynamic Annual Total Metric Banner */}
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold mb-2">
            Total Earned This Year: {formatCurrency(totalEarnedThisYear, moneySymbol)}
          </div>
          <div className="w-full h-36 overflow-x-auto">
            <div className="min-w-[450px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueOverviewData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} tickFormatter={(v) => formatCurrency(Number(v), moneySymbol)} domain={[0, "dataMax"]} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value), moneySymbol)} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Bookings List - Spans 3 columns with compressed padding */}
        <div className="bg-card rounded-2xl border border-border p-3 shadow-sm lg:col-span-3 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-sm mb-2 px-1">Recent Bookings</h2>
            <div className="space-y-1">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-2.5 py-1 border-b border-border last:border-0 last:pb-0">
                  <img
                    src={`https://i.pravatar.cc/64?img=${b.guest.length + 10}`}
                    className="size-8 rounded-full object-cover border border-muted"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate text-foreground">{b.guest}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {formatRecentBookingTime(b.date, b.time)}
                    </div>
                  </div>
                  <Badge variant={b.sv}>{b.status}</Badge>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <div className="py-6 text-center text-xs text-muted-foreground">No bookings found</div>
              )}
            </div>
          </div>
          <Link to="/bookings" className="block text-center text-xs text-primary font-medium hover:underline py-1.5 border-t border-border mt-2">
            View all bookings →
          </Link>
        </div>
      </div>

      {/* Lower Dashboard Panels Grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Booking by Studio Doughnut Chart */}
        <div className="bg-card rounded-2xl border border-border p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="font-semibold text-foreground mb-3">Booking by Studio</h2>
            {studioData.length > 0 ? (
              <div className="relative size-36 mx-auto mt-2 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={studioData} innerRadius={42} outerRadius={62} dataKey="count" startAngle={90} endAngle={-270} strokeWidth={3}>
                      {studioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-xl font-bold text-foreground">{bookings.length}</div>
                  <div className="text-[9px] text-muted-foreground uppercase font-medium">Bookings</div>
                </div>
              </div>
            ) : (
              <div className="size-36 mx-auto mt-2 rounded-full border border-dashed border-border flex items-center justify-center text-center text-xs text-muted-foreground px-4">
                No studio bookings yet
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 mt-4 text-xs text-muted-foreground">
            {studioData.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="font-bold text-foreground">{s.count} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings List aligned horizontally */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Upcoming Bookings</h2>
            <Link to="/calendar" className="text-xs text-primary font-medium hover:underline">View Calendar</Link>
          </div>
          <div className="space-y-2.5">
            {upcomingList.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 py-2 border-b border-border last:border-0 last:pb-0 items-center">
                {/* Left Block: Shorthand Date */}
                <div className="col-span-3 text-left">
                  <div className="text-xs font-bold text-foreground truncate" title={formatDate(item.date)}>{formatDate(item.date)}</div>
                </div>
                {/* Center Block: Title and timing */}
                <div className="col-span-5 text-left min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">{item.guest}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{formatTime(item.time).split(" - ")[0]} • {item.studio}</div>
                </div>
                {/* Right Block: Badge */}
                <div className="col-span-4 text-right">
                  <Badge variant={item.sv}>{item.status}</Badge>
                </div>
              </div>
            ))}
            {upcomingList.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No upcoming bookings</div>
            )}
          </div>
        </div>

        {/* Recent Episodes List */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Episodes</h2>
            <Link to="/episodes" className="text-xs text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {episodes.slice(0, 3).map((ep) => (
              <div key={ep.id} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0 last:pb-0">
                <img
                  src={`https://picsum.photos/seed/${ep.id}/64/64`}
                  className="size-9 rounded-lg object-cover border border-border"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs truncate text-foreground">{ep.title}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{ep.show} • Ep {ep.ep}</div>
                </div>
                <Badge variant={ep.sv}>{ep.status}</Badge>
              </div>
            ))}
            {episodes.slice(0, 3).length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No episodes found</div>
            )}
          </div>
        </div>

        {/* Quick Actions Matrix 2x3 layout with icons and no copy strings */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col justify-between">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 grid-rows-3 gap-2.5 flex-1">
            <button
              onClick={() => setFormOpen(true)}
              className="rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 hover:text-primary transition-all p-3 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="size-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">New Booking</span>
            </button>
            <button
              onClick={() => setGuestFormOpen(true)}
              className="rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 hover:text-primary transition-all p-3 flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="size-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">Add Guest</span>
            </button>
            <button
              onClick={() => setEpisodeFormOpen(true)}
              className="rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 hover:text-primary transition-all p-3 flex items-center gap-2 cursor-pointer"
            >
              <Mic2 className="size-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">Add Episode</span>
            </button>
            <Link
              to="/calendar"
              className="rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 hover:text-primary transition-all p-3 flex items-center gap-2 cursor-pointer"
            >
              <CalendarDays className="size-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">Calendar</span>
            </Link>
            <Link
              to="/reports"
              className="rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 hover:text-primary transition-all p-3 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="size-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">Reports</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 hover:text-primary transition-all p-3 flex items-center gap-2 cursor-pointer w-full text-left font-semibold"
                >
                  <BellRing className="size-4 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-foreground">Send Alert</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border border-border rounded-xl shadow-lg p-1 space-y-0.5 z-50">
                <DropdownMenuItem
                  onClick={() => {
                    const unpaid = invoices.filter(inv => inv.status === "Pending" || inv.status === "Overdue");
                    if (unpaid.length === 0) {
                      toast.info("All payments are fully paid. No alerts to send!");
                      return;
                    }
                    unpaid.forEach((inv) => {
                      addNotification(
                        `Payment reminder email sent to ${inv.name} (${inv.email}) for invoice ${inv.id}`, 
                        "Payments", 
                        "BellRing", 
                        "bg-warning/15 text-warning-foreground"
                      );
                    });
                    toast.success(`Dispatched payment alerts to ${unpaid.length} clients: ${unpaid.map(inv => inv.name).join(", ")}`);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <span className="size-2 rounded-full bg-destructive animate-pulse" />
                  <span>Unpaid Invoices Alert</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => {
                    const now = new Date();
                    // Upcoming bookings scheduled in future/today
                    const upcoming = bookings.filter(b => {
                      const bDate = new Date(b.date);
                      return (b.status === "Confirmed" || b.status === "Pending") && bDate >= now;
                    });
                    
                    if (upcoming.length === 0) {
                      toast.info("No upcoming bookings found to alert!");
                      return;
                    }
                    upcoming.forEach((b) => {
                      addNotification(
                        `Booking reminder email sent to ${b.guest} for session ${b.id} on ${formatDate(b.date)}`, 
                        "Bookings", 
                        "Calendar", 
                        "bg-primary/15 text-primary-foreground"
                      );
                    });
                    toast.success(`Sent booking reminders to ${upcoming.length} guests: ${upcoming.map(b => b.guest).join(", ")}`);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  <span>Upcoming Booking Alert</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    const pendingBookings = bookings.filter(b => b.status === "Pending");
                    if (pendingBookings.length === 0) {
                      toast.info("No pending booking approvals found!");
                      return;
                    }
                    addNotification(
                      `Review required: ${pendingBookings.length} booking request(s) are pending approval`,
                      "System",
                      "ShieldAlert",
                      "bg-warning/15 text-warning-foreground"
                    );
                    toast.success(`Notified admins to review ${pendingBookings.length} pending booking request(s).`);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <span className="size-2 rounded-full bg-warning animate-pulse" />
                  <span>Pending Approvals Alert</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    const drafts = episodes.filter(ep => ep.status === "Draft");
                    if (drafts.length === 0) {
                      toast.info("No episode drafts found!");
                      return;
                    }
                    drafts.forEach((ep) => {
                      addNotification(
                        `Episode Draft reminder: '${ep.title}' is ready for editing/publishing`,
                        "Episodes",
                        "Mic2",
                        "bg-info/15 text-info-foreground"
                      );
                    });
                    toast.success(`Notified editors about ${drafts.length} episode draft(s).`);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <span className="size-2 rounded-full bg-info animate-pulse" />
                  <span>Episode Drafts Alert</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <BookingFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <GuestFormDialog open={guestFormOpen} onOpenChange={setGuestFormOpen} />
      <EpisodeFormDialog open={episodeFormOpen} onOpenChange={setEpisodeFormOpen} />
    </DashboardLayout>
  );
}
