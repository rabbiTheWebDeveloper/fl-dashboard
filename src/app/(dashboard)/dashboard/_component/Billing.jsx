"use client";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { createManualBillingAction, markBillingPaidAction, generateMonthlyBillingsAction } from "@/app/actions/billing";
import { PLANS } from "@/config/billingConfig";
import { useRouter } from "next/navigation";

const tk = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_STYLE = {
  paid:      "bg-green-100 text-green-700 border-green-200",
  unpaid:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  overdue:   "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

function InvoicePrint({ bill, onClose }) {
  const printRef = useRef();
  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Invoice ${bill.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
        .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
        .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
        h1 { font-size: 18px; margin: 0 0 4px; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th { background: #f3f4f6; padding: 10px 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        .total-row { font-weight: bold; background: #f9fafb; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: ${bill.status === "paid" ? "#dcfce7" : "#fef9c3"}; color: ${bill.status === "paid" ? "#166534" : "#854d0e"}; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .info-block label { font-size: 11px; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .info-block p { font-size: 14px; margin: 0; font-weight: 500; }
        .footer { margin-top: 48px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style></head><body>
      <div class="header">
        <div><div class="logo">FunnelLiner</div><p style="font-size:12px;color:#6b7280;margin:4px 0">Bangladesh's #1 E-commerce Platform</p></div>
        <div style="text-align:right">
          <h1>INVOICE</h1>
          <p style="margin:0;font-size:13px;color:#6b7280">${bill.invoiceNumber}</p>
          <span class="badge">${bill.status.toUpperCase()}</span>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-block"><label>Bill Date</label><p>${fmtDate(bill.createdAt)}</p></div>
        <div class="info-block"><label>Due Date</label><p>${fmtDate(bill.dueDate)}</p></div>
        <div class="info-block"><label>Billing Period</label><p>${fmtDate(bill.billingPeriodStart)} – ${fmtDate(bill.billingPeriodEnd)}</p></div>
        <div class="info-block"><label>Plan</label><p>${bill.planName}</p></div>
        ${bill.status === "paid" ? `<div class="info-block"><label>Paid On</label><p>${fmtDate(bill.paidAt)}</p></div><div class="info-block"><label>Payment Method</label><p>${bill.paymentMethod || "—"}</p></div>` : ""}
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
      ${bill.transactionId ? `<p style="font-size:13px;color:#6b7280">Transaction ID: <strong>${bill.transactionId}</strong></p>` : ""}
      <div class="footer"><p>Thank you for your business! For support: support@funnelliner.com</p><p>FunnelLiner | Dhaka, Bangladesh</p></div>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800">Invoice — {bill.invoiceNumber}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="p-6 space-y-3 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-4">
            {[["Invoice #", bill.invoiceNumber], ["Plan", bill.planName], ["Period", `${fmtDate(bill.billingPeriodStart)} – ${fmtDate(bill.billingPeriodEnd)}`], ["Due Date", fmtDate(bill.dueDate)], ["Amount", tk(bill.amount)], ["VAT (5%)", tk(bill.tax)], ["Total Due", tk(bill.totalDue)], ["Status", bill.status]].map(([k, v]) => (
              <div key={k}><p className="text-xs text-gray-400 uppercase font-semibold">{k}</p><p className="font-medium mt-0.5">{v}</p></div>
            ))}
            {bill.status === "paid" && <><div><p className="text-xs text-gray-400 uppercase font-semibold">Paid On</p><p className="font-medium mt-0.5">{fmtDate(bill.paidAt)}</p></div><div><p className="text-xs text-gray-400 uppercase font-semibold">Method</p><p className="font-medium mt-0.5">{bill.paymentMethod || "—"}</p></div></>}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Close</button>
          <button onClick={handlePrint} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function PayModal({ bill, onClose, onDone }) {
  const [method, setMethod] = useState("bkash");
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    if (!txnId.trim()) { toast.error("Enter transaction ID"); return; }
    setLoading(true);
    try {
      await markBillingPaidAction({ billingId: bill._id, paymentMethod: method, transactionId: txnId });
      toast.success("Invoice marked as paid!");
      onDone();
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800">Mark as Paid</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
            Invoice <strong>{bill.invoiceNumber}</strong> — Total: <strong>{tk(bill.totalDue)}</strong>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
              {["bkash","nagad","rocket","bank_transfer","cash","card"].map(m => <option key={m} value={m}>{m.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Transaction ID <span className="text-red-500">*</span></label>
            <input value={txnId} onChange={e => setTxnId(e.target.value)} placeholder="e.g. TRX123456789" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 transition-all"/>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handlePay} disabled={loading} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage({ billings: initialBillings = [], summary = {}, user }) {
  const router = useRouter();
  const [billings, setBillings] = useState(initialBillings);
  const [filter, setFilter] = useState("all");
  const [viewBill, setViewBill] = useState(null);
  const [payBill, setPayBill] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const filtered = filter === "all" ? billings : billings.filter(b => b.status === filter);

  const handleGenerate = async () => {
    setGenLoading(true);
    try {
      const res = await generateMonthlyBillingsAction();
      toast.success(`Generated ${res.created} new invoice(s)`);
      router.refresh();
    } catch (e) { toast.error(e.message); }
    finally { setGenLoading(false); }
  };

  const handleCreateNow = async () => {
    setCreateLoading(true);
    try {
      await createManualBillingAction({ userId: user?.userId, shopId: user?.shopId, planName: "Basic" });
      toast.success("Invoice created!");
      router.refresh();
    } catch (e) { toast.error(e.message); }
    finally { setCreateLoading(false); }
  };

  const handlePayDone = () => { setPayBill(null); router.refresh(); };

  const stats = [
    { label: "Total Invoices", value: summary.total || 0, icon: "📄", color: "bg-indigo-50 text-indigo-700" },
    { label: "Paid", value: summary.paid || 0, icon: "✅", color: "bg-green-50 text-green-700" },
    { label: "Unpaid", value: summary.unpaid || 0, icon: "⏳", color: "bg-yellow-50 text-yellow-700" },
    { label: "Overdue", value: summary.overdue || 0, icon: "🔴", color: "bg-red-50 text-red-700" },
    { label: "Total Paid", value: tk(summary.totalPaid || 0), icon: "💰", color: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {viewBill && <InvoicePrint bill={viewBill} onClose={() => setViewBill(null)} />}
      {payBill && <PayModal bill={payBill} onClose={() => setPayBill(null)} onDone={handlePayDone} />}

      {/* Header */}
      <div className="bg-white border-b px-6 py-5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Billing & Invoices</h1>
            <p className="text-xs text-gray-400 mt-0.5">Monthly platform fee · Auto-generated every 30 days</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleCreateNow} disabled={createLoading} className="px-4 py-2 text-sm border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5">
              {createLoading ? <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"/> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>}
              New Invoice
            </button>
            <button onClick={handleGenerate} disabled={genLoading} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5">
              {genLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>}
              Run Auto-Billing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map(s => (
            <div key={s.label} className={`rounded-xl p-4 border border-gray-200 bg-white shadow-sm`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Billing cycle info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <p className="text-sm font-semibold text-indigo-800">Auto-Billing Active</p>
            <p className="text-xs text-indigo-600 mt-0.5">Invoices are auto-generated every 30 days from account creation. You have a 7-day grace period after each invoice due date. Current plan: <strong>Basic — ৳299/month</strong> + 5% VAT.</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {["all","unpaid","paid","overdue"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-5 py-3 text-sm font-medium capitalize transition-colors ${filter === f ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                {f === "all" ? `All (${billings.length})` : f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Invoice #","Issue Date","Period","Amount","Status","Due Date","Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="font-medium text-gray-500">No invoices found</p>
                    <p className="text-xs mt-1">Click "New Invoice" to create one manually</p>
                  </td></tr>
                ) : filtered.map(bill => (
                  <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-indigo-700">{bill.invoiceNumber}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{fmtDate(bill.createdAt)}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap text-xs">{fmtDate(bill.billingPeriodStart)} – {fmtDate(bill.billingPeriodEnd)}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">{tk(bill.totalDue)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[bill.status] || STATUS_STYLE.unpaid}`}>
                        {bill.status === "paid" && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"/>}
                        {bill.status === "unpaid" && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5 animate-pulse"/>}
                        {bill.status === "overdue" && <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"/>}
                        {bill.status.charAt(0).toUpperCase()+bill.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-5 py-4 whitespace-nowrap text-xs font-medium ${bill.status !== "paid" && new Date(bill.dueDate) < new Date() ? "text-red-600" : "text-gray-600"}`}>{fmtDate(bill.dueDate)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewBill(bill)} className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
                          Print
                        </button>
                        {(bill.status === "unpaid" || bill.status === "overdue") && (
                          <button onClick={() => setPayBill(bill)} className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap">
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plans reference */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Available Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(PLANS).map(([name, plan]) => (
              <div key={name} className={`bg-white rounded-xl border-2 p-5 shadow-sm ${name === "Standard" ? "border-indigo-400" : "border-gray-200"}`}>
                {name === "Standard" && <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">Most Popular</p>}
                <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{tk(plan.price)}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
