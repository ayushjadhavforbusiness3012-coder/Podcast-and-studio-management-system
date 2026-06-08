import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard } from "@/components/DashboardLayout";
import { CalendarDays, Download, Headphones, Clock, Wallet, Calendar, BarChart3, FileText, Mic2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Podcast Studio" }] }),
  component: Reports,
});

// Dynamic weekly and monthly reporting datasets
const bookingsDataWeekly = [
  { name: "Week 1", bookings: 250 },
  { name: "Week 2", bookings: 310 },
  { name: "Week 3", bookings: 290 },
  { name: "Week 4", bookings: 398 }
];

const bookingsDataMonthly = [
  { name: "Jan 2025", bookings: 980 },
  { name: "Feb 2025", bookings: 1050 },
  { name: "Mar 2025", bookings: 1100 },
  { name: "Apr 2025", bookings: 1180 },
  { name: "May 2025", bookings: 1248 }
];

const downloadsDataWeekly = [
  { name: "Week 1", downloads: 6200 },
  { name: "Week 2", downloads: 7100 },
  { name: "Week 3", downloads: 6900 },
  { name: "Week 4", downloads: 8252 }
];

const downloadsDataMonthly = [
  { name: "Jan 2025", downloads: 21000 },
  { name: "Feb 2025", downloads: 23500 },
  { name: "Mar 2025", downloads: 25000 },
  { name: "Apr 2025", downloads: 26800 },
  { name: "May 2025", downloads: 28452 }
];

const ageWidthClasses: Record<number, string> = {
  12: "w-[12%]",
  38: "w-[38%]",
  28: "w-[28%]",
  14: "w-[14%]",
  8: "w-[8%]"
};

function Donut() {
  const segs = [{c: "#22c55e", v: 42}, {c: "#3b82f6", v: 28}, {c: "#f97316", v: 12}, {c: "#ef4444", v: 10}, {c: "#a855f7", v: 8}];
  let off = 0; const r = 60, C = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 160 160" className="w-32 h-32 -rotate-90">
      <circle cx="80" cy="80" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
      {segs.map((s, i) => {
        const len = (s.v / 100) * C;
        const el = <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={s.c} strokeWidth="18" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />;
        off += len; return el;
      })}
    </svg>
  );
}

