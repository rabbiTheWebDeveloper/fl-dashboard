"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  FileText,
  Printer,
  RefreshCw,
  ShieldCheck,
  Store,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import { DEFAULT_GATEWAY_NUMBER } from "@/config/paymentGatewayConfig";
import { SendMoneyGatewayCard } from "@/components/payment/SendMoneyGateway";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tk = (n) => `৳${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function HostedGatewayClient({
  initialInvoice = null,
  gateways = [],
}) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [refreshing, setRefreshing] = useState(false);
  const [editingPending, setEditingPending] = useState(false);

  const checkLiveStatus = async () => {
    if (!invoice?._id) return;
    setRefreshing(true);
    try {
      const res = await fetch(
        `/api/payment-gateway?invoiceId=${encodeURIComponent(invoice._id)}`
      );
      const json = await res.json();
      if (json?.success && json.data?.invoice) {
        setInvoice(json.data.invoice);
        toast.info(
          `Current status: ${String(json.data.invoice.status).replace(
            /_/g,
            " "
          )}`
        );
      }
    } catch {
      toast.error("Could not refresh payment status.");
    } finally {
      setRefreshing(false);
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-3xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Invoice Not Found
            </h1>
            <p className="text-xs text-slate-500">
              The payment link may be invalid or the invoice has been removed.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button asChild variant="outline">
                <Link href="/dashboard/billings">
                  <ArrowLeft className="w-4 h-4" />
                  Billing Ledger
                </Link>
              </Button>
              <Button asChild variant="gradient">
                <Link href="/subscription">View Plans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";
  const isPending = invoice.status === "pending_verification" && !editingPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50/40 to-cyan-50/40 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard/billings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Merchant Billing
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-extrabold text-emerald-700 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            AMARDokan Secure Gateway
          </div>
        </div>

        {/* Store & Invoice Context Strip */}
        <div className="rounded-2xl bg-white border border-slate-200/90 px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs text-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </span>
            <div>
              <p className="font-extrabold text-slate-900 bangla-text">
                {invoice.shopId?.shopName || "Merchant Store"}
              </p>
              <p className="text-[11px] text-slate-500">
                {invoice.userId?.fullName || invoice.userId?.email || "Account"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-mono font-extrabold text-violet-700">
              {invoice.invoiceNumber}
            </p>
            <p className="text-[11px] text-slate-400">
              {fmtDate(invoice.billingPeriodStart)} →{" "}
              {fmtDate(invoice.billingPeriodEnd)}
            </p>
          </div>
        </div>

        {/* State 1: Paid & Verified */}
        {isPaid ? (
          <Card className="rounded-3xl border-emerald-200 bg-white shadow-md overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto">
                  <BadgeCheck className="w-9 h-9" />
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200 font-extrabold">
                  Verified & Paid
                </Badge>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Payment Confirmed ({tk(invoice.totalDue)})
                </h1>
                <p className="text-xs text-slate-500">
                  Your TrxID has been verified by Admin and your{" "}
                  <strong>{invoice.planName}</strong> subscription is active.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5 text-xs">
                {[
                  ["Invoice Number", invoice.invoiceNumber],
                  ["Gateway", invoice.paymentMethod || "Send Money"],
                  [
                    "Receiver Number",
                    invoice.receiverNumber || DEFAULT_GATEWAY_NUMBER,
                  ],
                  ["Sender Number", invoice.senderNumber || "—"],
                  ["Transaction ID (TrxID)", invoice.transactionId || "—"],
                  ["Verified Date", fmtDate(invoice.verifiedAt || invoice.paidAt)],
                  ["Total Paid", tk(invoice.totalDue)],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between border-b border-slate-200/60 last:border-0 pb-2 last:pb-0"
                  >
                    <span className="text-slate-500 font-semibold">{k}</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </Button>
                <Button asChild variant="gradient">
                  <Link href="/subscription">Go to Subscription</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : isPending ? (
          /* State 2: Pending Admin Verification */
          <Card className="rounded-3xl border-amber-200 bg-white shadow-md overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8" />
                </div>
                <Badge className="bg-amber-500/15 text-amber-700 border-amber-200 font-extrabold">
                  Pending Verification
                </Badge>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  TrxID Submitted — Awaiting Admin Approval
                </h1>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  We received your <strong>{invoice.paymentMethod}</strong> Send
                  Money submission to{" "}
                  <strong>
                    {invoice.receiverNumber || DEFAULT_GATEWAY_NUMBER}
                  </strong>
                  . Admin will verify your TrxID shortly.
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50/50 border border-amber-200/80 p-4 space-y-2.5 text-xs">
                {[
                  ["Invoice #", invoice.invoiceNumber],
                  ["Gateway", `${invoice.paymentMethod || "MFS"} (Send Money)`],
                  [
                    "Sent To (Receiver)",
                    invoice.receiverNumber || DEFAULT_GATEWAY_NUMBER,
                  ],
                  ["Sent From (Sender)", invoice.senderNumber || "—"],
                  ["Transaction ID (TrxID)", invoice.transactionId || "—"],
                  ["Submitted On", fmtDate(invoice.submittedAt || invoice.updatedAt)],
                  ["Amount", tk(invoice.totalDue)],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between border-b border-amber-200/50 last:border-0 pb-2 last:pb-0"
                  >
                    <span className="text-slate-600 font-semibold">{k}</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Button
                  type="button"
                  variant="gradient"
                  disabled={refreshing}
                  onClick={checkLiveStatus}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Check Verification Status
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPending(true)}
                >
                  Entered Wrong TrxID? Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* State 3: Interactive 5-Gateway Send Money Checkout */
          <Card className="rounded-3xl border-slate-200/90 bg-white shadow-lg p-5 sm:p-6">
            <SendMoneyGatewayCard
              mode="invoice"
              invoice={invoice}
              gateways={gateways}
              onSuccess={(updated) => {
                setInvoice(updated);
                setEditingPending(false);
              }}
              onCancel={
                editingPending ? () => setEditingPending(false) : undefined
              }
            />
          </Card>
        )}

        {/* Supported Gateways Footer */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Wallet className="w-3.5 h-3.5" />
          Supported Send Money Gateways ({DEFAULT_GATEWAY_NUMBER}): bKash · Nagad
          · Rocket · Upay · GPay
        </div>
      </div>
    </div>
  );
}
