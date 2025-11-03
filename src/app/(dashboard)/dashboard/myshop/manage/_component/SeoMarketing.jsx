"use client";
import { myshopUpdateSeoMarketingQueryAction } from "@/app/actions/myshop";
import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";

const SeoMarketing = ({ user, settings = {} }) => {
  const [formData, setFormData] = useState({
    gtmId: settings?.gtmId || "",
    facebookPixelId: settings?.facebookPixelId || "",
    facebookPixelToken: settings?.facebookPixelToken || "",
    facebookTestEventId: settings?.facebookTestEventId || "",
    tikTokPixelId: settings?.tikTokPixelId || "",
    tikTokPixelToken: settings?.tikTokPixelToken || "",
    tikTokTestEventCode: settings?.tikTokTestEventCode || "",
  });

  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const data = {
        shopId: user?.shopId,
        ...formData,
      };

      const response = await myshopUpdateSeoMarketingQueryAction(data);

      if (response?.status) {
        toast.success("SEO & Marketing settings updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating settings!");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
  }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      />
    </div>
  );

  // Generate dynamic URLs based on user's shopId
  const sitemapUrl = user?.shopId
    ? `https://shop.example.com/api/${user.shopId}/sitemaps.xml`
    : "";

  const facebookFeedUrl = user?.shopId
    ? `https://shop.example.com/api/${user.shopId}/facebook-product-feed.xml`
    : "";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        SEO & Marketing Integrations
      </h2>

      {/* Domain Setup Warning */}
      {!user?.domain_name && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
          To setup <b>GTM</b> or <b>Facebook Pixel</b>, please setup your shop
          domain first.
        </div>
      )}

      {/* Sitemaps Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-2">Sitemaps for Search Engine</h3>
        <p className="text-gray-700 text-sm mb-2">
          Add sitemaps to <b>Google Search Console</b> to help your website rank
          better.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={sitemapUrl}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-gray-100"
            placeholder="Shop ID required"
          />
          <button
            onClick={() => handleCopy(sitemapUrl)}
            disabled={!user?.shopId}
            className={`px-3 py-2 rounded-lg text-white transition ${
              !user?.shopId
                ? "bg-gray-400 cursor-not-allowed"
                : copiedLink === sitemapUrl
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {copiedLink === sitemapUrl ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Facebook Data Feed */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-2">Facebook Data Feed</h3>
        <p className="text-gray-700 text-sm mb-2">
          Add or upload your product feed to the <b>Facebook Catalog</b>.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={facebookFeedUrl}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-gray-100"
            placeholder="Shop ID required"
          />
          <button
            onClick={() => handleCopy(facebookFeedUrl)}
            disabled={!user?.shopId}
            className={`px-3 py-2 rounded-lg text-white transition ${
              !user?.shopId
                ? "bg-gray-400 cursor-not-allowed"
                : copiedLink === facebookFeedUrl
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {copiedLink === facebookFeedUrl ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* GTM Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Setup Google Tag Manager</h3>
        <InputField
          label="GTM ID"
          placeholder="e.g. GTM-XXXXXX"
          value={formData.gtmId}
          onChange={(val) => handleChange("gtmId", val)}
        />
      </div>

      {/* Facebook Pixel Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Setup Facebook Conversion API and Pixel
        </h3>
        <InputField
          label="Pixel ID"
          placeholder="Enter Pixel ID"
          value={formData.facebookPixelId}
          onChange={(val) => handleChange("facebookPixelId", val)}
        />
        <InputField
          label="Pixel Access Token"
          placeholder="Enter Pixel Access Token"
          value={formData.facebookPixelToken}
          onChange={(val) => handleChange("facebookPixelToken", val)}
        />
        <InputField
          label="Pixel Test Event ID"
          placeholder="Enter Test Event ID (for testing only)"
          value={formData.facebookTestEventId}
          onChange={(val) => handleChange("facebookTestEventId", val)}
        />
      </div>

      {/* TikTok Pixel Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Setup TikTok Pixel and Events API
        </h3>
        <InputField
          label="TikTok Pixel ID"
          placeholder="Enter TikTok Pixel ID"
          value={formData.tikTokPixelId}
          onChange={(val) => handleChange("tikTokPixelId", val)}
        />
        <InputField
          label="TikTok Access Token"
          placeholder="Enter TikTok Access Token"
          value={formData.tikTokPixelToken}
          onChange={(val) => handleChange("tikTokPixelToken", val)}
        />
        <InputField
          label="TikTok Test Event Code"
          placeholder="Enter Test Event Code (for testing only)"
          value={formData.tikTokTestEventCode}
          onChange={(val) => handleChange("tikTokTestEventCode", val)}
        />
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Updating..." : "Update Settings"}
      </button>
    </div>
  );
};

export default SeoMarketing;
