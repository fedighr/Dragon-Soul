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
            <button className="clear-filters" onClick={store.handleClearFilters} disabled={activeFilterCount === 0}>Clear All</button>
          </div>

          <div className="dropdown-content">
            {/* Price */}
            <div className="filter-section">
              <h4>Price Range</h4>
              <input type="number" value={store.activeFilters.priceRange[0]} onChange={e => store.handlePriceChange(Number(e.target.value), store.activeFilters.priceRange[1])}/>
              <input type="number" value={store.activeFilters.priceRange[1]} onChange={e => store.handlePriceChange(store.activeFilters.priceRange[0], Number(e.target.value))}/>
            </div>

            {/* Sizes */}
            <div className="filter-section">
              <h4>Size</h4>
              <div className="size-filters">
                {availableSizes.map(size => (
                  <button key={size} className={`size-option ${store.activeFilters.sizes.includes(size) ? "selected" : ""}`} onClick={() => store.handleSizeToggle(size)}>{size}</button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="filter-section">
              <h4>Color</h4>
              <div className="color-filters">
                {availableColors.map(color => (
                  <button key={color.value} className={`color-option ${store.activeFilters.colors.includes(color.value) ? "selected" : ""}`} style={{backgroundColor: color.value}} onClick={() => store.handleColorToggle(color.value)} title={color.name}/>
                ))}
              </div>
            </div>
          </div>

          <div className="dropdown-actions">
            <button className="cancel-btn" onClick={() => store.setFilterOpen(false)}>Cancel</button>
            <button className="apply-btn" onClick={() => store.setFilterOpen(false)}>Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
