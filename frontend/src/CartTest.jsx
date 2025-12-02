// components/CartSlideIn.jsx - DEBUG VERSION
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import './components/layout/Cart/CartSlideIn.css';

const CartSlideIn = () => {
  const {
    cartItems,
    isCartOpen,
    pendingDeleteItem,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    keepItem,
    getTotalItems,
    getTotalPrice,
    closeCart,
    resetWithMockData
  } = useCart();

  // Debug effect to log cart state changes
  useEffect(() => {
    console.log('🛒 CartSlideIn State Update:', {
      isCartOpen,
      cartItemsCount: cartItems.length,
      totalItems: getTotalItems()
    });
  }, [isCartOpen, cartItems, getTotalItems]);

  const displayedItems = cartItems.slice(0, 4);

  const handleOverlayClick = (e) => {
    console.log('Overlay clicked');
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  const handleCartClose = () => {
    console.log('Close button clicked');
    closeCart();
  };

  // Force open for testing
  const forceOpenCart = () => {
    console.log('Force opening cart');
    // This is a hack to force the cart open - we'll manually set the class
    document.querySelector('.cart-slide-in')?.classList.add('active');
    document.querySelector('.cart-overlay')?.classList.add('active');
  };

  return (
    <>
      {/* Debug button - remove in production */}
      <button
        onClick={forceOpenCart}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '12px'
        }}
      >
        DEBUG: Force Open Cart
      </button>

      {/* Slide-in Cart Overlay */}
      <div
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={handleOverlayClick}
        style={{ display: isCartOpen ? 'block' : 'none' }} // Force display
      ></div>

      {/* Slide-in Cart Panel */}
      <div
        className={`cart-slide-in ${isCartOpen ? 'active' : ''}`}
        style={{ display: isCartOpen ? 'flex' : 'flex' }} // Always in DOM but positioned off-screen
      >
        <div className="cart-header">
          <div className="cart-title">
            <i className="bi bi-cart3"></i>
            <h3>Your Cart ({getTotalItems()})</h3>
          </div>
          <button className="cart-close-btn" onClick={handleCartClose} aria-label="Close cart">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="cart-content">
          {displayedItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="bi bi-cart-x"></i>
              </div>
              <h4>Your cart is empty</h4>
              <p>Add some products to get started</p>

              <button
                onClick={resetWithMockData}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '15px'
                }}
              >
                Load Mock Data
              </button>

              <button className="continue-shopping-btn" onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {displayedItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="cart-item"
                  >
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-id">ID: {item.productId}</p>
                      <div className="item-attributes">
                        <span className="item-color">
                          <span
                            className="color-swatch"
                            style={{
                              backgroundColor: item.color.toLowerCase().includes('black') ? '#000' :
                                            item.color.toLowerCase().includes('blue') ? '#1e40af' :
                                            item.color.toLowerCase().includes('white') ? '#e5e5e5' : '#6b7280'
                            }}
                          ></span>
                          {item.color}
                        </span>
                        <span className="item-size">Size: {item.size}</span>
                      </div>
                      <div className="item-price">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => decrementQuantity(item.id, item.color, item.size)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => incrementQuantity(item.id, item.color, item.size)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => removeFromCart(item.id, item.color, item.size)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {cartItems.length > 4 && (
                <div className="see-all-section">
                  <Link to="/cart" className="see-all-btn" onClick={closeCart}>
                    <i className="bi bi-arrow-right"></i>
                    See All Orders ({cartItems.length - 4} more)
                  </Link>
                </div>
              )}

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span className="price">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free">Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span className="price">${getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="cart-actions">
                  <Link to="/cart" className="view-cart-btn" onClick={closeCart}>
                    View Full Cart
                  </Link>
                  <button className="checkout-btn">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
    </>
  );
};

export default CartSlideIn;