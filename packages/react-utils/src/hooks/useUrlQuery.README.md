# useUrlQuery Hook

A production-ready React hook for managing URL query parameters with automatic type conversion, nested object support, and security protections.

## Features

✅ **Framework Agnostic** - Works with any React app (not just Next.js)
✅ **Automatic Type Conversion** - Converts strings to `number`, `boolean`, `null`, `undefined`
✅ **Nested Objects/Arrays** - Supports bracket notation (`filters[status]=active`)
✅ **Default Value Merging** - Preserves defaults while allowing URL overrides
✅ **Replace Mode** - Option to replace history entry instead of pushing
✅ **Security Protections** - Overflow prevention, input validation, DoS protection
✅ **SSR Safe** - Works with server-side rendering
✅ **TypeScript** - Full type safety with generics

## Installation

```bash
npm install @your-package/react-utils
# or
yarn add @your-package/react-utils
# or
pnpm add @your-package/react-utils
```

## Basic Usage

```tsx
import { useUrlQuery } from '@your-package/react-utils';

function ProductList() {
  const [query, setQuery] = useUrlQuery({ page: 1, limit: 10 });

  // URL: ?page=5
  // query = { page: 5, limit: 10 } ✅ Default 'limit' is preserved

  return (
    <div>
      <p>Page: {query.page}</p>
      <button onClick={() => setQuery({ ...query, page: query.page + 1 })}>
        Next Page
      </button>
    </div>
  );
}
```

## API Reference

### `useUrlQuery<T>(defaultValue?: T)`

Returns: `[query: T, setQuery: (newQuery: T | null, options?: SetQueryOptions) => void]`

#### Parameters

- **`defaultValue`** (optional): Default values that will be merged with URL params

#### Return Value

- **`query`**: Parsed query object with type `T`
- **`setQuery`**: Function to update query params

### `SetQueryOptions`

```tsx
interface SetQueryOptions {
  replace?: boolean; // If true, replaces history entry instead of pushing (default: false)
}
```

## Advanced Examples

### 1. Pagination with Defaults

```tsx
interface PaginationQuery {
  page: number;
  limit: number;
  sort?: string;
}

function DataTable() {
  const [query, setQuery] = useUrlQuery<PaginationQuery>({
    page: 1,
    limit: 20
  });

  return (
    <div>
      <p>Showing {query.limit} items per page</p>
      <button onClick={() => setQuery({ ...query, page: query.page + 1 })}>
        Next
      </button>
    </div>
  );
}
```

### 2. Filters with Nested Objects

```tsx
interface FilterQuery {
  search: string;
  filters: {
    status: string;
    category: string;
  };
  tags: string[];
}

function ProductSearch() {
  const [query, setQuery] = useUrlQuery<FilterQuery>({
    search: '',
    filters: { status: 'active', category: 'all' },
    tags: [],
  });

  // URL: ?search=laptop&filters[status]=approved&filters[category]=electronics&tags[0]=featured
  // query = {
  //   search: 'laptop',
  //   filters: { status: 'approved', category: 'electronics' },
  //   tags: ['featured']
  // }

  return (
    <input
      value={query.search}
      onChange={(e) => setQuery({ ...query, search: e.target.value })}
    />
  );
}
```

### 3. Replace Mode (No History Entry)

```tsx
function TabNavigation() {
  const [query, setQuery] = useUrlQuery({ tab: 'overview' });

  return (
    <div>
      <button
        onClick={() => setQuery({ tab: 'settings' }, { replace: true })}
      >
        Settings (Replace)
      </button>

      <button
        onClick={() => setQuery({ tab: 'profile' })}
      >
        Profile (Push)
      </button>
    </div>
  );
}
```

### 4. Clear All Query Params

```tsx
function SearchPage() {
  const [query, setQuery] = useUrlQuery({ search: '', filters: {} });

  const handleReset = () => {
    setQuery(null); // Clears all query params
  };

  return <button onClick={handleReset}>Clear Filters</button>;
}
```

### 5. Type Conversion Examples

