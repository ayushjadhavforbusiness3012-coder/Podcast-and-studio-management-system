import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Package, type Addon } from "@/contexts/AppContext";
import { toast } from "sonner";
import { AddonFormDialog } from "./AddonFormDialog";
import { Clock, Video, Headphones, Sparkles, Mic, Camera, Music, Plus, Pencil, Trash2 } from "lucide-react";
import { currencySymbol, formatCurrency } from "@/lib/money";

const iconOptions = ["Star", "Crown", "Zap", "Diamond", "Building2", "InfinityIcon"] as const;
const colorOptions = ["bg-primary", "bg-info", "bg-success", "bg-warning", "bg-destructive"] as const;
const catOptions = ["Basic", "Standard", "Popular", "Premium", "Business", "Enterprise", "Custom"] as const;
const durationOptions = ["1 Hour", "2 Hours", "3 Hours", "4 Hours", "Custom"] as const;

export function PackageFormDialog({
  open,
  onOpenChange,
  packageToEdit,
  initialPackage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageToEdit?: Package;
  initialPackage?: Omit<Package, "id">;
}) {
  const { addPackage, updatePackage, addons, deleteAddon, settings } = useAppContext();
  const moneySymbol = currencySymbol(settings.payment.currency);

  const [iconName, setIconName] = useState<Package["iconName"]>("Star");
  const [color, setColor] = useState<string>("bg-primary");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Basic");
  const [catV, setCatV] = useState("primary");
  const [dur, setDur] = useState("1 Hour");
  const [price, setPrice] = useState(() => formatCurrency(0));
  const [extra, setExtra] = useState("+ more");
  const [bookings, setBookings] = useState(0);
  const [popular, setPopular] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // Custom package states
  const [customHours, setCustomHours] = useState(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [addonFormOpen, setAddonFormOpen] = useState(false);
  const [selectedAddonToEdit, setSelectedAddonToEdit] = useState<Addon | undefined>(undefined);

  const isCustom = cat === "Custom";

  useEffect(() => {
    if (!open) return;
    const source = packageToEdit ?? initialPackage;
    if (source) {
      setIconName(source.iconName);
      setColor(source.color);
      setName(source.name);
      setDesc(source.desc);
      setCat(source.cat);
      setCatV(source.catV);
      setDur(source.dur);
      setPrice(source.price);
      setExtra(source.extra);
      setBookings(source.bookings);
      setPopular(Boolean(source.popular));
      setFeatures(source.features ?? []);

      if (source.cat === "Custom") {
        const preselected = addons
          .filter((addon) => source.features?.includes(addon.name))
          .map((addon) => addon.id);
        setSelectedAddonIds(preselected);
        
        const match = source.dur.match(/^(\d+)/);
        setCustomHours(match ? Number(match[1]) : 1);
      } else {
        setSelectedAddonIds([]);
        setCustomHours(1);
      }
    } else {
      setIconName("Star");
      setColor("bg-primary");
      setName("");
      setDesc("");
      setCat("Basic");
      setCatV("primary");
      setDur("1 Hour");
      setPrice(formatCurrency(0, moneySymbol));
      setExtra("+ more");
      setBookings(0);
      setPopular(false);
      setFeatures([]);
      setSelectedAddonIds([]);
      setCustomHours(1);
    }
  }, [open, packageToEdit, initialPackage, addons, moneySymbol]);

  useEffect(() => {
    if (isCustom && open) {
      const addonCost = addons
        .filter((a) => selectedAddonIds.includes(a.id))
        .reduce((sum, a) => sum + a.price, 0);
      const calculated = 2000 + (customHours - 1) * 1500 + addonCost;
      setPrice(formatCurrency(calculated, moneySymbol));
    }
  }, [customHours, selectedAddonIds, isCustom, addons, open, moneySymbol]);

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures((prev) => [...prev, featureInput.trim()]);
    setFeatureInput("");
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures((prev) => prev.filter((item) => item !== feature));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Package name is required.");
      return;
    }

    const selectedAddonsList = addons.filter((a) => selectedAddonIds.includes(a.id));
    const selectedAddonNames = selectedAddonsList.map((a) => a.name);

    // Merge manual features with add-ons
    const manualFeatures = features.filter((f) => !addons.map((a) => a.name).includes(f));
    const finalFeatures = [...selectedAddonNames, ...manualFeatures];

    const finalDur = isCustom ? `${customHours} Hour${customHours > 1 ? "s" : ""}` : dur;

    const pkgData: Omit<Package, "id"> = {
      iconName,
      color,
      name: name.trim(),
      desc: desc.trim(),
      cat,
      catV,
      dur: finalDur,
      price: price.trim() || "₹0",
      features: finalFeatures,
      extra: extra.trim() || "+ more",
      bookings: Number.isNaN(Number(bookings)) ? 0 : bookings,
      popular,
    };

    if (packageToEdit) {
      updatePackage(packageToEdit.id, pkgData);
      toast.success("Package updated.");
    } else {
      addPackage(pkgData);
      toast.success("Package added.");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0 mb-1">
          <DialogTitle>{packageToEdit ? "Edit Package" : "Add Package"}</DialogTitle>
          <DialogDescription className="sr-only">Form to create or edit a package.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-3 py-1 space-y-4 min-h-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="package-name">Name</label>
                <input
                  id="package-name"
                  autoFocus
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Standard Package"
                  title="Package Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="package-category">Category</label>
                <select
                  id="package-category"
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                >
                  {catOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="package-color">Color</label>
                <select
                  id="package-color"
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colorOptions.map((option) => (
                    <option key={option} value={option}>{option.replace('bg-', '')}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="package-status">Badge variant</label>
                <select
                  id="package-status"
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={catV}
                  onChange={(e) => setCatV(e.target.value)}
                >
                  <option value="primary">Primary</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="destructive">Destructive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="package-icon">Icon</label>
                <select
                  id="package-icon"
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value as Package["iconName"])}
                >
                  {iconOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="package-desc">Description</label>
              <textarea
                id="package-desc"
                className="w-full min-h-[88px] px-3 py-2 rounded-md border border-border bg-background text-sm"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Package description"
                title="Package Description"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {!isCustom && (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="package-duration">Duration</label>
                  <select
                    id="package-duration"
                    className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                    value={dur}
                    onChange={(e) => setDur(e.target.value)}
                  >
                    {durationOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="package-price">Price</label>
                <input
                  id="package-price"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={`${moneySymbol}0`}
                  title="Package Price"
                />
                {isCustom && (
                  <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">Auto-calculated; edit to override.</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="package-bookings">Bookings</label>
                <input
                  id="package-bookings"
                  type="number"
                  min={0}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                  value={bookings}
                  onChange={(e) => setBookings(Number(e.target.value))}
                  title="Bookings"
                />
              </div>
            </div>

            {isCustom && (
              <div className="space-y-4 border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground">Custom Package Builder</h4>
                
                {/* Duration Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="custom-duration-slider" className="text-sm font-medium">Session Duration: {customHours} Hour{customHours > 1 ? "s" : ""}</label>
                    <span className="text-xs text-muted-foreground">{formatCurrency(2000, moneySymbol)} base + {formatCurrency(1500, moneySymbol)}/extra hour</span>
                  </div>
                  <input
                    id="custom-duration-slider"
                    type="range"
                    min="1"
                    max="10"
                    value={customHours}
                    onChange={(e) => setCustomHours(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    title="Session Duration Slider"
                  />
                </div>

                {/* Addons Selection Checklist and CRUD controls */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Include Add-ons</label>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddonToEdit(undefined);
                        setAddonFormOpen(true);
                      }}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" /> Add Add-on
                    </button>
                  </div>
                  
                  <div className="border border-border rounded-lg bg-muted/30 p-3 max-h-[180px] overflow-y-auto space-y-2">
                    {addons.map((addon) => {
                      const iconMap = { Clock, Video, Headphones, Sparkles, Mic, Camera, Music };
                      const AddonIcon = iconMap[addon.iconName as keyof typeof iconMap] || Clock;
                      const isChecked = selectedAddonIds.includes(addon.id);

                      return (
                        <div key={addon.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAddonIds((prev) => [...prev, addon.id]);
                                } else {
                                  setSelectedAddonIds((prev) => prev.filter((id) => id !== addon.id));
                                }
                              }}
                              className="size-4 rounded border-border cursor-pointer accent-primary"
                              id={`addon-${addon.id}`}
                            />
                            <label htmlFor={`addon-${addon.id}`} className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                              <AddonIcon className="size-3.5 text-muted-foreground" />
                              {addon.name}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground">{formatCurrency(addon.price, moneySymbol)}</span>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity ml-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAddonToEdit(addon);
                                  setAddonFormOpen(true);
                                }}
                                className="size-6 rounded border border-border bg-card grid place-items-center hover:bg-muted cursor-pointer"
                                title="Edit add-on"
                              >
                                <Pencil className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteAddon(addon.id);
                                  setSelectedAddonIds((prev) => prev.filter((id) => id !== addon.id));
                                  toast.success("Add-on deleted");
                                }}
                                className="size-6 rounded border border-border bg-card text-destructive grid place-items-center hover:bg-destructive/10 cursor-pointer"
                                title="Delete add-on"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {addons.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-4">No add-ons available. Create one to begin!</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 flex flex-col justify-end">
                <label className="text-sm font-medium mb-2">Popular package</label>
                <div className="flex items-center gap-3 h-10">
                  <input
                    id="package-popular"
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="size-4 rounded border-border"
                  />
                  <label htmlFor="package-popular" className="text-sm text-muted-foreground select-none cursor-pointer">Mark as popular</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Features</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature"
                  title="Feature"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground hover:bg-muted transition-all cursor-pointer"
                  >
                    {feature} ×
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 mt-2 border-t border-border shrink-0 flex flex-col gap-2 sm:flex-row sm:justify-end bg-card">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer"
            >
              {packageToEdit ? "Save" : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
      <AddonFormDialog
        open={addonFormOpen}
        onOpenChange={setAddonFormOpen}
        addonToEdit={selectedAddonToEdit}
      />
    </Dialog>
  );
}
