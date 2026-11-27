"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuthHeaders } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const bdt = (n) => `৳${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;

const STATUS_BADGES = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  shipped: "bg-violet-500/10 text-violet-700 border-violet-200",
  delivered: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  cancelled: "bg-rose-500/10 text-rose-700 border-rose-200",
};

export default function AdminOrdersClient({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        String(o._id || "")
          .toLowerCase()
          .includes(q) ||
        String(o.customer?.customerName || "")
          .toLowerCase()
          .includes(q) ||
        String(o.customer?.customerPhone || "")
          .toLowerCase()
          .includes(q) ||
        String(o.shopId?.shopName || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Could not update order.");
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? json.data : o))
      );
      toast.success(`Order updated to ${nextStatus}`);
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <ShoppingCart className="w-4 h-4" /> Real-Time Fulfillment Monitor
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Global Orders ({orders.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Monitor orders across all shops, update status, and view customer invoices.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, customer, shop..."
              className="pl-9 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(
          (st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize shrink-0 transition ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st} (
              {st === "all"
                ? orders.length
                : orders.filter((o) => o.status === st).length}
              )
            </button>
          )
        )}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold">Order ID</TableHead>
                <TableHead className="font-bold">Store</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold text-center">Items</TableHead>
                <TableHead className="font-bold text-right">Grand Total</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="font-bold text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((ord) => {
                  const shopSlug =
                    ord.shopId?.shopSlug || ord.shopId?.shopId || "";
                  const totalQty = Array.isArray(ord.quantity)
                    ? ord.quantity.reduce((s, q) => s + Number(q || 1), 0)
                    : 1;
                  return (
                    <TableRow key={ord._id}>
                      <TableCell>
                        <p className="font-mono font-bold text-xs text-slate-900">
                          #{String(ord._id).slice(-8).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {ord.createdAt
                            ? new Date(ord.createdAt).toLocaleDateString("en-GB")
                            : ""}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-800 bangla-text">
                          {ord.shopId?.shopName || "—"}
                        </p>
                        <p className="text-[11px] text-slate-400 capitalize">
                          {ord.deliveryLocation || "COD"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-900 bangla-text">
                          {ord.customer?.customerName || "Customer"}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {ord.customer?.customerPhone || "—"}
                        </p>
                        {ord.customer?.customerAddress && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 max-w-[200px] truncate bangla-text">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {ord.customer.customerAddress}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {totalQty}
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-slate-900">
                        {bdt(ord.grand_total)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <Badge
                            className={
                              STATUS_BADGES[ord.status] || STATUS_BADGES.pending
                            }
                          >
                            {ord.status || "pending"}
                          </Badge>
                          <select
                            aria-label="Update status"
                            value={ord.status || "pending"}
                            onChange={(e) =>
                              handleStatusChange(ord._id, e.target.value)
                            }
                            className="h-7 px-2 rounded-lg border border-slate-200 text-xs bg-white font-semibold"
                          >
                            <option value="pending">pending</option>
                            <option value="confirmed">confirmed</option>
                            <option value="shipped">shipped</option>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {shopSlug && (
                          <Link
                            href={`/shop/${encodeURIComponent(
                              shopSlug
                            )}/thank-you?orderId=${encodeURIComponent(ord._id)}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" /> Invoice
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    No orders matched your filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
