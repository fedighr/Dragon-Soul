import React from "react";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
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

const clothingTypes = ["T-shirt", "Jeans", "Accessories", "Shoes"];

const FilterDropdown = ({ store, isMobile = false }) => {
  const activeFilterCount = store.localFilters.sizes.length + 
                          store.localFilters.colors.length + 
                          store.localFilters.types.length;
  
  const handlePriceInputChange = (index, value) => {
    const newPriceRange = [...store.localFilters.priceRange];
    newPriceRange[index] = Math.max(0, Math.min(Number(value) || 0, 1000));
    store.handlePriceChange(newPriceRange[0], newPriceRange[1]);
  };

  const handleSliderChange = (index, value) => {
    const newPriceRange = [...store.localFilters.priceRange];
    newPriceRange[index] = Number(value);
    store.handlePriceChange(newPriceRange[0], newPriceRange[1]);
  };

  const handleApplyFilters = () => {
    store.applyFilters();
  };

  const handleCancelFilters = () => {
    store.cancelFilters();
  };

  const hasFilterChanges = () => {
    return JSON.stringify(store.localFilters) !== JSON.stringify(store.appliedFilters);
  };

  const isClearAllDisabled = () => {
    return activeFilterCount === 0 && 
           store.localFilters.priceRange[0] === 0 && 
           store.localFilters.priceRange[1] === 1000;
  };

  return (
    <div className={`control-dropdown filter-dropdown ${isMobile ? 'mobile-view' : ''}`}>
      {!isMobile && (
        <div className="dropdown-header">
          <h3>Filters</h3>
          <button 
            className="clear-filters" 
            onClick={store.handleClearFilters} 
            disabled={isClearAllDisabled()}
          >
            Clear All
          </button>
        </div>
      )}

      <div className="dropdown-content">
        <div className="filter-section">
          <h4>Price Range (TND)</h4>
          <div className="price-range-container">
            <div className="price-inputs">
              <div className="price-input-group">
                <span className="price-prefix">Min</span>
                <input 
                  type="number" 
                  className="price-input"
                  value={store.localFilters.priceRange[0]}
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
                  value={store.localFilters.priceRange[1]}
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
                    left: `${(store.localFilters.priceRange[0] / 1000) * 100}%`,
                    right: `${100 - (store.localFilters.priceRange[1] / 1000) * 100}%`
                  }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={store.localFilters.priceRange[0]}
                onChange={(e) => handleSliderChange(0, e.target.value)}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={store.localFilters.priceRange[1]}
                onChange={(e) => handleSliderChange(1, e.target.value)}
                className="range-slider range-slider-max"
              />
            </div>

            <div className="price-display">
              <span>Selected Price:</span>
              <span className="price-values">
                {store.localFilters.priceRange[0]} TND - {store.localFilters.priceRange[1]} TND
              </span>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h4>Type of Clothing</h4>
          <div className="type-filters">
            {clothingTypes.map(type => (
              <div 
                key={type}
                className={`type-option ${store.localFilters.types.includes(type) ? 'selected' : ''}`}
                onClick={() => store.handleTypeToggle(type)}
              >
                <input
                  type="checkbox"
                  checked={store.localFilters.types.includes(type)}
                  onChange={() => {}}
                  readOnly
                />
                <span className="type-label">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>Size</h4>
          <div className="size-filters">
            {availableSizes.map(size => (
              <button 
                key={size} 
                className={`size-option ${store.localFilters.sizes.includes(size) ? "selected" : ""}`} 
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
                className={`color-option ${store.localFilters.colors.includes(color.value) ? "selected" : ""}`} 
                style={{backgroundColor: color.value}} 
                onClick={() => store.handleColorToggle(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`dropdown-actions ${isMobile ? 'mobile-actions' : ''}`}>
        <button 
          className="cancel-btn" 
          onClick={handleCancelFilters}
          disabled={!hasFilterChanges()}
        >
          Cancel
        </button>
        <button 
          className="apply-btn" 
          onClick={handleApplyFilters}
          disabled={!hasFilterChanges()}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;