"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Store,
  Key,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  Save,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";
import { userPasswordChangeAction } from "@/app/actions/user";

const Setting = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    shopName: user?.shops?.shopName || "",
    shopId: user?.shops?.shopId || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Updating profile:", userData);
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    try {
      const data = {
        userId: user?.id,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      const response = await userPasswordChangeAction(data);

      if (response?.status) {
        toast.success("Password updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.message || "An error occurred while updating password."
      );
    } finally {
      setLoading(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile and security settings
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-8 py-4 font-medium transition-all duration-200 ${
                activeTab === "profile"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <User className="h-5 w-5" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-3 px-8 py-4 font-medium transition-all duration-200 ${
                activeTab === "password"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Shield className="h-5 w-5" />
              Password & Security
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="p-8">
              <div className="flex items-start gap-8">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="h-10 w-10 text-indigo-600" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 group-hover:scale-110">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Form Section */}
                <div className="flex-1">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userData.fullName}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Shop Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Store className="h-4 w-4 text-gray-400" />
                          Shop Name
                        </label>
                        <input
                          type="text"
                          value={userData.shopName}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              shopName: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bangla-text"
                        />
                      </div>
                    </div>

                    {/* Shop ID (Read-only) */}
                    <div className="max-w-xs">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Shop ID
                      </label>
                      <div className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-600">
                        {userData.shopId}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Shop ID cannot be changed
                      </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      {/* <button
                        type="submit"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Password & Security Tab Content */}
          {activeTab === "password" && (
            <div className="p-8">
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Change Password
                  </h3>
                  <p className="text-gray-600">
                    Update your password to keep your account secure
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-400" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter your current password"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter your new password"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm your new password"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Password Requirements
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• At least 6 characters long</li>
                      <li>• Include letters and numbers</li>
                      <li>• Should not be easily guessable</li>
                    </ul>
                  </div>

                  {/* Update Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword ||
                        loading
                      }
                      className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed relative"
                    >
                      {/* Loading Spinner */}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 rounded-xl">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                      )}

                      {/* Button Content */}
                      <div
                        className={`flex items-center gap-2 ${
                          loading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                        {loading ? "Updating..." : "Update Password"}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
