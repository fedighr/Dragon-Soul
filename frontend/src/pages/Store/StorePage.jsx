import React, { useState, useEffect } from "react";
import Footer from "../../components/layout/Footer/Footer.jsx";
import BackToTopButton from "../../components/common/button/BackToTopButton.jsx";
import ProductCard from "../../components/common/container/ProductCard.jsx";
import LoadingSpinner from "../../components/common/loader/LoadingSpinner.jsx";
import {getUserId} from "../../utils/getUserId"
import { useStorePage } from "../../hooks/useStorePage.js";
import SortDropdown from "../../components/common/button/SortDropdown.jsx";
import FilterDropdown from "../../components/common/button/FilterDropdown.jsx";

import "./StorePage.css";

const StorePage = () => {
  const store = useStorePage();
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localIsSorting, setLocalIsSorting] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [showFooter, setShowFooter] = useState(false);
  const [userId, setUserId] = useState(getUserId);
  const [footerAnimation, setFooterAnimation] = useState("");

  const sortOptions = [
    "Name: A to Z",
    "Name: Z to A",
    "Price: Low to High",
    "Price: High to Low",
    "Date: Oldest First",
    "Date: Newest First"
  ];

  useEffect(() => {
    const shouldShowFooter = 
      !store.loading && 
      !store.isInitialLoad &&
      !store.isFetchingMore && 
      !store.error &&
      !store.hasMore;
    
    if (shouldShowFooter && !showFooter) {
      setFooterAnimation("slide-up");
      setShowFooter(true);
      setTimeout(() => {
        setFooterAnimation("visible");
      }, 300);
    } else if (!shouldShowFooter && showFooter) {
      setFooterAnimation("slide-down");
      setTimeout(() => {
        setShowFooter(false);
        setFooterAnimation("");
      }, 300);
    }
  }, [
    store.loading, 
    store.isInitialLoad,
    store.isFetchingMore, 
    store.error,
    store.hasMore,
    showFooter
  ]);

  const countActiveFilters = () => {
    return store.localFilters.sizes.length + store.localFilters.colors.length + store.localFilters.types.length;
  };

  const handleSortSelect = async (option) => {
    if (store.selectedSort === option || localIsSorting) return;
    
    setSelectedSortOption(option);
    setLocalIsSorting(true);
    setMobileSortOpen(false);
    
    setTimeout(async () => {
      await store.handleSortSelect(option);
      setLocalIsSorting(false);
      setSelectedSortOption(null);
    }, 50);
  };

  const handleMobileFilterApply = async () => {
    if (store.isFiltering) return;
    
    setMobileFilterOpen(false);
    
    setTimeout(async () => {
      await store.applyFilters();
    }, 100);
  };

  const handleMobileFilterCancel = () => {
    store.cancelFilters();
    setMobileFilterOpen(false);
  };

  const handleClearFilters = async () => {
    if (store.isClearingFilters) return;
    
    setTimeout(async () => {
      await store.handleClearFilters();
    }, 50);
  };

  return (
    <div className="store-page">
      {store.loading && store.isInitialLoad && (
        <div className="loading-overlay">
          <LoadingSpinner 
            size="large" 
            text="Loading products..." 
          />
        </div>
      )}

      <div className={`store-control-bar ${store.tabsBarVisible ? 'visible' : 'hidden'}`}>
        <div className="control-bar-content">
          <div className="categories-section">
            <div className="category-tabs">
              {['All Products', 'New Arrival', 'Best Sells', 'Featured'].map((category) => (
                <button
                  key={category}
                  className={`category-tab ${store.selectedCategory === category ? 'active' : ''}`}
                  onClick={() => store.handleCategorySelect(category)}
                  disabled={store.isChangingCategory}
                >
                  <i className={`bi bi-${category === 'All Products' ? 'grid' : 
                                 category === 'New Arrival' ? 'star' : 
                                 category === 'Best Sells' ? 'trophy' : 'heart'}`}></i>
                  {category}
                  {store.isChangingCategory && store.selectedCategory === category && (
                    <span className="inline-loader"></span>
                  )}
                  <div className="tab-line">
                    <div className="line-fill"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="desktop-controls">
            <SortDropdown store={store} />
            <div className="control-item" ref={store.filterRef}>
              <button
                className={`control-btn filter-btn ${store.filterOpen ? "active" : ""}`}
                onClick={() => store.setFilterOpen(!store.filterOpen)}
                disabled={store.isFiltering || store.isClearingFilters}
              >
                <i className="bi bi-funnel"></i>
                Filters
                {countActiveFilters() > 0 && (
                  <span className="filter-badge">{countActiveFilters()}</span>
                )}
                {store.isFiltering && (
                  <span className="inline-loader-small"></span>
                )}
                <i className="bi bi-chevron-down dropdown-arrow"></i>
              </button>
              {store.filterOpen && <FilterDropdown store={store} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-floating-controls">
        <button 
          className="mobile-control-btn sort-btn" 
          onClick={() => setMobileSortOpen(true)}
          disabled={localIsSorting || store.isFiltering}
        >
          <i className="bi bi-sort-down"></i> Sort
          {localIsSorting && <span className="inline-loader-tiny"></span>}
        </button>
        <button 
          className="mobile-control-btn filter-btn" 
          onClick={() => setMobileFilterOpen(true)}
          disabled={store.isFiltering || store.isClearingFilters}
        >
          <i className="bi bi-funnel"></i> Filter
          {countActiveFilters() > 0 && (
            <span className="mobile-filter-badge">{countActiveFilters()}</span>
          )}
          {(store.isFiltering || store.isClearingFilters) && (
            <span className="inline-loader-tiny"></span>
          )}
        </button>
      </div>

      {mobileSortOpen && (
        <div className="mobile-modal-overlay" onClick={() => setMobileSortOpen(false)}>
          <div className="mobile-modal mobile-sort-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <h2>Sort By</h2>
              <button 
                className="mobile-modal-close" 
                onClick={() => setMobileSortOpen(false)}
                disabled={localIsSorting}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="mobile-modal-content">
              <div className="sort-options-list">
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`sort-option ${store.selectedSort === option ? "selected" : ""}`}
                    onClick={() => handleSortSelect(option)}
                    disabled={localIsSorting}
                  >
                    <span className="option-text">{option}</span>
                    <div className="option-right">
                      {store.selectedSort === option && <i className="bi bi-check"></i>}
                      {localIsSorting && selectedSortOption === option && (
                        <span className="sort-option-loader"></span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {mobileFilterOpen && (
        <div className="mobile-modal-overlay" onClick={(e) => {
          if (!store.isFiltering && !store.isClearingFilters) {
            setMobileFilterOpen(false);
          }
        }}>
          <div className="mobile-modal mobile-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <h2>Filters</h2>
              <div className="mobile-modal-header-actions">
                <button
                  className="clear-filters"
                  onClick={handleClearFilters}
                  disabled={store.isClearingFilters || (countActiveFilters() === 0 && 
                           store.localFilters.priceRange[0] === 0 && 
                           store.localFilters.priceRange[1] === 1000)}
                >
                  {store.isClearingFilters ? (
                    <span className="inline-loader-small"></span>
                  ) : (
                    'Clear All'
                  )}
                </button>
                <button 
                  className="mobile-modal-close" 
                  onClick={handleMobileFilterCancel}
                  disabled={store.isFiltering || store.isClearingFilters}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
            <div className="mobile-modal-content">
              <FilterDropdown store={store} isMobile={true} />
            </div>
            <div className="mobile-modal-actions">
              <button 
                className="cancel-btn"
                onClick={handleMobileFilterCancel}
                disabled={store.isFiltering || store.isClearingFilters}
              >
                Cancel
              </button>
              <button 
                className="apply-btn"
                onClick={handleMobileFilterApply}
                disabled={store.isFiltering || store.isClearingFilters}
              >
                {store.isFiltering ? (
                  <>
                    <span className="inline-loader-small"></span>
                    Applying...
                  </>
                ) : (
                  'Apply Filters'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="store-container">
        {!store.loading && !store.error && (
          <div className="results-count">
            {store.filteredProducts.length} Products
            {(store.appliedFilters.sizes.length > 0 || 
              store.appliedFilters.colors.length > 0 || 
              store.appliedFilters.types.length > 0 || 
              store.appliedFilters.priceRange[0] > 0 || 
              store.appliedFilters.priceRange[1] < 1000) && (
              <span className="filter-indicator">
                (Filters applied)
              </span>
            )}
            {(store.isFiltering || store.isClearingFilters) && (
              <span className="updating-indicator">
                <span className="inline-loader-tiny"></span>
                Updating...
              </span>
            )}
            {!store.hasMore && store.filteredProducts.length > 0 && (
              <span className="all-loaded-indicator">
                <i className="bi bi-check-circle"></i> All products loaded
              </span>
            )}
          </div>
        )}

        <main className="products-grid-container" ref={store.productsGridRef}>
          {store.isFiltering && !store.isInitialLoad && !store.isClearingFilters && (
            <div className="filtering-loader">
              <span className="inline-loader"></span>
              <span>Applying filters...</span>
            </div>
          )}

          {!store.loading && !store.error && store.filteredProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {store.filteredProducts.map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={{
                      id: product.id,
                      image: product.productcolor_set?.[0]?.image || '/default-product.jpg',
                      name: product.name,
                      price: `${product.price}DT`,
                      isShowMore: false,
                      isEmpty: false
                    }}
                    productcolor_set={product.productcolor_set || []}
                    onAddtoCart={()=>({
                       name: product.name, price: product.price, color : product.productcolor_set[0].color, size: product.productcolor_set[0].productcolorsize_set[0].size, image: product.productcolor_set[0].image, quantity: 1, user_id: userId, productId: product.id 
                    })}
                  />
                ))}
              </div>
              
              {store.isFetchingMore && (
                <div className="loading-more">
                  <LoadingSpinner 
                    size="small" 
                    text="Loading more products..." 
                  />
                </div>
              )}
              
              {!store.hasMore && store.filteredProducts.length > 0 && (
                <div className="end-of-products">
                  <div className="end-message">
                    <i className="bi bi-check-circle"></i>
                    <span>You've reached the end of products</span>
                  </div>
                </div>
              )}
            </>
          ) : !store.loading && !store.error && store.showNoProductsMessage ? (
            <div className="no-products-message">
              <i className="bi bi-box-seam"></i>
              <h3>We will have items soon—stay tuned!</h3>
              <p>No products available right now. Check back later for new arrivals.</p>
            </div>
          ) : !store.loading && !store.error && (
            <div className="no-products">
              <i className="bi bi-search"></i>
              <h3>No products match your filters</h3>
              <p>Try adjusting your filters or check back later for new arrivals.</p>
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
                disabled={store.isClearingFilters}
              >
                {store.isClearingFilters ? (
                  <>
                    <span className="inline-loader-small"></span>
                    Clearing...
                  </>
                ) : (
                  'Clear All Filters'
                )}
              </button>
            </div>
          )}

          {store.error && !store.loading && (
            <div className="error-state">
              <i className="bi bi-exclamation-triangle"></i>
              <h3>Something went wrong</h3>
              <p>{store.error}</p>
              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
        </main>
      </div>
 
      <BackToTopButton />
      
      {showFooter && (
        <div className={`footer-wrapper ${footerAnimation}`}>
          <Footer />
        </div>
      )}
      
      <div ref={store.footerRef} className="infinite-scroll-trigger"></div>
    </div>
  );
};

export default StorePage;