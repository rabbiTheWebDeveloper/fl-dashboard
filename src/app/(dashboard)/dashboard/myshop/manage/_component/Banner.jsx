"use client";
import React, { use, useEffect, useState } from "react";
import {
  X,
  PlusCircle,
  Upload,
  ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";
import { useRouter } from "next/navigation";

const Banner = ({ user, banner }) => {
  const [slider, setSlider] = useState({
    ...banner,
  });
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle image upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (PNG, JPG, JPEG)");
        return;
      }
      setNewImage(file);
    }
  };

  // Upload new image
  const handleAddImage = async () => {
    if (!newImage) return toast.error("Please select an image!");
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", newImage);
      formData.append("userId", user.userId);
      formData.append("shopId", user.shopId);

      const res = await fetch(`${API_ENDPOINTS.BASE_URL}/banner/addBanner`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        router.refresh();
        toast.success("Image added successfully!");
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-2">
              <ImageIcon className="h-4 w-4" />
              Home Slider Management
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Slider Images
            </h1>
          </div>
          <button
            onClick={() => window.location.reload()}
            // disabled={loading}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 mt-4 sm:mt-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Upload Guidelines
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              • Maximum <b>3 images</b> allowed
            </p>
            <p>
              • Supported formats: <b>PNG, JPG, JPEG</b>
            </p>
            <p>
              • Recommended size: <b>1298px × 482px</b>
            </p>
            <p>• Add optional link for each image</p>
          </div>
        </div>

        {/* Current Images Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Slider Images ({slider.images?.length || 0}/3)
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : slider.images?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No slider images yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload your first image to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slider.images?.map((img, index) => (
                <div
                  key={img._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-[1298/482] overflow-hidden">
                    <img
                      src={img.url}
                      alt={`slider-${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />

                    {/* Image Number Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Upload Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Add New Image
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Image
              </label>
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  newImage
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {newImage ? (
                    <>
                      <ImageIcon className="h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-green-700">
                        {newImage.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-600">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          {/* Add Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddImage}
              //   disabled={!newImage || uploading || slider.images?.length >= 3}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Add Image
                </>
              )}
            </button>
          </div>
        </div>
        {/* Status Bar */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                slider.images?.length >= 3 ? "bg-red-500" : "bg-green-500"
              }`}
            />
            {slider.images?.length || 0}/3 images uploaded
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
