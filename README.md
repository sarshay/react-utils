# @sarshay/react-utils

A comprehensive collection of React utilities and components for modern web applications, featuring content management, viewport detection, local storage handling, and URL query parameter management.

## 🚀 Features

- **Content Management** - Automatic table of contents generation and content navigation
- **Viewport Detection** - Intersection Observer-based end detection for infinite scrolling
- **Local Storage** - Type-safe localStorage with cross-tab synchronization
- **URL Management** - Query parameter handling with automatic type conversion
- **Window Utilities** - Window size and scroll position tracking
- **TypeScript First** - Full TypeScript support with comprehensive type definitions

## 📦 Installation

```bash
# npm
npm install @sarshay/react-utils

# yarn
yarn add @sarshay/react-utils

# pnpm
pnpm add @sarshay/react-utils
```

## 🌐 Homepage

**[📖 Visit Documentation & Examples](https://sarshay.github.io/react-utils)**

## 📚 Components

### ContentProvider & TableOfContents
Automatically generates a table of contents from heading elements and provides smooth navigation.

### EndDetect
Detects when a component enters the viewport, perfect for infinite scrolling and analytics.

## 🪝 Hooks

### useLocalStorage
Type-safe localStorage with cross-tab synchronization and error handling.

### useUrlQuery
Manage URL query parameters with automatic type conversion and nested object support.

### useWindowSize
Track window dimensions with automatic updates on resize.

### useScrollPosition
Monitor window scroll position for scroll-based interactions.

## 📖 Documentation

Comprehensive documentation is available in the `/apps/docs` directory:

- [Hooks Documentation](./apps/docs/hooks/)
  - [useLocalStorage](./apps/docs/hooks/use-local-storage.md)
  - [useUrlQuery](./apps/docs/hooks/use-url-query.md)
  - [useWindowSize](./apps/docs/hooks/use-window-size.md)
  - [useScrollPosition](./apps/docs/hooks/use-scroll-position.md)
- [Components Documentation](./apps/docs/components/)
  - [EndDetect](./apps/docs/components/end-detect.md)


## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/sarshay/react-utils.git

# Install dependencies
pnpm install

# Build the package
pnpm build

# Run Storybook
cd apps/storybook && pnpm dev

# Run tests
pnpm test
```

## 📋 API Reference

### Components

| Component | Description |
|-----------|-------------|
| `ContentProvider` | Provides context for content management and TOC generation |
| `TableOfContents` | Renders an interactive table of contents |
| `EndDetect` | Intersection Observer-based viewport detection |

### Hooks

| Hook | Description |
|------|-------------|
| `useLocalStorage<T>` | Type-safe localStorage with cross-tab sync |
| `useUrlQuery<T>` | URL query parameter management |
| `useWindowSize` | Window dimensions tracking |
| `useScrollPosition` | Scroll position monitoring |
| `useContent` | Access content context (used with ContentProvider) |

### Utilities

| Function | Description |
|----------|-------------|
| `sanitizeId` | Converts text to URL-safe IDs |

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## 📞 Support

- 📧 Issues: [GitHub Issues](https://github.com/sarshay/react-utils/issues)
- 📚 Documentation: [GitHub Pages](https://sarshay.github.io/react-utils)
- 💬 Discussions: [GitHub Discussions](https://github.com/sarshay/react-utils/discussions)