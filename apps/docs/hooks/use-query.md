# useUrlQuery

A React hook that manages URL query parameters with automatic parsing, type conversion, and browser history integration.

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
    </div>
  )
}
```

## Parameters

```typescript
useUrlQuery<T>(defaultValue?: T)
```

- **defaultValue** - Optional default value when no query parameters exist

## Return Value

```typescript
[query: T, setQuery: (newQuery: T | null) => void]
```

Returns a tuple with:
- **query** - Current parsed query parameters object
- **setQuery** - Function to update query parameters (pass `null` to clear all)

## Features

- **Automatic type conversion** - Converts strings to numbers, booleans, null, undefined
- **Nested objects & arrays** - Supports complex data structures with bracket notation
- **Browser history integration** - Uses `pushState` for seamless navigation
- **SSR safe** - Handles server-side rendering environments
- **Real-time sync** - Automatically updates when URL changes (back/forward buttons)
- **Type-safe** - Full TypeScript support with generics

## Type Conversion

The hook automatically converts query parameter values:

```
"123"       → 123
"true"      → true
"false"     → false
"null"      → null
"undefined" → undefined
"hello"     → "hello"
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

### Form State in URL

```jsx
function ContactForm() {
  const [query, setQuery] = useUrlQuery({
    name: '',
    email: '',
    subject: '',
    priority: 'normal'
  })
  
  const updateField = (field, value) => {
    setQuery({ ...query, [field]: value })
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