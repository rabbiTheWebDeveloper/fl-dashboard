"use client";
import { TrendingDown, ShieldAlert, Package, BarChart3, Users, Search, AlertCircle } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "No Profit-Loss Tracking",
    description: "Business is running but you don't know if you're actually making a profit. Who keeps track of all this manually?",
    tag: "Financial",
    color: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/20",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    tagColor: "bg-red-500/10 text-red-400",
  },
  {
    icon: ShieldAlert,
    title: "Budget Wasted on Fake Orders",
    description: "Pixel health is down and fake orders drain your ad budget without real sales, burning through your marketing spend.",
    tag: "Security",
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/20",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    tagColor: "bg-orange-500/10 text-orange-400",
  },
  {
    icon: Package,
    title: "Return Parcel Chaos",
    description: "No tracking of return parcels. Losing just one parcel means negative profit from 10 successful sales.",
    tag: "Logistics",
    color: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/20",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    tagColor: "bg-yellow-500/10 text-yellow-400",
  },
  {
    icon: AlertCircle,
    title: "Zero Stock Management",
    description: "No inventory tracking means products run out when orders come in. Lost sales, disappointed customers.",
    tag: "Inventory",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    tagColor: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: Users,
    title: "Team Management Nightmare",
    description: "Struggling to manage your team. Hard to tell who's working, who's slacking, and what's getting done.",
    tag: "HR",
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    tagColor: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: BarChart3,
    title: "Blind Business Decisions",
    description: "Can't figure out which product is profitable and which is losing money without proper data analysis.",
    tag: "Analytics",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    tagColor: "bg-violet-500/10 text-violet-400",
  },
];

export const ProblemsSection = () => {
  return (
    <section id="problems" className="relative py-32 bg-[#080514] overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-sm font-semibold text-red-400 tracking-wide">Pain Points We Solve</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Challenges You Face{" "}
            <span
              className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Every Day
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            These are the real issues that cost you time, money, and customers — silently killing your business growth.
          </p>
        </div>

        {/* Problems grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl border ${problem.border} bg-gradient-to-br ${problem.color} p-7 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-br ${problem.color}`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${problem.iconBg} flex items-center justify-center border ${problem.border}`}>
                    <problem.icon className={`w-6 h-6 ${problem.iconColor}`} />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${problem.tagColor}`}>
                    {problem.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-white transition-colors">
                  {problem.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-6 text-lg">
            Sound familiar? <span className="text-white font-semibold">AMARDokan solves all of this.</span>
          </p>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            See How We Fix It
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
