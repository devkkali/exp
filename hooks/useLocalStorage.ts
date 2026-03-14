'use client';

import { useState, useEffect, useCallback } from 'react';
function readStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }

  return initialValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initialValue));
  const isLoaded = true;

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setValue(updater);
  }, []);

  return [value, update, isLoaded] as const;
}
