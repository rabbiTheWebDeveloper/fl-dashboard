"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Crown,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  UserCog,
  UserPlus,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuthHeaders } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MODULE_LABELS = {
  overview: { label: "Executive Overview", route: "/admin" },
  dashboard: { label: "Admin Dashboard", route: "/admin/dashboard" },
  users: { label: "Admin Users Directory", route: "/admin/users" },
  role: { label: "RBAC Role Matrix", route: "/admin/role" },
  merchants: { label: "Merchants Management", route: "/admin/merchants" },
  shops: { label: "All Stores", route: "/admin/shops" },
  domain: { label: "Custom Domains & DNS", route: "/admin/domain" },
  orders: { label: "Global Orders", route: "/admin/orders" },
  products: { label: "Products Moderation", route: "/admin/products" },
  "payment-list": { label: "Payment List & Ledger", route: "/admin/payment-list" },
  billing: { label: "SaaS Billing", route: "/admin/billing" },
  visitor: { label: "Visitor Analytics", route: "/admin/visitor" },
  analytics: { label: "Growth Analytics", route: "/admin/analytics" },
  settings: { label: "System Settings", route: "/admin/setting" },
};

const ROLE_META = [
  {
    key: "superadmin",
    title: "Superadmin",
    desc: "Unrestricted root control over security, settings & staff",
    bar: "from-violet-600 to-indigo-600",
    badge: "bg-violet-500/15 text-violet-700 border-violet-200",
  },
  {
    key: "user-admin",
    title: "User-Admin",
    desc: "Operations lead managing staff, merchants, domains & payments",
    bar: "from-cyan-500 to-blue-600",
    badge: "bg-cyan-500/15 text-cyan-700 border-cyan-200",
  },
  {
    key: "moderator",
    title: "Moderator",
    desc: "Catalog, custom domain, store & order moderation",
    bar: "from-amber-500 to-orange-500",
    badge: "bg-amber-500/15 text-amber-700 border-amber-200",
  },
  {
    key: "support",
    title: "Support",
    desc: "Customer order tracking, visitor checks & merchant helpdesk",
    bar: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  },
];

