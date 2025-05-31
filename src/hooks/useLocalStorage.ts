import { useState, useEffect } from "react";

interface UseLocalStorageOptions {
  onError?: (error: Error) => void;
  syncAcrossTabs?: boolean;
}

export function useLocalStorage<T>(
  key: string, 
  initialValue: T | null,
  options: UseLocalStorageOptions = {}
) {
  const { 
    onError = console.error,
    syncAcrossTabs = true 
  } = options;

  // State to store our value
  const [storedValue, setStoredValue] = useState<T | null>(initialValue);

  // Initialize on mount only
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      onError(error as Error);
    }
  }, [key, initialValue, onError]);

  // Return a wrapped version of useState's setter function
  const setValue = (value: T | null | ((prev: T | null) => T | null)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== "undefined") {
        if (valueToStore === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      onError(error as Error);
    }
  };

  // Listen to changes in other tabs/windows
  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : null;
          setStoredValue(newValue);
        } catch {
          setStoredValue(event.newValue as T | null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, syncAcrossTabs]);

  return { storedValue, setValue } as const;
}