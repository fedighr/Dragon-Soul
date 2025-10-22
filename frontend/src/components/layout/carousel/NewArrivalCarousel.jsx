import React, { useState } from "react";
import "./NewArrivalCarousel.css";
import car1 from '../../../assets/images/car1.jpg';
import car3 from '../../../assets/images/car3.jpg';
import car4 from '../../../assets/images/car4.png';

const NewArrivalCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const products = [
    { id: 1, name: "Cashmere Tank + Bag", price: "$98.00", image: car1 },
    { id: 2, name: "Cashmere Tank + Bag", price: "$98.00", image: car3 },
    { id: 3, name: "Cashmere Tank + Bag", price: "$98.00", image: car4 },
    { id: 4, name: "Cashmere Tank + Bag", price: "$98.00", image: car1 },
    { id: 5, name: "Cashmere Tank + Bag", price: "$98.00", image: car3 },
    { id: 6, name: "Cashmere Tank + Bag", price: "$98.00", image: car4 },
    { id: 7, name: "Cashmere Tank + Bag", price: "$98.00", image: car1 },
    { id: 8, name: "Cashmere Tank + Bag", price: "$98.00", image: car3 },
  ];

  const itemsPerSlide = 4; // Back to 4 items per slide
  const totalSlides = Math.ceil((products.length + 1) / itemsPerSlide); // +1 for Show More card

  const nextSlide = () => {
    if (activeIndex < totalSlides - 1) {
      setActiveIndex(prevIndex => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(prevIndex => prevIndex - 1);
    }
  };

  const getProductsForSlide = (slideIndex) => {
    const start = slideIndex * itemsPerSlide;
    const end = start + itemsPerSlide;

    const slideProducts = products.slice(start, end);

    if (slideIndex === totalSlides - 1 && slideProducts.length < itemsPerSlide) {
      return [
        ...slideProducts,
        { id: 'show-more', isShowMore: true }
      ];
    }

    if (slideIndex === totalSlides - 1 && slideProducts.length === itemsPerSlide) {
      return slideProducts;
    }

    return slideProducts;
  };

  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  const needsShowMoreSlide = products.length % itemsPerSlide === 0;
  const actualTotalSlides = needsShowMoreSlide ? totalSlides + 1 : totalSlides;

  return (
    <div className="new-arrival-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">New Arrival</h2>
          <div className="title-underline">
            <div className="underline-black"></div>
            <div className="underline-orange"></div>
          </div>
        </div>

        <div className="new-arrival-carousel">
          <div className="new-arrival-carousel-inner">
            {Array.from({ length: actualTotalSlides }).map((_, slideIndex) => {
              if (needsShowMoreSlide && slideIndex === actualTotalSlides - 1) {
                return (
                  <div
                    key="show-more-slide"
                    className={`new-arrival-carousel-slide ${slideIndex === activeIndex ? 'active' : ''}`}
                  >
                    <div className="products-grid">
                      {Array.from({ length: itemsPerSlide }).map((_, index) => (
                        index === 0 ? (
                          <div key="show-more" className="product-card show-more-card">
                            <div className="show-more-content">
                              <div className="show-more-icon">+</div>
                              <button className="show-more-btn">Show More</button>
                            </div>
                          </div>
                        ) : (
                          <div key={`empty-${index}`} className="product-card empty-card"></div>
                        )
                      ))}
                    </div>
                  </div>
                );
              }

              const slideProducts = getProductsForSlide(slideIndex);

              return (
                <div
                  key={slideIndex}
                  className={`new-arrival-carousel-slide ${slideIndex === activeIndex ? 'active' : ''} 
                             ${slideIndex < activeIndex ? 'prev' : ''} 
                             ${slideIndex > activeIndex ? 'next' : ''}`}
                >
                  <div className="products-grid">
                    {slideProducts.map((item) => (
                      item.isShowMore ? (
                        <div key="show-more" className="product-card show-more-card">
                          <div className="show-more-content">
                            <div className="show-more-icon">+</div>
                            <button className="show-more-btn">Show More</button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={item.id}
                          className="product-card"
                          onMouseEnter={() => handleMouseEnter(item.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="product-image">
                            <img src={item.image} alt={item.name} />
                            {/* NEW Badge */}
                            <span className="new-badge">NEW</span>

                            {/* Hover Actions */}
                            <div className={`product-actions ${hoveredProduct === item.id ? 'active' : ''}`}>
                              <button className="action-btn add-to-cart">
                                <i className="bi bi-cart-plus"></i>
                                Add To Cart
                              </button>
                              <div className="action-buttons">
                                <button className="action-btn wishlist" title="Add to wishlist">
                                  <i className="bi bi-heart"></i>
                                </button>
                                <button className="action-btn view" title="View Product">
                                  <i className="bi bi-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="product-info">
                            <h3 className="product-name">{item.name}</h3>
                            <div className="product-price">{item.price}</div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {activeIndex > 0 && (
            <button className="new-arrival-carousel-control prev" onClick={prevSlide}>
              <span className="new-arrival-carousel-control-icon">‹</span>
            </button>
          )}

          {activeIndex < actualTotalSlides - 1 && (
            <button className="new-arrival-carousel-control next" onClick={nextSlide}>
              <span className="new-arrival-carousel-control-icon">›</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalCarousel;