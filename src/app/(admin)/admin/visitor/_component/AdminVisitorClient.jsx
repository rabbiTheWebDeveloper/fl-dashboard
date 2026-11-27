"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Clock,
  ExternalLink,
  Eye,
  MousePointerClick,
  RefreshCw,
  Search,
  Store,
  TrendingUp,
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const bdt = (val) =>
  `৳${Math.round(Number(val || 0)).toLocaleString("en-IN")}`;

export default function AdminVisitorClient({ initialData = {} }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    kpis = {},
    dailyTimeline = [],
    hourlyBuckets = [],
    shopLeaderboard = [],
  } = data;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/visitor", {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json?.success && json.data) {
        setData(json.data);
        toast.success("Visitor telemetry refreshed!");
      }
    } catch {
      toast.error("Failed to refresh visitor telemetry.");
    } finally {
      setRefreshing(false);
    }
  };

  const filteredShops = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return shopLeaderboard;
    return shopLeaderboard.filter(
      (s) =>
        String(s.shopName || "")
          .toLowerCase()
          .includes(q) ||
        String(s.shopSlug || "")
          .toLowerCase()
          .includes(q) ||
        String(s.ownerEmail || "")
          .toLowerCase()
          .includes(q)
    );
  }, [shopLeaderboard, search]);

  const maxShopVisits = Math.max(
    1,
    ...shopLeaderboard.map((s) => Number(s.totalVisits || 0))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Activity className="w-4 h-4" /> Real-Time Traffic Telemetry (UTC+6)
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Platform & Storefront Visitors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track daily & hourly storefront traffic across `/shop/[shopSlug]` and measure store-level order conversion.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={refreshing}
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Live Traffic
          </Button>
        </CardContent>
      </Card>

      {/* 5 Traffic KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          {
            label: "Today's Visitors",
            val: (kpis.todayVisitors || 0).toLocaleString(),
            sub: "Bangladesh Time (UTC+6)",
            icon: Eye,
            bar: "from-emerald-500 to-teal-600",
            tone: "bg-emerald-500/15 text-emerald-600",
          },
          {
            label: "7-Day Traffic",
            val: (kpis.last7DaysVisitors || 0).toLocaleString(),
            sub: "Rolling 7 days",
            icon: TrendingUp,
            bar: "from-violet-600 to-indigo-600",
            tone: "bg-violet-500/15 text-violet-600",
          },
          {
            label: "All-Time Visits",
            val: (kpis.allTimeVisitors || 0).toLocaleString(),
            sub: "Cumulative storefront views",
            icon: Activity,
            bar: "from-cyan-500 to-blue-600",
            tone: "bg-cyan-500/15 text-cyan-600",
          },
          {
            label: "Visited Stores",
            val: `${kpis.activeVisitedShops || 0} / ${kpis.totalShops || 0}`,
            sub: "Stores receiving traffic",
            icon: Store,
            bar: "from-amber-500 to-orange-500",
            tone: "bg-amber-500/15 text-amber-600",
          },
          {
            label: "Order Conversion",
            val: `${kpis.platformConversion || 0}%`,
            sub: `${kpis.totalOrders || 0} total orders`,
            icon: MousePointerClick,
            bar: "from-fuchsia-600 to-pink-600",
            tone: "bg-fuchsia-500/15 text-fuchsia-600",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              className="relative overflow-hidden py-4 border-slate-200/80 bg-white shadow-2xs"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.bar}`}
              />
              <CardContent className="px-4 sm:px-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.tone}`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {item.val}
                </p>
                <p className="text-[11px] text-slate-400">{item.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 14-Day Daily Traffic + 24-Hour Peak Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 border-slate-200/80 bg-white shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-extrabold">
              14-Day Storefront Visitor Trend
            </CardTitle>
            <CardDescription className="text-xs">
              Daily unique & repeat page sessions across merchant shops
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTimeline}>
                <defs>
                  <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#visGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border-slate-200/80 bg-white shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-extrabold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-violet-600" />
              Today&apos;s Hourly Traffic (00:00–23:00)
            </CardTitle>
            <CardDescription className="text-xs">
              Peak shopping hours in Bangladesh Standard Time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10 }}
                  interval={3}
                  stroke="#94a3b8"
                />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar
                  dataKey="visitors"
                  name="Hourly Visits"
                  fill="#7c3aed"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Store-Wise Visitor & Conversion Leaderboard */}
      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg font-extrabold">
              Store-by-Store Visitor & Conversion Leaderboard
            </CardTitle>
            <CardDescription className="text-xs">
              Compare storefront traffic against completed orders and GMV
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-68">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shop name, slug, owner..."
              className="pl-9 h-9 rounded-xl text-xs"
            />
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold">Storefront</TableHead>
                <TableHead className="font-bold">Owner</TableHead>
                <TableHead className="font-bold text-center">Today</TableHead>
                <TableHead className="font-bold min-w-[160px]">
                  Total Visits
                </TableHead>
                <TableHead className="font-bold text-center">Orders</TableHead>
                <TableHead className="font-bold text-center">
                  Conversion
                </TableHead>
                <TableHead className="font-bold text-right">GMV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.length > 0 ? (
                filteredShops.map((s) => {
                  const pctBar = Math.min(
                    100,
                    Math.round((s.totalVisits / maxShopVisits) * 100)
                  );
                  return (
                    <TableRow key={s._id}>
                      <TableCell>
                        <p className="font-bold text-slate-900 bangla-text">
                          {s.shopName}
                        </p>
                        <Link
                          href={`/shop/${encodeURIComponent(s.shopSlug)}`}
                          target="_blank"
                          className="text-xs text-violet-600 hover:underline inline-flex items-center gap-1"
                        >
                          /shop/{s.shopSlug}{" "}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-semibold text-slate-800 bangla-text">
                          {s.ownerName}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {s.ownerEmail}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-extrabold text-emerald-600">
                          {s.todayVisits}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className="text-xs font-extrabold text-slate-900">
                            {s.totalVisits.toLocaleString()} visits
                          </span>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
                              style={{ width: `${pctBar}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {s.orders}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            s.conversion >= 5
                              ? "bg-emerald-500/15 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }
                        >
                          {s.conversion}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-slate-900">
                        {bdt(s.gmv)}
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
                    No stores matched your search.
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
