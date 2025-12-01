import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header/Header.jsx';
import { useCart } from '../../hooks/useCart';
import LoadingSpinner, { ButtonLoadingSpinner } from '../../components/common/loader/LoadingSpinner.jsx';
import BackToTopButton from '../../components/common/button/BackToTopButton.jsx';
import './cart.css';

const Cart = () => {
  const {
    cartItems,
    pendingDeleteItem,
    loading,
    loadingItems,
    isClearing,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    keepItem,
    getTotalItems,
    getTotalPrice,
    clearCart,
    getItemLoadingState
  } = useCart();

  if (loading && cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-container">
          <div className="loading-cart">
            <LoadingSpinner size="large" text="Loading your cart..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      
      <div className="cart-container">
        <div className="cart-page-header">
          <div className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Shopping Cart</span>
          </div>
          
          <div className="page-title-section">
            <h1>Shopping Cart</h1>
            <p className="page-subtitle">{getTotalItems()} items in your cart</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-page">
            <div className="empty-cart-illustration">
              <i className="bi bi-cart-x"></i>
            </div>
            <div className="empty-cart-content">
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <div className="empty-cart-actions">
                <Link to="/store" className="back-to-store-btn primary">
                  <i className="bi bi-arrow-left"></i>
                  Continue Shopping
                </Link>
                <Link to="/product" className="back-to-store-btn secondary">
                  <i className="bi bi-star"></i>
                  Browse Popular Items
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-main-section">
              <div className="cart-section-header">
                <h2>Cart Items ({getTotalItems()})</h2>
                <button 
                  className="clear-cart-btn" 
                  onClick={clearCart}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <ButtonLoadingSpinner size="small" text="Clearing..." />
                  ) : (
                    <>
                      <i className="bi bi-trash"></i>
                      Clear All
                    </>
                  )}
                </button>
              </div>

              <div className="cart-items-container">
                {cartItems.map((item, index) => {
                  const isUpdating = getItemLoadingState(item.id, item.color, item.size, 'quantity');
                  const isRemoving = getItemLoadingState(item.id, item.color, item.size, 'remove');
                  
                  return (
                    <div 
                      key={`${item.id}-${item.color}-${item.size}`} 
                      className={`cart-item-card ${isUpdating || isRemoving ? 'loading' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="item-image-container">
                        <img src={item.image} alt={item.name} className="item-image" />
                        {(isUpdating || isRemoving) && (
                          <div className="item-loading-overlay">
                            <div className="mini-spinner">
                              <div className="spinner-dot"></div>
                              <div className="spinner-dot"></div>
                              <div className="spinner-dot"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="item-info-container">
                        <div className="item-main-info">
                          <h3 className="item-name">{item.name}</h3>
                          <p className="item-id">Product ID: {item.productId || item.id}</p>
                        </div>
                        
                        <div className="item-details-grid">
                          <div className="detail-item">
                            <span className="detail-label">Color:</span>
                            <div className="detail-value">
                              <span 
                                className="color-indicator" 
                                style={{ 
                                  backgroundColor: item.color?.toLowerCase().includes('black') ? '#000' : 
                                                item.color?.toLowerCase().includes('blue') ? '#1e40af' : 
                                                item.color?.toLowerCase().includes('white') ? '#e5e5e5' : '#6b7280' 
                                }}
                              ></span>
                              {item.color}
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Size:</span>
                            <span className="detail-value">{item.size}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Price:</span>
                            <span className="detail-value price">${item.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="item-controls-container">
                        <div className="quantity-section">
                          <label className="quantity-label">Quantity:</label>
                          <div className="quantity-controls-large">
                            <button
                              className="quantity-btn-large"
                              onClick={() => decrementQuantity(item.id, item.color, item.size)}
                              disabled={isUpdating || isRemoving || item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              {isUpdating && item.quantity === 1 ? (
                                <div className="button-mini-loader">
                                  <div className="loader-dot"></div>
                                </div>
                              ) : (
                                <i className="bi bi-dash"></i>
                              )}
                            </button>
                            <span className="quantity-display">
                              {isUpdating ? (
                                <div className="quantity-loader">
                                  <div className="pulse-dot"></div>
                                </div>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              className="quantity-btn-large"
                              onClick={() => incrementQuantity(item.id, item.color, item.size)}
                              disabled={isUpdating || isRemoving}
                              aria-label="Increase quantity"
                            >
                              {isUpdating ? (
                                <div className="button-mini-loader">
                                  <div className="loader-dot"></div>
                                </div>
                              ) : (
                                <i className="bi bi-plus"></i>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="item-total-section">
                          <span className="total-label">Total:</span>
                          <span className="total-price">
                            {isUpdating ? (
                              <div className="price-loader">
                                <div className="shimmer-line"></div>
                              </div>
                            ) : (
                              `$${(item.price * item.quantity).toFixed(2)}`
                            )}
                          </span>
                        </div>

                        <button
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.id, item.color, item.size)}
                          disabled={isRemoving || isUpdating}
                        >
                          {isRemoving ? (
                            <ButtonLoadingSpinner size="small" text="Removing..." />
                          ) : (
                            <>
                              <i className="bi bi-trash"></i>
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="summary-card">
                <div className="summary-header">
                  <h3>Order Summary</h3>
                  <div className="summary-badge">{getTotalItems()} items</div>
                </div>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span className="value">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span className="value free">FREE</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span className="value">Calculated at checkout</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row grand-total">
                    <span>Total:</span>
                    <span className="value total">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-actions">
                  <button className="checkout-btn-primary">
                    <i className="bi bi-lock"></i>
                    Proceed to Checkout
                  </button>
                  
                  <Link to="/store" className="continue-shopping-link">
                    <i className="bi bi-arrow-left"></i>
                    Continue Shopping
                  </Link>
                  
                  <div className="security-notice">
                    <i className="bi bi-shield-check"></i>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </div>

              <div className="promo-section">
                <h4>Special Offers</h4>
                <div className="promo-card">
                  <div className="promo-icon">
                    <i className="bi bi-truck"></i>
                  </div>
                  <div className="promo-content">
                    <h5>Free Shipping</h5>
                    <p>On all orders over $50</p>
                  </div>
                </div>
                <div className="promo-card">
                  <div className="promo-icon">
                    <i className="bi bi-arrow-repeat"></i>
                  </div>
                  <div className="promo-content">
                    <h5>Easy Returns</h5>
                    <p>30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
              <button className="cancel-btn" onClick={keepItem}>
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
      <BackToTopButton/>
    </div>
  );
};

export default Cart;