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

  // Mock data - in real app, this would come from API
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
          customer: "রহিম করিম",
          amount: 2500,
          status: "confirmed",
          date: "২০২৫-০১-১৫",
        },
        {
          id: 2,
          customer: "সিমা আক্তার",
          amount: 1800,
          status: "pending",
          date: "২০২৫-০১-১৫",
        },
        {
          id: 3,
          customer: "জaved ইসলাম",
          amount: 3200,
          status: "delivered",
          date: "২০২৫-০১-১৪",
        },
        {
          id: 4,
          customer: "ফারহানা আহমেদ",
          amount: 1500,
          status: "confirmed",
          date: "২০২৫-০১-১৪",
        },
      ],
      topProducts: [
        { name: "স্মার্টফোন কভার", sales: 45, revenue: 22500 },
        { name: "ব্লুটুথ হেডফোন", sales: 32, revenue: 19200 },
        { name: "পাওয়ার ব্যাংক", sales: 28, revenue: 19600 },
        { name: "স্মার্টওয়াচ", sales: 25, revenue: 37500 },
      ],
    };

    // Simulate API loading
    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Loading component
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 bangla-text">
            ড্যাশবোর্ড লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
    prefix = "",
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 bangla-text text-sm mb-1">{title}</p>
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
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
    </div>
  );

  // Progress Card Component
  const ProgressCard = ({ title, current, target, color }) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 bangla-text">{title}</h3>
          <span className="text-2xl font-bold text-indigo-600">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span className="bangla-text">
            বর্তমান: ৳{current.toLocaleString()}
          </span>
          <span className="bangla-text">
            লক্ষ্য: ৳{target.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  // Order Source Component
  const OrderSourceCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4 bangla-text">
        অর্ডার সোর্স
      </h3>
      <div className="space-y-4">
        {[
          {
            source: "ল্যান্ডিং পেজ",
            value: dashboardData.orderSource.landingPage,
            icon: FiGlobe,
            color: "bg-blue-500",
          },
          {
            source: "ওয়েবসাইট",
            value: dashboardData.orderSource.website,
            icon: FiGlobe,
            color: "bg-green-500",
          },
          {
            source: "ফোন কল",
            value: dashboardData.orderSource.phoneCall,
            icon: FiPhone,
            color: "bg-purple-500",
          },
          {
            source: "সোশ্যাল মিডিয়া",
            value: dashboardData.orderSource.socialMedia,
            icon: FiShare2,
            color: "bg-pink-500",
          },
        ].map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <item.icon className="w-4 h-4 text-gray-500 mr-2" />
                <span className="bangla-text text-sm">{item.source}</span>
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
        <h1 className="text-2xl font-bold text-gray-900 bangla-text flex items-center justify-between">
          <span>ড্যাশবোর্ড ওভারভিউ</span>
          <Link
            href={"/"}
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2"
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
            ওয়েবসাইট দেখুন
          </Link>
        </h1>
        <p className="text-gray-600 bangla-text">
          আপনার ব্যবসার সাম্প্রতিক পরিসংখ্যান এবং কর্মক্ষমতা
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Sales Performance */}
          <ProgressCard
            title="বিক্রয় কর্মক্ষমতা"
            current={dashboardData.salesPerformance.current}
            target={dashboardData.salesPerformance.target}
            color="bg-gradient-to-r from-green-500 to-teal-500"
          />

          {/* Order Source and Visitors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderSourceCard />

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 bangla-text">
                ভিজিটরস Today
              </h3>
              <div className="space-y-4">
                <StatCard
                  title="মোট ভিজিটর"
                  value={dashboardData.visitors.total}
                  icon={FiEye}
                  color="text-purple-600"
                  change={8.2}
                />
                <StatCard
                  title="ইউনিক ভিজিটর"
                  value={dashboardData.visitors.unique}
                  icon={FiUsers}
                  color="text-blue-600"
                  change={5.7}
                />
                <StatCard
                  title="ল্যান্ডিং পেজ ভিজিটর"
                  value={dashboardData.visitors.landingPage}
                  icon={FiTrendingUp}
                  color="text-green-600"
                  change={12.3}
                />
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="মোট অর্ডার"
              value={dashboardData.orders.total}
              icon={FiShoppingCart}
              color="text-blue-600"
              change={8.3}
            />
            <StatCard
              title="নিশ্চিত অর্ডার"
              value={dashboardData.orders.confirmed}
              icon={FiCheckCircle}
              color="text-green-600"
              change={12.1}
            />
            <StatCard
              title="পেন্ডিং অর্ডার"
              value={dashboardData.orders.pending}
              icon={FiClock}
              color="text-yellow-600"
              change={-2.4}
            />
            <StatCard
              title="বাতিল অর্ডার"
              value={dashboardData.orders.cancelled}
              icon={FiXCircle}
              color="text-red-600"
              change={-5.2}
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 bangla-text">
                সাম্প্রতিক অর্ডার
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium bangla-text">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ৳{order.amount.toLocaleString()}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status === "confirmed"
                          ? "নিশ্চিত"
                          : order.status === "pending"
                          ? "পেন্ডিং"
                          : "ডেলিভার্ড"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 bangla-text">
              আর্থিক সারাংশ
            </h3>
            <div className="space-y-4">
              <StatCard
                title="বিক্রয় Amount"
                value={dashboardData.financials.salesAmount}
                icon={FiDollarSign}
                color="text-green-600"
                prefix="৳"
                change={15.2}
              />
              <StatCard
                title="ডিসকাউন্ট Amount"
                value={dashboardData.financials.discountAmount}
                icon={FiDollarSign}
                color="text-orange-600"
                prefix="৳"
                change={-3.4}
              />
              <StatCard
                title="কুরিয়ার ব্যালেন্স"
                value={dashboardData.financials.courierBalance}
                icon={FiTruck}
                color="text-blue-600"
                prefix="৳"
                change={7.8}
              />
            </div>
          </div>

          {/* Delivery Report */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 bangla-text">
              ডেলিভারি রিপোর্ট
            </h3>
            <div className="text-center space-y-4">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {dashboardData.delivery.delivered}
                </div>
                <p className="text-gray-600 bangla-text">ডেলিভারি</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {dashboardData.delivery.returned}
                </div>
                <p className="text-gray-600 bangla-text">রিটার্ন</p>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">
                  {dashboardData.delivery.ratio}%
                </div>
                <p className="text-gray-600 bangla-text">রিটার্ন রেশিও</p>
              </div>
            </div>
          </div>

          {/* Advance Collection & Sales Target */}
          <div className="space-y-4">
            <StatCard
              title="Advance Collection"
              value={dashboardData.advanceCollection}
              icon={FiDollarSign}
              color="text-purple-600"
              prefix="৳"
              change={9.3}
            />
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2 bangla-text">
                বিক্রয় লক্ষ্য
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-600">
                  ৳{dashboardData.salesTarget.toLocaleString()}
                </span>
                <FiTarget className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-600 mt-2 bangla-text">
                মাসিক লক্ষ্য{" "}
                {(
                  (dashboardData.salesPerformance.current /
                    dashboardData.salesTarget) *
                  100
                ).toFixed(1)}
                % অর্জিত
              </p>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 bangla-text">
                টপ Selling পণ্য
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium bangla-text">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.sales} বিক্রয়
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">
                      ৳{product.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${(product.sales / 50) * 100}%` }}
                    ></div>
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
