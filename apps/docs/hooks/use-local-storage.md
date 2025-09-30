# useLocalStorage

A React hook that provides a stateful way to interact with localStorage with automatic synchronization across browser tabs and comprehensive error handling.

## Usage

```jsx
import { useLocalStorage } from '@sarshay/react-utils'

function MyComponent() {
  const { storedValue, setValue } = useLocalStorage('user-preferences', {
    theme: 'light',
    language: 'en'
  })
  
  return (
    <div>
      <p>Theme: {storedValue?.theme}</p>
      <button onClick={() => setValue({ ...storedValue, theme: 'dark' })}>
        Switch to Dark
      </button>
    </div>
  )
}
```

## Parameters

```typescript
useLocalStorage<T>(
  key: string,
  initialValue: T | null,
  options?: UseLocalStorageOptions
)
```

- **key** - The localStorage key to use
- **initialValue** - Default value when no stored value exists
- **options** - Optional configuration object:
  - `onError?: (error: Error) => void` - Custom error handler (defaults to `console.error`)
  - `syncAcrossTabs?: boolean` - Enable cross-tab synchronization (defaults to `true`)

## Return Value

```typescript
{
  storedValue: T | null,
  setValue: (value: T | null | ((prev: T | null) => T | null)) => void
}
```

## Features

- **Type-safe** - Full TypeScript support with generics
- **Cross-tab sync** - Automatically syncs changes across browser tabs
- **Error handling** - Graceful error handling with customizable callbacks
- **SSR safe** - Handles server-side rendering environments
- **Functional updates** - Supports useState-like functional updates
- **JSON serialization** - Automatic serialization/deserialization
- **Null handling** - Properly handles null values and removal

## Examples

### User Preferences

```jsx
function UserPreferences() {
  const { storedValue: preferences, setValue: setPreferences } = useLocalStorage(
    'user-preferences',
    {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  )
  
  const updateTheme = (theme) => {
    setPreferences(prev => ({ ...prev, theme }))
  }
  
  return (
    <div>
      <h3>Preferences</h3>
      <label>
        Theme:
        <select 
          value={preferences?.theme} 
          onChange={(e) => updateTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  )
}
```

### Shopping Cart

```jsx
function ShoppingCart() {
  const { storedValue: cartItems, setValue: setCartItems } = useLocalStorage('cart', [])
  
  const addItem = (item) => {
    setCartItems(prev => [...(prev || []), item])
  }
  
  const removeItem = (itemId) => {
    setCartItems(prev => prev?.filter(item => item.id !== itemId) || [])
  }
  
  const clearCart = () => {
    setCartItems(null) // This removes the item from localStorage
  }
  
  return (
    <div>
      <h3>Cart ({cartItems?.length || 0} items)</h3>
      {cartItems?.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  )
}
```

### Form State Persistence

```jsx
function ContactForm() {
  const { storedValue: formData, setValue: setFormData } = useLocalStorage(
    'contact-form-draft',
    { name: '', email: '', message: '' }
  )
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const submitForm = async () => {
    try {
      await api.submitContact(formData)
      setFormData(null) // Clear saved draft after successful submission
      alert('Form submitted successfully!')
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }
  
  return (
    <form onSubmit={submitForm}>
      <input
        type="text"
        placeholder="Name"
        value={formData?.name || ''}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData?.email || ''}
        onChange={(e) => updateField('email', e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={formData?.message || ''}
        onChange={(e) => updateField('message', e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Custom Error Handling

```jsx
function DataManager() {
  const { storedValue: data, setValue: setData } = useLocalStorage(
    'app-data',
    null,
    {
      onError: (error) => {
        console.error('Storage error:', error)
        // Send to error tracking service
        errorTracker.captureException(error)
        // Show user-friendly message
        toast.error('Failed to save data locally')
      },
      syncAcrossTabs: true
    }
  )
  
  return (
    <div>
      <h3>Data Manager</h3>
      <p>Current data: {JSON.stringify(data)}</p>
      <button onClick={() => setData({ timestamp: Date.now() })}>
        Update Data
      </button>
    </div>
  )
}
```

### Disable Cross-Tab Sync

```jsx
function IsolatedComponent() {
  // This won't sync across tabs
  const { storedValue, setValue } = useLocalStorage(
    'isolated-data',
    {},
    { syncAcrossTabs: false }
  )
  
  return (
    <div>
      <p>This data won't sync across tabs</p>
      <button onClick={() => setValue({ updated: Date.now() })}>
        Update
      </button>
    </div>
  )
}
```

## Best Practices

1. **Use descriptive keys** - Use clear, namespaced keys like `user-preferences` instead of `prefs`
2. **Handle null states** - Always check for null values when accessing stored data
3. **Provide sensible defaults** - Set appropriate initial values for your use case
4. **Consider data size** - localStorage has size limits (usually 5-10MB)
5. **Error handling** - Implement custom error handlers for production apps
6. **Data validation** - Validate stored data structure when reading from localStorage