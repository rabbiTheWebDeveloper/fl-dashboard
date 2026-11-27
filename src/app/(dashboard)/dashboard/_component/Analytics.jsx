"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  DollarSign,
  Package,
  RotateCcw,
  ShoppingCart,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tk = (n) => `৳${Number(n || 0).toLocaleString("en-IN")}`;
const fmtNum = (n) => Number(n || 0).toLocaleString("en-IN");

const ACCENTS = {
  violet: {
    bar: "from-violet-600 to-indigo-500",
    iconBg: "from-violet-600 to-indigo-600",
  },
  cyan: {
    bar: "from-cyan-500 to-blue-500",
    iconBg: "from-cyan-500 to-blue-600",
  },
  emerald: {
    bar: "from-emerald-500 to-teal-500",
    iconBg: "from-emerald-500 to-teal-600",
  },
  amber: {
    bar: "from-amber-500 to-orange-500",
    iconBg: "from-amber-500 to-orange-500",
  },
  rose: {
    bar: "from-rose-500 to-pink-500",
    iconBg: "from-rose-500 to-pink-600",
  },
};

function StatCard({ label, value, sub, icon: Icon, accent = "violet" }) {
  const palette = ACCENTS[accent] || ACCENTS.violet;
  return (
    <Card className="relative overflow-hidden py-4 border-slate-200/80 bg-white/95">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${palette.bar}`} />
      <CardContent className="px-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-[11px] text-slate-400 mt-1 truncate">{sub}</p>}
        </div>
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${palette.iconBg} text-white flex items-center justify-center shadow-md shrink-0`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-bold text-slate-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}:{" "}
          {String(p.name).toLowerCase().includes("revenue") ||
          String(p.name).toLowerCase().includes("avg")
            ? tk(p.value)
            : fmtNum(p.value)}
        </p>
      ))}
    </div>
  );
};

