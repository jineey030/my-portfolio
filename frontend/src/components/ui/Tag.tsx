import type { ReactNode } from 'react';
import './Tag.css';

interface TagProps {
  children: ReactNode;
}

function Tag({ children }: TagProps) {
  return (
    <span className="ui-tag">
      {children}
    </span>
  );
}

export default Tag;