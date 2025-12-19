import React, { useState, useEffect, useRef } from "react";
import "./ProductCard.css";
import { useNavigate } from 'react-router-dom';
import { useCart } from "../../layout/Context/CartContext";
import { addCartItem } from "../../../services/store"

const ProductCard = ({ product, productcolor_set, onAddtoCart }) => {
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const navigate = useNavigate();
  const { toastMessage, clearToastMessage } = useCart();
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const successTimerRef = useRef(null);

  const uniqueColors = productcolor_set?.reduce((acc, color) => {
    if (!acc.find(c => c.color === color.color)) {
      acc.push({
        color: color.color,
        hex: getColorHex(color.color),
        image: color.image
      });
    }
    return acc;
  }, []) || [];

  function getColorHex(colorName) {
    const colorMap = {
      'red': '#ff0000',
      'blue': '#0000ff',
      'green': '#008000',
      'black': '#000000',
      'white': '#ffffff',
      'gray': '#808080',
      'navy': '#000080',
      'beige': '#f5f5dc',
      'brown': '#a52a2a',
      'yellow': '#ffff00',
      'orange': '#ffa500',
      'purple': '#800080',
      'pink': '#ffc0cb',
      'gold': '#ffd700',
      'silver': '#c0c0c0'
    };
    return colorMap[colorName?.toLowerCase()] || '#cccccc';
  }

  const getCurrentImage = () => {
    if (uniqueColors[currentColorIndex]?.image) {
      return uniqueColors[currentColorIndex].image;
    }
    if (productcolor_set?.[0]?.image) {
      return productcolor_set[0].image;
    }
    return product.image || '/default-product.jpg';
  };

  const handleCardClick = (e) => {
    if (
      e.target.closest('.action-btn') || 
      e.target.closest('.show-more-btn') ||
      e.target.closest('.color-indicator') ||
      e.target.closest('.product-actions')
    ) {
      return;
    }
    
    if (product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleActionClick = async (e, action) => {
    e.stopPropagation();
    
    switch (action) {
      case 'view':
        if (product.id) navigate(`/product/${product.id}`);
        break;
      case 'cart':
        setIsAdding(true);
        try {
          
          const success = await addCartItem(onAddtoCart());
          if (success) {
            setAddSuccess(true);
            
            if (successTimerRef.current) {
              clearTimeout(successTimerRef.current);
            }
            
            successTimerRef.current = setTimeout(() => {
              setAddSuccess(false);
            }, 1000);
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
        } finally {
          setIsAdding(false);
        }
        break;
      case 'wishlist':
        break;
      default:
        break;
    }
  };

  const handleColorSelect = (e, index) => {
    e.stopPropagation();
    setCurrentColorIndex(index);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    longPressTimerRef.current = setTimeout(() => {
      setIsMobileActive(true);
    }, 800);
  };

  const handleTouchMove = (e) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchEnd = (e) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (!touchStartRef.current) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const diffX = Math.abs(touchEnd.x - touchStartRef.current.x);
    const diffY = Math.abs(touchEnd.y - touchStartRef.current.y);
    
    if (diffX < 10 && diffY < 10) {
      e.preventDefault();
      
      if (isMobileActive) {
        setIsMobileActive(false);
      } else {
        setTimeout(() => {
          if (product.id) {
            navigate(`/product/${product.id}`);
          }
        }, 50);
      }
    }
    
    touchStartRef.current = null;
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsHovering(false);
      setIsMobileActive(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileActive && !e.target.closest('.product-card')) {
        setIsMobileActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileActive]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  if (product.isShowMore) {
    return (
      <div 
        className="product-card show-more-card" 
        onClick={handleCardClick}
      >
        <div className="show-more-content">
          <div className="show-more-icon">+</div>
          <button className="show-more-btn" onClick={handleCardClick}>
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
    <>
      <div
        className={`product-card ${isMobileActive ? 'mobile-active' : ''} ${addSuccess ? 'added-to-cart' : ''}`}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="product-image-container">
          <div className="product-image">
            {!imageLoaded && !imageError && (
              <div className="image-loading">
                <div className="mini-spinner">
                  <div className="spinner-dot"></div>
                  <div className="spinner-dot"></div>
                  <div className="spinner-dot"></div>
                </div>
              </div>
            )}
            {imageError && (
              <div className="image-error">
                <i className="bi bi-image"></i>
              </div>
            )}
            <img
              src={getCurrentImage()}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
            <span className="new-badge">NEW</span>

            <div 
              className={`product-actions ${isHovering || isMobileActive ? 'active' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={`action-btn add-to-cart ${isAdding ? 'adding' : ''} ${addSuccess ? 'success' : ''}`}
                onClick={(e) => handleActionClick(e, 'cart')}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <div className="add-cart-spinner"></div>
                    Adding...
                  </>
                ) : addSuccess ? (
                  <>
                    <i className="bi bi-check-circle-fill"></i>
                    Added!
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-plus"></i>
                    Add To Cart
                  </>
                )}
              </button>
              <div className="action-buttons">
                <button 
                  className="action-btn wishlist" 
                  onClick={(e) => handleActionClick(e, 'wishlist')}
                  title="Add to wishlist"
                >
                  <i className="bi bi-heart"></i>
                </button>
                <button
                  className="action-btn view"
                  onClick={(e) => handleActionClick(e, 'view')}
                  title="View Product"
                >
                  <i className="bi bi-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="price-colors-container">
            <div className="product-price">{product.price}</div>
            {uniqueColors.length > 0 && (
              <div className="color-indicators">
                {uniqueColors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className={`color-indicator ${currentColorIndex === index ? 'selected' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    data-color={color.color}
                    title={color.color}
                    onClick={(e) => handleColorSelect(e, index)}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 1024) {
                        e.target.title = color.color;
                      }
                    }}
                  />
                ))}
                {uniqueColors.length > 4 && (
                  <div 
                    className="color-indicator more-colors"
                    title={`${uniqueColors.length - 4} more colors`}
                    data-color={`+${uniqueColors.length - 4} more`}
                  >
                    +{uniqueColors.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {addSuccess && (
          <div className="add-success-animation">
            <i className="bi bi-check-circle"></i>
          </div>
        )}
      </div>
      
      {toastMessage && (
        <div className={`product-toast-notification ${toastMessage.type}`}>
          <div className="toast-content">
            {toastMessage.type === 'success' ? (
              <i className="bi bi-check-circle-fill"></i>
            ) : toastMessage.type === 'error' ? (
              <i className="bi bi-exclamation-circle-fill"></i>
            ) : (
              <i className="bi bi-info-circle-fill"></i>
            )}
            <span>{toastMessage.text}</span>
            <button 
              className="toast-close"
              onClick={clearToastMessage}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ProductCard);