"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  LayoutGrid,
  Palette,
  PanelLeft,
  PanelRight,
  PanelTop,
  RefreshCw,
  Save,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import { myshopThemeColorUpdateQuaryAction } from "@/app/actions/myshop";
import { getUser } from "@/lib/auth";
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

const RGB_PRESETS = [
  {
    name: "Cyber Violet",
    colors: {
      primary: "#7c3aed",
      secondary: "#ec4899",
      background: "#ffffff",
      text: "#0f172a",
      muted: "#64748b",
      accent: "#06b6d4",
      banner: "#f5f3ff",
      footer: "#0f172a",
    },
  },
  {
    name: "Ocean Cyan",
    colors: {
      primary: "#0284c7",
      secondary: "#06b6d4",
      background: "#ffffff",
      text: "#0f172a",
      muted: "#64748b",
      accent: "#10b981",
      banner: "#ecfeff",
      footer: "#082f49",
    },
  },
  {
    name: "Emerald Luxe",
    colors: {
      primary: "#059669",
      secondary: "#f59e0b",
      background: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
      accent: "#14b8a6",
      banner: "#ecfdf5",
      footer: "#064e3b",
    },
  },
  {
    name: "Sunset Rose",
    colors: {
      primary: "#e11d48",
      secondary: "#f97316",
      background: "#ffffff",
      text: "#18181b",
      muted: "#71717a",
      accent: "#8b5cf6",
      banner: "#fff1f2",
      footer: "#18181b",
    },
  },
  {
    name: "Midnight Gold",
    colors: {
      primary: "#1e293b",
      secondary: "#d97706",
      background: "#f8fafc",
      text: "#0f172a",
      muted: "#64748b",
      accent: "#f59e0b",
      banner: "#fef3c7",
      footer: "#090d16",
    },
  },
];

const DEFAULT_SECTIONS = [
  "hero",
  "categories",
  "featured",
  "banners",
  "allProducts",
];

const SECTION_LABELS = {
  hero: "Hero Slider / Welcome Banner",
  categories: "Category Navigation Strip",
  featured: "Featured / Best-Seller Products",
  banners: "Promotional Campaign Banners",
  allProducts: "Main Product Catalog & Filters",
};

const COLOR_KEYS = [
  "primary",
  "secondary",
  "accent",
  "background",
  "banner",
  "text",
  "muted",
  "footer",
];

