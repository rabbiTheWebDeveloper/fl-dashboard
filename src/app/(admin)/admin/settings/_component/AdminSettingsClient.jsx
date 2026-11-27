"use client";

import React, { useState } from "react";
import {
  Code2,
  KeyRound,
  Loader2,
  Save,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuthHeaders } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsClient({ admin, initialSettings = {} }) {
  const [settings, setSettings] = useState({
    platformName: initialSettings.platformName || "AMARDokan",
    platformTagline:
      initialSettings.platformTagline ||
      "Next-Gen Multi-Store E-Commerce Cloud",
    supportEmail: initialSettings.supportEmail || "support@amardokan.com",
    supportPhone: initialSettings.supportPhone || "01700000000",
    monthlyPlanFee: initialSettings.monthlyPlanFee ?? 499,
    trialDays: initialSettings.trialDays ?? 14,
    allowRegistrations: initialSettings.allowRegistrations !== false,
    maintenanceMode: Boolean(initialSettings.maintenanceMode),
    announcementBanner: initialSettings.announcementBanner || "",
  });

  const [savingSettings, setSavingSettings] = useState(false);

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [savingPwd, setSavingPwd] = useState(false);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to save settings.");
        return;
      }
      toast.success("Global platform settings saved!");
    } catch {
      toast.error("Could not save platform settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setSavingPwd(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: "change_password",
          ...pwdForm,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Password change failed.");
        return;
      }
      setPwdForm({ currentPassword: "", newPassword: "" });
      toast.success("Admin password updated successfully!");
    } catch {
      toast.error("Error updating password.");
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Global Platform Config (7 cols) */}
      <Card className="lg:col-span-7 border-slate-200/80 bg-white shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-extrabold flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-600" />
            Global Platform Configuration
          </CardTitle>
          <CardDescription className="text-xs">
            Configure AMARDokan SaaS pricing, merchant registration rules, and support channels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Platform Name</Label>
                <Input
                  value={settings.platformName}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, platformName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tagline</Label>
                <Input
                  value={settings.platformTagline}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      platformTagline: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Support Email</Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, supportEmail: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Support Phone</Label>
                <Input
                  value={settings.supportPhone}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, supportPhone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Default Monthly Plan Fee (৳)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.monthlyPlanFee}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      monthlyPlanFee: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Free Trial Days</Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.trialDays}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      trialDays: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Global Announcement Banner (Optional)
              </Label>
              <Input
                value={settings.announcementBanner}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    announcementBanner: e.target.value,
                  }))
                }
                placeholder="e.g. Scheduled maintenance tonight at 2:00 AM..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">
                  Allow Merchant Signups
                </span>
                <input
                  type="checkbox"
                  checked={settings.allowRegistrations}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      allowRegistrations: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-violet-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">
                  Maintenance Mode
                </span>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      maintenanceMode: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-rose-600 rounded"
                />
              </label>
            </div>

            <Button
              type="submit"
              variant="gradient"
              disabled={savingSettings}
              className="w-full sm:w-auto"
            >
              {savingSettings ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Platform Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Right Column: Password Rotation & Admin REST API Endpoints (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="border-slate-200/80 bg-white shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              Admin Security ({admin?.email})
            </CardTitle>
            <CardDescription className="text-xs">
              Update your active `{admin?.role}` password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Current Password</Label>
                <Input
                  type="password"
                  required
                  value={pwdForm.currentPassword}
                  onChange={(e) =>
                    setPwdForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">New Password</Label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={pwdForm.newPassword}
                  onChange={(e) =>
                    setPwdForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                disabled={savingPwd}
                className="w-full"
              >
                {savingPwd ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                Update My Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-slate-950 text-white shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-extrabold flex items-center gap-2 text-cyan-300">
              <Code2 className="w-4 h-4" /> Active Admin REST APIs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs font-mono text-slate-300">
            {[
              "POST   /api/admin/auth/login",
              "GET    /api/admin/overview",
              "GET    /api/admin/users",
              "POST   /api/admin/users (role: user-admin)",
              "PATCH  /api/admin/users/[id]",
              "GET    /api/admin/merchants",
              "GET    /api/admin/shops",
              "GET    /api/admin/orders",
              "GET    /api/admin/products",
              "GET    /api/admin/payment-list",
              "POST   /api/admin/payment-list",
              "GET    /api/admin/billing",
              "PUT    /api/admin/settings",
            ].map((ep) => (
              <div
                key={ep}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 truncate"
              >
                {ep}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
