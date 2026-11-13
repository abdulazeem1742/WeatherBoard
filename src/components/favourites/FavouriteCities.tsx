import { Heart, X, MapPin } from 'lucide-react';
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
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
            Saved Locations
          </h3>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {favourites.length}/5
          </span>
        </div>

        {favourites.length === 0 ? (
          <div className="text-center py-8 px-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-400 dark:text-rose-500 mx-auto mb-2.5">
              <Heart className="h-6 w-6 stroke-[1.5]" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No favourites yet</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
              Click the save button on any city to pin it here for instant 1-click access.
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
                  className={`group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-sky-500/10 dark:bg-sky-500/15 border border-sky-300/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 shadow-sm'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60'
                  }`}
                  onClick={() => onSelectCity(fav.city)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectCity(fav.city); }}
                >
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400 group-hover:text-sky-500'} transition-colors`}>
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-sky-900 dark:text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                      {fav.city.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      {fav.city.country}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCity(fav.city);
                    }}
                    className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all active:scale-90"
                    aria-label={`Remove ${fav.city.name} from favourites`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {favourites.length >= 5 && (
          <p className="mt-3 text-[11px] font-medium text-amber-600 dark:text-amber-400 text-center bg-amber-50/60 dark:bg-amber-950/20 py-1.5 px-2 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
            Maximum of 5 saved cities reached
          </p>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmingRemoval !== null}
        title="Remove Saved City"
        message={`Remove ${confirmingRemoval?.name || 'this city'} from your favourites list?`}
        confirmLabel="Remove"
        cancelLabel="Keep"
        onConfirm={onConfirmRemoval}
        onCancel={onCancelRemoval}
      />
    </>
  );
}

// Add to favourites button with pop animation
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
        alert(result.error);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm min-h-[40px] ${
        isFavourite
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60'
          : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
      }`}
      aria-label={isFavourite ? `Remove ${city.name} from favourites` : `Add ${city.name} to favourites`}
    >
      <Heart className={`h-4 w-4 transition-transform duration-200 ${isFavourite ? 'fill-current text-rose-500 scale-110' : 'text-slate-400'}`} />
      <span>{isFavourite ? 'Saved' : 'Save City'}</span>
    </button>
  );
}
