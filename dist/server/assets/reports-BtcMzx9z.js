import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout, S as StatCard } from "./DashboardLayout-DBeZ8czl.js";
import { CalendarDays, Download, Headphones, Clock, Wallet, Mic2, FileText, Calendar, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import "@tanstack/react-router";
import "./router-Dz_arPe5.js";
import "@tanstack/react-query";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
function LineArea({
  color = "stroke-primary",
  fill = "fill-primary/15"
}) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 400 160", className: "w-full h-44", children: [
    /* @__PURE__ */ jsx("path", { d: "M0,120 L40,110 L80,90 L120,100 L160,70 L200,80 L240,60 L280,75 L320,50 L360,40 L400,20 L400,160 L0,160 Z", className: fill }),
    /* @__PURE__ */ jsx("path", { d: "M0,120 L40,110 L80,90 L120,100 L160,70 L200,80 L240,60 L280,75 L320,50 L360,40 L400,20", className: `${color} fill-none`, strokeWidth: "2" }),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => /* @__PURE__ */ jsx("circle", { cx: i * 40, cy: [120, 110, 90, 100, 70, 80, 60, 75, 50, 40, 20][i], r: "3", className: color, fill: "white", strokeWidth: "2" }, i))
  ] });
}
function Donut() {
  const segs = [{
    c: "#22c55e",
    v: 42
  }, {
    c: "#3b82f6",
    v: 28
  }, {
    c: "#f97316",
    v: 12
  }, {
    c: "#ef4444",
    v: 10
  }, {
    c: "#a855f7",
    v: 8
  }];
  let off = 0;
  const r = 60, C = 2 * Math.PI * r;
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 160 160", className: "w-40 h-40 -rotate-90", children: [
    /* @__PURE__ */ jsx("circle", { cx: "80", cy: "80", r, fill: "none", stroke: "#f1f5f9", strokeWidth: "18" }),
    segs.map((s, i) => {
      const len = s.v / 100 * C;
      const el = /* @__PURE__ */ jsx("circle", { cx: "80", cy: "80", r, fill: "none", stroke: s.c, strokeWidth: "18", strokeDasharray: `${len} ${C - len}`, strokeDashoffset: -off }, i);
      off += len;
      return el;
    })
  ] });
}
function Reports() {
  const [bookingView, setBookingView] = useState("Daily");
  const [downloadView, setDownloadView] = useState("Daily");
  const [showView, setShowView] = useState("By Downloads");
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Reports & Analytics", subtitle: "Track performance and grow your podcast studio", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("button", { onClick: () => toast.info("Date range picker coming soon"), className: "h-10 px-4 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-2 hover:bg-muted", children: [
      /* @__PURE__ */ jsx(Calendar, { className: "size-4" }),
      " 01 May 2025 - 31 May 2025"
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: () => toast.success("Report exported as PDF"), className: "h-10 px-4 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-2 hover:bg-muted", children: [
      /* @__PURE__ */ jsx(Download, { className: "size-4" }),
      " Export Report"
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: () => toast.info("Custom report builder coming soon"), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-2 hover:opacity-90", children: [
      /* @__PURE__ */ jsx(BarChart3, { className: "size-4" }),
      " Custom Report"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: CalendarDays, label: "Total Bookings", value: "1,248", trend: "↑ 18.6% vs Apr 2025", tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Download, label: "Total Downloads", value: "28,452", trend: "↑ 21.3% vs Apr 2025", tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Headphones, label: "Unique Listeners", value: "12,389", trend: "↑ 15.7% vs Apr 2025", tone: "warning" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Clock, label: "Watch Time (Hours)", value: "1,842", trend: "↑ 22.1% vs Apr 2025", tone: "info" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Wallet, label: "Total Revenue", value: "₹5,20,000", trend: "↑ 24.4% vs Apr 2025", tone: "pink" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_1fr_320px] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Bookings Overview" }),
          /* @__PURE__ */ jsxs("select", { value: bookingView, onChange: (e) => {
            setBookingView(e.target.value);
            toast.info(`Showing ${e.target.value} data`);
          }, className: "text-xs border border-border rounded-md px-2 py-1 bg-card", children: [
            /* @__PURE__ */ jsx("option", { children: "Daily" }),
            /* @__PURE__ */ jsx("option", { children: "Weekly" }),
            /* @__PURE__ */ jsx("option", { children: "Monthly" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(LineArea, {})
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Downloads Overview" }),
          /* @__PURE__ */ jsxs("select", { value: downloadView, onChange: (e) => {
            setDownloadView(e.target.value);
            toast.info(`Showing ${e.target.value} data`);
          }, className: "text-xs border border-border rounded-md px-2 py-1 bg-card", children: [
            /* @__PURE__ */ jsx("option", { children: "Daily" }),
            /* @__PURE__ */ jsx("option", { children: "Weekly" }),
            /* @__PURE__ */ jsx("option", { children: "Monthly" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(LineArea, { color: "stroke-success", fill: "fill-success/15" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3", children: "Top Episodes" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm", children: [{
          i: 1,
          name: "AI Revolution",
          date: "15 May 2025",
          val: 2845,
          color: "bg-primary"
        }, {
          i: 2,
          name: "Investment 101",
          date: "20 May 2025",
          val: 2512,
          color: "bg-info"
        }, {
          i: 3,
          name: "Mindset Matters",
          date: "22 May 2025",
          val: 2145,
          color: "bg-success"
        }, {
          i: 4,
          name: "Digital Creators",
          date: "05 May 2025",
          val: 1987,
          color: "bg-warning"
        }, {
          i: 5,
          name: "Business Talk",
          date: "13 May 2025",
          val: 1765,
          color: "bg-pink"
        }].map((e) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground w-4", children: e.i }),
          /* @__PURE__ */ jsx("div", { className: `size-9 rounded-lg ${e.color} grid place-items-center text-white`, children: /* @__PURE__ */ jsx(Mic2, { className: "size-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: e.name }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: e.date })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: e.val.toLocaleString() })
        ] }, e.i)) }),
        /* @__PURE__ */ jsx("a", { onClick: () => toast.info("Navigating to Episodes"), className: "block text-center text-primary text-sm font-medium mt-4 cursor-pointer hover:underline", children: "View All Episodes →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_1fr_320px] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Top Performing Shows" }),
          /* @__PURE__ */ jsxs("select", { value: showView, onChange: (e) => {
            setShowView(e.target.value);
            toast.info(`Sorting ${e.target.value.toLowerCase()}`);
          }, className: "text-xs border border-border rounded-md px-2 py-1 bg-card", children: [
            /* @__PURE__ */ jsx("option", { children: "By Downloads" }),
            /* @__PURE__ */ jsx("option", { children: "By Listeners" }),
            /* @__PURE__ */ jsx("option", { children: "By Growth" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "text-muted-foreground text-left", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "pb-2", children: "#" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2", children: "Show / Series" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2", children: "Downloads" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2", children: "Listeners" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2", children: "Growth" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: [{
            n: "The Startup Talk",
            s: "Premium Studio",
            d: 5632,
            l: 2450,
            g: "28.4%"
          }, {
            n: "Tech with Rahul",
            s: "Main Studio",
            d: 4812,
            l: 2189,
            g: "22.7%"
          }, {
            n: "Marketing Podcast",
            s: "Main Studio",
            d: 4156,
            l: 1876,
            g: "16.3%"
          }, {
            n: "Health & Wellness",
            s: "Main Studio",
            d: 3245,
            l: 1543,
            g: "18.9%"
          }, {
            n: "Entrepreneur Hour",
            s: "Premium Studio",
            d: 2945,
            l: 1342,
            g: "14.8%"
          }].map((s, i) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3", children: i + 1 }),
            /* @__PURE__ */ jsxs("td", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: s.n }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.s })
            ] }),
            /* @__PURE__ */ jsx("td", { children: s.d.toLocaleString() }),
            /* @__PURE__ */ jsx("td", { children: s.l.toLocaleString() }),
            /* @__PURE__ */ jsxs("td", { className: "text-success", children: [
              "↑ ",
              s.g
            ] })
          ] }, s.n)) })
        ] }),
        /* @__PURE__ */ jsx("a", { onClick: () => toast.info("Navigating to Shows"), className: "block text-center text-primary text-sm font-medium mt-4 pt-3 border-t border-border cursor-pointer hover:underline", children: "View All Shows" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3", children: "Audience Demographics" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Gender" }),
            /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 120 120", className: "w-28 h-28 -rotate-90", children: [
              /* @__PURE__ */ jsx("circle", { cx: "60", cy: "60", r: "45", fill: "none", stroke: "#3b82f6", strokeWidth: "14", strokeDasharray: `${2 * Math.PI * 45 * 0.58} ${2 * Math.PI * 45}` }),
              /* @__PURE__ */ jsx("circle", { cx: "60", cy: "60", r: "45", fill: "none", stroke: "#ec4899", strokeWidth: "14", strokeDasharray: `${2 * Math.PI * 45 * 0.42} ${2 * Math.PI * 45}`, strokeDashoffset: -2 * Math.PI * 45 * 0.58 })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-xs justify-center mt-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-info" }),
                "Male 58%"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-pink" }),
                "Female 42%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "Age Range" }),
            [{
              l: "18-24",
              v: 12
            }, {
              l: "25-34",
              v: 38
            }, {
              l: "35-44",
              v: 28
            }, {
              l: "45-54",
              v: 14
            }, {
              l: "55+",
              v: 8
            }].map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1.5 text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "w-12", children: a.l }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary", style: {
                width: `${a.v * 2}%`
              } }) }),
              /* @__PURE__ */ jsxs("span", { className: "w-8 text-right", children: [
                a.v,
                "%"
              ] })
            ] }, a.l))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-xl p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Countries" }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: "42" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-success", children: "↑ 8 vs Apr 2025" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-xl p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Cities" }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: "128" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-success", children: "↑ 15 vs Apr 2025" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3", children: "Downloads by Platform" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Donut, {}),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-center", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold", children: "28,452" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: "Total" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 text-xs space-y-1.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success" }),
                  "Spotify"
                ] }),
                /* @__PURE__ */ jsx("span", { children: "42% (11,938)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-info" }),
                  "Apple Podcasts"
                ] }),
                /* @__PURE__ */ jsx("span", { children: "28% (7,970)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-warning" }),
                  "Google Podcasts"
                ] }),
                /* @__PURE__ */ jsx("span", { children: "12% (3,417)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-destructive" }),
                  "YouTube"
                ] }),
                /* @__PURE__ */ jsx("span", { children: "10% (2,845)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-primary" }),
                  "Other"
                ] }),
                /* @__PURE__ */ jsx("span", { children: "8% (2,282)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3", children: "Listeners by Location" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2 text-sm", children: [{
            c: "India",
            v: "45.2%"
          }, {
            c: "United States",
            v: "18.7%"
          }, {
            c: "United Kingdom",
            v: "8.3%"
          }, {
            c: "Canada",
            v: "5.6%"
          }, {
            c: "Australia",
            v: "4.2%"
          }].map((l) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: l.c }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: l.v })
          ] }, l.c)) }),
          /* @__PURE__ */ jsx("a", { onClick: () => toast.info("Full analytics view coming soon"), className: "block text-center text-primary text-sm font-medium mt-3 cursor-pointer hover:underline", children: "View Full Analytics →" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-sm flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(FileText, { className: "size-4" }),
        " Reports are updated every 30 minutes. All times are shown in your local timezone (IST)."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Data as of 31 May 2025, 11:59 PM" })
    ] })
  ] });
}
export {
  Reports as component
};
