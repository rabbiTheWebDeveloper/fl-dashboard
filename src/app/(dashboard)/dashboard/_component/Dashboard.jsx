"use client";
import Link from "next/link";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FiShoppingCart, FiCheckCircle, FiClock, FiXCircle, FiTruck,
  FiPackage, FiTrendingUp, FiUsers, FiDollarSign,
  FiAlertTriangle, FiExternalLink, FiBarChart2, FiArrowUpRight,
} from "react-icons/fi";
import DashboardFilter from "./DashboardFilter";

const tk = (n) => `৳${Number(n ?? 0).toLocaleString("en-IN")}`;
const pct = (a, b) => (b > 0 ? ((a / b) * 100).toFixed(1) : "0.0");

const statusStyle = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending:   "bg-amber-100 text-amber-700",
  shipped:   "bg-sky-100 text-sky-700",
  delivered: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color }}>{e.name}: {e.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

const Card = ({ title, value, icon: Icon, bg, ic, prefix = "", note }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">
          {prefix}{typeof value === "number" ? value.toLocaleString() : (value ?? 0)}
        </p>
        {note && <p className="text-[11px] text-gray-400 mt-1">{note}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-5 h-5 ${ic}`} />
      </div>
    </div>
  </div>
);

export default function Dashboard({ data = {} }) {
  const [chartTab, setChartTab] = useState("orders");

  const {
    orderStats       = { total:0, confirmed:0, pending:0, shipped:0, delivered:0, cancelled:0 },
    revenueStats     = { totalRevenue:0, totalDiscount:0, totalShipping:0, totalAdvanced:0, totalDue:0, avgOrderValue:0 },
    recentOrders     = [],
    topProducts      = [],
    dailySales       = [],
    ordersByType     = [],
    ordersByLocation = [],
    ordersByStatus   = [],
    totalProducts    = { total:0, active:0 },
    lowStockProducts = [],
    totalCustomers   = 0,
    dateFrom, dateTo,
  } = data;

  const fulfillment = pct(
    orderStats.confirmed + orderStats.shipped + orderStats.delivered,
    orderStats.total
  );

  const statusPie = [
    { name: "Confirmed", value: orderStats.confirmed, color: "#10b981" },
    { name: "Pending",   value: orderStats.pending,   color: "#f59e0b" },
    { name: "Shipped",   value: orderStats.shipped,   color: "#6366f1" },
    { name: "Delivered", value: orderStats.delivered, color: "#3b82f6" },
    { name: "Cancelled", value: orderStats.cancelled, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 space-y-6">

      {/* ── Header + Filter ── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date().toLocaleDateString("en-BD", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all self-start">
            <FiExternalLink className="w-4 h-4" /> Visit Website
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Filter by Date Range</p>
          <DashboardFilter dateFrom={dateFrom} dateTo={dateTo} />
        </div>
      </div>

      {/* ── Order Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card title="Total Orders"  value={orderStats.total}     icon={FiShoppingCart} bg="bg-indigo-50"  ic="text-indigo-600" />
        <Card title="Confirmed"     value={orderStats.confirmed} icon={FiCheckCircle}  bg="bg-emerald-50" ic="text-emerald-600" />
        <Card title="Pending"       value={orderStats.pending}   icon={FiClock}        bg="bg-amber-50"   ic="text-amber-600" />
        <Card title="Shipped"       value={orderStats.shipped}   icon={FiTruck}        bg="bg-sky-50"     ic="text-sky-600" />
        <Card title="Delivered"     value={orderStats.delivered} icon={FiPackage}      bg="bg-blue-50"    ic="text-blue-600" />
        <Card title="Cancelled"     value={orderStats.cancelled} icon={FiXCircle}      bg="bg-red-50"     ic="text-red-600" />
      </div>

      {/* ── Revenue Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card title="Total Revenue"   value={revenueStats.totalRevenue}  icon={FiDollarSign}   bg="bg-emerald-50" ic="text-emerald-600" prefix="৳" />
        <Card title="Avg Order Value" value={revenueStats.avgOrderValue} icon={FiBarChart2}    bg="bg-violet-50"  ic="text-violet-600"  prefix="৳" />
        <Card title="Total Discount"  value={revenueStats.totalDiscount} icon={FiTrendingUp}   bg="bg-orange-50"  ic="text-orange-600"  prefix="৳" />
        <Card title="Shipping Earned" value={revenueStats.totalShipping} icon={FiTruck}        bg="bg-sky-50"     ic="text-sky-600"     prefix="৳" />
        <Card title="Advanced Paid"   value={revenueStats.totalAdvanced} icon={FiCheckCircle}  bg="bg-teal-50"    ic="text-teal-600"    prefix="৳" />
        <Card title="Total Due"       value={revenueStats.totalDue}      icon={FiAlertTriangle} bg="bg-red-50"    ic="text-red-500"     prefix="৳" />
      </div>

      {/* ── Business Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card title="Total Products"   value={totalProducts.total}     icon={FiPackage}      bg="bg-indigo-50"  ic="text-indigo-600"  note={`${totalProducts.active} active`} />
        <Card title="Total Customers"  value={totalCustomers}          icon={FiUsers}        bg="bg-pink-50"    ic="text-pink-600" />
        <Card title="Fulfillment Rate" value={`${fulfillment}%`}       icon={FiTrendingUp}   bg="bg-emerald-50" ic="text-emerald-600" note="Confirmed+Shipped+Delivered" />
        <Card title="Low Stock Items"  value={lowStockProducts.length} icon={FiAlertTriangle} bg="bg-amber-50"  ic="text-amber-600"   note="Qty ≤ 5" />
      </div>

      {/* ── Area Chart + Status Pie ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Daily Performance</h3>
              <p className="text-xs text-gray-400">Orders & revenue over selected period</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {["orders","revenue"].map((t) => (
                <button key={t} onClick={() => setChartTab(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${chartTab===t ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales} margin={{ top:5, right:5, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fill:"#9ca3af", fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"#9ca3af", fontSize:10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => chartTab==="revenue" ? `৳${(v/1000).toFixed(0)}k` : v} />
                <Tooltip content={<Tip />} />
                {chartTab==="orders"
                  ? <Area type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2.5} fill="url(#gO)" name="Orders" dot={{ r:3, fill:"#6366f1" }} activeDot={{ r:5 }} />
                  : <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#gR)" name="Revenue (৳)" dot={{ r:3, fill:"#10b981" }} activeDot={{ r:5 }} />
                }
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Order Status</h3>
          {statusPie.length > 0 ? (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={48} outerRadius={74} paddingAngle={4} dataKey="value" strokeWidth={0}>
                      {statusPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [v, "Orders"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3">
                {statusPie.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-500">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{item.value} <span className="font-normal text-gray-400">({pct(item.value, orderStats.total)}%)</span></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-300">
              <FiShoppingCart className="w-12 h-12 mb-2" />
              <p className="text-sm">No orders in range</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Source + Location + Status Bar Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { title:"Orders by Source",   data: ordersByType },
          { title:"Orders by Location", data: ordersByLocation },
          { title:"Orders by Status",   data: ordersByStatus },
        ].map(({ title, data: cdata }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">{title}</h3>
            {cdata?.length > 0 ? (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cdata} layout="vertical" margin={{ top:0, right:5, left:10, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fill:"#9ca3af", fontSize:10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill:"#6b7280", fontSize:10 }} axisLine={false} tickLine={false} width={85} />
                    <Tooltip content={<Tip />} />
                    <Bar dataKey="value" name="Orders" radius={[0,6,6,0]}>
                      {cdata.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-44 text-gray-300 text-sm">No data</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Recent Orders + Top Products ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
              View All <FiArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <FiShoppingCart className="w-12 h-12 mb-2" />
              <p className="text-sm">No orders in this period</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order, i) => (
                <div key={order._id ?? i} className="px-6 py-3.5 hover:bg-gray-50 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                    {(order?.customer?.customerName?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{order?.customer?.customerName ?? "Unknown"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order?.customer?.customerPhone ?? "—"} · {order?.orderType ?? ""} ·{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD",{day:"numeric",month:"short"}) : ""}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{tk(order?.grand_total)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Top Products</h3>
            <Link href="/dashboard/products" className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
              All <FiArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <FiTrendingUp className="w-12 h-12 mb-2" />
              <p className="text-sm">No sales data in this period</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {topProducts.map((p, i) => {
                const max = Math.max(...topProducts.map((x) => x.saleCount ?? 0)) || 1;
                return (
                  <div key={p._id ?? i} className="px-6 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black flex-shrink-0 ${i===0?"bg-amber-100 text-amber-700":i===1?"bg-slate-100 text-slate-500":"bg-orange-50 text-orange-600"}`}>
                        #{i+1}
                      </span>
                      {p.mainImage?.url ? (
                        <img src={p.mainImage.url} alt={p.productName} className="w-7 h-7 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <FiPackage className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{p.productName}</p>
                        <p className="text-[10px] text-gray-400">{tk(p.regularPrice)} · {p.saleCount} sold</p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width:`${((p.saleCount??0)/max)*100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Low Stock Alert ── */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-100 bg-amber-50">
            <FiAlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-amber-800">Low Stock Alert ({lowStockProducts.length})</h3>
            <Link href="/dashboard/products" className="ml-auto text-xs font-semibold text-amber-700 hover:underline">Manage →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-gray-100">
            {lowStockProducts.map((p, i) => (
              <div key={p._id ?? i} className="px-5 py-4 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-gray-100 last:border-0">
                {p.mainImage?.url ? (
                  <img src={p.mainImage.url} alt={p.productName} className="w-9 h-9 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <FiPackage className="w-4 h-4 text-amber-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{p.productName}</p>
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5">{p.availableQuantity} left · {tk(p.regularPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href:"/dashboard/orders",    label:"Manage Orders",  icon:FiShoppingCart, from:"from-indigo-500",  to:"to-indigo-600"  },
          { href:"/dashboard/products",  label:"Add Product",    icon:FiPackage,      from:"from-emerald-500", to:"to-emerald-600" },
          { href:"/dashboard/analytics", label:"View Analytics", icon:FiTrendingUp,   from:"from-violet-500",  to:"to-violet-600"  },
          { href:"/dashboard/settings",  label:"Shop Settings",  icon:FiExternalLink, from:"from-amber-500",   to:"to-amber-600"   },
        ].map((a) => (
          <Link key={a.href} href={a.href}
            className={`bg-gradient-to-br ${a.from} ${a.to} text-white rounded-2xl p-5 flex items-center gap-3 hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}>
            <a.icon className="w-5 h-5 opacity-90" />
            <span className="text-sm font-semibold">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
