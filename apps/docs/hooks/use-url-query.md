# useUrlQuery

A production-ready React hook that manages URL query parameters with automatic parsing, type conversion, security protections, and browser history integration.

## Usage

```jsx
import { useUrlQuery } from '@sarshay/react-utils'

function SearchPage() {
  const [query, setQuery] = useUrlQuery({
    search: '',
    page: 1,
    filters: []
  })

  return (
    <div>
      <p>Search: {query.search}</p>
      <p>Page: {query.page}</p>
      <button onClick={() => setQuery({ ...query, page: query.page + 1 })}>
        Next Page
      </button>
      {/* Replace mode - doesn't add to browser history */}
      <button onClick={() => setQuery({ ...query, page: 1 }, { replace: true })}>
        Reset Page
      </button>
    </div>
  )
}
```

## Parameters

```typescript
useUrlQuery<T>(defaultValue?: T)
```

- **defaultValue** - Optional default values that will be **merged** with URL parameters

## Return Value

```typescript
[query: T, setQuery: (newQuery: T | null, options?: SetQueryOptions) => void]
```

Returns a tuple with:
- **query** - Current parsed query parameters merged with defaults
- **setQuery** - Function to update query parameters
  - Pass `null` to clear all parameters
  - Pass `{ replace: true }` as second argument to replace instead of push

## Features

- **Automatic type conversion** - Converts strings to numbers, booleans, null, undefined
- **Nested objects & arrays** - Supports complex data structures with bracket notation
- **Default value merging** - URL params override defaults, but defaults are preserved for missing keys
- **Replace mode** - Option to replace history entry instead of adding new one
- **Security protections** - Input validation, overflow prevention, DoS protection
- **Browser history integration** - Uses `pushState`/`replaceState` for seamless navigation
- **SSR safe** - Handles server-side rendering environments
- **Real-time sync** - Automatically updates when URL changes (back/forward buttons)
- **Type-safe** - Full TypeScript support with generics

## What's New in v2.0

### 🔒 Security Enhancements
- **Input length validation** - Protects against DoS via huge query params (max 1000 chars)
- **Number overflow protection** - Only converts safe integers to numbers
- **Array index overflow prevention** - Rejects array indices > 9999
- **parseInt radix** - Always uses radix 10 to prevent octal interpretation

### 🎯 Default Value Merging
Previously, defaults were only used when *no* URL params existed. Now defaults are **merged** with URL params:

```jsx
const [query] = useUrlQuery({ page: 1, limit: 10, sort: 'name' });
// URL: ?page=5
// Old behavior: { page: 5 }            ❌ Lost defaults!
// New behavior: { page: 5, limit: 10, sort: 'name' } ✅
```

### ⚡ Replace Mode
Avoid polluting browser history with temporary state changes:

```jsx
setQuery({ page: 2 });                    // Adds to history (default)
setQuery({ page: 2 }, { replace: true }); // Replaces current entry
```

## Type Conversion

The hook automatically converts query parameter values:

```
"123"       → 123 (number)
"29.99"     → 29.99 (number)
"true"      → true (boolean)
"false"     → false (boolean)
"null"      → null
"undefined" → undefined
"hello"     → "hello" (string)
```

### Security-Protected Conversions

```
"999999999999999999999" → "999999999999999999999" (string, not number - overflow protection)
"9007199254740991"      → 9007199254740991 (number, safe integer)
"a".repeat(2000)        → kept as string (> 1000 chars limit)
```

## Examples

### Search and Pagination

```jsx
function ProductList() {
  const [query, setQuery] = useUrlQuery({
    search: '',
    page: 1,
    category: 'all',
    sortBy: 'name'
  })
  
  const handleSearch = (searchTerm) => {
    setQuery({ ...query, search: searchTerm, page: 1 })
  }
  
  const handlePageChange = (newPage) => {
    setQuery({ ...query, page: newPage })
  }
  
  return (
    <div>
      <input 
        value={query.search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products..."
      />
      
      <select 
        value={query.category}
        onChange={(e) => setQuery({ ...query, category: e.target.value, page: 1 })}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      
      <div>
        Page {query.page}
        <button onClick={() => handlePageChange(query.page - 1)} disabled={query.page === 1}>
          Previous
        </button>
        <button onClick={() => handlePageChange(query.page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
```

### Complex Filters

