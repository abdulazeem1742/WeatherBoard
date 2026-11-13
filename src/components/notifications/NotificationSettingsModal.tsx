import { useState } from 'react';
import { Bell, X, Clock, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import type { NotificationSettings } from '../../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  isSupported: boolean;
  onUpdateEnabled: (enabled: boolean) => Promise<void>;
  onUpdateReminderTime: (time: string) => void;
  onRequestPermission: () => Promise<NotificationPermission>;
  timeError: string | null;
}

export function NotificationSettingsModal({
  isOpen,
  onClose,
  settings,
  isSupported,
  onUpdateEnabled,
  onUpdateReminderTime,
  onRequestPermission,
  timeError,
}: NotificationSettingsModalProps) {
  const [localTime, setLocalTime] = useState(settings.reminderTime);
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const handleTimeBlur = () => {
    onUpdateReminderTime(localTime);
  };

  const handleEnableToggle = async () => {
    if (!settings.enabled) {
      if (settings.permissionStatus !== 'granted') {
        setIsRequesting(true);
        const perm = await onRequestPermission();
        setIsRequesting(false);
        if (perm === 'granted') {
          await onUpdateEnabled(true);
        }
      } else {
        await onUpdateEnabled(true);
      }
    } else {
      await onUpdateEnabled(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 id="notification-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Daily Forecast Alerts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weather reminders and morning briefing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-5">
          {!isSupported ? (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Notifications Unsupported</p>
                <p>Your current browser does not support the Web Notifications API.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Permission Banner */}
              {settings.permissionStatus === 'denied' && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3.5 text-xs text-red-800 dark:text-red-300 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <span className="font-semibold">Permission Blocked:</span> Notifications are blocked in your browser settings. Please enable notifications for this site in your browser URL bar to receive morning alerts.
                  </div>
                </div>
              )}

              {settings.permissionStatus === 'granted' && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Browser notifications are authorized.</span>
                </div>
              )}

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <div className="pr-4">
                  <label htmlFor="daily-alert-toggle" className="text-sm font-medium text-slate-900 dark:text-white block cursor-pointer">
                    Enable Morning Reminder
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Receive daily weather highlights at your preferred morning hour.
                  </p>
                </div>
                <button
                  id="daily-alert-toggle"
                  type="button"
                  role="switch"
                  aria-checked={settings.enabled}
                  disabled={settings.permissionStatus === 'denied' || isRequesting}
                  onClick={handleEnableToggle}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    settings.enabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Preferred Time Picker */}
              <div className="space-y-1.5">
                <label htmlFor="reminder-time-input" className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Preferred Reminder Time
                </label>
                <div className="relative">
                  <input
                    id="reminder-time-input"
                    type="time"
                    value={localTime}
                    disabled={!settings.enabled}
                    onChange={(e) => setLocalTime(e.target.value)}
                    onBlur={handleTimeBlur}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                  />
                </div>
                {timeError && (
                  <p className="text-xs text-red-600 dark:text-red-400 pl-1">{timeError}</p>
                )}
              </div>

              {/* Transparency & Limitations Note */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/40 p-3 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <Info className="h-3.5 w-3.5 text-sky-500" />
                  <span>Client-Side Delivery Architecture:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  As a purely client-side application without a remote push server, notifications are scheduled and delivered reliably via the Web Worker / Service Worker while the application is active or running as a progressive web app.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
