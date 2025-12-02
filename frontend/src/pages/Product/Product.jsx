// frontend/src/pages/Product/Product.jsx (REMPLACER complètement)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import Header from '../../components/layout/Header/Header';
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
// Pour l'instant, on affiche juste une alerte
    alert(`Ajouté au panier: ${quantity} x ${product.name} (${selectedColor.name}, ${selectedSize})`);
    
    // Ici tu pourras ajouter l'appel à ton API panier plus tard
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
      <div className="product-page-specific">
        <Header />
        <div className="loading-container">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (error || !product) {
    return (
      <div className="product-page-specific">
        <Header />
        <div className="error-container">
          <div className="error-content">
            <i className="bi bi-exclamation-triangle error-icon"></i>
            <h3>Produit non disponible</h3>
            <p>{error || "Le produit que vous recherchez n'existe pas."}</p>
            <button className="retry-btn" onClick={reload}>
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

              {/* Image Gallery - Dynamique */}
              <div className="product-gallery-specific">
                <div className="gallery-header">
                  {totalStock <= 10 && totalStock > 0 && (
                    <div className="gallery-badge warning">STOCK LIMITÉ</div>
                  )}
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
                  {allImages.length > 0 ? (
                    <img
                      src={allImages[selectedImage]?.src}
                      alt={allImages[selectedImage]?.alt || product.name}
                      className="product-img-display"
                    />
                  ) : (
                    <div className="no-image">Pas d'image disponible</div>
                  )}
                  {isZoomed && (
                    <div className="zoom-overlay">
                      <div className="zoom-guide">Cliquez pour zoomer</div>
                    </div>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="product-thumbnails-specific">
                    <div className="product-thumbnails-scroll">
                      {allImages.map((image, index) => (
                        <div
                          key={index}
                          className={`product-thumb-item ${selectedImage === index ? 'active' : ''}`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img src={image.src} alt={`Vue ${index + 1}`} />
                          <div className="thumbnail-overlay">
                            <i className="bi bi-eye-fill"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info - Dynamique */}
              <div className="product-info-specific">
                <div className="product-details-container">
                  <div className="product-brand-specific">
                    <i className="bi bi-fire"></i>
                    DRAGON SOUL
                  </div>

                  <div className="product-title-specific">
                    <h1>{product.name}</h1>
                    <div className="title-underline">
                      <div className="underline-fire"></div>
                    </div>
                  </div>

                  <div className="product-price-container">
                    <div className="price--epic">
                      <span className="price-currency">TND</span>
                      <span className="price-item">{parseFloat(product.price).toFixed(3)}</span>
                    </div>
                    {totalStock <= 10 && (
                      <div className="price-badge">STOCK LIMITÉ</div>
                    )}
                  </div>

                  <div className="product-description-specific">
                    <p>{product.description || "Produit premium de haute qualité."}</p>
                  </div>

                  {/* Color Selection - Dynamique */}
                  {product.productcolor_set && product.productcolor_set.length > 0 && (
                    <div className="product-color-selector">
                      <div className="product-color-header">
                        <span className="product-color-label">CHOISIR LA COULEUR</span>
                      </div>
                      <div className="product-color-options">
                        {product.productcolor_set.map((color) => {
                          const isAvailable = color.productcolorsize_set?.some(
                            size => size.stock > 0
                          );
                          
                          return (
                            <div key={color.id} className="product-color-option">
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
                                className={`product-color-btn ${!isAvailable ? 'disabled' : ''}`}
                                title={`${color.color} ${!isAvailable ? '(Épuisé)' : ''}`}
                              >
                                <div 
                                  className="color-swatch"
                                  style={{ 
                                    backgroundColor: getColorHex(color.color),
                                    borderColor: selectedColor?.id === color.id ? '#ff6b35' : '#e0e0e0'
                                  }}
                                >
                                  {selectedColor?.id === color.id && (
                                    <i className="bi bi-check"></i>
                                  )}
                                </div>
                                <span className="color-name">{color.color}</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selection - Dynamique */}
                  <div className="product-size-selector">
                    <div className="product-size-header">
                      <span className="product-size-label">CHOISIR LA TAILLE</span>
                      <a href="#" className="product-size-guide">Guide des tailles</a>
                    </div>
                    <div className="product-size-options">
                      {availableSizes.map((size) => (
                        <div key={size} className="product-size-option">
                          <input
                            type="radio"
                            id={`product-size-${size}`}
                            name="product-size"
                            value={size}
                            checked={selectedSize === size}
                            onChange={() => handleSizeChange(size)}
                          />
                          <label htmlFor={`product-size-${size}`} className="product-size-btn">
                            {size}
                          </label>
                        </div>
                      ))}
                      {availableSizes.length === 0 && selectedColor && (
                        <div className="no-sizes">
                          Aucune taille disponible pour cette couleur
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Indicator */}
                  {totalStock <= 10 && totalStock > 0 && (
                    <div className="product-stock-indicator">
                      <div className="stock-label">
                        Il ne reste que {totalStock} articles en stock !
                      </div>
                      <div className="stock-bar">
                        <div 
                          className="stock-fill" 
                          style={{ width: `${(totalStock / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="product-quantity-specific">
                    <label className="product-quantity-label">QUANTITÉ</label>
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
                        max={maxQuantity}
                        onChange={(e) => handleQuantityInput(e.target.value)}
                        onFocus={(e) => e.target.select()}
                      />

                      <button
                        type="button"
                        className="product-qty-btn"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= maxQuantity}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                    <div className="quantity-hint">Maximum {maxQuantity} par client</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="product-actions-specific">
                    <button
                      className="product-add-cart dragon-btn"
                      onClick={addToCart}
                      disabled={!selectedSize || totalStock === 0}
                    >
                      <i className="bi bi-cart-plus"></i>
                      {totalStock === 0 ? 'RUPTURE DE STOCK' : 'AJOUTER AU PANIER'}
                    </button>

                    <button
                      className="product-buy-now dragon-btn"
                      onClick={buyNow}
                      disabled={!selectedSize || totalStock === 0}
                    >
                      <i className="bi bi-lightning-fill"></i>
                      ACHETER MAINTENANT
                    </button>

                    <button
                      className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={toggleWishlist}
                      title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <i className={`bi bi-${isWishlisted ? 'heart-fill' : 'heart'}`}></i>
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="product-trust-badges">
                    <div className="product-trust-item">
                      <i className="bi bi-truck"></i>
                      <span>Livraison gratuite</span>
                    </div>
                    <div className="product-trust-item">
                      <i className="bi bi-shield-check"></i>
                      <span>Garantie 2 ans</span>
                    </div>
                    <div className="product-trust-item">
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
          <section className="product-related-specific">
            <div className="product-page-width">
              <div className="product-related-header">
                <h2>VOUS AIMEREZ AUSSI</h2>
                <p>Complétez votre collection Dragon Soul</p>
              </div>

              <div className="product-related-grid">
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