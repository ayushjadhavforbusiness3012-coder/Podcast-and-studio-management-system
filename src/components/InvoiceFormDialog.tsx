import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Invoice } from "@/contexts/AppContext";
import { toast } from "sonner";

export function InvoiceFormDialog({
  open,
  onOpenChange,
  invoiceToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceToEdit?: Invoice;
}) {
  const { addInvoice, updateInvoice } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState("");
  const [date, setDate] = useState("");
  const [due, setDue] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Invoice["status"]>("Pending");

  useEffect(() => {
    if (open && invoiceToEdit) {
      setName(invoiceToEdit.name);
      setEmail(invoiceToEdit.email);
      setShow(invoiceToEdit.show);
      setDate(invoiceToEdit.date);
      setDue(invoiceToEdit.due);
      setAmount(invoiceToEdit.amount);
      setStatus(invoiceToEdit.status);
    } else if (open) {
      setName("");
      setEmail("");
      setShow("");
      setDate(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      setDue(dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
      setAmount("");
      setStatus("Pending");
    }
  }, [open, invoiceToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
      toast.error("Please fill in required fields.");
      return;
    }

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, {
        name,
        email,
        show,
        date,
        due,
        amount,
        status,
      });
      toast.success("Invoice updated successfully!");
    } else {
      addInvoice({
        name,
        email,
        show,
        date,
        due,
        amount,
        status,
      });
      toast.success("New invoice created successfully!");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{invoiceToEdit ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Guest / Client Name *</label>
            <input
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. Rahul Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Booking / Episode</label>
            <input
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. Tech Talk"
              value={show}
              onChange={(e) => setShow(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Invoice Date</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount *</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="₹5,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as Invoice["status"])}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
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
              {invoiceToEdit ? "Save Changes" : "Create Invoice"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
