import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Episode } from "@/contexts/AppContext";
import { toast } from "sonner";

// Standard 1-hour time slots
const START_SLOTS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const END_SLOTS = Array.from({ length: 24 }, (_, i) => `${String(i + 1).padStart(2, "0")}:00`);

export function EpisodeFormDialog({
  open,
  onOpenChange,
  episodeToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  episodeToEdit?: Episode;
}) {
  const { addEpisode, updateEpisode } = useAppContext();

  const [title, setTitle] = useState("");
  const [show, setShow] = useState("Podcast Studio");
  const [guest, setGuest] = useState("");
  const [date, setDate] = useState("");
  const [startSlot, setStartSlot] = useState("09:00");
  const [endSlot, setEndSlot] = useState("10:00");
  const [status, setStatus] = useState<Episode["status"]>("Draft");

  // Backend length calculator to automatically compute duration
  const startHour = parseInt(startSlot.split(":")[0], 10);
  const endHour = parseInt(endSlot.split(":")[0], 10);
  const diff = endHour - startHour;
  const calculatedDur = diff > 0 ? `${String(diff).padStart(2, "0")}:00` : "01:00";

  useEffect(() => {
    if (open && episodeToEdit) {
      setTitle(episodeToEdit.title);
      setShow(episodeToEdit.show);
      setGuest(episodeToEdit.guest);
      setDate(episodeToEdit.date);
      setStatus(episodeToEdit.status);
      
      // Parse compiled time string
      if (episodeToEdit.time && episodeToEdit.time.includes("to")) {
        const parts = episodeToEdit.time.split("to").map(s => s.trim());
        setStartSlot(parts[0]);
        setEndSlot(parts[1]);
      } else {
        setStartSlot("09:00");
        setEndSlot("10:00");
      }
    } else if (open) {
      setTitle("");
      setShow("Podcast Studio");
      setGuest("");
      setDate("");
      setStartSlot("09:00");
      setEndSlot("10:00");
      setStatus("Draft");
    }
  }, [open, episodeToEdit]);

  const handleStartSlotChange = (val: string) => {
    setStartSlot(val);
    const sh = parseInt(val.split(":")[0], 10);
    const eh = parseInt(endSlot.split(":")[0], 10);
    if (eh <= sh) {
      setEndSlot(`${String(sh + 1).padStart(2, "0")}:00`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please provide an episode title.");
      return;
    }

    const compiledTimeStr = `${startSlot} to ${endSlot}`;

    if (episodeToEdit) {
      updateEpisode(episodeToEdit.id, {
        title, show, guest, dur: calculatedDur, date, time: compiledTimeStr, status
      });
      toast.success("Episode updated successfully!");
    } else {
      addEpisode({
        title, show, guest: guest || "Admin", dur: calculatedDur, date: date || "—", time: compiledTimeStr, status
      });
      toast.success("New episode created successfully!");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{episodeToEdit ? "Edit Episode" : "New Episode"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Episode Title *</label>
            <input
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. The Future of AI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Show / Series</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={show}
                onChange={(e) => setShow(e.target.value)}
              >
                <option>Podcast Studio</option>
                <option>Tech Talk</option>
                <option>Marketing Minds</option>
                <option>Founders Hub</option>
                <option>Finance Simplified</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Guest</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Rahul Verma"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="15 May 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm opacity-65 cursor-not-allowed"
                value={calculatedDur}
                disabled={true}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Starting Time Slot</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={startSlot}
                onChange={(e) => handleStartSlotChange(e.target.value)}
              >
                {START_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ending Time Slot</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={endSlot}
                onChange={(e) => setEndSlot(e.target.value)}
              >
                {END_SLOTS.map((slot) => (
                  <option key={slot} value={slot} disabled={parseInt(slot.split(":")[0], 10) <= startHour}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={status}
              onChange={(e) => setStatus(e.target.value as Episode["status"])}
            >
              <option>Published</option>
              <option>Scheduled</option>
              <option>Draft</option>
              <option>Archived</option>
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
              {episodeToEdit ? "Save Changes" : "Save Episode"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
