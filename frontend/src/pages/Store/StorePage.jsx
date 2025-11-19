import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import BackToTopButton from "../../components/common/button/BackToTopButton.jsx";
import "./StorePage.css";

const StorePage = () => {
  // Empty products array - will be populated from backend
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedSort, setSelectedSort] = useState("Name: A to Z");
  const [tabsBarVisible, setTabsBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Filter states - these will be sent to backend
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000],
    sizes: [],
    colors: []
  });

  // Refs for dropdown closing
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // Sort options
  const sortOptions = [
    "Name: A to Z",
    "Name: Z to A",
    "Price: Low to High",
    "Price: High to Low",
    "Date: Oldest First",
    "Date: Newest First",
  ];

  // Categories with icons
  const categories = [
    { name: "All Products", icon: "bi-grid" },
    { name: "New Arrival", icon: "bi-star" },
    { name: "Best Sells", icon: "bi-trophy" },
    { name: "Featured", icon: "bi-heart" }
  ];

  // Available sizes and colors
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Red", value: "#ff0000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Green", value: "#00ff00" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Pink", value: "#ffc0cb" },
    { name: "Purple", value: "#800080" },
    { name: "Gray", value: "#808080" },
    { name: "Brown", value: "#8B4513" },
    { name: "Orange", value: "#ffa500" },
    { name: "Teal", value: "#008080" }
  ];

  // Fixed scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setTabsBarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setTabsBarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close other panel when one opens
  useEffect(() => {
    if (sortOpen) {
      setFilterOpen(false);
    }
  }, [sortOpen]);

  useEffect(() => {
    if (filterOpen) {
      setSortOpen(false);
    }
  }, [filterOpen]);


  // Backend API call - EMPTY FOR NOW, WILL BE POPULATED FROM BACKEND
  const fetchProductsFromBackend = async (filters, sort, category) => {
    console.log("Sending to backend:", {
      filters,
      sort,
      category
    });

    // This will be replaced with actual backend API call
    // For now, return empty array since products will come from backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 300);
    });
  };

  // Fetch products when filters/sort/category change
  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProductsFromBackend(
        activeFilters,
        selectedSort,
        selectedCategory
      );
      setFilteredProducts(products);
    };

    loadProducts();
  }, [activeFilters, selectedSort, selectedCategory]);

  // Sort handler - immediate application
  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortOpen(false);
  };

  // Filter handlers - these values will be sent to backend
  const handleSizeToggle = (size) => {
    setActiveFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (colorValue) => {
    setActiveFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(colorValue)
        ? prev.colors.filter(c => c !== colorValue)
        : [...prev.colors, colorValue]
    }));
  };

  const handlePriceChange = (min, max) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      priceRange: [0, 1000],
      sizes: [],
      colors: []
    });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Count active filters for badge
  const activeFilterCount = activeFilters.sizes.length + activeFilters.colors.length;

  return (
    <div className="store-page">
      <Header />

      {/* Control Bar */}
      <div className={`store-control-bar ${tabsBarVisible ? 'visible' : 'hidden'}`}>
        <div className="control-bar-content">
          {/* Categories with animated underline */}
          <div className="categories-section">
            <div className="category-tabs">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-tab ${
                    selectedCategory === category.name ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <i className={`bi ${category.icon}`}></i>
                  {category.name}
                  <div className="tab-line">
                    <div className="line-fill"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Filter Buttons */}
          <div className="controls-section">
            {/* Sort Button */}
            <div className="control-item" ref={sortRef}>
              <button
                className={`control-btn sort-btn ${sortOpen ? "active" : ""}`}
                onClick={() => setSortOpen(!sortOpen)}
              >
                <i className="bi bi-sort-down"></i>
                Sort By
                <i className="bi bi-chevron-down dropdown-arrow"></i>
              </button>

              {sortOpen && (
                <div className="control-dropdown sort-dropdown">
                  {sortOptions.map((option, index) => (
                    <button
                      key={index}
                      className={`dropdown-option ${selectedSort === option ? "selected" : ""}`}
                      onClick={() => handleSortSelect(option)}
                    >
                      {option}
                      {selectedSort === option && <i className="bi bi-check"></i>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Button */}
            <div className="control-item" ref={filterRef}>
              <button
                className={`control-btn filter-btn ${filterOpen ? "active" : ""}`}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <i className="bi bi-funnel"></i>
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
                <i className="bi bi-chevron-down dropdown-arrow"></i>
              </button>

              {filterOpen && (
                <div className="control-dropdown filter-dropdown">
                  <div className="dropdown-header">
                    <h3>Filters</h3>
                    <button
                      className="clear-filters"
                      onClick={handleClearFilters}
                      disabled={activeFilterCount === 0}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="dropdown-content">
                    {/* Price Range Filter */}
                    <div className="filter-section">
                      <h4>Price Range</h4>
                      <div className="price-range-container">
                        <div className="price-display">
                          <div className="price-input-group">
                            <span className="price-prefix">$</span>
                            <input
                              type="number"
                              className="price-input"
                              value={activeFilters.priceRange[0]}
                              onChange={(e) => handlePriceChange(Number(e.target.value), activeFilters.priceRange[1])}
                              min="0"
                              max="1000"
                            />
                          </div>
                          <span className="price-separator">-</span>
                          <div className="price-input-group">
                            <span className="price-prefix">$</span>
                            <input
                              type="number"
                              className="price-input"
                              value={activeFilters.priceRange[1]}
                              onChange={(e) => handlePriceChange(activeFilters.priceRange[0], Number(e.target.value))}
                              min="0"
                              max="1000"
                            />
                          </div>
                        </div>

                        <div className="range-sliders">
                          <div className="range-track"></div>
                          <div
                            className="range-progress"
                            style={{
                              left: `${(activeFilters.priceRange[0] / 1000) * 100}%`,
                              width: `${((activeFilters.priceRange[1] - activeFilters.priceRange[0]) / 1000) * 100}%`
                            }}
                          ></div>
                          <input
                            type="range"
                            className="range-slider"
                            min="0"
                            max="1000"
                            value={activeFilters.priceRange[0]}
                            onChange={(e) => handlePriceChange(Number(e.target.value), activeFilters.priceRange[1])}
                          />
                          <input
                            type="range"
                            className="range-slider"
                            min="0"
                            max="1000"
                            value={activeFilters.priceRange[1]}
                            onChange={(e) => handlePriceChange(activeFilters.priceRange[0], Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Size Filter */}
                    <div className="filter-section">
                      <h4>Size</h4>
                      <div className="size-filters">
                        {availableSizes.map((size, index) => (
                          <button
                            key={index}
                            className={`size-option ${
                              activeFilters.sizes.includes(size) ? "selected" : ""
                            }`}
                            onClick={() => handleSizeToggle(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Filter */}
                    <div className="filter-section">
                      <h4>Color</h4>
                      <div className="color-filters">
                        {availableColors.map((color, index) => (
                          <button
                            key={index}
                            className={`color-option ${
                              activeFilters.colors.includes(color.value) ? "selected" : ""
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleColorToggle(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-actions">
                    <button
                      className="cancel-btn"
                      onClick={() => setFilterOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="apply-btn"
                      onClick={() => setFilterOpen(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Controls */}
      <div className="mobile-floating-controls">
        <button
          className="mobile-control-btn sort-btn"
          onClick={() => setSortOpen(true)}
        >
          <i className="bi bi-sort-down"></i>
          Sort
        </button>
        <button
          className="mobile-control-btn filter-btn"
          onClick={() => setFilterOpen(true)}
        >
          <i className="bi bi-funnel"></i>
          Filter
          {activeFilterCount > 0 && (
            <span className="mobile-filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Mobile Sort Modal - No Apply Button */}
      {sortOpen && (
        <div className="mobile-modal-overlay" onClick={() => setSortOpen(false)}>
          <div className="mobile-modal mobile-sort-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <h2>Sort By</h2>
              <button className="mobile-modal-close" onClick={() => setSortOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="mobile-modal-content">
              <div className="sort-options-list">
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`sort-option ${selectedSort === option ? "selected" : ""}`}
                    onClick={() => handleSortSelect(option)}
                  >
                    {option}
                    {selectedSort === option && <i className="bi bi-check"></i>}
                  </button>
                ))}
              </div>
            </div>
            {/* No actions for sort modal - selection is immediate */}
          </div>
        </div>
      )}

      {/* Mobile Filter Modal */}
      {filterOpen && (
        <div className="mobile-modal-overlay" onClick={() => setFilterOpen(false)}>
          <div className="mobile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <h2>Filters</h2>
              <div className="mobile-modal-header-actions">
                <button
                  className="clear-filters"
                  onClick={handleClearFilters}
                  disabled={activeFilterCount === 0}
                >
                  Clear All
                </button>
                <button className="mobile-modal-close" onClick={() => setFilterOpen(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
            <div className="mobile-modal-content">
              {/* Price Range Filter */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range-container">
                  <div className="price-display">
                    <div className="price-input-group">
                      <span className="price-prefix">$</span>
                      <input
                        type="number"
                        className="price-input"
                        value={activeFilters.priceRange[0]}
                        onChange={(e) => handlePriceChange(Number(e.target.value), activeFilters.priceRange[1])}
                        min="0"
                        max="1000"
                      />
                    </div>
                    <span className="price-separator">-</span>
                    <div className="price-input-group">
                      <span className="price-prefix">$</span>
                      <input
                        type="number"
                        className="price-input"
                        value={activeFilters.priceRange[1]}
                        onChange={(e) => handlePriceChange(activeFilters.priceRange[0], Number(e.target.value))}
                        min="0"
                        max="1000"
                      />
                    </div>
                  </div>

                  <div className="range-sliders">
                    <div className="range-track"></div>
                    <div
                      className="range-progress"
                      style={{
                        left: `${(activeFilters.priceRange[0] / 1000) * 100}%`,
                        width: `${((activeFilters.priceRange[1] - activeFilters.priceRange[0]) / 1000) * 100}%`
                      }}
                    ></div>
                    <input
                      type="range"
                      className="range-slider"
                      min="0"
                      max="1000"
                      value={activeFilters.priceRange[0]}
                      onChange={(e) => handlePriceChange(Number(e.target.value), activeFilters.priceRange[1])}
                    />
                    <input
                      type="range"
                      className="range-slider"
                      min="0"
                      max="1000"
                      value={activeFilters.priceRange[1]}
                      onChange={(e) => handlePriceChange(activeFilters.priceRange[0], Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-filters">
                  {availableSizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-option ${
                        activeFilters.sizes.includes(size) ? "selected" : ""
                      }`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="filter-section">
                <h4>Color</h4>
                <div className="color-filters">
                  {availableColors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${
                        activeFilters.colors.includes(color.value) ? "selected" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorToggle(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mobile-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setFilterOpen(false)}
              >
                Cancel
              </button>
              <button
                className="apply-btn"
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid - EMPTY FOR NOW */}
      <div className="store-container">
        <div className="results-count">
          Products will be loaded from backend
        </div>
        <main className="products-grid-container">
          <div className="no-products">
            <i className="bi bi-cloud-arrow-down"></i>
            <h3>Products Coming Soon</h3>
            <p>Products will be loaded from the backend API.</p>
          </div>
        </main>
      </div>

      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default StorePage;