"use client";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiKey,
  FiMail,
  FiCheck,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
export const dynamic = 'force-dynamic'
const SettingsPage = () => {
  // User data state
  const [userData, setUserData] = useState({
    name: "John Doe",
    telegramId: "@johndoe",
  });
  const [user, setUser] = useState({});
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to update the profile
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Here you would typically call an API to change the password
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setSuccessMessage("Password changed successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUserData(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiUser className="mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "password"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiKey className="mr-3" />
                  Password
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                <FiCheck className="mr-2" />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <FiX className="mr-2" />
                {errorMessage}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Profile Information
                </h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={userData.name}
                          onChange={handleProfileChange}
                          className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="telegramId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Telegram ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.023c.24-.213-.054-.334-.373-.121l-6.86 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                          </svg>
                        </div>
                        <input
                          disabled
                          type="text"
                          id="telegramId"
                          name="telegramId"
                          value={userData.telegramId}
                          onChange={handleProfileChange}
                          className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        disabled
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Change Password
                </h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiKey className="text-gray-400" />
                        </div>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? (
                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiKey className="text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiKey className="text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
