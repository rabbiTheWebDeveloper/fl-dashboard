"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiCalendar, FiChevronDown, FiX } from "react-icons/fi";

const PRESETS = [
  { label: "Today",      days: 0 },
  { label: "Yesterday",  days: 1 },
  { label: "Last 7 Days",days: 7 },
  { label: "Last 30 Days",days:30 },
  { label: "This Month", days: "month" },
  { label: "All Time",   days: "all" },
];

function fmtDate(d) { return d.toISOString().split("T")[0]; }

function getRange(preset) {
  const today = new Date();
  if (preset.days === "all") return { from: null, to: null };
  if (preset.days === "month") {
    return {
      from: fmtDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      to:   fmtDate(today),
    };
  }
  if (preset.days === 1) {
    const y = new Date(today); y.setDate(today.getDate() - 1);
    return { from: fmtDate(y), to: fmtDate(y) };
  }
  if (preset.days === 0) return { from: fmtDate(today), to: fmtDate(today) };
  const from = new Date(today); from.setDate(today.getDate() - (preset.days - 1));
  return { from: fmtDate(from), to: fmtDate(today) };
}

export default function DashboardFilter({ dateFrom, dateTo }) {
  const router     = useRouter();
  const pathname   = usePathname();
  const sp         = useSearchParams();
  const [custom, setCustom] = useState(false);
  const [from, setFrom]     = useState(dateFrom || "");
  const [to, setTo]         = useState(dateTo   || "");

  const apply = (f, t) => {
    const params = new URLSearchParams(sp.toString());
    if (f) params.set("from", f); else params.delete("from");
    if (t) params.set("to",   t); else params.delete("to");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeLabel = () => {
    if (!dateFrom && !dateTo) return "All Time";
    if (dateFrom === dateTo) return dateFrom;
    return `${dateFrom} → ${dateTo}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Preset buttons */}
      {PRESETS.map((p) => {
        const r = getRange(p);
        const active =
          (r.from === (dateFrom || null)) && (r.to === (dateTo || null));
        return (
          <button
            key={p.label}
            onClick={() => { setCustom(false); apply(r.from, r.to); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              active
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {p.label}
          </button>
        );
      })}

      {/* Custom range */}
      <button
        onClick={() => setCustom((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
          custom
            ? "bg-violet-600 text-white border-violet-600"
            : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
        }`}
      >
        <FiCalendar className="w-3.5 h-3.5" />
        Custom
        <FiChevronDown className={`w-3 h-3 transition-transform ${custom ? "rotate-180" : ""}`} />
      </button>

      {custom && (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
          <input
            type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="text-xs border-0 outline-none text-gray-700 bg-transparent"
          />
          <span className="text-gray-400 text-xs">→</span>
          <input
            type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="text-xs border-0 outline-none text-gray-700 bg-transparent"
          />
          <button
            onClick={() => { apply(from, to); setCustom(false); }}
            className="ml-1 px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      )}

      {/* Active range badge */}
      {(dateFrom || dateTo) && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700 font-medium">
          <FiCalendar className="w-3 h-3" />
          {activeLabel()}
          <button onClick={() => apply(null, null)} className="ml-1 hover:text-red-500">
            <FiX className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
