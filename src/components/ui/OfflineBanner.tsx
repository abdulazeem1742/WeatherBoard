import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
      <div className="mx-auto max-w-6xl flex items-center justify-center gap-2 text-sm text-amber-700 dark:text-amber-300">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Showing cached weather data that may be outdated.</span>
      </div>
    </div>
  );
}
