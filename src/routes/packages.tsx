import { createFileRoute } from "@tanstack/react-router";
import { useAppContext, type Package } from "@/contexts/AppContext";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import {
  CheckCircle2,
  Tag,
  CalendarDays,
  TrendingUp,
  Star,
  Crown,
  Zap,
  Diamond,
  Building2,
  Infinity as InfinityIcon,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Pencil,
  MoreVertical,
  Clock,
  Headphones,
  Mic2,
  FileText,
  Layers,
  Gift,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { PackageFormDialog } from "@/components/PackageFormDialog";

function Packages() {
  const { packages, addPackage, updatePackage, deletePackage } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(undefined);

  return (
    <DashboardLayout
      title="Packages & Pricing"
      subtitle="Manage studio packages, features and pricing plans"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search packages..." className="h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm" />
          </div>
          <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2">
            <Layers className="size-4" /> Categories
          </button>
          <button
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2"
            onClick={() => {
              setSelectedPackage(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Add Package
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={Tag} label="Total Packages" value={packages.length.toString()} trend="Active packages" tone="primary" />
        <StatCard icon={CheckCircle2} label="Most Popular" value="Pro Package" trend="42% of bookings" tone="success" />
        <StatCard icon={Tag} label="Avg. Price" value="₹4,167" trend="Across all packages" tone="warning" />
        <StatCard icon={CalendarDays} label="Total Bookings" value="1,248" trend="This month" tone="info" />
        <StatCard icon={TrendingUp} label="Revenue" value="₹5,20,000" trend="This month" tone="pink" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mt-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <input placeholder="Search packages..." className="h-10 rounded-lg border border-border bg-card px-3 text-sm" />
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm">
                  <option>All Categories</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Status</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm">
                  <option>All Status</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="h-10 px-4 rounded-lg border border-border text-sm inline-flex items-center gap-1.5">
                  <Filter className="size-4" /> Filter
                </button>
                <button className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5">
                  <RotateCcw className="size-4" /> Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 text-left font-medium">Package</th>
                    <th className="p-4 text-left font-medium">Category</th>
                    <th className="p-4 text-left font-medium">Duration</th>
                    <th className="p-4 text-left font-medium">Price</th>
                    <th className="p-4 text-left font-medium">Features</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Bookings</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((p) => {
                    const iconMap = { Star, Crown, Zap, Diamond, Building2, InfinityIcon };
                    const Ic = iconMap[p.iconName as keyof typeof iconMap] || Star;
                    return (
                      <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`size-12 rounded-xl ${p.color} grid place-items-center text-white`}>
                              <Ic className="size-5" />
                            </div>
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.desc}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><Badge variant={p.catV as any}>{p.cat}</Badge></td>
                        <td className="p-4">{p.dur}</td>
                        <td className="p-4">
                          <div className="font-semibold">{p.price}</div>
                          <div className="text-xs text-muted-foreground">{p.price === "Custom" ? "Contact Us" : "per session"}</div>
                        </td>
                        <td className="p-4">
                          {p.features.map((f) => (
                            <div key={f} className="text-xs flex items-center gap-1">
                              <CheckCircle2 className="size-3 text-success" /> {f}
                            </div>
                          ))}
                          <div className="text-xs text-primary mt-0.5">{p.extra}</div>
                        </td>
                        <td className="p-4"><Badge variant="success">Active</Badge></td>
                        <td className="p-4">
                          <div>{p.bookings}</div>
                          {p.popular && <Badge variant="warning">Most Popular</Badge>}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <button
                              className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"
                              onClick={() => {
                                setSelectedPackage(p);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              className="size-8 rounded-md border border-border grid place-items-center hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                              onClick={() => deletePackage(p.id)}
                            >
                              <MoreVertical className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4">Package Highlights</h3>
            <div className="space-y-4">
              {[{ icon: Clock, color: "bg-accent text-primary", title: "Flexible Durations", desc: "Choose from 1 to 4 hours sessions" },
                { icon: Mic2, color: "bg-info/15 text-info", title: "Premium Equipment", desc: "High-quality audio & video equipment" },
                { icon: Headphones, color: "bg-warning/20 text-warning-foreground", title: "Expert Support", desc: "Technical assistance during sessions" },
                { icon: FileText, color: "bg-success/15 text-success", title: "Easy Booking", desc: "Instant confirmation & easy rescheduling" }].map((h) => {
                const Ic = h.icon;
                return (
                  <div key={h.title} className="flex gap-3">
                    <div className={`size-10 rounded-lg ${h.color} grid place-items-center shrink-0`}>
                      <Ic className="size-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{h.title}</div>
                      <div className="text-xs text-muted-foreground">{h.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4">Popular Add-ons</h3>
            <div className="space-y-3 text-sm">
              {[{ name: "Extra Hour", price: "₹1,500" },
                { name: "Video Recording", price: "₹2,000" },
                { name: "Audio Editing", price: "₹1,000" },
                { name: "Thumbnail Design", price: "₹800" }].map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{a.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{a.price}</span>
                    <button className="size-7 rounded-md border border-border grid place-items-center">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-5">
            <Gift className="size-8 mb-3" />
            <div className="font-semibold">Create Custom Package</div>
            <div className="text-xs opacity-90 mt-1">Need a custom package for your specific needs?</div>
            <button className="mt-4 w-full bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2">
              Create Custom Package <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <PackageFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        packageToEdit={selectedPackage}
      />
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/packages")({
  head: () => ({ meta: [{ title: "Packages — Podcast Studio" }] }),
  component: Packages,
});
