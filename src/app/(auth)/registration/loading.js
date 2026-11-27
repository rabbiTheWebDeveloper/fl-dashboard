import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-slate-950 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/register-bg.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/65" />
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="rounded-3xl border-white/15 bg-slate-900/75 backdrop-blur-2xl py-8 shadow-2xl">
          <CardHeader className="px-6 sm:px-8 space-y-3">
            <Skeleton className="h-5 w-40 rounded-full bg-white/10" />
            <Skeleton className="h-8 w-64 rounded-lg bg-white/10" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md bg-white/10" />
          </CardHeader>
          <CardContent className="px-6 sm:px-8 space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
              <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
              <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
              <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl bg-white/15 mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
