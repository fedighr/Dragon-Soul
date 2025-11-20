import { useState, useRef, useEffect} from "react";
import { fetchProducts } from "../services/product.js";


export const useStorePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedSort, setSelectedSort] = useState("Name: A to Z");
  const [tabsBarVisible, setTabsBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000],
    sizes: [],
    colors: []
  });

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setTabsBarVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close other panel when one opens
  useEffect(() => { if (sortOpen) setFilterOpen(false); }, [sortOpen]);
  useEffect(() => { if (filterOpen) setSortOpen(false); }, [filterOpen]);

  // Fetch products when filters/sort/category change
  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts(activeFilters, selectedSort, selectedCategory);
      setFilteredProducts(products);
    };
    loadProducts();
  }, [activeFilters, selectedSort, selectedCategory]);

  // Handlers
  const handleSortSelect = (option) => setSelectedSort(option);
  const handleSizeToggle = (size) => setActiveFilters(prev => ({
    ...prev,
    sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
  }));
  const handleColorToggle = (color) => setActiveFilters(prev => ({
    ...prev,
    colors: prev.colors.includes(color) ? prev.colors.filter(c => c !== color) : [...prev.colors, color]
  }));
  const handlePriceChange = (min, max) => setActiveFilters(prev => ({ ...prev, priceRange: [min, max] }));
  const handleClearFilters = () => setActiveFilters({ priceRange: [0,1000], sizes: [], colors: [] });
  const handleCategorySelect = (category) => setSelectedCategory(category);

  return {
    products,
    filteredProducts,
    sortOpen,
    setSortOpen,
    filterOpen,
    setFilterOpen,
    selectedCategory,
    handleCategorySelect,
    selectedSort,
    handleSortSelect,
    tabsBarVisible,
    activeFilters,
    handleSizeToggle,
    handleColorToggle,
    handlePriceChange,
    handleClearFilters,
    sortRef,
    filterRef,
  };
};
