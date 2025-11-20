import React from "react";

const sortOptions = [
  "Name: A to Z",
  "Name: Z to A",
  "Price: Low to High",
  "Price: High to Low",
  "Date: Oldest First",
  "Date: Newest First"
];

const SortDropdown = ({ store }) => (
  <div className="control-item" ref={store.sortRef}>
    <button
      className={`control-btn sort-btn ${store.sortOpen ? "active" : ""}`}
      onClick={() => store.setSortOpen(!store.sortOpen)}
    >
      <i className="bi bi-sort-down"></i>
      Sort By
      <i className="bi bi-chevron-down dropdown-arrow"></i>
    </button>
    {store.sortOpen && (
      <div className="control-dropdown sort-dropdown">
        {sortOptions.map((option, index) => (
          <button
            key={index}
            className={`dropdown-option ${store.selectedSort === option ? "selected" : ""}`}
            onClick={() => store.handleSortSelect(option)}
          >
            {option} {store.selectedSort === option && <i className="bi bi-check"></i>}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default SortDropdown;
