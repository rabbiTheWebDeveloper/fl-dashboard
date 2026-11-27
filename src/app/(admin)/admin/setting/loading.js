export default function AdminSettingLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 rounded-3xl bg-white border border-slate-200 animate-pulse" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 w-36 rounded-xl bg-white border border-slate-200 animate-pulse shrink-0"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-96 rounded-3xl bg-white border border-slate-200 animate-pulse" />
        <div className="lg:col-span-4 h-96 rounded-3xl bg-white border border-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
