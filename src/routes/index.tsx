import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { useAppContext } from "@/contexts/AppContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { GuestFormDialog } from "@/components/GuestFormDialog";
import { EpisodeFormDialog } from "@/components/EpisodeFormDialog";
import { useState, useMemo } from "react";
import {
  CalendarDays,
  Wallet,
  Users,
  CalendarCheck,
  Plus,
  Crown,
  Mic2,
  Clock,
  Video,
  FileText,
  BellRing,
  UserPlus,
  BarChart3
} from "lucide-react";
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

const studioData = [
  { name: "Studio A", value: 45, color: "#8b5cf6" }, // purple
  { name: "Studio B", value: 30, color: "#3b82f6" }, // blue
  { name: "Studio C", value: 25, color: "#10b981" }, // green
];

// Helper to format recent booking dates stripping the year value
const formatRecentBookingTime = (dateStr: string, timeStr: string) => {
  const datePart = dateStr.replace(/\s*\d{4}/, "").trim(); // "25 May 2025" -> "25 May"
  const timePart = timeStr.split(" - ")[0];
  return `${datePart}, ${timePart}`;
};

function Dashboard() {
  const { bookings, guests, episodes } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [guestFormOpen, setGuestFormOpen] = useState(false);
  const [episodeFormOpen, setEpisodeFormOpen] = useState(false);

  // Selector state for Booking Overview
  const [selectedMonth, setSelectedMonth] = useState("May 2026");

  // Selector state for Revenue Overview
  const [selectedYear, setSelectedYear] = useState(2026);

  // Dynamic calculations based on state
  const totalBookings = 1248 + bookings.length;
  const totalGuests = 142 + guests.length;
  const totalRevenue = "₹5,20,000";
  const upcomingBookingsCount = bookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
  const episodesPublishedCount = 38 + episodes.filter(e => e.status === "Published").length;

  const recentBookings = bookings.slice(0, 5);
  const upcomingList = useMemo(() => {
    return bookings
      .filter(b => b.status === "Confirmed" || b.status === "Pending")
      .slice(0, 3)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [bookings]);

  // Booking Overview Data logic (skip 30th on 31-day months)
  const bookingOverviewData = useMemo(() => {
    const is31DayMonth = selectedMonth.includes("May") || selectedMonth.includes("July");
    const days = [1, 5, 10, 15, 20, 25];
    if (is31DayMonth) {
      days.push(31); // transitions directly from 25 to 31
    } else {
      days.push(30);
    }
    const mockBookings: Record<number, number> = {
      1: 12, 5: 18, 10: 15, 15: 25, 20: 22, 25: 30, 30: 28, 31: 29
    };
    return days.map(d => ({
      name: `${selectedMonth.split(" ")[0].substring(0, 3)} ${d}`,
      bookings: mockBookings[d] || 20
    }));
  }, [selectedMonth]);

  // Revenue Overview Data logic
  const revenueOverviewData = useMemo(() => {
    const systemYear = 2026;
    const systemMonth = 5; // June is index 5
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const baseRevenue = [45000, 52000, 49000, 63000, 85000, 78000, 90000, 85000, 95000, 100000, 110000, 120000];

    return months.map((m, idx) => {
      let revenue = baseRevenue[idx];
      // Future-Date logic: zero out for months beyond June 2026
      if (selectedYear > systemYear) {
        revenue = 0;
      } else if (selectedYear === systemYear && idx > systemMonth) {
        revenue = 0;
      }
      return { name: m, revenue };
    });
  }, [selectedYear]);

  const totalEarnedThisYear = useMemo(() => {
    return revenueOverviewData.reduce((sum, item) => sum + item.revenue, 0);
  }, [revenueOverviewData]);

  // Handle "This Year" drop-down selection (prevent loading years prior to genesis 2025)
  const genesisYear = 2025;
  const targetYears = [2025, 2026, 2027, 2028].filter(y => y >= genesisYear);

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
        <StatCard icon={CalendarDays} label="Total Bookings" value={totalBookings.toLocaleString()} trend="↑ 18.6% vs last month" tone="primary" />
        <StatCard icon={Users} label="Total Guests" value={totalGuests.toLocaleString()} trend="↑ 12.4% vs last month" tone="info" />
        <StatCard icon={Wallet} label="Total Revenue" value={totalRevenue} trend="↑ 24.4% vs last month" tone="success" />
        <StatCard icon={CalendarCheck} label="Upcoming Bookings" value={upcomingBookingsCount.toString()} trend="Active schedule" tone="pink" />
        <StatCard icon={Mic2} label="Episodes Published" value={episodesPublishedCount.toString()} trend="↑ 8.2% vs last month" tone="warning" />
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
            >
              <option value="May 2026">May 2026</option>
              <option value="June 2026">June 2026</option>
              <option value="July 2026">July 2026</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
            <div className="md:col-span-2 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingOverviewData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} ticks={[0, 10, 20, 30, 40]} domain={[0, 40]} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="linear" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Status Count Summary lane */}
            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-3 space-y-2">
              <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Status Summary</h4>
             <div className="flex justify-between items-center text-xs w-full min-w-0 gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 bg-muted"><span className="size-2 rounded-full bg-success" />Confirmed</span>
                <span className="font-semibold text-foreground">{bookings.filter(b => b.status === "Confirmed").length + 25}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" /> Pending</span>
                <span className="font-semibold text-foreground">{bookings.filter(b => b.status === "Pending").length + 8}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Completed</span>
                <span className="font-semibold text-foreground">{bookings.filter(b => b.status === "Completed").length + 15}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> Cancelled</span>
                <span className="font-semibold text-foreground">{bookings.filter(b => b.status === "Cancelled").length + 3}</span>
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
            >
              {targetYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {/* Dynamic Annual Total Metric Banner */}
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold mb-2">
            Total Earned This Year: ₹{totalEarnedThisYear.toLocaleString("en-IN")}
          </div>
          <div className="w-full h-36 overflow-x-auto">
            <div className="min-w-[450px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueOverviewData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} formatter={(v) => `₹${Number(v) / 1000}k`} ticks={[0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000]} domain={[0, 120000]} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
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
            <div className="relative size-36 mx-auto mt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={studioData} innerRadius={42} outerRadius={62} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={3}>
                    {studioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <div className="text-xl font-bold text-foreground">100</div>
                <div className="text-[9px] text-muted-foreground uppercase font-medium">Bookings</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-4 text-xs text-muted-foreground">
            {studioData.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="font-bold text-foreground">{s.value}%</span>
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
                  <div className="text-sm font-bold text-foreground">{item.date.split(" ")[0]}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">{item.date.split(" ")[1]?.substring(0, 3)}</div>
                </div>
                {/* Center Block: Title and timing */}
                <div className="col-span-6 text-left min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">{item.guest}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{item.time.split(" - ")[0]} • {item.studio}</div>
                </div>
                {/* Right Block: Badge */}
                <div className="col-span-3 text-right">
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
            <button
              onClick={() => {
                toast.success("Notification dispatch scheduled");
              }}
              className="rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 hover:text-primary transition-all p-3 flex items-center gap-2 cursor-pointer"
            >
              <BellRing className="size-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">Send Alert</span>
            </button>
          </div>
        </div>
      </div>

      <BookingFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <GuestFormDialog open={guestFormOpen} onOpenChange={setGuestFormOpen} />
      <EpisodeFormDialog open={episodeFormOpen} onOpenChange={setEpisodeFormOpen} />
    </DashboardLayout>
  );
}
