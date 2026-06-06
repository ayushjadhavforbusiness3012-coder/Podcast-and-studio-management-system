import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Package } from "@/contexts/AppContext";
import { toast } from "sonner";

export function PackageFormDialog({
  open,
  onOpenChange,
  packageToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageToEdit?: Package;
}) {
  const { addPackage, updatePackage } = useAppContext();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Basic");
  const [catV, setCatV] = useState("primary");
  const [dur, setDur] = useState("1 Hour");
  const [price, setPrice] = useState("₹0");
  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (open && packageToEdit) {
      setName(packageToEdit.name);
      setDesc(packageToEdit.desc);
      setCat(packageToEdit.cat);
      setCatV(packageToEdit.catV);
      setDur(packageToEdit.dur);
      setPrice(packageToEdit.price);
      setFeatures(packageToEdit.features);
    } else if (open) {
      setName("");
      setDesc("");
      setCat("Basic");
      setCatV("primary");
      setDur("1 Hour");
      setPrice("₹0");
      setFeatures([]);
    }
  }, [open, packageToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Package name is required.");
      return;
    }
    const pkgData: Omit<Package, "id"> = {
      iconName: packageToEdit?.iconName || "Star",
      color: packageToEdit?.color || "bg-primary",
      name,
      desc,
      cat,
      catV,
      dur,
      price,
      features,
      extra: "+ more",
      bookings: packageToEdit?.bookings ?? 0,
      popular: packageToEdit?.popular,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{packageToEdit ? "Edit Package" : "Add Package"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          {/* Additional fields can be added similarly */}
          <DialogFooter className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              {packageToEdit ? "Save" : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
