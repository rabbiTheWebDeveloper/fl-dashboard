/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Globe,
  ImagePlus,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UploadCloud,
  X,
} from "lucide-react";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";
import { getUser, setUser } from "@/lib/auth";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const DELIVERY_PRESETS = ["Inside Dhaka", "Outside Dhaka", "Nationwide"];
const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

export default function ShopInfo({ user, settings }) {
  const router = useRouter();
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [logoPreview, setLogoPreview] = useState(
    settings?.companyLogo?.url || null
  );
  const [faviconPreview, setFaviconPreview] = useState(
    settings?.favicon?.url || null
  );

  const [formData, setFormData] = useState({
    shopAddress: settings?.shopAddress || "",
    phone: settings?.phone || "",
    defaultDeliveryLocation: settings?.defaultDeliveryLocation || "",
    shopInfo: settings?.shopInfo || "",
    metaDescription: settings?.metaDescription || "",
    websiteTitle: settings?.websiteTitle || "",
    description: settings?.description || "",
    companyLogo: null,
    favicon: null,
    domain_verify: settings?.domain_verify || "",
  });

  const [errors, setErrors] = useState({});

  const completion = useMemo(() => {
    const checks = [
      Boolean(formData.websiteTitle.trim()),
      Boolean(formData.phone.trim()),
      Boolean(formData.shopAddress.trim()),
      Boolean(logoPreview),
      Boolean(faviconPreview),
      Boolean(formData.shopInfo.trim() || formData.description.trim()),
      Boolean(formData.metaDescription.trim()),
    ];
    const done = checks.filter(Boolean).length;
    return {
      done,
      total: checks.length,
      percent: Math.round((done / checks.length) * 100),
    };
  }, [formData, logoPreview, faviconPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const processFile = (file, type) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid image format. Please upload PNG, JPG, or WEBP.");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      toast.error("Image must be smaller than 2 MB.");
      return;
    }

    setFormData((prev) => ({ ...prev, [type]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "companyLogo") setLogoPreview(reader.result);
      else setFaviconPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    processFile(file, type);
  };

  const handleClearAsset = (type) => {
    setFormData((prev) => ({ ...prev, [type]: null }));
    if (type === "companyLogo") {
      setLogoPreview(settings?.companyLogo?.url || null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    } else {
      setFaviconPreview(settings?.favicon?.url || null);
      if (faviconInputRef.current) faviconInputRef.current.value = "";
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.shopAddress.trim()) {
      nextErrors.shopAddress = "Shop address is required";
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, "").trim();
    if (!cleanPhone) {
      nextErrors.phone = "Contact phone number is required";
    } else if (!/^\+?\d{6,15}$/.test(cleanPhone)) {
      nextErrors.phone = "Enter a valid phone number (digits only)";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validate()) return;

    if (!user?.userId || !user?.shopId) {
      toast.error("Missing store session. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(
            key,
            typeof value === "string"
              ? key === "phone"
                ? value.replace(/[\s-]/g, "").trim()
                : value.trim()
              : value
          );
        }
      });

      formDataToSend.append("userId", user.userId);
      formDataToSend.append("shopId", user.shopId);

      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/clients/shopinfo-update`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.message || "Failed to update shop settings");
      }

      // Sync updated logo to client user cookie if returned
      const updatedLogoUrl = result?.data?.companyLogo?.url;
      if (updatedLogoUrl) {
        const currentUser = await getUser();
        if (currentUser) {
          setUser({ ...currentUser, shopLogo: updatedLogoUrl });
        }
      }

      toast.success("Shop settings saved successfully!");
      router.refresh();
    } catch (error) {
      console.error("ShopInfo update error:", error);
      toast.error(error?.message || "Failed to update shop settings.");
    } finally {
      setLoading(false);
    }
  };

  const showGeneral = activeTab === "all" || activeTab === "general";
  const showBranding = activeTab === "all" || activeTab === "branding";
  const showSeo = activeTab === "all" || activeTab === "seo";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-7xl mx-auto space-y-6">
      {/* Studio Top Bar */}
      <Card className="rgb-card border-slate-200/80 bg-white/95 shadow-sm py-4 sm:py-5">
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs rounded-lg"
                >
                  <Link href="/dashboard/myshop/manage">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Manage Shop
                  </Link>
                </Button>
                <Badge className="bg-violet-500/10 text-violet-700 border-violet-200 text-[11px]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Store Identity Studio
                </Badge>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 pt-1">
                Shop <span className="rgb-gradient-text">Settings & SEO</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Configure your brand logos, store contact details, delivery defaults, and search appearance.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="submit"
                variant="gradient"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Setup Completion Meter */}
          <div className="rounded-2xl bg-slate-50/90 border border-slate-200/70 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">
                Profile Completeness:{" "}
                <span className="text-violet-700 font-bold">
                  {completion.done}/{completion.total} configured ({completion.percent}%)
                </span>
              </span>
            </div>
            <div className="w-full sm:w-56">
              <Progress value={completion.percent} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Filter Tabs (Swipeable on mobile) */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto scrollbar-hidden -mx-1 px-1">
          <TabsList className="bg-white border border-slate-200/80 p-1 h-auto inline-flex min-w-full sm:min-w-0">
            <TabsTrigger value="all" className="px-4 py-1.5 text-xs sm:text-sm">
              All Settings
            </TabsTrigger>
            <TabsTrigger value="general" className="px-4 py-1.5 text-xs sm:text-sm">
              Contact & Store
            </TabsTrigger>
            <TabsTrigger value="branding" className="px-4 py-1.5 text-xs sm:text-sm">
              Logo & Favicon
            </TabsTrigger>
            <TabsTrigger value="seo" className="px-4 py-1.5 text-xs sm:text-sm">
              SEO & Domain
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Editor Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Store Contact & Profile */}
              {showGeneral && (
                <Card className="border-slate-200/80 bg-white/95">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                          Store Contact & Fulfillment
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Displayed on your storefront footer, invoices, and checkout
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-violet-600" />
                          Support Phone <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="017XXXXXXXX"
                          aria-invalid={Boolean(errors.phone)}
                          className="bg-white"
                        />
                        {errors.phone && (
                          <p className="text-xs text-rose-600">{errors.phone}</p>
                        )}
                      </div>

                      {/* Default Delivery Location */}
                      <div className="space-y-1.5">
                        <Label htmlFor="defaultDeliveryLocation" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <Truck className="w-3.5 h-3.5 text-cyan-600" />
                          Default Delivery Zone
                        </Label>
                        <Input
                          id="defaultDeliveryLocation"
                          name="defaultDeliveryLocation"
                          value={formData.defaultDeliveryLocation}
                          onChange={handleChange}
                          placeholder="e.g. Inside Dhaka"
                          className="bg-white"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {DELIVERY_PRESETS.map((zone) => (
                            <button
                              key={zone}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  defaultDeliveryLocation: zone,
                                }))
                              }
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                                formData.defaultDeliveryLocation === zone
                                  ? "bg-violet-600 text-white border-violet-600"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300"
                              }`}
                            >
                              {zone}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Shop Address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="shopAddress" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Shop / Pickup Address <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="shopAddress"
                        name="shopAddress"
                        value={formData.shopAddress}
                        onChange={handleChange}
                        placeholder="House, Road, Area, City (e.g. Mirpur-10, Dhaka)"
                        aria-invalid={Boolean(errors.shopAddress)}
                        className="bg-white bangla-text"
                      />
                      {errors.shopAddress && (
                        <p className="text-xs text-rose-600">
                          {errors.shopAddress}
                        </p>
                      )}
                    </div>

                    {/* Short Shop Tagline / Info */}
                    <div className="space-y-1.5">
                      <Label htmlFor="shopInfo" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        Short Store Tagline / Notice
                      </Label>
                      <Textarea
                        id="shopInfo"
                        name="shopInfo"
                        rows={2}
                        value={formData.shopInfo}
                        onChange={handleChange}
                        placeholder="Highlight fast delivery, authenticity guarantee, or support hours..."
                        className="bg-white bangla-text"
                      />
                    </div>

                    {/* Full About Description */}
                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-xs sm:text-sm font-semibold text-slate-700">
                        About Your Shop
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell customers your brand story and what makes your products special..."
                        className="bg-white bangla-text"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 2. Brand Assets (Logo & Favicon) */}
              {showBranding && (
                <Card className="border-slate-200/80 bg-white/95">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                        <ImagePlus className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                          Brand Visual Assets
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Upload a crisp header logo and square browser tab icon (PNG, JPG, WEBP · Max 2 MB)
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Company Logo Uploader */}
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 flex flex-col justify-between gap-4 hover:border-violet-400 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Storefront Logo
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Recommended: 210 × 84 px (transparent PNG)
                          </p>
                        </div>
                        {formData.companyLogo && (
                          <button
                            type="button"
                            onClick={() => handleClearAsset("companyLogo")}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            aria-label="Reset logo selection"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="h-28 rounded-xl border border-slate-200 bg-white flex items-center justify-center p-3 overflow-hidden">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Company Logo Preview"
                            className="max-h-20 max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-slate-400">
                            <UploadCloud className="w-7 h-7 mx-auto mb-1 text-violet-400" />
                            <span className="text-xs">No logo uploaded</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={(e) => handleImageUpload(e, "companyLogo")}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full bg-white"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          <UploadCloud className="w-4 h-4 text-violet-600" />
                          {logoPreview ? "Replace Logo" : "Choose Logo"}
                        </Button>
                      </div>
                    </div>

                    {/* Favicon Uploader */}
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 flex flex-col justify-between gap-4 hover:border-cyan-400 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Browser Favicon
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Recommended: 100 × 100 px square icon
                          </p>
                        </div>
                        {formData.favicon && (
                          <button
                            type="button"
                            onClick={() => handleClearAsset("favicon")}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            aria-label="Reset favicon selection"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="h-28 rounded-xl border border-slate-200 bg-white flex items-center justify-center p-3">
                        {faviconPreview ? (
                          <img
                            src={faviconPreview}
                            alt="Favicon Preview"
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-xs"
                          />
                        ) : (
                          <div className="text-center text-slate-400">
                            <Globe className="w-7 h-7 mx-auto mb-1 text-cyan-400" />
                            <span className="text-xs">No favicon uploaded</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          ref={faviconInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={(e) => handleImageUpload(e, "favicon")}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full bg-white"
                          onClick={() => faviconInputRef.current?.click()}
                        >
                          <UploadCloud className="w-4 h-4 text-cyan-600" />
                          {faviconPreview ? "Replace Favicon" : "Choose Favicon"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 3. SEO & Domain Verification */}
              {showSeo && (
                <Card className="border-slate-200/80 bg-white/95">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                          SEO & Domain Ownership
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Optimize how your shop appears on Google, Facebook, and social shares
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Website Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="websiteTitle" className="text-xs sm:text-sm font-semibold text-slate-700">
                          Website Meta Title
                        </Label>
                        <span
                          className={`text-[11px] font-medium ${
                            formData.websiteTitle.length > 60
                              ? "text-amber-600"
                              : "text-slate-400"
                          }`}
                        >
                          {formData.websiteTitle.length}/60
                        </span>
                      </div>
                      <Input
                        id="websiteTitle"
                        name="websiteTitle"
                        value={formData.websiteTitle}
                        onChange={handleChange}
                        placeholder="e.g. Rahman Fashion — Official Online Store"
                        className="bg-white bangla-text"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="metaDescription" className="text-xs sm:text-sm font-semibold text-slate-700">
                          Meta Description
                        </Label>
                        <span
                          className={`text-[11px] font-medium ${
                            formData.metaDescription.length > 160
                              ? "text-amber-600"
                              : "text-slate-400"
                          }`}
                        >
                          {formData.metaDescription.length}/160
                        </span>
                      </div>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        rows={3}
                        value={formData.metaDescription}
                        onChange={handleChange}
                        placeholder="Concise summary shown under your store link in Google search results..."
                        className="bg-white bangla-text"
                      />
                    </div>

                    {/* Domain Verify Meta Tag */}
                    <div className="space-y-1.5">
                      <Label htmlFor="domain_verify" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Facebook / Google Domain Verification Code
                      </Label>
                      <Input
                        id="domain_verify"
                        name="domain_verify"
                        value={formData.domain_verify}
                        onChange={handleChange}
                        placeholder="Paste verification token or meta content value"
                        className="bg-white font-mono text-xs"
                      />
                      <p className="text-[11px] text-slate-400">
                        Used to verify your domain in Meta Business Suite or Google Search Console.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Live Preview Column */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-4">
              {/* Live Google SERP Preview */}
              <Card className="border-slate-200/80 bg-white/95">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Google Search Preview
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      Live SERP
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                        {faviconPreview ? (
                          <img
                            src={faviconPreview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate bangla-text">
                          {formData.websiteTitle || "Your Online Store"}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          https://yourdomain.com
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-blue-700 line-clamp-1 pt-0.5 bangla-text">
                      {formData.websiteTitle || "Shop Official Collection Online"}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bangla-text">
                      {formData.metaDescription ||
                        formData.shopInfo ||
                        "Add a meta description to improve click-through rates from Google and social media."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Live Storefront Identity Card Preview */}
              <Card className="border-slate-200/80 bg-white/95 overflow-hidden py-0 gap-0">
                <div className="px-5 py-3.5 bg-slate-950 text-white flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide">
                    Storefront Card Preview
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Store Logo"
                          className="max-h-8 max-w-[110px] object-contain"
                        />
                      ) : (
                        <Store className="w-5 h-5 text-violet-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate bangla-text">
                        {formData.websiteTitle || "Store Brand"}
                      </p>
                      {formData.defaultDeliveryLocation && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-[10px] bg-cyan-50 text-cyan-700 border-cyan-200"
                        >
                          <Truck className="w-2.5 h-2.5 mr-1" />
                          {formData.defaultDeliveryLocation}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {formData.shopInfo && (
                    <p className="text-xs text-slate-600 bg-violet-50/60 border border-violet-100 rounded-xl p-3 bangla-text">
                      {formData.shopInfo}
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                      <span>{formData.phone || "No phone set"}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="bangla-text">
                        {formData.shopAddress || "No shop address set"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Save Action */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={loading}
                className="w-full rounded-xl font-bold shadow-md"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving Settings...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save All Shop Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
