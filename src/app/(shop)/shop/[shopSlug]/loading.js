export default function StorefrontLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Announcement Skeleton */}
      <div className="h-9 bg-slate-900/90 animate-pulse" />

      {/* Sticky Header Skeleton */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="space-y-1.5">
              <div className="w-32 h-4 rounded bg-slate-200 animate-pulse" />
              <div className="w-20 h-2.5 rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
          <div className="hidden md:block flex-1 max-w-md h-10 rounded-xl bg-slate-100 animate-pulse" />
          <div className="w-28 h-10 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="h-64 sm:h-80 rounded-3xl bg-slate-200/80 animate-pulse" />
      </div>

      {/* Category Chips Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex gap-2.5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 w-28 rounded-full bg-slate-200/80 animate-pulse shrink-0"
          />
        ))}
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3"
          >
            <div className="aspect-square rounded-xl bg-slate-200/80 animate-pulse" />
            <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
            <div className="flex items-center justify-between pt-1">
              <div className="h-5 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-8 w-20 rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