export default function CustomizeTheme({ user, themeInfo }) {
  const [saving, setSaving] = useState(false);
  const [shopSlug, setShopSlug] = useState("");
  const [shopName, setShopName] = useState("My Online Store");

  useEffect(() => {
    getUser().then((u) => {
      if (u?.shops?.shopSlug) setShopSlug(u.shops.shopSlug);
      if (u?.shops?.shopName) setShopName(u.shops.shopName);
    });
  }, []);

  const initialData = themeInfo?.data || {};

  const [theme, setTheme] = useState({
    primary: initialData.primary || "#7c3aed",
    secondary: initialData.secondary || "#06b6d4",
    background: initialData.background || "#ffffff",
    text: initialData.text || "#0f172a",
    muted: initialData.muted || "#64748b",
    accent: initialData.accent || "#10b981",
    banner: initialData.banner || "#f5f3ff",
    footer: initialData.footer || "#0f172a",
    layoutPosition: initialData.layoutPosition || "top-filter",
    productGridCols: Number(initialData.productGridCols) || 4,
    productCardStyle: initialData.productCardStyle || "modern",
    cardContentAlign: initialData.cardContentAlign || "left",
    sectionOrder:
      Array.isArray(initialData.sectionOrder) &&
      initialData.sectionOrder.length > 0
        ? initialData.sectionOrder
        : DEFAULT_SECTIONS,
  });

  const handleFieldChange = (key, value) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const applyColorPreset = (colors) => {
    setTheme((prev) => ({ ...prev, ...colors }));
  };

  const moveSection = (index, direction) => {
    const nextOrder = [...theme.sectionOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextOrder.length) return;
    [nextOrder[index], nextOrder[targetIndex]] = [
      nextOrder[targetIndex],
      nextOrder[index],
    ];
    setTheme((prev) => ({ ...prev, sectionOrder: nextOrder }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await myshopThemeColorUpdateQuaryAction({
        ...user,
        ...theme,
      });
      if (response?.status) {
        toast.success("Storefront colors & product layout saved!");
      } else {
        toast.error(response?.message || "Could not update theme.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "An error occurred while updating theme.");
    } finally {
      setSaving(false);
    }
  };

  const previewStoreHref = shopSlug ? `/shop/${shopSlug}` : "/shop";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Storefront <span className="rgb-gradient-text">Theme & Layout Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Customize brand colors, product grid columns, filter sidebar position, and section order.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-initial">
            <Link href={previewStoreHref} target="_blank">
              <ExternalLink className="w-4 h-4" />
              Live Store
            </Link>
          </Button>
          <Button
            variant="gradient"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-initial"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      </div>

      {/* RGB Presets Strip */}
      <Card className="border-slate-200/80 bg-white/95 py-3.5">
        <CardContent className="px-4 sm:px-6 flex items-center gap-2.5 overflow-x-auto scrollbar-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 shrink-0 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            Quick Themes:
          </span>
          {RGB_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyColorPreset(preset.colors)}
              className="app-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50/50 transition-colors shrink-0"
            >
              <span className="flex -space-x-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white"
                  style={{ backgroundColor: preset.colors.primary }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white"
                  style={{ backgroundColor: preset.colors.secondary }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white"
                  style={{ backgroundColor: preset.colors.accent }}
                />
              </span>
              {preset.name}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls (Colors + Product Position & Layout) */}
        <div className="lg:col-span-5">
          <Tabs defaultValue="colors" className="space-y-4">
            <TabsList className="w-full grid grid-cols-2 bg-white border border-slate-200/80 p-1 h-auto">
              <TabsTrigger value="colors" className="py-2 text-xs sm:text-sm gap-1.5">
                <Palette className="w-4 h-4" />
                Brand Colors
              </TabsTrigger>
              <TabsTrigger value="layout" className="py-2 text-xs sm:text-sm gap-1.5">
                <LayoutGrid className="w-4 h-4" />
                Product Position
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors">
              <Card className="border-slate-200/80 bg-white/95">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-900">
                    Storefront Color Tokens
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Applied automatically across `/shop/{shopSlug || "your-store"}`
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {COLOR_KEYS.map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2"
                    >
                      <Label className="capitalize text-xs font-semibold text-slate-700">
                        {key}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={theme[key]}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="h-8 w-24 font-mono text-xs bg-white"
                        />
                        <input
                          type="color"
                          value={theme[key]}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer bg-transparent p-0.5"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product Position & Layout Tab */}
            <TabsContent value="layout" className="space-y-4">
              <Card className="border-slate-200/80 bg-white/95">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-900">
                    Filter & Product Catalog Position
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Choose how categories and products are arranged on your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Layout Position */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">
                      Category Filter Position
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: "top-filter",
                          label: "Top Bar",
                          icon: PanelTop,
                        },
                        {
                          id: "sidebar-left",
                          label: "Left Sidebar",
                          icon: PanelLeft,
                        },
                        {
                          id: "sidebar-right",
                          label: "Right Sidebar",
                          icon: PanelRight,
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const active = theme.layoutPosition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleFieldChange("layoutPosition", opt.id)
                            }
                            className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                              active
                                ? "border-violet-600 bg-violet-50 text-violet-700 shadow-xs"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desktop Columns */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">
                      Desktop Product Columns
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { cols: 2, label: "2 Columns", sub: "Editorial" },
                        { cols: 3, label: "3 Columns", sub: "Balanced" },
                        { cols: 4, label: "4 Columns", sub: "Marketplace" },
                      ].map((item) => {
                        const active = theme.productGridCols === item.cols;
                        return (
                          <button
                            key={item.cols}
                            type="button"
                            onClick={() =>
                              handleFieldChange("productGridCols", item.cols)
                            }
                            className={`rounded-xl border p-2.5 text-center transition-all ${
                              active
                                ? "border-violet-600 bg-violet-50 text-violet-700 shadow-xs"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <p className="text-xs font-bold">{item.label}</p>
                            <p className="text-[10px] opacity-75">{item.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Style + Alignment */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-700">
                        Product Card Style
                      </Label>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: "modern", label: "Modern Shadow" },
                          { id: "bordered", label: "Crisp Bordered" },
                          { id: "minimal", label: "Clean Minimal" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              handleFieldChange("productCardStyle", s.id)
                            }
                            className={`rounded-lg border px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                              theme.productCardStyle === s.id
                                ? "border-violet-600 bg-violet-50 text-violet-700 font-semibold"
                                : "border-slate-200 bg-white text-slate-600"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-700">
                        Card Text Align
                      </Label>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: "left", label: "Left Aligned" },
                          { id: "center", label: "Centered" },
                        ].map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() =>
                              handleFieldChange("cardContentAlign", a.id)
                            }
                            className={`rounded-lg border px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                              theme.cardContentAlign === a.id
                                ? "border-violet-600 bg-violet-50 text-violet-700 font-semibold"
                                : "border-slate-200 bg-white text-slate-600"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section Order Position */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <Label className="text-xs font-semibold text-slate-700">
                      Homepage Section Order (Move Up / Down)
                    </Label>
                    <div className="space-y-1.5">
                      {theme.sectionOrder.map((secKey, idx) => (
                        <div
                          key={secKey}
                          className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 text-xs"
                        >
                          <span className="font-semibold text-slate-700">
                            {idx + 1}. {SECTION_LABELS[secKey] || secKey}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveSection(idx, -1)}
                              className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                              aria-label="Move section up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === theme.sectionOrder.length - 1}
                              onClick={() => moveSection(idx, 1)}
                              className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                              aria-label="Move section down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Live Storefront Interactive Preview */}
        <Card className="lg:col-span-7 border-slate-200/80 bg-white/95 overflow-hidden lg:sticky lg:top-4">
          <CardHeader className="border-b border-slate-100 py-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Live Storefront Preview
                </CardTitle>
                <CardDescription className="text-xs">
                  {theme.layoutPosition.replace("-", " ")} · {theme.productGridCols} cols ·{" "}
                  {theme.productCardStyle} cards
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Real-Time Layout & Color Preview
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div
              className="transition-colors duration-200"
              style={{ backgroundColor: theme.background, color: theme.text }}
            >
              {/* Mock Store Header */}
              <div
                className="px-5 py-3.5 flex items-center justify-between text-white"
                style={{ backgroundColor: theme.primary }}
              >
                <span className="font-bold text-sm flex items-center gap-2 bangla-text">
                  <ShoppingBag className="w-4 h-4" />
                  {shopName}
                </span>
                <div className="flex items-center gap-3 text-xs opacity-95">
                  <span>All Products</span>
                  <span
                    className="px-2.5 py-1 rounded-full font-semibold text-[11px]"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    Cart (2)
                  </span>
                </div>
              </div>

              {/* Render Sections in Merchant's Chosen Order */}
              <div className="p-5 space-y-5">
                {theme.sectionOrder.map((sec) => {
                  if (sec === "hero") {
                    return (
                      <div
                        key="hero"
                        className="rounded-2xl px-5 py-7 text-center space-y-2"
                        style={{
                          backgroundColor: theme.banner,
                          color: theme.text,
                        }}
                      >
                        <span
                          className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: theme.accent }}
                        >
                          Flash Collection
                        </span>
                        <h3 className="text-lg font-extrabold">
                          Upgrade Your Everyday Style
                        </h3>
                        <p
                          className="text-xs max-w-md mx-auto"
                          style={{ color: theme.muted }}
                        >
                          Fast nationwide delivery with Cash on Delivery.
                        </p>
                      </div>
                    );
                  }

                  if (sec === "categories" && theme.layoutPosition === "top-filter") {
                    return (
                      <div key="categories" className="flex gap-2 overflow-x-auto pb-1">
                        {["All", "New Arrivals", "Best Sellers", "Accessories"].map(
                          (c, idx) => (
                            <span
                              key={c}
                              className="px-3 py-1 rounded-full text-[11px] font-semibold border shrink-0"
                              style={
                                idx === 0
                                  ? {
                                      backgroundColor: theme.primary,
                                      color: "#fff",
                                      borderColor: theme.primary,
                                    }
                                  : {
                                      borderColor: "rgba(148,163,184,0.35)",
                                      color: theme.muted,
                                    }
                              }
                            >
                              {c}
                            </span>
                          )
                        )}
                      </div>
                    );
                  }

                  if (sec === "featured") {
                    return (
                      <div key="featured" className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-extrabold uppercase tracking-wider">
                            Featured Picks
                          </p>
                          <span
                            className="text-[10px] font-bold"
                            style={{ color: theme.accent }}
                          >
                            Hot Deals
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[1, 2].map((n) => (
                            <div
                              key={n}
                              className="rounded-xl p-3 flex items-center gap-3 border border-black/10"
                            >
                              <div
                                className="w-11 h-11 rounded-lg shrink-0 opacity-25"
                                style={{ backgroundColor: theme.accent }}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate">
                                  Featured Item #{n}
                                </p>
                                <p
                                  className="text-xs font-extrabold"
                                  style={{ color: theme.primary }}
                                >
                                  ৳1,490
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sec === "banners") {
                    return (
                      <div
                        key="banners"
                        className="rounded-xl px-4 py-3 text-white flex items-center justify-between text-xs font-bold"
                        style={{
                          background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                        }}
                      >
                        <span>Free Delivery on Orders Over ৳2,000!</span>
                        <span className="underline">Shop Now →</span>
                      </div>
                    );
                  }

                  if (sec === "allProducts") {
                    const gridClass =
                      theme.productGridCols === 2
                        ? "grid-cols-2"
                        : theme.productGridCols === 3
                        ? "grid-cols-2 sm:grid-cols-3"
                        : "grid-cols-2 sm:grid-cols-4";

                    const cardBorderClass =
                      theme.productCardStyle === "modern"
                        ? "shadow-md border border-black/5 rounded-2xl"
                        : theme.productCardStyle === "bordered"
                        ? "border-2 border-black/15 rounded-xl"
                        : "border border-transparent rounded-lg";

                    return (
                      <div
                        key="allProducts"
                        className={`flex gap-4 ${
                          theme.layoutPosition === "sidebar-right"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        {theme.layoutPosition !== "top-filter" && (
                          <div className="w-28 shrink-0 rounded-xl border border-black/10 p-2.5 space-y-1.5 text-[11px]">
                            <p className="font-bold pb-1 border-b border-black/10">
                              Categories
                            </p>
                            {["All Items", "Apparel", "Gadgets", "Sale"].map(
                              (c, i) => (
                                <div
                                  key={c}
                                  className="px-2 py-1 rounded-md font-medium"
                                  style={
                                    i === 0
                                      ? {
                                          backgroundColor: theme.primary,
                                          color: "#fff",
                                        }
                                      : { color: theme.muted }
                                  }
                                >
                                  {c}
                                </div>
                              )
                            )}
                          </div>
                        )}

                        <div className={`flex-1 grid ${gridClass} gap-3`}>
                          {Array.from({ length: theme.productGridCols }).map(
                            (_, i) => (
                              <div
                                key={i}
                                className={`p-3 space-y-2 ${cardBorderClass} ${
                                  theme.cardContentAlign === "center"
                                    ? "text-center"
                                    : "text-left"
                                }`}
                              >
                                <div
                                  className="h-16 rounded-lg opacity-20"
                                  style={{ backgroundColor: theme.primary }}
                                />
                                <p className="text-xs font-bold truncate">
                                  Product #{i + 1}
                                </p>
                                <p
                                  className="text-xs font-extrabold"
                                  style={{ color: theme.primary }}
                                >
                                  ৳990
                                </p>
                                <div
                                  className="w-full py-1 rounded-md text-[10px] font-bold text-white text-center"
                                  style={{ backgroundColor: theme.secondary }}
                                >
                                  Order Now
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Mock Footer */}
              <div
                className="px-5 py-3.5 text-center text-xs text-white/90"
                style={{ backgroundColor: theme.footer }}
              >
                © {new Date().getFullYear()} {shopName} · Powered by AMARDokan
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
