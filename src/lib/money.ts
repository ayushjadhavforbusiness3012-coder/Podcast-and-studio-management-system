import type { Booking, Invoice } from "@/contexts/AppContext";

export function parseCurrencyValue(value: string | number | undefined | null) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const numeric = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function currencySymbol(currency?: string) {
  if (!currency) return "₹";
  if (currency.includes("USD") || currency.includes("$")) return "$";
  if (currency.includes("GBP") || currency.includes("£")) return "£";
  if (currency.includes("EUR") || currency.includes("€")) return "€";
  return "₹";
}

export function formatCurrency(value: number, symbol = "₹") {
  return `${symbol}${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
}

export function clampPaidAmount(paid: number, total: number) {
  return Math.min(Math.max(0, Math.round(paid)), Math.max(0, Math.round(total)));
}

export function paidAmountForStatus(status: string, paidAmount: string | undefined, totalAmount: string) {
  const total = parseCurrencyValue(totalAmount);
  if (status === "Paid") return total;
  if (status === "Partially Paid") return clampPaidAmount(parseCurrencyValue(paidAmount), total);
  return 0;
}

export function bookingRevenue(booking: Pick<Booking, "paymentStatus" | "paidAmount" | "amt">) {
  return paidAmountForStatus(booking.paymentStatus, booking.paidAmount, booking.amt);
}

export function invoiceRevenue(invoice: Pick<Invoice, "status" | "paidAmount" | "amount">) {
  return paidAmountForStatus(invoice.status, invoice.paidAmount, invoice.amount);
}

export function totalRevenue(bookings: Pick<Booking, "paymentStatus" | "paidAmount" | "amt">[], invoices: Pick<Invoice, "status" | "paidAmount" | "amount">[]) {
  return bookings.reduce((sum, booking) => sum + bookingRevenue(booking), 0)
    + invoices.reduce((sum, invoice) => sum + invoiceRevenue(invoice), 0);
}
