# Getting Started

React Utils is a collection of React utilities designed to make content management easier. Whether you're building a blog, documentation site, or any content-heavy application, these utilities will help you create better user experiences.

## Quick Start

```bash
npm install @sarshay/react-utils
```

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
          <h1>My Content</h1>
          <p>This heading will appear in the table of contents.</p>
          
          <h2>Section 1</h2>
          <p>More content here...</p>
        </main>
      </div>
    </ContentProvider>
  )
}
```

## What's Included

### Components
- **ContentProvider** - Wraps content and extracts headings for navigation
- **TableOfContents** - Generates clickable navigation from headings (must be inside ContentProvider)
- **EndDetect** - Detects when users reach the end of content

### Hooks
- **useWindowSize** - Track window dimensions with automatic updates
- **useScrollPosition** - Monitor scroll position efficiently
- **useLocalStorage** - Persist state to localStorage with type safety

## Features

- 🎯 **Zero Configuration** - Works out of the box
- ⚡ **Performance Optimized** - Efficient event handling and re-renders
- 🔒 **Type Safe** - Full TypeScript support
- 📱 **Responsive** - Mobile-friendly by default
- 🎨 **Customizable** - Easy to style and extend

## Next Steps

- [Installation Guide](/guide/installation) - Detailed setup instructions
- [Components](/components/client-content) - Learn about each component
- [Hooks](/hooks/use-window-size) - Explore available hooks