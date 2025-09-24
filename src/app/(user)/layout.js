"use client";
import { Auth } from "@/components/ui/auth";
import { getUser } from "@/lib/auth";
import { pusherClient } from "@/lib/pusher-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { FiBell, FiLogOut, FiUser, FiX } from "react-icons/fi";
import {
  FiLayers,
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiCreditCard,
  FiUsers,
  FiDroplet,
  FiSettings,
} from "react-icons/fi";

const navItems = [
    {
    href: "/dashboard/",
    icon: <AiFillDashboard className="h-5 w-5" />,
    label: "Dashboard",
    tab: "dashboard",
  },
  {
    href: "/dashboard/category",
    icon: <FiLayers className="h-5 w-5" />,
    label: "Category",
    tab: "category",
  },
  {
    href: "/dashboard/products",
    icon: <FiBox className="h-5 w-5" />,
    label: "Products",
    tab: "products",
  },
  {
    href: "/dashboard/orders",
    icon: <FiShoppingCart className="h-5 w-5" />,
    label: "Orders",
    tab: "orders",
  },
  {
    href: "/dashboard/analytics",
    icon: <FiBarChart2 className="h-5 w-5" />,
    label: "Analytics",
    tab: "analytics",
  },
  {
    href: "/dashboard/billings",
    icon: <FiCreditCard className="h-5 w-5" />,
    label: "Billings",
    tab: "billings",
  },
  {
    href: "/dashboard/team",
    icon: <FiUsers className="h-5 w-5" />,
    label: "Team",
    tab: "team",
  },
  {
    href: "/dashboard/theme",
    icon: <FiDroplet className="h-5 w-5" />,
    label: "Theme",
    tab: "theme",
  },
  {
    href: "/dashboard/settings",
    icon: <FiSettings className="h-5 w-5" />,
    label: "Settings",
    tab: "settings",
  },
];

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Your deposit was successful",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      text: "New market update available",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      text: "System maintenance scheduled",
      time: "3 days ago",
      read: true,
    },
  ]);

  const notificationRef = useRef(null);
  const pathname = usePathname();

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        // Check if the click is not on the bell icon
        if (!event.target.closest(".notification-bell")) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getActiveTab = () => {
    if (pathname.includes("news")) return "news";
    if (pathname.includes("market")) return "market";
    if (pathname.includes("my-orders")) return "my-orders";
    if (pathname.includes("deposits")) return "deposits";
    if (pathname.includes("settings")) return "settings";
    if (pathname.includes("support")) return "support";
    return "market";
  };

  const activeTab = getActiveTab();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // Mark notifications as read when opened
    if (!showNotifications) {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  // useEffect(() => {
  //   const channel = pusherClient.subscribe("cards-channel");

  //   channel.bind("card-created", (data) => {
  //     console.log("New card added:", data.card);
  //     // Optionally update UI
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     pusherClient.unsubscribe("cards-channel");
  //   };
  // }, []);
  return (
    <Auth>
      <div className="flex h-screen bg-gray-100 relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0 relative">
          <div className="flex flex-col w-64 bg-indigo-700 text-white">
            {/* Sidebar Header */}
            <div className="flex flex-col px-4 py-4 bg-indigo-800">
              <div className="flex items-center justify-between mb-4">
                <Link href="/dashboard" className="text-xl font-bold">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xl">আ</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white-600">
                      AMARDokan
                    </h1>
                  </div>
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="notification-bell p-1 rounded-full hover:bg-indigo-700 relative"
                  >
                    <FiBell className="h-5 w-5" />
                    {notifications.some((n) => !n.read) && (
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-700">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <FiUser className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium truncate">{user?.fullName}</p>
                    {/* Verification badge */}
                    <svg
                      className="w-3 h-3 text-indigo-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-label="Verified"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-indigo-300/90 truncate flex items-center gap-1">
                    <span className="bg-indigo-500/20 px-1.5 py-0.5 rounded-md text-indigo-200 text-[0.7rem] font-medium">
                      Premium
                    </span>
                    <span>Member</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === item.tab
                        ? "bg-indigo-800 text-white"
                        : "text-indigo-100 hover:bg-indigo-600"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Support & Logout */}
              <div className="mt-auto space-y-2">
                <Link
                  href="/logout"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-600 w-full"
                >
                  <FiLogOut className="h-5 w-5 mr-3" />
                  Logout
                </Link>
              </div>
            </div>
          </div>

          {/* Notification Panel - Positioned outside the sidebar */}
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 top-16 w-80 bg-white rounded-md shadow-xl z-50 border border-gray-200 transform translate-x-full"
            >
              <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-indigo-600 text-white rounded-t-md">
                <h3 className="font-medium">Notifications</h3>
                <button
                  onClick={toggleNotifications}
                  className="p-1 hover:bg-indigo-500 rounded"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-indigo-50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800">
                        {notification.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No new notifications
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-gray-200 text-center bg-gray-50 rounded-b-md">
                <Link
                  href="/notifications"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex justify-around">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center p-2 text-xs"
                >
                  <span
                    className={`mb-1 ${
                      activeTab === item.tab
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`${
                      activeTab === item.tab
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              <Link
                href="/logout"
                className="flex flex-col items-center p-2 text-xs"
              >
                <FiLogOut className="h-5 w-5 mb-1 text-red-500" />
                <span className="text-red-500">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Auth>
  );
};

export default DashboardLayout;
