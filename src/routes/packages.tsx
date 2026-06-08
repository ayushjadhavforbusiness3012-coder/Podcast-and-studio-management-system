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
  Filter,
  RotateCcw,
  Pencil,
  Clock,
  Headphones,
  Mic2,
  FileText,
  Gift,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PackageFormDialog } from "@/components/PackageFormDialog";
import { toast } from "sonner";

function Packages() {
  const { packages, deletePackage } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(undefined);
  const [initialPackage, setInitialPackage] = useState<Omit<Package, "id"> | undefined>(undefined);
  
  // Applied filters state
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [popularOnly, setPopularOnly] = useState(false);
  
  // Temporary filters state
  const [tempCategoryFilter, setTempCategoryFilter] = useState("All");
  const [tempPopularOnly, setTempPopularOnly] = useState(false);
  
  const [viewAllPackages, setViewAllPackages] = useState(false);

  const categoryOptions = useMemo(
    () => ["All", ...Array.from(new Set(packages.map((pkg) => pkg.cat)))],
    [packages]
  );

  const filteredPackages = useMemo(
    () =>
      packages.filter((pkg) => {
        if (categoryFilter !== "All" && pkg.cat !== categoryFilter) return false;
        if (popularOnly && !pkg.popular) return false;
        return true;
      }),
    [packages, categoryFilter, popularOnly]
  );

  const handleApplyFilter = () => {
    setCategoryFilter(tempCategoryFilter);
    setPopularOnly(tempPopularOnly);
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setTempCategoryFilter("All");
    setTempPopularOnly(false);
    setCategoryFilter("All");
    setPopularOnly(false);
    setViewAllPackages(false);
    toast.success("Filters reset");
  };

  const visiblePackages = viewAllPackages ? filteredPackages : filteredPackages.slice(0, 6);
  const defaultCustomPackage: Omit<Package, "id"> = {
    iconName: "InfinityIcon",
    color: "bg-destructive",
    name: "Custom Package",
    desc: "Tailored studio experience with flexible terms",
    cat: "Custom",
    catV: "destructive",
    dur: "Custom",
    price: "Custom",
    features: ["Personalized Support", "Flexible Scheduling"],
    extra: "+ more",
    bookings: 0,
    popular: false,
  };

  return (
    <DashboardLayout
      title="Packages & Pricing"
      subtitle="Manage studio packages, features and pricing plans"
      actions={
        <button
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-sm"
          onClick={() => {
            setInitialPackage(undefined);
            setSelectedPackage(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" /> Add Package
        </button>
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
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs text-muted-foreground font-medium" htmlFor="filter-pkg-category">Package category</label>
                <select
                  id="filter-pkg-category"
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                  value={tempCategoryFilter}
                  onChange={(e) => setTempCategoryFilter(e.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium" htmlFor="filter-show-pop">Show</label>
                <select
                  id="filter-show-pop"
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                  value={tempPopularOnly ? "Popular only" : "All packages"}
                  onChange={(e) => setTempPopularOnly(e.target.value === "Popular only")}
                >
                  <option>All packages</option>
                  <option>Popular only</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleApplyFilter}
                  className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-sm transition-all"
                >
                  <Filter className="size-4" /> Filter
                </button>
                <button
                  onClick={handleReset}
                  className="h-10 px-4 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-2 hover:bg-muted cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-4" /> Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
              {visiblePackages.map((p) => {
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
                        {p.features.slice(0, 3).map((f) => (
                          <div key={f} className="text-xs flex items-center gap-1.5 text-muted-foreground">
                            <CheckCircle2 className="size-3.5 text-success shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                        {p.extra && <div className="text-xs text-muted-foreground">{p.extra}</div>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <span className="text-[11px] font-semibold text-muted-foreground">{p.bookings} bookings</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPackage(p);
                            setInitialPackage(undefined);
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

            {viewAllPackages ? (
              <div className="p-5 border-t border-border bg-muted/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">Showing all {filteredPackages.length} package options.</div>
                <button
                  onClick={() => setViewAllPackages(false)}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-all cursor-pointer"
                >
                  Show fewer <ChevronLeft className="size-4 ml-2" />
                </button>
              </div>
            ) : (
              filteredPackages.length > 6 && (
                <div className="p-5 border-t border-border bg-muted/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">Showing 6 of {filteredPackages.length} package options.</div>
                  <button
                    onClick={() => setViewAllPackages(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
                  >
                    View all packages <ChevronRight className="size-4 ml-2" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border-2 border-primary/25 rounded-2xl p-6 shadow-md scale-[1.02] transform transition hover:scale-[1.03] duration-200">
            <h3 className="font-bold text-foreground text-base mb-4 flex items-center gap-2">
              <Crown className="size-5 text-primary" /> Key highlights
            </h3>
            <div className="space-y-4">
              {[
                { icon: Clock, color: "bg-accent text-primary", title: "Flexible Durations", desc: "Choose from 1 to 4 hours sessions" },
                { icon: Mic2, color: "bg-info/15 text-info", title: "Premium Equipment", desc: "High-quality audio & video equipment" },
                { icon: Headphones, color: "bg-warning/20 text-warning-foreground", title: "Expert Support", desc: "Technical assistance during sessions" },
                { icon: FileText, color: "bg-success/15 text-success", title: "Easy Booking", desc: "Instant confirmation & easy rescheduling" },
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

          {/* Standalone Popular Add-ons sidebar card removed as requested. It is now managed directly inside the custom package builder dialog. */}

          <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl p-5 shadow-md">
            <Gift className="size-8 mb-3" />
            <div className="font-semibold">Create Custom Package</div>
            <div className="text-xs opacity-90 mt-1">Need a custom package for your specific needs?</div>
            <button
              onClick={() => {
                setInitialPackage(defaultCustomPackage);
                setSelectedPackage(undefined);
                setFormOpen(true);
              }}
              className="mt-4 w-full bg-white/15 hover:bg-white/25 rounded-lg py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Create Custom Package <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <PackageFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        packageToEdit={selectedPackage}
        initialPackage={initialPackage}
      />
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/packages")({
  head: () => ({ meta: [{ title: "Packages — Podcast Studio" }] }),
  component: Packages,
});
