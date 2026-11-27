"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import { registrationAction } from "@/app/actions/user";
import { isAuthenticated } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BD_PHONE_RE = /^(?:\+?88)?(01[3-9]\d{8})$/;

function getPasswordStrength(password = "") {
  if (!password) return { score: 0, label: "", color: "bg-slate-200" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "দুর্বল", color: "bg-rose-500" };
  if (score === 2) return { score: 2, label: "মাঝারি", color: "bg-amber-500" };
  if (score === 3) return { score: 3, label: "ভালো", color: "bg-cyan-500" };
  return { score: 4, label: "শক্তিশালী", color: "bg-emerald-500" };
}

function previewSlug(shopName = "") {
  return String(shopName)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    shopName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const strength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const slugPreview = useMemo(
    () => previewSlug(formData.shopName),
    [formData.shopName]
  );

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    handleFieldChange(name, type === "checkbox" ? checked : value);
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.fullName.trim();
    const trimmedShop = formData.shopName.trim();
    const trimmedEmail = formData.email.trim();
    const cleanedPhone = formData.phone.replace(/[\s-]/g, "").trim();

    if (!trimmedName) {
      newErrors.fullName = "পুরো নাম প্রয়োজন";
    } else if (trimmedName.length < 2) {
      newErrors.fullName = "সঠিক পুরো নাম লিখুন";
    }

    if (!trimmedShop) {
      newErrors.shopName = "দোকানের নাম প্রয়োজন";
    } else if (trimmedShop.length < 2) {
      newErrors.shopName = "দোকানের নাম কমপক্ষে ২ অক্ষরের হতে হবে";
    }

    if (!trimmedEmail) {
      newErrors.email = "ইমেইল ঠিকানা প্রয়োজন";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "ইমেইল ঠিকানা সঠিক নয়";
    }

    if (!cleanedPhone) {
      newErrors.phone = "মোবাইল নম্বর প্রয়োজন";
    } else if (!BD_PHONE_RE.test(cleanedPhone)) {
      newErrors.phone = "সঠিক ১১ সংখ্যার নম্বর দিন (যেমন: 017XXXXXXXX)";
    }

    if (!formData.password) {
      newErrors.password = "পাসওয়ার্ড প্রয়োজন";
    } else if (formData.password.length < 6) {
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "পাসওয়ার্ড নিশ্চিত করুন";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "পাসওয়ার্ড মিলছে না";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "আপনাকে শর্তাবলী ও গোপনীয়তা নীতি মেনে নিতে হবে";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        fullName: formData.fullName.trim(),
        shopName: formData.shopName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/[\s-]/g, "").trim(),
      };

      const response = await registrationAction(payload);

      if (
        response?.status === 200 &&
        response?.data?.email &&
        response?.data?.emailVerified === false
      ) {
        if (response.emailSent === false) {
          toast.warning(response.message);
        } else {
          toast.success(
            response.message || "রেজিস্ট্রেশন সফল হয়েছে। ইমেইল ভেরিফাই করুন।"
          );
        }
        router.push(
          `/account-verify?email=${encodeURIComponent(response.data.email)}`
        );
        return;
      }

      const errorMessage =
        response?.message ||
        "রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";

      const mappedErrors = { general: errorMessage };
      if (response?.field) {
        mappedErrors[response.field] = errorMessage;
      } else if (response?.code === "EMAIL_EXISTS") {
        mappedErrors.email = errorMessage;
      } else if (response?.code === "PHONE_EXISTS") {
        mappedErrors.phone = errorMessage;
      } else if (response?.code === "SHOP_EXISTS") {
        mappedErrors.shopName = errorMessage;
      }

      toast.error(errorMessage);
      setErrors(mappedErrors);
    } catch (error) {
      const errorMessage =
        error?.message ||
        "রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Ambient RGB Aurora Blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl" />

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Feature Pitch Panel (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-3xl bg-slate-950 text-white p-8 shadow-2xl relative overflow-hidden min-h-[600px]">
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-500/25 blur-3xl" />

          <div className="relative space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-xl bangla-text">
                  আ
                </span>
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                AMARDokan
              </span>
            </Link>

            <Badge className="bg-white/10 text-cyan-300 border-white/15 px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-violet-400" />
              ৫ মিনিটে অনলাইন শপ তৈরি করুন
            </Badge>

            <h1 className="text-3xl font-extrabold leading-snug bangla-text">
              আপনার ই-কমার্স ব্যবসার{" "}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                অল-ইন-ওয়ান
              </span>{" "}
              অটোমেশন ড্যাশবোর্ড
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed bangla-text">
              অর্ডার ম্যানেজমেন্ট, কুরিয়ার বুকিং, ইনভেন্টরি ট্র্যাকিং এবং কাস্টম
              স্টোরফ্রন্ট—সবকিছু এক প্ল্যাটফর্মে।
            </p>

            <ul className="space-y-3.5 pt-2">
              {[
                "কাস্টম ডোমেইন ও হাই-কনভার্টিং স্টোরফ্রন্ট থিম",
                "Steadfast, Pathao ও RedX ওয়ান-ক্লিক কুরিয়ার ইন্টিগ্রেশন",
                "রিয়েল-টাইম সেলস অ্যানালিটিক্স ও ইনভয়েস প্রিন্টিং",
                "কোনো ক্রেডিট কার্ড ছাড়াই তাৎক্ষণিক ফ্রি অ্যাকাউন্ট",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-200 bangla-text"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative pt-8 border-t border-white/10 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="bangla-text">
              SSL এনক্রিপ্টেড এবং ১০০% নিরাপদ মার্চেন্ট ডেটা সুরক্ষা
            </span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7">
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl bangla-text">
                  আ
                </span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                AMARDokan
              </span>
            </Link>
          </div>

          <Card className="relative overflow-hidden border-slate-200/80 bg-white/95 backdrop-blur shadow-xl rounded-3xl py-6 sm:py-8">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500" />

            <CardHeader className="px-5 sm:px-8 pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-violet-50 text-violet-700 border-violet-200 text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  ফ্রি মার্চেন্ট রেজিস্ট্রেশন
                </Badge>
                <p className="text-xs sm:text-sm text-slate-600 bangla-text">
                  ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-violet-600 hover:text-violet-700 underline-offset-4 hover:underline"
                  >
                    লগইন করুন
                  </Link>
                </p>
              </div>

              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 bangla-text">
                নতুন অ্যাকাউন্ট তৈরি করুন
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-slate-500 bangla-text">
                আপনার নাম, দোকানের নাম এবং যোগাযোগের তথ্য দিয়ে শুরু করুন
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 sm:px-8 pt-4">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {errors.general && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-rose-800"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium bangla-text">
                      {errors.general}
                    </p>
                  </div>
                )}

                {/* Row 1: Full Name + Shop Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="fullName"
                      className="text-xs sm:text-sm font-semibold text-slate-700 bangla-text"
                    >
                      পুরো নাম <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="আপনার পুরো নাম"
                        value={formData.fullName}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.fullName)}
                        className="pl-9 h-10 bg-white bangla-text"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-rose-600 bangla-text">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="shopName"
                      className="text-xs sm:text-sm font-semibold text-slate-700 bangla-text"
                    >
                      দোকানের নাম <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="shopName"
                        name="shopName"
                        type="text"
                        autoComplete="organization"
                        placeholder="যেমন: Rahman Fashion"
                        value={formData.shopName}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.shopName)}
                        className="pl-9 h-10 bg-white bangla-text"
                      />
                    </div>
                    {errors.shopName ? (
                      <p className="text-xs text-rose-600 bangla-text">
                        {errors.shopName}
                      </p>
                    ) : (
                      slugPreview && (
                        <p className="text-[11px] text-slate-400 truncate">
                          স্টোর লিংক:{" "}
                          <span className="font-mono text-violet-600 font-medium">
                            /shop/{slugPreview}
                          </span>
                        </p>
                      )
                    )}
                  </div>
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs sm:text-sm font-semibold text-slate-700 bangla-text"
                    >
                      ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.email)}
                        className="pl-9 h-10 bg-white"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-rose-600 bangla-text">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs sm:text-sm font-semibold text-slate-700 bangla-text"
                    >
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="017XXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.phone)}
                        className="pl-9 h-10 bg-white"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-rose-600 bangla-text">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Password + Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-xs sm:text-sm font-semibold text-slate-700 bangla-text"
                    >
                      পাসওয়ার্ড <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="ন্যূনতম ৬ অক্ষর"
                        value={formData.password}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.password)}
                        className="pl-9 pr-10 h-10 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={
                          showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="space-y-1 pt-0.5">
                        <div className="grid grid-cols-4 gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 rounded-full transition-colors ${
                                strength.score >= level
                                  ? strength.color
                                  : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 bangla-text">
                          পাসওয়ার্ডের মান:{" "}
                          <span className="font-semibold text-slate-700">
                            {strength.label}
                          </span>
                        </p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-xs text-rose-600 bangla-text">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs sm:text-sm font-semibold text-slate-700 bangla-text"
                    >
                      পাসওয়ার্ড নিশ্চিত করুন{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        className="pl-9 pr-10 h-10 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={
                          showConfirmPassword
                            ? "পাসওয়ার্ড লুকান"
                            : "পাসওয়ার্ড দেখুন"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-rose-600 bangla-text">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleFieldChange("agreeToTerms", Boolean(checked))
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed cursor-pointer bangla-text"
                    >
                      আমি AMARDokan এর{" "}
                      <Link
                        href="/terms"
                        className="font-semibold text-violet-600 hover:underline"
                      >
                        শর্তাবলী
                      </Link>{" "}
                      এবং{" "}
                      <Link
                        href="/privacy"
                        className="font-semibold text-violet-600 hover:underline"
                      >
                        গোপনীয়তা নীতি
                      </Link>{" "}
                      মেনে নিচ্ছি <span className="text-rose-500">*</span>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-xs text-rose-600 bangla-text">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-11 text-sm font-bold rounded-xl bangla-text mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      অ্যাকাউন্ট তৈরি হচ্ছে...
                    </>
                  ) : (
                    <>
                      ফ্রি অ্যাকাউন্ট তৈরি করুন
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
