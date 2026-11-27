"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { toast } from "react-toastify";
import {
  requestPasswordResetAction,
  resetPasswordAction,
} from "@/app/actions/user";
import { isAuthenticated } from "@/lib/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") || "";
  const initialStep =
    searchParams.get("step") === "reset" && initialEmail ? "reset" : "request";

  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const clearError = (field) => {
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrors({ email: "ইমেইল ঠিকানা প্রয়োজন" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setErrors({ email: "ইমেইল ঠিকানা সঠিক নয়" });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const response = await requestPasswordResetAction(trimmedEmail);
      if (response?.status) {
        setEmail(response.email || trimmedEmail);
        setStep("reset");
        setCountdown(60);
        toast.success(
          response.message || "পাসওয়ার্ড রিসেট কোড আপনার ইমেইলে পাঠানো হয়েছে।"
        );
      } else {
        const msg =
          response?.message || "কোড পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।";
        toast.error(msg);
        setErrors({ general: msg });
      }
    } catch (error) {
      const msg =
        error?.message || "কোড পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isLoading || countdown > 0) return;
    setIsLoading(true);
    setErrors({});
    try {
      const response = await requestPasswordResetAction(email.trim());
      if (response?.status) {
        setCountdown(60);
        toast.success("নতুন রিসেট কোড আপনার ইমেইলে পাঠানো হয়েছে।");
      } else {
        const msg =
          response?.message ||
          "কোড পুনরায় পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।";
        toast.error(msg);
        setErrors({ general: msg });
      }
    } catch (error) {
      const msg =
        error?.message ||
        "কোড পুনরায় পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const newErrors = {};
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      newErrors.code = "৬-অঙ্কের রিসেট কোড প্রয়োজন";
    } else if (!/^\d{6}$/.test(trimmedCode)) {
      newErrors.code = "রিসেট কোডটি অবশ্যই ৬ অঙ্কের হতে হবে";
    }

    if (!newPassword) {
      newErrors.newPassword = "নতুন পাসওয়ার্ড প্রয়োজন";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "পাসওয়ার্ড নিশ্চিত করুন";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "পাসওয়ার্ড মিলছে না";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const response = await resetPasswordAction({
        email: email.trim(),
        code: trimmedCode,
        newPassword,
      });

      if (response?.status) {
        toast.success(
          response.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।"
        );
        router.push("/login");
      } else {
        const msg =
          response?.message ||
          "পাসওয়ার্ড পরিবর্তন করা যায়নি। দয়া করে আবার চেষ্টা করুন।";
        toast.error(msg);
        setErrors({ general: msg });
      }
    } catch (error) {
      const msg =
        error?.message ||
        "পাসওয়ার্ড পরিবর্তন করা যায়নি। দয়া করে আবার চেষ্টা করুন।";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            {step === "request" ? (
              <Mail className="w-6 h-6 text-white" />
            ) : (
              <KeyRound className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 bangla-text">
          {step === "request"
            ? "পাসওয়ার্ড ভুলে গেছেন?"
            : "নতুন পাসওয়ার্ড সেট করুন"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 bangla-text">
          {step === "request"
            ? "আপনার রেজিস্টার্ড ইমেইল দিন, আমরা ৬-অঙ্কের রিসেট কোড পাঠাবো।"
            : `আমরা ${email} ইমেইলে একটি ৬-অঙ্কের কোড পাঠিয়েছি।`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="mb-6 rounded-md bg-red-50 p-4" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 bangla-text">
                    {errors.general}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {step === "request" ? (
            <form
              className="space-y-6"
              onSubmit={handleRequestCode}
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 bangla-text"
                >
                  ইমেইল ঠিকানা
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="আপনার ইমেইল ঠিকানা"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 bangla-text">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "কোড পাঠানো হচ্ছে..." : "রিসেট কোড পাঠান"}
              </button>
            </form>
          ) : (
            <form
              className="space-y-5"
              onSubmit={handleResetPassword}
              noValidate
            >
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 bangla-text"
                  >
                    ৬-অঙ্কের ভেরিফিকেশন কোড
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setCode("");
                      setErrors({});
                    }}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 bangla-text"
                  >
                    ইমেইল পরিবর্তন করুন
                  </button>
                </div>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 tracking-[0.35em] text-center font-semibold focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base ${
                      errors.code ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setCode(digits);
                      clearError("code");
                    }}
                  />
                  {errors.code && (
                    <p className="mt-2 text-sm text-red-600 bangla-text">
                      {errors.code}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 bangla-text"
                >
                  নতুন পাসওয়ার্ড
                </label>
                <div className="mt-1 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.newPassword ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="ন্যূনতম ৬ অক্ষরের পাসওয়ার্ড"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearError("newPassword");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={
                      showNewPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600 bangla-text">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 bangla-text"
                >
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError("confirmPassword");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={
                      showConfirmPassword
                        ? "পাসওয়ার্ড লুকান"
                        : "পাসওয়ার্ড দেখুন"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 bangla-text">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 bangla-text">
                  কোড পাননি?{" "}
                  {countdown > 0 ? (
                    <span className="text-gray-500">
                      {countdown} সেকেন্ড পরে আবার চেষ্টা করুন
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="font-medium text-indigo-600 hover:text-indigo-500 bangla-text"
                    >
                      আবার কোড পাঠান
                    </button>
                  )}
                </p>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 bangla-text"
            >
              <ArrowLeft className="w-4 h-4" />
              লগইন পৃষ্ঠায় ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
