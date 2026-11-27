"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  DEFAULT_GATEWAY_NUMBER,
  getGatewayByMethod,
} from "@/config/paymentGatewayConfig";
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

const bdt = (n) => `৳${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;

const BILL_STATUS_STYLE = {
  paid: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  pending_verification: "bg-cyan-500/15 text-cyan-800 border-cyan-300",
  unpaid: "bg-amber-500/15 text-amber-700 border-amber-200",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-300",
  overdue: "bg-rose-500/15 text-rose-700 border-rose-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function AdminBillingClient({
  initialInvoices = [],
  shops = [],
}) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    shopId: shops[0]?._id || "",
    planName: "Standard",
    invoiceTitle: "Monthly Platform Subscription",
    amount: 599,
    dueDays: 7,
    notes: "",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        String(inv.invoiceNumber || "")
          .toLowerCase()
          .includes(q) ||
        String(inv.transactionId || "")
          .toLowerCase()
          .includes(q) ||
        String(inv.senderNumber || "")
          .toLowerCase()
          .includes(q) ||
        String(inv.shopId?.shopName || "")
          .toLowerCase()
          .includes(q) ||
        String(inv.userId?.email || "")
          .toLowerCase()
          .includes(q)
    );
  }, [invoices, search]);

  const totals = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let unpaid = 0;
    for (const inv of invoices) {
      if (inv.status === "paid") paid += Number(inv.totalDue || 0);
      if (inv.status === "pending_verification") {
        pending += Number(inv.totalDue || 0);
      }
      if (["unpaid", "overdue", "rejected"].includes(inv.status)) {
        unpaid += Number(inv.totalDue || 0);
      }
    }
    return { paid, pending, unpaid };
  }, [invoices]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!form.shopId) {
      toast.error("Please select a merchant store.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to generate invoice.");
        return;
      }
      window.location.reload();
    } catch {
      toast.error("Error generating invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (invoiceId, status) => {
    try {
      const res = await fetch("/api/admin/billing", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ invoiceId, status }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Update failed.");
        return;
      }
      setInvoices((prev) =>
        prev.map((i) => (i._id === invoiceId ? { ...i, status } : i))
      );
      toast.success(`Invoice marked ${status}`);
    } catch {
      toast.error("Failed to update invoice.");
    }
  };

  const handleVerifyAction = async (inv, action) => {
    try {
      const res = await fetch("/api/payment-gateway", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          billingId: inv._id,
          action,
          verificationNote:
            action === "reject"
              ? "TrxID could not be verified on 01726278251. Please resubmit valid TrxID."
              : "",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Verification failed.");
        return;
      }
      const nextStatus = action === "verify" ? "paid" : "rejected";
      setInvoices((prev) =>
        prev.map((i) => (i._id === inv._id ? { ...i, status: nextStatus } : i))
      );
      toast.success(json.message);
    } catch {
      toast.error("Failed to process TrxID verification.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <CreditCard className="w-4 h-4" /> SaaS Subscriptions & Gateway
              Verification ({DEFAULT_GATEWAY_NUMBER})
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Platform Billing ({invoices.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Collected:{" "}
              <strong className="text-emerald-600">{bdt(totals.paid)}</strong> ·
              Pending Verify:{" "}
              <strong className="text-cyan-600">{bdt(totals.pending)}</strong> ·
              Outstanding:{" "}
              <strong className="text-amber-600">{bdt(totals.unpaid)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-56 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice, TrxID, phone..."
                className="pl-9 rounded-xl"
              />
            </div>
            <Button
              type="button"
              variant="gradient"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-4 h-4" /> Issue Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold">Invoice #</TableHead>
                <TableHead className="font-bold">Merchant & Shop</TableHead>
                <TableHead className="font-bold">
                  Gateway · Sender · TrxID
                </TableHead>
                <TableHead className="font-bold text-right">Amount</TableHead>
                <TableHead className="font-bold text-center">
                  Due Date
                </TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="font-bold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((inv) => (
                  <TableRow key={inv._id}>
                    <TableCell>
                      <p className="font-mono font-bold text-xs text-slate-900">
                        {inv.invoiceNumber}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {inv.planName || "Basic"} · {inv.invoiceTitle}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-slate-900 bangla-text">
                        {inv.shopId?.shopName || "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {inv.userId?.email || ""}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs">
                      {inv.paymentMethod ? (
                        <div>
                          <div className="inline-flex items-center gap-1.5">
                            {getGatewayByMethod(inv.paymentMethod)?.logo && (
                              <img
                                src={getGatewayByMethod(inv.paymentMethod).logo}
                                alt={inv.paymentMethod}
                                className="w-6 h-5 rounded bg-white border border-slate-200 object-contain p-0.5 shrink-0"
                              />
                            )}
                            <span className="font-extrabold text-slate-900">
                              {inv.paymentMethod}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              → {inv.receiverNumber || DEFAULT_GATEWAY_NUMBER}
                            </span>
                          </div>
                          {inv.senderNumber && (
                            <p className="text-[11px] font-mono text-slate-600">
                              From: {inv.senderNumber}
                            </p>
                          )}
                          {inv.transactionId && (
                            <p className="text-[11px] font-mono font-bold text-violet-700">
                              TrxID: {inv.transactionId}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">Awaiting Payment</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-slate-900">
                      {bdt(inv.totalDue)}
                    </TableCell>
                    <TableCell className="text-center text-xs text-slate-500">
                      {inv.dueDate
                        ? new Date(inv.dueDate).toLocaleDateString("en-GB")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          BILL_STATUS_STYLE[inv.status] ||
                          BILL_STATUS_STYLE.unpaid
                        }
                      >
                        {String(inv.status || "").replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {inv.status === "pending_verification" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleVerifyAction(inv, "verify")}
                              className="h-7 px-2.5 rounded-lg bg-emerald-600 text-white text-[11px] font-extrabold hover:bg-emerald-700 inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerifyAction(inv, "reject")}
                              className="h-7 px-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold hover:bg-rose-100 inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}

                        <select
                          aria-label="Update invoice status"
                          value={inv.status}
                          onChange={(e) =>
                            updateStatus(inv._id, e.target.value)
                          }
                          className="h-8 px-2 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                        >
                          <option value="pending_verification">
                            pending_verification
                          </option>
                          <option value="unpaid">unpaid</option>
                          <option value="paid">paid</option>
                          <option value="rejected">rejected</option>
                          <option value="overdue">overdue</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    No SaaS billing invoices issued yet. Click &ldquo;Issue
                    Invoice&rdquo; to bill a merchant store.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Issue Invoice Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              Issue Merchant Subscription Invoice
            </DialogTitle>
            <DialogDescription className="text-xs">
              Generate a platform billing invoice for any active merchant store.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateInvoice} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Select Store *</Label>
              <select
                required
                value={form.shopId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shopId: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="">-- Select a shop --</option>
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.shopName} ({s.owner?.email || s.shopId})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Plan Name</Label>
                <Input
                  value={form.planName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, planName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Amount (৳)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Invoice Title</Label>
              <Input
                value={form.invoiceTitle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, invoiceTitle: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Create Invoice
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
