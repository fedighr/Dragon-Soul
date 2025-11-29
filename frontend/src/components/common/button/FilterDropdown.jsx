// FilterDropdown.jsx
import React from "react";

const availableSizes = ["XS","S","M","L","XL","XXL"];
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

const FilterDropdown = ({ store }) => {
  const activeFilterCount = store.activeFilters.sizes.length + store.activeFilters.colors.length;
  
  const handlePriceInputChange = (index, value) => {
    const newPriceRange = [...store.localPriceRange];
    newPriceRange[index] = Number(value) || 0;
    store.handleLocalPriceChange(newPriceRange[0], newPriceRange[1]);
  };

  const handleSliderChange = (index, value) => {
    const newPriceRange = [...store.localPriceRange];
    newPriceRange[index] = Number(value);
    store.handleLocalPriceChange(newPriceRange[0], newPriceRange[1]);
  };

  const handleApplyFilters = () => {
    store.applyPriceFilter();
    store.setFilterOpen(false);
  };

  return (
    <div className="control-item" ref={store.filterRef}>
      <button
        className={`control-btn filter-btn ${store.filterOpen ? "active" : ""}`}
        onClick={() => store.setFilterOpen(!store.filterOpen)}
      >
        <i className="bi bi-funnel"></i>
        Filters
        {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        <i className="bi bi-chevron-down dropdown-arrow"></i>
      </button>

      {store.filterOpen && (
        <div className="control-dropdown filter-dropdown">
          <div className="dropdown-header">
            <h3>Filters</h3>
            <button 
              className="clear-filters" 
              onClick={store.handleClearFilters} 
              disabled={activeFilterCount === 0 && store.localPriceRange[0] === 0 && store.localPriceRange[1] === 1000}
            >
              Clear All
            </button>
          </div>

          <div className="dropdown-content">
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-range-container">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <span className="price-prefix">Min</span>
                    <input 
                      type="number" 
                      className="price-input"
                      value={store.localPriceRange[0]}
                      onChange={(e) => handlePriceInputChange(0, e.target.value)}
                      min="0"
                      max="1000"
                    />
                  </div>
                  <span className="price-separator">-</span>
                  <div className="price-input-group">
                    <span className="price-prefix">Max</span>
                    <input 
                      type="number" 
                      className="price-input"
                      value={store.localPriceRange[1]}
                      onChange={(e) => handlePriceInputChange(1, e.target.value)}
                      min="0"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="range-slider-container">
                  <div className="range-track">
                    <div 
                      className="range-progress"
                      style={{
                        left: `${(store.localPriceRange[0] / 1000) * 100}%`,
                        right: `${100 - (store.localPriceRange[1] / 1000) * 100}%`
                      }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={store.localPriceRange[0]}
                    onChange={(e) => handleSliderChange(0, e.target.value)}
                    className="range-slider range-slider-min"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={store.localPriceRange[1]}
                    onChange={(e) => handleSliderChange(1, e.target.value)}
                    className="range-slider range-slider-max"
                  />
                </div>

                <div className="price-display">
                  <span>PRICE</span>
                  <span className="price-values">
                    {store.localPriceRange[0]} TND - {store.localPriceRange[1]} TND
                  </span>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h4>Size</h4>
              <div className="size-filters">
                {availableSizes.map(size => (
                  <button 
                    key={size} 
                    className={`size-option ${store.activeFilters.sizes.includes(size) ? "selected" : ""}`} 
                    onClick={() => store.handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Color</h4>
              <div className="color-filters">
                {availableColors.map(color => (
                  <button 
                    key={color.value} 
                    className={`color-option ${store.activeFilters.colors.includes(color.value) ? "selected" : ""}`} 
                    style={{backgroundColor: color.value}} 
                    onClick={() => store.handleColorToggle(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="dropdown-actions">
            <button className="cancel-btn" onClick={() => store.setFilterOpen(false)}>Cancel</button>
            <button className="apply-btn" onClick={handleApplyFilters}>Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;