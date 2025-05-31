'use client';

import React from "react";
import { useContent } from "./ClientContent";

interface TableOfContentsProps {
  className?: string;
  style?: React.CSSProperties;
  headingClassNames?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  className,
  style,
  headingClassNames = {},
}) => {
  const { headings, scrollToHeading } = useContent();

  const getLevelClassName = (level: number) => {
    const baseClass = "cursor-pointer hover:text-blue-700";
    const levelClass = headingClassNames[`h${level}` as keyof typeof headingClassNames] || '';
    return `${baseClass} ${levelClass}`.trim();
  };

  return (
    <nav className={className} style={style}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {headings.map((item, index) => (
          <li
            key={index}
            style={{
              marginLeft: `${(item.level - 1) * 20}px`,
              marginBottom: "8px",
            }}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(item.id);
              }}
              className={getLevelClassName(item.level)}
              style={{
                textDecoration: "none",
                color: "#333",
                fontSize: `${18 - (item.level - 1) * 2}px`,
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents; 