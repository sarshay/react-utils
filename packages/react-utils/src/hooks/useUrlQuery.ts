"use client"
import { useCallback, useMemo, useState, useEffect } from "react";

export interface SetQueryOptions {
  /**
   * If true, replaces current history entry instead of adding a new one
   * @default false
   */
  replace?: boolean;
}

/**
 * Hook for managing URL query parameters with automatic parsing and updating
 *
 * Features:
 * - Automatic type conversion (number, boolean, null, undefined)
 * - Nested object/array support with bracket notation
 * - Security protections (overflow prevention, input validation)
 * - Default value merging
 * - SSR-safe
 *
 * @template T - Type for the query parameters object
 * @param defaultValue - Default values to merge with parsed query parameters
 * @returns [query, setQuery] - Current query object and setter function
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useUrlQuery({ page: 1, limit: 10 });
 * // URL: ?page=5
 * // query = { page: 5, limit: 10 } // Defaults are preserved
 *
 * setQuery({ page: 2 }); // Pushes new history entry
 * setQuery({ page: 2 }, { replace: true }); // Replaces current entry
 * setQuery(null); // Clears all query params
 * ```
 */
export const useUrlQuery = <T = any>(defaultValue?: T) => {
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

  // Parse current URL params into object and merge with defaults
  const query = useMemo(() => {
    const parsed = paramsObject(searchParams) as T;

    // Merge defaults with parsed params (parsed params override defaults)
    if (defaultValue !== undefined) {
      return { ...defaultValue, ...parsed } as T;
    }

    return parsed;
  }, [searchParams, defaultValue]);

  // Function to update query parameters
  const setQuery = useCallback((newQuery: T | null, options?: SetQueryOptions) => {
    if (typeof window === 'undefined') return;

    if (newQuery === null) {
      // Clear all query parameters
      const newUrl = pathname;
      if (options?.replace) {
        window.history.replaceState({}, '', newUrl);
      } else {
        window.history.pushState({}, '', newUrl);
      }
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
    if (options?.replace) {
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.pushState({}, '', newUrl);
    }
    setUrl(window.location.href);
  }, [pathname]);

  return [query, setQuery] as const;
};

/**
 * Converts URLSearchParams to a nested object with automatic type conversion
 *
 * Features:
 * - Automatic type conversion (number, boolean, null, undefined)
 * - Nested object/array support with bracket notation (e.g., `filters[status]=active`)
 * - Security protections:
 *   - Input length validation (max 1000 chars per param)
 *   - Number overflow protection (safe integer check)
 *   - Array index overflow prevention (max index 9999)
 *   - parseInt radix specification
 *
 * @param params - URLSearchParams to convert
 * @returns Parsed object with typed values
 *
 * @example
 * ```tsx
 * const params = new URLSearchParams('page=5&active=true&filters[status]=approved');
 * const obj = paramsObject(params);
 * // { page: 5, active: true, filters: { status: 'approved' } }
 * ```
 */
export const paramsObject = (params: URLSearchParams) => {
  if (!params || params.toString().length === 0) return {};

  // Helper function to convert string values to appropriate types with security protections
  const convertValue = (value: string): any => {
    // Input validation and sanitization - prevent DoS via huge query params
    if (typeof value !== 'string' || value.length > 1000) {
      return value; // Return as-is if invalid or too long
    }

    const trimmed = value.trim();
    if (trimmed === '') return '';

    // Try to convert to number with overflow protection
    if (!isNaN(Number(trimmed)) && trimmed !== '') {
      const num = Number(trimmed);
      // Check for safe integer range to prevent overflow
      if (Number.isSafeInteger(num)) {
        return num;
      }
      // Return as string if number is too large to safely handle
      return trimmed;
    }

    // Try to convert to boolean
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    // Try to convert to null
    if (trimmed === 'null') return null;
    // Try to convert to undefined
    if (trimmed === 'undefined') return undefined;
    // Return as string if no conversion possible
    return trimmed;
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
      const idx = parseInt(finalKey, 10); // Always specify radix for parseInt
      // Prevent array index overflow attacks - limit to reasonable array size
      if (idx >= 0 && idx < 10000) {
        if (!Array.isArray(current)) current = [];
        current[idx] = convertValue(value);
      }
      // Silently ignore indices that are too large (security protection)
    } else {
      current[finalKey] = convertValue(value);
    }
  });

  return obj;
};