```tsx
// URL: ?page=5&active=true&price=29.99&status=null&tags[0]=new&tags[1]=featured

const [query] = useUrlQuery();

console.log(query);
// {
//   page: 5,           // Converted to number
//   active: true,      // Converted to boolean
//   price: 29.99,      // Converted to number
//   status: null,      // Converted to null
//   tags: ['new', 'featured'] // Array
// }
```

## Security Features

### 1. Input Length Validation
Prevents DoS attacks via extremely long query parameters.
```tsx
// ❌ Params > 1000 chars are rejected
// ✅ Params ≤ 1000 chars are processed
```

### 2. Number Overflow Protection
Prevents integer overflow attacks.
```tsx
// URL: ?id=999999999999999999999999999999
const [query] = useUrlQuery();
console.log(query.id); // "999999999999999999999999999999" (string, not number)
// Only safe integers (±9,007,199,254,740,991) are converted to numbers
```

### 3. Array Index Overflow Prevention
Prevents memory exhaustion via huge array indices.
```tsx
// ❌ items[99999999] is silently ignored
// ✅ items[0] to items[9999] are allowed
```

### 4. parseInt Radix
Always uses radix 10 to prevent octal interpretation.
```tsx
// ✅ parseInt('08', 10) = 8
// ❌ parseInt('08') = 0 (in some browsers)
```

## Comparison with Other Solutions

| Feature | useUrlQuery | react-router useSearchParams | Next.js useSearchParams |
|---------|-------------|------------------------------|-------------------------|
| Framework Agnostic | ✅ | ❌ (React Router only) | ❌ (Next.js only) |
| Type Conversion | ✅ Auto | ❌ Manual | ❌ Manual |
| Nested Objects | ✅ | ❌ | ❌ |
| Default Merging | ✅ | ❌ | ❌ |
| Security Protections | ✅ | ⚠️ Partial | ⚠️ Partial |
| Replace Mode | ✅ | ✅ | ✅ |

## TypeScript Support

Full TypeScript support with generics:

```tsx
interface SearchQuery {
  q: string;
  page: number;
  filters: {
    category: string;
    priceMin?: number;
    priceMax?: number;
  };
}

const [query, setQuery] = useUrlQuery<SearchQuery>({
  q: '',
  page: 1,
  filters: { category: 'all' },
});

// ✅ TypeScript knows 'query.page' is a number
// ✅ Autocomplete works for nested properties
// ✅ Type errors if you set invalid values
```

## SSR Considerations

The hook is SSR-safe and will return empty params during server rendering:

```tsx
// Server-side: query = defaultValue or {}
// Client-side: query = parsed URL params merged with defaults
```

## Browser Support

- ✅ All modern browsers
- ✅ IE11+ (with polyfills for `URLSearchParams`)

## Utilities

### `paramsObject(params: URLSearchParams)`

Standalone utility for converting `URLSearchParams` to an object:

```tsx
import { paramsObject } from '@your-package/react-utils';

const params = new URLSearchParams('page=5&active=true');
const obj = paramsObject(params);
// { page: 5, active: true }
```

## Migration Guide

### From react-router `useSearchParams`

```tsx
// Before
import { useSearchParams } from 'react-router-dom';
const [searchParams, setSearchParams] = useSearchParams();
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '10');

// After
import { useUrlQuery } from '@your-package/react-utils';
const [query, setQuery] = useUrlQuery({ page: 1, limit: 10 });
// query.page and query.limit are already numbers ✅
```

### From Next.js `useSearchParams`

```tsx
// Before
import { useSearchParams, useRouter } from 'next/navigation';
const searchParams = useSearchParams();
const router = useRouter();
const page = parseInt(searchParams.get('page') || '1');

const updatePage = (newPage: number) => {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(newPage));
  router.push(`?${params.toString()}`);
};

// After
import { useUrlQuery } from '@your-package/react-utils';
const [query, setQuery] = useUrlQuery({ page: 1 });
const updatePage = (newPage: number) => setQuery({ ...query, page: newPage });
```

## Contributing

Issues and PRs welcome! Please include tests for new features.

## License

MIT
