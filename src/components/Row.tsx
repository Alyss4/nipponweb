import React from 'react';

interface RowProps {
  children: React.ReactNode;
  className?: string;
}

const Row: React.FC<RowProps> = ({ children, className = '' }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

export default Row;
