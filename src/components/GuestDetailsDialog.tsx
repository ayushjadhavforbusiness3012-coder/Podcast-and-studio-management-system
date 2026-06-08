import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Guest } from "@/contexts/AppContext";
import { Badge } from "@/components/DashboardLayout";

export function GuestDetailsDialog({
  guest,
  open,
  onOpenChange,
}: {
  guest: Guest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!guest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Guest Profile</DialogTitle>
          <DialogDescription className="sr-only">Detailed profile info for guest</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center gap-4">
            <img src={`https://i.pravatar.cc/64?img=${guest.img}`} className="size-16 rounded-full object-cover border border-border" alt="" />
            <div>
              <div className="text-xl font-bold">{guest.name}</div>
              <Badge variant={guest.status === "Active" ? "success" : "destructive"}>{guest.status}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Email</div>
              <div className="font-medium text-sm break-all">{guest.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Phone</div>
              <div className="font-medium text-sm">{guest.phone || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Expertise / Topic</div>
              <div className="font-medium text-sm">{guest.topic || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Joined On</div>
              <div className="font-medium text-sm">{guest.date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Bookings</div>
              <div className="font-medium text-primary text-xl">{guest.bookings}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
