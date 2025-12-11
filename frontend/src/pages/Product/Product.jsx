// frontend/src/pages/Product/Product.jsx (REMPLACER complètement)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import Footer from '../../components/layout/Footer/Footer';
import ProductCard from '../../components/common/container/ProductCard';
import BackToTopButton from '../../components/common/button/BackToTopButton';
import LoadingSpinner from '../../components/common/loader/LoadingSpinner';
import './Product.css';

const Product = () => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const {
    product,
    relatedProducts,
    loading,
    error,
    selectedColor,
    selectedSize,
    quantity,
    selectedImage,
    availableSizes,
    setSelectedImage,
    handleColorChange,
    handleSizeChange,
    handleQuantityChange,
    handleQuantityInput,
    reload,
    maxQuantity,
    totalStock,
    allImages
  } = useProduct();
  
  // Fonctions d'action
  const addToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une couleur et une taille');
      return;
    }
    alert(`Ajouté au panier: ${quantity} x ${product.name} (${selectedColor.name}, ${selectedSize})`);
  };
  
  const buyNow = () => {
    addToCart();
    navigate('/checkout');
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    alert(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="dsp-product-page">
        <div className="dsp-loading-container">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (error || !product) {
    return (
      <div className="dsp-product-page">
        <div className="dsp-error-container">
          <div className="dsp-error-content">
            <i className="bi bi-exclamation-triangle dsp-error-icon"></i>
            <h3>Produit non disponible</h3>
            <p>{error || "Le produit que vous recherchez n'existe pas."}</p>
            <button className="dsp-retry-btn" onClick={reload}>
              <i className="bi bi-arrow-clockwise"></i>
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="dsp-product-page">  

      {/* Hero Section */}
      <div className="dsp-product-hero">
        <div className="dsp-hero-background">
          <div className="dsp-fire-effect"></div>
          <div className="dsp-smoke-effect"></div>
        </div>
        <div className="dsp-page-width">
          <h1 className="dsp-hero-title">DRAGON SOUL COLLECTION</h1>
          <p className="dsp-hero-subtitle">Limited Edition Premium Apparel</p>
        </div>
      </div>

      <div className="dsp-product-main">
        {/* Main Product Section */}
        <section className="dsp-section-padding">
          <div className="dsp-page-width">
            <div className="dsp-layout-grid">

              {/* Image Gallery - Dynamique */}
              <div className="dsp-product-gallery">
                <div className="dsp-gallery-header">
                  {totalStock <= 10 && totalStock > 0 && (
                    <div className="dsp-gallery-badge dsp-warning">STOCK LIMITÉ</div>
                  )}
                  <button
                    className={`dsp-zoom-toggle ${isZoomed ? 'dsp-active' : ''}`}
                    onClick={toggleZoom}
                    title={isZoomed ? "Zoom Out" : "Zoom In"}
                  >
                    <i className={`bi bi-${isZoomed ? 'zoom-out' : 'zoom-in'}`}></i>
                  </button>
                </div>

                <div
                  className={`dsp-main-image ${isZoomed ? 'dsp-zoomed' : ''}`}
                  onClick={isZoomed ? toggleZoom : undefined}
                >
                  {allImages.length > 0 ? (
                    <img
                      src={allImages[selectedImage]?.src}
                      alt={allImages[selectedImage]?.alt || product.name}
                      className="dsp-img-display"
                    />
                  ) : (
                    <div className="dsp-no-image">Pas d'image disponible</div>
                  )}
                  {isZoomed && (
                    <div className="dsp-zoom-overlay">
                      <div className="dsp-zoom-guide">Cliquez pour zoomer</div>
                    </div>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="dsp-thumbnails-container">
                    <div className="dsp-thumbnails-scroll">
                      {allImages.map((image, index) => (
                        <div
                          key={index}
                          className={`dsp-thumb-item ${selectedImage === index ? 'dsp-active' : ''}`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img src={image.src} alt={`Vue ${index + 1}`} />
                          <div className="dsp-thumbnail-overlay">
                            <i className="bi bi-eye-fill"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info - Dynamique */}
              <div className="dsp-product-info">
                <div className="dsp-details-container">
                  <div className="dsp-product-brand">
                    <i className="bi bi-fire"></i>
                    DRAGON SOUL
                  </div>

                  <div className="dsp-product-title">
                    <h1>{product.name}</h1>
                    <div className="dsp-title-underline">
                      <div className="dsp-underline-fire"></div>
                    </div>
                  </div>

                  <div className="dsp-price-container">
                    <div className="dsp-price--epic">
                      <span className="dsp-price-currency">TND</span>
                      <span className="dsp-price-item">{parseFloat(product.price).toFixed(3)}</span>
                    </div>
                    {totalStock <= 10 && (
                      <div className="dsp-price-badge">STOCK LIMITÉ</div>
                    )}
                  </div>

                  <div className="dsp-product-description">
                    <p>{product.description || "Produit premium de haute qualité."}</p>
                  </div>

                  {/* Color Selection - Dynamique */}
                  {product.productcolor_set && product.productcolor_set.length > 0 && (
                    <div className="dsp-color-selector">
                      <div className="dsp-color-header">
                        <span className="dsp-color-label">CHOISIR LA COULEUR</span>
                      </div>
                      <div className="dsp-color-options">
                        {product.productcolor_set.map((color) => {
                          const isAvailable = color.productcolorsize_set?.some(
                            size => size.stock > 0
                          );
                          
                          return (
                            <div key={color.id} className="dsp-color-option">
                              <input
                                type="radio"
                                id={`color-${color.id}`}
                                name="product-color"
                                value={color.id}
                                checked={selectedColor?.id === color.id}
                                onChange={() => handleColorChange({
                                  id: color.id,
                                  name: color.color,
                                  image: color.image
                                })}
                                disabled={!isAvailable}
                              />
                              <label 
                                htmlFor={`color-${color.id}`} 
                                className={`dsp-color-btn ${!isAvailable ? 'dsp-disabled' : ''}`}
                                title={`${color.color} ${!isAvailable ? '(Épuisé)' : ''}`}
                              >
                                <div 
                                  className="dsp-color-swatch"
                                  style={{ 
                                    backgroundColor: getColorHex(color.color),
                                    borderColor: selectedColor?.id === color.id ? '#ff6b35' : '#e0e0e0'
                                  }}
                                >
                                  {selectedColor?.id === color.id && (
                                    <i className="bi bi-check"></i>
                                  )}
                                </div>
                                <span className="dsp-color-name">{color.color}</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selection - Dynamique */}
                  <div className="dsp-size-selector">
                    <div className="dsp-size-header">
                      <span className="dsp-size-label">CHOISIR LA TAILLE</span>
                      <a href="#" className="dsp-size-guide">Guide des tailles</a>
                    </div>
                    <div className="dsp-size-options">
                      {availableSizes.map((size) => (
                        <div key={size} className="dsp-size-option">
                          <input
                            type="radio"
                            id={`product-size-${size}`}
                            name="product-size"
                            value={size}
                            checked={selectedSize === size}
                            onChange={() => handleSizeChange(size)}
                          />
                          <label htmlFor={`product-size-${size}`} className="dsp-size-btn">
                            {size}
                          </label>
                        </div>
                      ))}
                      {availableSizes.length === 0 && selectedColor && (
                        <div className="dsp-no-sizes">
                          Aucune taille disponible pour cette couleur
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Indicator */}
                  {totalStock <= 10 && totalStock > 0 && (
                    <div className="dsp-stock-indicator">
                      <div className="dsp-stock-label">
                        Il ne reste que {totalStock} articles en stock !
                      </div>
                      <div className="dsp-stock-bar">
                        <div 
                          className="dsp-stock-fill" 
                          style={{ width: `${(totalStock / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="dsp-quantity-selector">
                    <label className="dsp-quantity-label">QUANTITÉ</label>
                    <div className="dsp-quantity-controls">
                      <button
                        type="button"
                        className="dsp-qty-btn"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>

                      <input
                        type="number"
                        className="dsp-qty-input"
                        value={quantity}
                        min="1"
                        max={maxQuantity}
                        onChange={(e) => handleQuantityInput(e.target.value)}
                        onFocus={(e) => e.target.select()}
                      />

                      <button
                        type="button"
                        className="dsp-qty-btn"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= maxQuantity}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                    <div className="dsp-quantity-hint">Maximum {maxQuantity} par client</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="dsp-action-buttons">
                    <button
                      className="dsp-add-cart dsp-dragon-btn"
                      onClick={addToCart}
                      disabled={!selectedSize || totalStock === 0}
                    >
                      <i className="bi bi-cart-plus"></i>
                      {totalStock === 0 ? 'RUPTURE DE STOCK' : 'AJOUTER AU PANIER'}
                    </button>

                    <button
                      className="dsp-buy-now dsp-dragon-btn"
                      onClick={buyNow}
                      disabled={!selectedSize || totalStock === 0}
                    >
                      <i className="bi bi-lightning-fill"></i>
                      ACHETER MAINTENANT
                    </button>

                    <button
                      className={`dsp-wishlist-btn ${isWishlisted ? 'dsp-active' : ''}`}
                      onClick={toggleWishlist}
                      title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <i className={`bi bi-${isWishlisted ? 'heart-fill' : 'heart'}`}></i>
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="dsp-trust-badges">
                    <div className="dsp-trust-item">
                      <i className="bi bi-truck"></i>
                      <span>Livraison gratuite</span>
                    </div>
                    <div className="dsp-trust-item">
                      <i className="bi bi-shield-check"></i>
                      <span>Garantie 2 ans</span>
                    </div>
                    <div className="dsp-trust-item">
                      <i className="bi bi-arrow-repeat"></i>
                      <span>Retours 30 jours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products - Dynamique */}
        {relatedProducts.length > 0 && (
          <section className="dsp-related-products">
            <div className="dsp-page-width">
              <div className="dsp-related-header">
                <h2>VOUS AIMEREZ AUSSI</h2>
                <p>Complétez votre collection Dragon Soul</p>
              </div>

              <div className="dsp-related-grid">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
};

// Helper function for color hex codes
const getColorHex = (colorName) => {
  const colorMap = {
    'Red': '#ff4444',
    'Blue': '#4444ff', 
    'White': '#ffffff',
    'Black': '#000000',
    'white': '#ffffff',
    'black': '#000000'
  };
  return colorMap[colorName] || '#cccccc';
};

export default Product;