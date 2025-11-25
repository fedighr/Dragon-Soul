import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  text = 'Loading...',
  showText = true 
}) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className={`dragon-spinner ${color}`}>
        <div className="spinner-core"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-glow"></div>
      </div>
      {showText && <p className="loading-text">{text}</p>}
    </div>
  );
};

export const ButtonLoadingSpinner = ({ 
  size = 'small',
  text = 'Processing...' 
}) => {
  return (
    <div className={`button-loading-container ${size}`}>
      <div className="button-spinner">
        <div className="spinner-dot"></div>
        <div className="spinner-dot"></div>
        <div className="spinner-dot"></div>
      </div>
      <span className="button-loading-text">{text}</span>
    </div>
  );
};

export default LoadingSpinner;