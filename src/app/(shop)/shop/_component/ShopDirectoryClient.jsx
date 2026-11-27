/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Code2,
  ExternalLink,
  MapPin,
  PlusCircle,
  Search,
  Sparkles,
  Store,
  X,
} from "lucide-react";

export default function ShopDirectoryClient({ shops = [] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredShops = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter(
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
        String(s.tagline || "")
          .toLowerCase()
          .includes(q)
    );
  }, [shops, deferredQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-950 text-white border-b border-white/10">
        <div className="pointer-events-none absolute -top-28 -left-24 w-96 h-96 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-24 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                AMARDokan Multi-Store Marketplace
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Explore Verified{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Online Stores
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Visit any merchant storefront by its unique{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-200 font-mono text-xs">
                  /shop/[shopSlug]
                </code>{" "}
                address, customized with each store&apos;s own brand theme and product layout.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/registration"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-violet-600/25 hover:opacity-95 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Launch Your Store
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                Merchant Dashboard
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search store by name, shopSlug, or shop ID..."
              className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 text-sm outline-none focus:border-cyan-400 focus:bg-white/[0.13] transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Store Grid */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Active Merchant Stores
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
              {filteredShops.length}
            </span>
          </div>

          <a
            href="/api/shop"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-violet-600 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            JSON API: <code className="font-mono">/api/shop/[shopSlug]</code>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredShops.map((shop) => {
              const storeHref = `/shop/${encodeURIComponent(shop.shopSlug)}`;
              return (
                <Link
                  key={shop._id}
                  href={storeHref}
                  className="group relative rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Brand Theme Top Accent Bar */}
                  <div
                    className="h-2 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${shop.primaryColor}, ${shop.secondaryColor})`,
                    }}
                  />

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {shop.logo ? (
                            <img
                              src={shop.logo}
                              alt={shop.shopName}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div
                              style={{
                                background: `linear-gradient(135deg, ${shop.primaryColor}, ${shop.secondaryColor})`,
                              }}
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-xs"
                            >
                              {String(shop.shopName || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-extrabold text-base text-slate-900 truncate bangla-text">
                                {shop.shopName}
                              </h3>
                              <BadgeCheck
                                className="w-4 h-4 shrink-0"
                                style={{ color: shop.primaryColor }}
                              />
                            </div>
                            <p className="text-xs font-mono text-slate-400 truncate">
                              /shop/{shop.shopSlug}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 shrink-0">
                          <Boxes className="w-3 h-3" />
                          {shop.productCount}
                        </span>
                      </div>

                      {shop.tagline ? (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bangla-text">
                          {shop.tagline}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">
                          Official online storefront powered by AMARDokan.
                        </p>
                      )}

                      {shop.address && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate bangla-text">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{shop.address}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        ID #{shop.shopId}
                      </span>
                      <span
                        style={{ color: shop.primaryColor }}
                        className="inline-flex items-center gap-1 text-xs font-extrabold group-hover:translate-x-0.5 transition-transform"
                      >
                        Visit Store <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-6 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {shops.length === 0
                ? "No public stores registered yet"
                : "No stores matched your search"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {shops.length === 0
                ? "Create the first merchant account to launch your custom storefront!"
                : "Try searching with a different store name, slug, or shop ID."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
