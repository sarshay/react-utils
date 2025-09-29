'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { sanitizeId } from '../../utils/sanitizeId';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ContentContextType {
  headings: Heading[];
  scrollToHeading: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
  className,
  style,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    if (contentRef.current) {
      const updateHeadings = () => {
        const headings = contentRef.current?.querySelectorAll("h1, h2, h3, h4, h5, h6");
        if (headings) {
          const headingItems = Array.from(headings).map((heading) => {
            const level = parseInt(heading.tagName[1]);
            const text = heading.textContent || "";
            const id = sanitizeId(text);
            heading.id = id;
            return { id, text, level };
          });
          setHeadings(headingItems);
        }
      };

      // Initial headings update
      updateHeadings();

      // Set up MutationObserver to watch for DOM changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            updateHeadings();
          }
        });
      });

      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [children]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <ContentContext.Provider value={{ headings, scrollToHeading }}>
      <div ref={contentRef} className={className} style={style}>
        {children}
      </div>
    </ContentContext.Provider>
  );
};

export default ContentProvider; 