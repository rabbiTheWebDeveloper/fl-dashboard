"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Mail,
  Phone,
  Search,
  Trash2,
  Users,
  XCircle,
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

export default function AdminMerchantsClient({ initialMerchants = [] }) {
  const [merchants, setMerchants] = useState(initialMerchants);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return merchants.filter((m) => {
      if (statusFilter === "verified" && !m.emailVerified) return false;
      if (statusFilter === "unverified" && m.emailVerified) return false;
      if (statusFilter === "unpaid" && m.payment_status !== "unpaid") {
        return false;
      }
      if (!q) return true;
      return (
        String(m.fullName || "")
          .toLowerCase()
          .includes(q) ||
        String(m.email || "")
          .toLowerCase()
          .includes(q) ||
        String(m.phone || "")
          .toLowerCase()
          .includes(q) ||
        String(m.shops?.[0]?.shopName || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [merchants, search, statusFilter]);

  const updateMerchant = async (merchantId, patch, msg) => {
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ merchantId, ...patch }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Update failed.");
        return;
      }
      setMerchants((prev) =>
        prev.map((m) => (m._id === merchantId ? { ...m, ...patch } : m))
      );
      toast.success(msg || "Merchant updated.");
    } catch {
      toast.error("Failed to update merchant.");
    }
  };

  const deleteMerchant = async (m) => {
    if (
      !window.confirm(
        `Permanently remove merchant "${m.fullName}" (${m.email})?`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/merchants?merchantId=${encodeURIComponent(m._id)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Could not delete merchant.");
        return;
      }
      setMerchants((prev) => prev.filter((item) => item._id !== m._id));
      toast.success("Merchant account deleted.");
    } catch {
      toast.error("Error deleting merchant.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <Users className="w-4 h-4" /> Platform Sellers
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Merchant Accounts ({merchants.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verify merchant emails, review sales performance, and manage SaaS billing status.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, shop..."
              className="pl-9 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: `All (${merchants.length})` },
          {
            id: "verified",
            label: `Verified (${
              merchants.filter((m) => m.emailVerified).length
            })`,
          },
          {
            id: "unverified",
            label: `Unverified (${
              merchants.filter((m) => !m.emailVerified).length
            })`,
          },
          {
            id: "unpaid",
            label: `Unpaid Plan (${
              merchants.filter((m) => m.payment_status === "unpaid").length
            })`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              statusFilter === tab.id
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold">Merchant</TableHead>
                <TableHead className="font-bold">Storefront</TableHead>
                <TableHead className="font-bold text-center">Products</TableHead>
                <TableHead className="font-bold text-right">Orders & GMV</TableHead>
                <TableHead className="font-bold text-center">Verified</TableHead>
                <TableHead className="font-bold text-center">Plan Status</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((m) => {
                  const shop = m.shops?.[0];
                  return (
                    <TableRow key={m._id}>
                      <TableCell>
                        <p className="font-bold text-slate-900 bangla-text">
                          {m.fullName}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {m.email}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {m.phone}
                        </p>
                      </TableCell>
                      <TableCell>
                        {shop ? (
                          <div>
                            <p className="font-bold text-slate-800 bangla-text">
                              {shop.shopName}
                            </p>
                            <Link
                              href={`/shop/${encodeURIComponent(
                                shop.shopSlug || shop.shopId
                              )}`}
                              target="_blank"
                              className="text-xs text-violet-600 hover:underline inline-flex items-center gap-1"
                            >
                              /shop/{shop.shopSlug || shop.shopId}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No shop</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {m.productCount || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="font-extrabold text-slate-900">
                          {bdt(m.totalGmv)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {m.orderCount || 0} orders
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() =>
                            updateMerchant(
                              m._id,
                              { emailVerified: !m.emailVerified },
                              m.emailVerified
                                ? "Marked unverified"
                                : "Merchant verified!"
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold"
                        >
                          {m.emailVerified ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">
                              <BadgeCheck className="w-3 h-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">
                              <XCircle className="w-3 h-3 mr-1" /> Verify Now
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() =>
                            updateMerchant(
                              m._id,
                              {
                                payment_status:
                                  m.payment_status === "paid"
                                    ? "unpaid"
                                    : "paid",
                              },
                              "Payment status toggled"
                            )
                          }
                        >
                          <Badge
                            className={
                              m.payment_status === "paid"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                : "bg-rose-500/10 text-rose-700 border-rose-200"
                            }
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {m.payment_status || "paid"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => deleteMerchant(m)}
                          title="Delete Merchant"
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                    No merchants matched your search.
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
