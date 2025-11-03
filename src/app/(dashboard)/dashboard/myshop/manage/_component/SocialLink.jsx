"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";
import { myshopUpdateSocialLinkQueryAction } from "@/app/actions/myshop";

const SocialLink = ({ user, socialLinkInfo }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    facebook: socialLinkInfo?.facebook || "",
    instagram: socialLinkInfo?.instagram || "",
    twitter: socialLinkInfo?.twitter || "",
    linkedin: socialLinkInfo?.linkedin || "",
    youtube: socialLinkInfo?.youtube || "",
    whatsapp: socialLinkInfo?.whatsapp || "",
  });

  // Handle Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...user,
        ...formData,
      };
      const response = await myshopUpdateSocialLinkQueryAction(payload);
      if (response?.status) {
        toast.success("Social links updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update social links!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">
            Social Media Links
          </h2>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-400 rounded-lg hover:bg-indigo-100 transition-all"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook URL
            </label>
            <input
              name="facebook"
              type="url"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/yourpage"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram URL
            </label>
            <input
              name="instagram"
              type="url"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/yourpage"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Twitter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter URL
            </label>
            <input
              name="twitter"
              type="url"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/yourpage"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <input
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/yourpage"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL
            </label>
            <input
              name="youtube"
              type="url"
              value={formData.youtube}
              onChange={handleChange}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number (with country code)
            </label>
            <input
              name="whatsapp"
              type="text"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
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
                "Update Social Links"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialLink;
