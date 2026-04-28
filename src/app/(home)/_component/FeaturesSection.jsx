"use client";
import { FileText, ShieldCheck, Search, Zap, BarChart3, Users, Printer, Bell, RefreshCw, Globe, Lock, Headphones, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Printer,
    title: "Bulk Invoice Printing",
    description: "Print hundreds of invoices in seconds. Save hours of manual work with our automated batch printing system.",
    highlight: true,
    badge: "Most Used",
  },
  {
    icon: ShieldCheck,
    title: "Fake Order Prevention",
    description: "Block duplicate orders, verify customers with OTP checkout, and automatically flag suspicious transactions.",
    highlight: false,
    badge: null,
  },
  {
    icon: Search,
    title: "Return Order Tracking",
    description: "Never lose a returned parcel again. Track every return in real-time and get instant alerts on discrepancies.",
    highlight: false,
    badge: null,
  },
  {
    icon: BarChart3,
    title: "Profit & Loss Reports",
    description: "Get crystal-clear financial insights. Know exactly which products make money and which drain your budget.",
    highlight: false,
    badge: null,
  },
  {
    icon: Zap,
    title: "Order Automation",
    description: "Automate your entire order workflow from placement to delivery. Process thousands of orders effortlessly.",
    highlight: false,
    badge: "New",
  },
  {
    icon: FileText,
    title: "Incomplete Order Recovery",
    description: "Automatically follow up on abandoned checkouts and recover lost sales with smart notification sequences.",
    highlight: false,
    badge: null,
  },
  {
    icon: Users,
    title: "Team Performance Tracking",
    description: "Monitor every team member's productivity, set targets, and see detailed performance analytics in real-time.",
    highlight: false,
    badge: null,
  },
  {
    icon: Globe,
    title: "Multi-Platform Integration",
    description: "Connect Daraz, Shopify, WooCommerce, and all major Bangladeshi courier services from one dashboard.",
    highlight: false,
    badge: null,
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get instant WhatsApp and SMS alerts for new orders, low stock, return parcels, and critical business events.",
    highlight: false,
    badge: null,
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-32 bg-gradient-to-b from-[#080514] via-[#0c0820] to-[#080514] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[80px]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Zap className="w-3.5 h-3.5 text-violet-400 fill-current" />
            <span className="text-sm font-semibold text-violet-400 tracking-wide">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Everything You Need to{" "}
            <br />
            <span
              className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Run & Scale
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            AMARDokan combines all the tools you need to manage, automate, and grow your e-commerce business — all from a single, intuitive platform.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl p-7 border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                feature.highlight
                  ? "bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/10 border-violet-500/40 shadow-xl shadow-violet-500/10"
                  : "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15"
              }`}
            >
              {/* Highlight glow */}
              {feature.highlight && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    feature.highlight
                      ? "bg-violet-500/20 border border-violet-500/30"
                      : "bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors"
                  }`}>
                    <feature.icon className={`w-5 h-5 ${feature.highlight ? "text-violet-300" : "text-slate-300"}`} />
                  </div>
                  {feature.badge && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      feature.badge === "Most Used"
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className={`text-lg font-bold mb-3 ${feature.highlight ? "text-white" : "text-slate-100"}`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature highlights row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: RefreshCw, text: "Auto-sync with all platforms", color: "text-sky-400" },
            { icon: Lock, text: "Bank-grade data security", color: "text-emerald-400" },
            { icon: Headphones, text: "24/7 WhatsApp support", color: "text-violet-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/8">
              <CheckCircle className={`w-5 h-5 ${item.color} flex-shrink-0`} />
              <span className="text-sm font-medium text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300">
            Explore All Features
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
