import { useState, useCallback } from 'react';
import type { TemperatureUnit } from '../types';
import { getStoredTempUnit, saveTempUnit } from '../utils/storage';

interface UseTemperatureUnitReturn {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
}

export function useTemperatureUnit(): UseTemperatureUnitReturn {
  const [unit, setUnitState] = useState<TemperatureUnit>(() => getStoredTempUnit());

  const setUnit = useCallback((newUnit: TemperatureUnit) => {
    setUnitState(newUnit);
    saveTempUnit(newUnit);
  }, []);

  const toggleUnit = useCallback(() => {
    setUnitState((current) => {
      const next = current === 'celsius' ? 'fahrenheit' : 'celsius';
      saveTempUnit(next);
      return next;
    });
  }, []);

  return { unit, setUnit, toggleUnit };
}
