"use client";

import { FiActivity, FiCreditCard, FiShield, FiDollarSign, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', earnings: 4000 },
  { name: 'Feb', earnings: 3000 },
  { name: 'Mar', earnings: 5000 },
  { name: 'Apr', earnings: 2780 },
  { name: 'May', earnings: 1890 },
  { name: 'Jun', earnings: 2390 },
  { name: 'Jul', earnings: 3490 },
];

export default function DashboardPage() {
  const stats = [
    { 
      title: "Total Earnings", 
      value: "$12,345", 
      change: "+12% from last month",
      icon: <FiDollarSign className="h-6 w-6 text-green-600" />,
      color: "bg-green-100"
    },
    { 
      title: "Active Courses", 
      value: "3", 
      change: "+1 from last month",
      icon: <FiActivity className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-100"
    },
    { 
      title: "Transactions", 
      value: "24", 
      change: "+5 from last month",
      icon: <FiCreditCard className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-100"
    },
    { 
      title: "Security Score", 
      value: "98%", 
      change: "Excellent",
      icon: <FiShield className="h-6 w-6 text-yellow-600" />,
      color: "bg-yellow-100"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Completed Carding Basics",
      description: "Finished module 3 of Carding Fundamentals",
      time: "2 hours ago",
      icon: <FiActivity className="h-5 w-5 text-green-500" />
    },
    {
      id: 2,
      title: "New Payment Received",
      description: "Successfully processed payment for Advanced Methods",
      time: "1 day ago",
      icon: <FiDollarSign className="h-5 w-5 text-blue-500" />
    },
    {
      id: 3,
      title: "Security Update",
      description: "Enabled two-factor authentication",
      time: "3 days ago",
      icon: <FiShield className="h-5 w-5 text-purple-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Earnings Overview</h2>
            <div className="flex items-center space-x-2">
              <FiCalendar className="text-gray-400" />
              <span className="text-sm text-gray-500">Last 7 Months</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Course Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>NONVBV Methods</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carding Fundamentals</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Bank Methods</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <button className="flex items-center text-indigo-600 hover:text-indigo-800">
              <FiTrendingUp className="mr-2" />
              View All Progress
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="p-2 rounded-full bg-gray-100 mr-4">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}