function EmptyChart({ label }) {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center text-slate-400">
      <BarChart3 className="w-10 h-10 mb-2 opacity-40" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export default function Analytics({ data }) {
  const router = useRouter();
  const pathname = usePathname();

  const [tab, setTab] = useState("overview");
  const [dateFrom, setDateFrom] = useState(data?.dateFrom || "");
  const [dateTo, setDateTo] = useState(data?.dateTo || "");

  const applyFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [dateFrom, dateTo, pathname, router]);

  const resetFilter = () => {
    setDateFrom("");
    setDateTo("");
    router.push(pathname);
  };

  const {
    orderStats = {},
    revenueStats = {},
    dailySales = [],
    topProducts = [],
    ordersByType = [],
    ordersByLocation = [],
    ordersByStatus = [],
    totalProducts = {},
    lowStockProducts = [],
    totalCustomers = 0,
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Header + Date Filter */}
      <Card className="rgb-card border-slate-200/80 bg-white/95 py-5">
        <CardContent className="px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Store <span className="rgb-gradient-text">Analytics</span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Deep insights across revenue, orders, catalog performance, and buyers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-36 bg-white text-xs h-9"
            />
            <span className="text-slate-400 text-xs">→</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-36 bg-white text-xs h-9"
            />
            <Button variant="gradient" size="sm" onClick={applyFilter}>
              Apply Range
            </Button>
            {(data?.dateFrom || data?.dateTo) && (
              <Button variant="outline" size="sm" onClick={resetFilter}>
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shadcn Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="px-4 py-1.5">
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="px-4 py-1.5">
            Sales & Revenue
          </TabsTrigger>
          <TabsTrigger value="products" className="px-4 py-1.5">
            Products
          </TabsTrigger>
          <TabsTrigger value="customers" className="px-4 py-1.5">
            Customers
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={tk(revenueStats.totalRevenue)}
              sub={`Avg ${tk(revenueStats.avgOrderValue)}/order`}
              accent="violet"
            />
            <StatCard
              icon={ShoppingCart}
              label="Total Orders"
              value={fmtNum(orderStats.total)}
              sub={`${orderStats.pending || 0} pending`}
              accent="cyan"
            />
            <StatCard
              icon={Users}
              label="Customers"
              value={fmtNum(totalCustomers)}
              sub="Unique buyers"
              accent="emerald"
            />
            <StatCard
              icon={Boxes}
              label="Catalog Size"
              value={fmtNum(totalProducts.total)}
              sub={`${totalProducts.active || 0} active`}
              accent="amber"
            />
            <StatCard
              icon={Truck}
              label="Shipping Earned"
              value={tk(revenueStats.totalShipping)}
              sub={`Due ${tk(revenueStats.totalDue)}`}
              accent="rose"
            />
          </div>

          {/* Daily Sales Area Chart */}
          <Card className="border-slate-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                Daily Sales & Order Trend
              </CardTitle>
              <CardDescription className="text-xs">
                Dual-axis view of revenue and order count per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={290} minWidth={0}>
                  <AreaChart
                    data={dailySales}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="anaRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="anaOrd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <YAxis
                      yAxisId="rev"
                      orientation="left"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      yAxisId="ord"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="rev"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#7c3aed"
                      fill="url(#anaRev)"
                      strokeWidth={2.5}
                    />
                    <Area
                      yAxisId="ord"
                      type="monotone"
                      dataKey="orders"
                      name="Orders"
                      stroke="#06b6d4"
                      fill="url(#anaOrd)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart label="No sales data for this period" />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Order Sources
                </CardTitle>
                <CardDescription className="text-xs">
                  Breakdown by acquisition channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220} minWidth={0}>
                    <PieChart>
                      <Pie
                        data={ordersByType}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={78}
                        paddingAngle={4}
                      >
                        {ordersByType.map((entry, i) => (
                          <Cell key={i} fill={entry.color || "#7c3aed"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label="No order source data" />
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Top 5 Selling Products
                </CardTitle>
                <CardDescription className="text-xs">
                  Ranked by total units sold
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts.length > 0 ? (
                  <div className="space-y-3.5">
                    {topProducts.map((p, i) => {
                      const maxSales = topProducts[0]?.saleCount || 1;
                      return (
                        <div key={p._id || i} className="flex items-center gap-3">
                          <Badge variant="outline" className="w-7 justify-center font-bold">
                            #{i + 1}
                          </Badge>
                          {p.mainImage?.url ? (
                            <img
                              src={p.mainImage.url}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-violet-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {p.productName}
                              </p>
                              <span className="text-xs font-bold text-violet-600 ml-2 shrink-0">
                                {fmtNum(p.saleCount)} sold
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                                style={{
                                  width: `${(p.saleCount / maxSales) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyChart label="No product sales data" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SALES TAB */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Gross Revenue" value={tk(revenueStats.totalRevenue)} accent="violet" />
            <StatCard icon={BarChart3} label="Avg Order Value" value={tk(revenueStats.avgOrderValue)} accent="cyan" />
            <StatCard icon={Truck} label="Shipping Collected" value={tk(revenueStats.totalShipping)} accent="emerald" />
            <StatCard icon={AlertTriangle} label="Outstanding Due" value={tk(revenueStats.totalDue)} accent="rose" />
          </div>

          <Card className="border-slate-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                Daily Revenue Bars
              </CardTitle>
              <CardDescription className="text-xs">
                Revenue generated per day in BDT
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={300} minWidth={0}>
                  <BarChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart label="No revenue data for this period" />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240} minWidth={0}>
                    <BarChart data={ordersByStatus} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Orders" radius={[0, 6, 6, 0]}>
                        {ordersByStatus.map((entry, i) => (
                          <Cell key={i} fill={entry.color || "#7c3aed"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label="No order status data" />
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Delivery Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersByLocation.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240} minWidth={0}>
                    <PieChart>
                      <Pie
                        data={ordersByLocation}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {ordersByLocation.map((e, i) => (
                          <Cell key={i} fill={e.color || "#06b6d4"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label="No location data" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PRODUCTS TAB */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Boxes} label="Total Products" value={fmtNum(totalProducts.total)} accent="violet" />
            <StatCard icon={CheckCircle2} label="Active Listings" value={fmtNum(totalProducts.active)} accent="emerald" />
            <StatCard icon={Star} label="Featured Items" value={fmtNum(totalProducts.featured)} accent="amber" />
            <StatCard icon={AlertTriangle} label="Low Stock" value={fmtNum(lowStockProducts.length)} accent="rose" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Best-Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260} minWidth={0}>
                    <BarChart
                      data={topProducts.map((p) => ({
                        name:
                          (p.productName?.length > 18
                            ? p.productName.slice(0, 18) + "…"
                            : p.productName) || "Item",
                        sales: p.saleCount,
                      }))}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="sales" name="Units Sold" fill="#10b981" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label="No product sales data" />
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Low Stock Watchlist (≤ 5 units)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-3">
                    {lowStockProducts.map((p, i) => (
                      <div
                        key={p._id || i}
                        className="flex items-center gap-3 p-3 bg-rose-50/60 border border-rose-200/80 rounded-xl"
                      >
                        {p.mainImage?.url ? (
                          <img
                            src={p.mainImage.url}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-rose-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-rose-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {p.productName}
                          </p>
                          <p className="text-xs text-slate-500">{tk(p.regularPrice)}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            p.availableQuantity <= 2
                              ? "bg-rose-500/15 text-rose-700 border-rose-200"
                              : "bg-amber-500/15 text-amber-700 border-amber-200"
                          }
                        >
                          {p.availableQuantity} left
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                    <p className="text-sm font-medium text-slate-600">
                      All products are well stocked
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CUSTOMERS TAB */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Users} label="Unique Customers" value={fmtNum(totalCustomers)} accent="violet" />
            <StatCard icon={ShoppingCart} label="Total Orders" value={fmtNum(orderStats.total)} accent="cyan" />
            <StatCard
              icon={DollarSign}
              label="Revenue per Customer"
              value={
                totalCustomers > 0
                  ? tk(Math.round((revenueStats.totalRevenue || 0) / totalCustomers))
                  : tk(0)
              }
              accent="emerald"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Order Channels
                </CardTitle>
                <CardDescription className="text-xs">
                  How customers place orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ordersByType.length > 0 ? (
                  ordersByType.map((t, i) => {
                    const total =
                      ordersByType.reduce((s, x) => s + x.value, 0) || 1;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold text-slate-700">
                            {t.name}
                          </span>
                          <span className="font-bold text-slate-900">
                            {fmtNum(t.value)}{" "}
                            <span className="text-slate-400 font-normal">
                              ({((t.value / total) * 100).toFixed(0)}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(t.value / total) * 100}%`,
                              background: t.color || "#7c3aed",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyChart label="No channel data" />
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Financial Breakdown
                </CardTitle>
                <CardDescription className="text-xs">
                  Summary of collections and dues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {[
                  { label: "Gross Revenue", value: revenueStats.totalRevenue, dot: "bg-violet-600" },
                  { label: "Shipping Income", value: revenueStats.totalShipping, dot: "bg-cyan-500" },
                  { label: "Total Discounts", value: revenueStats.totalDiscount, dot: "bg-amber-500" },
                  { label: "Advanced Paid", value: revenueStats.totalAdvanced, dot: "bg-emerald-500" },
                  { label: "Amount Due", value: revenueStats.totalDue, dot: "bg-rose-500" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border border-slate-100 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                      <span className="text-xs font-medium text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">
                      {tk(item.value)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
