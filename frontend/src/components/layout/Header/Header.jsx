import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLogout } from "../../../hooks/useLogout.js";
import { isLoggedIn } from "../../../utils/auth.jsx";
import { useHeader } from "../../../hooks/useHeader.js";
import { ButtonLoadingSpinner } from "../../common/loader/LoadingSpinner.jsx";
import "./Header.css";

const Header = ({ image }) => {
  const logout = useLogout();
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isDisabledPage = location.pathname === '/cart';
  const {
    cartItems,
    isCartOpen,
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
    getItemLoadingState,
    openCart,
    closeCart,
    
    isMobileMenuOpen,
    isSearchOpen,
    isUserMenuOpen,
    searchQuery,
    
    toggleMobileMenu,
    toggleSearch,
    toggleUserMenu,
    closeAllMenus,
    setSearchQuery,
    
    setIsMobileMenuOpen,
    setIsSearchOpen,
    setIsUserMenuOpen
  } = useHeader();

  const searchPanelRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token && isLoggedIn()) {
      try {
        setUser(jwtDecode(token));
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('.nav-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsSearchOpen, setIsUserMenuOpen, setIsMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isSearchOpen, isCartOpen]);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    closeAllMenus();
    window.location.reload();
  }, [logout, closeAllMenus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      closeAllMenus();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    openCart();
    closeAllMenus();
  };

  const handleCartOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  const displayedCartItems = Array.isArray(cartItems) ? cartItems.slice(0, 4) : [];

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <button
            className="nav-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="nav-logo">
            {image ? (
              <>
                <img src={image} alt="Dragon Soul Logo" className="logo-img" />
                <span>Dragon Soul</span>
              </>
            ) : (
              <span>Dragon Soul</span>
            )}
          </div>

          <div className="nav-menu">
            <Link to="/" className="nav-link" onClick={closeAllMenus}>Home</Link>
            <Link to="/product" className="nav-link" onClick={closeAllMenus}>Men</Link>
            <Link to="/women" className="nav-link" onClick={closeAllMenus}>Women</Link>
            <Link to="/Store" className="nav-link" onClick={closeAllMenus}>Store</Link>
            <Link to="/about" className="nav-link" onClick={closeAllMenus}>About</Link>
          </div>

          <div className="nav-icons">
            <button
              className="nav-icon-btn"
              onClick={toggleSearch}
              aria-label="Search"
              aria-expanded={isSearchOpen}
            >
              <i className="bi bi-search"></i>
            </button>

            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className="nav-icon-btn"
                onClick={toggleUserMenu}
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
              >
                <i className="bi bi-person"></i>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  {user ? (
                    <>
                      <div className="user-info">
                        {user.first_name || user.username} {user.last_name || ''}
                      </div>
                      <Link to="/account" className="dropdown-item" onClick={closeAllMenus}>
                        <i className="bi bi-person-circle"></i> Account
                      </Link>
                      <Link to="/orders" className="dropdown-item" onClick={closeAllMenus}>
                        <i className="bi bi-bag-check"></i> Orders
                      </Link>
                      <Link to="/settings" className="dropdown-item" onClick={closeAllMenus}>
                        <i className="bi bi-gear"></i> Settings
                      </Link>
                      <button
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item" onClick={closeAllMenus}>
                        <i className="bi bi-box-arrow-in-right"></i> Login
                      </Link>
                      <Link to="/signup" className="dropdown-item" onClick={closeAllMenus}>
                        <i className="bi bi-person-plus"></i> Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
              <i className="bi bi-heart"></i>
            </Link>

            <button className="nav-icon-btn" aria-label="Notifications">
              <i className="bi bi-bell"></i>
              <span className="icon-badge"></span>
            </button>

            <button
              disabled={isDisabledPage}
              className="nav-icon-btn"
              onClick={handleCartClick}
              aria-label="Shopping cart"
            >
              <i className="bi bi-cart"></i>
              {loading && cartItems.length === 0 && (
                <span className="cart-loading-indicator"></span>
              )}
            </button>
          </div>

          <div className="mobile-icons">
            <button
              className="nav-icon-btn"
              onClick={toggleSearch}
              aria-label="Search"
              aria-expanded={isSearchOpen}
            >
              <i className="bi bi-search"></i>
            </button>

            <button className="nav-icon-btn" aria-label="Notifications">
              <i className="bi bi-bell"></i>
              <span className="icon-badge"></span>
            </button>

            <button
              disabled={isDisabledPage}
              className="nav-icon-btn"
              onClick={handleCartClick}
              aria-label="Shopping cart"
            >
              <i className="bi bi-cart"></i>
              {loading && cartItems.length === 0 && (
                <span className="cart-loading-indicator"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
        ref={mobileMenuRef}
      >
        <div className="mobile-menu-header">
          <button
            className="mobile-menu-close"
            onClick={closeAllMenus}
            aria-label="Close menu"
          >
            <i className="bi bi-x"></i>
          </button>
          <div className="mobile-menu-logo">
            {image ? (
              <img src={image} alt="Dragon Soul Logo" className="logo-img" />
            ) : (
              <span>Dragon Soul</span>
            )}
          </div>
        </div>

        <div className="mobile-menu-content">
          <div className="quick-actions-section">
            <h3>Quick Actions</h3>
            {user ? (
              <div className="user-quick-actions">
                <div className="user-welcome">
                  <i className="bi bi-person-circle"></i>
                  <div className="user-info-mobile">
                    <div className="user-name">{user.first_name || user.username} {user.last_name || ''}</div>
                    <div className="user-status">Online</div>
                  </div>
                </div>
                <div className="quick-action-buttons">
                  <Link to="/account" className="quick-action-btn" onClick={closeAllMenus}>
                    <i className="bi bi-person"></i>
                    <span>Account</span>
                  </Link>
                  <Link to="/orders" className="quick-action-btn" onClick={closeAllMenus}>
                    <i className="bi bi-bag-check"></i>
                    <span>Orders</span>
                  </Link>
                  <Link to="/settings" className="quick-action-btn" onClick={closeAllMenus}>
                    <i className="bi bi-gear"></i>
                    <span>Settings</span>
                  </Link>
                  <button className="quick-action-btn logout" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="guest-quick-actions">
                <div className="quick-action-buttons">
                  <Link to="/login" className="quick-action-btn primary" onClick={closeAllMenus}>
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="quick-action-btn secondary" onClick={closeAllMenus}>
                    <i className="bi bi-person-plus"></i>
                    <span>Register</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mobile-nav-section">
            <h3>Navigation</h3>
            <Link to="/" className="mobile-nav-link" onClick={closeAllMenus}>
              <i className="bi bi-house"></i>
              <span>Home</span>
            </Link>
            <Link to="/product" className="mobile-nav-link" onClick={closeAllMenus}>
              <i className="bi bi-person"></i>
              <span>Men</span>
            </Link>
            <Link to="/women" className="mobile-nav-link" onClick={closeAllMenus}>
              <i className="bi bi-person"></i>
              <span>Women</span>
            </Link>
            <Link to="/Store" className="mobile-nav-link" onClick={closeAllMenus}>
              <i className="bi bi-shop"></i>
              <span>Store</span>
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={closeAllMenus}>
              <i className="bi bi-info-circle"></i>
              <span>About</span>
            </Link>
          </div>

          <div className="mobile-actions-section">
            <h3>More</h3>
            <Link to="/wishlist" className="mobile-action-btn" onClick={closeAllMenus}>
              <i className="bi bi-heart"></i>
              <span>Wishlist</span>
            </Link>
            <button disabled={isDisabledPage} className="mobile-action-btn" onClick={handleCartClick}>
              <i className="bi bi-cart"></i>
              <span>Cart</span>
            </button>
            <button className="mobile-action-btn" onClick={closeAllMenus}>
              <i className="bi bi-question-circle"></i>
              <span>Help & Support</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`search-panel ${isSearchOpen ? 'active' : ''}`}
        ref={searchPanelRef}
      >
        <div className="search-panel-content">
          <div className="search-panel-header">
            <h3>Search Products</h3>
            <button
              className="search-panel-close"
              onClick={toggleSearch}
              aria-label="Close search"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
          <form onSubmit={handleSearchSubmit} className="search-input-container">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="search-panel-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-panel-submit">
              <i className="bi bi-search"></i>
              Search
            </button>
          </form>
          <div className="search-suggestions">
            <h4>Popular Searches</h4>
            <div className="suggestion-tags">
              <span
                className="suggestion-tag"
                onClick={() => handleSuggestionClick("T-Shirts")}
              >
                T-Shirts
              </span>
              <span
                className="suggestion-tag"
                onClick={() => handleSuggestionClick("Jeans")}
              >
                Jeans
              </span>
              <span
                className="suggestion-tag"
                onClick={() => handleSuggestionClick("Sneakers")}
              >
                Sneakers
              </span>
              <span
                className="suggestion-tag"
                onClick={() => handleSuggestionClick("Jackets")}
              >
                Jackets
              </span>
              <span
                className="suggestion-tag"
                onClick={() => handleSuggestionClick("Hoodies")}
              >
                Hoodies
              </span>
              <span
                className="suggestion-tag"
                onClick={() => handleSuggestionClick("Accessories")}
              >
                Accessories
              </span>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`} 
        onClick={handleCartOverlayClick}
      ></div>
      
      <div className={`cart-slide-in ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <i className="bi bi-cart3"></i>
            <h3>Your Cart ({getTotalItems()})</h3>
            {loading && cartItems.length === 0 && (
              <div className="header-cart-loader">
                <div className="mini-spinner">
                  <div className="spinner-dot"></div>
                </div>
              </div>
            )}
          </div>
          <button 
            className="cart-close-btn" 
            onClick={closeCart} 
            aria-label="Close cart"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="cart-content">
          {loading && cartItems.length === 0 ? (
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
              
              <button className="continue-shopping-btn" onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {displayedCartItems.map((item, index) => {
                  const isUpdating = getItemLoadingState(item.id, item.color, item.size, 'quantity');
                  const isRemoving = getItemLoadingState(item.id, item.color, item.size, 'remove');
                  
                  return (
                    <div 
                      key={`${item.id}-${item.color}-${item.size}`} 
                      className={`cart-item ${isUpdating || isRemoving ? 'updating' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
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
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-id">ID: {item.productId || item.id}</p>
                        <div className="item-attributes">
                          <span className="item-color">
                            <span 
                              className="color-swatch" 
                              style={{ 
                                backgroundColor: item.color?.toLowerCase().includes('black') ? '#000' : 
                                              item.color?.toLowerCase().includes('blue') ? '#1e40af' : 
                                              item.color?.toLowerCase().includes('white') ? '#e5e5e5' : '#6b7280' 
                              }}
                            ></span>
                            {item.color}
                          </span>
                          <span className="item-size">Size: {item.size}</span>
                        </div>
                        <div className="item-price">
                          {isUpdating ? (
                            <div className="price-loader-small">
                              <div className="shimmer-line-small"></div>
                            </div>
                          ) : (
                            `$${item.price}`
                          )}
                        </div>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => decrementQuantity(item.id, item.color, item.size)}
                            disabled={isUpdating || isRemoving || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            {isUpdating && item.quantity === 1 ? (
                              <div className="button-mini-loader">
                                <div className="loader-dot-small"></div>
                              </div>
                            ) : (
                              <i className="bi bi-dash"></i>
                            )}
                          </button>
                          <span className="quantity">
                            {isUpdating ? (
                              <div className="quantity-loader-small">
                                <div className="pulse-dot-small"></div>
                              </div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            className="quantity-btn"
                            onClick={() => incrementQuantity(item.id, item.color, item.size)}
                            disabled={isUpdating || isRemoving}
                            aria-label="Increase quantity"
                          >
                            {isUpdating ? (
                              <div className="button-mini-loader">
                                <div className="loader-dot-small"></div>
                              </div>
                            ) : (
                              <i className="bi bi-plus"></i>
                            )}
                          </button>
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => removeFromCart(item.id, item.color, item.size)}
                          disabled={isRemoving || isUpdating}
                          aria-label="Remove item"
                        >
                          {isRemoving ? (
                            <div className="mini-loader">
                              <div className="spinner-dot-small"></div>
                            </div>
                          ) : (
                            <i className="bi bi-trash"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
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

      {(isMobileMenuOpen || isSearchOpen || isCartOpen) && (
        <div className="overlay" onClick={closeAllMenus}></div>
      )}
    </header>
  );
};

export default Header;