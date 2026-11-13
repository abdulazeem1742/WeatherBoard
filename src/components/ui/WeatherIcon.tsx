import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
} from 'lucide-react';
import type { WeatherCondition } from '../../types';

interface WeatherIconProps {
  condition: WeatherCondition;
  iconCode?: string; // e.g. "01d", "01n", "10d", etc.
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function WeatherIcon({
  condition,
  iconCode = '01d',
  className = '',
  size = 'md',
}: WeatherIconProps) {
  // Check if it's night time based on the OpenWeatherMap icon code ending in 'n'
  const isNight = iconCode.endsWith('n');

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24 sm:h-28 sm:w-28',
  }[size];

  // Map weather conditions to dedicated, beautiful SVG icons
  switch (condition) {
    case 'clear':
      if (isNight) {
        return (
          <div className={`relative flex items-center justify-center ${className}`}>
            <Moon className={`${sizeClasses} text-sky-200 fill-sky-200/20 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]`} />
          </div>
        );
      }
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <Sun className={`${sizeClasses} text-amber-400 fill-amber-400/20 drop-shadow-[0_0_16px_rgba(251,191,36,0.5)] animate-slow-spin`} />
        </div>
      );

    case 'partly-cloudy':
      if (isNight) {
        return (
          <div className={`relative flex items-center justify-center ${className}`}>
            <CloudMoon className={`${sizeClasses} text-sky-200 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]`} />
          </div>
        );
      }
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudSun className={`${sizeClasses} text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]`} />
        </div>
      );

    case 'cloudy':
    case 'overcast':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <Cloud className={`${sizeClasses} text-slate-200 fill-slate-200/20 drop-shadow-md`} />
        </div>
      );

    case 'rain':
    case 'heavy-rain':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudRain className={`${sizeClasses} text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]`} />
        </div>
      );

    case 'drizzle':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudDrizzle className={`${sizeClasses} text-cyan-200 drop-shadow-sm`} />
        </div>
      );

    case 'thunderstorm':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudLightning className={`${sizeClasses} text-amber-300 drop-shadow-[0_0_16px_rgba(252,211,77,0.5)]`} />
        </div>
      );

    case 'snow':
    case 'heavy-snow':
    case 'sleet':
    case 'hail':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudSnow className={`${sizeClasses} text-cyan-100 drop-shadow-[0_0_10px_rgba(207,250,254,0.4)]`} />
        </div>
      );

    case 'mist':
    case 'fog':
    case 'haze':
    case 'smoke':
    case 'dust':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudFog className={`${sizeClasses} text-slate-300 drop-shadow-sm`} />
        </div>
      );

    case 'wind':
    case 'tornado':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <Wind className={`${sizeClasses} text-teal-200 drop-shadow-sm`} />
        </div>
      );

    default:
      return isNight ? (
        <Moon className={`${sizeClasses} text-sky-200`} />
      ) : (
        <Sun className={`${sizeClasses} text-amber-400`} />
      );
  }
}
