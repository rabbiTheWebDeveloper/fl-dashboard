"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, ChevronRight, ChevronDown, Zap, Crown, Rocket, LogIn, UserPlus } from "lucide-react";

const navLinks = [
  { name: "Problems", href: "#problems" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing", hasDrop: true },
  { name: "Reviews", href: "#reviews" },
  { name: "FAQ", href: "#faq" },
];

const plans = [
  {
    icon: Zap,
    name: "Starter",
    price: "৳499",
    period: "/mo",
    desc: "Perfect for solo sellers just getting started.",
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
    href: "#pricing",
  },
  {
    icon: Rocket,
    name: "Growth",
    price: "৳999",
    period: "/mo",
    desc: "Scale your store with advanced automation.",
    color: "from-violet-500 to-indigo-500",
    shadow: "shadow-violet-500/20",
    badge: "Popular",
    href: "#pricing",
  },
  {
    icon: Crown,
    name: "Pro",
    price: "৳1,999",
    period: "/mo",
    desc: "Full power for high-volume businesses.",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
    href: "#pricing",
  },
];

/* ── Pricing Dropdown ── */
function PricingDrop({ onClose }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] rounded-2xl border border-white/10 bg-[#0d0b20]/95 backdrop-blur-2xl shadow-2xl shadow-black/50 p-4 z-50"
      style={{ animation: "dropIn 0.18s ease-out both" }}
    >
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3 px-1">Choose a Plan</p>

      <div className="grid grid-cols-3 gap-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <a
              key={plan.name}
              href={plan.href}
              onClick={onClose}
              className="group relative flex flex-col gap-2 rounded-xl p-3.5 bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200"
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg">
                  {plan.badge}
                </span>
              )}
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg ${plan.shadow}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{plan.name}</p>
                <p className="text-slate-500 text-[11px] leading-relaxed">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-0.5 mt-auto">
                <span className="text-white font-black text-base">{plan.price}</span>
                <span className="text-slate-500 text-xs">{plan.period}</span>
              </div>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
            </a>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-slate-500 text-xs">All plans include 14-day free trial · No credit card needed</p>
        <a
          href="#pricing"
          onClick={onClose}
          className="text-violet-400 hover:text-violet-300 text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          Compare all <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setPricingOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#080514]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20" aria-label="Main Navigation">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white font-black text-lg">আ</span>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080514] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white leading-tight tracking-tight">
              AMAR<span className="text-violet-400">Dokan</span>
            </span>
            <span className="text-[10px] text-slate-400 leading-tight font-medium tracking-widest uppercase">
              E-commerce OS
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.hasDrop ? (
              <div key={link.name} className="relative" ref={dropRef}>
                <button
                  onClick={() => setPricingOpen((v) => !v)}
                  aria-expanded={pricingOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pricingOpen
                      ? "text-white bg-white/8"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${pricingOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {pricingOpen && <PricingDrop onClose={() => setPricingOpen(false)} />}
              </div>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.name}
              </a>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language toggle */}
          <button 
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            aria-label="Switch to Bengali"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>বাংলা</span>
          </button>

          {/* Login */}
          <a
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/5 text-sm font-semibold transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            Login
          </a>

          {/* Register */}
          <a
            href="/registration"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 group"
          >
            <UserPlus className="w-4 h-4" />
            Get Started
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0a0a1f]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-6">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Pricing plans */}
            <div className="mt-2 p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">Choose a Plan</p>
              <div className="flex flex-col gap-2">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <a
                      key={plan.name}
                      href={plan.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{plan.name}</p>
                        <p className="text-slate-500 text-xs truncate">{plan.desc}</p>
                      </div>
                      <span className="text-white font-bold text-sm shrink-0">{plan.price}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Mobile auth buttons */}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <a
                href="/login"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white text-sm font-semibold transition-all"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </a>
              <a
                href="/register"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};
