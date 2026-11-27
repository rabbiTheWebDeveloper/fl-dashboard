"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
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
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  XCircle,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardFilter from "./DashboardFilter";

const tk = (n) => `৳${Number(n ?? 0).toLocaleString("en-IN")}`;
const pct = (a, b) => (b > 0 ? ((a / b) * 100).toFixed(1) : "0.0");

const statusBadgeStyle = {
  confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  shipped: "bg-violet-500/10 text-violet-700 border-violet-200",
  delivered: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  cancelled: "bg-rose-500/10 text-rose-700 border-rose-200",
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl p-3 text-xs">
      <p className="font-bold text-slate-800 mb-1">{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color }} className="font-semibold">
          {e.name}: {e.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const ACCENTS = {
  violet: {
    iconBg: "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-500/25",
    bar: "from-violet-600 to-indigo-500",
  },
  cyan: {
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/25",
    bar: "from-cyan-500 to-blue-500",
  },
  emerald: {
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25",
    bar: "from-emerald-500 to-teal-500",
  },
  amber: {
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/25",
    bar: "from-amber-500 to-orange-500",
  },
  rose: {
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/25",
    bar: "from-rose-500 to-pink-500",
  },
  fuchsia: {
    iconBg: "bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-fuchsia-500/25",
    bar: "from-fuchsia-500 to-purple-500",
  },
};

function MetricCard({ title, value, icon: Icon, accent = "violet", prefix = "", note }) {
  const palette = ACCENTS[accent] || ACCENTS.violet;
  return (
    <Card className="relative overflow-hidden py-4 border-slate-200/80 bg-white/95 hover:shadow-md transition-all duration-200">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${palette.bar}`} />
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
              {title}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value ?? 0}
            </p>
            {note && (
              <p className="text-[11px] text-slate-400 mt-1 truncate">{note}</p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${palette.iconBg}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ data = {} }) {
  const [chartTab, setChartTab] = useState("orders");

  const {
    orderStats = {
      total: 0,
      confirmed: 0,
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    revenueStats = {
      totalRevenue: 0,
      totalDiscount: 0,
      totalShipping: 0,
      totalAdvanced: 0,
      totalDue: 0,
      avgOrderValue: 0,
    },
    recentOrders = [],
    topProducts = [],
    dailySales = [],
    ordersByType = [],
    ordersByLocation = [],
    ordersByStatus = [],
    totalProducts = { total: 0, active: 0 },
    lowStockProducts = [],
    totalCustomers = 0,
    dateFrom,
    dateTo,
  } = data;

  const fulfillment = pct(
    orderStats.confirmed + orderStats.shipped + orderStats.delivered,
    orderStats.total
  );

  const statusPie = [
    { name: "Confirmed", value: orderStats.confirmed, color: "#10b981" },
    { name: "Pending", value: orderStats.pending, color: "#f59e0b" },
    { name: "Shipped", value: orderStats.shipped, color: "#7c3aed" },
    { name: "Delivered", value: orderStats.delivered, color: "#06b6d4" },
    { name: "Cancelled", value: orderStats.cancelled, color: "#f43f5e" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner + Filter */}
      <Card className="rgb-card border-slate-200/80 bg-white/95 shadow-sm py-5">
        <CardContent className="px-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Store Performance
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome Back to <span className="rgb-gradient-text">AMARDokan</span>
              </h1>
              <p
                className="text-xs sm:text-sm text-slate-500 mt-0.5"
                suppressHydrationWarning
              >
                {new Date().toLocaleDateString("en-BD", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/add-product">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link href="/" target="_blank">
                  <ExternalLink className="w-4 h-4" />
                  Visit Storefront
                </Link>
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Filter by Date Range
            </p>
            <Suspense fallback={null}>
              <DashboardFilter dateFrom={dateFrom} dateTo={dateTo} />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Order Status KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Total Orders" value={orderStats.total} icon={ShoppingCart} accent="violet" />
        <MetricCard title="Confirmed" value={orderStats.confirmed} icon={CheckCircle2} accent="emerald" />
        <MetricCard title="Pending" value={orderStats.pending} icon={Clock} accent="amber" />
        <MetricCard title="Shipped" value={orderStats.shipped} icon={Truck} accent="fuchsia" />
        <MetricCard title="Delivered" value={orderStats.delivered} icon={Package} accent="cyan" />
        <MetricCard title="Cancelled" value={orderStats.cancelled} icon={XCircle} accent="rose" />
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Total Revenue" value={revenueStats.totalRevenue} icon={DollarSign} accent="emerald" prefix="৳" />
        <MetricCard title="Avg Order Value" value={revenueStats.avgOrderValue} icon={BarChart3} accent="violet" prefix="৳" />
        <MetricCard title="Total Discount" value={revenueStats.totalDiscount} icon={TrendingUp} accent="amber" prefix="৳" />
        <MetricCard title="Shipping Earned" value={revenueStats.totalShipping} icon={Truck} accent="cyan" prefix="৳" />
        <MetricCard title="Advanced Paid" value={revenueStats.totalAdvanced} icon={CheckCircle2} accent="fuchsia" prefix="৳" />
        <MetricCard title="Total Due" value={revenueStats.totalDue} icon={AlertTriangle} accent="rose" prefix="৳" />
      </div>

      {/* Business Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Products"
          value={totalProducts.total}
          icon={Boxes}
          accent="violet"
          note={`${totalProducts.active} active listings`}
        />
        <MetricCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          accent="cyan"
          note="Unique buyers in range"
        />
        <MetricCard
          title="Fulfillment Rate"
          value={`${fulfillment}%`}
          icon={TrendingUp}
          accent="emerald"
          note="Confirmed + Shipped + Delivered"
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          accent="amber"
          note="Inventory ≤ 5 units"
        />
      </div>

      {/* Daily Performance Area Chart + Order Status Donut */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-slate-200/80 bg-white/95">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Daily Performance
              </CardTitle>
              <CardDescription className="text-xs">
                Orders and revenue trend across the selected window
              </CardDescription>
            </div>
            <Tabs value={chartTab} onValueChange={setChartTab}>
              <TabsList className="h-8">
                <TabsTrigger value="orders" className="text-xs px-3">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="revenue" className="text-xs px-3">
                  Revenue
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart
                  data={dailySales}
                  margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rgbOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rgbRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      chartTab === "revenue" ? `৳${(v / 1000).toFixed(0)}k` : v
                    }
                  />
                  <Tooltip content={<ChartTooltip />} />
                  {chartTab === "orders" ? (
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#7c3aed"
                      strokeWidth={2.5}
                      fill="url(#rgbOrders)"
                      name="Orders"
                      dot={{ r: 3, fill: "#7c3aed" }}
                      activeDot={{ r: 5 }}
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#rgbRevenue)"
                      name="Revenue (৳)"
                      dot={{ r: 3, fill: "#10b981" }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/95">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">
              Order Status Mix
            </CardTitle>
            <CardDescription className="text-xs">
              Proportional breakdown of orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusPie.length > 0 ? (
              <>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie
                        data={statusPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={74}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {statusPie.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [v, "Orders"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-3">
                  {statusPie.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-600 font-medium">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {item.value}{" "}
                        <span className="font-normal text-slate-400">
                          ({pct(item.value, orderStats.total)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-52 text-slate-400">
                <ShoppingCart className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-medium">No orders in range</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source + Location + Status Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { title: "Orders by Source", desc: "Website vs Landing vs Manual", data: ordersByType },
          { title: "Orders by Location", desc: "Inside vs Outside Dhaka", data: ordersByLocation },
          { title: "Orders by Status", desc: "Pipeline distribution", data: ordersByStatus },
        ].map(({ title, desc, data: cdata }) => (
          <Card key={title} className="border-slate-200/80 bg-white/95">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-900">
                {title}
              </CardTitle>
              <CardDescription className="text-xs">{desc}</CardDescription>
            </CardHeader>
            <CardContent>
              {cdata?.length > 0 ? (
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart
                      data={cdata}
                      layout="vertical"
                      margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#475569", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="value" name="Orders" radius={[0, 6, 6, 0]}>
                        {cdata.map((e, i) => (
                          <Cell key={i} fill={e.color || "#7c3aed"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-44 text-slate-400 text-sm">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-3 border-slate-200/80 bg-white/95 py-0 overflow-hidden gap-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
              <p className="text-xs text-slate-500">Latest 5 customer orders</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-violet-600">
              <Link href="/dashboard/orders">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <ShoppingCart className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm font-medium">No orders in this period</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order, i) => (
                <div
                  key={order._id ?? i}
                  className="px-6 py-3.5 hover:bg-slate-50/80 transition-colors flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/15 to-cyan-500/15 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                    {(order?.customer?.customerName?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {order?.customer?.customerName ?? "Guest Customer"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {order?.customer?.customerPhone ?? "—"} ·{" "}
                      <span className="capitalize">{order?.orderType ?? "website"}</span>
                      {order.createdAt
                        ? ` · ${new Date(order.createdAt).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                          })}`
                        : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900">
                      {tk(order?.grand_total)}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-[10px] capitalize ${
                        statusBadgeStyle[order.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="xl:col-span-2 border-slate-200/80 bg-white/95 py-0 overflow-hidden gap-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Products</h3>
              <p className="text-xs text-slate-500">Best sellers by volume</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-violet-600">
              <Link href="/dashboard/products">
                All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <TrendingUp className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm font-medium">No sales data in this period</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {topProducts.map((p, i) => {
                const max =
                  Math.max(...topProducts.map((x) => x.saleCount ?? 0)) || 1;
                return (
                  <div
                    key={p._id ?? i}
                    className="px-6 py-3.5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                          i === 0
                            ? "bg-amber-100 text-amber-700"
                            : i === 1
                            ? "bg-slate-100 text-slate-600"
                            : "bg-violet-50 text-violet-600"
                        }`}
                      >
                        #{i + 1}
                      </span>
                      {p.mainImage?.url ? (
                        <img
                          src={p.mainImage.url}
                          alt={p.productName}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-violet-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {p.productName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {tk(p.regularPrice)} ·{" "}
                          <span className="font-semibold text-violet-600">
                            {p.saleCount} sold
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 rounded-full"
                        style={{ width: `${((p.saleCount ?? 0) / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-amber-200/90 bg-white/95 py-0 overflow-hidden gap-0">
          <div className="flex items-center gap-3 px-6 py-3.5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-900">
              Low Stock Alert ({lowStockProducts.length})
            </h3>
            <Link
              href="/dashboard/products"
              className="ml-auto text-xs font-semibold text-amber-700 hover:underline"
            >
              Restock Now →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {lowStockProducts.map((p, i) => (
              <div key={p._id ?? i} className="px-5 py-4 flex items-center gap-3">
                {p.mainImage?.url ? (
                  <img
                    src={p.mainImage.url}
                    alt={p.productName}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-amber-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {p.productName}
                  </p>
                  <p className="text-[11px] text-amber-600 font-bold mt-0.5">
                    {p.availableQuantity} left · {tk(p.regularPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* RGB Quick Action Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            href: "/dashboard/orders",
            label: "Manage Orders",
            sub: "Track & fulfill",
            icon: ShoppingCart,
            grad: "from-violet-600 via-indigo-600 to-blue-600",
          },
          {
            href: "/dashboard/add-product",
            label: "Add New Product",
            sub: "Expand catalog",
            icon: Plus,
            grad: "from-emerald-500 via-teal-500 to-cyan-600",
          },
          {
            href: "/dashboard/analytics",
            label: "Deep Analytics",
            sub: "Sales & cohorts",
            icon: BarChart3,
            grad: "from-fuchsia-600 via-purple-600 to-indigo-600",
          },
          {
            href: "/dashboard/myshop/manage",
            label: "Store Setup",
            sub: "Domain, courier & SEO",
            icon: Settings,
            grad: "from-amber-500 via-orange-500 to-rose-500",
          },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className={`bg-gradient-to-br ${a.grad} text-white rounded-2xl p-5 flex items-center justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group`}
            >
              <div>
                <p className="text-sm font-bold">{a.label}</p>
                <p className="text-xs text-white/80 mt-0.5">{a.sub}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
