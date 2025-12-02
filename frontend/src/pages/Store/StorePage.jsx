import React from "react";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import BackToTopButton from "../../components/common/button/BackToTopButton.jsx";
import ProductCard from "../../components/common/container/ProductCard.jsx";

import { useStorePage } from "../../hooks/useStorePage.js";
import CategoryButton from "../../components/common/button/CategoryButton.jsx";
import SortDropdown from "../../components/common/button/SortDropdown.jsx";
import FilterDropdown from "../../components/common/button/FilterDropdown.jsx";

import "./StorePage.css";

const StorePage = () => {
  const store = useStorePage();

  const [mobileSortOpen, setMobileSortOpen] = React.useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const sortOptions = [
    "Name: A to Z",
    "Name: Z to A",
    "Price: Low to High",
    "Price: High to Low",
    "Date: Oldest First",
    "Date: Newest First"
  ];

  const countActiveFilters = () => {
    return store.localFilters.sizes.length + 
           store.localFilters.colors.length + 
           store.localFilters.types.length;
  };

  const handleMobileFilterCancel = () => {
    store.cancelFilters();
    setMobileFilterOpen(false);
  };

  const handleMobileFilterApply = () => {
    store.applyFilters();
    setMobileFilterOpen(false);
  };

  return (
    <div className="store-page">
      <Header/>
      <div className={`store-control-bar ${store.tabsBarVisible ? 'visible' : 'hidden'}`}>
        <div className="control-bar-content">
          <CategoryButton store={store} />
          <div className="desktop-controls">
            <SortDropdown store={store} />
            <div className="control-item" ref={store.filterRef}>
              <button
                className={`control-btn filter-btn ${store.filterOpen ? "active" : ""}`}
                onClick={() => store.setFilterOpen(!store.filterOpen)}
              >
                <i className="bi bi-funnel"></i>
                Filters
                {countActiveFilters() > 0 && (
                  <span className="filter-badge">{countActiveFilters()}</span>
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
        >
          <i className="bi bi-sort-down"></i> Sort
        </button>
        <button 
          className="mobile-control-btn filter-btn" 
          onClick={() => setMobileFilterOpen(true)}
        >
          <i className="bi bi-funnel"></i> Filter
          {countActiveFilters() > 0 && (
            <span className="mobile-filter-badge">{countActiveFilters()}</span>
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
                    onClick={() => {
                      store.handleSortSelect(option);
                      setMobileSortOpen(false);
                    }}
                  >
                    {option} {store.selectedSort === option && <i className="bi bi-check"></i>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {mobileFilterOpen && (
        <div className="mobile-modal-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="mobile-modal mobile-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <h2>Filters</h2>
              <div className="mobile-modal-header-actions">
                <button
                  className="clear-filters"
                  onClick={() => {
                    store.handleClearFilters();
                  }}
                  disabled={countActiveFilters() === 0 && 
                           store.localFilters.priceRange[0] === 0 && 
                           store.localFilters.priceRange[1] === 1000}
                >
                  Clear All
                </button>
                <button 
                  className="mobile-modal-close" 
                  onClick={handleMobileFilterCancel}
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
              >
                Cancel
              </button>
              <button 
                className="apply-btn"
                onClick={handleMobileFilterApply}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="store-container">
        {store.loading && store.isInitialLoad && (
          <div className="loading-state">
            <div className="loader-spinner"></div>
            <p>Loading products...</p>
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

        {!store.loading && !store.error && (
          <div className="results-count">
            {store.filteredProducts.length} Products
            {(store.appliedFilters.sizes.length > 0 || 
              store.appliedFilters.colors.length > 0 || 
              store.appliedFilters.types.length > 0 || 
              store.appliedFilters.priceRange[0] > 0 || 
              store.appliedFilters.priceRange[1] < 1000) && (
              <span style={{ marginLeft: '10px', fontSize: '12px', color: '#ff6b00' }}>
                (Filters applied)
              </span>
            )}
          </div>
        )}

        <main className="products-grid-container" ref={store.productsGridRef}>
          {!store.loading && !store.error && store.filteredProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {store.filteredProducts.map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={{
                      id: product.id,
                      image: product.productcolor_set[0]?.image || '/default-product.jpg',
                      name: product.name,
                      price: `${product.price}DT`,
                      isShowMore: false,
                      isEmpty: false
                    }}
                  />
                ))}
              </div>
              
              {store.isFetchingMore && (
                <div className="infinite-loading">
                  <div className="spinner"></div>
                  <p>Loading more products...</p>
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
                onClick={store.handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
 
      <BackToTopButton />
      <Footer ref={store.footerRef}/>
    </div>
  );
};

export default StorePage;