function Reports() {
  const [bookingView, setBookingView] = useState("Weekly");
  const [downloadView, setDownloadView] = useState("Weekly");
  const [showView, setShowView] = useState("By Downloads");

  // Date Dialog State
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-05-31");
  const [appliedRange, setAppliedRange] = useState("01 May 2025 - 31 May 2025");

  // Export Dialog State
  const [exportOpen, setExportOpen] = useState(false);

  // Custom Report Builder State
  const [customReportOpen, setCustomReportOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    bookings: true,
    downloads: true,
    episodes: true,
    shows: true,
    demographics: true,
    platforms: true,
  });

  return (
    <DashboardLayout
      title="Reports & Analytics"
      subtitle="Track performance and grow your podcast studio"
      actions={
        <>
          <button
            onClick={() => setDateRangeOpen(true)}
            className="h-10 px-4 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-2 hover:bg-muted cursor-pointer transition-colors"
          >
            <Calendar className="size-4" /> {appliedRange}
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="h-10 px-4 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-2 hover:bg-muted cursor-pointer transition-colors"
          >
            <Download className="size-4" /> Export Report
          </button>
          <button
            onClick={() => setCustomReportOpen(true)}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-sm transition-opacity"
          >
            <BarChart3 className="size-4" /> Custom Report
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={CalendarDays} label="Total Bookings" value="1,248" trend="↑ 18.6% vs last month" tone="primary" />
        <StatCard icon={Download} label="Total Downloads" value="28,452" trend="↑ 21.3% vs last month" tone="success" />
        <StatCard icon={Headphones} label="Unique Listeners" value="12,389" trend="↑ 15.7% vs last month" tone="warning" />
        <StatCard icon={Clock} label="Watch Time (Hours)" value="1,842" trend="↑ 22.1% vs last month" tone="info" />
        <StatCard icon={Wallet} label="Total Revenue" value="₹5,20,000" trend="↑ 24.4% vs last month" tone="pink" />
      </div>

      {/* Row 1: Charts */}
      {(visibleWidgets.bookings || visibleWidgets.downloads) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {visibleWidgets.bookings && (
            <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${visibleWidgets.downloads ? "lg:col-span-6" : "lg:col-span-12"}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-foreground text-sm">Bookings Overview</h3>
                <select
                  value={bookingView}
                  onChange={(e) => {
                    setBookingView(e.target.value);
                    toast.info(`Showing ${e.target.value.toLowerCase()} bookings data`);
                  }}
                  className="text-xs border border-border rounded-md px-2 py-1 bg-card cursor-pointer focus:outline-none"
                  title="Select Bookings Chart View"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingView === "Weekly" ? bookingsDataWeekly : bookingsDataMonthly} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {visibleWidgets.downloads && (
            <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${visibleWidgets.bookings ? "lg:col-span-6" : "lg:col-span-12"}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-foreground text-sm">Downloads Overview</h3>
                <select
                  value={downloadView}
                  onChange={(e) => {
                    setDownloadView(e.target.value);
                    toast.info(`Showing ${e.target.value.toLowerCase()} downloads data`);
                  }}
                  className="text-xs border border-border rounded-md px-2 py-1 bg-card cursor-pointer focus:outline-none"
                  title="Select Downloads Chart View"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={downloadView === "Weekly" ? downloadsDataWeekly : downloadsDataMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} tickLine={false} axisLine={true} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Row 2: Shows & Episodes Rank lists */}
      {(visibleWidgets.shows || visibleWidgets.episodes) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {visibleWidgets.shows && (
            <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${visibleWidgets.episodes ? "lg:col-span-8" : "lg:col-span-12"}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-foreground text-sm">Top Performing Shows</h3>
                <select
                  value={showView}
                  onChange={(e) => {
                    setShowView(e.target.value);
                    toast.info(`Sorting by ${e.target.value.replace("By ", "").toLowerCase()}`);
                  }}
                  className="text-xs border border-border rounded-md px-2 py-1 bg-card cursor-pointer focus:outline-none"
                  title="Sort Shows By"
                >
                  <option>By Downloads</option>
                  <option>By Listeners</option>
                  <option>By Growth</option>
                </select>
              </div>
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-left">
                  <tr>
                    <th className="pb-2">#</th>
                    <th className="pb-2">Show / Series</th>
                    <th className="pb-2">Downloads</th>
                    <th className="pb-2">Listeners</th>
                    <th className="pb-2">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: "The Startup Talk", s: "Premium Studio", d: 5632, l: 2450, g: "28.4%" },
                    { n: "Tech with Rahul", s: "Main Studio", d: 4812, l: 2189, g: "22.7%" },
                    { n: "Marketing Podcast", s: "Main Studio", d: 4156, l: 1876, g: "16.3%" },
                    { n: "Health & Wellness", s: "Main Studio", d: 3245, l: 1543, g: "18.9%" },
                    { n: "Entrepreneur Hour", s: "Premium Studio", d: 2945, l: 1342, g: "14.8%" },
                  ].map((s, i) => (
                    <tr key={s.n} className="border-t border-border">
                      <td className="py-3">{i + 1}</td>
                      <td>
                        <div className="font-medium text-foreground">{s.n}</div>
                        <div className="text-xs text-muted-foreground">{s.s}</div>
                      </td>
                      <td>{s.d.toLocaleString()}</td>
                      <td>{s.l.toLocaleString()}</td>
                      <td className="text-success">↑ {s.g}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => toast.info("Navigating to Shows")}
                className="w-full text-center text-primary text-sm font-medium mt-4 pt-3 border-t border-border hover:underline bg-transparent border-0 cursor-pointer"
              >
                View All Shows
              </button>
            </div>
          )}

          {visibleWidgets.episodes && (
            <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${visibleWidgets.shows ? "lg:col-span-4" : "lg:col-span-12"}`}>
              <h3 className="font-semibold text-foreground text-sm mb-4">Top Episodes</h3>
              <div className="space-y-4 text-sm">
                {[
                  { i: 1, name: "AI Revolution", date: "15 May 2025", val: 2845, color: "bg-primary" },
                  { i: 2, name: "Investment 101", date: "20 May 2025", val: 2512, color: "bg-info" },
                  { i: 3, name: "Mindset Matters", date: "22 May 2025", val: 2145, color: "bg-success" },
                  { i: 4, name: "Digital Creators", date: "05 May 2025", val: 1987, color: "bg-warning" },
                  { i: 5, name: "Business Talk", date: "13 May 2025", val: 1765, color: "bg-pink" },
                ].map((e) => (
                  <div key={e.i} className="flex items-center gap-3">
                    <span className="text-muted-foreground w-4 font-semibold">{e.i}</span>
                    <div className={`size-9 rounded-lg ${e.color} grid place-items-center text-white shrink-0`}>
                      <Mic2 className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.date}</div>
                    </div>
                    <span className="font-semibold text-foreground">{e.val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toast.info("Navigating to Episodes")}
                className="w-full text-center text-primary text-sm font-medium mt-4 pt-3 border-t border-border hover:underline bg-transparent border-0 cursor-pointer"
              >
                View All Episodes →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Row 3: Demographics & Platform distribution */}
      {(visibleWidgets.demographics || visibleWidgets.platforms) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {visibleWidgets.demographics && (
            <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${visibleWidgets.platforms ? "lg:col-span-7" : "lg:col-span-12"}`}>
              <h3 className="font-semibold text-foreground text-sm mb-4">Audience Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Gender Pie Chart */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-2 font-medium">Gender Split</div>
                  <div className="relative size-32">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={`${2 * Math.PI * 45 * 0.58} ${2 * Math.PI * 45}`} />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray={`${2 * Math.PI * 45 * 0.42} ${2 * Math.PI * 45}`} strokeDashoffset={-2 * Math.PI * 45 * 0.58} />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center text-center">
                      <div className="text-xs font-bold text-foreground">Gender</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs justify-center mt-3 font-semibold">
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-500" />Male 58%</span>
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-pink-500" />Female 42%</span>
                  </div>
                </div>
                {/* Age Range Bar */}
                <div className="md:col-span-7 space-y-2">
                  <div className="text-xs text-muted-foreground mb-2.5 font-medium">Age Distribution</div>
                  {[
                    { l: "18-24", v: 12 }, { l: "25-34", v: 38 }, { l: "35-44", v: 28 }, { l: "45-54", v: 14 }, { l: "55+", v: 8 },
                  ].map(a => (
                    <div key={a.l} className="flex items-center gap-2 text-xs">
                      <span className="w-12 text-muted-foreground font-medium">{a.l}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full bg-primary ${ageWidthClasses[a.v] || "w-0"}`} />
                      </div>
                      <span className="w-8 text-right font-semibold text-foreground">{a.v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-border pt-4">
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground font-medium">Countries Reach</div>
                  <div className="text-2xl font-bold text-foreground mt-0.5">42</div>
                  <div className="text-xs text-success font-medium mt-0.5">↑ 8 vs last month</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground font-medium">Cities Reach</div>
                  <div className="text-2xl font-bold text-foreground mt-0.5">128</div>
                  <div className="text-xs text-success font-medium mt-0.5">↑ 15 vs last month</div>
                </div>
              </div>
            </div>
          )}

          {visibleWidgets.platforms && (
            <div className={`space-y-6 ${visibleWidgets.demographics ? "lg:col-span-5" : "lg:col-span-12"}`}>
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-foreground text-sm mb-4">Downloads by Platform</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative shrink-0">
                    <Donut />
                    <div className="absolute inset-0 grid place-items-center text-center">
                      <div>
                        <div className="font-bold text-base text-foreground">28,452</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-medium">Total</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-xs space-y-2 w-full">
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-success shrink-0" />Spotify</span><span className="font-semibold text-foreground">42% (11,938)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-info shrink-0" />Apple Podcasts</span><span className="font-semibold text-foreground">28% (7,970)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-warning shrink-0" />Google Podcasts</span><span className="font-semibold text-foreground">12% (3,417)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-destructive shrink-0" />YouTube</span><span className="font-semibold text-foreground">10% (2,845)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-primary shrink-0" />Other</span><span className="font-semibold text-foreground">8% (2,282)</span></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-foreground text-sm mb-4">Listeners by Location</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { c: "India", v: "45.2%" },
                    { c: "United States", v: "18.7%" },
                    { c: "United Kingdom", v: "8.3%" },
                    { c: "Canada", v: "5.6%" },
                    { c: "Australia", v: "4.2%" }
                  ].map(l => (
                    <div key={l.c} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-muted-foreground font-medium">{l.c}</span>
                      <span className="font-semibold text-foreground">{l.v}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toast.info("Full analytics view coming soon")}
                  className="w-full text-center text-primary text-sm font-medium mt-4 pt-1 hover:underline bg-transparent border-0 cursor-pointer"
                >
                  View Full Analytics →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-sm flex-wrap gap-2 mt-6">
        <div className="flex items-center gap-2 text-muted-foreground"><FileText className="size-4" /> Reports are updated every 30 minutes. All times are shown in your local timezone (IST).</div>
        <div className="text-muted-foreground">Data as of 31 May 2025, 11:59 PM</div>
      </div>

      {/* Date Range Dialog */}
      <Dialog open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
            <DialogDescription>Choose custom start and end dates to filter your analytics.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="start-date">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="end-date">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent cursor-pointer"
              onClick={() => setDateRangeOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer"
              onClick={() => {
                const format = (dateStr: string) => {
                  const d = new Date(dateStr);
                  if (isNaN(d.getTime())) return dateStr;
                  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                };
                setAppliedRange(`${format(startDate)} - ${format(endDate)}`);
                setDateRangeOpen(false);
                toast.success(`Date filter applied`);
              }}
            >
              Apply Filter
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Report Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>Select your preferred format for the exported analytics report.</DialogDescription>
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
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "Metric,Value,Growth\n"
                  + "Total Bookings,1248,18.6%\n"
                  + "Total Downloads,28452,21.3%\n"
                  + "Unique Listeners,12389,15.7%\n"
                  + "Watch Time (Hours),1842,22.1%\n"
                  + "Total Revenue,520000,24.4%\n";
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `podcast_studio_report_${startDate}_to_${endDate}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("CSV report downloaded successfully!");
              }}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 cursor-pointer transition-all bg-transparent"
            >
              <Download className="size-8 text-success mb-2" />
              <span className="font-semibold text-sm">Spreadsheet (CSV)</span>
              <span className="text-[10px] text-muted-foreground mt-1 text-center">Export raw metrics for Excel / Google Sheets</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Report Builder Dialog */}
      <Dialog open={customReportOpen} onOpenChange={setCustomReportOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Configure Custom Report</DialogTitle>
            <DialogDescription>Toggle the sections below to customize your reports dashboard layout.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {Object.entries({
              bookings: "Bookings Overview Chart",
              downloads: "Downloads Overview Chart",
              episodes: "Top Episodes List",
              shows: "Top Performing Shows Table",
              demographics: "Audience Demographics Breakdown",
              platforms: "Downloads by Platform & Locations",
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <label htmlFor={`widget-visible-${key}`} className="text-sm font-medium text-foreground cursor-pointer select-none">{label}</label>
                <input
                  id={`widget-visible-${key}`}
                  type="checkbox"
                  checked={visibleWidgets[key as keyof typeof visibleWidgets]}
                  onChange={(e) => {
                    setVisibleWidgets((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }));
                  }}
                  className="size-4 rounded accent-primary cursor-pointer"
                  title={`Toggle visibility of ${label}`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <button
              type="button"
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent cursor-pointer"
              onClick={() => setCustomReportOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer"
              onClick={() => {
                setCustomReportOpen(false);
                toast.success("Custom report configuration applied!");
              }}
            >
              Apply Layout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
