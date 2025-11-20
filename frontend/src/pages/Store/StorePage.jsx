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

      {/* Mobile Floating Controls */}
      <div className="mobile-floating-controls">
        <button className="mobile-control-btn sort-btn" onClick={() => store.setSortOpen(true)}>
          <i className="bi bi-sort-down"></i> Sort
        </button>
        <button className="mobile-control-btn filter-btn" onClick={() => store.setFilterOpen(true)}>
          <i className="bi bi-funnel"></i> Filter
          {store.activeFilters.sizes.length + store.activeFilters.colors.length > 0 && (
            <span className="mobile-filter-badge">
              {store.activeFilters.sizes.length + store.activeFilters.colors.length}
            </span>
          )}
        </button>
      </div>

      <div className="store-container">
        <div className="results-count">{store.filteredProducts.length} Products</div>
        <main className="products-grid-container">
          {store.filteredProducts.length > 0 ? (
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
          ) : (
            <div className="no-products">
              <i className="bi bi-cloud-arrow-down"></i>
              <h3>Products Coming Soon</h3>
              <p>Products will be loaded from the backend API.</p>
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