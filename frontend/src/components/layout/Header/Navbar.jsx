import React from "react";
import "./Navbar.css";

const Navbar = ({ image }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <div className="nav-logo">
          {image ? (
            <>
              <img src={image} alt="Logo" className="logo-img" />
              <span>Dragon Soul</span>
            </>
          ) : (
            <span>
              <i >Dragon</i> <i >Soul</i>
            </span>
          )}
        </div>
        
        <div className="nav-menu">
          <a href="#" className="nav-link">HOME</a>
          <a href="#" className="nav-link">MAN</a>
          <a href="#" className="nav-link">WOMEN</a>
          <a href="#" className="nav-link">SHORTCUT</a>
          <a href="#" className="nav-link">PAGES</a>
          <a href="#" className="nav-link">BLOG</a>
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
      </div>
    </nav>
  );
}

export default Navbar;