import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';

export class NativeService {
  /**
   * Provide tactile haptic feedback on user taps & interactions
   */
  static async hapticTap(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Fallback in desktop/browser mode
    }
  }

  static async hapticSuccess(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      //
    }
  }

  static async hapticWarning(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      //
    }
  }

  static async hapticError(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      //
    }
  }

  /**
   * Trigger native OS system share dialog (WhatsApp, Messages, Telegram, etc.)
   */
  static async shareContent(options: {
    title: string;
    text: string;
    url?: string;
    dialogTitle?: string;
  }): Promise<boolean> {
    try {
      const canShare = await Share.canShare();
      if (canShare.value) {
        await Share.share(options);
        return true;
      }
    } catch {
      // Fallback to Web Share API or Clipboard
      if (navigator.share) {
        try {
          await navigator.share(options);
          return true;
        } catch {
          // User dismissed
        }
      }
    }
    
    // Copy to clipboard fallback
    try {
      const copyText = `${options.title}\n\n${options.text}${options.url ? `\n${options.url}` : ''}`;
      await navigator.clipboard.writeText(copyText);
      alert('Alert information copied to clipboard!');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Network connection listener & state check
   */
  static async getNetworkStatus(): Promise<{ connected: boolean; connectionType: string }> {
    try {
      return await Network.getStatus();
    } catch {
      return { connected: navigator.onLine, connectionType: 'unknown' };
    }
  }

  static addNetworkListener(callback: (status: { connected: boolean; connectionType: string }) => void) {
    try {
      return Network.addListener('networkStatusChange', callback);
    } catch {
      const onlineHandler = () => callback({ connected: true, connectionType: 'wifi' });
      const offlineHandler = () => callback({ connected: false, connectionType: 'none' });
      window.addEventListener('online', onlineHandler);
      window.addEventListener('offline', offlineHandler);
      return {
        remove: () => {
          window.removeEventListener('online', onlineHandler);
          window.removeEventListener('offline', offlineHandler);
        },
      };
    }
  }

  /**
   * Persistent Key-Value Storage via Capacitor Preferences
   */
  static async setStorage(key: string, value: any): Promise<void> {
    const stringVal = JSON.stringify(value);
    try {
      await Preferences.set({ key, value: stringVal });
    } catch {
      localStorage.setItem(key, stringVal);
    }
  }

  static async getStorage<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const res = await Preferences.get({ key });
      if (res.value !== null && res.value !== undefined) {
        return JSON.parse(res.value) as T;
      }
    } catch {
      const local = localStorage.getItem(key);
      if (local !== null) {
        try {
          return JSON.parse(local) as T;
        } catch {
          //
        }
      }
    }
    return defaultValue;
  }

  /**
   * Set mobile status bar appearance
   */
  static async setStatusBarStyle(isDark: boolean): Promise<void> {
    try {
      await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
      await StatusBar.setBackgroundColor({ color: isDark ? '#090d16' : '#ffffff' });
    } catch {
      // Browser mode
    }
  }
}
