
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000],
    sizes: [],
    colors: []
  });

  const [localPriceRange, setLocalPriceRange] = useState([0, 1000]);

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setTabsBarVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { if (sortOpen) setFilterOpen(false); }, [sortOpen]);
  useEffect(() => { if (filterOpen) setSortOpen(false); }, [filterOpen]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = await fetchProducts(activeFilters, selectedSort, selectedCategory);
        setFilteredProducts(products);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [activeFilters, selectedSort, selectedCategory]);

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortOpen(false);
  };

  const handleSizeToggle = (size) => setActiveFilters(prev => ({
    ...prev,
    sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
  }));

  const handleColorToggle = (color) => setActiveFilters(prev => ({
    ...prev,
    colors: prev.colors.includes(color) ? prev.colors.filter(c => c !== color) : [...prev.colors, color]
  }));

  const handlePriceChange = (min, max) => {
    const adjustedMin = Math.min(min, max);
    const adjustedMax = Math.max(min, max);
    setActiveFilters(prev => ({ ...prev, priceRange: [adjustedMin, adjustedMax] }));
    setLocalPriceRange([adjustedMin, adjustedMax]);
  };

  const handleLocalPriceChange = (min, max) => {
    const adjustedMin = Math.min(min, max);
    const adjustedMax = Math.max(min, max);
    setLocalPriceRange([adjustedMin, adjustedMax]);
  };

  const applyPriceFilter = () => {
    setActiveFilters(prev => ({ ...prev, priceRange: localPriceRange }));
  };

  const handleClearFilters = () => {
    setActiveFilters({ priceRange: [0,1000], sizes: [], colors: [] });
    setLocalPriceRange([0, 1000]);
  };

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
    handleLocalPriceChange,
    applyPriceFilter,
    handleClearFilters,
    sortRef,
    filterRef,
    loading,
    error,
    localPriceRange
  };
};