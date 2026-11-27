"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Info,
  Plus,
  Printer,
  RefreshCw,
  Sparkles,
  Wallet,
} from "lucide-react";
import {
  createManualBillingAction,
  generateMonthlyBillingsAction,
} from "@/app/actions/billing";
import { PLANS } from "@/config/billingConfig";
import {
  DEFAULT_GATEWAY_NUMBER,
  SEND_MONEY_GATEWAYS,
  getGatewayByMethod,
} from "@/config/paymentGatewayConfig";
import { SendMoneyGatewayDialog } from "@/components/payment/SendMoneyGateway";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tk = (n) => `৳${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const STATUS_STYLE = {
  paid: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  pending_verification: "bg-cyan-500/15 text-cyan-800 border-cyan-300",
  unpaid: "bg-amber-500/10 text-amber-700 border-amber-200",
  overdue: "bg-rose-500/10 text-rose-700 border-rose-200",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-300",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

function InvoiceDialog({ bill, onClose }) {
  if (!bill) return null;

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Invoice ${bill.invoiceNumber}</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; padding: 40px; color: #0f172a; }
        .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
        .logo { font-size: 24px; font-weight: 800; color: #7c3aed; }
        h1 { font-size: 18px; margin: 0 0 4px; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th { background: #f8fafc; padding: 10px 12px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .total-row { font-weight: bold; background: #f8fafc; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: ${
          bill.status === "paid" ? "#dcfce7" : "#fef9c3"
        }; color: ${bill.status === "paid" ? "#166534" : "#854d0e"}; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .info-block label { font-size: 11px; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .info-block p { font-size: 14px; margin: 0; font-weight: 600; }
        .footer { margin-top: 48px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style></head><body>
      <div class="header">
        <div><div class="logo">AMARDokan</div><p style="font-size:12px;color:#64748b;margin:4px 0">Merchant Automation Platform</p></div>
        <div style="text-align:right">
          <h1>INVOICE</h1>
          <p style="margin:0;font-size:13px;color:#64748b">${bill.invoiceNumber}</p>
          <span class="badge">${String(bill.status || "")
            .replace(/_/g, " ")
            .toUpperCase()}</span>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-block"><label>Bill Date</label><p>${fmtDate(bill.createdAt)}</p></div>
        <div class="info-block"><label>Due Date</label><p>${fmtDate(bill.dueDate)}</p></div>
        <div class="info-block"><label>Billing Period</label><p>${fmtDate(bill.billingPeriodStart)} – ${fmtDate(bill.billingPeriodEnd)}</p></div>
        <div class="info-block"><label>Plan</label><p>${bill.planName}</p></div>
        ${
          bill.paymentMethod
            ? `<div class="info-block"><label>Gateway</label><p>${bill.paymentMethod} (${bill.receiverNumber || DEFAULT_GATEWAY_NUMBER})</p></div><div class="info-block"><label>Sender Phone</label><p>${bill.senderNumber || "—"}</p></div>`
            : ""
        }
      </div>
      <table>
        <thead><tr><th>Description</th><th>Period</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          <tr><td>${bill.invoiceTitle}</td><td>${fmtDate(bill.billingPeriodStart)} – ${fmtDate(bill.billingPeriodEnd)}</td><td style="text-align:right">৳${bill.amount}</td></tr>
          <tr><td>VAT (5%)</td><td>—</td><td style="text-align:right">৳${bill.tax}</td></tr>
          ${bill.discount > 0 ? `<tr><td>Discount</td><td>—</td><td style="text-align:right">-৳${bill.discount}</td></tr>` : ""}
          <tr class="total-row"><td colspan="2">Total Due</td><td style="text-align:right">৳${bill.totalDue}</td></tr>
        </tbody>
      </table>
      ${bill.transactionId ? `<p style="font-size:13px;color:#64748b">Transaction ID (TrxID): <strong>${bill.transactionId}</strong></p>` : ""}
      <div class="footer"><p>Thank you for choosing AMARDokan!</p></div>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <Dialog open={Boolean(bill)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle>Invoice — {bill.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Billing summary for {bill.planName} plan
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2 text-sm">
          {[
            ["Invoice #", bill.invoiceNumber],
            ["Plan", bill.planName],
            [
              "Period",
              `${fmtDate(bill.billingPeriodStart)} – ${fmtDate(
                bill.billingPeriodEnd
              )}`,
            ],
            ["Due Date", fmtDate(bill.dueDate)],
            ["Gateway", bill.paymentMethod || "—"],
            ["Sender Phone", bill.senderNumber || "—"],
            ["TrxID", bill.transactionId || "—"],
            [
              "Status",
              String(bill.status || "")
                .replace(/_/g, " ")
                .toUpperCase(),
            ],
            ["Subtotal + VAT", `${tk(bill.amount)} + ${tk(bill.tax)}`],
            ["Total Due", tk(bill.totalDue)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                {k}
              </p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{v}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="gradient" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BillingPage({
  billings: initialBillings = [],
  summary = {},
  user,
}) {
  const router = useRouter();
  const [billings, setBillings] = useState(initialBillings);
  const [filter, setFilter] = useState("all");
  const [viewBill, setViewBill] = useState(null);
  const [payBill, setPayBill] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    setBillings(initialBillings);
  }, [initialBillings]);

  const filtered =
    filter === "all" ? billings : billings.filter((b) => b.status === filter);

  const handleGenerate = async () => {
    setGenLoading(true);
    try {
      const res = await generateMonthlyBillingsAction();
      toast.success(`Generated ${res.created} new invoice(s)`);
      router.refresh();
    } catch (e) {
      toast.error(e?.message || "Auto-billing failed");
    } finally {
      setGenLoading(false);
    }
  };

  const handleCreateNow = async () => {
    setCreateLoading(true);
    try {
      await createManualBillingAction({
        userId: user?.userId,
        shopId: user?.shopId,
        planName: "Basic",
      });
      toast.success("Invoice created!");
      router.refresh();
    } catch (e) {
      toast.error(e?.message || "Failed to create invoice");
    } finally {
      setCreateLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Invoices",
      value: summary.total || 0,
      icon: FileText,
      bar: "from-violet-600 to-indigo-500",
      iconBg: "from-violet-600 to-indigo-600",
    },
    {
      label: "Verified Paid",
      value: summary.paid || 0,
      icon: CheckCircle2,
      bar: "from-emerald-500 to-teal-500",
      iconBg: "from-emerald-500 to-teal-600",
    },
    {
      label: "Pending Verify",
      value: summary.pendingVerification || 0,
      icon: Wallet,
      bar: "from-cyan-500 to-blue-500",
      iconBg: "from-cyan-500 to-blue-600",
    },
    {
      label: "Unpaid / Rejected",
      value: summary.unpaid || 0,
      icon: Clock,
      bar: "from-amber-500 to-orange-500",
      iconBg: "from-amber-500 to-orange-500",
    },
    {
      label: "Overdue",
      value: summary.overdue || 0,
      icon: AlertTriangle,
      bar: "from-rose-500 to-pink-500",
      iconBg: "from-rose-500 to-pink-600",
    },
    {
      label: "Total Paid",
      value: tk(summary.totalPaid || 0),
      icon: CreditCard,
      bar: "from-fuchsia-500 to-purple-500",
      iconBg: "from-fuchsia-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <InvoiceDialog bill={viewBill} onClose={() => setViewBill(null)} />

      <SendMoneyGatewayDialog
        open={Boolean(payBill)}
        onOpenChange={(open) => {
          if (!open) setPayBill(null);
        }}
        dialogTitle={`Pay Invoice ${payBill?.invoiceNumber || ""}`}
        dialogDescription={`Send Money to ${DEFAULT_GATEWAY_NUMBER} via bKash, Nagad, Rocket, Upay, or GPay and submit your TrxID.`}
        mode="invoice"
        invoice={payBill}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Billing & <span className="rgb-gradient-text">Invoices</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Send Money Gateway ({DEFAULT_GATEWAY_NUMBER}) · bKash, Nagad,
            Rocket, Upay & GPay
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleCreateNow}
            disabled={createLoading}
          >
            {createLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            New Invoice
          </Button>
          <Button
            variant="gradient"
            onClick={handleGenerate}
            disabled={genLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${genLoading ? "animate-spin" : ""}`}
            />
            Run Auto-Billing
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className="relative overflow-hidden py-4 border-slate-200/80 bg-white/95"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.bar}`}
              />
              <CardContent className="px-4 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.iconBg} text-white flex items-center justify-center shadow-md shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Send Money Gateway Banner with 5 Official Logos */}
      <div className="rounded-2xl border border-violet-200/80 bg-gradient-to-r from-violet-50/90 via-indigo-50/80 to-cyan-50/90 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Send Money Payment Gateway: {DEFAULT_GATEWAY_NUMBER}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Pay any open invoice via{" "}
                <strong>bKash, Nagad, Rocket, Upay, or GPay</strong> Send Money
                to <strong className="font-mono">{DEFAULT_GATEWAY_NUMBER}</strong>{" "}
                and submit your Sender Number + TrxID for verification.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SEND_MONEY_GATEWAYS.map((gw) => (
                <span
                  key={gw.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-[11px] font-bold text-slate-800 shadow-2xs"
                >
                  <img
                    src={gw.logo}
                    alt={gw.name}
                    className="h-4 w-6 object-contain"
                  />
                  {gw.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0 bg-white">
          <Link href="/subscription">Manage Plan</Link>
        </Button>
      </div>

      {/* Invoices Table */}
      <Card className="border-slate-200/80 bg-white/95">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Invoice Ledger
            </CardTitle>
            <CardDescription>
              {filtered.length} invoice(s) displayed
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden sm:flex-wrap -mx-1 px-1">
            {[
              ["all", `All (${billings.length})`],
              ["pending_verification", "Pending Verify"],
              ["unpaid", "Unpaid"],
              ["paid", "Paid"],
              ["overdue", "Overdue"],
              ["rejected", "Rejected"],
            ].map(([f, label]) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "gradient" : "outline"}
                onClick={() => setFilter(f)}
                className="h-8 text-xs rounded-full sm:rounded-lg shrink-0"
              >
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-3.5 sm:px-6">
          {/* Mobile Native Invoice Cards (< md) */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No invoices found
                </p>
              </div>
            ) : (
              filtered.map((bill) => {
                const canPay = ["unpaid", "overdue", "rejected"].includes(
                  bill.status
                );
                return (
                  <div
                    key={bill._id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-xs font-extrabold text-violet-700">
                          {bill.invoiceNumber}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Issued {fmtDate(bill.createdAt)} · Due{" "}
                          {fmtDate(bill.dueDate)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          STATUS_STYLE[bill.status] || STATUS_STYLE.unpaid
                        }`}
                      >
                        {String(bill.status || "").replace(/_/g, " ")}
                      </Badge>
                    </div>

                    {bill.transactionId && (
                      <div className="text-xs rounded-xl bg-slate-50 px-3 py-2 font-mono text-slate-700">
                        {bill.paymentMethod}: {bill.transactionId}
                        {bill.senderNumber ? ` (${bill.senderNumber})` : ""}
                      </div>
                    )}

                    <div className="flex items-center justify-between rounded-xl bg-slate-50/80 px-3 py-2.5">
                      <span className="text-xs text-slate-500">
                        {fmtDate(bill.billingPeriodStart)} –{" "}
                        {fmtDate(bill.billingPeriodEnd)}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {tk(bill.totalDue)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs flex-1"
                        onClick={() => setViewBill(bill)}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Invoice
                      </Button>
                      {canPay ? (
                        <Button
                          size="sm"
                          variant="gradient"
                          className="h-8 text-xs flex-1"
                          onClick={() => setPayBill(bill)}
                        >
                          {bill.status === "rejected"
                            ? "Resubmit TrxID"
                            : "Pay Now"}
                        </Button>
                      ) : (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs flex-1"
                        >
                          <Link href={`/pay/${bill._id}`}>Status</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table (md+) */}
          <div className="hidden md:block rounded-xl border border-slate-200/80 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="pl-4">Invoice #</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Gateway & TrxID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-14">
                      <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        No invoices found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((bill) => {
                    const canPay = ["unpaid", "overdue", "rejected"].includes(
                      bill.status
                    );
                    return (
                      <TableRow key={bill._id} className="hover:bg-slate-50/70">
                        <TableCell className="pl-4">
                          <p className="font-mono text-xs font-bold text-violet-700">
                            {bill.invoiceNumber}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {bill.planName || "Basic"}
                          </p>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {fmtDate(bill.billingPeriodStart)} –{" "}
                          {fmtDate(bill.billingPeriodEnd)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {bill.paymentMethod ? (
                            <div>
                              <div className="inline-flex items-center gap-1.5">
                                {getGatewayByMethod(bill.paymentMethod)?.logo && (
                                  <img
                                    src={
                                      getGatewayByMethod(bill.paymentMethod)
                                        .logo
                                    }
                                    alt={bill.paymentMethod}
                                    className="w-6 h-5 rounded bg-white border border-slate-200 object-contain p-0.5"
                                  />
                                )}
                                <span className="font-extrabold text-slate-800">
                                  {bill.paymentMethod}
                                </span>
                                {bill.senderNumber && (
                                  <span className="text-[11px] font-mono text-slate-500">
                                    ({bill.senderNumber})
                                  </span>
                                )}
                              </div>
                              {bill.transactionId && (
                                <p className="text-[11px] font-mono font-bold text-violet-700 mt-0.5">
                                  TrxID: {bill.transactionId}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          {tk(bill.totalDue)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`capitalize ${
                              STATUS_STYLE[bill.status] || STATUS_STYLE.unpaid
                            }`}
                          >
                            {String(bill.status || "").replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-600">
                          {fmtDate(bill.dueDate)}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => setViewBill(bill)}
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Print
                            </Button>

                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                            >
                              <Link href={`/pay/${bill._id}`}>
                                <ExternalLink className="w-3.5 h-3.5" />
                                Gateway
                              </Link>
                            </Button>

                            {canPay && (
                              <Button
                                size="sm"
                                variant="gradient"
                                className="h-8 text-xs"
                                onClick={() => setPayBill(bill)}
                              >
                                {bill.status === "rejected"
                                  ? "Resubmit"
                                  : "Pay Now"}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Plans Reference */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Available Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(PLANS || {}).map(([name, plan]) => {
            const popular = name === "Standard";
            return (
              <Card
                key={name}
                className={
                  popular
                    ? "rgb-card border-violet-300 shadow-md bg-white"
                    : "border-slate-200/80 bg-white/95"
                }
              >
                <CardHeader className="pb-2">
                  {popular && (
                    <Badge className="bg-violet-100 text-violet-700 border-violet-200 w-fit mb-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {name}
                  </CardTitle>
                  <p className="text-2xl font-extrabold text-violet-600">
                    {tk(plan.price)}
                    <span className="text-xs font-normal text-slate-400">
                      /month
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(plan.features || []).map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
