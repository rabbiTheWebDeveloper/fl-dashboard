export default function SubscriptionLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      <div className="h-44 rounded-3xl bg-white border border-slate-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse" />
        <div className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
