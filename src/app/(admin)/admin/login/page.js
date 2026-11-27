"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCog,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  ensureValidSession,
  getRole,
  setRefreshToken,
  setRole,
  setToken,
  setUser,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    ensureValidSession().then((session) => {
      if (session.ok) {
        const role = String(session.role || getRole() || "").toLowerCase();
        if (
          ["superadmin", "user-admin", "moderator", "support", "admin"].includes(
            role
          )
        ) {
          router.replace("/admin");
        }
      }
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const email = form.email.trim().toLowerCase();
    if (!email || !form.password) {
      setErrorMsg("Please enter both admin email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: form.password,
          rememberMe: form.rememberMe,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        const msg = json?.message || "Invalid admin credentials.";
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }

      const cookieOpts = { rememberMe: form.rememberMe };
      setToken(json.token, cookieOpts);
      setUser(json.user, cookieOpts);
      setRole(json.user?.role || "superadmin", cookieOpts);
      if (json.refreshToken) {
        setRefreshToken(json.refreshToken, cookieOpts);
      }

      toast.success(json.message || "Welcome to Admin Command Center!");
      window.location.href = "/admin";
    } catch (error) {
      const msg = error?.message || "Failed to connect to authentication server.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-slate-950 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/register-bg.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/75 to-indigo-950/85" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/75 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl text-white space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/35">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-[11px] font-bold text-emerald-300">
            <Sparkles className="w-3 h-3" /> Superadmin & User-Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Authorized access to AMARDokan Platform Control Center
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/35 bg-rose-500/15 p-3.5 flex items-start gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-200">
              Admin Email
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="admin@sm.com"
                className="pl-10 h-11 bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-200">
              Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Enter admin password"
                className="pl-10 pr-10 h-11 bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) =>
                setForm((p) => ({ ...p, rememberMe: e.target.checked }))
              }
              className="rounded accent-violet-500"
            />
            Keep my admin session signed in for 7 days
          </label>

          <Button
            type="submit"
            disabled={loading}
            variant="gradient"
            className="w-full h-11 rounded-xl text-sm font-extrabold shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Enter Admin Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <UserCog className="w-3.5 h-3.5 text-cyan-400" /> RBAC Protected
          </span>
          <Link href="/login" className="text-cyan-300 hover:underline font-semibold">
            Merchant Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
