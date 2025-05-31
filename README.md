# @sarshay/react-utils

A collection of useful React hooks and components for building modern web applications.

## Installation

```bash
npm install @sarshay/react-utils
# or
yarn add @sarshay/react-utils
# or
pnpm add @sarshay/react-utils
```

## Features

- 🎯 **Content & TableOfContents**: Automatically generate table of contents from your content
- 📏 **useWindowSize**: Track window dimensions
- 📜 **useScrollPosition**: Monitor scroll position
- ♾️ **useInfiniteScroll**: Implement infinite scrolling
- 🎯 **EndDetect**: Detect when user reaches the end of content
- 💾 **useLocalStorage**: Persistent state management with localStorage

## Components

### Content & TableOfContents

Automatically generate a table of contents from your content's headings.

```tsx
import { Content, TableOfContents } from '@sarshay/react-utils';

function MyPage() {
  return (
    <div className="flex">
      <Content className="flex-1">
        <h1>Main Title</h1>
        <h2>Section 1</h2>
        <p>Content...</p>
        <h2>Section 2</h2>
        <p>More content...</p>
      </Content>
      
      <TableOfContents 
        className="w-64 p-4"
        headingClassNames={{
          h1: "text-lg font-bold",
          h2: "text-base"
        }}
      />
    </div>
  );
}
```

### EndDetect

Detect when user reaches the end of content.

```tsx
import { EndDetect } from '@sarshay/react-utils';

function MyComponent() {
  const handleEnd = (isEnd: boolean) => {
    if (isEnd) {
      console.log('Reached the end!');
      // Load more data or perform any action
    }
  };

  return (
    <div>
      {/* Your content */}
      <EndDetect 
        onEnd={handleEnd}
        height="100px"
        className="my-end-detect"
      >
        Loading more...
      </EndDetect>
    </div>
  );
}
```

## Hooks

### useWindowSize

Track window dimensions with automatic updates.

```tsx
import { useWindowSize } from '@sarshay/react-utils';

function MyComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}
```

### useScrollPosition

Monitor scroll position with automatic updates.

```tsx
import { useScrollPosition } from '@sarshay/react-utils';

function MyComponent() {
  const { x, y } = useScrollPosition();
  
  return (
    <div>
      Scroll position: X: {x}px, Y: {y}px
    </div>
  );
}
```

### useInfiniteScroll

Implement infinite scrolling with Intersection Observer.

```tsx
import { useInfiniteScroll } from '@sarshay/react-utils';

function InfiniteScrollExample() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const { loadingRef } = useInfiniteScroll(
    () => {
      if (!loading) {
        // Load more items
        loadMoreItems();
      }
    },
    {
      threshold: 100,
      enabled: true
    }
  );

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
      <div ref={loadingRef}>
        {loading ? 'Loading...' : 'Scroll for more'}
      </div>
    </div>
  );
}
```

### useLocalStorage

Persistent state management with localStorage support.

```tsx
import { useLocalStorage } from '@sarshay/react-utils';

function MyComponent() {
  const { storedValue, setValue } = useLocalStorage('user', null, {
    onError: (error) => console.error(error),
    syncAcrossTabs: true
  });

  return (
    <div>
      <p>Stored value: {storedValue}</p>
      <button onClick={() => setValue('John')}>Set Value</button>
      <button onClick={() => setValue(null)}>Clear</button>
    </div>
  );
}
```

## API Reference

### Content Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Content to be rendered |
| className | string | '' | Additional CSS classes |

### TableOfContents Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | '' | Additional CSS classes |
| headingClassNames | object | {} | Custom classes for each heading level |

### EndDetect Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onEnd | (end: boolean) => void | - | Callback when end is detected |
| children | ReactNode | - | Content to be rendered |
| height | string \| number | '200px' | Height of the detection area |
| className | string | '' | Additional CSS classes |
| style | CSSProperties | {} | Additional inline styles |

### useWindowSize Hook

Returns an object with:
- `width`: number - Current window width
- `height`: number - Current window height

### useScrollPosition Hook

Returns an object with:
- `x`: number - Current horizontal scroll position
- `y`: number - Current vertical scroll position

### useInfiniteScroll Hook

Parameters:
- `onLoadMore`: () => void - Callback when more content should be loaded
- `options`: {
  - `threshold`: number - Distance from bottom to trigger (default: 100)
  - `enabled`: boolean - Whether infinite scroll is enabled (default: true)
  - `rootMargin`: string - Margin around the root element (default: '0px')
}

Returns:
- `loadingRef`: RefObject - Ref to attach to loading indicator
- `isEnabled`: boolean - Current state of infinite scroll

### useLocalStorage Hook

Parameters:
- `key`: string - Storage key
- `initialValue`: T | null - Initial value
- `options`: {
  - `onError`: (error: Error) => void - Custom error handler
  - `syncAcrossTabs`: boolean - Enable cross-tab sync (default: true)
}

Returns:
- `storedValue`: T | null - Current stored value
- `setValue`: (value: T | null) => void - Function to update value

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [sarshay]