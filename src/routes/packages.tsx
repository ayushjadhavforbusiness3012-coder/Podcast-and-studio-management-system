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
  Clock,
  Headphones,
  Mic2,
  FileText,
  Layers,
  Gift,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { PackageFormDialog } from "@/components/PackageFormDialog";
import { toast } from "sonner";

function Packages() {
  const { packages, deletePackage } = useAppContext();
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
            <input placeholder="Search packages..." className="h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none" />
          </div>
          <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2 hover:bg-muted transition-all cursor-pointer">
            <Layers className="size-4" /> Categories
          </button>
          <button
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-sm"
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
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={Tag} label="Total Packages" value={packages.length.toString()} trend="Active packages" tone="primary" />
        <StatCard icon={CheckCircle2} label="Most Popular" value="Pro Package" trend="42% of bookings" tone="success" />
        <StatCard icon={Tag} label="Avg. Price" value="₹4,167" trend="Across all packages" tone="warning" />
        <StatCard icon={CalendarDays} label="Total Bookings" value="1,248" trend="This month" tone="info" />
        <StatCard icon={TrendingUp} label="Revenue" value="₹5,20,000" trend="This month" tone="pink" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mt-6">
        <div className="space-y-6">
          
          {/* Filters card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <input placeholder="Search packages..." className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none" />
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
                {/* Style Filter button with a solid purple accent fill */}
                <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground border-0 text-sm inline-flex items-center gap-1.5 hover:opacity-95 cursor-pointer shadow-sm">
                  <Filter className="size-4" /> Filter
                </button>
                <button className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 hover:bg-muted cursor-pointer transition-colors">
                  <RotateCcw className="size-4" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Primary Packages Catalog Grid Layout (Structured Packages Matrix) */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
              {packages.map((p) => {
                const iconMap = { Star, Crown, Zap, Diamond, Building2, InfinityIcon };
                const Ic = iconMap[p.iconName as keyof typeof iconMap] || Star;
                return (
                  <div key={p.id} className="relative bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all flex flex-col justify-between shadow-sm min-h-[320px]">
                    {p.popular && (
                      <span className="absolute -top-2.5 left-4 bg-warning text-warning-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Popular
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className={`size-10 rounded-xl ${p.color} grid place-items-center text-white shadow-sm`}>
                          <Ic className="size-4.5" />
                        </div>
                        <Badge variant={p.catV as any}>{p.cat}</Badge>
                      </div>
                      <h4 className="font-bold text-base text-foreground leading-snug">{p.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 min-h-[34px]">{p.desc}</p>
                      
                      <div className="my-4">
                        <span className="text-2xl font-bold text-foreground">{p.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">/ {p.dur}</span>
                      </div>
                      
                      <div className="space-y-1.5 mb-4">
                        {p.features.map((f) => (
                          <div key={f} className="text-xs flex items-center gap-1.5 text-muted-foreground">
                            <CheckCircle2 className="size-3.5 text-success shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <span className="text-[11px] font-semibold text-muted-foreground">{p.bookings} bookings</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPackage(p);
                            setFormOpen(true);
                          }}
                          className="size-8 rounded-md border border-border grid place-items-center text-foreground hover:bg-muted transition-all cursor-pointer"
                          title="Edit package"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            deletePackage(p.id);
                            toast.success(`Package deleted`);
                          }}
                          className="size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                          title="Delete package"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex items-center justify-between p-4 text-sm border-t border-border flex-wrap gap-2">
              <div className="text-muted-foreground font-medium">Showing 1 to {packages.length} of {packages.length} packages</div>
              <div className="flex items-center gap-1">
                <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"><ChevronLeft className="size-4" /></button>
                <button className="size-8 rounded-md bg-primary text-primary-foreground text-xs font-semibold">1</button>
                <button className="size-8 rounded-md border border-border hover:bg-muted text-xs font-semibold cursor-pointer">2</button>
                <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted cursor-pointer"><ChevronRight className="size-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Package Highlight scaled up container sidebar module */}
          <div className="bg-card border-2 border-primary/25 rounded-2xl p-6 shadow-md scale-[1.02] transform transition hover:scale-[1.03] duration-200">
            <h3 className="font-bold text-foreground text-base mb-4 flex items-center gap-2">
              <Crown className="size-5 text-primary" /> Key highlights
            </h3>
            <div className="space-y-4">
              {[
                { icon: Clock, color: "bg-accent text-primary", title: "Flexible Durations", desc: "Choose from 1 to 4 hours sessions" },
                { icon: Mic2, color: "bg-info/15 text-info", title: "Premium Equipment", desc: "High-quality audio & video equipment" },
                { icon: Headphones, color: "bg-warning/20 text-warning-foreground", title: "Expert Support", desc: "Technical assistance during sessions" },
                { icon: FileText, color: "bg-success/15 text-success", title: "Easy Booking", desc: "Instant confirmation & easy rescheduling" }
              ].map((h) => {
                const Ic = h.icon;
                return (
                  <div key={h.title} className="flex gap-3">
                    <div className={`size-10 rounded-lg ${h.color} grid place-items-center shrink-0 shadow-sm`}>
                      <Ic className="size-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{h.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{h.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Add-ons checklist with assigned decorative icons */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Popular Add-ons</h3>
            <div className="space-y-3.5 text-sm">
              {[
                { name: "Extra Hour", price: "₹1,500", icon: Clock },
                { name: "Video Recording", price: "₹2,000", icon: Video },
                { name: "Audio Editing", price: "₹1,000", icon: Headphones },
                { name: "Thumbnail Design", price: "₹800", icon: Sparkles }
              ].map((a) => {
                const AddonIcon = a.icon;
                return (
                  <div key={a.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <AddonIcon className="size-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{a.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{a.price}</span>
                      <button 
                        onClick={() => toast.success(`Added ${a.name} add-on`)} 
                        className="size-7 rounded-md border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary grid place-items-center cursor-pointer transition-all"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-5 shadow-md">
            <Gift className="size-8 mb-3" />
            <div className="font-semibold">Create Custom Package</div>
            <div className="text-xs opacity-90 mt-1">Need a custom package for your specific needs?</div>
            <button className="mt-4 w-full bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer transition-all">
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
