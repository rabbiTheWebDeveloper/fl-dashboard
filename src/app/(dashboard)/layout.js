"use client";
import { Auth } from "@/components/ui/auth";
import "./style.css";
import { getUser } from "@/lib/auth";
import { pusherClient } from "@/lib/pusher-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AiFillDashboard, AiFillShop } from "react-icons/ai";
import { FiBell, FiLogOut, FiUser, FiX, FiMenu, FiHome } from "react-icons/fi";
import {
  FiLayers,
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiCreditCard,
  FiUsers,
  FiDroplet,
  FiSettings,
  FiGrid,
  FiChevronDown,
  FiChevronRight,
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
    icon: <AiFillShop className="h-5 w-5" />,
    label: "My Shop",
    tab: "myshop",
    children: [
      {
        href: "/dashboard/myshop/manage",
        label: "Manage Shop",
        tab: "manage",
        icon: <FiSettings className="h-4 w-4" />,
      },
      {
        href: "/dashboard/myshop/theme",
        label: "Customize Theme",
        tab: "customize-theme",
        icon: <FiDroplet className="h-4 w-4" />,
      },
      {
        href: "/dashboard/myshop/landing-pages",
        label: "Landing Pages",
        tab: "landing-pages",
        icon: <FiGrid className="h-4 w-4" />,
      },
      {
        href: "/dashboard/myshop/promo-codes",
        label: "Promo Codes",
        tab: "promo-codes",
        icon: <FiCreditCard className="h-4 w-4" />,
      },
    ],
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedDesktopMenu, setExpandedDesktopMenu] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "আপনার নতুন অর্ডার এসেছে",
      time: "২ ঘন্টা আগে",
      read: false,
    },
    {
      id: 2,
      text: "পেমেন্ট সফলভাবে সম্পন্ন হয়েছে",
      time: "১ দিন আগে",
      read: true,
    },
    {
      id: 3,
      text: "পণ্য স্টক কমে গেছে",
      time: "৩ দিন আগে",
      read: true,
    },
  ]);

  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const pathname = usePathname();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close notifications
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        if (!event.target.closest(".notification-bell")) {
          setShowNotifications(false);
        }
      }

      // Close mobile menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        if (!event.target.closest(".mobile-menu-button")) {
          setMobileMenuOpen(false);
        }
      }

      // Close desktop submenus when clicking outside
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target)
      ) {
        setExpandedDesktopMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get active tab and sub-tab
  const getActiveTab = () => {
    const path = pathname.toLowerCase();

    // Check main tabs
    if (path.includes("category")) return "category";
    if (path.includes("products")) return "products";
    if (path.includes("orders")) return "orders";
    if (path.includes("order-now")) return "orders";
    if (path.includes("analytics")) return "analytics";
    if (path.includes("billings")) return "billings";
    if (path.includes("team")) return "team";
    if (path.includes("theme") && !path.includes("myshop")) return "theme";
    if (path.includes("settings")) return "settings";

    // Check myshop sub-tabs
    if (path.includes("myshop/manage")) return "manage";
    if (path.includes("myshop/theme")) return "customize-theme";
    if (path.includes("myshop/landing-pages")) return "landing-pages";
    if (path.includes("myshop/promo-codes")) return "promo-codes";

    return "dashboard";
  };

  const activeTab = getActiveTab();

  // Check if a menu item is active
  const isMenuItemActive = (item) => {
    if (item.href) {
      return activeTab === item.tab;
    }

    if (item.children) {
      return item.children.some((child) => activeTab === child.tab);
    }

    return false;
  };

  // Check if a submenu item is active
  const isSubMenuItemActive = (subItem) => {
    return activeTab === subItem.tab;
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileSubMenu = (tab) => {
    setExpandedMenu(expandedMenu === tab ? null : tab);
  };

  const toggleDesktopSubMenu = (tab) => {
    setExpandedDesktopMenu(expandedDesktopMenu === tab ? null : tab);
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

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <Auth>
      <div className="flex h-screen bg-gray-50 relative">
        {/* Desktop Sidebar */}
        <div
          className="hidden lg:flex lg:flex-shrink-0 relative"
          ref={desktopMenuRef}
        >
          <div className="flex flex-col w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white">
            {/* Sidebar Header */}
            <div className="flex flex-col px-4 py-4 bg-indigo-800">
              <div className="flex items-center justify-between mb-4">
                <Link href="/dashboard" className="text-xl font-bold">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-bold text-xl">
                        আ
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">AMARDokan</h1>
                  </div>
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="notification-bell p-2 rounded-full hover:bg-indigo-700 relative transition-colors"
                  >
                    <FiBell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-indigo-800"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-700/50 backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.shopLogo ? (
                    <img
                      src={user.shopLogo}
                      alt="Shop Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate bangla-text">
                      {user?.shops?.shopName || "দোকানের নাম"}
                    </p>
                    <svg
                      className="w-4 h-4 text-yellow-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-indigo-200 truncate mt-1 bangla-text">
                    Shop ID: {user?.shops?.shopId || "N/A"}
                  </p>
                  <span className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white text-[0.7rem] px-2 py-1 rounded-full mt-1">
                    Premium Merchant
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                  <div key={item.tab} className="relative">
                    {item.children ? (
                      // Menu item with children (submenu)
                      <div>
                        <button
                          onClick={() => toggleDesktopSubMenu(item.tab)}
                          className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                            isMenuItemActive(item)
                              ? "bg-white text-indigo-600 shadow-lg"
                              : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-3">{item.icon}</span>
                            <span className="bangla-text">{item.label}</span>
                          </div>
                          <FiChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedDesktopMenu === item.tab
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {/* Submenu Items */}
                        {expandedDesktopMenu === item.tab && (
                          <div className="ml-4 mt-1 space-y-1 bg-indigo-600/30 rounded-lg p-2">
                            {item.children.map((subItem) => (
                              <Link
                                key={subItem.tab}
                                href={subItem.href}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all ${
                                  isSubMenuItemActive(subItem)
                                    ? "bg-white text-indigo-600 shadow"
                                    : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
                                }`}
                              >
                                <span className="mr-2">{subItem.icon}</span>
                                <span className="bangla-text">
                                  {subItem.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular menu item
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                          isMenuItemActive(item)
                            ? "bg-white text-indigo-600 shadow-lg"
                            : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="bangla-text">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Support & Logout */}
              <div className="mt-auto space-y-2 pt-4 border-t border-indigo-600">
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <FiHome className="h-5 w-5 mr-3" />
                  <span className="bangla-text">ওয়েবসাইট দেখুন</span>
                </Link>
                <Link
                  href="/logout"
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-100 hover:bg-red-600 transition-all"
                >
                  <FiLogOut className="h-5 w-5 mr-3" />
                  <span className="bangla-text">লগআউট</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Notification Panel */}
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 top-16 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 transform translate-x-full"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <h3 className="font-medium bangla-text">নোটিফিকেশন</h3>
                <button
                  onClick={toggleNotifications}
                  className="p-1 hover:bg-indigo-500 rounded transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800 bangla-text">
                        {notification.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 bangla-text">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 bangla-text">
                    কোনো নোটিফিকেশন নেই
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
                <Link
                  href="/dashboard/notifications"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium bangla-text"
                >
                  সব নোটিফিকেশন দেখুন
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-button p-2 rounded-lg bg-indigo-600 text-white mr-3"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <Link href="/dashboard" className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">আ</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">AMARDokan</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleNotifications}
                className="notification-bell p-2 rounded-full bg-gray-100 relative"
              >
                <FiBell className="h-5 w-5 text-gray-600" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <FiUser className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          >
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white overflow-y-auto">
              <div className="p-4 border-b border-indigo-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-bold text-xl">
                        আ
                      </span>
                    </div>
                    <h1 className="text-xl font-bold text-white">AMARDokan</h1>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-full hover:bg-indigo-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile User Info */}
                <div className="bg-indigo-700/50 rounded-lg p-3">
                  <p className="text-sm font-medium bangla-text truncate">
                    {user?.shops?.shopName || "দোকানের নাম"}
                  </p>
                  <p className="text-xs text-indigo-200 bangla-text">
                    Shop ID: {user?.shops?.shopId || "N/A"}
                  </p>
                </div>
              </div>

              <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                  <div key={item.tab}>
                    {item.children ? (
                      // Mobile menu item with children
                      <div>
                        <button
                          onClick={() => toggleMobileSubMenu(item.tab)}
                          className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                            isMenuItemActive(item)
                              ? "bg-white text-indigo-600 shadow-lg"
                              : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-3">{item.icon}</span>
                            <span className="bangla-text">{item.label}</span>
                          </div>
                          <FiChevronRight
                            className={`h-4 w-4 transition-transform ${
                              expandedMenu === item.tab ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {/* Mobile Submenu Items */}
                        {expandedMenu === item.tab && (
                          <div className="ml-6 mt-1 space-y-1 border-l-2 border-indigo-500 pl-3">
                            {item.children.map((subItem) => (
                              <Link
                                key={subItem.tab}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all ${
                                  isSubMenuItemActive(subItem)
                                    ? "bg-white text-indigo-600 shadow"
                                    : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
                                }`}
                              >
                                <span className="mr-2">{subItem.icon}</span>
                                <span className="bangla-text">
                                  {subItem.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular mobile menu item
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                          isMenuItemActive(item)
                            ? "bg-white text-indigo-600 shadow-lg"
                            : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="bangla-text">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile Support & Logout */}
                <div className="mt-8 space-y-2 pt-4 border-t border-indigo-600">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <FiHome className="h-5 w-5 mr-3" />
                    <span className="bangla-text">ওয়েবসাইট দেখুন</span>
                  </Link>
                  <Link
                    href="/logout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-100 hover:bg-red-600 transition-all"
                  >
                    <FiLogOut className="h-5 w-5 mr-3" />
                    <span className="bangla-text">লগআউট</span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col lg:ml-0">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 mt-16 lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </Auth>
  );
};

export default DashboardLayout;
