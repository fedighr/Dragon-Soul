import React, { useMemo, useCallback, memo, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext"
import "./CartSlideIn.css";

const CartItem = memo(({ 
  item, 
  isUpdating, 
  isRemoving, 
  onIncrement, 
  onDecrement, 
  onRemove,
  stockError
}) => {
  const { id, color, size, image, name, price, quantity } = item;
  
  return (
    <div className={`cart-item ${isUpdating || isRemoving ? 'updating' : ''} ${stockError ? 'stock-error' : ''}`}>
      <div className="item-image">
        <img 
          src={image} 
          alt={name} 
          loading="lazy"
        />
        {(isUpdating || isRemoving) && (
          <div className="item-loading-overlay">
            <div className="mini-spinner"></div>
          </div>
        )}
      </div>
      
      <div className="item-details">
        <h4 className="item-name">{name}</h4>
        <div className="item-attributes">
          <span className="item-color">
            <span 
              className="color-swatch" 
              style={{ 
                backgroundColor: color?.toLowerCase().includes('black') ? '#000' : 
                              color?.toLowerCase().includes('blue') ? '#1e40af' : 
                              color?.toLowerCase().includes('white') ? '#e5e5e5' :
                              color?.toLowerCase().includes('red') ? '#dc2626' : '#6b7280' 
              }}
            ></span>
            {color}
          </span>
          <span className="item-size">Size: {size}</span>
        </div>
        <div className="item-price">
          ${(price * quantity).toFixed(2)}
        </div>
      </div>
      
      <div className="item-controls">
        <div className="quantity-controls">
          <button
            className={`quantity-btn ${stockError ? 'stock-error' : ''}`}
            onClick={() => onDecrement(id, color, size)}
            disabled={isUpdating || isRemoving || quantity <= 1}
            aria-label="Decrease quantity"
          >
            <i className="bi bi-dash"></i>
          </button>
          <span className="quantity">{quantity}</span>
          <button
            className={`quantity-btn ${stockError ? 'stock-error' : ''}`}
            onClick={() => onIncrement(id, color, size)}
            disabled={isUpdating || isRemoving || stockError}
            aria-label="Increase quantity"
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
        <button
          className="delete-btn"
          onClick={() => onRemove(id, color, size)}
          disabled={isRemoving || isUpdating}
          aria-label="Remove item"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.isUpdating === nextProps.isUpdating &&
    prevProps.isRemoving === nextProps.isRemoving &&
    prevProps.stockError === nextProps.stockError
  );
});

CartItem.displayName = 'CartItem';

const CartSlideIn = () => {
  const {
    cartItems,
    isCartOpen,
    pendingDeleteItem,
    loading,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    keepItem,
    getTotalItems,
    getTotalPrice,
    getItemLoadingState,
    closeCart,
    stockErrors,
    toastMessage,
    clearToastMessage
  } = useCart();

  const cartRef = useRef(null);
  const isClosingRef = useRef(false);

  const displayedCartItems = useMemo(() => 
    Array.isArray(cartItems) ? cartItems : []
  , [cartItems]);

  const totalItems = useMemo(() => getTotalItems(), [cartItems]);
  const totalPrice = useMemo(() => getTotalPrice(), [cartItems]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isCartOpen && 
          cartRef.current && 
          !cartRef.current.contains(e.target) &&
          !e.target.closest('.nav-icon-btn') &&
          !isClosingRef.current) {
        closeCart();
      }
    };

    const handleEscapeKey = (e) => {
      if (isCartOpen && e.key === 'Escape') {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  const handleCloseCart = useCallback(() => {
    isClosingRef.current = true;
    closeCart();
    setTimeout(() => {
      isClosingRef.current = false;
    }, 300);
  }, [closeCart]);

  const handleIncrement = useCallback(async (itemId, color, size) => {
    await incrementQuantity(itemId, color, size);
  }, [incrementQuantity]);

  const handleDecrement = useCallback(async (itemId, color, size) => {
    await decrementQuantity(itemId, color, size);
  }, [decrementQuantity]);

  const handleRemove = useCallback(async (itemId, color, size) => {
    await removeFromCart(itemId, color, size);
  }, [removeFromCart]);

  const handleCloseNotification = useCallback(() => {
    clearToastMessage();
  }, [clearToastMessage]);

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`} 
        onClick={handleCloseCart}
      />
      
      {toastMessage && (
        <div className={`add-to-cart-notification ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? (
            <i className="bi bi-check-circle-fill"></i>
          ) : toastMessage.type === 'error' ? (
            <i className="bi bi-exclamation-circle-fill"></i>
          ) : (
            <i className="bi bi-info-circle-fill"></i>
          )}
          <span>{toastMessage.text}</span>
          <button 
            className="notification-close"
            onClick={handleCloseNotification}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
      
      <div 
        ref={cartRef}
        className={`cart-slide-in ${isCartOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="cart-header">
          <div className="cart-title">
            <i className="bi bi-cart3"></i>
            <h3>Your Cart ({totalItems})</h3>
          </div>
          <button 
            className="cart-close-btn" 
            onClick={handleCloseCart}
            aria-label="Close cart"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="cart-content">
          {loading && displayedCartItems.length === 0 ? (
            <div className="cart-loading">
              <div className="loading-cart-items">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="cart-item-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-details">
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line medium"></div>
                      <div className="skeleton-line long"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : displayedCartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="bi bi-cart-x"></i>
              </div>
              <h4>Your cart is empty</h4>
              <p>Add some products to get started</p>
              
              <button 
                className="continue-shopping-btn"
                onClick={handleCloseCart}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-container">
                <div className="cart-items-scroll">
                  {displayedCartItems.map((item) => {
                    const isUpdating = getItemLoadingState(item.id, item.color, item.size, 'quantity');
                    const isRemoving = getItemLoadingState(item.id, item.color, item.size, 'remove');
                    const stockError = stockErrors[`${item.id}-${item.color}-${item.size}`];
                    
                    return (
                      <CartItem
                        key={`${item.id}-${item.color}-${item.size}`}
                        item={item}
                        isUpdating={isUpdating}
                        isRemoving={isRemoving}
                        stockError={stockError}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        onRemove={handleRemove}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="cart-summary">
                <div className="summary-row total">
                  <span>Total:</span>
                  <span className="price">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="cart-actions">
                  <Link 
                    to="/cart" 
                    className="view-cart-btn"
                    onClick={handleCloseCart}
                  >
                    View Full Cart
                  </Link>
                  <button 
                    className="checkout-btn"
                    onClick={() => console.log('Proceed to checkout')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {pendingDeleteItem && (
        <div className="delete-confirmation-modal">
          <div className="modal-overlay" onClick={keepItem}></div>
          <div className="modal-content">
            <div className="modal-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h4>Remove Item</h4>
            <p>Are you sure you want to remove "<strong>{pendingDeleteItem.name}</strong>" from your cart?</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={keepItem}
              >
                Keep Item
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => removeFromCart(pendingDeleteItem.id, pendingDeleteItem.color, pendingDeleteItem.size)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CartSlideIn);