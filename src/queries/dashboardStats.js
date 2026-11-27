import mongoose from "mongoose";
import { OrderModel } from "@/model/order-model";
import { ProductModel } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseBdDate(dateStr, endOfDay = false) {
  if (typeof dateStr !== "string" || !DATE_RE.test(dateStr)) return null;
  const d = new Date(`${dateStr}T${endOfDay ? "23:59:59" : "00:00:00"}+06:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toBdDateKey(date) {
  return new Date(date.getTime() + 6 * 60 * 60 * 1000).toISOString().split("T")[0];
}

function buildDateMatch(dateFrom, dateTo) {
  const from = parseBdDate(dateFrom, false);
  const to = parseBdDate(dateTo, true);
  if (!from && !to) return {};
  const cond = {};
  if (from) cond.$gte = from;
  if (to) cond.$lte = to;
  return { createdAt: cond };
}

export async function getDashboardData({ shopId, userId, dateFrom, dateTo }) {
  try {
    await dbConnect();
    if (!shopId || !userId) return getEmptyDashboard();

    let shopObjId, userObjId;
    try {
      shopObjId = new mongoose.Types.ObjectId(shopId);
      userObjId = new mongoose.Types.ObjectId(userId);
    } catch {
      return getEmptyDashboard();
    }

    const dateMatch = buildDateMatch(dateFrom, dateTo);

    // Consolidated into 3 parallel queries (down from 11) so maxPoolSize=5 never queues
    const [orderBundle, dailySales, productBundle] = await Promise.all([
      getConsolidatedOrderMetrics(shopObjId, userObjId, dateMatch),
      getDailySales(shopObjId, userObjId, dateFrom, dateTo),
      getConsolidatedProductMetrics(shopObjId, userObjId),
    ]);

    return JSON.parse(
      JSON.stringify({
        ...orderBundle,
        dailySales,
        ...productBundle,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
      })
    );
  } catch (error) {
    console.error("getDashboardData error:", error);
    return getEmptyDashboard();
  }
}

/* ─── Single-Pass $facet for All 8 Order Aggregations ────────────────────── */
async function getConsolidatedOrderMetrics(shopId, userId, dateMatch) {
  const [res] = await OrderModel.aggregate([
    { $match: { shopId, userId, ...dateMatch } },
    {
      $facet: {
        byStatusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        revenue: [
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$grand_total" },
              totalDiscount: { $sum: "$discount" },
              totalShipping: { $sum: "$shipping_cost" },
              totalAdvanced: { $sum: "$advanced" },
              totalDue: { $sum: "$due" },
              avgOrderValue: { $avg: "$grand_total" },
            },
          },
        ],
        recentOrders: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "customers",
              localField: "customer",
              foreignField: "_id",
              as: "customer",
            },
          },
          { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              status: 1,
              grand_total: 1,
              discount: 1,
              shipping_cost: 1,
              orderType: 1,
              deliveryLocation: 1,
              createdAt: 1,
              "customer.customerName": 1,
              "customer.customerPhone": 1,
              "customer.customerAddress": 1,
            },
          },
        ],
        topProducts: [
          { $unwind: "$productId" },
          {
            $group: {
              _id: "$productId",
              saleCount: { $sum: 1 },
              revenue: { $sum: "$grand_total" },
            },
          },
          { $sort: { saleCount: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "p",
            },
          },
          { $unwind: "$p" },
          {
            $project: {
              _id: 1,
              saleCount: 1,
              revenue: 1,
              productName: "$p.productName",
              mainImage: "$p.mainImage",
              regularPrice: "$p.regularPrice",
              availableQuantity: "$p.availableQuantity",
            },
          },
        ],
        byType: [{ $group: { _id: "$orderType", count: { $sum: 1 } } }],
        byLocation: [
          { $group: { _id: "$deliveryLocation", count: { $sum: 1 } } },
        ],
        customers: [{ $group: { _id: "$customer" } }, { $count: "total" }],
      },
    },
  ]);

  const statusMap = Object.fromEntries(
    (res?.byStatusCounts || []).map((x) => [x._id, x.count])
  );
  const rev = res?.revenue?.[0] || {};

  const orderStats = {
    total: rev.totalOrders ?? 0,
    confirmed: statusMap.confirmed ?? 0,
    pending: statusMap.pending ?? 0,
    shipped: statusMap.shipped ?? 0,
    delivered: statusMap.delivered ?? 0,
    cancelled: statusMap.cancelled ?? 0,
  };

  const revenueStats = {
    totalRevenue: rev.totalRevenue ?? 0,
    totalDiscount: rev.totalDiscount ?? 0,
    totalShipping: rev.totalShipping ?? 0,
    totalAdvanced: rev.totalAdvanced ?? 0,
    totalDue: rev.totalDue ?? 0,
    avgOrderValue: Math.round(rev.avgOrderValue ?? 0),
  };

  const typeLabels = {
    website: "Website",
    landing: "Landing Page",
    manual: "Manual",
  };
  const typeColors = {
    website: "#7c3aed",
    landing: "#10b981",
    manual: "#f59e0b",
  };
  const ordersByType = (res?.byType || []).map((x) => ({
    name: typeLabels[x._id] ?? x._id,
    value: x.count,
    color: typeColors[x._id] ?? "#94a3b8",
  }));

  const locLabels = {
    insideDhaka: "Inside Dhaka",
    outsideDhaka: "Outside Dhaka",
    cash: "Cash on Delivery",
  };
  const locColors = {
    insideDhaka: "#7c3aed",
    outsideDhaka: "#06b6d4",
    cash: "#f59e0b",
  };
  const ordersByLocation = (res?.byLocation || []).map((x) => ({
    name: locLabels[x._id] ?? x._id,
    value: x.count,
    color: locColors[x._id] ?? "#94a3b8",
  }));

  const statusOrder = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const statusColors = {
    pending: "#f59e0b",
    confirmed: "#10b981",
    shipped: "#7c3aed",
    delivered: "#06b6d4",
    cancelled: "#f43f5e",
  };
  const ordersByStatus = statusOrder.map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: statusMap[s] ?? 0,
    color: statusColors[s],
  }));

  return {
    orderStats,
    revenueStats,
    recentOrders: res?.recentOrders || [],
    topProducts: res?.topProducts || [],
    ordersByType,
    ordersByLocation,
    ordersByStatus,
    totalCustomers: res?.customers?.[0]?.total ?? 0,
  };
}

/* ─── Single-Pass $facet for Product Stats + Low Stock ───────────────────── */
async function getConsolidatedProductMetrics(shopId, userId) {
  const [res] = await ProductModel.aggregate([
    { $match: { shopId, userId } },
    {
      $facet: {
        stats: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: { $sum: { $cond: ["$isActive", 1, 0] } },
              featured: { $sum: { $cond: ["$isFeatured", 1, 0] } },
            },
          },
        ],
        lowStock: [
          { $match: { availableQuantity: { $gt: 0, $lte: 5 } } },
          { $sort: { availableQuantity: 1 } },
          { $limit: 5 },
          {
            $project: {
              productName: 1,
              mainImage: 1,
              availableQuantity: 1,
              regularPrice: 1,
            },
          },
        ],
      },
    },
  ]);

  const s = res?.stats?.[0];
  return {
    totalProducts: {
      total: s?.total ?? 0,
      active: s?.active ?? 0,
      featured: s?.featured ?? 0,
    },
    lowStockProducts: res?.lowStock || [],
  };
}

/* ─── Daily Sales Chart (dynamic window) ─────────────────────────────────── */
async function getDailySales(shopId, userId, dateFrom, dateTo) {
  const parsedEnd = parseBdDate(dateTo, true);
  const parsedStart = parseBdDate(dateFrom, false);

  const todayKey = toBdDateKey(new Date());
  const endDate = parsedEnd || parseBdDate(todayKey, true);
  let startDate =
    parsedStart ||
    (() => {
      const d = new Date(endDate);
      d.setUTCDate(d.getUTCDate() - 6);
      return parseBdDate(toBdDateKey(d), false);
    })();

  if (startDate > endDate) {
    startDate = parseBdDate(toBdDateKey(endDate), false);
  }

  const raw = await OrderModel.aggregate([
    { $match: { shopId, userId, createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "+06:00",
          },
        },
        orders: { $sum: 1 },
        revenue: { $sum: "$grand_total" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const map = Object.fromEntries(raw.map((r) => [r._id, r]));
  const days = [];
  const DAY_MS = 24 * 60 * 60 * 1000;
  let count = 0;
  for (
    let ts = startDate.getTime();
    ts <= endDate.getTime() && count < 366;
    ts += DAY_MS, count++
  ) {
    const key = toBdDateKey(new Date(ts));
    days.push({
      day: new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      date: key,
      orders: map[key]?.orders ?? 0,
      revenue: map[key]?.revenue ?? 0,
    });
  }
  return days;
}

function getEmptyDashboard() {
  return {
    orderStats: {
      total: 0,
      confirmed: 0,
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    revenueStats: {
      totalRevenue: 0,
      totalDiscount: 0,
      totalShipping: 0,
      totalAdvanced: 0,
      totalDue: 0,
      avgOrderValue: 0,
    },
    recentOrders: [],
    topProducts: [],
    dailySales: [],
    ordersByType: [],
    ordersByLocation: [],
    ordersByStatus: [],
    totalProducts: { total: 0, active: 0, featured: 0 },
    lowStockProducts: [],
    totalCustomers: 0,
    dateFrom: null,
    dateTo: null,
  };
}
