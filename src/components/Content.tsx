import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { sanitizeId } from '../utils/sanitize';

interface Heading {
  level: string;
  content: string;
  id: string;
}

interface ContentContextType {
  headers: Heading[];
  scrollToHeading: (id: string) => void;
}

export const ContentContext = createContext<ContentContextType | null>(null);

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Content: React.FC<ContentProps> = ({ 
  children, 
  className = ''
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headers, setHeaders] = useState<Heading[]>([]);

  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const contentArray: Heading[] = Array.from(headings).map((heading) => {
        const id = sanitizeId(heading.textContent || "");
        heading.id = id;
        return {
          level: heading.tagName.toLowerCase(),
          content: heading.textContent || "",
          id: id,
        };
      });
      setHeaders(contentArray);
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
    <ContentContext.Provider value={{ headers, scrollToHeading }}>
      <div ref={contentRef} className={className}>
        {children}
      </div>
    </ContentContext.Provider>
  );
}; 