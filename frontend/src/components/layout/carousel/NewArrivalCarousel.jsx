import React, { useState, useEffect } from "react";
import "./NewArrivalCarousel.css";
import ProductCard from "../../common/container/ProductCard.jsx";

import car1 from '../../../assets/images/car1.jpg';
import car3 from '../../../assets/images/car3.jpg';
import car4 from '../../../assets/images/car4.png';

const NewArrivalCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  const itemsPerSlide = 4;

  const totalSlides = isMobile
    ? Math.ceil(products.length / itemsPerSlide)
    : Math.ceil((products.length + 1) / itemsPerSlide);

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

  const handleShowMore = () => {
    console.log("Show More clicked!");
  };

  const getProductsForSlide = (slideIndex) => {
    const start = slideIndex * itemsPerSlide;
    let end = start + itemsPerSlide;

    if (!isMobile && slideIndex === totalSlides - 1) {
      end = start + (itemsPerSlide - 1);
    }

    const slideProducts = products.slice(start, end);

    if (!isMobile && slideIndex === totalSlides - 1) {
      return [
        ...slideProducts,
        { id: 'show-more', isShowMore: true }
      ];
    }

    return slideProducts;
  };

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
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const slideProducts = getProductsForSlide(slideIndex);

              return (
                <div
                  key={slideIndex}
                  className={`new-arrival-carousel-slide ${slideIndex === activeIndex ? 'active' : ''} 
                            ${slideIndex < activeIndex ? 'prev' : ''} 
                            ${slideIndex > activeIndex ? 'next' : ''}`}
                >
                  <div className="products-grid">
                    {slideProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onShowMore={product.isShowMore ? handleShowMore : undefined}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {!isMobile && activeIndex > 0 && (
            <button className="new-arrival-carousel-control prev" onClick={prevSlide}>
              <span className="new-arrival-carousel-control-icon">‹</span>
            </button>
          )}

          {!isMobile && activeIndex < totalSlides - 1 && (
            <button className="new-arrival-carousel-control next" onClick={nextSlide}>
              <span className="new-arrival-carousel-control-icon">›</span>
            </button>
          )}
        </div>

        {isMobile && (
          <div className="mobile-show-more-container">
            <button className="mobile-show-more-btn" onClick={handleShowMore}>
              View All New Arrivals
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(NewArrivalCarousel);