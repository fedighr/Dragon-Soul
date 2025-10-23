import React from 'react';
import './BestSellersPromo.css';

const BestSellersPromo = () => {
  return (
    <section className="best-sellers-promo">
      <div className="promo-container">
        <div className="promo-content">
          <div className="promo-header">
            <span className="promo-badge">CUSTOMER FAVORITES</span>
            <h2 className="promo-title">
              Discover Our <span className="highlight">Best Sellers</span>
            </h2>
            <p className="promo-description">
              Join thousands of satisfied customers who have made these pieces their favorites.
              From timeless classics to trending must-haves, our best sellers collection
              represents the most loved items in our store.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">#1</div>
              <div className="stat-label">Top Rated</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>

          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">⭐</span>
              <span className="feature-text">Highest Rated Products</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔥</span>
              <span className="feature-text">Most Purchased Items</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💫</span>
              <span className="feature-text">Trending This Season</span>
            </div>
          </div>

          <div className="promo-actions">
            <button className="promo-btn primary-btn">
              EXPLORE BEST SELLERS
            </button>
            <button className="promo-btn secondary-btn">
              VIEW COLLECTIONS
            </button>
          </div>
        </div>

        <div className="promo-visual">
          <div className="floating-cards">
            <div className="card card-1">
              <div className="card-content">
                <span className="card-badge">MOST POPULAR</span>
                <div className="card-image"></div>
              </div>
            </div>
            <div className="card card-2">
              <div className="card-content">
                <span className="card-badge">TRENDING</span>
                <div className="card-image"></div>
              </div>
            </div>
            <div className="card card-3">
              <div className="card-content">
                <span className="card-badge">TOP RATED</span>
                <div className="card-image"></div>
              </div>
            </div>
          </div>
          <div className="glow-effect"></div>
        </div>
      </div>
    </section>
  );
};

export default BestSellersPromo;