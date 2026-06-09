import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { type Invoice } from "@/contexts/AppContext";
import { Badge } from "@/components/DashboardLayout";
import { Download, Mail, Printer } from "lucide-react";
import { toast } from "sonner";

export function InvoiceDetailsDialog({
  open,
  onOpenChange,
  invoice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}) {
  if (!invoice) return null;

  const statusVariant: Record<string, any> = { Paid: "success", Pending: "warning", "Partially Paid": "info", Overdue: "destructive", Refunded: "default" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between mt-2">
            <DialogTitle>Invoice Details</DialogTitle>
            <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
          </div>
          <DialogDescription className="sr-only">Detailed invoice information.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <div className="text-xs text-muted-foreground">Invoice ID</div>
              <div className="font-semibold text-lg">{invoice.id}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="font-semibold text-xl text-primary">{invoice.amount}</div>
              <div className="text-xs text-muted-foreground mt-1">Paid: {invoice.paidAmount}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Billed To</div>
              <div className="flex items-center gap-2">
                <img src={`https://i.pravatar.cc/64?img=${invoice.img}`} className="size-8 rounded-full" alt="" />
                <div>
                  <div className="font-medium text-sm">{invoice.name}</div>
                  <div className="text-xs text-muted-foreground">{invoice.email}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Booking / Show</div>
              <div className="font-medium text-sm">{invoice.show}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Invoice Date</div>
              <div className="text-sm font-medium">{invoice.date}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Due Date</div>
              <div className="text-sm font-medium">{invoice.due}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => toast.success("Invoice sent to email")}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-accent inline-flex items-center gap-1.5"
            >
              <Mail className="size-4" /> Email
            </button>
            <button
              onClick={() => toast.success("Printing invoice...")}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-accent inline-flex items-center gap-1.5"
            >
              <Printer className="size-4" /> Print
            </button>
          </div>
          <button
            onClick={() => {
              toast.success("Downloading PDF...");
              onOpenChange(false);
            }}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 inline-flex items-center gap-1.5"
          >
            <Download className="size-4" /> Download PDF
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
