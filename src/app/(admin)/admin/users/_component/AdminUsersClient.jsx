"use client";

import React, { useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Crown,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ALL_MODULES = [
  { id: "overview", label: "Executive Overview" },
  { id: "users", label: "Admin Users & Roles" },
  { id: "merchants", label: "Merchants Management" },
  { id: "shops", label: "All Stores" },
  { id: "orders", label: "Global Orders" },
  { id: "products", label: "Products Moderation" },
  { id: "payment-list", label: "Payment List & Ledger" },
  { id: "billing", label: "SaaS Billing" },
  { id: "analytics", label: "Platform Analytics" },
  { id: "settings", label: "System Settings" },
];

const ROLE_PRESET_PERMS = {
  superadmin: ALL_MODULES.map((m) => m.id),
  "user-admin": [
    "overview",
    "users",
    "merchants",
    "shops",
    "orders",
    "products",
    "payment-list",
    "billing",
    "analytics",
  ],
  moderator: ["overview", "merchants", "shops", "orders", "products"],
  support: ["overview", "merchants", "orders"],
};

const ROLE_BADGE_STYLES = {
  superadmin: "bg-violet-500/15 text-violet-700 border-violet-200",
  "user-admin": "bg-cyan-500/15 text-cyan-700 border-cyan-200",
  moderator: "bg-amber-500/15 text-amber-700 border-amber-200",
  support: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
};

export default function AdminUsersClient({
  currentAdmin,
  initialUsers = [],
  openCreateInitially = false,
}) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(openCreateInitially);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "user-admin",
    department: "User & Merchant Administration",
    permissions: ROLE_PRESET_PERMS["user-admin"],
  });

  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const canManage = ["superadmin", "user-admin"].includes(currentAdmin?.role);
  const isSuperAdmin = currentAdmin?.role === "superadmin";

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        String(u.fullName || "")
          .toLowerCase()
          .includes(q) ||
        String(u.email || "")
          .toLowerCase()
          .includes(q) ||
        String(u.role || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [users, search, roleFilter]);

  const togglePerm = (permId) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permId)
          : [...prev.permissions, permId],
      };
    });
  };

  const handleRoleChange = (nextRole) => {
    setForm((prev) => ({
      ...prev,
      role: nextRole,
      permissions: ROLE_PRESET_PERMS[nextRole] || ROLE_PRESET_PERMS["user-admin"],
    }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!canManage) {
      toast.error("Only Superadmin or User-Admin can create admin users.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to create admin user.");
        return;
      }

      setUsers((prev) => [json.data, ...prev]);
      toast.success(json.message || "User-Admin account created!");
      setCreateOpen(false);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "user-admin",
        department: "User & Merchant Administration",
        permissions: ROLE_PRESET_PERMS["user-admin"],
      });
    } catch (error) {
      toast.error(error?.message || "Error creating admin account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatchUser = async (id, payload, successMsg) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Update failed.");
        return false;
      }
      setUsers((prev) => prev.map((u) => (u._id === id ? json.data : u)));
      toast.success(successMsg || json.message);
      return true;
    } catch (error) {
      toast.error(error?.message || "Failed to update account.");
      return false;
    }
  };

  const handleDeleteUser = async (target) => {
    if (
      !window.confirm(
        `Remove admin account "${target.fullName}" (${target.email})?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${target._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Could not delete admin.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u._id !== target._id));
      toast.success("Admin user deleted.");
    } catch (error) {
      toast.error(error?.message || "Delete failed.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetModalUser || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    const ok = await handlePatchUser(
      resetModalUser._id,
      { newPassword },
      `Password updated for ${resetModalUser.fullName}`
    );
    if (ok) {
      setResetModalUser(null);
      setNewPassword("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <ShieldCheck className="w-4 h-4" /> Role-Based Access Control (RBAC)
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Admin & `user-admin` Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Create and manage `user-admin`, `superadmin`, `moderator`, and `support` staff accounts.
            </p>
          </div>

          {canManage && (
            <Button
              type="button"
              variant="gradient"
              onClick={() => setCreateOpen(true)}
            >
              <UserPlus className="w-4 h-4" />
              Create User-Admin
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Role Summary Pills + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "all", label: `All (${users.length})` },
            {
              id: "superadmin",
              label: `Superadmin (${
                users.filter((u) => u.role === "superadmin").length
              })`,
            },
            {
              id: "user-admin",
              label: `User-Admin (${
                users.filter((u) => u.role === "user-admin").length
              })`,
            },
            {
              id: "moderator",
              label: `Moderator (${
                users.filter((u) => u.role === "moderator").length
              })`,
            },
            {
              id: "support",
              label: `Support (${
                users.filter((u) => u.role === "support").length
              })`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                roleFilter === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or role..."
            className="pl-9 h-10 bg-white rounded-xl"
          />
        </div>
      </div>

      {/* Admin Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUsers.map((u) => {
          const isPrimaryRoot = u.email === "admin@sm.com";
          return (
            <Card
              key={u._id}
              className="border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white font-extrabold text-base flex items-center justify-center shrink-0">
                      {String(u.fullName || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                        {u.fullName}
                        {u.role === "superadmin" && (
                          <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs truncate flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 shrink-0" /> {u.email}
                      </CardDescription>
                    </div>
                  </div>

                  <Badge
                    className={
                      ROLE_BADGE_STYLES[u.role] || ROLE_BADGE_STYLES["user-admin"]
                    }
                  >
                    {u.role}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-xs text-slate-500 space-y-1">
                  {u.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {u.phone}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5">
                    <UserCog className="w-3.5 h-3.5 text-slate-400" />
                    {u.department || "Platform Operations"}
                  </p>
                </div>

                {/* Module Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {(u.permissions || []).slice(0, 6).map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold capitalize"
                    >
                      {perm}
                    </span>
                  ))}
                  {(u.permissions || []).length > 6 && (
                    <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 text-[10px] font-bold">
                      +{u.permissions.length - 6} more
                    </span>
                  )}
                </div>

                {/* Controls Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      u.status === "active"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {u.status === "active" ? "Active" : "Suspended"}
                  </span>

                  {canManage && (
                    <div className="flex items-center gap-1.5">
                      {!isPrimaryRoot && (
                        <select
                          aria-label="Change role"
                          value={u.role}
                          onChange={(e) =>
                            handlePatchUser(
                              u._id,
                              { role: e.target.value },
                              `Role changed to ${e.target.value}`
                            )
                          }
                          className="h-8 px-2 rounded-lg border border-slate-200 text-xs font-semibold bg-slate-50"
                        >
                          <option value="user-admin">user-admin</option>
                          {isSuperAdmin && (
                            <option value="superadmin">superadmin</option>
                          )}
                          <option value="moderator">moderator</option>
                          <option value="support">support</option>
                        </select>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setResetModalUser(u);
                          setNewPassword("");
                        }}
                        title="Reset Password"
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      {!isPrimaryRoot && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handlePatchUser(
                                u._id,
                                {
                                  status:
                                    u.status === "active"
                                      ? "suspended"
                                      : "active",
                                },
                                u.status === "active"
                                  ? "Account suspended"
                                  : "Account activated"
                              )
                            }
                            title={
                              u.status === "active" ? "Suspend" : "Activate"
                            }
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-amber-600 hover:bg-amber-50"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            title="Delete Admin"
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create User-Admin Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900">
              Create Admin Account (`user-admin`)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a new team member with `user-admin` or specialized administrative permissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAdmin} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Full Name *</Label>
                <Input
                  required
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="e.g. Rahat Hossain"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Role *</Label>
                <select
                  value={form.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm font-semibold bg-white"
                >
                  <option value="user-admin">user-admin (Recommended)</option>
                  {isSuperAdmin && (
                    <option value="superadmin">superadmin</option>
                  )}
                  <option value="moderator">moderator</option>
                  <option value="support">support</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Email Address *</Label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="useradmin@sm.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Phone Number</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Initial Password *</Label>
                <Input
                  type="text"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Department</Label>
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                  placeholder="Operations"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Module Access Permissions</Label>
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                {ALL_MODULES.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(m.id)}
                      onChange={() => togglePerm(m.id)}
                      className="rounded accent-violet-600"
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Create {form.role}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog
        open={Boolean(resetModalUser)}
        onOpenChange={(o) => {
          if (!o) setResetModalUser(null);
        }}
      >
        <DialogContent className="sm:max-w-sm rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              Reset Admin Password
            </DialogTitle>
            <DialogDescription className="text-xs">
              Set a new password for {resetModalUser?.fullName} (
              {resetModalUser?.email})
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 pt-1">
            <Input
              type="text"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 chars)"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetModalUser(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient">
                Save Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