export default function AdminRoleClient({ currentAdmin, initialData = {} }) {
  const modules = initialData.modules || Object.keys(MODULE_LABELS);
  const [templates, setTemplates] = useState(
    initialData.roleTemplates || {
      superadmin: modules,
      "user-admin": modules.filter((m) => m !== "settings"),
      moderator: [
        "overview",
        "dashboard",
        "merchants",
        "shops",
        "domain",
        "orders",
        "products",
        "visitor",
      ],
      support: ["overview", "dashboard", "merchants", "orders", "visitor"],
    }
  );
  const [admins, setAdmins] = useState(initialData.admins || []);
  const [saving, setSaving] = useState(false);

  const canManage = ["superadmin", "user-admin"].includes(currentAdmin?.role);
  const isSuperAdmin = currentAdmin?.role === "superadmin";

  const toggleMatrixCell = (roleKey, modKey) => {
    if (roleKey === "superadmin" || !canManage) return;
    setTemplates((prev) => {
      const current = Array.isArray(prev[roleKey]) ? prev[roleKey] : [];
      const has = current.includes(modKey);
      return {
        ...prev,
        [roleKey]: has
          ? current.filter((m) => m !== modKey)
          : [...current, modKey],
      };
    });
  };

  const handleSaveMatrix = async (syncExistingUsers = false) => {
    if (!canManage) {
      toast.error("Only Superadmin or User-Admin can modify role permissions.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/role", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          roleTemplates: templates,
          syncExistingUsers,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to save role matrix.");
        return;
      }
      toast.success(json.message);
      if (syncExistingUsers) {
        // Refresh staff list so updated permission counts display immediately
        const r = await fetch("/api/admin/role", {
          headers: getAuthHeaders(),
        });
        const j = await r.json();
        if (j?.success && j.data?.admins) {
          setAdmins(j.data.admins);
        }
      }
    } catch {
      toast.error("Could not save role permissions.");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignUserRole = async (adminDoc, nextRole) => {
    try {
      const rolePerms = templates[nextRole] || templates["user-admin"];
      const res = await fetch(`/api/admin/users/${adminDoc._id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          role: nextRole,
          permissions: rolePerms,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to update user role.");
        return;
      }
      setAdmins((prev) =>
        prev.map((a) => (a._id === adminDoc._id ? json.data : a))
      );
      toast.success(`${adminDoc.fullName} updated to ${nextRole}`);
    } catch {
      toast.error("Error updating user role.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <KeyRound className="w-4 h-4" /> Access Control & Permission Matrix
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Role & Permission Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Define module capabilities for `superadmin`, `user-admin`, `moderator`, and `support` roles across AMARDokan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/users?create=1">
                <UserPlus className="w-3.5 h-3.5 text-cyan-600" />
                Create User-Admin
              </Link>
            </Button>

            {canManage && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={saving}
                  onClick={() => handleSaveMatrix(true)}
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  Save & Sync Staff
                </Button>

                <Button
                  type="button"
                  variant="gradient"
                  size="sm"
                  disabled={saving}
                  onClick={() => handleSaveMatrix(false)}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Matrix
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4 Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {ROLE_META.map((r) => {
          const permCount =
            r.key === "superadmin"
              ? modules.length
              : (templates[r.key] || []).length;
          const memberCount = admins.filter((a) => a.role === r.key).length;
          return (
            <Card
              key={r.key}
              className="relative overflow-hidden py-4 border-slate-200/80 bg-white shadow-2xs"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${r.bar}`}
              />
              <CardContent className="px-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className={r.badge}>{r.key}</Badge>
                  <span className="text-xs font-extrabold text-slate-900">
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    {r.title}
                    {r.key === "superadmin" && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>Module Coverage</span>
                  <span>
                    {permCount} / {modules.length} modules
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Permission Matrix Table */}
      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base sm:text-lg font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-600" />
            Interactive RBAC Module Matrix
          </CardTitle>
          <CardDescription className="text-xs">
            Toggle checkboxes to grant or revoke module access per role. `superadmin` retains locked full access.
          </CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold min-w-[220px]">
                  Platform Module
                </TableHead>
                <TableHead className="font-bold text-center">
                  superadmin
                </TableHead>
                <TableHead className="font-bold text-center">
                  user-admin
                </TableHead>
                <TableHead className="font-bold text-center">
                  moderator
                </TableHead>
                <TableHead className="font-bold text-center">support</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((modKey) => {
                const meta = MODULE_LABELS[modKey] || {
                  label: modKey,
                  route: `/admin/${modKey}`,
                };
                return (
                  <TableRow key={modKey}>
                    <TableCell>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        {meta.label}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        {meta.route}
                      </p>
                    </TableCell>

                    {/* Superadmin Locked Cell */}
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-violet-100 text-violet-700">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    </TableCell>

                    {/* Editable Role Cells */}
                    {["user-admin", "moderator", "support"].map((roleKey) => {
                      const checked = (templates[roleKey] || []).includes(
                        modKey
                      );
                      return (
                        <TableCell key={roleKey} className="text-center">
                          <button
                            type="button"
                            disabled={!canManage}
                            onClick={() => toggleMatrixCell(roleKey, modKey)}
                            aria-label={`${roleKey} ${modKey} permission`}
                            className={`w-6 h-6 rounded-lg inline-flex items-center justify-center border transition ${
                              checked
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                                : "bg-white border-slate-300 text-transparent hover:border-slate-400"
                            } disabled:opacity-60`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Active Admin Staff Role Assignment */}
      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <UserCog className="w-4 h-4 text-cyan-600" />
              Assigned Staff Roles ({admins.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Quickly switch any staff member&apos;s role and sync their module permissions
            </CardDescription>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-bold text-violet-600 hover:underline"
          >
            Full Staff Directory →
          </Link>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold">Admin Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold text-center">
                  Active Modules
                </TableHead>
                <TableHead className="font-bold text-right">
                  Assigned Role
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((a) => {
                const isRoot = a.email === "admin@sm.com";
                return (
                  <TableRow key={a._id}>
                    <TableCell className="font-bold text-slate-900">
                      <span className="inline-flex items-center gap-1.5">
                        {a.fullName}
                        {isRoot && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {a.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs font-bold">
                        {(a.permissions || []).length} modules
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isRoot || !canManage ? (
                        <Badge className="bg-violet-500/15 text-violet-700 border-violet-200">
                          {a.role}
                        </Badge>
                      ) : (
                        <select
                          aria-label="Assign role"
                          value={a.role}
                          onChange={(e) =>
                            handleAssignUserRole(a, e.target.value)
                          }
                          className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                        >
                          <option value="user-admin">user-admin</option>
                          {isSuperAdmin && (
                            <option value="superadmin">superadmin</option>
                          )}
                          <option value="moderator">moderator</option>
                          <option value="support">support</option>
                        </select>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
