import { Skeleton } from '../ui/Skeleton';

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      {/* Current weather skeleton */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-400/30 to-blue-500/30 dark:from-sky-800/30 dark:to-blue-900/30 p-6 md:p-8">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-16 w-36 mb-3" />
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-200/30 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details skeleton */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <Skeleton className="h-4 w-28 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-3 w-14 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 py-3">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
