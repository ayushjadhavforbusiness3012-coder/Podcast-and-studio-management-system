import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Episode } from "@/contexts/AppContext";
import { toast } from "sonner";

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
  const [dur, setDur] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<Episode["status"]>("Draft");

  useEffect(() => {
    if (open && episodeToEdit) {
      setTitle(episodeToEdit.title);
      setShow(episodeToEdit.show);
      setGuest(episodeToEdit.guest);
      setDur(episodeToEdit.dur);
      setDate(episodeToEdit.date);
      setTime(episodeToEdit.time);
      setStatus(episodeToEdit.status);
    } else if (open) {
      setTitle("");
      setShow("Podcast Studio");
      setGuest("");
      setDur("");
      setDate("");
      setTime("");
      setStatus("Draft");
    }
  }, [open, episodeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please provide an episode title.");
      return;
    }

    if (episodeToEdit) {
      updateEpisode(episodeToEdit.id, {
        title, show, guest, dur, date, time, status
      });
      toast.success("Episode updated successfully!");
    } else {
      addEpisode({
        title, show, guest: guest || "Admin", dur: dur || "00:00", date: date || "—", time, status
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
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. The Future of AI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Show / Series</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
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
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
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
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="15 May 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="02:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="45:30"
                value={dur}
                onChange={(e) => setDur(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as Episode["status"])}
              >
                <option>Published</option>
                <option>Scheduled</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>
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
              {episodeToEdit ? "Save Changes" : "Save Episode"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
