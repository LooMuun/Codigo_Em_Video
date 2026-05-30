import React from 'react';
import './ui-styles.css';

export const LoadingSpinner = ({ size = 'md', color = 'currentColor' }: { size?: 'sm' | 'md' | 'lg', color?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-10 h-10 border-4',
  };

  return (
    <div className={`ui-spinner ${sizeClasses[size]}`} style={{ borderColor: color }}>
      <div className="spinner-inner"></div>
    </div>
  );
};
