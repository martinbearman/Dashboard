"use client";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-slate-200/20 dark:bg-white/10 ${className ?? ""}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6 bg-slate-700/60" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Skeleton className="md:col-span-3 h-40 bg-white/5 shadow-inner" />
          <Skeleton className="md:col-span-3 h-40 bg-white/5 shadow-inner" />
          <Skeleton className="md:col-span-3 h-40 bg-white/5 shadow-inner" />
          <Skeleton className="md:col-span-3 h-40 bg-white/5 shadow-inner" />
        </div>
      </div>
    </div>
  );
}


