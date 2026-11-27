"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Crown,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  LogOut,
  Menu,
  Palette,
  Plus,
  Settings,
  ShoppingCart,
  Sliders,
  Sparkles,
  Store,
  Tag,
  User,
  Users,
} from "lucide-react";
import { Auth } from "@/components/ui/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import "./style.css";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    tab: "dashboard",
    dot: "bg-violet-400",
  },
  {
    href: "/dashboard/orders",
    icon: ShoppingCart,
    label: "Orders",
    tab: "orders",
    dot: "bg-cyan-400",
  },
  {
    href: "/dashboard/products",
    icon: Boxes,
    label: "Products",
    tab: "products",
    dot: "bg-emerald-400",
  },
  {
    href: "/dashboard/category",
    icon: FolderKanban,
    label: "Categories",
    tab: "category",
    dot: "bg-amber-400",
  },
  {
    icon: Store,
    label: "My Shop",
    tab: "myshop",
    dot: "bg-pink-400",
    children: [
      {
        href: "/dashboard/myshop/manage",
        label: "Manage Shop",
        tab: "manage",
        icon: Sliders,
      },
      {
        href: "/dashboard/myshop/theme",
        label: "Customize Theme",
        tab: "customize-theme",
        icon: Palette,
      },
      {
        href: "/dashboard/myshop/landing-pages",
        label: "Landing Pages",
        tab: "landing-pages",
        icon: LayoutTemplate,
      },
      {
        href: "/dashboard/myshop/promo-codes",
        label: "Promo Codes",
        tab: "promo-codes",
        icon: Tag,
      },
    ],
  },
  {
    href: "/dashboard/analytics",
    icon: BarChart3,
    label: "Analytics",
    tab: "analytics",
    dot: "bg-sky-400",
  },
  {
    href: "/dashboard/billings",
    icon: CreditCard,
    label: "Billings",
    tab: "billings",
    dot: "bg-indigo-400",
  },
  {
    href: "/subscription",
    icon: Sparkles,
    label: "Subscription",
    tab: "subscription",
    dot: "bg-fuchsia-400",
  },
  {
    href: "/dashboard/team",
    icon: Users,
    label: "Team",
    tab: "team",
    dot: "bg-teal-400",
  },
  {
    href: "/dashboard/theme",
    icon: Palette,
    label: "Themes",
    tab: "theme",
    dot: "bg-rose-400",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
    tab: "settings",
    dot: "bg-slate-400",
  },
];

const QUICK_ACTIONS = [
  {
    href: "/dashboard/orders/create-order",
    label: "Create Order",
    sub: "Manual POS / phone order",
    icon: ShoppingCart,
    grad: "from-violet-600 to-indigo-600",
  },
  {
    href: "/dashboard/add-product",
    label: "Add Product",
    sub: "Upload item & variants",
    icon: Boxes,
    grad: "from-emerald-500 to-teal-600",
  },
  {
    href: "/dashboard/category/add",
    label: "New Category",
    sub: "Create product collection",
    icon: FolderKanban,
    grad: "from-cyan-500 to-blue-600",
  },
  {
    href: "/dashboard/myshop/promo-codes",
    label: "Promo Code",
    sub: "Launch discount campaign",
    icon: Tag,
    grad: "from-pink-500 to-rose-600",
  },
];

const INITIAL_NOTIFICATIONS = [
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
];

function resolveActiveTab(pathname = "") {
  const path = pathname.toLowerCase();
  if (path.includes("myshop/manage")) return "manage";
  if (path.includes("myshop/theme")) return "customize-theme";
  if (path.includes("myshop/landing-pages")) return "landing-pages";
  if (path.includes("myshop/promo-codes")) return "promo-codes";
  if (path.includes("category")) return "category";
  if (path.includes("products") || path.includes("add-product")) return "products";
  if (path.includes("orders") || path.includes("order-now")) return "orders";
  if (path.includes("analytics")) return "analytics";
  if (path.includes("billings")) return "billings";
  if (path.includes("subscription")) return "subscription";
  if (path.includes("team") || path.includes("manage-users")) return "team";
  if (path.includes("theme")) return "theme";
  if (path.includes("settings")) return "settings";
  return "dashboard";
}

