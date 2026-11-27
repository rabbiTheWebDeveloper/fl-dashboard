"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  CreditCard,
  DollarSign,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuthHeaders } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const bdt = (val) =>
  `৳${Math.round(Number(val || 0)).toLocaleString("en-IN")}`;

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  shipped: "#8b5cf6",
  delivered: "#06b6d4",
  cancelled: "#f43f5e",
};

const KPI_ACCENTS = {
  violet: {
    bar: "from-violet-600 to-indigo-600",
    icon: "bg-gradient-to-br from-violet-600 to-indigo-600 text-white",
  },
  emerald: {
    bar: "from-emerald-500 to-teal-600",
    icon: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
  },
  cyan: {
    bar: "from-cyan-500 to-blue-600",
    icon: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white",
  },
  amber: {
    bar: "from-amber-500 to-orange-500",
    icon: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  },
  fuchsia: {
    bar: "from-fuchsia-600 to-pink-600",
    icon: "bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white",
  },
};

function KpiTile({ label, value, sub, icon: Icon, accent = "violet" }) {
  const pal = KPI_ACCENTS[accent] || KPI_ACCENTS.violet;
  return (
    <Card className="relative overflow-hidden py-4 border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-all">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${pal.bar}`} />
      <CardContent className="px-4 sm:px-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 truncate">
            {value}
          </p>
          {sub && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{sub}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${pal.icon}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewClient({ admin, initialStats }) {
  const [stats, setStats] = useState(initialStats);
  const [refreshing, setRefreshing] = useState(false);

  const {
    kpis = {},
    statusBreakdown = {},
    trendData = [],
    topShops = [],
    recentOrders = [],
    recentMerchants = [],
  } = stats || {};

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/overview", {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json?.success && json.data) {
        setStats(json.data);
        toast.success("Platform metrics refreshed!");
      }
    } catch {
      toast.error("Could not refresh metrics.");
    } finally {
      setRefreshing(false);
    }
  };

  const pieData = Object.entries(statusBreakdown)
    .map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Number(val) || 0,
      color: STATUS_COLORS[key] || "#64748b",
    }))
    .filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Executive Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              Signed in as {String(admin?.role || "superadmin").toUpperCase()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {admin?.fullName || "Super Admin"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Monitor live Gross Merchandise Volume (GMV), merchant storefronts, global orders, SaaS subscriptions, and role-based `user-admin` accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={refreshing}
              onClick={handleRefresh}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh API
            </Button>
            <Button asChild variant="gradient" size="sm">
              <Link href="/admin/users?create=1">
                <UserPlus className="w-4 h-4" />
                Create User-Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 8 Executive KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiTile
          label="Total Platform GMV"
          value={bdt(kpis.totalGmv)}
          sub={`Confirmed: ${bdt(kpis.confirmedGmv)}`}
          icon={DollarSign}
          accent="emerald"
        />
        <KpiTile
          label="Global Orders"
          value={(kpis.totalOrders || 0).toLocaleString()}
          sub={`${statusBreakdown.pending || 0} pending fulfillment`}
          icon={ShoppingCart}
          accent="violet"
        />
        <KpiTile
          label="Active Shops"
          value={(kpis.totalShops || 0).toLocaleString()}
          sub="Multi-tenant storefronts"
          icon={Store}
          accent="cyan"
        />
        <KpiTile
          label="Registered Merchants"
          value={(kpis.totalMerchants || 0).toLocaleString()}
          sub={`${kpis.verifiedMerchants || 0} email verified`}
          icon={Users}
          accent="fuchsia"
        />
        <KpiTile
          label="Catalog Products"
          value={(kpis.totalProducts || 0).toLocaleString()}
          sub={`${kpis.activeProducts || 0} active listings`}
          icon={Boxes}
          accent="amber"
        />
        <KpiTile
          label="SaaS Revenue Collected"
          value={bdt(kpis.saasPaidRevenue)}
          sub="Paid merchant invoices"
          icon={CreditCard}
          accent="emerald"
        />
        <KpiTile
          label="Pending SaaS Dues"
          value={bdt(kpis.saasPendingDues)}
          sub="Unpaid & overdue bills"
          icon={TrendingUp}
          accent="amber"
        />
        <KpiTile
          label="Admin Team Accounts"
          value={(kpis.totalAdmins || 1).toLocaleString()}
          sub="Superadmin & User-Admin"
          icon={ShieldCheck}
          accent="violet"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border-slate-200/80 bg-white shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-extrabold text-slate-900">
              7-Day Platform GMV & Order Velocity
            </CardTitle>
            <CardDescription className="text-xs">
              Daily order volume and gross checkout value across all merchant shops
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="adminGmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="GMV (৳)"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#adminGmvGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-slate-200/80 bg-white shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-extrabold text-slate-900">
              Order Status Mix
            </CardTitle>
            <CardDescription className="text-xs">
              Live fulfillment breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex flex-col justify-between">
            {pieData.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={74}
                        paddingAngle={3}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {pieData.map((d) => (
                    <span
                      key={d.name}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      {d.name}: {d.value}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                No orders recorded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Stores + Recent Orders + Recent Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Shops Leaderboard */}
        <Card className="lg:col-span-5 border-slate-200/80 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900">
                Top Performing Stores
              </CardTitle>
              <CardDescription className="text-xs">
                Ranked by Gross Merchandise Volume
              </CardDescription>
            </div>
            <Link
              href="/admin/shops"
              className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1"
            >
              All Shops <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topShops.length > 0 ? (
              topShops.map((s, idx) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-violet-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate bangla-text">
                        {s.shopName}
                      </p>
                      <Link
                        href={`/shop/${encodeURIComponent(s.shopSlug)}`}
                        target="_blank"
                        className="text-[11px] text-violet-600 hover:underline inline-flex items-center gap-1"
                      >
                        /shop/{s.shopSlug} <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-emerald-600">
                      {bdt(s.gmv)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {s.orderCount} orders
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center">
                Top stores will appear once orders are placed.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Global Orders */}
        <Card className="lg:col-span-7 border-slate-200/80 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900">
                Recent Global Orders
              </CardTitle>
              <CardDescription className="text-xs">
                Latest customer checkouts across all stores
              </CardDescription>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1"
            >
              Manage Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recentOrders.length > 0 ? (
              recentOrders.map((ord) => (
                <div
                  key={ord._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50/70 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 bangla-text truncate">
                        {ord.customer?.customerName || "Customer"}
                      </span>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {ord.status || "pending"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate bangla-text">
                      Store: <strong>{ord.shopId?.shopName || "—"}</strong> ·{" "}
                      {ord.customer?.customerPhone || ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-slate-900">
                      {bdt(ord.grand_total)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      #{String(ord._id).slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center">
                No platform orders yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Newest Merchants Strip */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-extrabold text-slate-900">
              Newest Merchant Registrations
            </CardTitle>
            <CardDescription className="text-xs">
              Recently onboarded store owners on AMARDokan
            </CardDescription>
          </div>
          <Link
            href="/admin/merchants"
            className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1"
          >
            All Merchants <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentMerchants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentMerchants.map((m) => {
                const primaryShop = m.shops?.[0];
                return (
                  <div
                    key={m._id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate bangla-text">
                          {m.fullName}
                        </p>
                        {m.emailVerified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {m.email}
                      </p>
                      {primaryShop && (
                        <Link
                          href={`/shop/${encodeURIComponent(
                            primaryShop.shopSlug || primaryShop.shopId
                          )}`}
                          target="_blank"
                          className="text-[11px] text-violet-600 font-semibold hover:underline bangla-text"
                        >
                          {primaryShop.shopName} →
                        </Link>
                      )}
                    </div>
                    <Badge
                      className={
                        m.payment_status === "paid"
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                          : "bg-rose-500/10 text-rose-700 border-rose-200"
                      }
                    >
                      {m.payment_status || "paid"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No merchants registered yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
