export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 rounded-3xl bg-slate-200/75 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-2xl bg-white border border-slate-200 p-4 space-y-3"
          >
            <div className="w-24 h-3 rounded bg-slate-200 animate-pulse" />
            <div className="w-32 h-6 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-80 rounded-3xl bg-white border border-slate-200 animate-pulse" />
        <div className="lg:col-span-4 h-80 rounded-3xl bg-white border border-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
