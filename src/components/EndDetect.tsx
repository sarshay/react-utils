'use client';

import React, { useRef, useEffect, useState } from "react";

interface EndDetectProps {
  onEnd: (end: boolean) => void;
  children?: React.ReactNode | React.ReactNode[];
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const EndDetect: React.FC<EndDetectProps> = ({
  onEnd,
  children,
  height = "200px",
  className = "",
  style = {},
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
    };
  }, [divRef.current]);

  useEffect(() => {
    onEnd(isIntersecting);
  }, [isIntersecting, onEnd]);

  return (
    <div
      ref={divRef}
      className={className}
      style={{
        height,
        ...style,
      }}
      onClick={() => onEnd(true)}
    >
      {children || ""}
    </div>
  );
};

export default EndDetect;