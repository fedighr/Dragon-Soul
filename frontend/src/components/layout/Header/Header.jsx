import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLogout } from "../../../hooks/useLogout.js";
import { isLoggedIn } from "../../../utils/auth.jsx";
import { useCart } from "../Context/CartContext";
import "./Header.css";

const Header = ({ image }) => {
  const logout = useLogout();
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isDisabledPage = location.pathname === '/cart';
  
  const {
    isCartOpen,
    getTotalItems,
    openCart,
    closeCart,
    cartItems,
    isAdmin,
    loading
  } = useCart();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
  }, []);

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
  }, [logout]);

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

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, []);

  const closeAllMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, []);

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
                      {isAdmin &&(
                      <Link to="/dashboard" className="dropdown-item" onClick={closeAllMenus}>
                        <i class="bi bi-speedometer2"></i>Dashboard
                      </Link>
                      )}
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
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
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
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
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
                  {isAdmin &&(
                  <Link to="/dashboard" className="quick-action-btn" onClick={closeAllMenus}>
                        <i className="bi bi-speedometer2"></i>Dashboard
                      </Link>
                  )}
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
              <span>Cart {getTotalItems() > 0 && `(${getTotalItems()})`}</span>
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

      {(isMobileMenuOpen || isSearchOpen) && (
        <div className="overlay" onClick={closeAllMenus}></div>
      )}
    </header>
  );
};

export default Header;