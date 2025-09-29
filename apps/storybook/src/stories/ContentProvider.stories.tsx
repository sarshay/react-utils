import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ContentProvider, TableOfContents } from '@sarshay/react-utils';

const meta: Meta<typeof ContentProvider> = {
  title: 'Components/ContentProvider',
  component: ContentProvider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <h1>Main Title</h1>
        <p>This is a paragraph under the main title.</p>

        <h2>Section 1</h2>
        <p>Content for section 1.</p>

        <h3>Subsection 1.1</h3>
        <p>Content for subsection 1.1.</p>

        <h2>Section 2</h2>
        <p>Content for section 2.</p>
      </>
    ),
  },
};

export const WithTableOfContents: Story = {
  render: () => (
    <ContentProvider>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ minWidth: '200px' }}>
          <h3>Table of Contents</h3>
          <TableOfContents />
        </div>
        <div style={{ flex: 1 }}>
          <h1>Documentation</h1>
          <p>This is the main documentation page.</p>

          <h2>Getting Started</h2>
          <p>Learn how to get started with our library.</p>

          <h3>Installation</h3>
          <p>Install the package using npm or yarn.</p>

          <h3>Basic Usage</h3>
          <p>Here is how to use the basic features.</p>

          <h2>Advanced Features</h2>
          <p>Explore advanced functionality.</p>

          <h3>Custom Styling</h3>
          <p>How to customize the appearance.</p>

          <h3>API Reference</h3>
          <p>Complete API documentation.</p>
        </div>
      </div>
    </ContentProvider>
  ),
  args: {},
};