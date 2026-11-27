"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Loader2,
  Phone,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  BD_SENDER_PHONE_REGEX,
  DEFAULT_GATEWAY_NUMBER,
  SEND_MONEY_GATEWAYS,
  TRX_ID_REGEX,
  normalizeSenderPhone,
  normalizeTrxId,
} from "@/config/paymentGatewayConfig";
import { subscribeMonthlyPlanAction } from "@/app/actions/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tk = (n) => `৳${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;

/**
 * Resolve the 5 Send Money gateways (`bKash`, `Nagad`, `Rocket`, `Upay`, `GPay`)
 * merging any dynamic admin numbers while defaulting to `01726278251`.
 */
export function resolveGatewayOptions(gatewaysProp) {
  if (Array.isArray(gatewaysProp) && gatewaysProp.length > 0) {
    return gatewaysProp.filter((g) => g.enabled !== false);
  }
  return SEND_MONEY_GATEWAYS.map((g) => {
    const cfg = gatewaysProp?.[g.key];
    const rawNum = String(cfg?.number || "").trim();
    const number =
      !rawNum || rawNum === "01700000000" ? DEFAULT_GATEWAY_NUMBER : rawNum;
    const enabled = cfg ? cfg.enabled !== false : true;
    return {
      ...g,
      number,
      enabled,
    };
  }).filter((g) => g.enabled);
}

