import { useState, useCallback, useEffect, useRef } from 'react';
import { getNotificationSettings, saveNotificationSettings } from '../utils/storage';
import type { NotificationSettings } from '../types';
import { isValidTime } from '../utils/formatting';

interface UseNotificationsReturn {
  settings: NotificationSettings;
  isSupported: boolean;
  updateEnabled: (enabled: boolean) => Promise<void>;
  updateReminderTime: (time: string) => void;
  requestPermission: () => Promise<NotificationPermission>;
  timeError: string | null;
  showPermissionExplanation: boolean;
  setShowPermissionExplanation: (show: boolean) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [showPermissionExplanation, setShowPermissionExplanation] = useState(false);
  const reminderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported = typeof Notification !== 'undefined';

  // Update permission status
  useEffect(() => {
    if (isSupported) {
      setSettings((prev) => ({
        ...prev,
        permissionStatus: Notification.permission,
      }));
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';

    try {
      const result = await Notification.requestPermission();
      setSettings((prev) => {
        const updated = { ...prev, permissionStatus: result };
        saveNotificationSettings(updated);
        return updated;
      });
      return result;
    } catch {
      return 'denied';
    }
  }, [isSupported]);

  const updateEnabled = useCallback(async (enabled: boolean) => {
    if (enabled && isSupported && Notification.permission === 'default') {
      setShowPermissionExplanation(true);
      return;
    }

    if (enabled && isSupported && Notification.permission === 'denied') {
      return;
    }

    setSettings((prev) => {
      const updated = { ...prev, enabled };
      saveNotificationSettings(updated);
      return updated;
    });
  }, [isSupported]);

  const updateReminderTime = useCallback((time: string) => {
    if (!isValidTime(time)) {
      setTimeError('Please enter a valid time in HH:MM format (e.g., 08:00).');
      return;
    }
    setTimeError(null);
    setSettings((prev) => {
      const updated = { ...prev, reminderTime: time };
      saveNotificationSettings(updated);
      return updated;
    });
  }, []);

  // Active-page reminder scheduler
  useEffect(() => {
    if (!settings.enabled || !isSupported || Notification.permission !== 'granted') {
      if (reminderTimerRef.current) {
        clearInterval(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
      return;
    }

    // Check every minute if it's time for reminder
    const checkReminder = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (currentTime === settings.reminderTime) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: 'WeatherBoard',
            body: 'Time to check today\'s weather forecast! ☀️',
          });
        } else {
          new Notification('WeatherBoard', {
            body: 'Time to check today\'s weather forecast! ☀️',
            icon: '/icons/icon-192x192.png',
          });
        }
      }
    };

    reminderTimerRef.current = setInterval(checkReminder, 60000);

    return () => {
      if (reminderTimerRef.current) {
        clearInterval(reminderTimerRef.current);
      }
    };
  }, [settings.enabled, settings.reminderTime, isSupported]);

  return {
    settings,
    isSupported,
    updateEnabled,
    updateReminderTime,
    requestPermission,
    timeError,
    showPermissionExplanation,
    setShowPermissionExplanation,
  };
}
