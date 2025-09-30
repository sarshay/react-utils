# useScrollPosition

A React hook that tracks the current scroll position of the window and updates automatically when the user scrolls.

## Usage

```jsx
import { useScrollPosition } from '@sarshay/react-utils'

function MyComponent() {
  const { x, y } = useScrollPosition()
  
  return (
    <div>
      <p>Scroll position: {x}, {y}</p>
      <p>Scrolled horizontally: {x}px</p>
      <p>Scrolled vertically: {y}px</p>
    </div>
  )
}
```

## Return Value

The hook returns an object with the current scroll coordinates:

```typescript
interface ScrollPosition {
  x: number
  y: number
}
```

## Features

- **Real-time updates** - Listens for scroll events and updates immediately
- **Initial position** - Provides current scroll position on mount
- **Performance optimized** - Efficient event listener management
- **Automatic cleanup** - Removes event listeners on unmount
- **TypeScript support** - Fully typed return values

## Examples

### Scroll-to-Top Button

```jsx
function ScrollToTopButton() {
  const { y } = useScrollPosition()
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  if (y < 100) return null
  
  return (
    <button 
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}
    >
      ↑ Top
    </button>
  )
}
```

### Progress Indicator

```jsx
function ReadingProgress() {
  const { y } = useScrollPosition()
  
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = Math.min((y / documentHeight) * 100, 100)
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        backgroundColor: '#007acc',
        zIndex: 1000
      }}
    />
  )
}
```

### Parallax Effect

```jsx
function ParallaxHeader() {
  const { y } = useScrollPosition()
  
  return (
    <header 
      style={{
        transform: `translateY(${y * 0.5}px)`,
        backgroundPosition: `center ${y * 0.3}px`
      }}
    >
      <h1>Parallax Header</h1>
    </header>
  )
}
```

### Navigation Hide/Show

```jsx
function AutoHideNavigation() {
  const { y } = useScrollPosition()
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    if (y > lastScrollY && y > 100) {
      setIsVisible(false) // Scrolling down
    } else {
      setIsVisible(true) // Scrolling up
    }
    setLastScrollY(y)
  }, [y, lastScrollY])
  
  return (
    <nav 
      style={{
        position: 'fixed',
        top: 0,
        transform: `translateY(${isVisible ? '0' : '-100%'})`,
        transition: 'transform 0.3s ease'
      }}
    >
      Navigation Content
    </nav>
  )
}
```