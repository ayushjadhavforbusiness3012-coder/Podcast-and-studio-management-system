import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Episode } from "@/contexts/AppContext";
import { Badge } from "@/components/DashboardLayout";
import { Mic2, Clock, CalendarDays } from "lucide-react";

export function EpisodeDetailsDialog({
  episode,
  open,
  onOpenChange,
}: {
  episode: Episode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!episode) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Episode Details</DialogTitle>
          <DialogDescription className="sr-only">Detailed info for the selected episode</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center gap-4">
            <div className={`size-16 rounded-xl ${episode.color} grid place-items-center text-white relative shadow-sm`}>
              <Mic2 className="size-6" />
              <span className="absolute bottom-1 right-1 text-[9px] bg-black/40 px-1 rounded">EP #{episode.ep}</span>
            </div>
            <div>
              <div className="text-lg font-bold leading-tight">{episode.title}</div>
              <div className="text-sm text-muted-foreground">{episode.show}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <Badge variant={episode.sv}>{episode.status}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="font-medium text-sm flex items-center gap-1"><Clock className="size-3" /> {episode.dur}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Guest</div>
              <div className="font-medium text-sm flex items-center gap-2">
                <img src={`https://i.pravatar.cc/64?img=${episode.img}`} className="size-5 rounded-full" alt="" />
                {episode.guest}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Recording Date</div>
              <div className="font-medium text-sm flex items-center gap-1"><CalendarDays className="size-3" /> {episode.date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Published Date</div>
              <div className="font-medium text-sm">{episode.publishedDate || "—"}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
