"use client";
import { Check, Zap, Star, Building2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for small businesses just getting started",
    icon: Zap,
    color: "text-slate-400",
    badge: null,
    features: [
      "Up to 100 orders/month",
      "Basic order management",
      "1 courier integration",
      "Basic analytics",
      "Email support",
      "1 user account",
    ],
    cta: "Get Started Free",
    ctaStyle: "border border-white/10 hover:bg-white/5 hover:border-white/20",
    popular: false,
  },
  {
    name: "Pro",
    price: "৳2,999",
    period: "/month",
    description: "For growing e-commerce businesses ready to scale",
    icon: Star,
    color: "text-violet-400",
    badge: "Most Popular",
    features: [
      "Up to 5,000 orders/month",
      "Bulk invoice printing",
      "All courier integrations",
      "Advanced analytics & reports",
      "Fake order prevention",
      "Return parcel tracking",
      "Priority WhatsApp support",
      "Up to 5 user accounts",
      "API access",
    ],
    cta: "Start 14-Day Free Trial",
    ctaStyle: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale operations with custom needs",
    icon: Building2,
    color: "text-sky-400",
    badge: null,
    features: [
      "Unlimited orders",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee (99.9% uptime)",
      "White-label options",
      "Unlimited user accounts",
      "On-site training",
      "Custom reporting",
    ],
    cta: "Contact Sales",
    ctaStyle: "border border-sky-500/30 text-sky-300 hover:bg-sky-500/10 hover:border-sky-500/50",
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-32 bg-gradient-to-b from-[#080514] via-[#0a0820] to-[#080514] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-700/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-sm font-semibold text-sky-400 tracking-wide">Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Simple, Honest{" "}
            <span
              className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Pricing
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free and upgrade as you grow. No hidden fees, no long-term contracts. Cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? "bg-gradient-to-b from-violet-600/15 via-violet-600/10 to-transparent border-violet-500/50 shadow-2xl shadow-violet-500/10"
                  : "bg-white/[0.03] border-white/8 hover:border-white/15"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-500/30">
                    <Star className="w-3 h-3 fill-current" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${
                  plan.popular ? "bg-violet-500/20 border border-violet-500/30" : "bg-white/5 border border-white/10"
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.color}`} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`text-5xl font-black ${plan.popular ? "text-white" : "text-slate-200"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-400 text-lg">{plan.period}</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3.5 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 ${plan.popular ? "text-violet-400" : "text-emerald-400"}`} />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm transition-all duration-200 hover:scale-[1.02] ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom assurance */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8 py-5 rounded-2xl bg-white/5 border border-white/8">
            {[
              "✓ 7-day money-back guarantee",
              "✓ 24/7 WhatsApp support",
              "✓ Regular feature updates",
              "✓ No setup fees",
            ].map((item, i) => (
              <span key={i} className="text-sm text-slate-400">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
