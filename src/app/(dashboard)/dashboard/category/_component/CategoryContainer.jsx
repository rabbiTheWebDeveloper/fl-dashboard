/* eslint-disable @next/next/no-img-element */
"use client";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiX,
  FiSave,
  FiImage,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { toast } from "react-toastify";

const CategoryContainer = ({ category }) => {
  const [categories, setCategories] = useState([...category]);
  const [filteredCategories, setFilteredCategories] = useState([...category]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: null,
    parentCategory: "",
    seoTitle: "",
    seoDescription: "",
  });
  useEffect(() => {
    let result = categories;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((category) => category.status === statusFilter);
    }

    setFilteredCategories(result);
  }, [searchTerm, statusFilter, categories]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      status: "active",
      image: null,
      parentCategory: "",
      seoTitle: "",
      seoDescription: "",
    });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status,
      image: category.image,
      parentCategory: "",
      seoTitle: "",
      seoDescription: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

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
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingCategory) {
        // Update existing category
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, ...formData } : cat
          )
        );
      } else {
        // Add new category
        const newCategory = {
          id: categories.length + 1,
          ...formData,
          productsCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setCategories((prev) => [...prev, newCategory]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.DELETE_CATEGORY}/${categoryId}`,
          { method: "DELETE" }
        );

        if (!res.ok) throw new Error("Failed to delete category");

        setCategories(
          (prev) => prev.filter((category) => category._id !== categoryId) // use _id (Mongo) not id
        );

        toast.success("Category deleted successfully ✅");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category ❌");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleStatus = async (category) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === category.id
            ? {
                ...cat,
                status: cat.status === "active" ? "inactive" : "active",
              }
            : cat
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-600">
              Manage your product categories and organization
            </p>
          </div>
          <Link
            href="/dashboard/category/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Category
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiPlus className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter((cat) => cat.status === "active").length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiEye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Inactive Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter((cat) => cat.status === "inactive").length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <FiEyeOff className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.productsCount, 0)}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiImage className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={category.image || "/images/placeholder.jpg"}
                          alt={category.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {category.productsCount} products
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(category)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        category.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/category/add?edit=${category._id}`}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No categories found</div>
            <Link
              href="/dashboard/category/add"
              className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Add your first category
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryContainer;
