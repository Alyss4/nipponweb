import React from 'react';

interface ColProps {
  children: React.ReactNode;
  className?: string;
}

const Col: React.FC<ColProps> = ({ children, className = '' }) => {
  const style: React.CSSProperties = {
    flex: 1,
    minWidth: '300px',
    width: '100%',
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

export default Col;
