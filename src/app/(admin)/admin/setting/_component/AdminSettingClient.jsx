"use client";

import React, { useState } from "react";
import {
  Activity,
  Building2,
  CheckCircle2,
  Code2,
  CreditCard,
  Database,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCog,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuthHeaders, setUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const bdt = (val) =>
  `৳${Math.round(Number(val || 0)).toLocaleString("en-IN")}`;

function ToggleCard({ title, desc, checked, onChange, danger = false }) {
  return (
    <label
      className={`flex items-start justify-between gap-4 p-4 rounded-2xl border cursor-pointer transition ${
        checked
          ? danger
            ? "border-rose-300 bg-rose-50/60"
            : "border-violet-200 bg-violet-50/40"
          : "border-slate-200 bg-white hover:bg-slate-50/60"
      }`}
    >
      <div className="space-y-0.5">
        <p className="text-xs sm:text-sm font-bold text-slate-900">{title}</p>
        {desc && <p className="text-[11px] text-slate-500">{desc}</p>}
      </div>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className={`mt-0.5 w-4 h-4 rounded shrink-0 ${
          danger ? "accent-rose-600" : "accent-violet-600"
        }`}
      />
    </label>
  );
}

export default function AdminSettingClient({ admin, initialSettings = {} }) {
  const diagnostics = initialSettings?.diagnostics || {};
  const canEditPlatform = ["superadmin", "user-admin"].includes(admin?.role);

  const [form, setForm] = useState({
    // Tab 1: General & Branding
    platformName: initialSettings.platformName || "AMARDokan",
    platformTagline:
      initialSettings.platformTagline ||
      "Next-Gen Multi-Store E-Commerce Cloud",
    companyAddress: initialSettings.companyAddress || "Dhaka, Bangladesh",
    supportEmail: initialSettings.supportEmail || "support@amardokan.com",
    supportPhone: initialSettings.supportPhone || "01700000000",
    whatsappSupport: initialSettings.whatsappSupport || "01700000000",
    logoUrl: initialSettings.logoUrl || "",
    faviconUrl: initialSettings.faviconUrl || "",
    currency: initialSettings.currency || "BDT",
    timezone: initialSettings.timezone || "Asia/Dhaka",
    announcementBanner: initialSettings.announcementBanner || "",

    // Tab 2: SaaS Plans & Billing
    basicPlanPrice: initialSettings.basicPlanPrice ?? 299,
    standardPlanPrice: initialSettings.standardPlanPrice ?? 599,
    professionalPlanPrice: initialSettings.professionalPlanPrice ?? 999,
    monthlyPlanFee: initialSettings.monthlyPlanFee ?? 499,
    vatPercent: initialSettings.vatPercent ?? 5,
    trialDays: initialSettings.trialDays ?? 14,
    billingCycleDays: initialSettings.billingCycleDays ?? 30,
    gracePeriodDays: initialSettings.gracePeriodDays ?? 7,

    // Tab 3: Payment Gateways (Default Send Money Number: 01726278251)
    bkashEnabled: initialSettings.bkashEnabled !== false,
    bkashMerchantNumber:
      initialSettings.bkashMerchantNumber &&
      initialSettings.bkashMerchantNumber !== "01700000000"
        ? initialSettings.bkashMerchantNumber
        : "01726278251",
    bkashAccountType: initialSettings.bkashAccountType || "Personal",
    nagadEnabled: initialSettings.nagadEnabled !== false,
    nagadMerchantNumber:
      initialSettings.nagadMerchantNumber &&
      initialSettings.nagadMerchantNumber !== "01700000000"
        ? initialSettings.nagadMerchantNumber
        : "01726278251",
    rocketEnabled: initialSettings.rocketEnabled !== false,
    rocketMerchantNumber:
      initialSettings.rocketMerchantNumber &&
      initialSettings.rocketMerchantNumber !== "01700000000"
        ? initialSettings.rocketMerchantNumber
        : "01726278251",
    upayEnabled: initialSettings.upayEnabled !== false,
    upayMerchantNumber: initialSettings.upayMerchantNumber || "01726278251",
    gpayEnabled: initialSettings.gpayEnabled !== false,
    gpayMerchantNumber: initialSettings.gpayMerchantNumber || "01726278251",
    bankTransferEnabled: initialSettings.bankTransferEnabled !== false,
    bankName: initialSettings.bankName || "City Bank PLC",
    bankAccountName:
      initialSettings.bankAccountName || "AMARDokan Technologies",
    bankAccountNumber: initialSettings.bankAccountNumber || "",
    bankBranch: initialSettings.bankBranch || "Gulshan Branch, Dhaka",
    sslcommerzEnabled: Boolean(initialSettings.sslcommerzEnabled),
    sslStoreId: initialSettings.sslStoreId || "",

    // Tab 4: System, DNS & Security
    allowRegistrations: initialSettings.allowRegistrations !== false,
    requireEmailVerification:
      initialSettings.requireEmailVerification !== false,
    maintenanceMode: Boolean(initialSettings.maintenanceMode),
    enableOrderEmailAlerts: initialSettings.enableOrderEmailAlerts !== false,
    enableBillingReminders: initialSettings.enableBillingReminders !== false,
    customDomainSupport: initialSettings.customDomainSupport !== false,
    primaryDnsIp: initialSettings.primaryDnsIp || "76.76.21.21",
    primaryCnameTarget:
      initialSettings.primaryCnameTarget || "cname.amardokan.com",
  });

  const [savingPlatform, setSavingPlatform] = useState(false);

  // Tab 5: Admin Profile & Password State
  const [profileForm, setProfileForm] = useState({
    fullName: admin?.fullName || "Super Admin",
    phone: admin?.phone || "",
    department: admin?.department || "Executive Administration",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePlatform = async (e) => {
    if (e) e.preventDefault();
    if (!canEditPlatform) {
      toast.error("Only Superadmin or User-Admin can update platform settings.");
      return;
    }

    setSavingPlatform(true);
    try {
      const res = await fetch("/api/admin/setting", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to save settings.");
        return;
      }
      toast.success(json.message || "Platform settings saved!");
    } catch {
      toast.error("Error saving platform settings.");
    } finally {
      setSavingPlatform(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/admin/setting", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: "update_profile",
          ...profileForm,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Profile update failed.");
        return;
      }
      if (json.data) {
        setUser(json.data, { rememberMe: true });
      }
      toast.success("Admin profile updated!");
    } catch {
      toast.error("Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setSavingPwd(true);
    try {
      const res = await fetch("/api/admin/setting", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: "change_password",
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Password change failed.");
        return;
      }
      setPwdForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success(json.message || "Password changed successfully!");
    } catch {
      toast.error("Failed to update password.");
    } finally {
      setSavingPwd(false);
    }
  };

  const calcWithVat = (base) => {
    const amt = Number(base || 0);
    const vat = Math.round(amt * (Number(form.vatPercent || 0) / 100));
    return { amt, vat, total: amt + vat };
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Banner Card ─── */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <Settings className="w-4 h-4" /> Control Plane Configuration
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              System & Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage AMARDokan global branding, SaaS subscription tiers, payment gateways, DNS rules, and admin security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 px-3 py-1 text-xs">
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              System Healthy · {diagnostics.nodeVersion || "Node"}
            </Badge>

            {canEditPlatform && (
              <Button
                type="button"
                variant="gradient"
                disabled={savingPlatform}
                onClick={() => handleSavePlatform()}
              >
                {savingPlatform ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save All Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── 5-Tab Settings Suite ─── */}
      <Tabs defaultValue="general" className="space-y-5">
        <TabsList className="w-full justify-start h-auto p-1.5 bg-white border border-slate-200 rounded-2xl flex-wrap gap-1">
          <TabsTrigger value="general" className="rounded-xl px-3.5 py-2 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            General & Branding
          </TabsTrigger>
          <TabsTrigger value="plans" className="rounded-xl px-3.5 py-2 text-xs font-bold">
            <CreditCard className="w-3.5 h-3.5 mr-1.5" />
            SaaS Plans & VAT
          </TabsTrigger>
          <TabsTrigger value="gateways" className="rounded-xl px-3.5 py-2 text-xs font-bold">
            <Wallet className="w-3.5 h-3.5 mr-1.5" />
            Payment Gateways
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-xl px-3.5 py-2 text-xs font-bold">
            <Server className="w-3.5 h-3.5 mr-1.5" />
            System, DNS & Health
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-3.5 py-2 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Admin Profile & Security
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: GENERAL & BRANDING ─── */}
        <TabsContent value="general">
          <form onSubmit={handleSavePlatform} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 border-slate-200/80 bg-white shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-extrabold">
                  Platform Identity & Support Channels
                </CardTitle>
                <CardDescription className="text-xs">
                  Displayed on merchant onboarding, billing receipts, and marketplace headers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Platform Name</Label>
                    <Input
                      value={form.platformName}
                      onChange={(e) => setField("platformName", e.target.value)}
                      placeholder="AMARDokan"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Platform Tagline</Label>
                    <Input
                      value={form.platformTagline}
                      onChange={(e) =>
                        setField("platformTagline", e.target.value)
                      }
                      placeholder="Next-Gen Multi-Store E-Commerce Cloud"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Support Email
                    </Label>
                    <Input
                      type="email"
                      value={form.supportEmail}
                      onChange={(e) => setField("supportEmail", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Support Hotline
                    </Label>
                    <Input
                      value={form.supportPhone}
                      onChange={(e) => setField("supportPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">WhatsApp Helpdesk</Label>
                    <Input
                      value={form.whatsappSupport}
                      onChange={(e) =>
                        setField("whatsappSupport", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Headquarters Address</Label>
                  <Input
                    value={form.companyAddress}
                    onChange={(e) => setField("companyAddress", e.target.value)}
                    placeholder="Dhaka, Bangladesh"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Logo URL (Optional)</Label>
                    <Input
                      value={form.logoUrl}
                      onChange={(e) => setField("logoUrl", e.target.value)}
                      placeholder="https://.../logo.png"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Favicon URL (Optional)</Label>
                    <Input
                      value={form.faviconUrl}
                      onChange={(e) => setField("faviconUrl", e.target.value)}
                      placeholder="https://.../favicon.ico"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">
                    Global Merchant Announcement Banner
                  </Label>
                  <Input
                    value={form.announcementBanner}
                    onChange={(e) =>
                      setField("announcementBanner", e.target.value)
                    }
                    placeholder="Optional notice shown to merchants..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 border-slate-200/80 bg-white shadow-2xs h-fit">
              <CardHeader>
                <CardTitle className="text-base font-extrabold">
                  Regional Defaults
                </CardTitle>
                <CardDescription className="text-xs">
                  Currency & timezone formatting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Default Currency</Label>
                  <select
                    value={form.currency}
                    onChange={(e) => setField("currency", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                  >
                    <option value="BDT">BDT (৳ Bangladeshi Taka)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Platform Timezone</Label>
                  <select
                    value={form.timezone}
                    onChange={(e) => setField("timezone", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>

                {canEditPlatform && (
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={savingPlatform}
                    className="w-full"
                  >
                    {savingPlatform ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Branding Settings
                  </Button>
                )}
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* ─── TAB 2: SAAS PLANS & VAT ─── */}
        <TabsContent value="plans">
          <form onSubmit={handleSavePlatform} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  key: "basicPlanPrice",
                  name: "Basic Plan",
                  badge: "Starter",
                  desc: "Up to 100 products, basic analytics & email support",
                  accent: "from-cyan-500 to-blue-600",
                },
                {
                  key: "standardPlanPrice",
                  name: "Standard Plan",
                  badge: "Most Popular",
                  desc: "Up to 500 products, advanced analytics & priority support",
                  accent: "from-violet-600 to-indigo-600",
                },
                {
                  key: "professionalPlanPrice",
                  name: "Professional Plan",
                  badge: "Unlimited",
                  desc: "Unlimited products, custom domain & 24/7 VIP support",
                  accent: "from-emerald-500 to-teal-600",
                },
              ].map((tier) => {
                const summary = calcWithVat(form[tier.key]);
                return (
                  <Card
                    key={tier.key}
                    className="relative overflow-hidden border-slate-200/80 bg-white shadow-2xs"
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tier.accent}`}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-extrabold">
                          {tier.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {tier.badge}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {tier.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">
                          Monthly Fee (৳)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          value={form[tier.key]}
                          onChange={(e) =>
                            setField(tier.key, Number(e.target.value))
                          }
                        />
                      </div>

                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span>Base Price</span>
                          <span className="font-bold text-slate-800">
                            {bdt(summary.amt)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>VAT ({form.vatPercent}%)</span>
                          <span className="font-bold text-slate-800">
                            +{bdt(summary.vat)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t border-slate-200 font-extrabold text-slate-900">
                          <span>Invoice Total</span>
                          <span className="text-violet-600">
                            {bdt(summary.total)}/mo
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-slate-200/80 bg-white shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-extrabold">
                  Billing Cycle, Trial & Tax Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">VAT Percentage (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={form.vatPercent}
                    onChange={(e) =>
                      setField("vatPercent", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Free Trial Days</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.trialDays}
                    onChange={(e) =>
                      setField("trialDays", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Billing Cycle (Days)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.billingCycleDays}
                    onChange={(e) =>
                      setField("billingCycleDays", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Grace Period (Days)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.gracePeriodDays}
                    onChange={(e) =>
                      setField("gracePeriodDays", Number(e.target.value))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* ─── TAB 3: PAYMENT GATEWAYS ─── */}
        <TabsContent value="gateways">
          <form onSubmit={handleSavePlatform} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mobile Financial Services (5 Send Money Gateways) */}
            <Card className="border-slate-200/80 bg-white shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-extrabold">
                  Send Money Gateways (bKash · Nagad · Rocket · Upay · GPay)
                </CardTitle>
                <CardDescription className="text-xs">
                  Personal Send Money numbers displayed in the Payment Gateway for TrxID submission & verification (default: 01726278251).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <div className="p-3.5 rounded-2xl border border-pink-200 bg-pink-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-pink-700">
                      1. bKash (Send Money)
                    </span>
                    <input
                      type="checkbox"
                      checked={form.bkashEnabled}
                      onChange={(e) =>
                        setField("bkashEnabled", e.target.checked)
                      }
                      className="w-4 h-4 accent-pink-600 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={form.bkashMerchantNumber}
                      onChange={(e) =>
                        setField("bkashMerchantNumber", e.target.value)
                      }
                      placeholder="01726278251"
                      className="bg-white font-mono"
                    />
                    <select
                      value={form.bkashAccountType}
                      onChange={(e) =>
                        setField("bkashAccountType", e.target.value)
                      }
                      className="h-9 px-3 rounded-md border border-slate-200 text-xs font-bold bg-white"
                    >
                      <option value="Personal">Send Money (Personal)</option>
                      <option value="Merchant">Merchant Payment</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-orange-200 bg-orange-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-orange-700">
                      2. Nagad (Send Money)
                    </span>
                    <input
                      type="checkbox"
                      checked={form.nagadEnabled}
                      onChange={(e) =>
                        setField("nagadEnabled", e.target.checked)
                      }
                      className="w-4 h-4 accent-orange-600 rounded"
                    />
                  </div>
                  <Input
                    value={form.nagadMerchantNumber}
                    onChange={(e) =>
                      setField("nagadMerchantNumber", e.target.value)
                    }
                    placeholder="01726278251"
                    className="bg-white font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-purple-700">
                      3. Rocket (Send Money)
                    </span>
                    <input
                      type="checkbox"
                      checked={form.rocketEnabled}
                      onChange={(e) =>
                        setField("rocketEnabled", e.target.checked)
                      }
                      className="w-4 h-4 accent-purple-600 rounded"
                    />
                  </div>
                  <Input
                    value={form.rocketMerchantNumber}
                    onChange={(e) =>
                      setField("rocketMerchantNumber", e.target.value)
                    }
                    placeholder="01726278251"
                    className="bg-white font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-blue-700">
                      4. Upay (Send Money)
                    </span>
                    <input
                      type="checkbox"
                      checked={form.upayEnabled}
                      onChange={(e) =>
                        setField("upayEnabled", e.target.checked)
                      }
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                  </div>
                  <Input
                    value={form.upayMerchantNumber}
                    onChange={(e) =>
                      setField("upayMerchantNumber", e.target.value)
                    }
                    placeholder="01726278251"
                    className="bg-white font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-sky-700">
                      5. GPay (Send Money)
                    </span>
                    <input
                      type="checkbox"
                      checked={form.gpayEnabled}
                      onChange={(e) =>
                        setField("gpayEnabled", e.target.checked)
                      }
                      className="w-4 h-4 accent-sky-600 rounded"
                    />
                  </div>
                  <Input
                    value={form.gpayMerchantNumber}
                    onChange={(e) =>
                      setField("gpayMerchantNumber", e.target.value)
                    }
                    placeholder="01726278251"
                    className="bg-white font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bank Transfer & SSLCommerz */}
            <Card className="border-slate-200/80 bg-white shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-extrabold">
                  Bank Transfer & Card Gateway
                </CardTitle>
                <CardDescription className="text-xs">
                  Corporate bank settlement & automated SSLCommerz gateway
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleCard
                  title="Enable Corporate Bank Transfer"
                  desc="Allow merchants to upload/submit bank deposit slips"
                  checked={form.bankTransferEnabled}
                  onChange={(v) => setField("bankTransferEnabled", v)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Bank Name</Label>
                    <Input
                      value={form.bankName}
                      onChange={(e) => setField("bankName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Account Title</Label>
                    <Input
                      value={form.bankAccountName}
                      onChange={(e) =>
                        setField("bankAccountName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Account Number</Label>
                    <Input
                      value={form.bankAccountNumber}
                      onChange={(e) =>
                        setField("bankAccountNumber", e.target.value)
                      }
                      placeholder="e.g. 1402938475001"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Branch Name</Label>
                    <Input
                      value={form.bankBranch}
                      onChange={(e) => setField("bankBranch", e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <ToggleCard
                    title="Enable SSLCommerz Card / NetBanking"
                    desc="Automated card & mobile checkout gateway"
                    checked={form.sslcommerzEnabled}
                    onChange={(v) => setField("sslcommerzEnabled", v)}
                  />
                  {form.sslcommerzEnabled && (
                    <div className="space-y-1">
                      <Label className="text-xs font-bold">
                        SSLCommerz Store ID
                      </Label>
                      <Input
                        value={form.sslStoreId}
                        onChange={(e) => setField("sslStoreId", e.target.value)}
                        placeholder="Enter live Store ID"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* ─── TAB 4: SYSTEM, DNS & DIAGNOSTICS ─── */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 border-slate-200/80 bg-white shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-extrabold">
                  Access Control, Automation & Custom Domain DNS
                </CardTitle>
                <CardDescription className="text-xs">
                  Platform-wide operational switches and merchant custom domain records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ToggleCard
                    title="Allow Merchant Signups"
                    desc="Public /registration access for new stores"
                    checked={form.allowRegistrations}
                    onChange={(v) => setField("allowRegistrations", v)}
                  />
                  <ToggleCard
                    title="Require Email OTP Verification"
                    desc="Verify merchant email before first login"
                    checked={form.requireEmailVerification}
                    onChange={(v) => setField("requireEmailVerification", v)}
                  />
                  <ToggleCard
                    title="Order Email Notifications"
                    desc="Notify merchants on new website orders"
                    checked={form.enableOrderEmailAlerts}
                    onChange={(v) => setField("enableOrderEmailAlerts", v)}
                  />
                  <ToggleCard
                    title="Automated Billing Reminders"
                    desc="Send renewal notices before due date"
                    checked={form.enableBillingReminders}
                    onChange={(v) => setField("enableBillingReminders", v)}
                  />
                  <ToggleCard
                    title="Custom Domain Routing"
                    desc="Allow merchants to map custom domains"
                    checked={form.customDomainSupport}
                    onChange={(v) => setField("customDomainSupport", v)}
                  />
                  <ToggleCard
                    title="Maintenance Mode"
                    desc="Temporarily pause non-admin access"
                    checked={form.maintenanceMode}
                    onChange={(v) => setField("maintenanceMode", v)}
                    danger
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-cyan-600" /> Primary A-Record IP
                    </Label>
                    <Input
                      value={form.primaryDnsIp}
                      onChange={(e) => setField("primaryDnsIp", e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-violet-600" /> Primary CNAME Target
                    </Label>
                    <Input
                      value={form.primaryCnameTarget}
                      onChange={(e) =>
                        setField("primaryCnameTarget", e.target.value)
                      }
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Database & API Diagnostics */}
            <div className="lg:col-span-5 space-y-5">
              <Card className="border-slate-200/80 bg-white shadow-2xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-extrabold flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    Live Database Collection Counts
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    ["Admin Staff", diagnostics.adminsCount ?? 1],
                    ["Merchants", diagnostics.merchantsCount ?? 0],
                    ["Active Shops", diagnostics.shopsCount ?? 0],
                    ["Products", diagnostics.productsCount ?? 0],
                    ["Orders", diagnostics.ordersCount ?? 0],
                    ["Billing Docs", diagnostics.billingsCount ?? 0],
                    ["Custom Domains", diagnostics.domainsCount ?? 0],
                    ["Environment", diagnostics.environment || "dev"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <span className="text-slate-500 font-medium">{k}</span>
                      <strong className="text-slate-900 font-extrabold">
                        {v}
                      </strong>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-slate-950 text-white shadow-2xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-extrabold flex items-center gap-2 text-cyan-300">
                    <Code2 className="w-4 h-4" /> Active Admin REST APIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-[11px] font-mono text-slate-300">
                  {[
                    "POST   /api/admin/auth/login",
                    "GET    /api/admin/overview",
                    "GET    /api/admin/users",
                    "POST   /api/admin/users (user-admin)",
                    "GET    /api/admin/merchants",
                    "GET    /api/admin/shops",
                    "GET    /api/admin/orders",
                    "GET    /api/admin/products",
                    "GET    /api/admin/payment-list",
                    "GET    /api/admin/billing",
                    "GET    /api/admin/setting",
                    "PUT    /api/admin/setting",
                  ].map((ep) => (
                    <div
                      key={ep}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 truncate"
                    >
                      {ep}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB 5: MY ADMIN PROFILE & SECURITY ─── */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Form */}
            <Card className="border-slate-200/80 bg-white shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <UserCog className="w-4 h-4 text-violet-600" />
                  My Admin Profile
                </CardTitle>
                <CardDescription className="text-xs">
                  Signed in as <strong>{admin?.email}</strong> ({admin?.role})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Full Name</Label>
                    <Input
                      required
                      value={profileForm.fullName}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          fullName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Phone Number</Label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Department</Label>
                      <Input
                        value={profileForm.department}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            department: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500">
                      Granted RBAC Permissions
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {(admin?.permissions || []).map((perm) => (
                        <span
                          key={perm}
                          className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-[11px] font-bold capitalize"
                        >
                          <Sparkles className="w-2.5 h-2.5 inline mr-1" />
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Form */}
            <Card className="border-slate-200/80 bg-white shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  Rotate Admin Password
                </CardTitle>
                <CardDescription className="text-xs">
                  Keep your `{admin?.role}` credentials secure with a strong password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Current Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type={showPwd ? "text" : "password"}
                        required
                        value={pwdForm.currentPassword}
                        onChange={(e) =>
                          setPwdForm((p) => ({
                            ...p,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="pl-9 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPwd ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">New Password</Label>
                      <Input
                        type={showPwd ? "text" : "password"}
                        required
                        minLength={6}
                        value={pwdForm.newPassword}
                        onChange={(e) =>
                          setPwdForm((p) => ({
                            ...p,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Min 6 characters"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        Confirm New Password
                      </Label>
                      <Input
                        type={showPwd ? "text" : "password"}
                        required
                        minLength={6}
                        value={pwdForm.confirmPassword}
                        onChange={(e) =>
                          setPwdForm((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    disabled={savingPwd}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    {savingPwd ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
