import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { useAppContext } from "@/contexts/AppContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { useState } from "react";
import {
  CalendarDays,
  Wallet,
  Package,
  Users,
  CalendarCheck,
  Plus,
  Search,
  MoreVertical,
  Crown,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Podcast Studio" },
      { name: "description", content: "Overview of your podcast studio: bookings, revenue, and upcoming schedule." },
    ],
  }),
  component: Dashboard,
});

// Static data removed to use context state

const topShows = [
  { name: "Tech Talk with Rahul", downloads: 5632, growth: "28.4%" },
  { name: "Mindset Matters", downloads: 4812, growth: "22.7%" },
  { name: "Creators Hub", downloads: 4156, growth: "16.3%" },
  { name: "Business Talk", downloads: 3245, growth: "18.9%" },
  { name: "Health Hour", downloads: 2945, growth: "14.8%" },
];

const schedule = [
  { time: "10:00 AM", name: "Tech Talk with Rahul", studio: "Studio A", color: "bg-success" },
  { time: "01:00 PM", name: "Mindset Matters", studio: "Studio B", color: "bg-success" },
  { time: "03:00 PM", name: "Marketing Podcast", studio: "Studio C", color: "bg-warning" },
];

function Sparkline({ color = "stroke-primary", fill = "fill-primary/10" }: { color?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-14">
      <path
        d="M0,40 L20,35 L40,42 L60,28 L80,32 L100,20 L120,25 L140,15 L160,22 L180,10 L200,15 L200,60 L0,60 Z"
        className={fill}
      />
      <path
        d="M0,40 L20,35 L40,42 L60,28 L80,32 L100,20 L120,25 L140,15 L160,22 L180,10 L200,15"
        className={`${color} fill-none`}
        strokeWidth="2"
      />
    </svg>
  );
}

function Dashboard() {
  const { bookings, searchQuery, setSearchQuery } = useAppContext();
  const recentBookings = bookings.slice(0, 5);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back, Admin! Here's what's happening with your studio."
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search anything..."
              className="h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setFormOpen(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90">
            <Plus className="size-4" /> New Booking
          </button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-xl bg-accent text-primary grid place-items-center">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
              <div className="text-2xl font-bold">1,248</div>
              <div className="text-xs text-success mt-0.5">↑ 18.6% vs last month</div>
            </div>
          </div>
          <Sparkline />
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-xl bg-success/15 text-success grid place-items-center">
              <Wallet className="size-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-2xl font-bold">₹5,20,000</div>
              <div className="text-xs text-success mt-0.5">↑ 24.4% vs last month</div>
            </div>
          </div>
          <Sparkline color="stroke-success" fill="fill-success/10" />
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-xl bg-info/15 text-info grid place-items-center">
              <Package className="size-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Active Packages</div>
              <div className="text-2xl font-bold">6</div>
              <div className="text-xs text-success mt-0.5">↑ 12.5% vs last month</div>
            </div>
          </div>
          <Sparkline color="stroke-info" fill="fill-info/10" />
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-xl bg-warning/20 text-warning-foreground grid place-items-center">
              <Users className="size-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-2xl font-bold">18</div>
              <div className="text-xs text-success mt-0.5">↑ 12.0% vs last month</div>
            </div>
          </div>
          <Sparkline color="stroke-warning" fill="fill-warning/15" />
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-xl bg-pink/20 text-pink-foreground grid place-items-center">
              <CalendarCheck className="size-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Upcoming Bookings</div>
              <div className="text-2xl font-bold">7</div>
              <div className="text-xs text-primary mt-0.5">View calendar</div>
            </div>
          </div>
          <Sparkline color="stroke-pink" fill="fill-pink/15" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Bookings</h2>
            <Link to="/bookings" className="text-sm text-primary font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-3 py-2">
                <div className="size-10 rounded-lg bg-accent grid place-items-center text-primary text-[10px] font-bold">
                  {b.guest.split(" ")[0].slice(0, 4).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{b.guest}</div>
                  <div className="text-xs text-muted-foreground">{b.studio}</div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs">{b.date}</div>
                  <div className="text-xs text-muted-foreground">{b.time}</div>
                </div>
                <Badge variant={b.sv}>{b.status}</Badge>
                <Link to="/bookings" className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="size-4" />
                </Link>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">No bookings found</div>
            )}
          </div>
        </div>

        {/* Booking Overview chart */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Booking Overview</h2>
            <select className="text-xs border border-border rounded-md px-2 py-1 bg-card">
              <option>This Month</option>
            </select>
          </div>
          <Sparkline />
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><span className="size-2 rounded-full bg-primary" />Total</div>
              <div className="font-bold">1,248</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><span className="size-2 rounded-full bg-success" />Done</div>
              <div className="font-bold">1,056</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><span className="size-2 rounded-full bg-destructive" />Cancel</div>
              <div className="font-bold">96</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><span className="size-2 rounded-full bg-warning" />Pending</div>
              <div className="font-bold">96</div>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming Schedule</h2>
            <Link to="/calendar" className="text-sm text-primary font-medium">View Calendar</Link>
          </div>
          <div className="text-3xl font-bold">25</div>
          <div className="text-xs text-muted-foreground mb-4">May 2025</div>
          <div className="space-y-3">
            {schedule.map((s) => (
              <div key={s.time} className="flex items-center gap-3 py-2 border-t border-border first:border-0 pt-3">
                <div className="text-xs text-muted-foreground w-16">{s.time}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.studio}</div>
                </div>
                <span className={`size-2 rounded-full ${s.color}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Top Performing Shows</h2>
            <select className="text-xs border border-border rounded-md px-2 py-1 bg-card"><option>By Downloads</option></select>
          </div>
          <div className="space-y-2">
            {topShows.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3 py-2 border-t border-border first:border-0 pt-3">
                <div className="text-sm text-muted-foreground w-5">{i + 1}</div>
                <div className="size-9 rounded-lg bg-accent grid place-items-center text-primary text-[10px] font-bold">
                  {s.name.split(" ")[0].slice(0, 4).toUpperCase()}
                </div>
                <div className="flex-1 font-medium text-sm">{s.name}</div>
                <div className="text-sm">{s.downloads.toLocaleString()}</div>
                <div className="text-success text-sm">↑ {s.growth}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-6 flex flex-col">
          <div className="size-11 rounded-xl bg-white/15 grid place-items-center mb-4">
            <Crown className="size-5" />
          </div>
          <h3 className="text-lg font-semibold">Upgrade Your Studio</h3>
          <p className="text-sm opacity-90 mt-1">Unlock advanced features and grow your podcast faster.</p>
          <Link to="/packages" className="mt-auto bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 mt-6">
            Explore Plans <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <BookingFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </DashboardLayout>
  );
}
