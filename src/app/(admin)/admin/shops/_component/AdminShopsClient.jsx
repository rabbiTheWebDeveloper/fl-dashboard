/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  ExternalLink,
  Globe,
  Search,
  ShoppingCart,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const bdt = (n) => `৳${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;

export default function AdminShopsClient({ initialShops = [] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialShops;
    return initialShops.filter(
      (s) =>
        String(s.shopName || "")
          .toLowerCase()
          .includes(q) ||
        String(s.shopSlug || "")
          .toLowerCase()
          .includes(q) ||
        String(s.shopId || "")
          .toLowerCase()
          .includes(q) ||
        String(s.owner?.email || "")
          .toLowerCase()
          .includes(q)
    );
  }, [initialShops, search]);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600">
              <Store className="w-4 h-4" /> Multi-Tenant Storefronts
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              All Stores ({initialShops.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Inspect merchant themes, custom domains, catalog counts, GMV, and live `/shop/[shopSlug]` storefronts.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shop name, slug, owner..."
              className="pl-9 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((shop) => {
          const primary = shop.theme?.primary || "#7c3aed";
          const secondary = shop.theme?.secondary || "#06b6d4";
          const slug = shop.shopSlug || shop.shopId;
          const logo = shop.shopInfo?.companyLogo?.url || "";

          return (
            <Card
              key={shop._id}
              className="overflow-hidden border-slate-200/80 bg-white shadow-2xs hover:shadow-lg transition flex flex-col justify-between py-0"
            >
              <div>
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                  }}
                />
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {logo ? (
                        <img
                          src={logo}
                          alt={shop.shopName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                          }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
                        >
                          {String(shop.shopName || "S")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-base text-slate-900 truncate bangla-text">
                          {shop.shopName}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 truncate">
                          ID #{shop.shopId} · /{slug}
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-[10px]">
                      {shop.theme?.layoutPosition || "top-filter"}
                    </Badge>
                  </div>

                  {/* Owner & Domain */}
                  <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                    <p className="font-semibold text-slate-700 truncate bangla-text">
                      Owner: {shop.owner?.fullName || "—"}
                    </p>
                    <p className="text-slate-500 truncate">
                      {shop.owner?.email || "—"}
                    </p>
                    {shop.domain?.domain_name && (
                      <p className="text-cyan-600 font-semibold flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {shop.domain.domain_name}
                      </p>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-slate-100 p-2">
                      <p className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
                        <Boxes className="w-3.5 h-3.5 text-violet-500" />
                        {shop.productCount}
                      </p>
                      <p className="text-[10px] text-slate-400">Products</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 p-2">
                      <p className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
                        <ShoppingCart className="w-3.5 h-3.5 text-cyan-500" />
                        {shop.orderCount}
                      </p>
                      <p className="text-[10px] text-slate-400">Orders</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 p-2">
                      <p className="text-sm font-extrabold text-emerald-600 truncate">
                        {bdt(shop.gmv)}
                      </p>
                      <p className="text-[10px] text-slate-400">GMV</p>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: primary }}
                    title={`Primary: ${primary}`}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: secondary }}
                    title={`Secondary: ${secondary}`}
                  />
                  <span className="text-[11px] text-slate-500 ml-1">
                    {shop.theme?.productGridCols || 4} cols
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`/api/shop/${encodeURIComponent(slug)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    API
                  </a>
                  <Link
                    href={`/shop/${encodeURIComponent(slug)}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-violet-600 hover:underline"
                  >
                    Live Store <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
