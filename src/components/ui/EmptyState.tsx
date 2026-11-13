import { CloudSun } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Search for a city',
  description = 'Enter a city name above to see the current weather and forecast.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 text-slate-300 dark:text-slate-600">
        {icon || <CloudSun className="h-20 w-20 stroke-[1.2]" />}
      </div>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
    </div>
  );
}
