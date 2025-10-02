/* eslint-disable @next/next/no-img-element */
"use client";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  FiSave,
  FiX,
  FiImage,
  FiPlus,
  FiFolder,
  FiUpload,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";

const CategoryForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: null,
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Clean up previous object URL if exists
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      // Use URL.createObjectURL for better performance and reliability
      const objectUrl = URL.createObjectURL(file);
      console.log("Image preview URL created:", objectUrl);
      setImagePreview(objectUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-indigo-500", "bg-indigo-50");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-indigo-500",
      "bg-indigo-50"
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-indigo-500",
      "bg-indigo-50"
    );

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const event = { target: { files: [file] } };
        handleImageChange(event);
      } else {
        toast.error("Please drop a valid image file");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    // Clean up object URL
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);
    const userInfo = await getUser();

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name.trim());
      formPayload.append("description", formData.description.trim());
      formPayload.append("status", formData.status);
      formPayload.append("userId", userInfo.id);
      formPayload.append("shopId", userInfo.shops._id);

      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      const response = await fetch(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.CATEGORY.CREATE_CATEGORY,
        {
          method: "POST",
          body: formPayload,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save category");
      }

      const data = await response.json();
      toast.success("Category created successfully!");
      router.push("/dashboard/category"); // Redirect to category list page

      // Reset form
      setFormData({
        name: "",
        description: "",
        status: "active",
        image: null,
      });

      // Clean up image preview
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview("");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to create category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create New Category
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Organize your products with categories to improve customer
                experience and store navigation
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow">
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                  Category Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Category Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Category Image
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      (Recommended: 400×400px, Max 2MB)
                    </span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div
                      className={`relative h-40 w-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group
                        ${
                          imagePreview
                            ? "border-indigo-300 bg-indigo-50"
                            : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-25"
                        }`}
                      onClick={triggerFileInput}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <>
                          <div className="h-full w-full rounded-xl overflow-hidden flex items-center justify-center">
                            <img
                              src={imagePreview}
                              alt="Category preview"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                console.error("Failed to load image preview");
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                              <FiUpload className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-xs">Change Image</span>
                            </div>
                          </div>

                          {/* Remove image button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <FiImage className="w-8 h-8 text-gray-400 group-hover:text-indigo-400 mb-2 transition-colors" />
                          <span className="text-sm text-gray-500 group-hover:text-indigo-600 text-center px-4 transition-colors">
                            Drag & drop or click to upload
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

                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow"
                        >
                          <FiUpload className="w-4 h-4 mr-2" />
                          Choose File
                        </button>

                        {formData.image && (
                          <div className="flex items-center justify-between text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center">
                              <FiCheck className="w-4 h-4 mr-2" />
                              Image selected: {formData.image.name}
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

                        <div className="text-xs text-gray-500 space-y-1">
                          <p>✓ Supports: JPG, PNG, WebP</p>
                          <p>✓ Maximum size: 2MB</p>
                          <p>✓ Recommended: 400×400px</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Name */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Category Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white placeholder-gray-400"
                        placeholder="e.g., Electronics, Fashion, Home & Garden"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white placeholder-gray-400 resize-none"
                        placeholder="Describe this category and what products it contains..."
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4 mr-2" />
                        Create Category
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 sticky top-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <FiFolder className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-900">
                  Best Practices
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-sm">
                    <FiImage className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-sm text-indigo-800">
                    Use high-quality, recognizable images that represent the
                    category well
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-sm">
                    <FiPlus className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-sm text-indigo-800">
                    Keep category names clear and concise for better user
                    navigation
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-sm">
                    <FiSave className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-sm text-indigo-800">
                    Organize categories hierarchically for better store
                    structure
                  </span>
                </li>
              </ul>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-indigo-200">
                <div className="text-xs font-medium text-indigo-700 uppercase tracking-wider mb-3">
                  Quick Stats
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-lg font-bold text-indigo-600">2MB</div>
                    <div className="text-xs text-indigo-500">
                      Max Image Size
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-lg font-bold text-indigo-600">
                      400×400
                    </div>
                    <div className="text-xs text-indigo-500">Optimal Size</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
