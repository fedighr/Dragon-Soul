import React from 'react';
import './ProductShowcase.css';
import LazyImage from '../../ui/LazyImage';

const ProductShowcase = () => {
  return (
    <section className="product-showcase">
      <div className="showcase-container">
        <div className="showcase-image">
          <LazyImage
            src="/images/homeimage1.jpg"
            alt="Beauty Behind the Madness"
            className="showcase-img"
          />
        </div>

        <div className="showcase-content">
          <span className="showcase-subtitle">EXCLUSIVE COLLECTION</span>
          <h2 className="showcase-title">Beauty Behind the Madness</h2>
          <p className="showcase-description">
            The 1st Photodiopsychiatrist of Drexel Brain, Photographs and a series of
            story-almost generalisements. Dexmouth, Mountain Street.
          </p>

          <div className="showcase-pricing">
            <span className="original-price">$499</span>
            <span className="discounted-price">$299</span>
            <span className="discount-badge">40% OFF</span>
          </div>

          <div className="showcase-actions">
            <button className="showcase-btn primary-btn">
              SEE COLLECTION
            </button>
            <button className="showcase-btn secondary-btn">
              VIEW DETAILS
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductShowcase);