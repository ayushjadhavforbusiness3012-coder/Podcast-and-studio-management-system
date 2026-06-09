import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Episode } from "@/contexts/AppContext";
import { toast } from "sonner";
import { toYYYYMMDD, fromYYYYMMDD } from "@/lib/utils";

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
  const { addEpisode, updateEpisode, settings } = useAppContext();

  const [title, setTitle] = useState("");
  const [show, setShow] = useState(settings.studio.name);
  const [guest, setGuest] = useState("");
  const [date, setDate] = useState("");
  const [startSlot, setStartSlot] = useState("09:00");
  const [endSlot, setEndSlot] = useState("10:00");
  const [status, setStatus] = useState<Episode["status"]>("Draft");
  const [publishedDate, setPublishedDate] = useState("");

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
      setDate(toYYYYMMDD(episodeToEdit.date));
      setPublishedDate(toYYYYMMDD(episodeToEdit.publishedDate || ""));
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
      setShow(settings.studio.name);
      setGuest("");
      setDate("");
      setStartSlot("09:00");
      setEndSlot("10:00");
      const defaultStatus = (["Published", "Scheduled", "Draft", "Archived"].includes(settings.booking.defaultStatus) ? settings.booking.defaultStatus : "Draft") as Episode["status"];
      setStatus(defaultStatus);
      setPublishedDate(defaultStatus === "Published" ? new Date().toISOString().slice(0, 10) : "");
    }
  }, [open, episodeToEdit, settings.booking.defaultStatus, settings.studio.name]);

  useEffect(() => {
    if (status === "Published" && !publishedDate) {
      setPublishedDate(new Date().toISOString().slice(0, 10));
    }
  }, [status, publishedDate]);

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
    const effectiveStatus = settings.booking.autoPublish && status === "Scheduled" ? "Published" : status;
    const effectivePublishedDate = effectiveStatus === "Published" && !publishedDate
      ? new Date().toISOString().slice(0, 10)
      : publishedDate;

    if (effectiveStatus === "Published" && !effectivePublishedDate) {
      toast.error("Published episodes need a published date.");
      return;
    }

    const compiledTimeStr = `${startSlot} to ${endSlot}`;

    const savedDate = date ? fromYYYYMMDD(date) : "—";

    if (episodeToEdit) {
      updateEpisode(episodeToEdit.id, {
        title, show, guest, dur: calculatedDur, date: savedDate, publishedDate: effectivePublishedDate ? fromYYYYMMDD(effectivePublishedDate) : "", time: compiledTimeStr, status: effectiveStatus
      });
      toast.success("Episode updated successfully!");
    } else {
      addEpisode({
        title, show, guest: guest || "Admin", dur: calculatedDur, date: savedDate, publishedDate: effectivePublishedDate ? fromYYYYMMDD(effectivePublishedDate) : "", time: compiledTimeStr, status: effectiveStatus
      });
      toast.success(effectiveStatus !== status ? "Episode auto-published from settings." : "New episode created successfully!");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{episodeToEdit ? "Edit Episode" : "New Episode"}</DialogTitle>
          <DialogDescription className="sr-only">Form to create or edit a podcast episode.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="episode-title">Episode Title *</label>
            <input
              id="episode-title"
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. The Future of AI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              title="Episode Title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="episode-show">Show / Series</label>
              <select
                id="episode-show"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={show}
                onChange={(e) => setShow(e.target.value)}
                title="Select Show / Series"
              >
                <option>{settings.studio.name}</option>
                <option>Tech Talk</option>
                <option>Marketing Minds</option>
                <option>Founders Hub</option>
                <option>Finance Simplified</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="episode-guest">Guest</label>
              <input
                id="episode-guest"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Rahul Verma"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                title="Guest Name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="episode-date">Date</label>
              <input
                id="episode-date"
                type="date"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                title="Date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="episode-duration">Duration</label>
              <input
                id="episode-duration"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm opacity-65 cursor-not-allowed"
                value={calculatedDur}
                disabled={true}
                placeholder="Calculated Duration"
                title="Calculated Duration"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="episode-start-slot">Starting Time Slot</label>
              <select
                id="episode-start-slot"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={startSlot}
                onChange={(e) => handleStartSlotChange(e.target.value)}
                title="Select Starting Time Slot"
              >
                {START_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="episode-end-slot">Ending Time Slot</label>
              <select
                id="episode-end-slot"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={endSlot}
                onChange={(e) => setEndSlot(e.target.value)}
                title="Select Ending Time Slot"
              >
                {END_SLOTS.map((slot) => (
                  <option key={slot} value={slot} disabled={parseInt(slot.split(":")[0], 10) <= startHour}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Studio features: {settings.booking.videoRecording ? "video recording on" : "audio only"}, {settings.booking.liveStreaming ? "live streaming on" : "live streaming off"}, {settings.booking.guestUploads ? "guest uploads on" : "guest uploads off"}.
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="episode-status">Status</label>
            <select
              id="episode-status"
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={status}
              onChange={(e) => setStatus(e.target.value as Episode["status"])}
              title="Select Status"
            >
              <option>Published</option>
              <option>Scheduled</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
          {settings.booking.autoPublish && status === "Scheduled" && (
            <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success-foreground">
              Auto Publish is enabled, so this scheduled episode will be saved as Published.
            </div>
          )}
          {status === "Published" && (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="episode-published-date">Published Date</label>
              <input
                id="episode-published-date"
                type="date"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                title="Published Date"
              />
            </div>
          )}
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
