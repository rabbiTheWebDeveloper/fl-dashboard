/* eslint-disable @next/next/no-img-element */
"use client";
import { createCategoryAction } from "@/app/actions/category";
import React, { useState } from "react";
import { FiSave, FiX, FiImage, FiPlus, FiFolder } from "react-icons/fi";

const AddCategoryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: null,
    seoTitle: "",
    seoDescription: "",
    isFeatured: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      const formPayload = new FormData();

      // Add text fields
      formPayload.append("name", formData.name);
      formPayload.append("description", formData.description);
      formPayload.append("status", formData.status);
      formPayload.append("seoTitle", formData.seoTitle);
      formPayload.append("seoDescription", formData.seoDescription);
      formPayload.append("isFeatured", formData.isFeatured);

      // Add file if exists
      if (formData.image) {
        formPayload.append("image", formData.image);
      }
      const response = await createCategoryAction(
        formPayload,
        "68d3bf457173ef6699e7dc20",
        874289
      );
      console.log("Category saved:", formData);
      console.log("Category saved:", response);
      // Handle success - redirect or show message
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Category
              </h1>
              <p className="text-gray-600 mt-2">
                Create a new product category for your store
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Category Information
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Category Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category Image
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Category"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <FiImage className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <FiImage className="w-4 h-4 mr-2" />
                        Upload Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: 400x400px PNG, JPG, JPEG (Max 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Electronics, Fashion"
                    />
                  </div>
                </div>

                {/* Status & Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="isFeatured"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mark as Featured Category
                    </label>
                  </div>
                </div>

                {/* SEO Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    SEO Settings
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="seoTitle"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Meta Title
                      </label>
                      <input
                        type="text"
                        id="seoTitle"
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Meta title for search engines"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="seoDescription"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Meta Description
                      </label>
                      <textarea
                        id="seoDescription"
                        name="seoDescription"
                        value={formData.seoDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Meta description for search engines"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4 mr-2" />
                        Save Category
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <FiPlus className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Use clear, high-quality images for better appeal
                </li>
                <li className="flex items-start">
                  <FiFolder className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Organize categories hierarchically for better navigation
                </li>
                <li className="flex items-start">
                  <FiSave className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Optimize SEO fields for better search visibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
