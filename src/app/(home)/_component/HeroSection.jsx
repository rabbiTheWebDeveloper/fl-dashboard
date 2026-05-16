"use client";
import { useState, useEffect } from "react";
import { Zap, Play, Users, Package, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const stats = [
  { icon: Users, value: "2,000+", label: "Active Businesses", color: "text-violet-400" },
  { icon: Package, value: "5M+", label: "Orders Processed", color: "text-sky-400" },
  { icon: TrendingUp, value: "98%", label: "Success Rate", color: "text-emerald-400" },
];

const integrations = [
  { name: "Daraz", color: "#ff6600" },
  { name: "Shopify", color: "#96bf48" },
  { name: "Pathao", color: "#e63946" },
  { name: "Redx", color: "#e74c3c" },
  { name: "eCourier", color: "#f39c12" },
  { name: "WooCommerce", color: "#7f54b3" },
];

const trustItems = [
  "5-minute setup",
  "No credit card required",
  "Free forever plan",
  "24/7 support",
];

export const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const words = ["Automate", "Optimize", "Scale", "Dominate"];
  const ref = useScrollReveal(0.05);

  // Entrance animation trigger
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Typewriter
  useEffect(() => {
    const word = words[currentIndex];
    let charIndex = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      if (charIndex <= word.length) {
        setDisplayText(word.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        }, 2000);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060412] via-[#0a0520] to-[#080514]" />

      {/* Glowing orbs */}
      <div className="absolute top-[15%] -left-[20%] w-[700px] h-[700px] rounded-full bg-violet-700/20 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[30%] -right-[15%] w-[600px] h-[600px] rounded-full bg-indigo-700/15 blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[80px] animate-pulse-slow pointer-events-none" style={{ animationDelay: "1s" }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center">
          {/* Launch badge */}
          <div
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 mb-10 group cursor-pointer hover:border-violet-400/40 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{ transition: "opacity 0.8s ease, transform 0.8s ease" }}
          >
            <div className="relative flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
              🏆 Bangladesh&apos;s #1 E-commerce Automation Platform
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Main heading */}
          <div className="max-w-5xl mx-auto mb-8">
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.15s" }}
            >
              <span className="block">Your E-commerce,</span>
              <span className="block relative min-h-[1.1em]">
                <span
                  className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {displayText}
                  <span className="animate-blink text-violet-400 ml-1" style={{ WebkitTextFillColor: "#a78bfa" }}>|</span>
                </span>
              </span>
              <span className="block text-slate-200">on Autopilot.</span>
            </h1>
            <p
              className={`text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              From bulk invoice printing to order management, stock tracking &amp; courier integration —
              everything your e-commerce business needs,{" "}
              <span className="text-violet-300 font-medium">in one powerful platform.</span>
            </p>
          </div>

          {/* Trust signals */}
          <div
            className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-12 text-sm text-slate-400 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.45s" }}
          >
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.55s" }}
          >
            <a
              href="/register"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg overflow-hidden shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Zap className="relative z-10 w-5 h-5 fill-current" />
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto justify-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors flex-shrink-0">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              Watch 2-min Demo
            </button>
          </div>

          {/* Stats bar */}
          <div
            className={`inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-12 px-8 py-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ transitionDelay: "0.65s" }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex items-center gap-4 ${index < stats.length - 1 ? "sm:pr-12 sm:border-r sm:border-white/10" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 flex-shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-left">
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium whitespace-nowrap">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations ticker */}
        <div className="mt-20 reveal" style={{ "--d": "0s" }}>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
            Trusted &amp; Integrated With
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
            {integrations.map((brand) => (
              <div
                key={brand.name}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:border-white/20 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span className="text-sm font-bold" style={{ color: brand.color }}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
