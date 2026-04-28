"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  FiShoppingCart, FiCheckCircle, FiClock, FiXCircle,
  FiTruck, FiPackage, FiTrendingUp, FiArrowUpRight,
  FiArrowDownRight, FiExternalLink, FiRefreshCw,
} from "react-icons/fi";

// ─── Chart colours ────────────────────────────────────────────────────────────
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// ─── Weekly mock chart data (visual only) ─────────────────────────────────────
const weeklySales = [
  { day: "Mon", orders: 18, revenue: 45000 },
  { day: "Tue", orders: 24, revenue: 62000 },
  { day: "Wed", orders: 19, revenue: 48000 },
  { day: "Thu", orders: 31, revenue: 78000 },
  { day: "Fri", orders: 27, revenue: 69000 },
  { day: "Sat", orders: 42, revenue: 105000 },
  { day: "Sun", orders: 15, revenue: 38000 },
];

const orderSourceData = [
  { name: "Landing Page", value: 38, color: "#6366f1" },
  { name: "Direct", value: 27, color: "#10b981" },
  { name: "Phone Call", value: 20, color: "#f59e0b" },
  { name: "Social Media", value: 15, color: "#ef4444" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const currency = (n) =>
  `৳${Number(n ?? 0).toLocaleString("en-IN")}`;

const statusStyles = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pending:   "bg-amber-50  text-amber-700  ring-1 ring-amber-200",
  shipped:   "bg-sky-50    text-sky-700    ring-1 ring-sky-200",
  delivered: "bg-blue-50   text-blue-700   ring-1 ring-blue-200",
  cancelled: "bg-red-50    text-red-700    ring-1 ring-red-200",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur border border-gray-100 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="flex items-center gap-1">
          <span className="font-medium">{entry.name}:</span>
          <span>{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, change, prefix = "", suffix = "" }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900">
          {prefix}{typeof value === "number" ? value.toLocaleString() : (value ?? 0)}{suffix}
        </p>
        {change !== undefined && (
          <p className={`text-xs mt-1.5 flex items-center gap-0.5 font-semibold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {change >= 0
              ? <FiArrowUpRight className="w-3.5 h-3.5" />
              : <FiArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(change)}% this week
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard({ recentOrderList = [], topSellingProducts = [], orderDashboardStats = {} }) {
  const [activeChart, setActiveChart] = useState("orders");

  const stats = {
    total:     orderDashboardStats?.totalOrders ?? 0,
    confirmed: orderDashboardStats?.confirmed   ?? 0,
    pending:   orderDashboardStats?.pending     ?? 0,
    shipped:   orderDashboardStats?.shipped     ?? 0,
    cancelled: orderDashboardStats?.cancelled   ?? 0,
  };

  // Derived order status distribution for pie chart
  const orderStatusPie = [
    { name: "Confirmed", value: stats.confirmed, color: "#10b981" },
    { name: "Pending",   value: stats.pending,   color: "#f59e0b" },
    { name: "Shipped",   value: stats.shipped,   color: "#6366f1" },
    { name: "Cancelled", value: stats.cancelled, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const fulfillmentRate =
    stats.total > 0
      ? (((stats.confirmed + stats.shipped) / stats.total) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gray-50/80 p-4 lg:p-6 space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all">
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-indigo-200 hover:shadow-md transition-all"
          >
            <FiExternalLink className="w-4 h-4" />
            Visit Website
          </Link>
        </div>
      </div>

      {/* ── Top Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Total Orders"  value={stats.total}     icon={FiShoppingCart}  iconBg="bg-indigo-50"  iconColor="text-indigo-600" change={8.3}  />
        <StatCard title="Confirmed"     value={stats.confirmed} icon={FiCheckCircle}   iconBg="bg-emerald-50" iconColor="text-emerald-600" change={12.1} />
        <StatCard title="Pending"       value={stats.pending}   icon={FiClock}         iconBg="bg-amber-50"   iconColor="text-amber-600"  change={-2.4} />
        <StatCard title="Shipped"       value={stats.shipped}   icon={FiTruck}         iconBg="bg-sky-50"     iconColor="text-sky-600"    change={5.7}  />
        <StatCard title="Cancelled"     value={stats.cancelled} icon={FiXCircle}       iconBg="bg-red-50"     iconColor="text-red-600"    change={-5.2} />
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Sales / Orders Area Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Weekly Performance</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 7 days order & revenue trend</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {["orders", "revenue"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChart(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                    activeChart === tab
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySales} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => activeChart === "revenue" ? `৳${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomTooltip />} />
                {activeChart === "orders" ? (
                  <Area type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2.5}
                    fill="url(#gradOrders)" name="Orders" dot={{ r: 3, fill: "#6366f1" }} activeDot={{ r: 5 }}
                  />
                ) : (
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5}
                    fill="url(#gradRevenue)" name="Revenue (৳)" dot={{ r: 3, fill: "#10b981" }} activeDot={{ r: 5 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Order Status</h3>
            <p className="text-xs text-gray-400 mt-0.5">Distribution of all orders</p>
          </div>

          {orderStatusPie.length > 0 ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusPie} cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                      paddingAngle={4} dataKey="value" strokeWidth={0}
                    >
                      {orderStatusPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v, "Orders"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {orderStatusPie.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{item.value}</span>
                      <span className="text-[10px] text-gray-400">
                        ({stats.total > 0 ? ((item.value / stats.total) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <FiPackage className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Middle Row: Source Chart + Fulfillment + Quick Stats ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Order Source Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Order Source Distribution</h3>
            <p className="text-xs text-gray-400 mt-0.5">Where your orders come from</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderSourceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis type="category" dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Share %" radius={[0, 6, 6, 0]}>
                  {orderSourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fulfillment Rate + Quick Metrics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Fulfillment Rate</h3>
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke={parseFloat(fulfillmentRate) >= 70 ? "#10b981" : parseFloat(fulfillmentRate) >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(parseFloat(fulfillmentRate) / 100) * 314} 314`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900">{fulfillmentRate}%</span>
                  <span className="text-[10px] text-gray-400 text-center leading-tight">Fulfilled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-50">
            {[
              { label: "Confirmed + Shipped", value: stats.confirmed + stats.shipped, color: "bg-emerald-500" },
              { label: "Pending",              value: stats.pending,                   color: "bg-amber-400" },
              { label: "Cancelled",            value: stats.cancelled,                 color: "bg-red-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-gray-500 text-xs">{item.label}</span>
                </div>
                <span className="font-bold text-gray-900 text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recent Orders + Top Products ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Recent Orders Table */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest {recentOrderList.length} orders</p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              View All <FiArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrderList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiShoppingCart className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No orders yet</p>
              <p className="text-xs mt-1">Your recent orders will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrderList.map((order, idx) => (
                <div key={order.id ?? idx} className="px-6 py-4 hover:bg-gray-50/70 transition-colors flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                    {(order?.customer?.customerName?.[0] ?? "?").toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {order?.customer?.customerName ?? "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order?.customer?.customerPhone ?? "—"} ·{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" }) : ""}
                    </p>
                  </div>
                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {currency(order?.grand_total)}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyles[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status ?? "unknown"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Top Products</h3>
              <p className="text-xs text-gray-400 mt-0.5">By order count</p>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              All Products <FiArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {topSellingProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiTrendingUp className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No data yet</p>
              <p className="text-xs mt-1">Top products will appear after orders</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {topSellingProducts.map((product, idx) => {
                const maxSales = Math.max(...topSellingProducts.map((p) => p.saleCount ?? 0)) || 1;
                const pct = Math.round(((product.saleCount ?? 0) / maxSales) * 100);
                return (
                  <div key={product._id ?? idx} className="px-6 py-4 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Rank */}
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                        idx === 0 ? "bg-amber-100 text-amber-700" :
                        idx === 1 ? "bg-gray-100 text-gray-600" :
                        idx === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-indigo-50 text-indigo-500"
                      }`}>
                        #{idx + 1}
                      </span>
                      {/* Image */}
                      {product.mainImage ? (
                        <img src={product.mainImage} alt={product.productName}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <FiPackage className="w-4 h-4 text-indigo-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{product.productName ?? "—"}</p>
                        <p className="text-[10px] text-gray-400">
                          {currency(product.regularPrice)} · {product.saleCount ?? 0} sold
                        </p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Action Links ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: "/dashboard/orders",   label: "Manage Orders",   icon: FiShoppingCart, color: "from-indigo-500 to-indigo-600" },
          { href: "/dashboard/products", label: "Add Product",     icon: FiPackage,      color: "from-emerald-500 to-emerald-600" },
          { href: "/dashboard/analytics",label: "View Analytics",  icon: FiTrendingUp,   color: "from-violet-500 to-violet-600" },
          { href: "/dashboard/settings", label: "Shop Settings",   icon: FiExternalLink, color: "from-amber-500 to-amber-600" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`bg-gradient-to-br ${action.color} text-white rounded-2xl p-5 flex items-center gap-3 hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}
          >
            <action.icon className="w-5 h-5 flex-shrink-0 opacity-90" />
            <span className="text-sm font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
