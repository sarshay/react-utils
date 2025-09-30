import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { EndDetect } from '@sarshay/react-utils';

const meta: Meta<typeof EndDetect> = {
  title: 'Components/EndDetect',
  component: EndDetect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component that detects when it becomes visible in the viewport using Intersection Observer API. Perfect for infinite scrolling, lazy loading, and triggering actions when users reach content end.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onEnd: {
      description: 'Callback function called when component becomes visible',
      action: 'end detected'
    },
    children: {
      description: 'Content to display inside the EndDetect component',
      control: 'text'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: 'Scroll to detect when this becomes visible!',
  },
  render: (args) => {
    const [detectedCount, setDetectedCount] = useState(0);
    
    return (
      <div>
        <div style={{ height: '100vh', padding: '2rem', background: '#f5f5f5' }}>
          <h2>Scroll down to see the EndDetect component</h2>
          <p>Detection count: {detectedCount}</p>
          <p>The component will trigger when it becomes visible in the viewport.</p>
        </div>
        
        <EndDetect 
          {...args}
          onEnd={(isVisible) => {
            if (isVisible) {
              setDetectedCount(prev => prev + 1);
            }
            args.onEnd?.(isVisible);
          }}
        />
        
        <div style={{ height: '50vh', padding: '2rem', background: '#e8f4f8' }}>
          <p>Content after EndDetect component</p>
        </div>
      </div>
    );
  }
};

export const InfiniteScrolling: Story = {
  render: () => {
    const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
    const [loading, setLoading] = useState(false);
    
    const loadMore = (isVisible: boolean) => {
      if (isVisible && !loading) {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setItems(prev => [
            ...prev, 
            ...Array.from({ length: 5 }, (_, i) => prev.length + i + 1)
          ]);
          setLoading(false);
        }, 1000);
      }
    };
    
    return (
      <div style={{ maxHeight: '500px', overflow: 'auto' }}>
        <h3>Infinite Scroll Example</h3>
        {items.map(item => (
          <div 
            key={item}
            style={{
              padding: '1rem',
              margin: '0.5rem 0',
              background: '#f0f8ff',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            Item #{item}
          </div>
        ))}
        
        <EndDetect onEnd={loadMore}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: loading ? '#fff3cd' : '#d4edda',
            border: `2px dashed ${loading ? '#856404' : '#155724'}`,
            borderRadius: '8px'
          }}>
            {loading ? (
              <>
                <div>🔄 Loading more items...</div>
                <div style={{ fontSize: '0.8em', marginTop: '0.5rem' }}>
                  Please wait...
                </div>
              </>
            ) : (
              <>
                <div>📦 Load More Items</div>
                <div style={{ fontSize: '0.8em', marginTop: '0.5rem' }}>
                  Scroll here or click to load more
                </div>
              </>
            )}
          </div>
        </EndDetect>
      </div>
    );
  }
};

export const ProgressiveContent: Story = {
  render: () => {
    const [revealedSections, setRevealedSections] = useState(['intro']);
    
    const sections = [
      { id: 'intro', title: 'Introduction', content: 'Welcome to our progressive content demo!' },
      { id: 'features', title: 'Features', content: 'Here are the amazing features of our component...' },
      { id: 'examples', title: 'Examples', content: 'Check out these practical examples...' },
      { id: 'conclusion', title: 'Conclusion', content: 'Thanks for reading through all sections!' }
    ];
    
    const revealNextSection = (isVisible: boolean) => {
      if (isVisible) {
        const nextIndex = revealedSections.length;
        if (nextIndex < sections.length) {
          setRevealedSections(prev => [...prev, sections[nextIndex].id]);
        }
      }
    };
    
    return (
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        <h3>Progressive Content Loading</h3>
        
        {revealedSections.map(sectionId => {
          const section = sections.find(s => s.id === sectionId);
          return (
            <div 
              key={sectionId}
              style={{
                padding: '1.5rem',
                margin: '1rem 0',
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                animation: 'fadeIn 0.5s ease-in'
              }}
            >
              <h4>{section?.title}</h4>
              <p>{section?.content}</p>
            </div>
          );
        })}
        
        {revealedSections.length < sections.length && (
          <EndDetect onEnd={revealNextSection}>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'linear-gradient(45deg, #e3f2fd, #f3e5f5)',
              border: '2px dashed #673ab7',
              borderRadius: '12px'
            }}>
              <div>✨ Unlock Next Section</div>
              <div style={{ fontSize: '0.9em', marginTop: '0.5rem', opacity: 0.8 }}>
                Section {revealedSections.length + 1} of {sections.length}
              </div>
            </div>
          </EndDetect>
        )}
        
        {revealedSections.length === sections.length && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#d4edda',
            border: '2px solid #28a745',
            borderRadius: '12px',
            color: '#155724'
          }}>
            🎉 All sections revealed! You've reached the end.
          </div>
        )}
      </div>
    );
  }
};

export const AnalyticsTracking: Story = {
  render: () => {
    const [events, setEvents] = useState<string[]>([]);
    
    const trackEvent = (eventName: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setEvents(prev => [...prev, `${timestamp}: ${eventName}`]);
    };
    
    const handleEndDetection = (isVisible: boolean) => {
      if (isVisible) {
        trackEvent('Content end reached');
      }
    };
    
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h3>Analytics Tracking Example</h3>
          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid #e9ecef',
            maxHeight: '120px',
            overflow: 'auto'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9em' }}>Events Log:</h4>
            {events.length === 0 ? (
              <em>No events tracked yet...</em>
            ) : (
              events.map((event, index) => (
                <div key={index} style={{ fontSize: '0.8em', fontFamily: 'monospace' }}>
                  {event}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ddd' }}>
          <div style={{ padding: '2rem', background: '#fff' }}>
            <h4>Article Content</h4>
            <p>This is a sample article. Scroll down to reach the end...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          
          <EndDetect onEnd={handleEndDetection}>
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: '#e8f5e9',
              border: '2px dashed #4caf50'
            }}>
              📊 Analytics Trigger Zone
              <div style={{ fontSize: '0.8em', marginTop: '0.5rem' }}>
                This will track when users reach the end
              </div>
            </div>
          </EndDetect>
        </div>
      </div>
    );
  }
};

export const CustomStyling: Story = {
  render: () => {
    const [triggerCount, setTriggerCount] = useState(0);
    
    return (
      <div>
        <div style={{ height: '300px', padding: '2rem', background: '#f5f5f5' }}>
          <h3>Custom Styled EndDetect</h3>
          <p>Trigger count: {triggerCount}</p>
          <p>Scroll down to see the custom styled trigger zone.</p>
        </div>
        
        <EndDetect onEnd={() => setTriggerCount(prev => prev + 1)}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '3rem',
            borderRadius: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transform: 'scale(1)',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5em' }}>🎯 Magic Trigger Zone</h3>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9 }}>
              Scroll here or click to activate!
            </p>
            <div style={{ 
              fontSize: '0.9em', 
              opacity: 0.8,
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              display: 'inline-block'
            }}>
              Triggered: {triggerCount} times
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'rotate 10s linear infinite',
            pointerEvents: 'none'
          }} />
        </div>
        
        <div style={{ height: '200px', padding: '2rem', background: '#e8f4f8' }}>
          <p>Content continues after the EndDetect component...</p>
        </div>
        
        <style>{`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }
};