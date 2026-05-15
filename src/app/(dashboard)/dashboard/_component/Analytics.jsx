"use client";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const tk = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;
const fmtNum = (n) => Number(n || 0).toLocaleString("en-BD");

const STATUS_COLOR = {
  Pending:   "#f59e0b",
  Confirmed: "#10b981",
  Shipped:   "#6366f1",
  Delivered: "#3b82f6",
  Cancelled: "#ef4444",
};

function StatCard({ label, value, sub, icon, color = "indigo", trend, trendUp }) {
  const bg = { indigo:"bg-indigo-50 text-indigo-600", green:"bg-green-50 text-green-600", orange:"bg-orange-50 text-orange-600", blue:"bg-blue-50 text-blue-600", purple:"bg-purple-50 text-purple-600", red:"bg-red-50 text-red-600" };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${bg[color]}`}>{icon}</div>
        {trend != null && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {trendUp !== false ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold text-gray-800 text-base">{children}</h2>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name.toLowerCase().includes("revenue") || p.name.toLowerCase().includes("avg") ? tk(p.value) : fmtNum(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Analytics({ data }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState("overview");
  const [dateFrom, setDateFrom] = useState(data?.dateFrom || "");
  const [dateTo,   setDateTo]   = useState(data?.dateTo   || "");

  const applyFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo)   params.set("dateTo",   dateTo);
    router.push(`${pathname}?${params.toString()}`);
  }, [dateFrom, dateTo, pathname, router]);

  const resetFilter = () => {
    setDateFrom(""); setDateTo("");
    router.push(pathname);
  };

  const { orderStats = {}, revenueStats = {}, dailySales = [], topProducts = [],
          ordersByType = [], ordersByLocation = [], ordersByStatus = [],
          totalProducts = {}, lowStockProducts = [], totalCustomers = 0 } = data || {};

  const TABS = ["overview", "sales", "products", "customers"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
              <p className="text-xs text-gray-400 mt-0.5">Real-time insights from your shop data</p>
            </div>
            {/* Date filter */}
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 transition-all"/>
              <span className="text-gray-400 text-sm">to</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 transition-all"/>
              <button onClick={applyFilter} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Apply</button>
              {(data?.dateFrom || data?.dateTo) && (
                <button onClick={resetFilter} className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Reset</button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b -mb-px">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 ${tab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard icon="💰" label="Total Revenue" value={tk(revenueStats.totalRevenue)} sub={`Avg: ${tk(revenueStats.avgOrderValue)}/order`} color="indigo"/>
              <StatCard icon="🛒" label="Total Orders" value={fmtNum(orderStats.total)} sub={`${orderStats.pending || 0} pending`} color="blue"/>
              <StatCard icon="👥" label="Customers" value={fmtNum(totalCustomers)} color="green"/>
              <StatCard icon="📦" label="Products" value={fmtNum(totalProducts.total)} sub={`${totalProducts.active || 0} active`} color="purple"/>
              <StatCard icon="🚚" label="Shipping Revenue" value={tk(revenueStats.totalShipping)} sub={`Due: ${tk(revenueStats.totalDue)}`} color="orange"/>
            </div>

            {/* Order status row */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                { label: "Confirmed", value: orderStats.confirmed, color: "bg-emerald-100 text-emerald-800" },
                { label: "Pending",   value: orderStats.pending,   color: "bg-yellow-100 text-yellow-800" },
                { label: "Shipped",   value: orderStats.shipped,   color: "bg-indigo-100 text-indigo-800" },
                { label: "Delivered", value: orderStats.delivered, color: "bg-blue-100 text-blue-800" },
                { label: "Cancelled", value: orderStats.cancelled, color: "bg-red-100 text-red-800" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl px-4 py-3 text-center border ${s.color} border-transparent`}>
                  <p className="text-xl font-bold">{fmtNum(s.value)}</p>
                  <p className="text-xs font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Daily Sales Area Chart */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <SectionTitle sub="Orders and revenue per day">Daily Sales Trend</SectionTitle>
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dailySales} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}/>
                    <YAxis yAxisId="rev" orientation="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`}/>
                    <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend/>
                    <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2}/>
                    <Area yAxisId="ord" type="monotone" dataKey="orders"  name="Orders"  stroke="#10b981" fill="url(#ordGrad)"  strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              ) : <EmptyChart label="No sales data for this period"/>}
            </div>

            {/* Bottom row: Order types pie + Top products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="Breakdown by order source">Order Sources</SectionTitle>
                {ordersByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={ordersByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                        {ordersByType.map((entry, i) => <Cell key={i} fill={entry.color || `hsl(${i*60},70%,60%)`}/>)}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : <EmptyChart label="No order data"/>}
              </div>

              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="By units sold">Top 5 Products</SectionTitle>
                {topProducts.length > 0 ? (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => {
                      const maxSales = topProducts[0]?.saleCount || 1;
                      return (
                        <div key={p._id || i} className="flex items-center gap-3">
                          <span className="w-5 text-xs font-bold text-gray-400">{i+1}</span>
                          {p.mainImage?.url && <img src={p.mainImage.url} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0 bg-gray-100"/>}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-800 truncate">{p.productName}</p>
                              <span className="text-xs font-semibold text-indigo-700 ml-2 flex-shrink-0">{fmtNum(p.saleCount)} sold</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(p.saleCount / maxSales) * 100}%` }}/>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <EmptyChart label="No product sales data"/>}
              </div>
            </div>
          </>
        )}

        {/* SALES TAB */}
        {tab === "sales" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="💰" label="Total Revenue"   value={tk(revenueStats.totalRevenue)}  color="indigo"/>
              <StatCard icon="📦" label="Avg Order Value" value={tk(revenueStats.avgOrderValue)} color="blue"/>
              <StatCard icon="🚚" label="Shipping Collected" value={tk(revenueStats.totalShipping)} color="green"/>
              <StatCard icon="⏳" label="Total Due"       value={tk(revenueStats.totalDue)}      color="orange"/>
            </div>

            {/* Revenue bar chart */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <SectionTitle sub="Daily revenue over selected period">Revenue Chart</SectionTitle>
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailySales} margin={{ top:5, right:10, left:10, bottom:5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="day" tick={{ fontSize:11 }} tickLine={false} axisLine={false}/>
                    <YAxis tick={{ fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyChart label="No revenue data for this period"/>}
            </div>

            {/* Order status & location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="Orders by status">Order Status Distribution</SectionTitle>
                {ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={ordersByStatus} layout="vertical" margin={{ left:10, right:10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
                      <XAxis type="number" tick={{ fontSize:11 }} tickLine={false} axisLine={false}/>
                      <YAxis type="category" dataKey="name" tick={{ fontSize:11 }} tickLine={false} axisLine={false} width={70}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Bar dataKey="value" name="Orders" radius={[0,4,4,0]}>
                        {ordersByStatus.map((entry, i) => <Cell key={i} fill={entry.color || "#6366f1"}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyChart label="No order data"/>}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="Orders by delivery zone">Delivery Locations</SectionTitle>
                {ordersByLocation.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={ordersByLocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} fontSize={11}>
                        {ordersByLocation.map((e, i) => <Cell key={i} fill={e.color || `hsl(${i*80},65%,55%)`}/>)}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : <EmptyChart label="No location data"/>}
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="📦" label="Total Products"  value={fmtNum(totalProducts.total)}   color="indigo"/>
              <StatCard icon="✅" label="Active Products"  value={fmtNum(totalProducts.active)}  color="green"/>
              <StatCard icon="⭐" label="Featured"         value={fmtNum(totalProducts.featured)} color="orange"/>
              <StatCard icon="⚠️" label="Low Stock"        value={fmtNum(lowStockProducts.length)} color="red"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Top products bar */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="By units sold">Top Products</SectionTitle>
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={topProducts.map(p => ({ name: p.productName?.slice(0,18)+"…", sales: p.saleCount }))} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
                      <XAxis type="number" tick={{ fontSize:11 }} tickLine={false} axisLine={false}/>
                      <YAxis type="category" dataKey="name" tick={{ fontSize:10 }} width={110} tickLine={false} axisLine={false}/>
                      <Tooltip/>
                      <Bar dataKey="sales" name="Units Sold" fill="#10b981" radius={[0,4,4,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyChart label="No product sales data"/>}
              </div>

              {/* Low stock table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="Products with ≤5 units remaining">Low Stock Alert</SectionTitle>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-3">
                    {lowStockProducts.map((p, i) => (
                      <div key={p._id || i} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                        {p.mainImage?.url && <img src={p.mainImage.url} alt="" className="w-9 h-9 rounded-lg object-cover border border-red-200 flex-shrink-0"/>}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.productName}</p>
                          <p className="text-xs text-gray-500">{tk(p.regularPrice)}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.availableQuantity <= 2 ? "bg-red-200 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {p.availableQuantity} left
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-sm font-medium text-gray-500">All products well stocked</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* CUSTOMERS TAB */}
        {tab === "customers" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon="👥" label="Total Customers"   value={fmtNum(totalCustomers)}       color="indigo"/>
              <StatCard icon="🛒" label="Total Orders"      value={fmtNum(orderStats.total)}     color="green"/>
              <StatCard icon="💰" label="Revenue per Customer" value={totalCustomers > 0 ? tk(Math.round(revenueStats.totalRevenue / totalCustomers)) : tk(0)} color="orange"/>
            </div>

            {/* Orders per day = proxy for customer activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <SectionTitle sub="Daily order activity">Customer Activity</SectionTitle>
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dailySales} margin={{ top:5, right:10, left:10, bottom:5 }}>
                    <defs>
                      <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="day" tick={{ fontSize:11 }} tickLine={false} axisLine={false}/>
                    <YAxis tick={{ fontSize:11 }} tickLine={false} axisLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Area type="monotone" dataKey="orders" name="Orders" stroke="#10b981" fill="url(#custGrad)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              ) : <EmptyChart label="No activity data"/>}
            </div>

            {/* Order type breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="How customers place orders">Order Channels</SectionTitle>
                <div className="space-y-3 mt-2">
                  {ordersByType.length > 0 ? ordersByType.map((t, i) => {
                    const total = ordersByType.reduce((s, x) => s + x.value, 0) || 1;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{t.name}</span>
                          <span className="font-semibold text-gray-900">{fmtNum(t.value)} <span className="text-gray-400 font-normal">({((t.value/total)*100).toFixed(0)}%)</span></span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${(t.value/total)*100}%`, background: t.color || "#6366f1" }}/>
                        </div>
                      </div>
                    );
                  }) : <EmptyChart label="No channel data"/>}
                </div>
              </div>

              {/* Financial breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle sub="Revenue breakdown">Financial Summary</SectionTitle>
                <div className="space-y-3 mt-2">
                  {[
                    { label: "Gross Revenue",   value: revenueStats.totalRevenue,  color: "bg-indigo-500" },
                    { label: "Shipping Income", value: revenueStats.totalShipping, color: "bg-blue-500" },
                    { label: "Total Discounts", value: revenueStats.totalDiscount, color: "bg-orange-500" },
                    { label: "Amount Due",      value: revenueStats.totalDue,      color: "bg-red-500" },
                    { label: "Advanced Paid",   value: revenueStats.totalAdvanced, color: "bg-green-500" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}/>
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{tk(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center text-gray-400">
      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}