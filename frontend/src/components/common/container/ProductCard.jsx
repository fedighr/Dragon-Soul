import React, { useState } from "react";
import "./ProductCard.css";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onShowMore }) => {
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const handleCardClick = (e) => {
    if (window.innerWidth < 1024) {
      e.stopPropagation();
      setIsMobileActive(!isMobileActive);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.product-card')) {
        setIsMobileActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleShowMoreClick = (e) => {
    e.stopPropagation();
    if (onShowMore) {
      onShowMore();
    }
  };

  if (product.isShowMore) {
    return (
      <div className="product-card show-more-card" onClick={handleShowMoreClick}>
        <div className="show-more-content">
          <div className="show-more-icon">+</div>
          <button className="show-more-btn" onClick={handleShowMoreClick}>
            Show More
          </button>
        </div>
      </div>
    );
  }

  if (product.isEmpty) {
    return <div className="product-card empty-card"></div>;
  }

  return (
    <div
      className={`product-card ${isMobileActive ? 'mobile-active' : ''}`}
      onClick={handleCardClick}
    >
      <div className="product-image">
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
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        <span className="new-badge">NEW</span>

        <div className="product-actions">
          <button className="action-btn add-to-cart">
            <i className="bi bi-cart-plus"></i>
            Add To Cart
          </button>
          <div className="action-buttons">
            <button className="action-btn wishlist" title="Add to wishlist">
              <i className="bi bi-heart"></i>
            </button>
            <button
                className="action-btn view"
                title="View Product"
                onClick={() => navigate('/Product')}
            >
              <i className="bi bi-eye"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{product.price}</div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);