export function SendMoneyGatewayCard({
  mode = "invoice", // "invoice" | "subscription"
  invoice = null,
  subscriptionPayload = null,
  gateways: gatewaysProp = null,
  allowInvoiceLater = false,
  onSuccess,
  onCancel,
}) {
  const gatewayList = useMemo(
    () => resolveGatewayOptions(gatewaysProp),
    [gatewaysProp]
  );

  const initialMethod =
    invoice?.paymentMethod &&
    gatewayList.some(
      (g) => g.id.toLowerCase() === String(invoice.paymentMethod).toLowerCase()
    )
      ? gatewayList.find(
          (g) =>
            g.id.toLowerCase() === String(invoice.paymentMethod).toLowerCase()
        ).id
      : gatewayList[0]?.id || "bKash";

  const [selectedId, setSelectedId] = useState(initialMethod);
  const [payMode, setPayMode] = useState("pay_now"); // "pay_now" | "invoice_later"
  const [senderNumber, setSenderNumber] = useState(invoice?.senderNumber || "");
  const [transactionId, setTransactionId] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  const activeGateway = useMemo(
    () =>
      gatewayList.find((g) => g.id === selectedId) ||
      gatewayList[0] ||
      SEND_MONEY_GATEWAYS[0],
    [gatewayList, selectedId]
  );

  const receiverNumber = activeGateway?.number || DEFAULT_GATEWAY_NUMBER;

  const payableTotal =
    mode === "invoice"
      ? Number(invoice?.totalDue || 0)
      : Number(subscriptionPayload?.summary?.total || 0);

  const titleText =
    mode === "invoice"
      ? invoice?.invoiceTitle || `Invoice ${invoice?.invoiceNumber || ""}`
      : `${subscriptionPayload?.planName || "Standard"} Plan — ${
          subscriptionPayload?.months === 1
            ? "Monthly Subscription"
            : `${subscriptionPayload?.months || 1}-Month Subscription`
        }`;

  const copyValue = async (val, key, label) => {
    try {
      await navigator.clipboard.writeText(String(val));
      setCopiedKey(key);
      toast.success(`${label} copied: ${val}`);
      setTimeout(() => setCopiedKey(""), 2000);
    } catch {
      toast.info(`${label}: ${val}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional "Generate Monthly Bill" mode for subscriptions
    if (mode === "subscription" && allowInvoiceLater && payMode === "invoice_later") {
      setSubmitting(true);
      try {
        const res = await subscribeMonthlyPlanAction({
          userId: subscriptionPayload.userId,
          shopId: subscriptionPayload.shopId,
          planName: subscriptionPayload.planName,
          months: subscriptionPayload.months || 1,
          payNow: false,
        });
        if (!res?.success) {
          toast.error(res?.message || "Failed to generate invoice.");
          return;
        }
        toast.success("Monthly invoice generated! Settle within 7 days.");
        onSuccess?.(res.data?.invoice || res.data);
      } catch (err) {
        toast.error(err?.message || "Could not generate invoice.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const cleanSender = normalizeSenderPhone(senderNumber);
    if (!cleanSender || !BD_SENDER_PHONE_REGEX.test(cleanSender)) {
      toast.error(
        "Please enter the 11-digit mobile number you sent money from (01XXXXXXXXX)."
      );
      return;
    }

    const cleanTrx = normalizeTrxId(transactionId);
    if (!cleanTrx || !TRX_ID_REGEX.test(cleanTrx)) {
      toast.error(
        "Please enter a valid Transaction ID (TrxID) between 5 and 32 characters."
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload =
        mode === "invoice"
          ? {
              billingId: invoice._id,
              paymentMethod: activeGateway.id,
              senderNumber: cleanSender,
              transactionId: cleanTrx,
            }
          : {
              userId: subscriptionPayload.userId,
              shopId: subscriptionPayload.shopId,
              planName: subscriptionPayload.planName,
              months: subscriptionPayload.months || 1,
              paymentMethod: activeGateway.id,
              senderNumber: cleanSender,
              transactionId: cleanTrx,
            };

      const res = await fetch("/api/payment-gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to submit TrxID.");
        return;
      }

      toast.success(
        json.message ||
          "TrxID submitted! Admin will verify and activate shortly."
      );
      setSubmittedReceipt(json.data);
      onSuccess?.(json.data);
    } catch (err) {
      toast.error(err?.message || "Network error submitting payment TrxID.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReceipt) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <Badge className="bg-amber-500/15 text-amber-700 border-amber-200 font-extrabold">
            Pending Admin Verification
          </Badge>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Send Money TrxID Submitted!
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your payment details have been recorded. Once verified against{" "}
            <strong className="text-slate-800">{receiverNumber}</strong>, your
            subscription invoice will be marked <strong>Paid</strong> automatically.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 space-y-2.5 text-xs">
          {[
            ["Invoice #", submittedReceipt.invoiceNumber || "—"],
            ["Payment Gateway", `${submittedReceipt.paymentMethod} (Send Money)`],
            [
              "Receiver Number",
              submittedReceipt.receiverNumber || DEFAULT_GATEWAY_NUMBER,
            ],
            ["Sender Number", submittedReceipt.senderNumber || "—"],
            ["Transaction ID (TrxID)", submittedReceipt.transactionId || "—"],
            ["Submitted Amount", tk(submittedReceipt.totalDue || payableTotal)],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-2 border-b border-slate-200/60 last:border-0 pb-2 last:pb-0"
            >
              <span className="text-slate-500 font-semibold">{k}</span>
              <span className="font-extrabold text-slate-900 font-mono">{v}</span>
            </div>
          ))}
        </div>

        {onCancel && (
          <Button
            type="button"
            variant="gradient"
            className="w-full h-11 font-extrabold"
            onClick={onCancel}
          >
            <CheckCircle2 className="w-4 h-4" />
            Done
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Gateway Top Summary Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white p-4 sm:p-5 border border-slate-800">
        <div
          className="pointer-events-none absolute -right-12 -top-12 w-40 h-40 rounded-full blur-2xl opacity-35"
          style={{ backgroundColor: activeGateway.accent }}
        />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Send Money Gateway
            </div>
            <p className="text-sm sm:text-base font-extrabold truncate">
              {titleText}
            </p>
            {invoice?.invoiceNumber && (
              <p className="text-[11px] font-mono text-slate-400">
                Ref: {invoice.invoiceNumber}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Payable Total
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {tk(payableTotal)}
            </p>
            <button
              type="button"
              onClick={() =>
                copyValue(Math.round(payableTotal), "amount", "Amount")
              }
              className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 hover:text-cyan-200"
            >
              {copiedKey === "amount" ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              Copy Amount
            </button>
          </div>
        </div>

        {/* Price breakdown for subscription mode */}
        {mode === "subscription" && subscriptionPayload?.summary && (
          <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
            <span>
              Plan Subtotal:{" "}
              <strong className="text-white">
                {tk(subscriptionPayload.summary.subtotal)}
              </strong>
            </span>
            {subscriptionPayload.summary.discount > 0 && (
              <span className="text-emerald-400 font-bold">
                Saved {tk(subscriptionPayload.summary.discount)}
              </span>
            )}
            <span>
              VAT ({subscriptionPayload.vatPercent ?? 5}%):{" "}
              <strong className="text-white">
                +{tk(subscriptionPayload.summary.vat)}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Previous Rejection Alert if re-submitting */}
      {invoice?.status === "rejected" && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 flex items-start gap-2.5 text-xs text-rose-900">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold">Previous TrxID Could Not Be Verified</p>
            <p className="text-rose-700 mt-0.5">
              {invoice.verificationNote ||
                `Rejected TrxID (${invoice.transactionId || "—"}). Please double-check your SMS and submit the valid Send Money TrxID below.`}
            </p>
          </div>
        </div>
      )}

      {/* Optional Pay Now vs Generate Bill toggle */}
      {mode === "subscription" && allowInvoiceLater && (
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={() => setPayMode("pay_now")}
            className={`py-2 rounded-lg text-xs font-extrabold transition ${
              payMode === "pay_now"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Send Money & Submit TrxID
          </button>
          <button
            type="button"
            onClick={() => setPayMode("invoice_later")}
            className={`py-2 rounded-lg text-xs font-extrabold transition ${
              payMode === "invoice_later"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Generate Unpaid Invoice
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {payMode === "pay_now" ? (
          <>
            {/* ─── 5 MFS Gateway Selector Grid ─── */}
            <div className="space-y-2">
              <Label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                <span>1. Select Send Money Gateway</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  bKash · Nagad · Rocket · Upay · GPay
                </span>
              </Label>

              <div className="grid grid-cols-5 gap-2">
                {gatewayList.map((gw) => {
                  const selected = gw.id === activeGateway.id;
                  return (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedId(gw.id)}
                      style={{
                        borderColor: selected ? gw.accent : undefined,
                        backgroundColor: selected ? gw.softBg : "#ffffff",
                      }}
                      className={`relative rounded-2xl border p-2.5 text-center transition flex flex-col items-center justify-center gap-1 ${
                        selected
                          ? "border-2 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                      }`}
                    >
                      {selected && (
                        <span
                          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                          style={{ backgroundColor: gw.accent }}
                        >
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                      <span
                        className="w-8 h-8 rounded-xl text-white font-extrabold text-xs flex items-center justify-center shadow-2xs"
                        style={{ backgroundColor: gw.accent }}
                      >
                        {gw.name.slice(0, 2)}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 leading-tight">
                        {gw.name}
                      </span>
                      <span className="text-[10px] text-slate-500 bangla-text leading-none">
                        {gw.bnName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── Send Money Receiver Box (`01726278251`) ─── */}
            <div
              className="rounded-2xl border-2 p-4 space-y-3 transition"
              style={{
                borderColor: activeGateway.border,
                backgroundColor: activeGateway.softBg,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white"
                      style={{ backgroundColor: activeGateway.accent }}
                    >
                      {activeGateway.name} Send Money
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Dial {activeGateway.ussd} or App
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-mono font-extrabold tracking-wider text-slate-900 pt-0.5">
                    {receiverNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Personal Send Money Number · Exact Amount:{" "}
                    <strong className="text-slate-900">{tk(payableTotal)}</strong>
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyValue(
                      receiverNumber,
                      "number",
                      `${activeGateway.name} Send Money Number`
                    )
                  }
                  className="font-extrabold border-slate-300 bg-white hover:bg-slate-50 shrink-0"
                >
                  {copiedKey === "number" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy {receiverNumber}
                    </>
                  )}
                </Button>
              </div>

              {/* Step-by-step instructions */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Smartphone
                    className="w-3.5 h-3.5"
                    style={{ color: activeGateway.accent }}
                  />
                  How to Send Money via {activeGateway.name}:
                </p>
                <ol className="space-y-1 pl-4 list-decimal text-[11px] sm:text-xs text-slate-700">
                  {(activeGateway.steps || []).map((step, i) => (
                    <li key={i}>
                      {step.replace(DEFAULT_GATEWAY_NUMBER, receiverNumber)}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* ─── Sender Phone + Transaction ID Inputs ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Sender {activeGateway.name} Number *
                </Label>
                <Input
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={14}
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="01XXXXXXXXX (যে নাম্বার থেকে পাঠিয়েছেন)"
                  className="bg-white font-mono text-sm h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Transaction ID (TrxID) *
                </Label>
                <Input
                  required
                  maxLength={32}
                  value={transactionId}
                  onChange={(e) =>
                    setTransactionId(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. BKS84M92LP"
                  className="bg-white font-mono uppercase text-sm h-10"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-1">
            <p className="font-extrabold">7-Day Grace Period Invoice</p>
            <p>
              Creates an unpaid monthly invoice for{" "}
              <strong>{tk(payableTotal)}</strong> in your Billing ledger so you
              can send money to <strong>{DEFAULT_GATEWAY_NUMBER}</strong> and
              submit your TrxID within 7 days.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={submitting}
            style={
              payMode === "pay_now"
                ? { backgroundColor: activeGateway.accent, color: "#ffffff" }
                : undefined
            }
            variant={payMode === "pay_now" ? "default" : "gradient"}
            className="h-11 px-5 font-extrabold hover:opacity-95 flex-1 sm:flex-initial"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BadgeCheck className="w-4 h-4" />
            )}
            {payMode === "pay_now"
              ? `Submit ${activeGateway.name} TrxID (${tk(payableTotal)})`
              : "Generate Monthly Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function SendMoneyGatewayDialog({
  open,
  onOpenChange,
  dialogTitle = "AMARDokan Payment Gateway",
  dialogDescription = "Send Money to 01726278251 via bKash, Nagad, Rocket, Upay, or GPay and submit your TrxID for verification.",
  ...cardProps
}) {
  return (
    <Dialog open={Boolean(open)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl bg-white max-h-[93vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-violet-600" />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <SendMoneyGatewayCard
            {...cardProps}
            onCancel={() => onOpenChange?.(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SendMoneyGatewayCard;
