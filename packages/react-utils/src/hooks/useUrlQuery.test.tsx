/**
 * Test examples for useUrlQuery hook
 *
 * Run with your test framework (Jest, Vitest, etc.)
 */

import { renderHook, act } from '@testing-library/react';
import { useUrlQuery, paramsObject } from './useUrlQuery';

describe('useUrlQuery Hook', () => {
  beforeEach(() => {
    // Reset URL before each test
    window.history.pushState({}, '', '/');
  });

  describe('Basic Functionality', () => {
    test('should parse URL query parameters', () => {
      window.history.pushState({}, '', '?page=5&limit=10');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({ page: 5, limit: 10 });
    });

    test('should update query parameters', () => {
      const { result } = renderHook(() => useUrlQuery({ page: 1 }));

      act(() => {
        result.current[1]({ page: 2 });
      });

      expect(window.location.search).toBe('?page=2');
    });

    test('should clear all query parameters with null', () => {
      window.history.pushState({}, '', '?page=5&limit=10');
      const { result } = renderHook(() => useUrlQuery());

      act(() => {
        result.current[1](null);
      });

      expect(window.location.search).toBe('');
    });
  });

  describe('Default Value Merging', () => {
    test('should merge defaults with URL params', () => {
      window.history.pushState({}, '', '?page=5');
      const { result } = renderHook(() =>
        useUrlQuery({ page: 1, limit: 10, sort: 'name' })
      );

      expect(result.current[0]).toEqual({
        page: 5,      // From URL (overrides default)
        limit: 10,    // From default (preserved)
        sort: 'name'  // From default (preserved)
      });
    });

    test('should use all defaults when no URL params', () => {
      const { result } = renderHook(() =>
        useUrlQuery({ page: 1, limit: 10 })
      );

      expect(result.current[0]).toEqual({ page: 1, limit: 10 });
    });

    test('should allow URL params to override all defaults', () => {
      window.history.pushState({}, '', '?page=99&limit=50');
      const { result } = renderHook(() =>
        useUrlQuery({ page: 1, limit: 10 })
      );

      expect(result.current[0]).toEqual({ page: 99, limit: 50 });
    });
  });

  describe('Type Conversion', () => {
    test('should convert numbers', () => {
      window.history.pushState({}, '', '?count=42&price=29.99');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({
        count: 42,    // integer
        price: 29.99  // float
      });
    });

    test('should convert booleans', () => {
      window.history.pushState({}, '', '?active=true&disabled=false');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({
        active: true,
        disabled: false
      });
    });

    test('should convert null and undefined', () => {
      window.history.pushState({}, '', '?value1=null&value2=undefined');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({
        value1: null,
        value2: undefined
      });
    });

    test('should keep strings as strings', () => {
      window.history.pushState({}, '', '?name=John&city=Tokyo');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({
        name: 'John',
        city: 'Tokyo'
      });
    });
  });

  describe('Nested Objects and Arrays', () => {
    test('should parse nested objects', () => {
      window.history.pushState({}, '', '?filters[status]=active&filters[category]=electronics');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({
        filters: {
          status: 'active',
          category: 'electronics'
        }
      });
    });

    test('should parse arrays', () => {
      window.history.pushState({}, '', '?tags[0]=new&tags[1]=featured&tags[2]=sale');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({
        tags: ['new', 'featured', 'sale']
      });
    });

    test('should parse deeply nested structures', () => {
      window.history.pushState({}, '', '?user[profile][name]=John&user[profile][age]=30&user[roles][0]=admin');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0]).toEqual({
        user: {
          profile: {
            name: 'John',
            age: 30
          },
          roles: ['admin']
        }
      });
    });
  });

  describe('Replace Mode', () => {
    test('should push to history by default', () => {
      const initialLength = window.history.length;
      const { result } = renderHook(() => useUrlQuery());

      act(() => {
        result.current[1]({ page: 1 });
      });
      act(() => {
        result.current[1]({ page: 2 });
      });

      expect(window.history.length).toBeGreaterThan(initialLength);
    });

    test('should replace history when replace option is true', () => {
      window.history.pushState({}, '', '?page=1');
      const { result } = renderHook(() => useUrlQuery());

      act(() => {
        result.current[1]({ page: 2 }, { replace: true });
      });

      expect(window.location.search).toBe('?page=2');
      // History should not grow
    });
  });

  describe('Security Protections', () => {
    test('should reject extremely long param values', () => {
      const longValue = 'a'.repeat(2000); // > 1000 chars
      window.history.pushState({}, '', `?data=${longValue}`);
      const { result } = renderHook(() => useUrlQuery());

      // Should not convert, keep as original
      expect(typeof result.current[0].data).toBe('string');
      expect(result.current[0].data.length).toBeGreaterThan(1000);
    });

    test('should protect against number overflow', () => {
      // Number larger than MAX_SAFE_INTEGER
      window.history.pushState({}, '', '?id=999999999999999999999999');
      const { result } = renderHook(() => useUrlQuery());

      // Should be string, not number (overflow protection)
      expect(typeof result.current[0].id).toBe('string');
    });

    test('should allow safe integers', () => {
      window.history.pushState({}, '', '?id=9007199254740991'); // MAX_SAFE_INTEGER
      const { result } = renderHook(() => useUrlQuery());

      expect(typeof result.current[0].id).toBe('number');
      expect(result.current[0].id).toBe(9007199254740991);
    });

    test('should reject huge array indices', () => {
      window.history.pushState({}, '', '?items[99999]=value');
      const { result } = renderHook(() => useUrlQuery());

      // Should be ignored due to overflow protection
      expect(result.current[0].items).toBeUndefined();
    });

    test('should allow reasonable array indices', () => {
      window.history.pushState({}, '', '?items[5]=value');
      const { result } = renderHook(() => useUrlQuery());

      expect(result.current[0].items).toEqual([
        undefined, undefined, undefined, undefined, undefined, 'value'
      ]);
    });
  });

  describe('SSR Safety', () => {
    test('should handle server-side rendering', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulate SSR
      delete global.window;

      const { result } = renderHook(() => useUrlQuery({ page: 1 }));

      expect(result.current[0]).toEqual({ page: 1 });

      // Restore
      global.window = originalWindow;
    });
  });

  describe('TypeScript Support', () => {
    interface SearchQuery {
      q: string;
      page: number;
      filters: {
        category: string;
        priceMin?: number;
      };
    }

    test('should provide type safety with generics', () => {
      window.history.pushState({}, '', '?q=laptop&page=2&filters[category]=electronics&filters[priceMin]=100');
      const { result } = renderHook(() =>
        useUrlQuery<SearchQuery>({
          q: '',
          page: 1,
          filters: { category: 'all' }
        })
      );

      const [query] = result.current;

      // TypeScript should know these types
      expect(typeof query.q).toBe('string');
      expect(typeof query.page).toBe('number');
      expect(typeof query.filters.category).toBe('string');
      expect(typeof query.filters.priceMin).toBe('number');
    });
  });
});

