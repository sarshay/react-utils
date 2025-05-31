'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { sanitizeId } from '../utils/sanitizeId';

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
    throw new Error('useContent must be used within a ClientContent');
  }
  return context;
};

interface ClientContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ClientContent: React.FC<ClientContentProps> = ({
  children,
  className,
  style,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const headingItems = Array.from(headings).map((heading) => {
        const level = parseInt(heading.tagName[1]);
        const text = heading.textContent || "";
        const id = sanitizeId(text);
        heading.id = id;
        return { id, text, level };
      });
      setHeadings(headingItems);
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

export default ClientContent; 