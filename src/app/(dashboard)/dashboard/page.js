"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiTruck,
  FiTarget,
  FiBarChart2,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiSmartphone,
  FiGlobe,
  FiPhone,
  FiShare2,
} from "react-icons/fi";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});

  // Mock data (replace with API data in real app)
  useEffect(() => {
    const mockData = {
      salesPerformance: {
        current: 125000,
        target: 150000,
        growth: 12.5,
      },
      orderSource: {
        landingPage: 25,
        website: 30,
        phoneCall: 20,
        socialMedia: 25,
      },
      visitors: {
        total: 1245,
        unique: 890,
        landingPage: 567,
      },
      orders: {
        total: 156,
        confirmed: 120,
        pending: 25,
        cancelled: 11,
      },
      financials: {
        salesAmount: 125600,
        discountAmount: 15600,
        courierBalance: 45000,
      },
      delivery: {
        delivered: 112,
        returned: 8,
        ratio: 6.67,
      },
      advanceCollection: 45600,
      salesTarget: 150000,
      recentOrders: [
        {
          id: 1,
          customer: "Rahim Karim",
          amount: 2500,
          status: "confirmed",
          date: "2025-01-15",
        },
        {
          id: 2,
          customer: "Sima Akter",
          amount: 1800,
          status: "pending",
          date: "2025-01-15",
        },
        {
          id: 3,
          customer: "Javed Islam",
          amount: 3200,
          status: "delivered",
          date: "2025-01-14",
        },
        {
          id: 4,
          customer: "Farhana Ahmed",
          amount: 1500,
          status: "confirmed",
          date: "2025-01-14",
        },
      ],
      topProducts: [
        { name: "Smartphone Cover", sales: 45, revenue: 22500 },
        { name: "Bluetooth Headphone", sales: 32, revenue: 19200 },
        { name: "Power Bank", sales: 28, revenue: 19600 },
        { name: "Smartwatch", sales: 25, revenue: 37500 },
      ],
    };

    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Small stat card
  const StatCard = ({ title, value, icon: Icon, color, change, prefix = "" }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
    </div>
  );

  // Progress bar
  const ProgressCard = ({ title, current, target, color }) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-2xl font-bold text-indigo-600">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Current: ৳{current.toLocaleString()}</span>
          <span>Target: ৳{target.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  // Order source bar
  const OrderSourceCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Order Source</h3>
      <div className="space-y-4">
        {[
          { source: "Landing Page", value: dashboardData.orderSource.landingPage, icon: FiGlobe, color: "bg-blue-500" },
          { source: "Website", value: dashboardData.orderSource.website, icon: FiGlobe, color: "bg-green-500" },
          { source: "Phone Call", value: dashboardData.orderSource.phoneCall, icon: FiPhone, color: "bg-purple-500" },
          { source: "Social Media", value: dashboardData.orderSource.socialMedia, icon: FiShare2, color: "bg-pink-500" },
        ].map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <item.icon className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm">{item.source}</span>
              </div>
              <span className="font-semibold">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${item.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-between">
          <span>Dashboard Overview</span>
          <Link
            href="/"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              ></path>
            </svg>
            Visit Website
          </Link>
        </h1>
        <p className="text-gray-600">See your latest business stats and performance</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="xl:col-span-2 space-y-6">
          <ProgressCard
            title="Sales Performance"
            current={dashboardData.salesPerformance.current}
            target={dashboardData.salesPerformance.target}
            color="bg-gradient-to-r from-green-500 to-teal-500"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderSourceCard />
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Visitors Today</h3>
              <div className="space-y-4">
                <StatCard title="Total Visitors" value={dashboardData.visitors.total} icon={FiEye} color="text-purple-600" change={8.2} />
                <StatCard title="Unique Visitors" value={dashboardData.visitors.unique} icon={FiUsers} color="text-blue-600" change={5.7} />
                <StatCard title="Landing Page Visitors" value={dashboardData.visitors.landingPage} icon={FiTrendingUp} color="text-green-600" change={12.3} />
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Orders" value={dashboardData.orders.total} icon={FiShoppingCart} color="text-blue-600" change={8.3} />
            <StatCard title="Confirmed" value={dashboardData.orders.confirmed} icon={FiCheckCircle} color="text-green-600" change={12.1} />
            <StatCard title="Pending" value={dashboardData.orders.pending} icon={FiClock} color="text-yellow-600" change={-2.4} />
            <StatCard title="Cancelled" value={dashboardData.orders.cancelled} icon={FiXCircle} color="text-red-600" change={-5.2} />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">৳{order.amount.toLocaleString()}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <StatCard title="Sales Amount" value={dashboardData.financials.salesAmount} icon={FiDollarSign} color="text-green-600" prefix="৳" change={15.2} />
              <StatCard title="Discount Amount" value={dashboardData.financials.discountAmount} icon={FiDollarSign} color="text-orange-600" prefix="৳" change={-3.4} />
              <StatCard title="Courier Balance" value={dashboardData.financials.courierBalance} icon={FiTruck} color="text-blue-600" prefix="৳" change={7.8} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Report</h3>
            <div className="text-center space-y-4">
              <div>
                <div className="text-3xl font-bold text-green-600">{dashboardData.delivery.delivered}</div>
                <p className="text-gray-600">Delivered</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{dashboardData.delivery.returned}</div>
                <p className="text-gray-600">Returned</p>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">{dashboardData.delivery.ratio}%</div>
                <p className="text-gray-600">Return Ratio</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <StatCard title="Advance Collection" value={dashboardData.advanceCollection} icon={FiDollarSign} color="text-purple-600" prefix="৳" change={9.3} />
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Sales Target</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-600">৳{dashboardData.salesTarget.toLocaleString()}</span>
                <FiTarget className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Target Achieved:{" "}
                {(
                  (dashboardData.salesPerformance.current / dashboardData.salesTarget) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.topProducts.map((product, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                    <p className="font-semibold text-green-600">৳{product.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: `${(product.sales / 50) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
