import { Heart, X, Plus, MapPin } from 'lucide-react';
import type { City, FavouriteCity, TemperatureUnit } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface FavouriteCitiesProps {
  favourites: FavouriteCity[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
  onAddCity: (city: City) => { success: boolean; error?: string };
  onRemoveCity: (city: City) => void;
  confirmingRemoval: City | null;
  onCancelRemoval: () => void;
  onConfirmRemoval: () => void;
  unit: TemperatureUnit;
}

export function FavouriteCities({
  favourites,
  selectedCity,
  onSelectCity,
  onRemoveCity,
  confirmingRemoval,
  onCancelRemoval,
  onConfirmRemoval,
}: FavouriteCitiesProps) {
  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            Favourites
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {favourites.length}/5
          </span>
        </div>

        {favourites.length === 0 ? (
          <div className="text-center py-6">
            <Heart className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No favourite cities yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Select a city and click the heart icon to save it
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {favourites.map((fav) => {
              const isSelected =
                selectedCity?.coordinates.lat === fav.city.coordinates.lat &&
                selectedCity?.coordinates.lon === fav.city.coordinates.lon;

              return (
                <div
                  key={`${fav.city.coordinates.lat}-${fav.city.coordinates.lon}`}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-900/30 ring-1 ring-sky-200 dark:ring-sky-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() => onSelectCity(fav.city)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectCity(fav.city); }}
                >
                  <MapPin className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-sky-500' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-white'}`}>
                      {fav.city.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {fav.city.country}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCity(fav.city);
                    }}
                    className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                    aria-label={`Remove ${fav.city.name} from favourites`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {favourites.length >= 5 && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 text-center">
            Maximum of 5 favourites reached
          </p>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmingRemoval !== null}
        title="Remove Favourite"
        message={`Remove ${confirmingRemoval?.name || 'this city'} from your favourites?`}
        confirmLabel="Remove"
        cancelLabel="Keep"
        onConfirm={onConfirmRemoval}
        onCancel={onCancelRemoval}
      />
    </>
  );
}

// Add to favourites button (used in weather display)
interface AddFavouriteButtonProps {
  city: City;
  isFavourite: boolean;
  onAdd: (city: City) => { success: boolean; error?: string };
  onRemove: (city: City) => void;
}

export function AddFavouriteButton({ city, isFavourite, onAdd, onRemove }: AddFavouriteButtonProps) {
  const handleClick = () => {
    if (isFavourite) {
      onRemove(city);
    } else {
      const result = onAdd(city);
      if (!result.success && result.error) {
        // Could show a toast here but keeping it simple
        alert(result.error);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
        isFavourite
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
      }`}
      aria-label={isFavourite ? `Remove ${city.name} from favourites` : `Add ${city.name} to favourites`}
    >
      {isFavourite ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {isFavourite ? 'Saved' : 'Save'}
    </button>
  );
}
