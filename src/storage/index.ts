/**
 * Browser localStorage wrapper with JSON serialization and error handling.
 * Works in Expo Web (Vercel) and standard browser environments.
 */

const PREFIX = 'mwanacare_';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    if (!isBrowser()) return defaultValue;
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    if (!isBrowser()) return;
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to set localStorage item "${key}":`, e);
  }
}

export function removeItem(key: string): void {
  try {
    if (!isBrowser()) return;
    window.localStorage.removeItem(PREFIX + key);
  } catch (e) {
    console.warn(`Failed to remove localStorage item "${key}":`, e);
  }
}

export function clearAll(): void {
  try {
    if (!isBrowser()) return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch (e) {
    console.warn('Failed to clear app localStorage data:', e);
  }
}

