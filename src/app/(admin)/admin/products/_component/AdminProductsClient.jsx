/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  ExternalLink,
  Flame,
  Search,
  ShoppingBag,
  Trash2,
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

export default function AdminProductsClient({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter === "active" && p.isActive === false) return false;
      if (filter === "hidden" && p.isActive !== false) return false;
      if (filter === "featured" && !p.isFeatured) return false;
      if (!q) return true;
      return (
        String(p.productName || "")
          .toLowerCase()
          .includes(q) ||
        String(p.productCode || "")
          .toLowerCase()
          .includes(q) ||
        String(p.shopId?.shopName || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [products, search, filter]);

  const toggleProductField = async (productId, patch, msg) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, ...patch }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Update failed.");
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, ...patch } : p))
      );
      toast.success(msg);
    } catch {
      toast.error("Failed to update product.");
    }
  };

  const removeProduct = async (p) => {
    if (!window.confirm(`Delete product "${p.productName}"?`)) return;
    try {
      const res = await fetch(
        `/api/admin/products?productId=${encodeURIComponent(p._id)}`,
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
      setProducts((prev) => prev.filter((item) => item._id !== p._id));
      toast.success("Product removed.");
    } catch {
      toast.error("Could not remove product.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Boxes className="w-4 h-4" /> Catalog Moderation
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Platform Products ({products.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Feature top products, toggle storefront visibility, or moderate listings across stores.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, SKU, shop..."
              className="pl-9 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: `All (${products.length})` },
          {
            id: "active",
            label: `Active (${
              products.filter((p) => p.isActive !== false).length
            })`,
          },
          {
            id: "featured",
            label: `Featured (${products.filter((p) => p.isFeatured).length})`,
          },
          {
            id: "hidden",
            label: `Hidden (${
              products.filter((p) => p.isActive === false).length
            })`,
          },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              filter === t.id
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold">Product</TableHead>
                <TableHead className="font-bold">Store</TableHead>
                <TableHead className="font-bold text-right">Price</TableHead>
                <TableHead className="font-bold text-center">Stock</TableHead>
                <TableHead className="font-bold text-center">Featured</TableHead>
                <TableHead className="font-bold text-center">Visibility</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((p) => {
                  const slug = p.shopId?.shopSlug || p.shopId?.shopId || "";
                  return (
                    <TableRow key={p._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            {p.mainImage?.url ? (
                              <img
                                src={p.mainImage.url}
                                alt={p.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1 max-w-[240px] bangla-text">
                              {p.productName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {p.productCode}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-slate-800 bangla-text">
                          {p.shopId?.shopName || "—"}
                        </p>
                        <p className="text-xs text-slate-400 bangla-text">
                          {p.categoryId?.name || "Uncategorized"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-slate-900">
                        {bdt(p.discountedPrice || p.regularPrice)}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {p.availableQuantity ?? 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() =>
                            toggleProductField(
                              p._id,
                              { isFeatured: !p.isFeatured },
                              p.isFeatured
                                ? "Removed from Featured"
                                : "Marked as Featured!"
                            )
                          }
                        >
                          <Badge
                            className={
                              p.isFeatured
                                ? "bg-amber-500/15 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }
                          >
                            <Flame className="w-3 h-3 mr-1" />
                            {p.isFeatured ? "Featured" : "Standard"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() =>
                            toggleProductField(
                              p._id,
                              { isActive: p.isActive === false },
                              p.isActive === false
                                ? "Product published"
                                : "Product hidden"
                            )
                          }
                        >
                          <Badge
                            className={
                              p.isActive !== false
                                ? "bg-emerald-500/15 text-emerald-700 border-emerald-200"
                                : "bg-rose-500/15 text-rose-700 border-rose-200"
                            }
                          >
                            {p.isActive !== false ? "Live" : "Hidden"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {slug && (
                            <Link
                              href={`/shop/${encodeURIComponent(
                                slug
                              )}/product/${encodeURIComponent(p._id)}`}
                              target="_blank"
                              title="View on Storefront"
                              className="p-2 rounded-lg text-violet-600 hover:bg-violet-50"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => removeProduct(p)}
                            title="Delete Product"
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                    No products matched your search.
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
