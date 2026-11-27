"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, FolderKanban, MapPin, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const bdt = (n) => `৳${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;

export default function AdminAnalyticsClient({ data = {} }) {
  const {
    timeline = [],
    byLocation = [],
    byOrderType = [],
    totalCategories = 0,
    totalCustomers = 0,
  } = data;

  const total14DayGmv = timeline.reduce((s, d) => s + (d.gmv || 0), 0);
  const total14DayOrders = timeline.reduce((s, d) => s + (d.orders || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80 bg-white py-4">
          <CardContent className="px-5">
            <p className="text-xs font-bold uppercase text-slate-400">
              14-Day GMV
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {bdt(total14DayGmv)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white py-4">
          <CardContent className="px-5">
            <p className="text-xs font-bold uppercase text-slate-400">
              14-Day Orders
            </p>
            <p className="text-2xl font-extrabold text-violet-600 mt-1">
              {total14DayOrders.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white py-4">
          <CardContent className="px-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                Unique Buyers
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {totalCustomers.toLocaleString()}
              </p>
            </div>
            <Users className="w-6 h-6 text-emerald-500" />
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white py-4">
          <CardContent className="px-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                Store Categories
              </p>
              <p className="text-2xl font-extrabold text-cyan-600 mt-1">
                {totalCategories.toLocaleString()}
              </p>
            </div>
            <FolderKanban className="w-6 h-6 text-cyan-500" />
          </CardContent>
        </Card>
      </div>

      {/* 14-Day Revenue Bar Chart */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-extrabold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            14-Day Platform Checkout Volume
          </CardTitle>
          <CardDescription className="text-xs">
            Daily GMV and shipping fees generated across AMARDokan merchants
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="gmv" name="GMV (৳)" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              <Bar
                dataKey="shipping"
                name="Shipping (৳)"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional & Channel Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200/80 bg-white shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Delivery Zone Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byLocation.length > 0 ? (
              byLocation.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {loc._id || "Standard"}
                    </p>
                    <p className="text-xs text-slate-400">{loc.count} orders</p>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600">
                    {bdt(loc.gmv)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No delivery zone data yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-extrabold">
              Order Acquisition Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byOrderType.length > 0 ? (
              byOrderType.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <span className="text-sm font-bold text-slate-900 capitalize">
                    {ch._id || "website"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-extrabold">
                    {ch.count} orders
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No channel metrics yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
