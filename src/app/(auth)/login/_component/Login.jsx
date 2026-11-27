"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import { loginUserQuaryAction } from "@/app/actions/user";
import {
  ensureValidSession,
  getRole,
  setRefreshToken,
  setRole,
  setToken,
  setUser,
} from "@/lib/auth";
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

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ensureValidSession().then((session) => {
      if (session.ok) {
        const currentRole = String(
          session.role || getRole() || ""
        ).toLowerCase();
        const target = [
          "superadmin",
          "user-admin",
          "moderator",
          "support",
          "admin",
        ].includes(currentRole)
          ? "/admin"
          : "/dashboard";
        router.replace(target);
      }
    });
  }, [router]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }));
    }
    if (unverifiedEmail) {
      setUnverifiedEmail("");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    handleFieldChange(name, type === "checkbox" ? checked : value);
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = formData.email.trim();

    if (!trimmedEmail) {
      newErrors.email = "ইমেইল ঠিকানা প্রয়োজন";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "ইমেইল ঠিকানা সঠিক নয়";
    }

    if (!formData.password) {
      newErrors.password = "পাসওয়ার্ড প্রয়োজন";
    } else if (formData.password.length < 6) {
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !validateForm()) return;

    setIsLoading(true);
    setUnverifiedEmail("");

    try {
      const trimmedEmail = formData.email.trim();
      const response = await loginUserQuaryAction({
        ...formData,
        email: trimmedEmail,
      });

      if (response?.status) {
        const cookieOptions = { rememberMe: formData.rememberMe };
        const tokenSet = setToken(response.token, cookieOptions);
        const userSet = setUser(response.user, cookieOptions);
        const roleSet = setRole(response.user?.role, cookieOptions);
        if (response.refreshToken) {
          setRefreshToken(response.refreshToken, cookieOptions);
        }

        if (!tokenSet || !userSet || !roleSet) {
          const cookieError =
            "ব্রাউজার কুকি সংরক্ষণ করা যায়নি। অনুগ্রহ করে কুকি চালু করে আবার চেষ্টা করুন।";
          toast.error(cookieError);
          setErrors({ general: cookieError });
          return;
        }

        toast.success(response.message || "লগইন সফল হয়েছে");
        const resolvedRole = String(response.user?.role || "").toLowerCase();
        const destination =
          response.redirectTo ||
          (["superadmin", "user-admin", "moderator", "support", "admin"].includes(
            resolvedRole
          )
            ? "/admin"
            : "/dashboard");
        window.location.href = destination;
        return;
      }

      const errorMessage =
        response?.message || "লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";

      if (response?.code === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(response.email || trimmedEmail);
      }

      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } catch (error) {
      const errorMessage =
        error?.message || "লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClass =
    "pl-10 h-11 bg-slate-950/65 border-white/15 text-white placeholder:text-slate-400 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/25 rounded-xl";

  return (
    <div
      className="min-h-screen relative flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-slate-950 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/register-bg.jpg')" }}
    >
      {/* Balanced dark studio scrim so the e-commerce boutique & desk scene stays vivid */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/70" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left E-Commerce Brand Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 text-white pr-2">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-2xl bangla-text">
                  আ
                </span>
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                  AMARDokan
                </span>
                <p className="text-xs text-cyan-300/80">
                  Merchant E-Commerce Cloud
                </p>
              </div>
            </Link>

            <Badge className="bg-white/10 hover:bg-white/15 text-cyan-300 border-white/15 backdrop-blur-md px-3.5 py-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-violet-400" />
              মার্চেন্ট কমান্ড সেন্টার
            </Badge>

            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight bangla-text">
              আপনার অনলাইন স্টোর পরিচালনা করুন আরও{" "}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                দ্রুত ও স্মার্টভাবে
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed bangla-text">
              অর্ডার কনফার্মেশন থেকে শুরু করে কুরিয়ার বুকিং, স্টক আপডেট এবং
              ডেইলি রেভিনিউ রিপোর্ট—সবকিছু এক ক্লিকেই হাতের মুঠোয়।
            </p>

            <div className="space-y-3 pt-1">
              {[
                {
                  icon: Truck,
                  text: "Steadfast, Pathao ও RedX ওয়ান-ক্লিক পার্সেল ডিসপ্যাচ",
                  color: "text-cyan-300",
                },
                {
                  icon: BarChart3,
                  text: "রিয়েল-টাইম সেলস, প্রফিট ও কাস্টমার অ্যানালিটিক্স",
                  color: "text-violet-300",
                },
                {
                  icon: CheckCircle2,
                  text: "মোবাইল ও ডেস্কটপে সুপার-ফাস্ট ক্লাউড ড্যাশবোর্ড",
                  color: "text-emerald-300",
                },
              ].map(({ icon: Icon, text, color }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md px-4 py-3 text-sm text-slate-100 bangla-text"
                >
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 backdrop-blur-md px-4 py-3 text-xs text-cyan-100">
            <ShieldCheck className="w-5 h-5 text-cyan-300 shrink-0" />
            <span className="bangla-text">
              JWT সিকিউরড সেশন এবং এনক্রিপ্টেড মার্চেন্ট অ্যাকাউন্ট সুরক্ষা
            </span>
          </div>
        </div>

        {/* Right Glassmorphic Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 ring-1 ring-white/25">
                <span className="text-white font-bold text-xl bangla-text">
                  আ
                </span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                AMARDokan
              </span>
            </Link>
          </div>

          <Card className="relative overflow-hidden border-white/15 bg-slate-900/78 backdrop-blur-2xl text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] rounded-3xl py-7 sm:py-8">
            {/* RGB Spectrum Top Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />

            <CardHeader className="px-6 sm:px-8 pb-2">
              <Badge
                variant="outline"
                className="w-fit bg-violet-500/15 text-violet-200 border-violet-400/30 text-xs mb-2"
              >
                <Sparkles className="w-3 h-3 mr-1 text-cyan-300" />
                স্বাগতম মার্চেন্ট পোর্টালে
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-white bangla-text">
                অ্যাকাউন্টে লগইন করুন
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-slate-300/90 bangla-text">
                আপনার ইমেইল ও পাসওয়ার্ড দিয়ে ড্যাশবোর্ডে প্রবেশ করুন
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pt-4">
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {errors.general && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-rose-500/40 bg-rose-500/15 p-3.5 text-rose-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <div className="space-y-1.5">
                        <p className="text-xs sm:text-sm font-medium bangla-text">
                          {errors.general}
                        </p>
                        {unverifiedEmail && (
                          <Link
                            href={`/account-verify?email=${encodeURIComponent(
                              unverifiedEmail
                            )}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-4 bangla-text"
                          >
                            এখনই ইমেইল ভেরিফাই করুন →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs sm:text-sm font-semibold text-slate-200 bangla-text"
                  >
                    ইমেইল ঠিকানা
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.email)}
                      className={inputBaseClass}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400 bangla-text">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs sm:text-sm font-semibold text-slate-200 bangla-text"
                    >
                      পাসওয়ার্ড
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:underline underline-offset-4 bangla-text"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="আপনার পাসওয়ার্ড"
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.password)}
                      className={`${inputBaseClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      aria-label={
                        showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-400 bangla-text">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      handleFieldChange("rememberMe", Boolean(checked))
                    }
                    className="border-white/30 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-xs sm:text-sm font-normal text-slate-300 cursor-pointer bangla-text"
                  >
                    আমাকে মনে রাখুন (৭ দিন)
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-12 text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-indigo-500/30 bangla-text"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      লগইন হচ্ছে...
                    </>
                  ) : (
                    <>
                      ড্যাশবোর্ডে লগইন করুন
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Registration Footer */}
                <div className="pt-4 border-t border-white/10 text-center">
                  <p className="text-xs sm:text-sm text-slate-300 bangla-text">
                    এখনো কোনো অ্যাকাউন্ট নেই?{" "}
                    <Link
                      href="/registration"
                      className="font-bold text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline"
                    >
                      ফ্রি অ্যাকাউন্ট তৈরি করুন
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
