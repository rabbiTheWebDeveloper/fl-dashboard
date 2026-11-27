"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Boxes,
  CalendarClock,
  CheckCircle2,
  Copy,
  CreditCard,
  Crown,
  FileText,
  HelpCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  markBillingPaidAction,
  subscribeMonthlyPlanAction,
  updateSubscriptionPreferenceAction,
} from "@/app/actions/billing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tk = (n) => `৳${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const DURATION_OPTIONS = [
  { months: 1, label: "Monthly (1 Month)", discount: 0 },
  { months: 3, label: "3 Months", discount: 5, tag: "-5%" },
  { months: 6, label: "6 Months", discount: 10, tag: "-10%" },
  { months: 12, label: "12 Months", discount: 15, tag: "-15%" },
];

const STATUS_BADGE = {
  active: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  trial: "bg-cyan-500/15 text-cyan-700 border-cyan-200",
  past_due: "bg-amber-500/15 text-amber-700 border-amber-200",
  cancelled: "bg-rose-500/15 text-rose-700 border-rose-200",
};

const BILL_BADGE = {
  paid: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  unpaid: "bg-amber-500/10 text-amber-700 border-amber-200",
  overdue: "bg-rose-500/10 text-rose-700 border-rose-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

const FAQS = [
  {
    question: "How does monthly subscription billing work?",
    answer:
      "Each monthly subscription covers 30 full days from activation. If you renew early on your current plan, 30 extra days are added seamlessly onto your existing renewal date so you never lose a single day.",
  },
  {
    question: "Which payment methods are supported for monthly renewal?",
    answer:
      "You can pay instantly via bKash, Nagad, Rocket, Corporate Bank Transfer, or Card, and submit your Transaction ID (TrxID) for immediate activation.",
  },
  {
    question: "Can I upgrade from Basic to Standard or Professional mid-month?",
    answer:
      "Yes! Selecting a higher tier activates your upgraded product and order limits immediately and starts a fresh 30-day cycle.",
  },
  {
    question: "What happens if Auto-Renew is turned on?",
    answer:
      "When Auto-Renew is enabled, your monthly subscription invoice is generated automatically on your renewal date with a 7-day grace period so your storefront stays online uninterrupted.",
  },
];

export default function Subscription({ initialData = {} }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [selectedMonths, setSelectedMonths] = useState(1);

  // Checkout Modal State
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [payMode, setPayMode] = useState("pay_now"); // "pay_now" | "invoice_later"
  const [gateway, setGateway] = useState("bKash");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Open Unpaid Invoice Quick Settle Modal
  const [settleBill, setSettleBill] = useState(null);
  const [settleMethod, setSettleMethod] = useState("bKash");
  const [settleTrx, setSettleTrx] = useState("");
  const [settling, setSettling] = useState(false);

  const [togglingAutoRenew, setTogglingAutoRenew] = useState(false);

  const {
    authenticated = false,
    userId,
    shopId,
    plans = [],
    vatPercent = 5,
    cycleDays = 30,
    gateways = {},
    subscription,
    usage = {},
    recentInvoices = [],
  } = data;

  const activePlanName = subscription?.planName || "Basic";

  const refreshLiveState = async () => {
    try {
      const res = await fetch("/api/subscription");
      const json = await res.json();
      if (json?.success && json.data) {
        setData(json.data);
      }
    } catch {
      // fallback
    }
    router.refresh();
  };

  const computePlanPricing = (plan, months = selectedMonths) => {
    const baseMonthly = Number(plan?.monthlyPrice || 299);
    const opt =
      DURATION_OPTIONS.find((d) => d.months === months) || DURATION_OPTIONS[0];
    const gross = baseMonthly * months;
    const discount = Math.round(gross * (opt.discount / 100));
    const subtotal = gross - discount;
    const vat = Math.round(subtotal * (Number(vatPercent) / 100));
    const total = subtotal + vat;
    const effectiveMonthly = Math.round(subtotal / months);

    return {
      baseMonthly,
      effectiveMonthly,
      months,
      gross,
      discount,
      subtotal,
      vat,
      total,
    };
  };

  const checkoutSummary = useMemo(() => {
    if (!checkoutPlan) return null;
    return computePlanPricing(checkoutPlan, selectedMonths);
  }, [checkoutPlan, selectedMonths, vatPercent]);

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${label}: ${text}`);
    } catch {
      toast.info(text);
    }
  };

  const handleOpenSubscribeModal = (plan) => {
    if (!authenticated || !userId || !shopId) {
      toast.info("Please sign in to your merchant dashboard to subscribe.");
      router.push("/login");
      return;
    }
    setCheckoutPlan(plan);
    setPayMode("pay_now");
    setTransactionId("");
  };

  const handleConfirmSubscription = async (e) => {
    e.preventDefault();
    if (!checkoutPlan) return;

    const payNow = payMode === "pay_now";
    if (payNow && !transactionId.trim()) {
      toast.error("Please enter your payment Transaction ID (TrxID).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await subscribeMonthlyPlanAction({
        userId,
        shopId,
        planName: checkoutPlan.id,
        months: selectedMonths,
        paymentMethod: gateway,
        transactionId: transactionId.trim(),
        payNow,
      });

      if (!res?.success) {
        toast.error(res?.message || "Subscription failed.");
        return;
      }

      toast.success(
        payNow
          ? `${checkoutPlan.name} monthly subscription activated!`
          : `Monthly invoice created for ${checkoutPlan.name}.`
      );
      setCheckoutPlan(null);
      setTransactionId("");
      await refreshLiveState();
    } catch (err) {
      toast.error(err?.message || "Could not complete subscription.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAutoRenew = async (checked) => {
    if (!userId) return;
    setTogglingAutoRenew(true);
    try {
      const res = await updateSubscriptionPreferenceAction({
        userId,
        autoRenew: checked,
      });
      if (res?.success) {
        setData((prev) => ({
          ...prev,
          subscription: {
            ...prev.subscription,
            autoRenew: checked,
          },
        }));
        toast.success(
          checked
            ? "Monthly Auto-Renew enabled."
            : "Monthly Auto-Renew paused."
        );
      } else {
        toast.error(res?.message || "Failed to update Auto-Renew.");
      }
    } finally {
      setTogglingAutoRenew(false);
    }
  };

  const handleSettleOpenInvoice = async (e) => {
    e.preventDefault();
    if (!settleBill || !settleTrx.trim()) {
      toast.error("Please enter your Transaction ID.");
      return;
    }
    setSettling(true);
    try {
      await markBillingPaidAction({
        billingId: settleBill._id,
        paymentMethod: settleMethod,
        transactionId: settleTrx.trim(),
      });
      toast.success("Monthly invoice settled! Subscription active.");
      setSettleBill(null);
      setSettleTrx("");
      await refreshLiveState();
    } catch (err) {
      toast.error(err?.message || "Failed to settle invoice.");
    } finally {
      setSettling(false);
    }
  };

  const activePlanObj =
    plans.find((p) => p.id === activePlanName) || plans[0] || null;

  const gatewayAccountNumber = useMemo(() => {
    if (gateway === "bKash") return gateways?.bkash?.number || "01700000000";
    if (gateway === "Nagad") return gateways?.nagad?.number || "01700000000";
    if (gateway === "Rocket") return gateways?.rocket?.number || "01700000000";
    return "";
  }, [gateway, gateways]);

  const productPct = Math.min(
    100,
    Math.round(
      ((usage.products || 0) / Math.max(1, usage.maxProducts || 100)) * 100
    )
  );
  const orderPct = Math.min(
    100,
    Math.round(
      ((usage.monthlyOrders || 0) /
        Math.max(1, usage.maxMonthlyOrders || 300)) *
        100
    )
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      {/* ─── 1. Active Monthly Subscription Overview Card ─── */}
      {authenticated && subscription && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 shadow-xl border border-white/10 space-y-6">
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 px-3 py-1 text-xs font-extrabold">
                  <Crown className="w-3.5 h-3.5 mr-1 text-amber-300" />
                  {activePlanName} Monthly Plan
                </Badge>
                <Badge
                  className={
                    STATUS_BADGE[subscription.status] || STATUS_BADGE.active
                  }
                >
                  {String(subscription.status || "active").replace("_", " ")}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Monthly Store Subscription
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Next renewal date:{" "}
                <strong className="text-white">
                  {fmtDate(subscription.nextRenewalDate)}
                </strong>{" "}
                ({subscription.daysRemaining} days remaining in current{" "}
                {cycleDays}-day cycle).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 border border-white/15 px-4 py-2.5">
                <span className="text-xs font-bold text-slate-200">
                  Monthly Auto-Renew
                </span>
                <Switch
                  disabled={togglingAutoRenew}
                  checked={Boolean(subscription.autoRenew)}
                  onCheckedChange={handleToggleAutoRenew}
                />
              </div>

              {activePlanObj && (
                <Button
                  type="button"
                  variant="gradient"
                  onClick={() => {
                    setSelectedMonths(1);
                    handleOpenSubscribeModal(activePlanObj);
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Renew +1 Month ({tk(activePlanObj.monthlyPrice)})
                </Button>
              )}
            </div>
          </div>

          {/* Unpaid / Overdue Monthly Bill Alert */}
          {subscription.openInvoice && (
            <div className="relative z-10 rounded-2xl bg-amber-500/15 border border-amber-400/35 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-amber-200">
                    Open Monthly Invoice:{" "}
                    {subscription.openInvoice.invoiceNumber} (
                    {tk(subscription.openInvoice.totalDue)})
                  </p>
                  <p className="text-xs text-amber-100/80">
                    Due by {fmtDate(subscription.openInvoice.dueDate)} — submit your payment TrxID to keep your subscription active.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => setSettleBill(subscription.openInvoice)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold shrink-0"
              >
                Pay Monthly Bill Now
              </Button>
            </div>
          )}

          {/* Live Monthly Plan Quota Bars */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Boxes className="w-4 h-4 text-violet-400" /> Active Catalog Products
                </span>
                <span className="font-extrabold text-white">
                  {usage.products || 0} /{" "}
                  {(usage.maxProducts || 100) >= 999999
                    ? "Unlimited"
                    : usage.maxProducts}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                  style={{
                    width: `${
                      (usage.maxProducts || 100) >= 999999 ? 12 : productPct
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" /> This Month&apos;s Orders
                </span>
                <span className="font-extrabold text-white">
                  {usage.monthlyOrders || 0} /{" "}
                  {(usage.maxMonthlyOrders || 300) >= 999999
                    ? "Unlimited"
                    : usage.maxMonthlyOrders}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                  style={{
                    width: `${
                      (usage.maxMonthlyOrders || 300) >= 999999 ? 12 : orderPct
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. Section Heading & Monthly Cycle Selector ─── */}
      <div className="text-center space-y-4 pt-2">
        <Badge className="bg-violet-500/10 text-violet-700 border-violet-200">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Monthly Merchant Plans
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Choose Your <span className="rgb-gradient-text">Monthly Plan</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
          Simple {cycleDays}-day monthly billing with instant bKash, Nagad, Rocket, or Bank activation. Prepay multiple months anytime to unlock extra savings.
        </p>

        {/* Duration Selector Pills (Default: 1 Month) */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          {DURATION_OPTIONS.map((opt) => {
            const active = selectedMonths === opt.months;
            return (
              <button
                key={opt.months}
                type="button"
                onClick={() => setSelectedMonths(opt.months)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{opt.label}</span>
                {opt.tag && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      active
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {opt.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. Monthly Plan Cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const isCurrent = authenticated && activePlanName === plan.id;
          const calc = computePlanPricing(plan, selectedMonths);

          return (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between transition-all duration-200 ${
                plan.popular
                  ? "rgb-card border-violet-400 shadow-xl bg-white lg:-translate-y-1.5"
                  : isCurrent
                  ? "border-2 border-emerald-500 bg-white shadow-md"
                  : "border-slate-200/80 bg-white/95 hover:shadow-md"
              }`}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-xl font-extrabold text-slate-900">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    {isCurrent && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200">
                        <BadgeCheck className="w-3 h-3 mr-1" /> Current
                      </Badge>
                    )}
                    {plan.popular && (
                      <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0">
                        <Zap className="w-3 h-3 mr-1" /> Popular
                      </Badge>
                    )}
                  </div>
                </div>

                <CardDescription className="text-xs">
                  {plan.description}
                </CardDescription>

                <div className="pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {tk(calc.effectiveMonthly)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      /month
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {selectedMonths === 1
                      ? `${tk(calc.total)}/month incl. ${vatPercent}% VAT`
                      : `Billed ${tk(calc.total)} for ${selectedMonths} months (incl. ${vatPercent}% VAT)`}
                  </p>
                  {calc.discount > 0 && (
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">
                      You save {tk(calc.discount)} on {selectedMonths}-month billing
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  {(plan.features || []).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  type="button"
                  variant={plan.popular || isCurrent ? "gradient" : "outline"}
                  className="w-full h-11 font-extrabold"
                  onClick={() => handleOpenSubscribeModal(plan)}
                >
                  {isCurrent
                    ? `Extend ${plan.name} (+${selectedMonths} Mo)`
                    : `Subscribe to ${plan.name}`}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* ─── 4. Recent Monthly Subscription Invoices ─── */}
      {authenticated && recentInvoices.length > 0 && (
        <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <CardTitle className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-violet-600" />
                Monthly Subscription History
              </CardTitle>
              <CardDescription className="text-xs">
                Recent monthly plan renewals and invoices
              </CardDescription>
            </div>
            <Link
              href="/dashboard/billings"
              className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1"
            >
              All Invoices <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead className="font-bold">Invoice #</TableHead>
                  <TableHead className="font-bold">Plan & Cycle</TableHead>
                  <TableHead className="font-bold">Coverage Period</TableHead>
                  <TableHead className="font-bold">Gateway</TableHead>
                  <TableHead className="font-bold text-right">Total</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="font-bold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((inv) => (
                  <TableRow key={inv._id}>
                    <TableCell className="font-mono font-bold text-xs text-violet-700">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-xs text-slate-900">
                        {inv.planName || "Basic"}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {inv.invoiceTitle}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {fmtDate(inv.billingPeriodStart)} →{" "}
                      {fmtDate(inv.billingPeriodEnd)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {inv.paymentMethod ? (
                        <div>
                          <span className="font-bold text-slate-800">
                            {inv.paymentMethod}
                          </span>
                          {inv.transactionId && (
                            <p className="text-[10px] font-mono text-slate-400">
                              {inv.transactionId}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-slate-900">
                      {tk(inv.totalDue)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={BILL_BADGE[inv.status] || BILL_BADGE.unpaid}
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.status === "unpaid" || inv.status === "overdue" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="gradient"
                          className="h-7 text-xs"
                          onClick={() => setSettleBill(inv)}
                        >
                          Pay Now
                        </Button>
                      ) : (
                        <Link
                          href="/dashboard/billings"
                          className="text-xs font-bold text-slate-500 hover:text-violet-600 inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> Receipt
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ─── 5. FAQ Accordion ─── */}
      <Card className="border-slate-200/80 bg-white/95 max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-1">
            <HelpCircle className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            Monthly Subscription FAQs
          </CardTitle>
          <CardDescription>
            How monthly renewals, upgrades, and payments work on AMARDokan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-sm font-semibold text-slate-900 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* ─── Modal A: Monthly Subscription Checkout Dialog ─── */}
      <Dialog
        open={Boolean(checkoutPlan)}
        onOpenChange={(open) => {
          if (!open) setCheckoutPlan(null);
        }}
      >
        <DialogContent className="sm:max-w-lg rounded-3xl bg-white max-h-[92vh] overflow-y-auto">
          {checkoutPlan && checkoutSummary && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-violet-600" />
                  {checkoutPlan.name} —{" "}
                  {selectedMonths === 1
                    ? "Monthly Subscription"
                    : `${selectedMonths}-Month Subscription`}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Activates {cycleDays * selectedMonths} days of full{" "}
                  <strong>{checkoutPlan.name}</strong> access for your store.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleConfirmSubscription} className="space-y-4 pt-1">
                {/* Summary Box */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {checkoutPlan.name} ({selectedMonths}{" "}
                      {selectedMonths === 1 ? "month" : "months"})
                    </span>
                    <span className="font-bold text-slate-900">
                      {tk(checkoutSummary.gross)}
                    </span>
                  </div>
                  {checkoutSummary.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Multi-Month Discount</span>
                      <span>-{tk(checkoutSummary.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Platform VAT ({vatPercent}%)</span>
                    <span className="font-bold text-slate-900">
                      +{tk(checkoutSummary.vat)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                    <span className="font-extrabold text-slate-900">
                      Total Payable
                    </span>
                    <span className="font-extrabold text-violet-600 text-base">
                      {tk(checkoutSummary.total)}
                    </span>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setPayMode("pay_now")}
                    className={`py-2 rounded-lg text-xs font-extrabold transition ${
                      payMode === "pay_now"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500"
                    }`}
                  >
                    Pay & Activate Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMode("invoice_later")}
                    className={`py-2 rounded-lg text-xs font-extrabold transition ${
                      payMode === "invoice_later"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500"
                    }`}
                  >
                    Generate Monthly Bill
                  </button>
                </div>

                {payMode === "pay_now" ? (
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        Select Payment Gateway
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {["bKash", "Nagad", "Rocket", "Bank Transfer"].map(
                          (m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setGateway(m)}
                              className={`py-2 px-2.5 rounded-xl border text-xs font-extrabold transition ${
                                gateway === m
                                  ? "border-violet-600 bg-violet-50 text-violet-700"
                                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {m}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Gateway Payment Instructions */}
                    {gateway === "Bank Transfer" ? (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs space-y-1">
                        <p className="font-extrabold text-blue-900">
                          Bank Transfer Details:
                        </p>
                        <p className="text-blue-800">
                          Bank: <strong>{gateways?.bank_transfer?.bankName || "City Bank PLC"}</strong>
                        </p>
                        <p className="text-blue-800">
                          A/C Name:{" "}
                          <strong>
                            {gateways?.bank_transfer?.accountName ||
                              "AMARDokan Technologies"}
                          </strong>
                        </p>
                        {gateways?.bank_transfer?.accountNumber && (
                          <p className="text-blue-800 font-mono">
                            A/C No: {gateways.bank_transfer.accountNumber}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-3.5 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-extrabold text-slate-900">
                            Send {tk(checkoutSummary.total)} via {gateway}
                          </p>
                          <p className="text-slate-600 font-mono mt-0.5">
                            Account: <strong>{gatewayAccountNumber}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(gatewayAccountNumber, `${gateway} Number`)
                          }
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        Transaction ID (TrxID / Bank Ref) *
                      </Label>
                      <Input
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. BKS94M72X1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 space-y-1">
                    <p className="font-extrabold">Pay within 7-Day Grace Period</p>
                    <p>
                      An official monthly invoice for{" "}
                      <strong>{tk(checkoutSummary.total)}</strong> will be added to your{" "}
                      <strong>Billing & Invoices</strong> ledger so you can settle it anytime within 7 days.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCheckoutPlan(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {payMode === "pay_now"
                      ? `Confirm & Activate (${tk(checkoutSummary.total)})`
                      : "Generate Monthly Invoice"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Modal B: Settle Open Monthly Bill ─── */}
      <Dialog
        open={Boolean(settleBill)}
        onOpenChange={(o) => {
          if (!o) setSettleBill(null);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-violet-600" />
              Settle Monthly Invoice
            </DialogTitle>
            <DialogDescription className="text-xs">
              Invoice <strong>{settleBill?.invoiceNumber}</strong> — Total Due:{" "}
              <strong>{tk(settleBill?.totalDue)}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSettleOpenInvoice} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Payment Method</Label>
              <select
                value={settleMethod}
                onChange={(e) => setSettleMethod(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Transaction ID (TrxID) *</Label>
              <Input
                required
                value={settleTrx}
                onChange={(e) => setSettleTrx(e.target.value)}
                placeholder="Enter TrxID"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSettleBill(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={settling}>
                {settling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Submit Payment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
