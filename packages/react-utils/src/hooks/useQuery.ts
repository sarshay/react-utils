import { useCallback, useMemo, useState, useEffect } from "react";


/**
 * Hook for managing URL query parameters with automatic parsing and updating
 * 
 * @template T - Type for the query parameters object
 * @param defaultValue - Default value to return when no query parameters exist
 * @returns [query, setQuery] - Current query object and setter function
 */
export const useQuery = <T = any>(defaultValue?: T) => {
  const [url, setUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  });

  useEffect(() => {
    const handlePopState = () => {
      setUrl(window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const searchParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, [url]);

  const pathname = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.pathname;
  }, [url]);

  // Parse current URL params into object using existing utility
  const query = useMemo(() => {
    const parsed = paramsObject(searchParams) as T;
    
    // If no params exist and defaultValue is provided, return defaultValue
    if (Object.keys(parsed as object).length === 0 && defaultValue !== undefined) {
      return defaultValue;
    }
    
    return parsed;
  }, [searchParams, defaultValue]);

  // Function to update query parameters
  const setQuery = useCallback((newQuery: T | null) => {
    if (typeof window === 'undefined') return;

    if (newQuery === null) {
      // Clear all query parameters
      const newUrl = pathname;
      window.history.pushState({}, '', newUrl);
      setUrl(window.location.href);
      return;
    }

    // Create new URLSearchParams from the new query object
    const params = new URLSearchParams();

    const addToParams = (value: any, prefix: string = '') => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          addToParams(item, `${prefix}[${idx}]`);
        });
      } else if (typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]') {
        Object.entries(value).forEach(([key, val]) => {
          const newPrefix = prefix ? `${prefix}[${key}]` : key;
          addToParams(val, newPrefix);
        });
      } else {
        params.set(prefix, String(value));
      }
    };

    addToParams(newQuery);

    // Navigate to new URL with updated query params
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.pushState({}, '', newUrl);
    setUrl(window.location.href);
  }, [pathname]);

  return [query, setQuery] as const;
};

export const paramsObject = (params: URLSearchParams) => {
  if (!params || params.toString().length === 0) return {};

  // Helper function to convert string values to appropriate types
  const convertValue = (value: string): any => {
    // Try to convert to number
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return Number(value);
    }
    // Try to convert to boolean
    if (value === 'true') return true;
    if (value === 'false') return false;
    // Try to convert to null
    if (value === 'null') return null;
    // Try to convert to undefined
    if (value === 'undefined') return undefined;
    // Return as string if no conversion possible
    return value;
  };

  const obj: any = {};

  params.forEach((value: string, key: string) => {
    // Parse nested bracket notation with unlimited depth
    const parsePath = (path: string): string[] => {
      const result: string[] = [];
      let current = '';
      for (let i = 0; i < path.length; i++) {
        const char = path[i];
        if (char === '[') {
          if (current) {
            result.push(current);
            current = '';
          }
        } else if (char === ']') {
          if (current) {
            result.push(current);
            current = '';
          }
        } else {
          current += char;
        }
      }
      if (current) {
        result.push(current);
      }
      return result;
    };

    const keys = parsePath(key);
    let current = obj;

    // Navigate/create nested structure
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      const nextKey = keys[i + 1];
      const isNextKeyNumeric = /^\d+$/.test(nextKey);

      if (!current[k]) {
        current[k] = isNextKeyNumeric ? [] : {};
      }
      current = current[k];
    }

    // Set the final value
    const finalKey = keys[keys.length - 1];
    if (/^\d+$/.test(finalKey)) {
      const idx = parseInt(finalKey);
      if (!Array.isArray(current)) current = [];
      current[idx] = convertValue(value);
    } else {
      current[finalKey] = convertValue(value);
    }
  });

  return obj;
};