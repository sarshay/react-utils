# Installation

## Prerequisites

- React 16.8.0 or higher (hooks support required)
- Node.js 14 or higher

## Package Manager

Install using your preferred package manager:

::: code-group

```bash [npm]
npm install @sarshay/react-utils
```

```bash [yarn]
yarn add @sarshay/react-utils
```

```bash [pnpm]
pnpm add @sarshay/react-utils
```

:::

## TypeScript

The package includes TypeScript definitions out of the box. No additional `@types` packages needed.

## Framework Compatibility

### Next.js

Works seamlessly with Next.js 13+ App Router and Pages Router:

```jsx
// app/page.tsx (App Router)
'use client'
import { ClientContent, TableOfContents } from '@sarshay/react-utils'

export default function Page() {
  return (
    <div>
      <TableOfContents />
      <ClientContent>
        <h1>Welcome</h1>
      </ClientContent>
    </div>
  )
}
```

### Vite

Perfect for Vite-based projects:

```jsx
// src/App.tsx
import { ClientContent, useWindowSize } from '@sarshay/react-utils'

function App() {
  const { width, height } = useWindowSize()
  
  return (
    <ClientContent>
      <h1>Window: {width}x{height}</h1>
    </ClientContent>
  )
}
```

### Create React App

Works with CRA without any additional configuration:

```jsx
// src/App.js
import { ClientContent, TableOfContents } from '@sarshay/react-utils'

function App() {
  return (
    <div className="App">
      <TableOfContents />
      <ClientContent>
        <h1>My App</h1>
      </ClientContent>
    </div>
  )
}
```

## Bundle Size

The package is tree-shakeable. Import only what you need:

```jsx
// Good - only imports what you need
import { useWindowSize } from '@sarshay/react-utils'

// Avoid - imports entire library
import * as ReactUtils from '@sarshay/react-utils'
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Server-Side Rendering

All components and hooks are SSR-compatible and handle hydration correctly.