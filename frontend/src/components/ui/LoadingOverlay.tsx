import React from 'react';
import './ui-styles.css';

export const LoadingOverlay = ({ message = "Carregando" }: { message?: string }) => {
  return (
    <div className="ui-loading-overlay">
      <div className="ui-loading-container">
        <div className="ui-loading-spinner-wrap">
          <div className="ui-loading-spinner-sub" />
          <div className="ui-loading-spinner-main" />
        </div>
        <p className="ui-loading-text">{message}</p>
      </div>
    </div>
  );
};
