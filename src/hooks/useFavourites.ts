import { useState, useCallback } from 'react';
import type { City, FavouriteCity } from '../types';
import {
  getFavourites,
  addFavourite,
  removeFavourite as removeFavouriteFromStorage,
  isFavourite as checkIsFavourite,
} from '../utils/storage';

interface UseFavouritesReturn {
  favourites: FavouriteCity[];
  addCity: (city: City) => { success: boolean; error?: string };
  removeCity: (city: City) => void;
  isFavourite: (city: City) => boolean;
  confirmingRemoval: City | null;
  setConfirmingRemoval: (city: City | null) => void;
  confirmRemoval: () => void;
}

export function useFavourites(): UseFavouritesReturn {
  const [favourites, setFavourites] = useState<FavouriteCity[]>(() => getFavourites());
  const [confirmingRemoval, setConfirmingRemoval] = useState<City | null>(null);

  const refreshFavourites = useCallback(() => {
    setFavourites(getFavourites());
  }, []);

  const addCity = useCallback((city: City): { success: boolean; error?: string } => {
    const result = addFavourite(city);
    if (result.success) {
      refreshFavourites();
    }
    return result;
  }, [refreshFavourites]);

  const removeCity = useCallback((city: City) => {
    setConfirmingRemoval(city);
  }, []);

  const confirmRemoval = useCallback(() => {
    if (confirmingRemoval) {
      removeFavouriteFromStorage(confirmingRemoval);
      refreshFavourites();
      setConfirmingRemoval(null);
    }
  }, [confirmingRemoval, refreshFavourites]);

  const isFavourite = useCallback((city: City): boolean => {
    return checkIsFavourite(city);
  }, []);

  return {
    favourites,
    addCity,
    removeCity,
    isFavourite,
    confirmingRemoval,
    setConfirmingRemoval,
    confirmRemoval,
  };
}
