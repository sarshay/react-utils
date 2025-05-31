// src/hooks/useScrollPosition.ts
import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export const useScrollPosition = (): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: window.scrollX,
    y: window.scrollY,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Call handler right away so state gets updated with initial scroll position
    handleScroll();

    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return scrollPosition;
};