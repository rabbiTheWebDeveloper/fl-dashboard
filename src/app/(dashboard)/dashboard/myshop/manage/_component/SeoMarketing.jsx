"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { myshopUpdateSeoMarketingQueryAction } from "@/app/actions/myshop";

const ShopInfoWithSeo = ({ user, settings = {} }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // SEO & Marketing
    gtmId: settings?.gtmId || "",
    gtmAnalytics: settings?.gtmAnalytics || "",
    facebookPixelId: settings?.facebookPixelId || "",
    facebookPixelToken: settings?.facebookPixelToken || "",
    facebookTestEventId: settings?.facebookTestEventId || "",
    tikTokPixelId: settings?.tikTokPixelId || "",
    tikTokPixelToken: settings?.tikTokPixelToken || "",
    tikTokTestEventCode: settings?.tikTokTestEventCode || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...user,
        ...formData,
      };
      const response = await myshopUpdateSeoMarketingQueryAction(data);

      if (response?.status) {
        toast.success("SEO & Marketing info updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          Shop SEO Settings
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SEO & MARKETING SECTION */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              SEO & Marketing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Tag Manager ID
                </label>
                <input
                  name="gtmId"
                  value={formData.gtmId}
                  onChange={handleChange}
                  placeholder="e.g., GTM-XXXXXXX"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Tag Manager Analytics
                </label>
                <input
                  name="gtmAnalytics"
                  value={formData.gtmAnalytics}
                  onChange={handleChange}
                  placeholder="e.g., GTM-XXXXXXX"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Pixel ID
                </label>
                <input
                  name="facebookPixelId"
                  value={formData.facebookPixelId}
                  onChange={handleChange}
                  placeholder="Enter Pixel ID"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Pixel Token
                </label>
                <input
                  name="facebookPixelToken"
                  value={formData.facebookPixelToken}
                  onChange={handleChange}
                  placeholder="Enter Access Token"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Test Event ID
                </label>
                <input
                  name="facebookTestEventId"
                  value={formData.facebookTestEventId}
                  onChange={handleChange}
                  placeholder="Enter Test Event ID"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok Pixel ID
                </label>
                <input
                  name="tikTokPixelId"
                  value={formData.tikTokPixelId}
                  onChange={handleChange}
                  placeholder="Enter TikTok Pixel ID"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok Pixel Token
                </label>
                <input
                  name="tikTokPixelToken"
                  value={formData.tikTokPixelToken}
                  onChange={handleChange}
                  placeholder="Enter TikTok Token"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok Test Event Code
                </label>
                <input
                  name="tikTokTestEventCode"
                  value={formData.tikTokTestEventCode}
                  onChange={handleChange}
                  placeholder="Enter TikTok Test Code"
                  className="w-full border border-indigo-400 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg shadow transition-all ${
                loading
                  ? "bg-indigo-400 text-indigo-100 cursor-not-allowed"
                  : "bg-indigo-700 hover:bg-indigo-800 text-white"
              }`}
            >
              {loading ? "Updating..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopInfoWithSeo;