```jsx
function AdvancedSearch() {
  const [query, setQuery] = useUrlQuery({
    filters: {
      priceRange: { min: 0, max: 1000 },
      tags: [],
      inStock: true
    },
    sort: { field: 'name', direction: 'asc' }
  })
  
  const updatePriceRange = (min, max) => {
    setQuery({
      ...query,
      filters: {
        ...query.filters,
        priceRange: { min, max }
      }
    })
  }
  
  const toggleTag = (tag) => {
    const tags = query.filters.tags.includes(tag)
      ? query.filters.tags.filter(t => t !== tag)
      : [...query.filters.tags, tag]
    
    setQuery({
      ...query,
      filters: { ...query.filters, tags }
    })
  }
  
  return (
    <div>
      <h3>Price Range</h3>
      <input 
        type="number" 
        value={query.filters.priceRange.min}
        onChange={(e) => updatePriceRange(+e.target.value, query.filters.priceRange.max)}
      />
      <input 
        type="number" 
        value={query.filters.priceRange.max}
        onChange={(e) => updatePriceRange(query.filters.priceRange.min, +e.target.value)}
      />
      
      <h3>Tags</h3>
      {['electronics', 'sale', 'new'].map(tag => (
        <label key={tag}>
          <input 
            type="checkbox"
            checked={query.filters.tags.includes(tag)}
            onChange={() => toggleTag(tag)}
          />
          {tag}
        </label>
      ))}
      
      <button onClick={() => setQuery(null)}>Clear All Filters</button>
    </div>
  )
}
```

### Data Table with Sorting

```jsx
function DataTable() {
  const [query, setQuery] = useUrlQuery({
    sort: { column: 'name', direction: 'asc' },
    page: 1,
    pageSize: 10
  })
  
  const handleSort = (column) => {
    const direction = query.sort.column === column && query.sort.direction === 'asc' 
      ? 'desc' 
      : 'asc'
    
    setQuery({ ...query, sort: { column, direction }, page: 1 })
  }
  
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>
            Name {query.sort.column === 'name' && (query.sort.direction === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('date')}>
            Date {query.sort.column === 'date' && (query.sort.direction === 'asc' ? '↑' : '↓')}
          </th>
        </tr>
      </thead>
      <tbody>
        {/* Table rows */}
      </tbody>
    </table>
  )
}
```

### Tab Navigation with Replace Mode

```jsx
function TabPanel() {
  const [query, setQuery] = useUrlQuery({ tab: 'overview', section: 'general' })

  // Use replace mode for tabs to avoid polluting history
  const switchTab = (tab) => {
    setQuery({ ...query, tab }, { replace: true })
  }

  return (
    <div>
      <nav>
        <button onClick={() => switchTab('overview')}>Overview</button>
        <button onClick={() => switchTab('settings')}>Settings</button>
        <button onClick={() => switchTab('profile')}>Profile</button>
      </nav>

      {query.tab === 'overview' && <Overview />}
      {query.tab === 'settings' && <Settings />}
      {query.tab === 'profile' && <Profile />}
    </div>
  )
}
```

### Form State in URL

```jsx
function ContactForm() {
  const [query, setQuery] = useUrlQuery({
    name: '',
    email: '',
    subject: '',
    priority: 'normal'
  })

  // Use replace mode for form fields to avoid history spam
  const updateField = (field, value) => {
    setQuery({ ...query, [field]: value }, { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitForm(query)
      setQuery(null) // Clear form and URL
      alert('Form submitted!')
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={query.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={query.email}
        onChange={(e) => updateField('email', e.target.value)}
      />
      <select
        value={query.priority}
        onChange={(e) => updateField('priority', e.target.value)}
      >
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  )
}
```

## URL Parameter Format

### Simple Values
```
?name=john&age=25&active=true
```
Becomes:
```javascript
{ name: "john", age: 25, active: true }
```

### Arrays
```
?tags[0]=react&tags[1]=typescript&tags[2]=hooks
```
Becomes:
```javascript
{ tags: ["react", "typescript", "hooks"] }
```

### Nested Objects
```
?user[name]=john&user[age]=25&user[settings][theme]=dark
```
Becomes:
```javascript
{
  user: {
    name: "john",
    age: 25,
    settings: { theme: "dark" }
  }
}
```

### Complex Example
```
?filters[price][min]=100&filters[price][max]=500&filters[tags][0]=sale&sort[field]=name&sort[direction]=asc
```
Becomes:
```javascript
{
  filters: {
    price: { min: 100, max: 500 },
    tags: ["sale"]
  },
  sort: { field: "name", direction: "asc" }
}
```

## Best Practices

1. **Provide defaults** - Always provide sensible default values
2. **Clear on success** - Use `setQuery(null)` to clear parameters after form submission
3. **Reset pagination** - Reset page to 1 when changing search/filter parameters
4. **URL length limits** - Be mindful of URL length limits (usually 2048 characters)
5. **Sensitive data** - Don't put sensitive information in URL parameters
6. **SEO friendly** - Use meaningful parameter names for better SEO