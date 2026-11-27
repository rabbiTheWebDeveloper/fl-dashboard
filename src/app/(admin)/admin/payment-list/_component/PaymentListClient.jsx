"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  Trash2,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuthHeaders } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const bdt = (val) =>
  `৳${Math.round(Number(val || 0)).toLocaleString("en-IN")}`;

const PAYMENT_METHODS = [
  "bKash",
  "Nagad",
  "Rocket",
  "Bank Transfer",
  "Card",
  "Manual",
];

const STATUS_STYLES = {
  paid: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  unpaid: "bg-amber-500/15 text-amber-700 border-amber-200",
  overdue: "bg-rose-500/15 text-rose-700 border-rose-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

const METHOD_BADGE = {
  bKash: "bg-pink-500/10 text-pink-700 border-pink-200",
  Nagad: "bg-orange-500/10 text-orange-700 border-orange-200",
  Rocket: "bg-purple-500/10 text-purple-700 border-purple-200",
  "Bank Transfer": "bg-blue-500/10 text-blue-700 border-blue-200",
  Card: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  Manual: "bg-slate-100 text-slate-700 border-slate-200",
};

/**
 * Generate a crisp A4 Official Payment Receipt PDF via HTML5 Canvas + `jsPDF`.
 */
async function downloadPaymentReceiptPdf(payment) {
  const { jsPDF } = await import("jspdf");

  const scale = 2;
  const width = 794;
  const height = 640;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const fontSans =
    "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans Bengali', sans-serif";

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Header gradient
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, "#7c3aed");
  grad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, 115);

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 24px ${fontSans}`;
  ctx.fillText("AMARDokan Platform", 44, 52);
  ctx.font = `500 12px ${fontSans}`;
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText("Official Merchant Subscription & Payment Receipt", 44, 78);

  ctx.textAlign = "right";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 22px ${fontSans}`;
  ctx.fillText("PAYMENT RECEIPT", width - 44, 52);
  ctx.font = `700 13px ${fontSans}`;
  ctx.fillText(`#${payment.invoiceNumber}`, width - 44, 78);
  ctx.textAlign = "left";

  // Info Card
  ctx.fillStyle = "#f8fafc";
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.roundRect(44, 142, width - 88, 165, 14);
  ctx.fill();
  ctx.stroke();

  const leftRows = [
    ["Merchant Name:", payment.userId?.fullName || "Merchant"],
    ["Store Name:", payment.shopId?.shopName || "—"],
    ["Email / Phone:", payment.userId?.email || payment.userId?.phone || "—"],
    ["Subscription Plan:", `${payment.planName || "Basic"} Plan`],
  ];

  leftRows.forEach(([k, v], i) => {
    const ry = 174 + i * 32;
    ctx.fillStyle = "#64748b";
    ctx.font = `600 12px ${fontSans}`;
    ctx.fillText(k, 66, ry);
    ctx.fillStyle = "#0f172a";
    ctx.font = `700 13px ${fontSans}`;
    ctx.fillText(String(v).slice(0, 34), 195, ry);
  });

  const rightRows = [
    ["Status:", String(payment.status || "unpaid").toUpperCase()],
    ["Payment Method:", payment.paymentMethod || "—"],
    ["Transaction ID:", payment.transactionId || "—"],
    [
      "Date:",
      new Date(payment.paidAt || payment.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    ],
  ];

  rightRows.forEach(([k, v], i) => {
    const ry = 174 + i * 32;
    ctx.fillStyle = "#64748b";
    ctx.font = `600 12px ${fontSans}`;
    ctx.fillText(k, 430, ry);
    ctx.fillStyle =
      k === "Status:" && payment.status === "paid" ? "#059669" : "#0f172a";
    ctx.font = `700 13px ${fontSans}`;
    ctx.textAlign = "right";
    ctx.fillText(String(v).slice(0, 26), width - 66, ry);
    ctx.textAlign = "left";
  });

  // Amount Table
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(44, 332, width - 88, 38, 8);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 11px ${fontSans}`;
  ctx.fillText("DESCRIPTION", 64, 355);
  ctx.fillText("BILLING PERIOD", 400, 355);
  ctx.textAlign = "right";
  ctx.fillText("AMOUNT", width - 64, 355);
  ctx.textAlign = "left";

  ctx.fillStyle = "#0f172a";
  ctx.font = `700 13px ${fontSans}`;
  ctx.fillText(
    payment.invoiceTitle || `${payment.planName || "Basic"} Subscription`,
    64,
    402
  );

  const pStart = payment.billingPeriodStart
    ? new Date(payment.billingPeriodStart).toLocaleDateString("en-GB")
    : "—";
  const pEnd = payment.billingPeriodEnd
    ? new Date(payment.billingPeriodEnd).toLocaleDateString("en-GB")
    : "—";
  ctx.fillStyle = "#475569";
  ctx.font = `600 12px ${fontSans}`;
  ctx.fillText(`${pStart} → ${pEnd}`, 400, 402);

  ctx.textAlign = "right";
  ctx.fillStyle = "#0f172a";
  ctx.font = `700 14px ${fontSans}`;
  ctx.fillText(bdt(payment.amount ?? payment.totalDue), width - 64, 402);
  ctx.textAlign = "left";

  if (Number(payment.tax) > 0) {
    ctx.fillStyle = "#64748b";
    ctx.font = `600 12px ${fontSans}`;
    ctx.fillText("VAT / Platform Tax", 64, 434);
    ctx.textAlign = "right";
    ctx.fillText(bdt(payment.tax), width - 64, 434);
    ctx.textAlign = "left";
  }

  // Total Bar
  ctx.fillStyle = payment.status === "paid" ? "#059669" : "#7c3aed";
  ctx.beginPath();
  ctx.roundRect(430, 470, width - 44 - 430, 48, 10);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 13px ${fontSans}`;
  ctx.fillText(
    payment.status === "paid" ? "TOTAL PAID" : "TOTAL DUE",
    450,
    499
  );
  ctx.textAlign = "right";
  ctx.font = `800 17px ${fontSans}`;
  ctx.fillText(bdt(payment.totalDue), width - 64, 500);
  ctx.textAlign = "left";

  // Footer
  ctx.fillStyle = "#94a3b8";
  ctx.font = `500 11px ${fontSans}`;
  ctx.fillText(
    "Computer-generated official receipt from AMARDokan Admin Control Center.",
    44,
    595
  );

  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdfW = 210;
  const pdfH = (height * pdfW) / width;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [pdfW, pdfH],
  });
  doc.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
  doc.save(`Payment-Receipt-${payment.invoiceNumber}.pdf`);
}

