import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <Card className="rounded-3xl border-slate-200/80 py-8 shadow-lg">
          <CardHeader className="px-6 sm:px-8 space-y-3">
            <Skeleton className="h-5 w-40 rounded-full" />
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          </CardHeader>
          <CardContent className="px-6 sm:px-8 space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
