import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Invoice } from "@/contexts/AppContext";
import { toast } from "sonner";
import { clampPaidAmount, currencySymbol, formatCurrency, parseCurrencyValue } from "@/lib/money";
import { toYYYYMMDD, fromYYYYMMDD } from "@/lib/utils";

export function InvoiceFormDialog({
  open,
  onOpenChange,
  invoiceToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceToEdit?: Invoice;
}) {
  const { addInvoice, updateInvoice, settings } = useAppContext();
  const moneySymbol = currencySymbol(settings.payment.currency);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState("");
  const [date, setDate] = useState("");
  const [due, setDue] = useState("");
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState(() => formatCurrency(0));
  const [status, setStatus] = useState<Invoice["status"]>("Pending");
  const subtotal = parseCurrencyValue(amount);
  const taxAmount = Math.round(subtotal * (Number(settings.payment.taxRate) || 0) / 100);
  const totalAmount = subtotal + taxAmount;
  const finalAmount = formatCurrency(totalAmount, moneySymbol);

  useEffect(() => {
    if (open && invoiceToEdit) {
      setName(invoiceToEdit.name);
      setEmail(invoiceToEdit.email);
      setShow(invoiceToEdit.show);
      setDate(toYYYYMMDD(invoiceToEdit.date));
      setDue(toYYYYMMDD(invoiceToEdit.due));
      setAmount(invoiceToEdit.amount);
      setPaidAmount(invoiceToEdit.paidAmount ?? formatCurrency(0, moneySymbol));
      setStatus(invoiceToEdit.status);
    } else if (open) {
      setName("");
      setEmail("");
      setShow("");
      setDate(toYYYYMMDD(new Date().toISOString().split('T')[0]));
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      setDue(toYYYYMMDD(dueDate.toISOString().split('T')[0]));
      setAmount("");
      setPaidAmount(formatCurrency(0, moneySymbol));
      setStatus("Pending");
    }
  }, [open, invoiceToEdit, moneySymbol]);

  useEffect(() => {
    if (status === "Paid") {
      setPaidAmount(formatCurrency(totalAmount, moneySymbol));
    } else if (status === "Pending" || status === "Overdue" || status === "Refunded") {
      setPaidAmount(formatCurrency(0, moneySymbol));
    } else {
      setPaidAmount(formatCurrency(clampPaidAmount(parseCurrencyValue(paidAmount), totalAmount), moneySymbol));
    }
  }, [status, amount, totalAmount, moneySymbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
      toast.error("Please fill in required fields.");
      return;
    }
    const normalizedPaidAmount = formatCurrency(
      status === "Paid"
        ? totalAmount
        : status === "Partially Paid"
          ? clampPaidAmount(parseCurrencyValue(paidAmount), totalAmount)
          : 0,
      moneySymbol
    );

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, {
        name,
        email,
        show,
        date: fromYYYYMMDD(date),
        due: fromYYYYMMDD(due),
        amount: finalAmount,
        paidAmount: normalizedPaidAmount,
        status,
      });
      toast.success("Invoice updated successfully!");
    } else {
      addInvoice({
        name,
        email,
        show,
        date: fromYYYYMMDD(date),
        due: fromYYYYMMDD(due),
        amount: finalAmount,
        paidAmount: normalizedPaidAmount,
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
                type="date"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                title="Invoice Date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="invoice-due">Due Date</label>
              <input
                id="invoice-due"
                type="date"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                title="Due Date"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="invoice-amount">Amount Before Tax *</label>
              <input
                id="invoice-amount"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder={`${moneySymbol}5,000`}
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
                <option value="Partially Paid">Partially Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Tax {settings.payment.taxRate}%: {formatCurrency(taxAmount, moneySymbol)} · Invoice total: <span className="font-semibold text-foreground">{finalAmount}</span>
          </div>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Enabled payment methods: {[
              settings.payment.stripeEnabled ? "Stripe" : "",
              settings.payment.paypalEnabled ? "PayPal" : "",
            ].filter(Boolean).join(", ") || "offline/manual only"}.
          </div>
          {status === "Partially Paid" && (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="invoice-paid-amount">Paid Amount</label>
              <input
                id="invoice-paid-amount"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                onBlur={() => setPaidAmount(formatCurrency(clampPaidAmount(parseCurrencyValue(paidAmount), totalAmount), moneySymbol))}
                title="Paid Amount"
              />
            </div>
          )}
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