export default function PaymentListClient({ admin, initialData = {} }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("saas"); // "saas" | "orders" | "merchants"
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const [refreshing, setRefreshing] = useState(false);
  const [runningCycle, setRunningCycle] = useState(false);

  // Record New Payment Modal
  const [recordOpen, setRecordOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recordForm, setRecordForm] = useState({
    shopId: initialData?.shops?.[0]?._id || "",
    planName: "Basic",
    amount: 299,
    includeVat: false,
    paymentMethod: "bKash",
    transactionId: "",
    status: "paid",
    notes: "",
  });

  // Verify / Settle Existing Invoice Modal
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyForm, setVerifyForm] = useState({
    paymentMethod: "bKash",
    transactionId: "",
    notes: "",
  });

  const {
    kpis = {},
    methodBreakdown = [],
    saasPayments = [],
    orderPayments = [],
    shops = [],
    plans = {},
  } = data;

  const canManage = ["superadmin", "user-admin"].includes(admin?.role);

  const refreshData = async (silent = false) => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/payment-list", {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json?.success && json.data) {
        setData(json.data);
        if (!silent) toast.success("Payment ledger refreshed!");
      }
    } catch {
      if (!silent) toast.error("Failed to refresh payment list.");
    } finally {
      setRefreshing(false);
    }
  };

  // Filtered SaaS Payments
  const filteredSaas = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return saasPayments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (
        methodFilter !== "all" &&
        String(p.paymentMethod || "").toLowerCase() !==
          methodFilter.toLowerCase()
      ) {
        return false;
      }
      if (!q) return true;
      return (
        String(p.invoiceNumber || "")
          .toLowerCase()
          .includes(q) ||
        String(p.transactionId || "")
          .toLowerCase()
          .includes(q) ||
        String(p.shopId?.shopName || "")
          .toLowerCase()
          .includes(q) ||
        String(p.userId?.fullName || "")
          .toLowerCase()
          .includes(q) ||
        String(p.userId?.email || "")
          .toLowerCase()
          .includes(q) ||
        String(p.paymentMethod || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [saasPayments, deferredSearch, statusFilter, methodFilter]);

  // Filtered Order Settlements
  const filteredOrders = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return orderPayments;
    return orderPayments.filter(
      (o) =>
        String(o._id || "")
          .toLowerCase()
          .includes(q) ||
        String(o.shopId?.shopName || "")
          .toLowerCase()
          .includes(q) ||
        String(o.customer?.customerName || "")
          .toLowerCase()
          .includes(q) ||
        String(o.customer?.customerPhone || "")
          .toLowerCase()
          .includes(q)
    );
  }, [orderPayments, deferredSearch]);

  // Filtered Merchant Plan Ledger
  const filteredShopPlans = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter(
      (s) =>
        String(s.shopName || "")
          .toLowerCase()
          .includes(q) ||
        String(s.owner?.fullName || "")
          .toLowerCase()
          .includes(q) ||
        String(s.owner?.email || "")
          .toLowerCase()
          .includes(q)
    );
  }, [shops, deferredSearch]);

  const handlePlanSelect = (nextPlan) => {
    const pPrice = plans?.[nextPlan]?.price ?? 299;
    setRecordForm((prev) => ({
      ...prev,
      planName: nextPlan,
      amount: pPrice,
    }));
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!recordForm.shopId) {
      toast.error("Please select a merchant store.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/payment-list", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(recordForm),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to record payment.");
        return;
      }
      toast.success(json.message);
      setRecordOpen(false);
      setRecordForm((prev) => ({ ...prev, transactionId: "", notes: "" }));
      await refreshData(true);
    } catch {
      toast.error("Error recording payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verifyTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/payment-list", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          billingId: verifyTarget._id,
          status: "paid",
          ...verifyForm,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Verification failed.");
        return;
      }
      toast.success(`Verified payment ${verifyTarget.invoiceNumber}!`);
      setVerifyTarget(null);
      await refreshData(true);
    } catch {
      toast.error("Could not verify payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStatus = async (payment, nextStatus) => {
    if (nextStatus === "paid" && payment.status !== "paid") {
      setVerifyTarget(payment);
      setVerifyForm({
        paymentMethod: payment.paymentMethod || "bKash",
        transactionId: payment.transactionId || "",
        notes: payment.notes || "",
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/payment-list", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          billingId: payment._id,
          status: nextStatus,
          paymentMethod: payment.paymentMethod,
          transactionId: payment.transactionId,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Status update failed.");
        return;
      }
      toast.success(`Marked ${nextStatus}`);
      await refreshData(true);
    } catch {
      toast.error("Error updating status.");
    }
  };

  const handleDeletePayment = async (payment) => {
    if (
      !window.confirm(
        `Delete payment record ${payment.invoiceNumber} (${bdt(
          payment.totalDue
        )})?`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/payment-list?id=${encodeURIComponent(payment._id)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Delete failed.");
        return;
      }
      toast.success("Payment record deleted.");
      await refreshData(true);
    } catch {
      toast.error("Error deleting record.");
    }
  };

  const handleRunBillingCycle = async () => {
    setRunningCycle(true);
    try {
      const res = await fetch("/api/admin/payment-list", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: "run_billing_cycle" }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Billing cycle failed.");
        return;
      }
      toast.success(json.message);
      await refreshData(true);
    } catch {
      toast.error("Could not run billing cycle.");
    } finally {
      setRunningCycle(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Invoice_No",
      "Shop_Name",
      "Merchant_Name",
      "Merchant_Email",
      "Plan",
      "Amount_BDT",
      "Status",
      "Payment_Method",
      "Transaction_ID",
      "Paid_Date",
      "Due_Date",
    ];
    const rows = filteredSaas.map((p) => [
      p.invoiceNumber || "",
      `"${String(p.shopId?.shopName || "").replace(/"/g, '""')}"`,
      `"${String(p.userId?.fullName || "").replace(/"/g, '""')}"`,
      p.userId?.email || "",
      p.planName || "Basic",
      Number(p.totalDue || 0),
      p.status || "",
      p.paymentMethod || "",
      p.transactionId || "",
      p.paidAt ? new Date(p.paidAt).toISOString().slice(0, 10) : "",
      p.dueDate ? new Date(p.dueDate).toISOString().slice(0, 10) : "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amardokan-payment-list-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported filtered payment list to CSV!");
  };

  return (
    <div className="space-y-6">
      {/* ─── Hero Header Card ─── */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Wallet className="w-4 h-4" /> Financial & Settlement Ledger
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Platform Payment List
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track merchant subscription payments (`bKash`, `Nagad`, `Bank`, `Card`), verify TrxIDs, export CSV/PDF receipts, and monitor COD settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={refreshing}
              onClick={() => refreshData(false)}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export CSV
            </Button>

            {canManage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={runningCycle}
                onClick={handleRunBillingCycle}
              >
                {runningCycle ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CalendarClock className="w-3.5 h-3.5 text-violet-600" />
                )}
                Auto-Bill Due Shops
              </Button>
            )}

            <Button
              type="button"
              variant="gradient"
              size="sm"
              onClick={() => setRecordOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Record Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── 6 RGB Financial KPI Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {[
          {
            label: "Total SaaS Collected",
            val: bdt(kpis.totalCollectedSaaS),
            sub: `${kpis.paidTransactionsCount || 0} paid invoices`,
            icon: DollarSign,
            bar: "from-emerald-500 to-teal-600",
            iconBg: "bg-emerald-500/15 text-emerald-600",
          },
          {
            label: "This Month Revenue",
            val: bdt(kpis.thisMonthCollectedSaaS),
            sub: "Current calendar month",
            icon: TrendingUp,
            bar: "from-violet-600 to-indigo-600",
            iconBg: "bg-violet-500/15 text-violet-600",
          },
          {
            label: "Pending Receivables",
            val: bdt(kpis.pendingReceivables),
            sub: "Unpaid + Overdue",
            icon: CreditCard,
            bar: "from-amber-500 to-orange-500",
            iconBg: "bg-amber-500/15 text-amber-600",
          },
          {
            label: "Overdue Dues",
            val: bdt(kpis.overdueAmount),
            sub: `${kpis.overdueCount || 0} overdue accounts`,
            icon: AlertTriangle,
            bar: "from-rose-500 to-pink-600",
            iconBg: "bg-rose-500/15 text-rose-600",
          },
          {
            label: "Storefront COD Paid",
            val: bdt(kpis.storefrontDeliveredCash),
            sub: "Delivered orders",
            icon: ShoppingCart,
            bar: "from-cyan-500 to-blue-600",
            iconBg: "bg-cyan-500/15 text-cyan-600",
          },
          {
            label: "Pipeline COD Transit",
            val: bdt(kpis.storefrontPendingCod),
            sub: "Pending / Shipped COD",
            icon: Sparkles,
            bar: "from-fuchsia-600 to-purple-600",
            iconBg: "bg-fuchsia-500/15 text-fuchsia-600",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              className="relative overflow-hidden py-3.5 border-slate-200/80 bg-white shadow-2xs"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.bar}`}
              />
              <CardContent className="px-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    {item.label}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                  {item.val}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{item.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ─── Payment Gateway Breakdown Strip ─── */}
      {methodBreakdown.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 shrink-0">
            Collected by Gateway:
          </span>
          {methodBreakdown.map((m) => (
            <button
              key={m.method}
              type="button"
              onClick={() => {
                setActiveTab("saas");
                setMethodFilter((prev) =>
                  prev === m.method ? "all" : m.method
                );
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-2 shrink-0 transition ${
                methodFilter === m.method
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{m.method}</span>
              <span className="text-emerald-600 font-extrabold">
                {bdt(m.total)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ─── Ledger View Switcher + Search + Filters ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            {
              id: "saas",
              label: `SaaS Payments (${saasPayments.length})`,
            },
            {
              id: "orders",
              label: `Order COD Settlements (${orderPayments.length})`,
            },
            {
              id: "merchants",
              label: `Merchant Plan Status (${shops.length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === "saas" && (
            <>
              <select
                aria-label="Filter payment status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                aria-label="Filter payment method"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
              >
                <option value="all">All Gateways</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="relative w-full sm:w-68">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Invoice #, TrxID, shop, email..."
              className="pl-9 h-9 bg-white rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      {/* ─── TAB 1: SaaS Subscription Payments Table ─── */}
      {activeTab === "saas" && (
        <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead className="font-bold">Invoice #</TableHead>
                  <TableHead className="font-bold">Merchant & Store</TableHead>
                  <TableHead className="font-bold">Plan</TableHead>
                  <TableHead className="font-bold">Gateway & TrxID</TableHead>
                  <TableHead className="font-bold text-right">Amount</TableHead>
                  <TableHead className="font-bold text-center">Date</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSaas.length > 0 ? (
                  filteredSaas.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>
                        <p className="font-mono font-bold text-xs text-slate-900">
                          {p.invoiceNumber}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[160px]">
                          {p.invoiceTitle}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-bold text-slate-900 bangla-text">
                          {p.shopId?.shopName || "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {p.userId?.fullName || ""} · {p.userId?.email || ""}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-bold">
                          {p.planName || "Basic"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {p.paymentMethod ? (
                          <div className="space-y-0.5">
                            <Badge
                              className={
                                METHOD_BADGE[p.paymentMethod] ||
                                METHOD_BADGE.Manual
                              }
                            >
                              {p.paymentMethod}
                            </Badge>
                            {p.transactionId && (
                              <p className="text-[11px] font-mono text-slate-500">
                                TrxID: {p.transactionId}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Awaiting Payment
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <p className="font-extrabold text-slate-900">
                          {bdt(p.totalDue)}
                        </p>
                        {Number(p.tax) > 0 && (
                          <p className="text-[10px] text-slate-400">
                            incl. {bdt(p.tax)} VAT
                          </p>
                        )}
                      </TableCell>

                      <TableCell className="text-center text-xs text-slate-500">
                        {p.status === "paid" && p.paidAt ? (
                          <div>
                            <p className="font-semibold text-emerald-600">
                              {new Date(p.paidAt).toLocaleDateString("en-GB")}
                            </p>
                            <p className="text-[10px] text-slate-400">Paid</p>
                          </div>
                        ) : (
                          <div>
                            <p>
                              {p.dueDate
                                ? new Date(p.dueDate).toLocaleDateString("en-GB")
                                : "—"}
                            </p>
                            <p className="text-[10px] text-slate-400">Due</p>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={
                            STATUS_STYLES[p.status] || STATUS_STYLES.unpaid
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {p.status !== "paid" && (
                            <button
                              type="button"
                              onClick={() => {
                                setVerifyTarget(p);
                                setVerifyForm({
                                  paymentMethod: p.paymentMethod || "bKash",
                                  transactionId: p.transactionId || "",
                                  notes: p.notes || "",
                                });
                              }}
                              className="h-7 px-2.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Verify
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              downloadPaymentReceiptPdf(p).catch(() =>
                                toast.error("Failed to download PDF receipt.")
                              )
                            }
                            title="Download Official Receipt PDF"
                            className="h-7 px-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> PDF
                          </button>

                          <select
                            aria-label="Change payment status"
                            value={p.status}
                            onChange={(e) =>
                              handleQuickStatus(p, e.target.value)
                            }
                            className="h-7 px-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold bg-white"
                          >
                            <option value="paid">paid</option>
                            <option value="unpaid">unpaid</option>
                            <option value="overdue">overdue</option>
                            <option value="cancelled">cancelled</option>
                          </select>

                          {canManage && (
                            <button
                              type="button"
                              onClick={() => handleDeletePayment(p)}
                              title="Delete Record"
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-14 text-center text-xs text-slate-400"
                    >
                      No SaaS payment records matched your filter. Click &ldquo;Record Payment&rdquo; to add a payment entry.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ─── TAB 2: Storefront Order COD Settlements ─── */}
      {activeTab === "orders" && (
        <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead className="font-bold">Order Ref</TableHead>
                  <TableHead className="font-bold">Store</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold text-right">Shipping</TableHead>
                  <TableHead className="font-bold text-right">Advance</TableHead>
                  <TableHead className="font-bold text-right">COD Due</TableHead>
                  <TableHead className="font-bold text-right">Grand Total</TableHead>
                  <TableHead className="font-bold text-center">Settlement</TableHead>
                  <TableHead className="font-bold text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => {
                    const slug =
                      ord.shopId?.shopSlug || ord.shopId?.shopId || "";
                    const isSettled = ord.status === "delivered";
                    return (
                      <TableRow key={ord._id}>
                        <TableCell>
                          <p className="font-mono font-bold text-xs text-slate-900">
                            #{String(ord._id).slice(-8).toUpperCase()}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString(
                                  "en-GB"
                                )
                              : ""}
                          </p>
                        </TableCell>
                        <TableCell className="font-bold text-slate-800 bangla-text">
                          {ord.shopId?.shopName || "—"}
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-slate-900 bangla-text">
                            {ord.customer?.customerName || "Customer"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {ord.customer?.customerPhone || ""}
                          </p>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {bdt(ord.shipping_cost)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-emerald-600 font-semibold">
                          {bdt(ord.advanced)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold text-amber-600">
                          {isSettled ? bdt(0) : bdt(ord.due ?? ord.grand_total)}
                        </TableCell>
                        <TableCell className="text-right font-extrabold text-slate-900">
                          {bdt(ord.grand_total)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              isSettled
                                ? "bg-emerald-500/15 text-emerald-700 border-emerald-200"
                                : ord.status === "cancelled"
                                ? "bg-rose-500/15 text-rose-700 border-rose-200"
                                : "bg-amber-500/15 text-amber-700 border-amber-200"
                            }
                          >
                            {isSettled ? "COD Settled" : ord.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {slug && (
                            <Link
                              href={`/shop/${encodeURIComponent(
                                slug
                              )}/thank-you?orderId=${encodeURIComponent(
                                ord._id
                              )}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline"
                            >
                              <FileText className="w-3.5 h-3.5" /> Receipt
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-12 text-center text-xs text-slate-400"
                    >
                      No storefront order settlements found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ─── TAB 3: Merchant Plan Status Ledger ─── */}
      {activeTab === "merchants" && (
        <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead className="font-bold">Store</TableHead>
                  <TableHead className="font-bold">Merchant Owner</TableHead>
                  <TableHead className="font-bold text-center">
                    Current Plan Status
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Next Renewal Date
                  </TableHead>
                  <TableHead className="font-bold text-right">
                    Quick Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShopPlans.map((s) => {
                  const pStatus = s.owner?.payment_status || "paid";
                  const nextRenewal = s.owner?.next_payment_date;
                  const slug = s.shopSlug || s.shopId;
                  return (
                    <TableRow key={s._id}>
                      <TableCell>
                        <p className="font-bold text-slate-900 bangla-text">
                          {s.shopName}
                        </p>
                        <Link
                          href={`/shop/${encodeURIComponent(slug)}`}
                          target="_blank"
                          className="text-xs text-violet-600 hover:underline inline-flex items-center gap-1"
                        >
                          /shop/{slug} <ExternalLink className="w-3 h-3" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-800 bangla-text">
                          {s.owner?.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {s.owner?.email || ""} · {s.owner?.phone || ""}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            pStatus === "paid"
                              ? STATUS_STYLES.paid
                              : STATUS_STYLES.overdue
                          }
                        >
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {pStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs text-slate-600">
                        {nextRenewal
                          ? new Date(nextRenewal).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Active / Trial"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRecordForm((prev) => ({
                              ...prev,
                              shopId: s._id,
                            }));
                            setRecordOpen(true);
                          }}
                        >
                          <Zap className="w-3.5 h-3.5 text-violet-600" />
                          Record Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ─── Modal A: Record New Merchant Payment ─── */}
      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              Record Merchant Payment
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Log a paid subscription (`bKash`, `Nagad`, `Bank`, `Card`) or issue an unpaid bill for any shop.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRecordPayment} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Merchant Store *</Label>
              <select
                required
                value={recordForm.shopId}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, shopId: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="">-- Select Store --</option>
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.shopName} ({s.owner?.email || `#${s.shopId}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Subscription Plan</Label>
                <select
                  value={recordForm.planName}
                  onChange={(e) => handlePlanSelect(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                >
                  <option value="Basic">Basic (৳299)</option>
                  <option value="Standard">Standard (৳599)</option>
                  <option value="Professional">Professional (৳999)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Amount (৳)</Label>
                <Input
                  type="number"
                  min={0}
                  required
                  value={recordForm.amount}
                  onChange={(e) =>
                    setRecordForm((p) => ({
                      ...p,
                      amount: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Payment Gateway</Label>
                <select
                  value={recordForm.paymentMethod}
                  onChange={(e) =>
                    setRecordForm((p) => ({
                      ...p,
                      paymentMethod: e.target.value,
                    }))
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Payment Status</Label>
                <select
                  value={recordForm.status}
                  onChange={(e) =>
                    setRecordForm((p) => ({ ...p, status: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                >
                  <option value="paid">Paid (Verified)</option>
                  <option value="unpaid">Unpaid (Pending Invoice)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Transaction ID (TrxID / Reference)
              </Label>
              <Input
                value={recordForm.transactionId}
                onChange={(e) =>
                  setRecordForm((p) => ({
                    ...p,
                    transactionId: e.target.value,
                  }))
                }
                placeholder="e.g. BKS98X72K1 / Bank Slip #"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={recordForm.includeVat}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, includeVat: e.target.checked }))
                }
                className="rounded accent-violet-600"
              />
              Add 5% Platform VAT on top of base amount
            </label>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Admin Note (Optional)</Label>
              <Input
                value={recordForm.notes}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Verified via bKash merchant statement..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRecordOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Save Payment Entry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Modal B: Verify / Settle Unpaid Invoice ─── */}
      <Dialog
        open={Boolean(verifyTarget)}
        onOpenChange={(open) => {
          if (!open) setVerifyTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              Verify & Mark Invoice Paid
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Settling <strong>{verifyTarget?.invoiceNumber}</strong> (
              {bdt(verifyTarget?.totalDue)}) for{" "}
              <strong>{verifyTarget?.shopId?.shopName}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifySubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Payment Gateway *</Label>
              <select
                value={verifyForm.paymentMethod}
                onChange={(e) =>
                  setVerifyForm((p) => ({
                    ...p,
                    paymentMethod: e.target.value,
                  }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Transaction ID (TrxID)
              </Label>
              <Input
                value={verifyForm.transactionId}
                onChange={(e) =>
                  setVerifyForm((p) => ({
                    ...p,
                    transactionId: e.target.value,
                  }))
                }
                placeholder="Enter bKash / Nagad / Bank TrxID"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Verification Note</Label>
              <Input
                value={verifyForm.notes}
                onChange={(e) =>
                  setVerifyForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Optional admin remark"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVerifyTarget(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Confirm Paid
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
