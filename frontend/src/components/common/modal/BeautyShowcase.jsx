import React from 'react';
import './BeautyShowcase.css';

const HeroShowcase = () => {
  return (
    <section className="hero-showcase">
      <div className="hero-background">
        <div className="hero-image">
          <img
            src="/images/bestsells.jpg"
            alt="Beauty Behind the Madness"
            className="hero-img"
          />
          <div className="image-overlay"></div>
        </div>
      </div>

      <div className="hero-content">
        <div className="content-wrapper">
          <div className="text-content">
            <span className="hero-subtitle">EXCLUSIVE COLLECTION</span>
            <h1 className="hero-title">
              Beauty<br />
              <span className="title-accent">Behind</span><br />
              the Madness
            </h1>
            <p className="hero-description">
              The 1-D wooden version of Great Dawn, Projects, has also yet set-
              to dispose a new publication in Japan and American history.
            </p>

            <div className="hero-divider"></div>

            <div className="pricing-section">
              <div className="prices">
                <span className="original-price">$499</span>
                <span className="current-price">$299</span>
              </div>
              <span className="discount-badge">SAVE 40%</span>
            </div>

            <button className="hero-button">
              <span className="button-text">DISCOVER COLLECTION</span>
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hero-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-line"></div>
      </div>
    </section>
  );
};

export default HeroShowcase;