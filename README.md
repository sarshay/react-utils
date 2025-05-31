# @sarshay/react-utils

React utilities for content management with table of contents support.

## Installation

```bash
pnpm add @sarshay/react-utils
```

## Usage

### Basic Usage

```tsx
'use client';
import { ClientContent, TableOfContents } from "@sarshay/react-utils";

const Body = () => {
    return (
        <ClientContent>
            <div className="flex">
                <div className="flex-1">
                    <h1>Main Title</h1>
                    <p>Some introductory text...</p>
                    
                    <h2>First Section</h2>
                    <p>Content for the first section...</p>
                    
                    <h3>Subsection</h3>
                    <p>More detailed content...</p>
                    
                    <h2>Second Section</h2>
                    <p>Content for the second section...</p>
                </div>
                <div>
                    <div className="sticky top-0 max-h-dvh overflow-y-auto w-64 p-4 bg-gray-100">
                        <TableOfContents />
                    </div>
                </div>
            </div>
        </ClientContent>
    );
}

export default Body;
```

### TableOfContents with Custom Styling

```tsx
<TableOfContents 
  headingClassNames={{
    h1: "font-bold text-xl",
    h2: "font-semibold text-lg",
    h3: "text-base",
    h4: "text-sm",
    h5: "text-xs",
    h6: "text-xs text-gray-600"
  }}
/>
```

## Components

### ClientContent

The main wrapper component that provides context for the table of contents.

Props:
- `children`: React.ReactNode
- `className?: string`
- `style?: React.CSSProperties`

### TableOfContents

Renders a table of contents based on the headings in your content.

Props:
- `className?: string`
- `style?: React.CSSProperties`
- `headingClassNames?: { h1?: string; h2?: string; h3?: string; h4?: string; h5?: string; h6?: string; }`

## Features

- Automatic heading detection and ID generation
- Smooth scrolling to headings
- Customizable styling for each heading level
- Responsive design support
- Sticky table of contents support

## License

MIT