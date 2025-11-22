"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { myshopThemeColorUpdateQuaryAction } from "@/app/actions/myshop";

export default function CustomizeTheme({ user, themeInfo }) {
  const [theme, setTheme] = useState({
    primary: themeInfo?.data?.primary || "#3b82f6",
    secondary: themeInfo?.data?.secondary || "#f59e0b",
    background: themeInfo?.data?.background || "#ffffff",
    text: themeInfo?.data?.text || "#1f2937",
    muted: themeInfo?.data?.muted || "#6b7280",
    accent: themeInfo?.data?.accent || "#10b981",
    banner: themeInfo?.data?.banner || "#e2e8f0",
    footer: themeInfo?.data?.footer || "#1e293b",
  });

  const handleColorChange = (key, value) => {
    setTheme({ ...theme, [key]: value });
  };

  const handleSave = async () => {
    try {
      const formData = {
        ...user,
        ...theme,
      };
      const response = await myshopThemeColorUpdateQuaryAction(formData);
      if (response.status) {
        toast.success("Theme updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "An error occurred while updating the theme."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        🎨 Customize Theme
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Color selectors */}
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle>Theme Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(theme).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <Label className="capitalize">{key} color</Label>
                  <Input
                    type="color"
                    value={theme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-24 h-10 p-0 border-none cursor-pointer"
                  />
                </div>
                <div
                  className="w-12 h-12 rounded-md border shadow-inner"
                  style={{ backgroundColor: theme[key] }}
                ></div>
              </div>
            ))}

            <button
              onClick={handleSave}
              className="w-full mt-4 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              💾 Save Theme
            </button>
          </CardContent>
        </Card>

        {/* Right side - Live preview */}
        <Card className="border shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Header */}
            <div
              className="text-center text-white py-3 font-medium"
              style={{ backgroundColor: theme.primary }}
            >
              Navbar / Header
            </div>

            {/* Banner */}
            <div
              className="py-12 text-center text-lg font-semibold"
              style={{
                backgroundColor: theme.banner,
                color: theme.text,
              }}
            >
              🖼️ Banner Section
            </div>

            {/* Product section */}
            <div
              className="grid grid-cols-2 gap-4 p-4"
              style={{ backgroundColor: theme.background }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 text-center font-medium shadow"
                  style={{
                    backgroundColor: theme.secondary,
                    color: theme.text,
                  }}
                >
                  Product {i}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="text-center py-4 text-white"
              style={{ backgroundColor: theme.footer }}
            >
              Footer Section
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
