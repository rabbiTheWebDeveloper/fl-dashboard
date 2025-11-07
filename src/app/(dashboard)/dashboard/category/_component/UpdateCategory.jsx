/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiSave,
  FiX,
  FiImage,
  FiUpload,
  FiCheck,
  FiFolder,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";

const UpdateCategory = ({ user, category, categoryId }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(category.image || "");
  const [formData, setFormData] = useState({
    name: category.name || "",
    status: category.status || "active",
    image: category.image || null,
  });

  // 🧹 Cleanup image URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // 📝 Handle input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 Handle image upload or drop
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setFormData((prev) => ({ ...prev, image: file }));
  };

  // 🖱️ Click file input manually
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ❌ Remove image
  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 📨 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name.trim());
      formPayload.append("status", formData.status);
      formPayload.append("userId", user.userId);
      formPayload.append("shopId", user.shopId);

      if (formData.image && typeof formData.image !== "string") {
        formPayload.append("image", formData.image);
      } else {
        formPayload.append("image", category.image);
      }

      const res = await fetch(
        `${API_ENDPOINTS.BASE_URL}/category/update/${categoryId}`,
        {
          method: "PATCH",
          body: formPayload,
        }
      );

      if (!res.ok) throw new Error("Failed to update category");

      toast.success("Category updated successfully!");
      router.push("/dashboard/category");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to update category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Update Category
            </h1>
            <p className="text-gray-600 mt-2">
              Update the category details and image below
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/category")}
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
          >
            <FiX className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Category Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Category Image{" "}
                  <span className="text-xs text-gray-500 ml-2">
                    (400×400px, Max 2MB)
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div
                    className={`relative h-40 w-40 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 group ${
                      imagePreview
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-25"
                    }`}
                    onClick={triggerFileInput}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Category preview"
                          className="h-full w-full object-contain rounded-xl"
                        />
                        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-xl transition-all">
                          <div className="opacity-0 group-hover:opacity-100 text-white text-sm">
                            <FiUpload className="w-6 h-6 mx-auto mb-1" />
                            Change Image
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <FiImage className="w-8 h-8 text-gray-400 group-hover:text-indigo-400 mb-2" />
                        <span className="text-sm text-gray-500 group-hover:text-indigo-600">
                          Click to upload
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                    >
                      <FiUpload className="w-4 h-4 mr-2" />
                      Choose File
                    </button>

                    {formData.image && typeof formData.image !== "string" && (
                      <div className="flex items-center justify-between text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center">
                          <FiCheck className="w-4 h-4 mr-2" />
                          {formData.image.name}
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                      placeholder="e.g., Saree, Electronics, Fashion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/category")}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4 mr-2" />
                      Update Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar (tips) */}
          <div className="lg:col-span-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 sticky top-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <FiFolder className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">
                Best Practices
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-indigo-800">
              <li className="flex items-start">
                <FiImage className="w-4 h-4 mr-2 mt-0.5 text-indigo-600" />
                Use clear, recognizable images for categories
              </li>
              <li className="flex items-start">
                <FiPlus className="w-4 h-4 mr-2 mt-0.5 text-indigo-600" />
                Keep category names short and simple
              </li>
              <li className="flex items-start">
                <FiSave className="w-4 h-4 mr-2 mt-0.5 text-indigo-600" />
                Organize categories for easy navigation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
