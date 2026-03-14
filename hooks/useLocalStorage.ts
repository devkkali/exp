'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, [key]);

  // Persist to localStorage on change (skip initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value, isLoaded]);

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setValue(updater);
  }, []);

  return [value, update, isLoaded] as const;
}
