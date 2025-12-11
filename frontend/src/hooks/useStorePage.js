import { useState, useRef, useEffect, useCallback } from "react";
import { fetchProducts } from "../services/store.js";

export const useStorePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedSort, setSelectedSort] = useState("Name: A to Z");
  const [tabsBarVisible, setTabsBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
    types: []
  });

  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
    types: []
  });

  const sortRef = useRef(null);
  const filterRef = useRef(null);
  const footerRef = useRef(null);
  const productsGridRef = useRef(null);

  useEffect(() => {
    if (productsGridRef.current && !isInitialLoad && !isFetchingMore) {
      const cards = productsGridRef.current.querySelectorAll('.product-card');
      cards.forEach((card, index) => {
        const isNew = index >= filteredProducts.length - 10;
        if (isNew) {
          card.style.animation = `fadeInUp 0.5s ease ${Math.min(index * 0.03, 0.5)}s forwards`;
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
        }
      });
    }
  }, [filteredProducts, isInitialLoad, isFetchingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore && !isInitialLoad) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const footerEl = footerRef.current;
    if (footerEl) observer.observe(footerEl);

    return () => {
      if (footerEl) observer.unobserve(footerEl);
    };
  }, [hasMore, loading, isFetchingMore, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      setPage(1);
      setHasMore(true);
      loadProducts(1);
    }
  }, [appliedFilters, selectedSort, selectedCategory]);
  
  useEffect(()=>{


  const loadInitialProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("first load");
      const products = await fetchProducts(appliedFilters, selectedSort, selectedCategory, 1);
      if (products.length === 0) {
        setShowNoProductsMessage(true);
        setHasMore(false);
      } else {
        setFilteredProducts(products);
        setShowNoProductsMessage(false);
        setHasMore(products.length >= 10);
      }
      setIsInitialLoad(false);
    } catch (err) {
      setError(err.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  loadInitialProducts();
  },[]);

  const loadProducts = async (pageNum) => {
    if (loading || isFetchingMore) return;
    
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    
    setError(null);
    try {
      console.log("second load");
      const products = await fetchProducts(appliedFilters, selectedSort, selectedCategory, pageNum);
      if (products.length === 0) {
        setHasMore(false);
        if (pageNum === 1) {
          setShowNoProductsMessage(true);
        }
      } else {
        if (pageNum === 1) {
          setFilteredProducts(products);
        } else {
          setFilteredProducts(prev => [...prev, ...products]);
        }
        setHasMore(products.length >= 10);
        setShowNoProductsMessage(false);
      }
    } catch (err) {
      setError(err.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const loadMoreProducts = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await loadProducts(nextPage);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setTabsBarVisible(currentScrollY < lastScrollY || currentScrollY < 100);
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
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

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortOpen(false);
  };

  const handleSizeToggle = (size) => {
    setLocalFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size) 
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color) => {
    setLocalFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color) 
        : [...prev.colors, color]
    }));
  };

  const handleTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      types: prev.types.includes(type) 
        ? prev.types.filter(t => t !== type) 
        : [...prev.types, type]
    }));
  };

  const handlePriceChange = (min, max) => {
    const adjustedMin = Math.min(min, max, 1000);
    const adjustedMax = Math.max(Math.min(max, 1000), adjustedMin);
    setLocalFilters(prev => ({ 
      ...prev, 
      priceRange: [adjustedMin, adjustedMax] 
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(localFilters);
    setPage(1);
    setFilterOpen(false);
  };

  const cancelFilters = () => {
    setLocalFilters(appliedFilters);
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    const resetFilters = { 
      priceRange: [0, 1000], 
      sizes: [], 
      colors: [], 
      types: [] 
    };
    setLocalFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
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
    localFilters,
    appliedFilters,
    handleSizeToggle,
    handleColorToggle,
    handleTypeToggle,
    handlePriceChange,
    applyFilters,
    cancelFilters,
    handleClearFilters,
    sortRef,
    filterRef,
    footerRef,
    productsGridRef,
    loading,
    error,
    hasMore,
    showNoProductsMessage,
    isInitialLoad,
    isFetchingMore
  };
};