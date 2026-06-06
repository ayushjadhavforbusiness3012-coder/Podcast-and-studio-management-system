import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Booking } from "@/contexts/AppContext";
import { toast } from "sonner";

export function BookingFormDialog({
  open,
  onOpenChange,
  bookingToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingToEdit?: Booking;
}) {
  const { addBooking, updateBooking } = useAppContext();

  const [guest, setGuest] = useState("");
  const [studio, setStudio] = useState("Studio A");
  const [pkg, setPkg] = useState("Standard Package");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<Booking["status"]>("Confirmed");

  useEffect(() => {
    if (open && bookingToEdit) {
      setGuest(bookingToEdit.guest);
      setStudio(bookingToEdit.studio);
      setPkg(bookingToEdit.pkg);
      setDate(bookingToEdit.date);
      setTime(bookingToEdit.time);
      setStatus(bookingToEdit.status);
    } else if (open) {
      setGuest("");
      setStudio("Studio A");
      setPkg("Standard Package");
      setDate("");
      setTime("");
      setStatus("Confirmed");
    }
  }, [open, bookingToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest || !date || !time) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const amtMap: Record<string, string> = {
      "Basic Package": "₹2,500",
      "Standard Package": "₹4,000",
      "Pro Package": "₹6,000",
      "Premium Package": "₹8,500",
    };

    if (bookingToEdit) {
      updateBooking(bookingToEdit.id, {
        guest,
        studio,
        pkg,
        date,
        time,
        status,
        amt: amtMap[pkg] || "₹0",
      });
      toast.success("Booking updated successfully!");
    } else {
      addBooking({
        guest,
        studio,
        pkg,
        date,
        time,
        status,
        amt: amtMap[pkg] || "₹0",
      });
      toast.success("New booking created successfully!");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{bookingToEdit ? "Edit Booking" : "New Booking"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Guest Name</label>
            <input
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. Rahul Verma"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Studio</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={studio}
                onChange={(e) => setStudio(e.target.value)}
              >
                <option>Studio A</option>
                <option>Studio B</option>
                <option>Studio C</option>
                <option>Main Studio</option>
                <option>Mini Studio</option>
                <option>Premium Studio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Package</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
              >
                <option>Basic Package</option>
                <option>Standard Package</option>
                <option>Pro Package</option>
                <option>Premium Package</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="text"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="25 May 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <input
                type="text"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="10:00 AM - 12:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as Booking["status"])}
            >
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
              <option>Completed</option>
            </select>
          </div>
          <DialogFooter className="pt-4">
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
              {bookingToEdit ? "Save Changes" : "Book Studio"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
