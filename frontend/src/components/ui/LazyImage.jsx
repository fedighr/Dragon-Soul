import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, onLoad, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <>
      {!imageLoaded && !imageError && (
        <div className="image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      {imageError && (
        <div className="image-error">
          <i className="bi bi-image"></i>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={handleLoad}
        onError={() => setImageError(true)}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        {...props}
      />
    </>
  );
};
export default LazyImage;