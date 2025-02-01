import React from 'react';

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-spin rounded-full border-2 border-white border-t-transparent ${className}`}
      style={{ 
        width: '1.25rem', 
        height: '1.25rem', 
        borderWidth: '3px' 
      }}
    />
  );
};