describe('paramsObject Utility', () => {
  test('should convert URLSearchParams to object', () => {
    const params = new URLSearchParams('page=5&active=true&name=John');
    const obj = paramsObject(params);

    expect(obj).toEqual({
      page: 5,
      active: true,
      name: 'John'
    });
  });

  test('should handle nested structures', () => {
    const params = new URLSearchParams('filters[status]=active&filters[category]=tech&tags[0]=new');
    const obj = paramsObject(params);

    expect(obj).toEqual({
      filters: { status: 'active', category: 'tech' },
      tags: ['new']
    });
  });

  test('should return empty object for empty params', () => {
    const params = new URLSearchParams('');
    const obj = paramsObject(params);

    expect(obj).toEqual({});
  });

  test('should handle special values', () => {
    const params = new URLSearchParams('null=null&undef=undefined&bool=true&num=42');
    const obj = paramsObject(params);

    expect(obj).toEqual({
      null: null,
      undef: undefined,
      bool: true,
      num: 42
    });
  });
});

describe('Real-world Use Cases', () => {
  test('Pagination', () => {
    window.history.pushState({}, '', '?page=3');
    const { result } = renderHook(() =>
      useUrlQuery({ page: 1, limit: 20 })
    );

    expect(result.current[0]).toEqual({ page: 3, limit: 20 });

    act(() => {
      result.current[1]({
        ...result.current[0],
        page: result.current[0].page + 1
      });
    });

    expect(window.location.search).toBe('?page=4&limit=20');
  });

  test('Search with filters', () => {
    const { result } = renderHook(() =>
      useUrlQuery({
        search: '',
        filters: { status: 'all', category: 'all' },
        sort: 'name'
      })
    );

    act(() => {
      result.current[1]({
        search: 'laptop',
        filters: { status: 'active', category: 'electronics' },
        sort: 'price'
      });
    });

    expect(window.location.search).toContain('search=laptop');
    expect(window.location.search).toContain('filters[status]=active');
    expect(window.location.search).toContain('filters[category]=electronics');
    expect(window.location.search).toContain('sort=price');
  });

  test('Tab navigation with replace', () => {
    const { result } = renderHook(() =>
      useUrlQuery({ tab: 'overview' })
    );

    act(() => {
      result.current[1]({ tab: 'settings' }, { replace: true });
    });

    expect(window.location.search).toBe('?tab=settings');
  });

  test('Clear filters', () => {
    window.history.pushState({}, '', '?search=test&filters[status]=active&page=5');
    const { result } = renderHook(() => useUrlQuery());

    expect(result.current[0]).toHaveProperty('search');
    expect(result.current[0]).toHaveProperty('filters');

    act(() => {
      result.current[1](null); // Clear all
    });

    expect(window.location.search).toBe('');
  });
});
