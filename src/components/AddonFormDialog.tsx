import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Addon } from "@/contexts/AppContext";
import { toast } from "sonner";

const iconOptions = ["Clock", "Video", "Headphones", "Sparkles", "Mic", "Camera", "Music"] as const;

export function AddonFormDialog({
  open,
  onOpenChange,
  addonToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addonToEdit?: Addon;
}) {
  const { addAddon, updateAddon } = useAppContext();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [iconName, setIconName] = useState<Addon["iconName"]>("Clock");

  useEffect(() => {
    if (!open) return;
    if (addonToEdit) {
      setName(addonToEdit.name);
      setPrice(addonToEdit.price);
      setIconName(addonToEdit.iconName);
    } else {
      setName("");
      setPrice(0);
      setIconName("Clock");
    }
  }, [open, addonToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Add-on name is required.");
      return;
    }
    if (price < 0 || Number.isNaN(price)) {
      toast.error("Price must be a valid non-negative number.");
      return;
    }

    const addonData = {
      name: name.trim(),
      price,
      iconName,
    };

    if (addonToEdit) {
      updateAddon(addonToEdit.id, addonData);
      toast.success("Add-on updated.");
    } else {
      addAddon(addonData);
      toast.success("Add-on added.");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{addonToEdit ? "Edit Add-on" : "Add Add-on"}</DialogTitle>
          <DialogDescription className="sr-only">Form to create or edit an add-on.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="addon-name">Name</label>
            <input
              id="addon-name"
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Video Recording"
              title="Add-on Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="addon-price">Price (₹)</label>
            <input
              id="addon-price"
              type="number"
              min={0}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0"
              title="Add-on Price"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="addon-icon">Icon</label>
            <select
              id="addon-icon"
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              value={iconName}
              onChange={(e) => setIconName(e.target.value as Addon["iconName"])}
            >
              {iconOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
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
              {addonToEdit ? "Save" : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
