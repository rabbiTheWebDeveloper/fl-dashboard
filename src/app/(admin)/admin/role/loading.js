export default function AdminRoleLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 rounded-3xl bg-white border border-slate-200 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-2xl bg-white border border-slate-200 p-4 space-y-2"
          >
            <div className="w-24 h-3 rounded bg-slate-200 animate-pulse" />
            <div className="w-16 h-6 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse" />
    </div>
  );
}
