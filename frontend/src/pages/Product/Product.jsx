import React, { useState } from 'react';
import './Product.css';
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import ProductCard from "../../components/common/container/ProductCard.jsx";
import BackToTopButton from "../../components/common/button/BackToTopButton.jsx";
const Product = () => {
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const product = {
    id: 1,
    title: "DRAGON FIRE HOODIE",
    brand: "DRAGON SOUL",
    price: 119.000,
    currency: "TND",
    description: "Premium hoodie with dragon design. Made from high-quality cotton for ultimate comfort and style. Perfect for everyday wear.",
    features: [
      "Premium Three-Thread Cotton",
      "Oversized Comfort Fit",
      "Padded Interior",
      "Signature Dragon Embroidery",
      "Adjustable Hood",
      "Kangaroo Pocket"
    ],
    images: [
      "/images/bestsells.jpg",
      "/images/car1.jpg",
      "/images/car2.jpg",
      "/images/car3.jpg",
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  };

  const relatedProducts = [
    {
      id: 2,
      title: "PHOENIX T-SHIRT",
      price: 79.000,
      image: "/images/car4.png",
      hoverImage: "/images/car5.jpg",
    },
    {
      id: 3,
      title: "FIRE SWEATPANTS",
      price: 99.000,
      image: "/images/car5.jpg",
      hoverImage: "/images/car6.jpg",
    },
    {
      id: 4,
      title: "DRAGON CAP",
      price: 49.000,
      image: "/images/car6.jpg",
      hoverImage: "/images/car1.jpg",
    }
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const addToCart = () => {
    alert(`Added ${quantity} ${selectedSize} ${product.title} to cart`);
  };

  const buyNow = () => {
    alert(`Buying ${quantity} ${selectedSize} ${product.title} now`);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="product-page-specific">
      <Header />

      {/* Hero Section */}
      <div className="product-hero-specific">
        <div className="hero-background">
          <div className="fire-effect"></div>
          <div className="smoke-effect"></div>
        </div>
        <div className="product-page-width">
          <h1 className="hero-title">DRAGON SOUL COLLECTION</h1>
          <p className="hero-subtitle">Limited Edition Premium Apparel</p>
        </div>
      </div>

      <div className="product-main-specific">
        {/* Main Product Section */}
        <section className="product-section-padding">
          <div className="product-page-width">
            <div className="product-layout-grid">

              {/* Image Gallery */}
              <div className="product-gallery-specific">
                <div className="gallery-header">
                  <div className="gallery-badge">LIMITED EDITION</div>
                  <button
                    className={`zoom-toggle ${isZoomed ? 'active' : ''}`}
                    onClick={toggleZoom}
                    title={isZoomed ? "Zoom Out" : "Zoom In"}
                  >
                    <i className={`bi bi-${isZoomed ? 'zoom-out' : 'zoom-in'}`}></i>
                  </button>
                </div>

                <div
                  className={`product-main-image ${isZoomed ? 'zoomed' : ''}`}
                  onClick={isZoomed ? toggleZoom : undefined}
                >
                  <img
                    src={product.images[selectedImage]}
                    alt={product.title}
                    className="product-img-display"
                  />
                  {isZoomed && (
                    <div className="zoom-overlay">
                      <div className="zoom-guide">Click to zoom out</div>
                    </div>
                  )}
                </div>

                <div className="product-thumbnails-specific">
                  <div className="product-thumbnails-scroll">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`product-thumb-item ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img src={image} alt={`View ${index + 1}`} />
                        <div className="thumbnail-overlay">
                          <i className="bi bi-eye-fill"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info-specific">
                <div className="product-details-container">
                  <div className="product-brand-specific">
                    <i className="bi bi-fire"></i>
                    {product.brand}
                  </div>

                  <div className="product-title-specific">
                    <h1>{product.title}</h1>
                    <div className="title-underline">
                      <div className="underline-fire"></div>
                    </div>
                  </div>

                  <div className="product-price-container">
                    <div className="price--epic">
                      <span className="price-currency">{product.currency}</span>
                      <span className="price-item">{product.price.toFixed(3)}</span>
                    </div>
                    <div className="price-badge">LIMITED STOCK</div>
                  </div>

                  <div className="product-description-specific">
                    <p>{product.description}</p>
                  </div>

                  {/* Features Preview */}
                  <div className="product-features-preview">
                    <h4>Premium Features:</h4>
                    <ul>
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index}>
                          <i className="bi bi-check-circle-fill"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Size Selection */}
                  <div className="product-size-selector">
                    <div className="product-size-header">
                      <span className="product-size-label">SELECT SIZE</span>
                      <a href="#" className="product-size-guide">Size Guide</a>
                    </div>
                    <div className="product-size-options">
                      {product.sizes.map((size) => (
                        <div key={size} className="product-size-option">
                          <input
                            type="radio"
                            id={`product-size-${size}`}
                            name="product-size"
                            value={size}
                            checked={selectedSize === size}
                            onChange={(e) => setSelectedSize(e.target.value)}
                          />
                          <label htmlFor={`product-size-${size}`} className="product-size-btn">
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="product-quantity-specific">
                    <label className="product-quantity-label">QUANTITY</label>
                    <div className="product-quantity-controls">
                      <button
                        type="button"
                        className="product-qty-btn"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>

                      <input
                        type="number"
                        className="product-qty-input"
                        value={quantity}
                        min="1"
                        max="10"
                        onChange={handleQuantityInput}
                        onFocus={(e) => e.target.select()}
                      />

                      <button
                        type="button"
                        className="product-qty-btn"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                    <div className="quantity-hint">Max 10 per customer</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="product-actions-specific">
                    <button
                      className="product-add-cart dragon-btn"
                      onClick={addToCart}
                    >
                      <i className="bi bi-cart-plus"></i>
                      ADD TO CART
                    </button>

                    <button
                      className="product-buy-now dragon-btn"
                      onClick={buyNow}
                    >
                      <i className="bi bi-lightning-fill"></i>
                      BUY NOW
                    </button>

                    <button
                      className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <i className={`bi bi-${isWishlisted ? 'heart-fill' : 'heart'}`}></i>
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="product-trust-badges">
                    <div className="product-trust-item">
                      <i className="bi bi-truck"></i>
                      <span>Free Shipping</span>
                    </div>
                    <div className="product-trust-item">
                      <i className="bi bi-shield-check"></i>
                      <span>2-Year Warranty</span>
                    </div>
                    <div className="product-trust-item">
                      <i className="bi bi-arrow-repeat"></i>
                      <span>30-Day Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="product-features-specific">
          <div className="product-page-width">
            <div className="product-features-header">
              <h2>PREMIUM FEATURES</h2>
              <p>What makes Dragon Soul special</p>
            </div>
            <div className="product-features-grid">
              {product.features.map((feature, index) => (
                <div key={index} className="product-feature-card">
                  <div className="product-feature-icon">
                    <i className={`bi bi-${getFeatureIcon(index)}`}></i>
                  </div>
                  <h4>{feature}</h4>
                  <p>{getFeatureDescription(index)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="product-related-specific">
          <div className="product-page-width">
            <div className="product-related-header">
              <h2>YOU MAY ALSO LIKE</h2>
              <p>Complete your Dragon Soul collection</p>
            </div>

            <div className="product-related-grid">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
};

// Helper functions
const getFeatureIcon = (index) => {
  const icons = ['gem', 'thermometer-sun', 'shield-check', 'award', 'person-check', 'bag-check'];
  return icons[index] || 'star-fill';
};

const getFeatureDescription = (index) => {
  const descriptions = [
    "Premium quality materials that last through every adventure",
    "Perfect for all weather conditions with optimal temperature control",
    "Dragon Soul quality guarantee with reinforced stitching",
    "Exclusive design featuring our signature dragon embroidery",
    "Designed for comfort with an oversized urban fit",
    "Practical kangaroo pocket for your essentials"
  ];
  return descriptions[index] || "Enhanced Dragon Soul feature";
};

export default Product;
