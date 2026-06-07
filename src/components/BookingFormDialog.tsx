import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Booking } from "@/contexts/AppContext";
import { toast } from "sonner";

// Standard 1-hour time slots
const START_SLOTS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const END_SLOTS = Array.from({ length: 24 }, (_, i) => `${String(i + 1).padStart(2, "0")}:00`);

function parseTimeRange(timeStr: string): [number, number] {
  if (!timeStr) return [0, 0];
  if (timeStr.includes("to")) {
    const parts = timeStr.split("to").map(s => s.trim());
    const startHour = parseInt(parts[0].split(":")[0], 10);
    const endHour = parseInt(parts[1].split(":")[0], 10);
    return [startHour, endHour];
  } else if (timeStr.includes("-")) {
    const parts = timeStr.split("-").map(s => s.trim());
    const parsePart = (p: string) => {
      const match = p.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return h + m / 60;
    };
    return [parsePart(parts[0]), parsePart(parts[1])];
  }
  return [0, 0];
}

export function BookingFormDialog({
  open,
  onOpenChange,
  bookingToEdit,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingToEdit?: Booking;
  defaultDate?: string;
}) {
  const { bookings, addBooking, updateBooking } = useAppContext();

  const [guest, setGuest] = useState("");
  const [studio, setStudio] = useState("Studio A");
  const [pkg, setPkg] = useState("Standard Package");
  const [date, setDate] = useState("");
  const [startSlot, setStartSlot] = useState("09:00");
  const [endSlot, setEndSlot] = useState("10:00");
  const [duration, setDuration] = useState<number | "">(1);
  const [status, setStatus] = useState<Booking["status"]>("Confirmed");

  // Helper to detect if a specific slot interval overlaps with existing bookings
  const isSlotOccupied = (shVal: number, ehVal: number) => {
    if (!date || !studio) return false;
    const existing = bookings.filter(b => {
      if (bookingToEdit && b.id === bookingToEdit.id) return false;
      return b.date === date && b.studio === studio && b.status !== "Cancelled";
    });
    for (const b of existing) {
      const [estart, eend] = parseTimeRange(b.time);
      if (Math.max(shVal, estart) < Math.min(ehVal, eend)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (open && bookingToEdit) {
      setGuest(bookingToEdit.guest);
      setStudio(bookingToEdit.studio);
      setPkg(bookingToEdit.pkg);
      setDate(bookingToEdit.date);
      
      const [sh, eh] = parseTimeRange(bookingToEdit.time);
      const shStr = `${String(Math.floor(sh)).padStart(2, "0")}:00`;
      const ehStr = `${String(Math.floor(eh)).padStart(2, "0")}:00`;
      setStartSlot(shStr);
      setEndSlot(ehStr);
      
      setDuration(bookingToEdit.duration !== undefined ? bookingToEdit.duration : (eh - sh));
      setStatus(bookingToEdit.status);
    } else if (open) {
      setGuest("");
      setStudio("Studio A");
      setPkg("Standard Package");
      setDate(defaultDate || "");
      setStartSlot("09:00");
      setEndSlot("10:00");
      setDuration(1);
      setStatus("Confirmed");
    }
  }, [open, bookingToEdit, defaultDate]);

  const handleStartSlotChange = (val: string) => {
    setStartSlot(val);
    const sh = parseInt(val.split(":")[0], 10);
    const eh = parseInt(endSlot.split(":")[0], 10);
    if (eh <= sh) {
      const nextEh = sh + 1;
      setEndSlot(`${String(nextEh).padStart(2, "0")}:00`);
      setDuration(1);
    } else {
      setDuration(eh - sh);
    }
  };

  const handleEndSlotChange = (val: string) => {
    setEndSlot(val);
    const sh = parseInt(startSlot.split(":")[0], 10);
    const eh = parseInt(val.split(":")[0], 10);
    if (eh > sh) {
      setDuration(eh - sh);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Alphanumeric checking to prevent raw numerical values for Guest name
    if (!guest || !date || !startSlot || !endSlot) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (/^\d+$/.test(guest.trim())) {
      toast.error("Guest Name cannot be a raw numerical value.");
      return;
    }

    if (duration === "" || isNaN(Number(duration)) || Number(duration) <= 0) {
      toast.error("Duration must be a positive integer.");
      return;
    }

    // Check for scheduling overlapping conflicts before submitting
    const sh = parseInt(startSlot.split(":")[0], 10);
    const eh = parseInt(endSlot.split(":")[0], 10);
    if (isSlotOccupied(sh, eh)) {
      toast.error("Scheduling conflict: The selected time slot is already booked for this studio.");
      return;
    }

    const amtMap: Record<string, string> = {
      "Basic Package": "₹2,500",
      "Standard Package": "₹4,000",
      "Pro Package": "₹6,000",
      "Premium Package": "₹8,500",
    };

    const compiledTimeStr = `${startSlot} to ${endSlot}`;

    if (bookingToEdit) {
      updateBooking(bookingToEdit.id, {
        guest,
        studio,
        pkg,
        date,
        time: compiledTimeStr,
        status,
        amt: amtMap[pkg] || "₹0",
        duration: Number(duration),
      });
      toast.success("Booking updated successfully!");
    } else {
      addBooking({
        guest,
        studio,
        pkg,
        date,
        time: compiledTimeStr,
        status,
        amt: amtMap[pkg] || "₹0",
        duration: Number(duration),
      });
      toast.success("New booking created successfully!");
    }
    onOpenChange(false);
  };

  const currentStartHour = parseInt(startSlot.split(":")[0], 10);

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
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Rahul Verma"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Studio</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="25 May 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (Hours)</label>
              <input
                type="number"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. 2"
                value={duration}
                onChange={(e) => setDuration(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
              />
            </div>
          </div>
          
          {/* Aligned Start and End Time dropdown matrices */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Starting Time Slot</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={startSlot}
                onChange={(e) => handleStartSlotChange(e.target.value)}
              >
                {START_SLOTS.map((slot, i) => {
                  // Block/gray out if [i, i+1] is occupied
                  const occupied = isSlotOccupied(i, i + 1);
                  return (
                    <option key={slot} value={slot} disabled={occupied} className={occupied ? "text-muted-foreground bg-muted/30" : ""}>
                      {slot} {occupied ? "(Booked)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ending Time Slot</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={endSlot}
                onChange={(e) => handleEndSlotChange(e.target.value)}
              >
                {END_SLOTS.map((slot, i) => {
                  const hour = i + 1;
                  // Block if hour is less than or equal to current start hour OR if range [currentStartHour, hour] overlaps
                  const isPast = hour <= currentStartHour;
                  const occupied = !isPast && isSlotOccupied(currentStartHour, hour);
                  const disabled = isPast || occupied;
                  return (
                    <option key={slot} value={slot} disabled={disabled} className={disabled ? "text-muted-foreground bg-muted/30" : ""}>
                      {slot} {occupied ? "(Booked)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer"
            >
              {bookingToEdit ? "Save Changes" : "Book Studio"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
