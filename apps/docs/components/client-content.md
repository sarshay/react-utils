# ContentProvider

The `ContentProvider` component wraps your content and automatically extracts headings for navigation. It provides context for other components like `TableOfContents`.

## Usage

```jsx
import { ContentProvider, TableOfContents } from '@sarshay/react-utils'

function App() {
  return (
    <ContentProvider>
      <div style={{ display: 'flex' }}>
        <aside>
          <TableOfContents />
        </aside>
        <main>
          <h1>My Article</h1>
          <p>Introduction paragraph</p>
          
          <h2>Section 1</h2>
          <p>Section content</p>
          
          <h3>Subsection</h3>
          <p>Subsection content</p>
        </main>
      </div>
    </ContentProvider>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The content to wrap |
| `className` | `string` | `undefined` | Additional CSS classes |
| `style` | `CSSProperties` | `undefined` | Inline styles |

## Important Notes

- **TableOfContents must be inside ContentProvider** - The provider creates the context that TableOfContents needs
- **Automatic heading extraction** - Scans for h1-h6 elements automatically
- **SSR compatible** - Works with server-side rendering

## Examples

### Basic Layout

```jsx
<ContentProvider>
  <div style={{ display: 'flex' }}>
    <aside style={{ width: '200px' }}>
      <TableOfContents />
    </aside>
    <main style={{ flex: 1 }}>
      <h1>Getting Started</h1>
      <p>Welcome to our documentation</p>
      
      <h2>Installation</h2>
      <p>Install the package</p>
    </main>
  </div>
</ContentProvider>
```