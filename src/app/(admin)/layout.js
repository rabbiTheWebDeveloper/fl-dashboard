"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Boxes,
  CreditCard,
  Crown,
  ExternalLink,
  Globe,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  UserCog,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  getRole,
  getUser,
  isAuthenticated,
  logout,
} from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    matchHrefs: ["/admin", "/admin/dashboard"],
    label: "Dashboard",
    shortLabel: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/role",
    label: "Role & Permissions",
    shortLabel: "Roles",
    icon: KeyRound,
    badge: "RBAC",
  },
  {
    href: "/admin/users",
    label: "Admin Staff",
    shortLabel: "Admins",
    icon: UserCog,
  },
  {
    href: "/admin/merchants",
    label: "Merchants",
    shortLabel: "Merchants",
    icon: Users,
  },
  {
    href: "/admin/shops",
    label: "All Stores",
    shortLabel: "Stores",
    icon: Store,
  },
  {
    href: "/admin/domain",
    label: "Custom Domains",
    shortLabel: "Domains",
    icon: Globe,
  },
  {
    href: "/admin/orders",
    label: "Global Orders",
    shortLabel: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/products",
    label: "Products Catalog",
    shortLabel: "Products",
    icon: Boxes,
  },
  {
    href: "/admin/payment-list",
    label: "Payment List",
    shortLabel: "Payments",
    icon: Wallet,
  },
  {
    href: "/admin/billing",
    label: "SaaS Billing",
    shortLabel: "Billing",
    icon: CreditCard,
  },
  {
    href: "/admin/visitor",
    label: "Visitor Traffic",
    shortLabel: "Visitors",
    icon: Activity,
  },
  {
    href: "/admin/analytics",
    label: "Platform Analytics",
    shortLabel: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/setting",
    label: "System Settings",
    shortLabel: "Setting",
    icon: Settings,
  },
];

const VALID_ROLES = new Set([
  "superadmin",
  "user-admin",
  "moderator",
  "support",
  "admin",
]);

export default function AdminPortalLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [authorized, setAuthorized] = useState(isLoginPage);
  const [adminUser, setAdminUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingPath, setPendingPath] = useState(null);

  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true);
      return;
    }

    const authed = isAuthenticated();
    const role = String(getRole() || "").toLowerCase();

    if (!authed) {
      setAuthorized(false);
      router.replace("/admin/login");
      return;
    }

    if (!VALID_ROLES.has(role)) {
      setAuthorized(false);
      router.replace("/dashboard");
      return;
    }

    setAuthorized(true);
    getUser().then((u) => {
      if (u) setAdminUser(u);
    });
  }, [isLoginPage, pathname, router]);

  const handleNav = useCallback(
    (e, href, afterClick) => {
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
      if (afterClick) afterClick();
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

  const handleSignOut = () => {
    logout();
    window.location.href = "/admin/login";
  };

  // Render `/admin/login` standalone without sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 animate-pulse flex items-center justify-center font-extrabold text-xl">
            আ
          </div>
          <p className="text-xs font-semibold text-slate-400">
            Verifying Admin Credentials...
          </p>
        </div>
      </div>
    );
  }

  const effectivePath = pendingPath || pathname;
  const isItemActive = (item) =>
    item.matchHrefs
      ? item.matchHrefs.includes(effectivePath)
      : effectivePath?.startsWith(item.href);

  const activeNav = ADMIN_NAV_ITEMS.find(isItemActive) || ADMIN_NAV_ITEMS[0];

  const roleText = String(adminUser?.role || getRole() || "superadmin").toUpperCase();
  const isNavigating =
    isPending || Boolean(pendingPath && pendingPath !== pathname);

  const renderSidebar = (closeDrawer) => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-24 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl" />

      {/* Brand Crest */}
      <div className="relative px-5 pt-5 pb-4 border-b border-white/10">
        <Link
          href="/admin"
          onClick={(e) => handleNav(e, "/admin", closeDrawer)}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              AMARDokan
            </span>
            <p className="text-[11px] text-emerald-400 font-semibold leading-none mt-0.5">
              Admin Command Center
            </p>
          </div>
        </Link>

        {/* Active Admin Identity Card */}
        <div className="mt-4 rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
              {String(adminUser?.fullName || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.fullName || "Super Admin"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {adminUser?.email || "admin@sm.com"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <Badge className="bg-gradient-to-r from-violet-500/25 to-cyan-500/25 text-cyan-200 border-cyan-400/30 text-[10px] px-2 py-0.5">
              <Crown className="w-2.5 h-2.5 mr-1 text-amber-300" />
              {roleText}
            </Badge>
            <Link
              href="/shop"
              target="_blank"
              className="text-[11px] text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1 font-semibold"
            >
              Stores <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={(e) => handleNav(e, item.href, closeDrawer)}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-950/50"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white/15 text-cyan-200">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Sign Out */}
      <div className="relative p-3 border-t border-white/10 space-y-2">
        <Link
          href="/admin/users?create=1"
          onClick={(e) => handleNav(e, "/admin/users?create=1", closeDrawer)}
          className="w-full h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 hover:bg-emerald-500/25 text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Create User-Admin
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full h-9 rounded-xl text-rose-300 hover:bg-rose-500/15 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 h-screen sticky top-0 border-r border-slate-900">
        {renderSidebar(null)}
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 bg-slate-950 border-r border-white/10 text-white"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
            <SheetDescription>Platform management links</SheetDescription>
          </SheetHeader>
          {renderSidebar(() => setMobileDrawerOpen(false))}
        </SheetContent>
      </Sheet>

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Glass Command Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          {isNavigating && (
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 animate-pulse" />
          )}

          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                  {activeNav.label}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">
                  <Sparkles className="w-2.5 h-2.5" /> {roleText}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AMARDokan Multi-Tenant Control Plane
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/shop" target="_blank">
                <ExternalLink className="w-3.5 h-3.5" />
                Live Marketplace
              </Link>
            </Button>
            <Button asChild variant="gradient" size="sm">
              <Link href="/admin/users?create=1">
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add User-Admin</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 max-w-[1440px] w-full mx-auto">
          {children}
        </div>
      </div>

      {/* Mobile App Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-white/95 backdrop-blur-xl border-t border-slate-200 grid grid-cols-5 px-1">
        {ADMIN_NAV_ITEMS.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition",
                active ? "text-violet-600" : "text-slate-500"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-slate-500"
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
