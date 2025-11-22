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

// Recharts components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});

  // Mock data with chart data
  useEffect(() => {
    const mockData = {
      salesPerformance: {
        current: 125000,
        target: 150000,
        growth: 12.5,
        chartData: [
          { day: "Mon", sales: 18000, target: 20000 },
          { day: "Tue", sales: 22000, target: 20000 },
          { day: "Wed", sales: 19000, target: 20000 },
          { day: "Thu", sales: 25000, target: 20000 },
          { day: "Fri", sales: 21000, target: 20000 },
          { day: "Sat", sales: 28000, target: 30000 },
          { day: "Sun", sales: 12000, target: 20000 },
        ],
      },
      orderSource: {
        landingPage: 25,
        website: 30,
        phoneCall: 20,
        socialMedia: 25,
        chartData: [
          { name: "Landing Page", value: 25, color: "#3b82f6" },
          { name: "Website", value: 30, color: "#10b981" },
          { name: "Phone Call", value: 20, color: "#8b5cf6" },
          { name: "Social Media", value: 25, color: "#ec4899" },
        ],
      },
      visitors: {
        total: 1245,
        unique: 890,
        landingPage: 567,
        chartData: [
          { hour: "9AM", visitors: 45, unique: 32 },
          { hour: "10AM", visitors: 78, unique: 56 },
          { hour: "11AM", visitors: 112, unique: 89 },
          { hour: "12PM", visitors: 156, unique: 120 },
          { hour: "1PM", visitors: 134, unique: 98 },
          { hour: "2PM", visitors: 167, unique: 134 },
          { hour: "3PM", visitors: 189, unique: 156 },
          { hour: "4PM", visitors: 145, unique: 112 },
          { hour: "5PM", visitors: 98, unique: 78 },
          { hour: "6PM", visitors: 67, unique: 45 },
        ],
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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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

  // Sales Performance Chart
  const SalesPerformanceChart = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Sales Performance</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span>Actual Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>Target</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dashboardData.salesPerformance.chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="target"
              stackId="1"
              stroke="#9ca3af"
              fill="#9ca3af"
              fillOpacity={0.1}
              name="Target"
            />
            <Area
              type="monotone"
              dataKey="sales"
              stackId="2"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              name="Actual Sales"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Current: ৳{dashboardData.salesPerformance.current.toLocaleString()}</span>
        <span>Target: ৳{dashboardData.salesPerformance.target.toLocaleString()}</span>
        <span className="text-green-600 font-semibold">
          +{dashboardData.salesPerformance.growth}% Growth
        </span>
      </div>
    </div>
  );

  // Visitors Today Chart
  const VisitorsChart = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-6">Visitors Today</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dashboardData.visitors.chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="visitors" 
              name="Total Visitors" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="unique" 
              name="Unique Visitors" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <div className="text-lg font-bold text-purple-600">
            {dashboardData.visitors.total}
          </div>
          <div className="text-xs text-gray-600">Total Visitors</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">
            {dashboardData.visitors.unique}
          </div>
          <div className="text-xs text-gray-600">Unique Visitors</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600">
            {dashboardData.visitors.landingPage}
          </div>
          <div className="text-xs text-gray-600">Landing Page</div>
        </div>
      </div>
    </div>
  );

  // Order Source Chart
  const OrderSourceChart = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-6">Order Source Distribution</h3>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="h-64 w-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboardData.orderSource.chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dashboardData.orderSource.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-4">
          {dashboardData.orderSource.chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{item.value}%</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: item.color,
                      width: `${item.value}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          {/* Sales Performance Chart */}
          <SalesPerformanceChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Source Chart */}
            <OrderSourceChart />
            
            {/* Visitors Chart */}
            <VisitorsChart />
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