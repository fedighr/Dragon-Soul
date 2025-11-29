
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

  return (
    <div className="store-page">
      <Header />

      <div className={`store-control-bar ${store.tabsBarVisible ? 'visible' : 'hidden'}`}>
        <div className="control-bar-content">
          <CategoryButton store={store} />
          <div className="desktop-controls">
            <SortDropdown store={store} />
            <FilterDropdown store={store} />
          </div>
        </div>
      </div>

      <div className="mobile-floating-controls">
        <button className="mobile-control-btn sort-btn" onClick={() => setMobileSortOpen(true)}>
          <i className="bi bi-sort-down"></i> Sort
        </button>
        <button className="mobile-control-btn filter-btn" onClick={() => setMobileFilterOpen(true)}>
          <i className="bi bi-funnel"></i> Filter
          {store.activeFilters.sizes.length + store.activeFilters.colors.length > 0 && (
            <span className="mobile-filter-badge">
              {store.activeFilters.sizes.length + store.activeFilters.colors.length}
            </span>
          )}
        </button>
      </div>

      {mobileSortOpen && (
        <div className="mobile-modal-overlay">
          <div className="mobile-modal mobile-sort-modal">
            <div className="mobile-modal-header">
              <h2>Sort By</h2>
              <button className="mobile-modal-close" onClick={() => setMobileSortOpen(false)}>
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
        <div className="mobile-modal-overlay">
          <div className="mobile-modal mobile-filter-modal">
            <div className="mobile-modal-header">
              <h2>Filters</h2>
              <div className="mobile-modal-header-actions">
                <button
                  className="clear-filters"
                  onClick={store.handleClearFilters}
                  disabled={store.activeFilters.sizes.length + store.activeFilters.colors.length === 0 && store.activeFilters.priceRange[0] === 0 && store.activeFilters.priceRange[1] === 1000}
                >
                  Clear All
                </button>
                <button className="mobile-modal-close" onClick={() => setMobileFilterOpen(false)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
            <div className="mobile-modal-content">
              <FilterDropdown store={store} />
            </div>
          </div>
        </div>
      )}

      <div className="store-container">
        {store.loading && (
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
          <div className="results-count">{store.filteredProducts.length} Products</div>
        )}

        <main className="products-grid-container">
          {!store.loading && !store.error && store.filteredProducts.length > 0 ? (
            <div className="products-grid">
              {store.filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    image: product.productcolor_set[0].image,
                    name: product.name,
                    price: `dt${product.price}`,
                    isShowMore: false,
                    isEmpty: false
                  }}
                />
              ))}
            </div>
          ) : !store.loading && !store.error && (
            <div className="no-products">
              <i className="bi bi-cloud-arrow-down"></i>
              <h3>No products available right now</h3>
              <p>Check back later for new arrivals.</p>
            </div>
          )}
        </main>
      </div>

      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default StorePage;