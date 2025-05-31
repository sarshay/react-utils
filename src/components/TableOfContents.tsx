import React, { useContext } from 'react';
import { ContentContext } from './Content';

interface TableOfContentsProps {
  className?: string;
  headingClassNames?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  className = '',
  headingClassNames = {}
}) => {
  const context = useContext(ContentContext);
  
  if (!context) {
    throw new Error('TableOfContents must be used within a Content component');
  }

  const { headers, scrollToHeading } = context;

  const getLevelClassName = (level: string) => {
    const baseClass = "cursor-pointer hover:text-blue-700";
    const levelClass = headingClassNames[level as keyof typeof headingClassNames] || '';
    return `${baseClass} ${levelClass}`.trim();
  };

  return (
    <ul className={className}>
      {headers.map((h) => (
        <li
          key={h.id}
          onClick={() => scrollToHeading(h.id)}
          className={getLevelClassName(h.level)}
          style={{
            marginLeft: `${parseInt(h.level.charAt(1)) - 1}0px`,
          }}
        >
          {h.content}
        </li>
      ))}
    </ul>
  );
}; 