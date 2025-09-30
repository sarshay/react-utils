# EndDetect

A React component that detects when it becomes visible in the viewport using the Intersection Observer API. Useful for implementing infinite scrolling, lazy loading, or triggering actions when users reach the end of content.

## Usage

```jsx
import { EndDetect } from '@sarshay/react-utils'

function InfiniteList() {
  const [items, setItems] = useState([1, 2, 3, 4, 5])
  const [loading, setLoading] = useState(false)
  
  const handleEnd = (isVisible) => {
    if (isVisible && !loading) {
      setLoading(true)
      // Load more items
      setTimeout(() => {
        setItems(prev => [...prev, ...Array(5).fill(0).map((_, i) => prev.length + i + 1)])
        setLoading(false)
      }, 1000)
    }
  }
  
  return (
    <div>
      {items.map(item => (
        <div key={item} style={{ height: '100px', border: '1px solid #ccc' }}>
          Item {item}
        </div>
      ))}
      
      <EndDetect onEnd={handleEnd}>
        {loading ? 'Loading more...' : 'Load more items'}
      </EndDetect>
    </div>
  )
}
```

## Props

```typescript
interface EndDetectProps {
  onEnd: (end: boolean) => void
  children?: React.ReactNode | React.ReactNode[]
}
```

### onEnd
- **Type:** `(end: boolean) => void`
- **Required:** Yes
- **Description:** Callback function called when the component enters or exits the viewport. The `end` parameter is `true` when visible, but the component only triggers `onEnd` when becoming visible (not when leaving).

### children
- **Type:** `React.ReactNode | React.ReactNode[]`
- **Required:** No
- **Description:** Content to display inside the EndDetect component. Defaults to empty string if not provided.

## Features

- **Intersection Observer** - Uses modern Intersection Observer API for efficient viewport detection
- **10% threshold** - Triggers when 10% of the component is visible
- **Click trigger** - Also triggers `onEnd(true)` when clicked
- **Fixed height** - Has a default height of 200px
- **Automatic cleanup** - Properly removes observers on unmount

## Examples

### Infinite Scrolling

```jsx
function InfiniteScrollPage() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const loadMorePosts = async (isVisible) => {
    if (!isVisible || loading || !hasMore) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/posts?page=${page}`)
      const newPosts = await response.json()
      
      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts(prev => [...prev, ...newPosts])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id} style={{ marginBottom: '2rem' }}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
      
      {hasMore && (
        <EndDetect onEnd={loadMorePosts}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            {loading ? (
              <div>Loading more posts...</div>
            ) : (
              <div>👆 Click or scroll to load more</div>
            )}
          </div>
        </EndDetect>
      )}
      
      {!hasMore && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          🎉 You've reached the end!
        </div>
      )}
    </div>
  )
}
```

### Analytics Tracking

```jsx
function ArticlePage() {
  const [readComplete, setReadComplete] = useState(false)
  
  const handleArticleEnd = (isVisible) => {
    if (isVisible && !readComplete) {
      setReadComplete(true)
      // Track that user reached end of article
      analytics.track('article_read_complete', {
        articleId: 'example-article',
        timestamp: Date.now()
      })
    }
  }
  
  return (
    <article>
      <h1>How to Use EndDetect</h1>
      <p>This is a long article about the EndDetect component...</p>
      
      {/* Article content */}
      
      <EndDetect onEnd={handleArticleEnd}>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          background: readComplete ? '#e8f5e8' : '#f5f5f5'
        }}>
          {readComplete ? (
            <>
              ✅ Thanks for reading!
              <br />
              <small>Article completion tracked</small>
            </>
          ) : (
            'Continue reading...'
          )}
        </div>
      </EndDetect>
    </article>
  )
}
```

### Progressive Content Loading

```jsx
function ProgressiveContent() {
  const [sections, setSections] = useState(['intro'])
  
  const loadNextSection = (isVisible) => {
    if (!isVisible) return
    
    const nextSections = {
      intro: 'features',
      features: 'examples',
      examples: 'conclusion'
    }
    
    const current = sections[sections.length - 1]
    const next = nextSections[current]
    
    if (next && !sections.includes(next)) {
      setSections(prev => [...prev, next])
    }
  }
  
  const sectionContent = {
    intro: 'This is the introduction section...',
    features: 'Here are the amazing features...',
    examples: 'Check out these examples...',
    conclusion: 'In conclusion...'
  }
  
  return (
    <div>
      {sections.map(section => (
        <div key={section} style={{ marginBottom: '2rem', padding: '2rem', border: '1px solid #eee' }}>
          <h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
          <p>{sectionContent[section]}</p>
        </div>
      ))}
      
      {sections.length < 4 && (
        <EndDetect onEnd={loadNextSection}>
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            background: '#f0f8ff',
            border: '2px dashed #007acc'
          }}>
            📖 Loading next section...
          </div>
        </EndDetect>
      )}
    </div>
  )
}
```

### Custom Styled Trigger

```jsx
function CustomEndDetect() {
  const [count, setCount] = useState(0)
  
  const handleTrigger = (isVisible) => {
    if (isVisible) {
      setCount(prev => prev + 1)
    }
  }
  
  return (
    <div style={{ height: '150vh' }}>
      <h1>Scroll down to trigger the detector</h1>
      <p>Triggered {count} times</p>
      
      <EndDetect onEnd={handleTrigger}>
        <div style={{
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}>
          <h3>🎯 Detection Zone</h3>
          <p>Scroll here or click to trigger!</p>
          <small>Triggered: {count} times</small>
        </div>
      </EndDetect>
    </div>
  )
}
```

## Technical Details

### Intersection Observer Configuration
```javascript
{
  root: null,           // Viewport as root
  rootMargin: "0px",    // No margin
  threshold: 0.1        // Trigger when 10% visible
}
```

### Behavior Notes

1. **Single Direction Trigger**: Only triggers `onEnd` when becoming visible, not when leaving viewport
2. **Click Alternative**: Clicking the component manually triggers `onEnd(true)`
3. **Fixed Height**: Component has a fixed height of 200px for consistent layout
4. **Performance**: Uses Intersection Observer for efficient scroll detection

## Best Practices

1. **Debounce expensive operations** - If `onEnd` triggers expensive operations, consider debouncing
2. **Loading states** - Always show loading indicators during async operations
3. **Error handling** - Handle network errors gracefully in data loading scenarios
4. **Accessibility** - Ensure loading content is announced to screen readers
5. **Mobile optimization** - Consider touch interactions and smaller viewports

## Browser Support

Intersection Observer API is supported in all modern browsers. For older browsers, consider using a polyfill or fallback to scroll event listeners.