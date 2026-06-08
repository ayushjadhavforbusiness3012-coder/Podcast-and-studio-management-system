import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Booking } from "@/contexts/AppContext";
import { Badge } from "@/components/DashboardLayout";

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Details - {booking.id}</DialogTitle>
          <DialogDescription className="sr-only">Detailed info for booking {booking.id}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Guest Name</div>
              <div className="font-medium">{booking.guest}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <Badge variant={booking.sv}>{booking.status}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Studio</div>
              <div className="font-medium">{booking.studio}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Package</div>
              <div className="font-medium">{booking.pkg}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Date</div>
              <div className="font-medium">{booking.date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Time</div>
              <div className="font-medium">{booking.time}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Amount</div>
              <div className="font-medium text-primary">{booking.amt}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
