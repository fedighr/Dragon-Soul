import React, { useState } from "react";
import "./Navbar.css";

const Navbar = ({ image }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Mobile Menu Button */}
        <button
          className="nav-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-logo">
          {image ? (
            <>
              <img src={image} alt="Logo" className="logo-img" />
              <span>Dragon Soul</span>
            </>
          ) : (
            <span>
              <i>Dragon</i> <i>Soul</i>
            </span>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <a href="#" className="nav-link">HOME</a>
          <a href="#" className="nav-link">MEN</a>
          <a href="#" className="nav-link">WOMEN</a>
          <a href="#" className="nav-link">STORE</a>
          <a href="#" className="nav-link">ABOUT</a>
        </div>

        <div className="nav-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search anything"
              className="search-input"
            />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>

        {/* Mobile Search Button */}
        <button className="mobile-search-btn" onClick={toggleSearch}>
          <i className="bi bi-search"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>HOME</a>
        <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>MEN</a>
        <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>WOMEN</a>
        <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>STORE</a>
        <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>ABOUT</a>
      </div>

      {/* Mobile Search Bar */}
      <div className={`mobile-search-container ${isSearchOpen ? 'active' : ''}`}>
        <div className="mobile-search-input-container">
          <input
            type="text"
            placeholder="Search anything..."
            className="mobile-search-input"
          />
          <button className="mobile-search-close" onClick={toggleSearch}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;