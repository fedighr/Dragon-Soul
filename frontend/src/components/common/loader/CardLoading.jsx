import React from 'react';
import './CardLoading.css';

const CardLoading = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardLoading;