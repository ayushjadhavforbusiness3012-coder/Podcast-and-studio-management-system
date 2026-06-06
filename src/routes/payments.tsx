import { createFileRoute } from "@tanstack/react-router";
import { useAppContext, type Invoice } from "@/contexts/AppContext";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { Wallet, FileText, Clock, XCircle, Plus, Search, Filter, RotateCcw, Eye, Download, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown, Calendar, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { InvoiceFormDialog } from "@/components/InvoiceFormDialog";
import { InvoiceDetailsDialog } from "@/components/InvoiceDetailsDialog";
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

const statusVariant: Record<string, any> = { Paid: "success", Pending: "warning", Overdue: "destructive" };

function Donut() {
  const segments = [
    { color: "#22c55e", val: 76 },
    { color: "#eab308", val: 17 },
    { color: "#ef4444", val: 7 },
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

function Payments() {
  const { invoices, deleteInvoice } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

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

  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter(
      (i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.show.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);

  return (
    <DashboardLayout
      title="Payments & Invoices"
      subtitle="Track payments, invoices and transactions"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              placeholder="Search invoices..." 
              className="h-10 w-72 rounded-lg border border-border bg-card pl-9 pr-3 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="size-10 rounded-lg border border-border bg-card grid place-items-center"><Calendar className="size-4" /></button>
          <button 
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90" 
            onClick={handleNew}
          >
            <Plus className="size-4" /> New Invoice
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Total Revenue" value="₹1,45,000" trend="↑ 24% from last month" tone="primary" />
        <StatCard icon={FileText} label="Paid Amount" value="₹1,10,000" trend="↑ 20% from last month" tone="success" />
        <StatCard icon={Clock} label="Pending Amount" value="₹25,000" trend="↑ 15% from last month" tone="warning" />
        <StatCard icon={XCircle} label="Overdue Amount" value="₹10,000" trend="↓ 8% from last month" trendType="down" tone="destructive" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl">
            <div className="flex border-b border-border px-5">
              <button className="px-4 py-3 border-b-2 border-primary text-primary font-medium text-sm">Invoices</button>
              <button className="px-4 py-3 text-muted-foreground text-sm hover:text-foreground">Transactions</button>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm"><option>All Status</option></select>
              <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm"><option>All Payment Methods</option></select>
              <div><label className="text-xs text-muted-foreground">From Date</label><input placeholder="Select date" className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" /></div>
              <div><label className="text-xs text-muted-foreground">To Date</label><input placeholder="Select date" className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" /></div>
              <div className="flex gap-2">
                <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5"><Filter className="size-4" /> Filter</button>
                <button className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5"><RotateCcw className="size-4" /> Reset</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 text-left font-medium">Invoice ID</th>
                    <th className="p-4 text-left font-medium">Guest / Client</th>
                    <th className="p-4 text-left font-medium">Booking / Episode</th>
                    <th className="p-4 text-left font-medium">Invoice Date</th>
                    <th className="p-4 text-left font-medium">Due Date</th>
                    <th className="p-4 text-left font-medium">Amount</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {filteredInvoices.map((i) => (
                  <tr key={i.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1 h-8 rounded ${i.bar}`} />
                        <span className="font-medium text-primary">{i.id}</span>
                      </div>
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
                      <div className="text-xs text-muted-foreground">{i.date}</div>
                    </td>
                    <td className="p-4">{i.date}</td>
                    <td className="p-4">{i.due}</td>
                    <td className="p-4 font-medium">{i.amount}</td>
                    <td className="p-4"><Badge variant={statusVariant[i.status]}>{i.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button className="size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors" onClick={() => handleView(i)}><Eye className="size-4" /></button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-accent"><MoreVertical className="size-4" /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(i)}><Eye className="mr-2 size-4" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(i)}><Pencil className="mr-2 size-4" /> Edit Invoice</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("Invoice downloaded as PDF")}><Download className="mr-2 size-4" /> Download</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => {
                                deleteInvoice(i.id);
                                toast.success("Invoice deleted");
                              }}
                            >
                              <Trash2 className="mr-2 size-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No invoices found matching "{searchQuery}".
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-4 text-sm border-t border-border">
              <div className="text-muted-foreground">Showing {filteredInvoices.length} invoices</div>
              <div className="flex items-center gap-1">
                <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronsLeft className="size-4" /></button>
                <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronLeft className="size-4" /></button>
                <button className="size-8 rounded-md bg-primary text-primary-foreground">1</button>
                <button className="size-8 rounded-md border border-border hover:bg-muted">2</button>
                <button className="size-8 rounded-md border border-border hover:bg-muted">3</button>
                <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronRight className="size-4" /></button>
                <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronsRight className="size-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Payment Overview</h3>
              <select className="text-xs border border-border rounded-md px-2 py-1 bg-card"><option>This Month</option></select>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Donut />
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="text-lg font-bold">₹1,45,000</div>
                    <div className="text-[10px] text-muted-foreground">Total Revenue</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-success" /><span className="flex-1">Paid</span><span className="font-medium">₹1,10,000 (76%)</span></div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-warning" /><span className="flex-1">Pending</span><span className="font-medium">₹25,000 (17%)</span></div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-destructive" /><span className="flex-1">Overdue</span><span className="font-medium">₹10,000 (7%)</span></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Payment Methods</h3>
              <select className="text-xs border border-border rounded-md px-2 py-1 bg-card"><option>This Month</option></select>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "UPI", amt: "₹70,000 (48%)", w: "48%", color: "bg-primary" },
                { label: "Card", amt: "₹40,000 (28%)", w: "28%", color: "bg-info" },
                { label: "Bank Transfer", amt: "₹25,000 (17%)", w: "17%", color: "bg-success" },
                { label: "Cash", amt: "₹10,000 (7%)", w: "7%", color: "bg-warning" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1 text-xs"><span>{m.label}</span><span className="font-medium">{m.amt}</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full ${m.color}`} style={{ width: m.w }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent Transactions</h3>
              <a className="text-xs text-primary hover:underline cursor-pointer">View All</a>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { icon: ArrowUp, color: "text-success", title: "Payment received from Rahul Verma", id: "INV-1008", amt: "₹3,000", date: "15 May 2025" },
                { icon: ArrowUp, color: "text-success", title: "Payment received from Amit Kumar", id: "INV-1006", amt: "₹3,000", date: "14 May 2025" },
                { icon: Clock, color: "text-warning", title: "Payment pending from Sneha Sharma", id: "INV-1007", amt: "₹2,500", date: "15 May 2025" },
                { icon: ArrowDown, color: "text-destructive", title: "Payment overdue from Neha Singh", id: "INV-1004", amt: "₹2,500", date: "10 May 2025" },
              ].map((t, i) => {
                const Ic = t.icon;
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className={`size-8 rounded-full bg-muted grid place-items-center ${t.color}`}><Ic className="size-4" /></div>
                    <div className="flex-1">
                      <div className="text-xs">{t.title}</div>
                      <div className="text-[10px] text-muted-foreground">{t.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{t.amt}</div>
                      <div className="text-[10px] text-muted-foreground">{t.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={() => toast.success("Downloading report...")} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-90"><Download className="size-4" /> Download Report</button>
        </div>
      </div>

      <InvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} invoiceToEdit={selectedInvoice || undefined} />
      <InvoiceDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} invoice={selectedInvoice} />
    </DashboardLayout>
  );
}
