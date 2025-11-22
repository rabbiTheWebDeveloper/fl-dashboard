"use client";
import React, { useState } from "react";
import {
  Plus,
  User,
  Mail,
  Crown,
  Settings,
  UserCog,
  X,
  Shield,
  Users,
  Trash2,
  MoreVertical,
} from "lucide-react";

const ManageUsers = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([user]);
  const [newUser, setNewUser] = useState({ email: "", role: "" });

  const handleAddUser = () => {
    if (!newUser.email || !newUser.role) {
      alert("Please fill all fields");
      return;
    }

    setUsers([
      ...users,
      {
        id: Date.now(),
        name:
          newUser.email
            .split("@")[0]
            .replace(/[^a-zA-Z]/g, " ")
            .trim() || "New User",
        email: newUser.email,
        role: newUser.role,
        isYou: false,
        avatar: null,
      },
    ]);
    setNewUser({ email: "", role: "" });
    setShowModal(false);
  };

  const handleRemoveUser = (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "merchant":
        return <Crown className="h-4 w-4" />;
      case "Shop Manager":
        return <Settings className="h-4 w-4" />;
      case "Shop Staff":
        return <UserCog className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Shop Owner":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Shop Manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shop Staff":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-200/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Team Management
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage users and their permissions
              </p>
            </div>
          </div>
          <button
            disabled
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Add User Coming Soon</span>
          </button>
        </div>

        {/* User List */}
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/80 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl text-indigo-700 font-semibold uppercase border-2 border-white shadow-sm">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  {user.isYou && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.fullName}
                    </p>
                    {user.role === "merchant" && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${getRoleColor(
                    user.role
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  <span className="text-sm font-medium">{user?.role === "merchant" ? "Shop Owner" : user?.role}</span>
                </div>

                {!user.role === "merchant" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveUser(user?.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group/remove"
                    >
                      <Trash2 className="h-4 w-4 group-hover/remove:scale-110" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20"></div> // Spacer for alignment
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 relative animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <UserCog className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Team Member
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  User Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">Select a role</option>
                  <option value="Shop Manager">Shop Manager</option>
                  <option value="Shop Staff">Shop Staff</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newUser.email || !newUser.role}
              >
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
