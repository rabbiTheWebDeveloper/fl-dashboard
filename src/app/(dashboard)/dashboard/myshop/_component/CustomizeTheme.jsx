"use client";

import React, { useState } from "react";
import { Palette, RefreshCw, Save, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { myshopThemeColorUpdateQuaryAction } from "@/app/actions/myshop";
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
];

export default function CustomizeTheme({ user, themeInfo }) {
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState({
    primary: themeInfo?.data?.primary || "#7c3aed",
    secondary: themeInfo?.data?.secondary || "#06b6d4",
    background: themeInfo?.data?.background || "#ffffff",
    text: themeInfo?.data?.text || "#0f172a",
    muted: themeInfo?.data?.muted || "#64748b",
    accent: themeInfo?.data?.accent || "#10b981",
    banner: themeInfo?.data?.banner || "#f5f3ff",
    footer: themeInfo?.data?.footer || "#0f172a",
  });

  const handleColorChange = (key, value) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await myshopThemeColorUpdateQuaryAction({
        ...user,
        ...theme,
      });
      if (response?.status) {
        toast.success("Storefront theme updated successfully!");
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Customize <span className="rgb-gradient-text">Storefront Theme</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pick an RGB preset or fine-tune every storefront color token live.
          </p>
        </div>
        <Button variant="gradient" onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Theme"}
        </Button>
      </div>

      {/* RGB Quick Presets */}
      <Card className="border-slate-200/80 bg-white/95 py-4">
        <CardContent className="px-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            RGB Presets:
          </span>
          {RGB_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setTheme(preset.colors)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50/50 transition-all"
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Color Controls */}
        <Card className="lg:col-span-2 border-slate-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Palette className="w-4 h-4 text-violet-600" />
              Color Tokens
            </CardTitle>
            <CardDescription className="text-xs">
              Click any swatch or enter a HEX value
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {Object.keys(theme).map((key) => (
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
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-8 w-24 font-mono text-xs bg-white"
                  />
                  <input
                    type="color"
                    value={theme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer bg-transparent p-0.5"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Storefront Preview */}
        <Card className="lg:col-span-3 border-slate-200/80 bg-white/95 overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Live Storefront Preview
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time preview of your shop colors
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Interactive Preview
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div style={{ backgroundColor: theme.background, color: theme.text }}>
              {/* Mock Navbar */}
              <div
                className="px-6 py-3.5 flex items-center justify-between text-white"
                style={{ backgroundColor: theme.primary }}
              >
                <span className="font-bold text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  {user?.shops?.shopName || "My Online Store"}
                </span>
                <div className="flex items-center gap-4 text-xs opacity-90">
                  <span>Home</span>
                  <span>Shop</span>
                  <span>Cart (2)</span>
                </div>
              </div>

              {/* Mock Hero Banner */}
              <div
                className="px-6 py-10 text-center space-y-3"
                style={{ backgroundColor: theme.banner, color: theme.text }}
              >
                <span
                  className="inline-block text-[11px] font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  New Season Arrival
                </span>
                <h3 className="text-xl font-extrabold">
                  Discover Featured Products
                </h3>
                <p className="text-xs max-w-md mx-auto" style={{ color: theme.muted }}>
                  Fast nationwide delivery across Bangladesh with Cash on Delivery.
                </p>
              </div>

              {/* Mock Product Grid */}
              <div className="grid grid-cols-2 gap-4 p-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-black/10 p-4 space-y-2 shadow-xs"
                    style={{ backgroundColor: theme.background }}
                  >
                    <div
                      className="h-20 rounded-lg opacity-20"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <p className="text-xs font-bold">Sample Product #{i}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span
                        className="text-xs font-extrabold"
                        style={{ color: theme.primary }}
                      >
                        ৳1,250
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md text-white"
                        style={{ backgroundColor: theme.secondary }}
                      >
                        Buy Now
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock Footer */}
              <div
                className="px-6 py-4 text-center text-xs text-white/90"
                style={{ backgroundColor: theme.footer }}
              >
                © {new Date().getFullYear()} {user?.shops?.shopName || "AMARDokan"} · All rights reserved
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
