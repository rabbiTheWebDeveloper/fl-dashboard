"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRESETS = [
  { label: "Today", days: 0 },
  { label: "Yesterday", days: 1 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "This Month", days: "month" },
  { label: "All Time", days: "all" },
];

function fmtDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRange(preset) {
  const today = new Date();
  if (preset.days === "all") return { from: null, to: null };
  if (preset.days === "month") {
    return {
      from: fmtDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      to: fmtDate(today),
    };
  }
  if (preset.days === 1) {
    const y = new Date(today);
    y.setDate(today.getDate() - 1);
    return { from: fmtDate(y), to: fmtDate(y) };
  }
  if (preset.days === 0) return { from: fmtDate(today), to: fmtDate(today) };
  const from = new Date(today);
  from.setDate(today.getDate() - (preset.days - 1));
  return { from: fmtDate(from), to: fmtDate(today) };
}

export default function DashboardFilter({ dateFrom, dateTo }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [custom, setCustom] = useState(false);
  const [from, setFrom] = useState(dateFrom || "");
  const [to, setTo] = useState(dateTo || "");

  const apply = (f, t) => {
    const params = new URLSearchParams(sp.toString());
    if (f) params.set("from", f);
    else params.delete("from");
    if (t) params.set("to", t);
    else params.delete("to");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const activeLabel = () => {
    if (!dateFrom && !dateTo) return "All Time";
    if (dateFrom === dateTo) return dateFrom;
    return `${dateFrom || "Start"} → ${dateTo || "Now"}`;
  };

  return (
    <div className="space-y-2.5">
      {/* Horizontal swipeable chip strip on mobile, wraps cleanly on desktop */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden sm:flex-wrap -mx-1 px-1 pb-0.5">
        {PRESETS.map((p) => {
          const r = getRange(p);
          const active =
            r.from === (dateFrom || null) && r.to === (dateTo || null);
          return (
            <Button
              key={p.label}
              type="button"
              size="sm"
              variant={active ? "gradient" : "outline"}
              onClick={() => {
                setCustom(false);
                apply(r.from, r.to);
              }}
              className="h-8 text-xs rounded-full sm:rounded-lg shrink-0"
            >
              {p.label}
            </Button>
          );
        })}

        <Button
          type="button"
          size="sm"
          variant={custom ? "default" : "outline"}
          onClick={() => setCustom((v) => !v)}
          className="h-8 text-xs rounded-full sm:rounded-lg shrink-0"
        >
          <Calendar className="w-3.5 h-3.5" />
          Custom
          <ChevronDown
            className={`w-3 h-3 transition-transform ${custom ? "rotate-180" : ""}`}
          />
        </Button>

        {(dateFrom || dateTo) && (
          <Badge
            variant="outline"
            className="h-8 px-2.5 gap-1.5 rounded-full sm:rounded-lg bg-violet-50/80 text-violet-700 border-violet-200 text-xs font-medium shrink-0"
          >
            <Calendar className="w-3 h-3" />
            {activeLabel()}
            <button
              type="button"
              onClick={() => apply(null, null)}
              className="ml-0.5 hover:text-rose-600 transition-colors"
              aria-label="Clear filter"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
      </div>

      {custom && (
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 p-3">
          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-9 sm:h-8 sm:w-36 bg-white text-xs"
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 sm:h-8 sm:w-36 bg-white text-xs"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="gradient"
            className="h-9 sm:h-8 text-xs w-full sm:w-auto"
            onClick={() => {
              apply(from, to);
              setCustom(false);
            }}
          >
            Apply Dates
          </Button>
        </div>
      )}
    </div>
  );
}
