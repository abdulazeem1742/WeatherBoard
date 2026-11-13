import { useState } from 'react';
import { Header, Footer } from './components/layout';
import { CurrentWeather, WeatherDetails, WeatherSkeleton } from './components/weather';
import { ForecastCard } from './components/forecast';
import { FavouriteCities, AddFavouriteButton } from './components/favourites';
import { NotificationSettingsModal } from './components/notifications';
import { ErrorMessage, OfflineBanner, EmptyState } from './components/ui';
import {
  useWeather,
  useFavourites,
  useTheme,
  useNotifications,
  useTemperatureUnit,
} from './hooks';

export function App() {
  const {
    selectedCity,
    weatherData,
    usedFallback,
    selectCity,
    selectFavouriteCity,
    retry,
    isOffline,
  } = useWeather();

  const {
    favourites,
    addCity,
    removeCity,
    isFavourite,
    confirmingRemoval,
    setConfirmingRemoval,
    confirmRemoval,
  } = useFavourites();

  const { theme, toggleTheme } = useTheme();
  const { unit, toggleUnit } = useTemperatureUnit();
  const {
    settings: notificationSettings,
    isSupported: notificationsSupported,
    updateEnabled: updateNotificationEnabled,
    updateReminderTime,
    requestPermission,
    timeError,
  } = useNotifications();

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Offline Alert Strip */}
      {isOffline && <OfflineBanner />}

      {/* Navigation & Header */}
      <Header
        onCitySelect={selectCity}
        theme={theme}
        onToggleTheme={toggleTheme}
        tempUnit={unit}
        onToggleTempUnit={toggleUnit}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        notificationsEnabled={notificationSettings.enabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Weather Column (8 cols on desktop) */}
          <section className="lg:col-span-8 space-y-6">
            {weatherData.status === 'loading' && <WeatherSkeleton />}

            {weatherData.status === 'error' && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
                <ErrorMessage
                  message={weatherData.error}
                  onRetry={weatherData.retryable ? retry : undefined}
                />
              </div>
            )}

            {weatherData.status === 'idle' && (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-8">
                <EmptyState
                  title="Explore Weather Worldwide"
                  description="Use the search bar above to look up real-time weather and 5-day forecasts for any major city."
                  onSelectQuickCity={selectCity}
                />
              </div>
            )}

            {weatherData.status === 'success' && (
              <>
                {/* Header controls for selected city */}
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {weatherData.data.current.city.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {weatherData.data.current.city.region
                        ? `${weatherData.data.current.city.region}, `
                        : ''}
                      {weatherData.data.current.city.country}
                    </p>
                  </div>
                  <AddFavouriteButton
                    city={weatherData.data.current.city}
                    isFavourite={isFavourite(weatherData.data.current.city)}
                    onAdd={addCity}
                    onRemove={removeCity}
                  />
                </div>

                {/* Primary Weather Widget */}
                <CurrentWeather
                  weather={weatherData.data.current}
                  unit={unit}
                  isOffline={isOffline}
                  usedFallback={usedFallback}
                />

                {/* Extended Details */}
                <WeatherDetails weather={weatherData.data.current} />

                {/* 5-Day Forecast */}
                <ForecastCard
                  days={weatherData.data.forecast.days}
                  unit={unit}
                />
              </>
            )}
          </section>

          {/* Sidebar Column (4 cols on desktop) */}
          <aside className="lg:col-span-4 space-y-6">
            <FavouriteCities
              favourites={favourites}
              selectedCity={selectedCity}
              onSelectCity={selectFavouriteCity}
              onAddCity={addCity}
              onRemoveCity={removeCity}
              confirmingRemoval={confirmingRemoval}
              onCancelRemoval={() => setConfirmingRemoval(null)}
              onConfirmRemoval={confirmRemoval}
              unit={unit}
            />

            {/* Weather Tip Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resilient Architecture
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                WeatherBoard utilizes OpenWeatherMap with automatic fallback to Open-Meteo. Autocomplete is driven by GeoDB Cities. Last-viewed city data is stored offline via Service Worker &amp; LocalStorage.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Notification Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        isSupported={notificationsSupported}
        onUpdateEnabled={updateNotificationEnabled}
        onUpdateReminderTime={updateReminderTime}
        onRequestPermission={requestPermission}
        timeError={timeError}
      />
    </div>
  );
}

export default App;
