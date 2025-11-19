import React, { useState, useEffect } from "react";
import "./BestSellsFeaturedCarousel.css";
import ProductCard from "../../common/container/ProductCard.jsx";


import car1 from '../../../assets/images/car1.jpg';
import car3 from '../../../assets/images/car3.jpg';
import car4 from '../../../assets/images/car4.png';

const BestSellsFeaturedCarousel = () => {
  const [activeTab, setActiveTab] = useState('best-sells');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const bestSellsProducts = [
    { id: 1, name: "Best Sell Product 1", price: "$98.00", image: car1 },
    { id: 2, name: "Best Sell Product 2", price: "$89.00", image: car3 },
    { id: 3, name: "Best Sell Product 3", price: "$120.00", image: car4 },
    { id: 4, name: "Best Sell Product 4", price: "$75.00", image: car1 },
    { id: 5, name: "Best Sell Product 5", price: "$150.00", image: car3 },
    { id: 6, name: "Best Sell Product 6", price: "$99.00", image: car4 },
    { id: 7, name: "Best Sell Product 7", price: "$110.00", image: car1 },
    { id: 8, name: "Best Sell Product 8", price: "$85.00", image: car3 },
  ];

  const featuredProducts = [
    { id: 1, name: "Featured Product 1", price: "$78.00", image: car4 },
    { id: 2, name: "Featured Product 2", price: "$95.00", image: car1 },
    { id: 3, name: "Featured Product 3", price: "$130.00", image: car3 },
    { id: 4, name: "Featured Product 4", price: "$65.00", image: car4 },
    { id: 5, name: "Featured Product 5", price: "$140.00", image: car1 },
    { id: 6, name: "Featured Product 6", price: "$88.00", image: car3 },
    { id: 7, name: "Featured Product 7", price: "$120.00", image: car4 },
    { id: 8, name: "Featured Product 8", price: "$92.00", image: car1 },
  ];

  const currentProducts = activeTab === 'best-sells' ? bestSellsProducts : featuredProducts;
  const itemsPerSlide = 4;

  const totalSlides = isMobile
    ? Math.ceil(currentProducts.length / itemsPerSlide)
    : Math.ceil((currentProducts.length + 1) / itemsPerSlide);

  const handleTabChange = (tab) => {
    if (tab === activeTab || isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex(0);

    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 300);
  };

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
    console.log(`Show More clicked for ${activeTab}`);
  };

  const getProductsForSlide = (slideIndex) => {
    const start = slideIndex * itemsPerSlide;
    let end = start + itemsPerSlide;

    if (!isMobile && slideIndex === totalSlides - 1) {
      end = start + (itemsPerSlide - 1);
    }

    const slideProducts = currentProducts.slice(start, end);

    if (!isMobile && slideIndex === totalSlides - 1) {
      return [
        ...slideProducts,
        { id: 'show-more', isShowMore: true }
      ];
    }

    return slideProducts;
  };

  return (
    <div className="best-sells-featured-section">
      <div className="container">
        <div className="section-header">
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'best-sells' ? 'active' : ''}`}
                onClick={() => handleTabChange('best-sells')}
              >
                Best Sells
              </button>
              <button
                className={`tab ${activeTab === 'featured' ? 'active' : ''}`}
                onClick={() => handleTabChange('featured')}
              >
                Featured
              </button>
            </div>
            <div className="tab-underline">
              <div className={`underline-slider ${activeTab === 'best-sells' ? 'left' : 'right'}`}>
                <div className="underline-black"></div>
                <div className="underline-orange"></div>
              </div>
            </div>
          </div>
        </div>

        <div className={`best-sells-featured-carousel ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="best-sells-featured-carousel-inner">
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const slideProducts = getProductsForSlide(slideIndex);

              return (
                <div
                  key={slideIndex}
                  className={`best-sells-featured-carousel-slide ${slideIndex === activeIndex ? 'active' : ''} 
                            ${slideIndex < activeIndex ? 'prev' : ''} 
                            ${slideIndex > activeIndex ? 'next' : ''}`}
                >
                  <div className="products-grid">
                    {slideProducts.map((product) => (
                      <ProductCard
                        key={`${activeTab}-${product.id}`}
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
            <button className="best-sells-featured-carousel-control prev" onClick={prevSlide}>
              <span className="best-sells-featured-carousel-control-icon">‹</span>
            </button>
          )}

          {!isMobile && activeIndex < totalSlides - 1 && (
            <button className="best-sells-featured-carousel-control next" onClick={nextSlide}>
              <span className="best-sells-featured-carousel-control-icon">›</span>
            </button>
          )}
        </div>

        {isMobile && (
          <div className="mobile-show-more-container">
            <button className="mobile-show-more-btn" onClick={handleShowMore}>
              View All {activeTab === 'best-sells' ? 'Best Sells' : 'Featured'} Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BestSellsFeaturedCarousel);