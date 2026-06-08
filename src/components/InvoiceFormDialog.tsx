import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
          <DialogDescription className="sr-only">Form to create or edit an invoice.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="invoice-guest">Guest / Client Name *</label>
            <input
              id="invoice-guest"
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. Rahul Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              title="Guest / Client Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="invoice-email">Email</label>
            <input
              id="invoice-email"
              type="email"
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              title="Email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="invoice-show">Booking / Episode</label>
            <input
              id="invoice-show"
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. Tech Talk"
              value={show}
              onChange={(e) => setShow(e.target.value)}
              title="Booking / Episode"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="invoice-date">Invoice Date</label>
              <input
                id="invoice-date"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="DD MMM YYYY"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                title="Invoice Date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="invoice-due">Due Date</label>
              <input
                id="invoice-due"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="DD MMM YYYY"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                title="Due Date"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="invoice-amount">Amount *</label>
              <input
                id="invoice-amount"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="₹5,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                title="Amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="invoice-status">Status</label>
              <select
                id="invoice-status"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as Invoice["status"])}
                title="Select Status"
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
