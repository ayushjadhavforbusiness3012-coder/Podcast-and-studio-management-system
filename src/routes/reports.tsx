import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout, StatCard } from "@/components/DashboardLayout";
import { useAppContext } from "@/contexts/AppContext";
import { currencySymbol, formatCurrency, totalRevenue as calculateTotalRevenue } from "@/lib/money";
import { CalendarDays, Download, Headphones, Clock, Wallet, Calendar, BarChart3, FileText, Mic2 } from "lucide-react";
import { useMemo, useState } from "react";
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

function parseRecordDate(dateStr: string) {
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function Donut() {
  const segs = [{c: "#22c55e", v: 0}, {c: "#3b82f6", v: 0}, {c: "#f97316", v: 0}, {c: "#ef4444", v: 0}, {c: "#a855f7", v: 0}];
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
  const { bookings, invoices, episodes, settings, formatDate } = useAppContext();
  const moneySymbol = currencySymbol(settings.payment.currency);
  const [bookingView, setBookingView] = useState("Weekly");
  const [downloadView, setDownloadView] = useState("Weekly");
  const [showView, setShowView] = useState("By Downloads");

  // Date Dialog State
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [appliedRange, setAppliedRange] = useState("Local database");

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

  const paidRevenue = calculateTotalRevenue(bookings, invoices);

  const bookingsDataWeekly = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 5 }, (_, index) => {
      const count = bookings.filter((booking) => {
        const date = parseRecordDate(booking.date);
        return date?.getFullYear() === now.getFullYear()
          && date.getMonth() === now.getMonth()
          && Math.floor((date.getDate() - 1) / 7) === index;
      }).length;
      return { name: `Week ${index + 1}`, bookings: count };
    });
  }, [bookings]);

  const bookingsDataMonthly = useMemo(() => {
    const year = new Date().getFullYear();
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => {
      const count = bookings.filter((booking) => {
        const date = parseRecordDate(booking.date);
        return date?.getFullYear() === year && date.getMonth() === index;
      }).length;
      return { name: `${month} ${year}`, bookings: count };
    });
  }, [bookings]);

  const downloadsDataWeekly = useMemo(
    () => Array.from({ length: 5 }, (_, index) => ({ name: `Week ${index + 1}`, downloads: 0 })),
    []
  );

  const downloadsDataMonthly = useMemo(
    () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => ({ name: month, downloads: 0 })),
    []
  );

  const showRows = useMemo(() => {
    const counts = episodes.reduce<Record<string, { show: string; episodes: number; studio: string }>>((acc, episode) => {
      const current = acc[episode.show] ?? { show: episode.show, episodes: 0, studio: "Local database" };
      current.episodes += 1;
      acc[episode.show] = current;
      return acc;
    }, {});
    return Object.values(counts).sort((a, b) => b.episodes - a.episodes);
  }, [episodes]);

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
        <StatCard icon={CalendarDays} label="Total Bookings" value={bookings.length.toString()} trend="All local records" tone="primary" />
        <StatCard icon={Download} label="Total Downloads" value="0" trend="Analytics not connected" tone="success" />
        <StatCard icon={Headphones} label="Unique Listeners" value="0" trend="Analytics not connected" tone="warning" />
        <StatCard icon={Clock} label="Watch Time (Hours)" value="0" trend="Analytics not connected" tone="info" />
        <StatCard icon={Wallet} label="Total Revenue" value={formatCurrency(paidRevenue, moneySymbol)} trend="Paid bookings and invoices" tone="pink" />
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
                  {showRows.map((s, i) => (
                    <tr key={s.show} className="border-t border-border">
                      <td className="py-3">{i + 1}</td>
                      <td>
                        <div className="font-medium text-foreground">{s.show}</div>
                        <div className="text-xs text-muted-foreground">{s.episodes} episode{s.episodes === 1 ? "" : "s"}</div>
                      </td>
                      <td>0</td>
                      <td>0</td>
                      <td className="text-muted-foreground">Unavailable</td>
                    </tr>
                  ))}
                  {showRows.length === 0 && (
                    <tr className="border-t border-border">
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">No shows yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Link
                to="/episodes"
                className="block w-full text-center text-primary text-sm font-medium mt-4 pt-3 border-t border-border hover:underline"
              >
                View All Shows
              </Link>
            </div>
          )}
          {visibleWidgets.episodes && (
            <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${visibleWidgets.shows ? "lg:col-span-4" : "lg:col-span-12"}`}>
              <h3 className="font-semibold text-foreground text-sm mb-4">Top Episodes</h3>
              <div className="space-y-4 text-sm">
                {episodes.slice(0, 5).map((episode, index) => (
                  <div key={episode.id} className="flex items-center gap-3">
                    <span className="text-muted-foreground w-4 font-semibold">{index + 1}</span>
                    <div className="size-9 rounded-lg bg-primary grid place-items-center text-white shrink-0">
                      <Mic2 className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{episode.title}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(episode.date)}</div>
                    </div>
                    <span className="font-semibold text-muted-foreground">0</span>
                  </div>
                ))}
                {episodes.length === 0 && (
                  <div className="py-8 text-center text-xs text-muted-foreground">No episodes yet</div>
                )}
              </div>
              <Link
                to="/episodes"
                className="block w-full text-center text-primary text-sm font-medium mt-4 pt-3 border-t border-border hover:underline"
              >
                View All Episodes →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Row 3: Demographics & Platform distribution */}
      {(visibleWidgets.demographics || visibleWidgets.platforms) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {visibleWidgets.demographics && (
            <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm h-full flex flex-col ${visibleWidgets.platforms ? "lg:col-span-7" : "lg:col-span-12"}`}>
              <h3 className="font-semibold text-foreground text-sm mb-4">Audience Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                {/* Gender Pie Chart */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-2 font-medium">Gender Split</div>
                  <div className="relative size-32">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center text-center">
                      <div className="text-xs font-bold text-foreground">No data</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs justify-center mt-3 font-semibold">
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-500" />Male 0%</span>
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-pink-500" />Female 0%</span>
                  </div>
                </div>
                {/* Age Range Bar */}
                <div className="md:col-span-7 space-y-2">
                  <div className="text-xs text-muted-foreground mb-2.5 font-medium">Age Distribution</div>
                  {[
                    { l: "18-24", v: 0 }, { l: "25-34", v: 0 }, { l: "35-44", v: 0 }, { l: "45-54", v: 0 }, { l: "55+", v: 0 },
                  ].map(a => (
                    <div key={a.l} className="flex items-center gap-2 text-xs">
                      <span className="w-12 text-muted-foreground font-medium">{a.l}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-0" />
                      </div>
                      <span className="w-8 text-right font-semibold text-foreground">{a.v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-border pt-4">
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground font-medium">Countries Reach</div>
                  <div className="text-2xl font-bold text-foreground mt-0.5">0</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Analytics not connected</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground font-medium">Cities Reach</div>
                  <div className="text-2xl font-bold text-foreground mt-0.5">0</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Analytics not connected</div>
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
                        <div className="font-bold text-base text-foreground">0</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-medium">Total</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-xs space-y-2 w-full">
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-success shrink-0" />Spotify</span><span className="font-semibold text-foreground">0% (0)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-info shrink-0" />Apple Podcasts</span><span className="font-semibold text-foreground">0% (0)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-warning shrink-0" />Google Podcasts</span><span className="font-semibold text-foreground">0% (0)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-destructive shrink-0" />YouTube</span><span className="font-semibold text-foreground">0% (0)</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-medium text-foreground"><span className="size-2 rounded-full bg-primary shrink-0" />Other</span><span className="font-semibold text-foreground">0% (0)</span></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-foreground text-sm mb-4">Listeners by Location</h3>
                <div className="space-y-3 text-sm max-h-40 overflow-y-auto pr-1">
                  {[
                    { c: "India", v: "0%" },
                    { c: "United States", v: "0%" },
                    { c: "United Kingdom", v: "0%" },
                    { c: "Canada", v: "0%" },
                    { c: "Australia", v: "0%" }
                  ].map(l => (
                    <div key={l.c} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-muted-foreground font-medium">{l.c}</span>
                      <span className="font-semibold text-foreground">{l.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-sm flex-wrap gap-2 mt-6">
        <div className="flex items-center gap-2 text-muted-foreground"><FileText className="size-4" /> Reports are updated every 30 minutes. All times are shown in your local timezone (IST).</div>
        <div className="text-muted-foreground">Data from local database</div>
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
                  + `Total Bookings,${bookings.length},0%\n`
                  + "Total Downloads,0,Unavailable\n"
                  + "Unique Listeners,0,Unavailable\n"
                  + "Watch Time (Hours),0,Unavailable\n"
                  + `Total Revenue,${paidRevenue},0%\n`;
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
