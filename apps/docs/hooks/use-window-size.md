# useWindowSize

A React hook that tracks window dimensions and updates automatically when the window is resized.

## Usage

```jsx
import { useWindowSize } from '@sarshay/react-utils'

function MyComponent() {
  const { width, height } = useWindowSize()
  
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? (
        <p>Mobile view</p>
      ) : (
        <p>Desktop view</p>
      )}
    </div>
  )
}
```

## Return Value

The hook returns an object with the current window dimensions:

```typescript
interface WindowSize {
  width: number
  height: number
}
```

## Features

- **Automatic updates** - Listens for window resize events
- **Performance optimized** - Debounced resize handling
- **SSR safe** - Handles server-side rendering gracefully
- **TypeScript support** - Fully typed return values

## Examples

### Responsive Component

```jsx
function ResponsiveComponent() {
  const { width } = useWindowSize()
  
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const isDesktop = width >= 1024
  
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  )
}
```

### Conditional Rendering

```jsx
function Navigation() {
  const { width } = useWindowSize()
  
  return (
    <nav>
      {width > 768 ? (
        <DesktopMenu />
      ) : (
        <MobileMenu />
      )}
    </nav>
  )
}
```