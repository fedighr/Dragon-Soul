import React from "react";

const categories = [
  { name: "All Products", icon: "bi-grid" },
  { name: "New Arrival", icon: "bi-star" },
  { name: "Best Sells", icon: "bi-trophy" },
  { name: "Featured", icon: "bi-heart" }
];

const CategoryButton = ({ store }) => (
  <div className="categories-section">
    <div className="category-tabs">
      {categories.map((category, index) => (
        <button
          key={index}
          className={`category-tab ${store.selectedCategory === category.name ? "active" : ""}`}
          onClick={() => store.handleCategorySelect(category.name)}
        >
          <i className={`bi ${category.icon}`}></i>
          {category.name}
          <div className="tab-line"><div className="line-fill"></div></div>
        </button>
      ))}
    </div>
  </div>
);

export default CategoryButton;