const PAGE_TITLES = {
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
  category: "Categories",
  manage: "Manage Shop",
  "customize-theme": "Theme Studio",
  "landing-pages": "Landing Pages",
  "promo-codes": "Promo Codes",
  analytics: "Analytics",
  billings: "Billings",
  subscription: "Subscription",
  team: "Team",
  theme: "Themes",
  settings: "Settings",
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const contentScrollRef = useRef(null);

  const [isPending, startTransition] = useTransition();
  const [pendingPath, setPendingPath] = useState(null);

  // Use optimistic path immediately on click so sidebar pill & header respond in 0ms
  const effectivePath = pendingPath || pathname;
  const activeTab = resolveActiveTab(effectivePath);

  const [user, setUser] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(() =>
    pathname?.toLowerCase().includes("myshop") ? "myshop" : null
  );
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    setPendingPath(null);
    if (pathname?.toLowerCase().includes("myshop")) {
      setOpenGroup("myshop");
    }
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    let mounted = true;
    getUser()
      .then((userData) => {
        if (mounted) setUser(userData || {});
      })
      .catch((error) => console.error("Failed to fetch user:", error));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSmoothNav = useCallback(
    (e, href, afterClose) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      if (afterClose) afterClose();
      if (href === pathname) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      setPendingPath(href);
      startTransition(() => {
        router.push(href);
      });
    },
    [pathname, router]
  );

  const handlePrefetch = useCallback(
    (href) => {
      if (href && href !== pathname) {
        router.prefetch(href);
      }
    },
    [pathname, router]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const storeUrl = user?.domain ? `http://${user.domain}` : "/";
  const shopName = user?.shops?.shopName || "AMARDokan Store";
  const shopId = user?.shops?.shopId || "—";
  const isNavigating = isPending || Boolean(pendingPath && pendingPath !== pathname);

  const isMoreActive = !["dashboard", "orders", "products"].includes(activeTab);

  const renderSidebarContent = (onCloseDrawer) => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Ambient RGB Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-24 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl" />

      {/* Brand Header */}
      <div className="relative px-5 pt-5 pb-4 border-b border-white/10">
        <Link
          href="/dashboard"
          prefetch
          onMouseEnter={() => handlePrefetch("/dashboard")}
          onClick={(e) => handleSmoothNav(e, "/dashboard", onCloseDrawer)}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg bangla-text">আ</span>
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              AMARDokan
            </span>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Merchant Workspace
            </p>
          </div>
        </Link>

        {/* Merchant Shop Card */}
        <div className="mt-4 rounded-xl bg-white/[0.05] border border-white/10 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-xl border border-white/15">
              <AvatarImage src={user?.shopLogo || ""} alt={shopName} />
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 text-white font-bold text-sm">
                {(shopName?.[0] || "A").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-white truncate bangla-text">
                  {shopName}
                </p>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                ID: {shopId}
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-2 py-0.5">
              <Crown className="w-2.5 h-2.5 mr-1 text-amber-300" />
              Verified Merchant
            </Badge>
            <Link
              href={storeUrl}
              target="_blank"
              className="text-[11px] text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 font-medium"
            >
              Live <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isGroupActive = item.children?.some((c) => c.tab === activeTab);
          const isActive = item.href ? activeTab === item.tab : isGroupActive;

          if (item.children) {
            const expanded = openGroup === item.tab;
            return (
              <div key={item.tab} className="space-y-1">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroup((prev) => (prev === item.tab ? null : item.tab))
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-cyan-600/80 text-white shadow-md shadow-indigo-950/50"
                      : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-150",
                      expanded && "rotate-180"
                    )}
                  />
                </button>

                {expanded && (
                  <div className="ml-4 pl-3 border-l border-white/10 space-y-1 py-1">
                    {item.children.map((sub) => {
                      const SubIcon = sub.icon;
                      const subActive = activeTab === sub.tab;
                      return (
                        <Link
                          key={sub.tab}
                          href={sub.href}
                          prefetch
                          onMouseEnter={() => handlePrefetch(sub.href)}
                          onClick={(e) =>
                            handleSmoothNav(e, sub.href, onCloseDrawer)
                          }
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150",
                            subActive
                              ? "bg-white/15 text-cyan-300 font-semibold"
                              : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                          )}
                        >
                          <SubIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.tab}
              href={item.href}
              prefetch
              onMouseEnter={() => handlePrefetch(item.href)}
              onClick={(e) => handleSmoothNav(e, item.href, onCloseDrawer)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group",
                isActive
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-950/50"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </span>
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-opacity",
                  isActive
                    ? "bg-white opacity-100"
                    : `${item.dot} opacity-0 group-hover:opacity-80`
                )}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="relative p-3 border-t border-white/10 space-y-1.5 pb-safe">
        <Link
          href={storeUrl}
          target="_blank"
          onClick={onCloseDrawer}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-cyan-400" />
          <span className="bangla-text">ওয়েবসাইট দেখুন</span>
        </Link>
        <Link
          href="/logout"
          onClick={onCloseDrawer}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="bangla-text">লগআউট</span>
        </Link>
      </div>
    </div>
  );

  return (
    <Auth>
      <div className="dashboard-shell flex h-dvh-safe overflow-hidden rgb-canvas text-slate-900">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 border-r border-slate-200/80 shadow-xl">
          {renderSidebarContent(undefined)}
        </aside>

        {/* Mobile Full Navigation Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="p-0 w-[82vw] max-w-72 border-r-0 bg-slate-950 text-white"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Navigate across your store workspace
              </SheetDescription>
            </SheetHeader>
            {renderSidebarContent(() => setMobileOpen(false))}
          </SheetContent>
        </Sheet>

        {/* Mobile Bottom Quick-Action Sheet */}
        <Sheet open={quickOpen} onOpenChange={setQuickOpen}>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl border-t border-slate-200 bg-white px-5 pt-4 pb-8 pb-safe lg:hidden"
          >
            <div className="w-10 h-1.5 rounded-full bg-slate-200 mx-auto mb-4" />
            <SheetHeader className="text-left pb-3">
              <SheetTitle className="text-base font-extrabold text-slate-900">
                Quick Actions
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-500">
                Jump straight into common merchant tasks
              </SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {QUICK_ACTIONS.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    prefetch
                    onClick={(e) =>
                      handleSmoothNav(e, action.href, () => setQuickOpen(false))
                    }
                    className="app-press flex flex-col gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 hover:border-violet-300 hover:bg-white transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.grad} text-white flex items-center justify-center shadow-md`}
                    >
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {action.label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {action.sub}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* App-like Sticky Top Bar */}
          <header className="relative h-14 sm:h-16 shrink-0 bg-white/92 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-6 flex items-center justify-between gap-3 z-30 pt-safe">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden app-press flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-sm shrink-0"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg font-extrabold tracking-tight text-slate-900 truncate leading-tight">
                  {PAGE_TITLES[activeTab] || "Dashboard"}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate bangla-text leading-tight">
                  {shopName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Button
                asChild
                variant="gradient"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link
                  href="/dashboard/orders/create-order"
                  prefetch
                  onClick={(e) =>
                    handleSmoothNav(e, "/dashboard/orders/create-order")
                  }
                >
                  <Plus className="w-4 h-4" />
                  New Order
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
              >
                <Link href={storeUrl} target="_blank">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Storefront
                </Link>
              </Button>

              {/* Notifications Dropdown */}
              <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative h-9 w-9 rounded-xl bg-white"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4 text-slate-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[calc(100vw-1.5rem)] sm:w-80 rounded-2xl p-0 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-between">
                    <span className="text-sm font-semibold bangla-text">
                      নোটিফিকেশন
                    </span>
                    <Badge className="bg-white/20 text-white border-0 text-[10px]">
                      {notifications.length}
                    </Badge>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <p className="text-xs font-medium text-slate-800 bangla-text">
                          {n.text}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 bangla-text">
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="app-press flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 sm:px-2 sm:py-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <Avatar className="h-7 w-7 rounded-lg">
                      <AvatarImage
                        src={user?.shopLogo || ""}
                        alt={user?.fullName || "User"}
                      />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 text-white text-xs font-bold">
                        {(user?.fullName?.[0] || "M").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-xs font-semibold text-slate-700 max-w-[110px] truncate">
                      {user?.fullName || "Merchant"}
                    </span>
                    <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user?.fullName || "Merchant Account"}
                    </p>
                    <p className="text-xs font-normal text-slate-500 truncate">
                      {user?.email || ""}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/settings"
                      prefetch
                      onClick={(e) => handleSmoothNav(e, "/dashboard/settings")}
                      className="cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/myshop/manage"
                      prefetch
                      onClick={(e) =>
                        handleSmoothNav(e, "/dashboard/myshop/manage")
                      }
                      className="cursor-pointer"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Manage Shop
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/billings"
                      prefetch
                      onClick={(e) => handleSmoothNav(e, "/dashboard/billings")}
                      className="cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing & Invoices
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={storeUrl}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Storefront
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="text-rose-600 focus:text-rose-600"
                  >
                    <Link href="/logout" className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Instant RGB Top Route Progress Indicator */}
            {isNavigating && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2.5px] overflow-hidden bg-violet-100">
                <div className="nav-progress-bar h-full w-1/2 bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-400" />
              </div>
            )}
          </header>

          {/* Scrollable App Viewport with GPU-accelerated enter transition */}
          <div
            ref={contentScrollRef}
            className="flex-1 overflow-y-auto overscroll-y-contain px-3.5 pt-4 pb-24 sm:px-6 sm:pt-6 lg:pb-6"
          >
            <div
              key={pathname}
              className={cn(
                "dashboard-page-enter transition-opacity duration-150",
                isNavigating && "opacity-75 pointer-events-none"
              )}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Native Mobile Bottom App Navigation Dock */}
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] pb-safe"
        >
          <div className="grid grid-cols-5 items-center h-16 px-2 max-w-lg mx-auto">
            <Link
              href="/dashboard"
              prefetch
              onClick={(e) => handleSmoothNav(e, "/dashboard")}
              className={cn(
                "app-press flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors",
                activeTab === "dashboard"
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-none">
                Home
              </span>
            </Link>

            <Link
              href="/dashboard/orders"
              prefetch
              onClick={(e) => handleSmoothNav(e, "/dashboard/orders")}
              className={cn(
                "app-press flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors",
                activeTab === "orders"
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-none">
                Orders
              </span>
            </Link>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setQuickOpen(true)}
                aria-label="Quick actions"
                className="app-press -mt-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/35 ring-4 ring-white"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            <Link
              href="/dashboard/products"
              prefetch
              onClick={(e) => handleSmoothNav(e, "/dashboard/products")}
              className={cn(
                "app-press flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors",
                activeTab === "products"
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Boxes className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-none">
                Products
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "app-press flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors",
                isMoreActive
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-none">
                More
              </span>
            </button>
          </div>
        </nav>
      </div>
    </Auth>
  );
}
