import { createFileRoute } from "@tanstack/react-router";
import { useAppContext, type Booking, type Invoice } from "@/contexts/AppContext";
import { currencySymbol, formatCurrency, invoiceRevenue, bookingRevenue, parseCurrencyValue, totalRevenue as calculateTotalRevenue } from "@/lib/money";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { Wallet, FileText, Clock, XCircle, Plus, Search, Filter, RotateCcw, Eye, Download, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { InvoiceFormDialog } from "@/components/InvoiceFormDialog";
import { InvoiceDetailsDialog } from "@/components/InvoiceDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments — Podcast Studio" }] }),
  component: Payments,
});

const statusVariant: Record<string, any> = { Paid: "success", Pending: "warning", "Partially Paid": "info", Overdue: "destructive", Refunded: "default", Unpaid: "warning" };

type PaymentLedgerRow =
  | { source: "Booking"; id: string; name: string; email: string; show: string; date: string; due: string; amount: string; paidAmount: string; status: Booking["paymentStatus"]; img: number; raw: Booking }
  | { source: "Invoice"; id: string; name: string; email: string; show: string; date: string; due: string; amount: string; paidAmount: string; status: Invoice["status"]; img: number; raw: Invoice };

function percentOf(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function Donut({ paidPercent, pendingPercent, overduePercent }: { paidPercent: number; pendingPercent: number; overduePercent: number }) {
  const segments = [
    { color: "#22c55e", val: paidPercent },
    { color: "#eab308", val: pendingPercent },
    { color: "#ef4444", val: overduePercent },
  ];
  let offset = 0;
  const r = 60, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 160 160" className="w-44 h-44 -rotate-90">
      <circle cx="80" cy="80" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
      {segments.map((s, i) => {
        const len = (s.val / 100) * c;
        const dash = `${len} ${c - len}`;
        const el = <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={dash} strokeDashoffset={-offset} />;
        offset += len;
        return el;
      })}
    </svg>
  );
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Payments() {
  const { bookings, invoices, settings, deleteInvoice, formatDate } = useAppContext();
  const moneySymbol = currencySymbol(settings.payment.currency);

  const [searchQuery, setSearchQuery] = useState("");
  const [overviewMonth, setOverviewMonth] = useState("May");
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Filter and pagination states
  const [tempStatus, setTempStatus] = useState("All Status");
  const [tempDate, setTempDate] = useState("");

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [targetDate, setTargetDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEdit = (i: Invoice) => {
    setSelectedInvoice(i);
    setFormOpen(true);
  };

  const handleView = (i: Invoice) => {
    setSelectedInvoice(i);
    setDetailsOpen(true);
  };

  const handleNew = () => {
    setSelectedInvoice(null);
    setFormOpen(true);
  };

  const ledgerRows = useMemo<PaymentLedgerRow[]>(() => [
    ...bookings.map((booking) => ({
      source: "Booking" as const,
      id: booking.id,
      name: booking.guest,
      email: "",
      show: `${booking.pkg} · ${booking.studio}`,
      date: booking.date,
      due: booking.date,
      amount: booking.amt,
      paidAmount: booking.paidAmount,
      status: booking.paymentStatus,
      img: booking.guest.length + 10,
      raw: booking,
    })),
    ...invoices.map((invoice) => ({
      source: "Invoice" as const,
      id: invoice.id,
      name: invoice.name,
      email: invoice.email,
      show: invoice.show,
      date: invoice.date,
      due: invoice.due,
      amount: invoice.amount,
      paidAmount: invoice.paidAmount,
      status: invoice.status,
      img: invoice.img,
      raw: invoice,
    })),
  ], [bookings, invoices]);

  const filteredInvoices = useMemo(() => {
    return ledgerRows.filter((i) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.show.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All Status" || i.status === statusFilter;
      
      let matchesDate = true;
      if (targetDate) {
        try {
          const iDate = new Date(i.date);
          const fDate = new Date(targetDate);
          matchesDate = iDate.getFullYear() === fDate.getFullYear() &&
                        iDate.getMonth() === fDate.getMonth() &&
                        iDate.getDate() === fDate.getDate();
        } catch {
          matchesDate = false;
        }
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [ledgerRows, searchQuery, statusFilter, targetDate]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  const monthIndex = months.indexOf(overviewMonth);
  const overviewInvoices = useMemo(
    () => ledgerRows.filter((row) => new Date(row.date).getMonth() === monthIndex),
    [ledgerRows, monthIndex]
  );
  const paidAmount = calculateTotalRevenue(bookings, invoices);
  const pendingAmount = ledgerRows.filter((row) => row.status === "Pending" || row.status === "Unpaid").reduce((sum, row) => sum + parseCurrencyValue(row.amount), 0);
  const overdueAmount = invoices.filter((invoice) => invoice.status === "Overdue").reduce((sum, invoice) => sum + parseCurrencyValue(invoice.amount), 0);
  const overviewPaidAmount = overviewInvoices.reduce((sum, row) => sum + (row.source === "Booking" ? bookingRevenue(row.raw) : invoiceRevenue(row.raw)), 0);
  const overviewPendingAmount = overviewInvoices.filter((row) => row.status === "Pending" || row.status === "Unpaid").reduce((sum, row) => sum + parseCurrencyValue(row.amount), 0);
  const overviewOverdueAmount = overviewInvoices.filter((row) => row.status === "Overdue").reduce((sum, row) => sum + parseCurrencyValue(row.amount), 0);
  const overviewTotalAmount = overviewPaidAmount + overviewPendingAmount + overviewOverdueAmount;
  const recentTransactions = ledgerRows
    .filter((row) => parseCurrencyValue(row.paidAmount) > 0 || row.status === "Refunded")
    .slice(0, 4);

  const handleApplyFilters = () => {
    setStatusFilter(tempStatus);
    setTargetDate(tempDate);
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setTempStatus("All Status");
    setTempDate("");
    setStatusFilter("All Status");
    setTargetDate("");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("Filters reset");
  };

  return (
    <DashboardLayout
      title="Payments & Invoices"
      subtitle="Track payments, invoices and transactions"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search payments..."
              className="h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button 
            onClick={() => setExportOpen(true)}
            className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-2 hover:bg-muted transition-colors cursor-pointer"
          >
            <Download className="size-4" /> Export
          </button>
          <button 
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 cursor-pointer" 
            onClick={handleNew}
          >
            <Plus className="size-4" /> New Invoice
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Total Revenue" value={formatCurrency(paidAmount, moneySymbol)} trend="Paid bookings and invoices" tone="primary" />
        <StatCard icon={FileText} label="Paid Amount" value={formatCurrency(paidAmount, moneySymbol)} trend="Collected" tone="success" />
        <StatCard icon={Clock} label="Pending Amount" value={formatCurrency(pendingAmount, moneySymbol)} trend="Awaiting payment" tone="warning" />
        <StatCard icon={XCircle} label="Overdue Amount" value={formatCurrency(overdueAmount, moneySymbol)} trend="Needs attention" trendType="down" tone="destructive" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl">
            <div className="flex border-b border-border px-5">
              <button className="px-4 py-3 border-b-2 border-primary text-primary font-medium text-sm">Payments Ledger</button>
              <button className="px-4 py-3 text-muted-foreground text-sm hover:text-foreground">Transactions</button>
            </div>
            {/* Consolidated 3-column filter row */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs text-muted-foreground font-semibold" htmlFor="filter-status">Status</label>
                <select 
                  id="filter-status"
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={tempStatus}
                  onChange={(e) => {
                    setTempStatus(e.target.value);
                  }}
                  title="Status"
                >
                  <option value="All Status">All Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold" htmlFor="filter-date">Date</label>
                <input 
                  id="filter-date"
                  type="date"
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={tempDate}
                  onChange={(e) => {
                    setTempDate(e.target.value);
                  }}
                  title="Select date"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleApplyFilters} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-sm"><Filter className="size-4" /> Filter</button>
                <button 
                  onClick={handleReset} 
                  className="h-10 w-10 rounded-lg border border-border grid place-items-center text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
                  title="Reset Filters"
                  aria-label="Reset Filters"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 text-left font-semibold">Payment ID</th>
                    <th className="p-4 text-left font-semibold">Guest / Client</th>
                    <th className="p-4 text-left font-semibold">Booking / Episode</th>
                    <th className="p-4 text-left font-semibold">Invoice Date</th>
                    <th className="p-4 text-left font-semibold">Due Date</th>
                    <th className="p-4 text-left font-semibold">Amount</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                {paginatedInvoices.map((i) => {
                  let statusBorderClass = "border-l-4 border-l-transparent";
                  if (i.status === "Paid") statusBorderClass = "border-l-4 border-l-success";
                  else if (i.status === "Pending" || i.status === "Unpaid") statusBorderClass = "border-l-4 border-l-warning";
                  else if (i.status === "Partially Paid") statusBorderClass = "border-l-4 border-l-info";
                  else if (i.status === "Overdue") statusBorderClass = "border-l-4 border-l-destructive";
                  else if (i.status === "Refunded") statusBorderClass = "border-l-4 border-l-muted-foreground";

                  return (
                    <tr key={i.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className={`p-4 font-medium ${statusBorderClass}`}>
                        <span className="font-medium text-primary ml-1">{i.id}</span>
                        <div className="text-[10px] text-muted-foreground ml-1">{i.source}</div>
                      </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img src={`https://i.pravatar.cc/64?img=${i.img}`} className="size-8 rounded-full" alt="" />
                        <div>
                          <div className="font-medium">{i.name}</div>
                          <div className="text-xs text-muted-foreground">{i.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{i.show}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(i.date)}</div>
                    </td>
                    <td className="p-4">{formatDate(i.date)}</td>
                    <td className="p-4">{formatDate(i.due)}</td>
                    <td className="p-4 font-semibold text-foreground">
                      {i.amount}
                      <div className="text-[10px] text-muted-foreground">Paid {i.paidAmount}</div>
                    </td>
                    <td className="p-4"><Badge variant={statusVariant[i.status]}>{i.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-accent cursor-pointer" title="Action Menu" aria-label="Action Menu"><MoreVertical className="size-4" /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {i.source === "Invoice" ? (
                              <>
                                <DropdownMenuItem onClick={() => handleView(i.raw)}><Eye className="mr-2 size-4" /> View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(i.raw)}><Pencil className="mr-2 size-4" /> Edit Invoice</DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => toast.info("Edit booking payments from the Bookings page.")}><Eye className="mr-2 size-4" /> Booking Payment</DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => toast.success("Invoice downloaded as PDF")}><Download className="mr-2 size-4" /> Download</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => {
                                if (i.source === "Invoice") {
                                  deleteInvoice(i.id);
                                  toast.success("Invoice deleted");
                                } else {
                                  toast.info("Delete booking payments from the Bookings page.");
                                }
                              }}
                            >
                              <Trash2 className="mr-2 size-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No payments found matching "{searchQuery}".
                </div>
              )}
            </div>
            {/* Repaired dynamic numerical footer navigation */}
            <div className="flex items-center justify-between p-4 text-sm border-t border-border flex-wrap gap-2">
              <div className="text-muted-foreground font-medium">
                Showing {Math.min(filteredInvoices.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredInvoices.length, currentPage * itemsPerPage)} of {filteredInvoices.length} payments
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="First page" aria-label="First page"><ChevronsLeft className="size-4" /></button>
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="Previous page" aria-label="Previous page"><ChevronLeft className="size-4" /></button>
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`size-8 rounded-md text-xs font-semibold cursor-pointer ${
                      currentPage === p
                        ? "bg-primary text-primary-foreground font-bold"
                        : "border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    title={`Page ${p}`}
                    aria-label={`Page ${p}`}
                  >
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="Next page" aria-label="Next page"><ChevronRight className="size-4" /></button>
                <button onClick={() => setCurrentPage(totalPages || 1)} disabled={currentPage === totalPages || totalPages === 0} className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer" title="Last page" aria-label="Last page"><ChevronsRight className="size-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Un-crammed and expanded Payment Overview card layout */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Payment Overview</h3>
              <select
                value={overviewMonth}
                onChange={(e) => {
                  setOverviewMonth(e.target.value);
                  toast.info(`Showing Payment Overview for ${e.target.value}`);
                }}
                className="text-xs border border-border rounded-md px-2 py-1 bg-card cursor-pointer focus:outline-none"
                title="Select month"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative shrink-0 mb-6">
                <Donut
                  paidPercent={percentOf(overviewPaidAmount, overviewTotalAmount)}
                  pendingPercent={percentOf(overviewPendingAmount, overviewTotalAmount)}
                  overduePercent={percentOf(overviewOverdueAmount, overviewTotalAmount)}
                />
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="text-lg font-bold text-foreground">{formatCurrency(overviewTotalAmount, moneySymbol)}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Invoiced</div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-3 border-t border-border pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-success" />
                    <span className="font-medium text-muted-foreground">Paid</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(overviewPaidAmount, moneySymbol)}<span className="text-xs font-normal text-muted-foreground ml-1.5">({percentOf(overviewPaidAmount, overviewTotalAmount)}%)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-warning" />
                    <span className="font-medium text-muted-foreground">Pending</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(overviewPendingAmount, moneySymbol)}<span className="text-xs font-normal text-muted-foreground ml-1.5">({percentOf(overviewPendingAmount, overviewTotalAmount)}%)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-destructive" />
                    <span className="font-medium text-muted-foreground">Overdue</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(overviewOverdueAmount, moneySymbol)}<span className="text-xs font-normal text-muted-foreground ml-1.5">({percentOf(overviewOverdueAmount, overviewTotalAmount)}%)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent Transactions</h3>
              <a className="text-xs text-primary hover:underline cursor-pointer">View All</a>
            </div>
            <div className="space-y-3 text-sm">              {recentTransactions.map((t) => {
                const Ic = t.status === "Paid" || t.status === "Partially Paid" ? ArrowUp : t.status === "Pending" || t.status === "Unpaid" ? Clock : ArrowDown;
                const color = t.status === "Paid" || t.status === "Partially Paid" ? "text-success" : t.status === "Pending" || t.status === "Unpaid" ? "text-warning" : "text-destructive";
                const title = t.status === "Paid"
                  ? `Payment received from ${t.name}`
                  : t.status === "Partially Paid"
                    ? `Partial payment received from ${t.name}`
                    : t.status === "Refunded"
                      ? `Payment refunded for ${t.name}`
                      : t.status === "Overdue"
                        ? `Payment overdue from ${t.name}`
                        : `Payment pending from ${t.name}`;
                return (
                  <div key={t.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className={`size-8 rounded-full bg-muted grid place-items-center ${color}`}><Ic className="size-4" /></div>
                    <div className="flex-1">
                      <div className="text-xs">{title}</div>
                      <div className="text-[10px] text-muted-foreground">{t.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{t.amount}</div>
                      <div className="text-[10px] text-muted-foreground">{formatDate(t.date)}</div>
                    </div>
                  </div>
                );
              })}
              {recentTransactions.length === 0 && (
                <div className="py-6 text-center text-xs text-muted-foreground">No transactions yet</div>
              )}
            </div>
          </div>

          <button onClick={() => toast.success("Downloading report...")} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-90"><Download className="size-4" /> Download Report</button>
        </div>
      </div>

      <InvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} invoiceToEdit={selectedInvoice || undefined} />
      <InvoiceDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} invoice={selectedInvoice} />

      {/* Export Payments Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Export Payments</DialogTitle>
            <DialogDescription>Select your preferred format for the exported payments list.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => {
                setExportOpen(false);
                toast.success("Preparing PDF print layout...");
                setTimeout(() => {
                  window.print();
                }, 500);
              }}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 cursor-pointer transition-all bg-transparent"
            >
              <FileText className="size-8 text-primary mb-2" />
              <span className="font-semibold text-sm">Print / PDF</span>
              <span className="text-[10px] text-muted-foreground mt-1 text-center">Print layout optimized for paper or PDF</span>
            </button>
            <button
              onClick={() => {
                setExportOpen(false);
                let csvContent = "data:text/csv;charset=utf-8," 
                  + "Invoice ID,Client Name,Email,Show Name,Invoice Date,Due Date,Amount,Status\n";
                
                filteredInvoices.forEach((inv) => {
                  const row = [
                    inv.id,
                    `"${inv.name.replace(/"/g, '""')}"`,
                    inv.email,
                    `"${inv.show.replace(/"/g, '""')}"`,
                    inv.date,
                    inv.due,
                    `"${inv.amount.replace(/"/g, '""')}"`,
                    inv.status
                  ].join(",");
                  csvContent += row + "\n";
                });
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Payments CSV downloaded successfully!");
              }}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 cursor-pointer transition-all bg-transparent"
            >
              <Download className="size-8 text-success mb-2" />
              <span className="font-semibold text-sm">Spreadsheet (CSV)</span>
              <span className="text-[10px] text-muted-foreground mt-1 text-center">Export raw payments for Excel / Google Sheets</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
