"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  Store,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { userPasswordChangeAction } from "@/app/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Setting({ user }) {
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      const response = await userPasswordChangeAction({
        userId: user?.id,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response?.status) {
        toast.success(response.message || "Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response?.message || "Password update failed.");
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(
        error?.message || "An error occurred while updating password."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Account <span className="rgb-gradient-text">Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your merchant profile, store identity, and account security.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-5 sm:space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1 h-auto w-full sm:w-fit grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="profile" className="px-3 sm:px-4 py-2 gap-1.5 text-xs sm:text-sm">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="px-3 sm:px-4 py-2 gap-1.5 text-xs sm:text-sm">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="rgb-card border-slate-200/80 bg-white/95">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-2xl border border-slate-200 shadow-sm">
                  <AvatarImage src={user?.shopLogo || ""} alt={userData.fullName} />
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white text-xl font-extrabold">
                    {(userData.fullName?.[0] || "M").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {userData.fullName || "Merchant Profile"}
                  </CardTitle>
                  <CardDescription>{userData.email}</CardDescription>
                  <Badge className="mt-1.5 bg-emerald-500/10 text-emerald-700 border-emerald-200 capitalize">
                    {user?.role || "merchant"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-700">
                    <User className="w-3.5 h-3.5 text-violet-600" />
                    Full Name
                  </Label>
                  <Input
                    value={userData.fullName}
                    onChange={(e) =>
                      setUserData({ ...userData, fullName: e.target.value })
                    }
                    readOnly
                    className="bg-slate-50/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-cyan-600" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={userData.email}
                    readOnly
                    className="bg-slate-50/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    value={userData.phone}
                    readOnly
                    className="bg-slate-50/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-700">
                    <Store className="w-3.5 h-3.5 text-amber-600" />
                    Shop Name
                  </Label>
                  <Input
                    value={userData.shopName}
                    readOnly
                    className="bg-slate-50/70 bangla-text"
                  />
                </div>
              </div>

              <div className="max-w-xs space-y-1.5">
                <Label className="text-slate-700">Shop ID</Label>
                <Input
                  value={userData.shopId || "N/A"}
                  readOnly
                  className="bg-slate-100/80 font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400">
                  Unique 6-digit merchant shop identifier
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="password">
          <Card className="rgb-card border-slate-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Change Password
              </CardTitle>
              <CardDescription>
                Keep your merchant workspace protected with a strong password
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordChange} className="max-w-xl space-y-5">
                {[
                  {
                    key: "current",
                    field: "currentPassword",
                    label: "Current Password",
                    icon: Key,
                    placeholder: "Enter current password",
                  },
                  {
                    key: "new",
                    field: "newPassword",
                    label: "New Password",
                    icon: Shield,
                    placeholder: "At least 6 characters",
                  },
                  {
                    key: "confirm",
                    field: "confirmPassword",
                    label: "Confirm New Password",
                    icon: CheckCircle2,
                    placeholder: "Re-enter new password",
                  },
                ].map(({ key, field, label, icon: Icon, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-slate-700">
                      <Icon className="w-3.5 h-3.5 text-violet-600" />
                      {label}
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPasswords[key] ? "text" : "password"}
                        value={passwordData[field]}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            [field]: e.target.value,
                          })
                        }
                        placeholder={placeholder}
                        className="pr-10 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords[key] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl border border-violet-200/80 bg-violet-50/60 p-4 text-xs text-violet-900 space-y-1">
                  <p className="font-bold">Password Guidelines</p>
                  <p>• Minimum 6 characters long</p>
                  <p>• Combine letters, numbers, and symbols for stronger security</p>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    loading
                  }
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
