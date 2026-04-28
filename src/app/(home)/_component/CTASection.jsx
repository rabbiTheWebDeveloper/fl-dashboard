"use client";
import { Zap, ArrowRight, Sparkles } from "lucide-react";

export const CTASection = () => {
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Dramatic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-[#0a0520] to-indigo-900/40" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[80px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-sm font-semibold text-white/90">Limited Time: 14-Day Free Trial</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight">
          Start Growing Your
          <br />
          <span
            className="bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Business Today.
          </span>
        </h2>

        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join 2,000+ Bangladeshi businesses already using AMARDokan to save time, prevent fraud, and maximize profits.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-black text-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-100" />
            <Zap className="relative z-10 w-6 h-6 fill-violet-600 text-violet-600" />
            <span className="relative z-10 text-slate-900">Get Started Free</span>
            <ArrowRight className="relative z-10 w-5 h-5 text-violet-600 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Schedule a Demo
          </button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/50 text-sm">
          {["No credit card required", "5-minute setup", "Cancel anytime", "7-day money back"].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
