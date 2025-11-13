"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";

const ShopInfo = ({ user, settings }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Invalid image format. Use png, jpg, or jpeg.");
      return;
    }

    if (type === "companyLogo") {
      setFormData((prev) => ({ ...prev, companyLogo: file }));
    } else if (type === "favicon") {
      setFormData((prev) => ({ ...prev, favicon: file }));
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "companyLogo") setLogoPreview(reader.result);
      else setFaviconPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formDataToSend.append(key, value);
      });

      // Include user and shop IDs
      formDataToSend.append("userId", user.userId);
      formDataToSend.append("shopId", user.shopId);

      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/clients/shopinfo-update`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update");

      toast.success("Shop information updated successfully!");
      router.refresh(); // refresh UI if data is server-rendered
    } catch (error) {
      console.error("Error:", error);
      toast.error(" Failed to update shop info!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">
            Shop Information
          </h2>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-400 rounded-lg hover:bg-indigo-100 transition-all"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Shop Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Address
            </label>
            <input
              name="shopAddress"
              type="text"
              value={formData.shopAddress}
              onChange={handleChange}
              placeholder="Enter your shop address"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Default Delivery Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Delivery Location
            </label>
            <input
              name="defaultDeliveryLocation"
              type="text"
              value={formData.defaultDeliveryLocation}
              onChange={handleChange}
              placeholder="Default delivery location"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Logo (105px × 42px)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleImageUpload(e, "companyLogo")}
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 cursor-pointer"
            />
            {logoPreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  width={105}
                  height={42}
                  className="rounded border"
                />
              </div>
            )}
          </div>

          {/* Favicon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favicon (100px × 100px)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleImageUpload(e, "favicon")}
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 cursor-pointer"
            />
            {faviconPreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                <Image
                  src={faviconPreview}
                  alt="Favicon Preview"
                  width={100}
                  height={100}
                  className="rounded border"
                />
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Info
            </label>
            <textarea
              name="shopInfo"
              value={formData.shopInfo}
              onChange={handleChange}
              placeholder="This will be displayed on your shop profile"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 h-24"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Domain Verify
            </label>
            <input
              name="domain_verify"
              type="text"
              value={formData.domain_verify}
              onChange={handleChange}
              placeholder="domain verify Meta code"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="Displayed on your shop profile"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 h-24"
            ></textarea>
          </div>

          {/* Website Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website Title
            </label>
            <input
              name="websiteTitle"
              type="text"
              value={formData.websiteTitle}
              onChange={handleChange}
              placeholder="Website title"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write about your shop"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 h-28"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg shadow transition-all ${
                loading
                  ? "bg-indigo-600 text-indigo-200 cursor-not-allowed"
                  : "bg-indigo-700 hover:bg-indigo-800 text-indigo-100"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-indigo-100"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Shop Info"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopInfo;
