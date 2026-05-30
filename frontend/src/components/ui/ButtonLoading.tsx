import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import './ui-styles.css';

interface ButtonLoadingProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode;
}

export const ButtonLoading = ({ isLoading, children, ...props }: ButtonLoadingProps) => {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      <div className="btn-loading-content">
        {isLoading && <LoadingSpinner size="sm" />}
        <span>{isLoading ? "Processando..." : children}</span>
      </div>
    </button>
  );
};
