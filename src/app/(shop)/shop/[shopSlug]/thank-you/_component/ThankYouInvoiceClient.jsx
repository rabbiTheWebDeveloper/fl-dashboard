/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Printer,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  buildStorePalette,
  formatPrice,
  parseHex,
  rgba,
} from "../../_lib/storefrontUtils";

/**
 * Draw a crisp Retina A4 Invoice onto an HTML5 Canvas (preserving full Bengali/Unicode
 * shaping + brand colors) and export as a downloadable `.pdf` file via `jsPDF`.
 */
async function generateInvoicePdf({ store, order, palette }) {
  const { jsPDF } = await import("jspdf");

  const scale = 2;
  const width = 794; // A4 @ 96 DPI
  const minHeight = 1123;
  const itemRowsHeight = Math.max(0, (order.items?.length || 1) - 4) * 52;
  const height = minHeight + itemRowsHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const fontSans =
    "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans Bengali', sans-serif";

  // White Page Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Top Brand Accent Banner
  const pRgb = parseHex(palette.primary);
  const sRgb = parseHex(palette.secondary);
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, `rgb(${pRgb.r}, ${pRgb.g}, ${pRgb.b})`);
  grad.addColorStop(1, `rgb(${sRgb.r}, ${sRgb.g}, ${sRgb.b})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, 128);

  // Store Name & Official Invoice Title
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 26px ${fontSans}`;
  ctx.fillText(String(store.shop.shopName || "AMARDokan Store"), 48, 56);

  ctx.font = `500 12px ${fontSans}`;
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  const storeContactLine = [
    store.shopInfo?.shopAddress,
    store.shopInfo?.phone || store.merchant?.phone,
    store.shopInfo?.email || store.merchant?.email,
  ]
    .filter(Boolean)
    .join("  •  ");
  ctx.fillText(
    storeContactLine.slice(0, 90) || `Shop Slug: /shop/${store.shop.shopSlug}`,
    48,
    82
  );
  ctx.fillText(`Store ID: #${store.shop.shopId}`, 48, 102);

  ctx.textAlign = "right";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 28px ${fontSans}`;
  ctx.fillText("INVOICE", width - 48, 56);
  ctx.font = `700 13px ${fontSans}`;
  ctx.fillText(`#${order.invoiceNo}`, width - 48, 82);
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB");
  ctx.font = `500 12px ${fontSans}`;
  ctx.fillText(`Issued: ${formattedDate}`, width - 48, 102);
  ctx.textAlign = "left";

  // Bill To & Order Info Boxes
  const boxY = 158;
  ctx.fillStyle = "#f8fafc";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(48, boxY, 336, 132, 12);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(410, boxY, 336, 132, 12);
  ctx.fill();
  ctx.stroke();

  // Left Box: Bill & Ship To
  ctx.fillStyle = "#64748b";
  ctx.font = `700 10px ${fontSans}`;
  ctx.fillText("BILL & DELIVER TO", 66, boxY + 26);

  ctx.fillStyle = "#0f172a";
  ctx.font = `700 15px ${fontSans}`;
  ctx.fillText(
    String(order.customer?.customerName || "Customer").slice(0, 38),
    66,
    boxY + 50
  );

  ctx.fillStyle = "#334155";
  ctx.font = `600 12px ${fontSans}`;
  ctx.fillText(
    `Phone: ${order.customer?.customerPhone || "—"}`,
    66,
    boxY + 72
  );

  ctx.font = `400 12px ${fontSans}`;
  const addr = String(order.customer?.customerAddress || "—");
  ctx.fillText(addr.slice(0, 46), 66, boxY + 94);
  if (addr.length > 46) {
    ctx.fillText(addr.slice(46, 92), 66, boxY + 112);
  }

  // Right Box: Payment & Order Meta
  ctx.fillStyle = "#64748b";
  ctx.font = `700 10px ${fontSans}`;
  ctx.fillText("ORDER & PAYMENT SUMMARY", 428, boxY + 26);

  const metaRows = [
    ["Order ID:", String(order._id || order.invoiceNo).slice(-12)],
    ["Payment Method:", "Cash on Delivery (COD)"],
    [
      "Delivery Zone:",
      order.deliveryLocation === "insideDhaka"
        ? "Inside Dhaka"
        : "Outside Dhaka",
    ],
    ["Order Status:", String(order.status || "pending").toUpperCase()],
  ];
  metaRows.forEach(([k, v], idx) => {
    const ry = boxY + 50 + idx * 21;
    ctx.fillStyle = "#64748b";
    ctx.font = `500 12px ${fontSans}`;
    ctx.fillText(k, 428, ry);
    ctx.fillStyle = "#0f172a";
    ctx.font = `700 12px ${fontSans}`;
    ctx.textAlign = "right";
    ctx.fillText(v, 728, ry);
    ctx.textAlign = "left";
  });

  // Items Table Header
  let y = 320;
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(48, y, width - 96, 38, 8);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 11px ${fontSans}`;
  ctx.fillText("#", 64, y + 23);
  ctx.fillText("ITEM DESCRIPTION", 96, y + 23);
  ctx.textAlign = "center";
  ctx.fillText("QTY", 500, y + 23);
  ctx.textAlign = "right";
  ctx.fillText("UNIT PRICE", 620, y + 23);
  ctx.fillText("AMOUNT", 730, y + 23);
  ctx.textAlign = "left";

  y += 46;

  // Table Rows
  const items = Array.isArray(order.items) ? order.items : [];
  items.forEach((item, idx) => {
    if (idx % 2 === 1) {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(48, y - 6, width - 96, 46);
    }

    ctx.fillStyle = "#64748b";
    ctx.font = `600 12px ${fontSans}`;
    ctx.fillText(String(idx + 1), 64, y + 16);

    ctx.fillStyle = "#0f172a";
    ctx.font = `700 13px ${fontSans}`;
    ctx.fillText(String(item.productName || "Item").slice(0, 46), 96, y + 14);

    if (item.variantLabel || item.productCode) {
      ctx.fillStyle = "#64748b";
      ctx.font = `500 11px ${fontSans}`;
      const sub = [
        item.variantLabel,
        item.productCode ? `SKU: ${item.productCode}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      ctx.fillText(sub.slice(0, 56), 96, y + 31);
    }

    ctx.fillStyle = "#0f172a";
    ctx.font = `700 12px ${fontSans}`;
    ctx.textAlign = "center";
    ctx.fillText(String(item.quantity), 500, y + 18);

    ctx.textAlign = "right";
    ctx.font = `600 12px ${fontSans}`;
    ctx.fillText(formatPrice(item.unitPrice), 620, y + 18);
    ctx.font = `700 13px ${fontSans}`;
    ctx.fillText(formatPrice(item.lineTotal), 730, y + 18);
    ctx.textAlign = "left";

    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(48, y + 40);
    ctx.lineTo(width - 48, y + 40);
    ctx.stroke();

    y += 48;
  });

  // Totals Summary Box
  y += 18;
  const sumX = 430;
  ctx.fillStyle = "#f8fafc";
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.roundRect(sumX, y, width - 48 - sumX, 148, 12);
  ctx.fill();
  ctx.stroke();

  const summaryLines = [
    ["Subtotal", formatPrice(order.subtotal)],
    ...(Number(order.discount) > 0
      ? [["Discount Saved", `-${formatPrice(order.discount)}`]]
      : []),
    [
      "Delivery Charge",
      Number(order.shippingCost) === 0
        ? "Free"
        : formatPrice(order.shippingCost),
    ],
  ];

  let sy = y + 28;
  summaryLines.forEach(([label, val]) => {
    ctx.fillStyle = "#475569";
    ctx.font = `600 12px ${fontSans}`;
    ctx.fillText(label, sumX + 20, sy);
    ctx.fillStyle = "#0f172a";
    ctx.font = `700 12px ${fontSans}`;
    ctx.textAlign = "right";
    ctx.fillText(val, width - 68, sy);
    ctx.textAlign = "left";
    sy += 24;
  });

  // Grand Total Highlight Bar
  ctx.fillStyle = `rgb(${pRgb.r}, ${pRgb.g}, ${pRgb.b})`;
  ctx.beginPath();
  ctx.roundRect(sumX + 12, y + 96, width - 48 - sumX - 24, 40, 8);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 13px ${fontSans}`;
  ctx.fillText("TOTAL PAYABLE (COD)", sumX + 26, y + 121);
  ctx.textAlign = "right";
  ctx.font = `800 15px ${fontSans}`;
  ctx.fillText(formatPrice(order.grandTotal), width - 72, y + 121);
  ctx.textAlign = "left";

  // Footer Note
  const footerY = height - 56;
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(48, footerY - 18);
  ctx.lineTo(width - 48, footerY - 18);
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = `500 11px ${fontSans}`;
  ctx.fillText(
    `Thank you for shopping with ${store.shop.shopName}! Please keep this invoice for warranty or replacement reference.`,
    48,
    footerY
  );
  ctx.textAlign = "right";
  ctx.fillText("Powered by AMARDokan", width - 48, footerY);

  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdfWidthMm = 210;
  const pdfHeightMm = (height * pdfWidthMm) / width;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pdfWidthMm, pdfHeightMm],
  });

  doc.addImage(imgData, "PNG", 0, 0, pdfWidthMm, pdfHeightMm);
  doc.save(`Invoice-${store.shop.shopSlug || "store"}-${order.invoiceNo}.pdf`);
}

export default function ThankYouInvoiceClient({
  store,
  serverOrder,
  orderId = "",
}) {
  const { shop, shopInfo, merchant, theme = {} } = store;
  const palette = useMemo(() => buildStorePalette(theme), [theme]);
  const baseHref = `/shop/${encodeURIComponent(shop.shopSlug || shop.shopId)}`;

  const [order, setOrder] = useState(serverOrder || null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (serverOrder) {
      setOrder(serverOrder);
      return;
    }
    if (typeof window !== "undefined" && orderId) {
      try {
        const cached = sessionStorage.getItem(`amardokan_last_order_${orderId}`);
        if (cached) {
          setOrder(JSON.parse(cached));
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [serverOrder, orderId]);

  const handleDownloadPdf = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      await generateInvoicePdf({ store, order, palette });
      toast.success("Official PDF Invoice downloaded!");
    } catch (err) {
      console.error(err);
      toast.info("Opening print dialog to save invoice as PDF...");
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyInvoiceNo = async () => {
    if (!order?.invoiceNo) return;
    try {
      await navigator.clipboard.writeText(order.invoiceNo);
      toast.success(`Copied ${order.invoiceNo}`);
    } catch {
      // ignore
    }
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: palette.accent }}
        >
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: palette.text }}>
          Thank You for Your Order!
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: palette.muted }}>
          Your order has been received by <strong>{shop.shopName}</strong>. Our team will call you shortly to confirm delivery.
        </p>
        <Link
          href={baseHref}
          style={{ backgroundColor: palette.primary }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  const issueDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const contactPhone = shopInfo?.phone || merchant?.phone || "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* ─── Celebration Confirmation Banner (Hidden on Print) ─── */}
      <div
        style={{
          backgroundColor: palette.banner,
          border: `1px solid ${rgba(palette.primary, 0.2)}`,
        }}
        className="rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden"
      >
        <div className="flex items-start gap-4">
          <div
            style={{ backgroundColor: palette.accent }}
            className="w-14 h-14 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-lg"
          >
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span
              className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider"
              style={{ color: palette.accent }}
            >
              <Sparkles className="w-3.5 h-3.5" /> Order Successfully Placed
            </span>
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bangla-text"
              style={{ color: palette.text }}
            >
              Thank you, {order.customer?.customerName}!
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: palette.muted }}>
              We&apos;ve sent your order to <strong>{shop.shopName}</strong>. Keep your invoice below for delivery verification.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadPdf}
            style={{ backgroundColor: palette.primary }}
            className="h-11 px-5 rounded-xl text-white text-xs sm:text-sm font-extrabold shadow-lg inline-flex items-center gap-2 hover:opacity-95 transition disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Invoice PDF
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              backgroundColor: palette.surfaceBg,
              color: palette.text,
              border: `1px solid ${palette.borderCol}`,
            }}
            className="h-11 px-4 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 hover:opacity-85 transition"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* ─── Official Printable & Branded Invoice Sheet ─── */}
      <div
        id="invoice-print-sheet"
        className="rounded-3xl bg-white text-slate-900 border border-slate-200/90 shadow-xl overflow-hidden print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Brand Gradient Header */}
        <div
          style={{
            background: `linear-gradient(120deg, ${palette.primary}, ${palette.secondary})`,
          }}
          className="p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            {shopInfo?.companyLogo?.url ? (
              <img
                src={shopInfo.companyLogo.url}
                alt={shop.shopName}
                className="w-14 h-14 rounded-2xl object-cover bg-white p-0.5 shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-2xl">
                {String(shop.shopName || "S").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight bangla-text">
                {shop.shopName}
              </h2>
              <p className="text-xs text-white/85 mt-0.5 bangla-text">
                {shopInfo?.shopAddress || `Store ID #${shop.shopId}`}
              </p>
              {contactPhone && (
                <p className="text-xs text-white/85">Phone: {contactPhone}</p>
              )}
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" /> Official Invoice
            </span>
            <div className="flex sm:justify-end items-center gap-1.5">
              <p className="text-lg sm:text-xl font-mono font-extrabold">
                #{order.invoiceNo}
              </p>
              <button
                type="button"
                onClick={handleCopyInvoiceNo}
                aria-label="Copy invoice number"
                className="p-1 rounded hover:bg-white/20 print:hidden"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            {issueDate && (
              <p className="text-xs text-white/80">Issued: {issueDate}</p>
            )}
          </div>
        </div>

        {/* Customer & Order Meta Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-slate-100 bg-slate-50/60">
          <div className="rounded-2xl bg-white p-4 border border-slate-200/70 space-y-1.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Billed & Delivered To
            </p>
            <p className="text-base font-extrabold text-slate-900 bangla-text">
              {order.customer?.customerName}
            </p>
            {order.customer?.customerPhone && (
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.customer.customerPhone}
              </p>
            )}
            {order.customer?.customerAddress && (
              <p className="text-xs text-slate-600 flex items-start gap-1.5 bangla-text">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{order.customer.customerAddress}</span>
              </p>
            )}
            {order.customer?.customerNote && (
              <p className="text-xs text-slate-500 italic pt-1 bangla-text">
                Note: {order.customer.customerNote}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200/70 space-y-2 text-xs">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Payment & Fulfillment Details
            </p>
            <div className="flex justify-between">
              <span className="text-slate-500">Order Reference</span>
              <span className="font-mono font-bold text-slate-800">
                {order._id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-bold text-emerald-600">
                Cash on Delivery (COD)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Area</span>
              <span className="font-semibold text-slate-800">
                {order.deliveryLocation === "insideDhaka"
                  ? "Inside Dhaka"
                  : "Outside Dhaka"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Order Status</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                {order.status || "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Products Table */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3 pr-3">#</th>
                  <th className="py-3 px-3">Product Description</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 pl-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 pr-3 font-semibold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 print:hidden"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 print:hidden">
                            <ShoppingBag className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 bangla-text">
                            {item.productName}
                          </p>
                          {(item.variantLabel || item.productCode) && (
                            <p className="text-[11px] text-slate-500">
                              {[
                                item.variantLabel,
                                item.productCode ? `SKU: ${item.productCode}` : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-700">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-3.5 pl-3 text-right font-extrabold text-slate-900">
                      {formatPrice(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 max-w-sm space-y-1">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4" style={{ color: palette.primary }} />
                Delivery Instructions
              </p>
              <p>
                Please keep <strong>{formatPrice(order.due ?? order.grandTotal)}</strong> ready in cash upon receiving your parcel from the courier agent.
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">
                  {Number(order.shippingCost) === 0
                    ? "Free"
                    : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div
                style={{ backgroundColor: palette.primary }}
                className="rounded-xl p-3.5 text-white flex items-center justify-between mt-2 shadow-sm"
              >
                <span className="font-bold text-xs uppercase tracking-wider">
                  Payable (COD)
                </span>
                <span className="text-lg font-extrabold">
                  {formatPrice(order.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Row (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
        <Link
          href={baseHref}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold hover:underline"
          style={{ color: palette.primary }}
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping at {shop.shopName}
        </Link>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          style={{
            backgroundColor: rgba(palette.primary, 0.12),
            color: palette.primary,
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 hover:opacity-90"
        >
          <Download className="w-4 h-4" />
          Save Copy of Invoice (.PDF)
        </button>
      </div>
    </div>
  );
}
