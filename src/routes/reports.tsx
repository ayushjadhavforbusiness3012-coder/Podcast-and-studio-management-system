import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard } from "@/components/DashboardLayout";
import { CalendarDays, Download, Headphones, Clock, Wallet, Calendar, BarChart3, FileText, Mic2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Podcast Studio" }] }),
  component: Reports,
});

function LineArea({ color = "stroke-primary", fill = "fill-primary/15" }: { color?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 400 160" className="w-full h-44">
      <path d="M0,120 L40,110 L80,90 L120,100 L160,70 L200,80 L240,60 L280,75 L320,50 L360,40 L400,20 L400,160 L0,160 Z" className={fill} />
      <path d="M0,120 L40,110 L80,90 L120,100 L160,70 L200,80 L240,60 L280,75 L320,50 L360,40 L400,20" className={`${color} fill-none`} strokeWidth="2" />
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => <circle key={i} cx={i*40} cy={[120,110,90,100,70,80,60,75,50,40,20][i]} r="3" className={color} fill="white" strokeWidth="2" />)}
    </svg>
  );
}

function Donut() {
  const segs = [{c: "#22c55e", v: 42}, {c: "#3b82f6", v: 28}, {c: "#f97316", v: 12}, {c: "#ef4444", v: 10}, {c: "#a855f7", v: 8}];
  let off = 0; const r = 60, C = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40 -rotate-90">
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
  const [bookingView, setBookingView] = useState("Daily");
  const [downloadView, setDownloadView] = useState("Daily");
  const [showView, setShowView] = useState("By Downloads");

  return (
    <DashboardLayout
      title="Reports & Analytics"
      subtitle="Track performance and grow your podcast studio"
      actions={
        <>
          <button onClick={() => toast.info("Date range picker coming soon")} className="h-10 px-4 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-2 hover:bg-muted"><Calendar className="size-4" /> 01 May 2025 - 31 May 2025</button>
          <button onClick={() => toast.success("Report exported as PDF")} className="h-10 px-4 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-2 hover:bg-muted"><Download className="size-4" /> Export Report</button>
          <button onClick={() => toast.info("Custom report builder coming soon")} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-2 hover:opacity-90"><BarChart3 className="size-4" /> Custom Report</button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={CalendarDays} label="Total Bookings" value="1,248" trend="↑ 18.6% vs Apr 2025" tone="primary" />
        <StatCard icon={Download} label="Total Downloads" value="28,452" trend="↑ 21.3% vs Apr 2025" tone="success" />
        <StatCard icon={Headphones} label="Unique Listeners" value="12,389" trend="↑ 15.7% vs Apr 2025" tone="warning" />
        <StatCard icon={Clock} label="Watch Time (Hours)" value="1,842" trend="↑ 22.1% vs Apr 2025" tone="info" />
        <StatCard icon={Wallet} label="Total Revenue" value="₹5,20,000" trend="↑ 24.4% vs Apr 2025" tone="pink" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_320px] gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between mb-2"><h3 className="font-semibold">Bookings Overview</h3><select value={bookingView} onChange={(e) => { setBookingView(e.target.value); toast.info(`Showing ${e.target.value} data`); }} className="text-xs border border-border rounded-md px-2 py-1 bg-card"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
          <LineArea />
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between mb-2"><h3 className="font-semibold">Downloads Overview</h3><select value={downloadView} onChange={(e) => { setDownloadView(e.target.value); toast.info(`Showing ${e.target.value} data`); }} className="text-xs border border-border rounded-md px-2 py-1 bg-card"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
          <LineArea color="stroke-success" fill="fill-success/15" />
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Top Episodes</h3>
          <div className="space-y-3 text-sm">
            {[
              { i: 1, name: "AI Revolution", date: "15 May 2025", val: 2845, color: "bg-primary" },
              { i: 2, name: "Investment 101", date: "20 May 2025", val: 2512, color: "bg-info" },
              { i: 3, name: "Mindset Matters", date: "22 May 2025", val: 2145, color: "bg-success" },
              { i: 4, name: "Digital Creators", date: "05 May 2025", val: 1987, color: "bg-warning" },
              { i: 5, name: "Business Talk", date: "13 May 2025", val: 1765, color: "bg-pink" },
            ].map((e) => (
              <div key={e.i} className="flex items-center gap-3">
                <span className="text-muted-foreground w-4">{e.i}</span>
                <div className={`size-9 rounded-lg ${e.color} grid place-items-center text-white`}><Mic2 className="size-4" /></div>
                <div className="flex-1"><div className="font-medium">{e.name}</div><div className="text-xs text-muted-foreground">{e.date}</div></div>
                <span className="font-semibold">{e.val.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <a onClick={() => toast.info("Navigating to Episodes")} className="block text-center text-primary text-sm font-medium mt-4 cursor-pointer hover:underline">View All Episodes →</a>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_320px] gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between mb-3"><h3 className="font-semibold">Top Performing Shows</h3><select value={showView} onChange={(e) => { setShowView(e.target.value); toast.info(`Sorting ${e.target.value.toLowerCase()}`); }} className="text-xs border border-border rounded-md px-2 py-1 bg-card"><option>By Downloads</option><option>By Listeners</option><option>By Growth</option></select></div>
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-left"><tr><th className="pb-2">#</th><th className="pb-2">Show / Series</th><th className="pb-2">Downloads</th><th className="pb-2">Listeners</th><th className="pb-2">Growth</th></tr></thead>
            <tbody>
              {[
                { n: "The Startup Talk", s: "Premium Studio", d: 5632, l: 2450, g: "28.4%" },
                { n: "Tech with Rahul", s: "Main Studio", d: 4812, l: 2189, g: "22.7%" },
                { n: "Marketing Podcast", s: "Main Studio", d: 4156, l: 1876, g: "16.3%" },
                { n: "Health & Wellness", s: "Main Studio", d: 3245, l: 1543, g: "18.9%" },
                { n: "Entrepreneur Hour", s: "Premium Studio", d: 2945, l: 1342, g: "14.8%" },
              ].map((s, i) => (
                <tr key={s.n} className="border-t border-border">
                  <td className="py-3">{i+1}</td>
                  <td><div className="font-medium">{s.n}</div><div className="text-xs text-muted-foreground">{s.s}</div></td>
                  <td>{s.d.toLocaleString()}</td>
                  <td>{s.l.toLocaleString()}</td>
                  <td className="text-success">↑ {s.g}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a onClick={() => toast.info("Navigating to Shows")} className="block text-center text-primary text-sm font-medium mt-4 pt-3 border-t border-border cursor-pointer hover:underline">View All Shows</a>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Audience Demographics</h3>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Gender</div>
              <div className="relative">
                <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#3b82f6" strokeWidth="14" strokeDasharray={`${2*Math.PI*45*0.58} ${2*Math.PI*45}`} />
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#ec4899" strokeWidth="14" strokeDasharray={`${2*Math.PI*45*0.42} ${2*Math.PI*45}`} strokeDashoffset={-2*Math.PI*45*0.58} />
                </svg>
              </div>
              <div className="flex gap-3 text-xs justify-center mt-2"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-info" />Male 58%</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-pink" />Female 42%</span></div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-2">Age Range</div>
              {[
                { l: "18-24", v: 12 }, { l: "25-34", v: 38 }, { l: "35-44", v: 28 }, { l: "45-54", v: 14 }, { l: "55+", v: 8 },
              ].map(a => (
                <div key={a.l} className="flex items-center gap-2 mb-1.5 text-xs">
                  <span className="w-12">{a.l}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${a.v*2}%` }} /></div>
                  <span className="w-8 text-right">{a.v}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-muted/50 rounded-xl p-3"><div className="text-xs text-muted-foreground">Countries</div><div className="text-xl font-bold">42</div><div className="text-xs text-success">↑ 8 vs Apr 2025</div></div>
            <div className="bg-muted/50 rounded-xl p-3"><div className="text-xs text-muted-foreground">Cities</div><div className="text-xl font-bold">128</div><div className="text-xs text-success">↑ 15 vs Apr 2025</div></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Downloads by Platform</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Donut />
                <div className="absolute inset-0 grid place-items-center text-center"><div><div className="font-bold">28,452</div><div className="text-[10px] text-muted-foreground">Total</div></div></div>
              </div>
              <div className="flex-1 text-xs space-y-1.5">
                <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Spotify</span><span>42% (11,938)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-info" />Apple Podcasts</span><span>28% (7,970)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" />Google Podcasts</span><span>12% (3,417)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" />YouTube</span><span>10% (2,845)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Other</span><span>8% (2,282)</span></div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Listeners by Location</h3>
            <div className="space-y-2 text-sm">
              {[{c:"India",v:"45.2%"},{c:"United States",v:"18.7%"},{c:"United Kingdom",v:"8.3%"},{c:"Canada",v:"5.6%"},{c:"Australia",v:"4.2%"}].map(l => (
                <div key={l.c} className="flex justify-between"><span>{l.c}</span><span className="font-medium">{l.v}</span></div>
              ))}
            </div>
            <a onClick={() => toast.info("Full analytics view coming soon")} className="block text-center text-primary text-sm font-medium mt-3 cursor-pointer hover:underline">View Full Analytics →</a>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-sm flex-wrap gap-2">
        <div className="flex items-center gap-2 text-muted-foreground"><FileText className="size-4" /> Reports are updated every 30 minutes. All times are shown in your local timezone (IST).</div>
        <div className="text-muted-foreground">Data as of 31 May 2025, 11:59 PM</div>
      </div>
    </DashboardLayout>
  );
}
