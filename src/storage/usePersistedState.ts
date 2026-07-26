import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from './index';

/**
 * A hook like useState but persisted to localStorage.
 * Useful for settings, vaccine status, baby data, etc.
 *
 * @param key - localStorage key (prefix added automatically)
 * @param defaultValue - fallback if no stored value exists
 */
export function usePersistedState<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    return getItem<T>(key, defaultValue);
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    setItem<T>(key, state);
  }, [key, state]);

  const setPersistedState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(value);
    },
    []
  );

  return [state, setPersistedState];
}

