import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-slate-950 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/register-bg.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/65" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="rounded-3xl border-white/15 bg-slate-900/78 backdrop-blur-2xl py-8 shadow-2xl">
          <CardHeader className="px-6 sm:px-8 space-y-3">
            <Skeleton className="h-5 w-36 rounded-full bg-white/10" />
            <Skeleton className="h-8 w-56 rounded-lg bg-white/10" />
            <Skeleton className="h-4 w-64 max-w-full rounded-md bg-white/10" />
          </CardHeader>
          <CardContent className="px-6 sm:px-8 space-y-4 pt-2">
            <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
            <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
            <Skeleton className="h-5 w-36 rounded-md bg-white/10" />
            <Skeleton className="h-12 w-full rounded-xl bg-white/15 mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
