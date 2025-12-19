import { useState, useRef, useEffect, useCallback } from "react";
import { fetchProducts, addCartItem } from "../services/store.js";

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
  
  const [isFiltering, setIsFiltering] = useState(false);
  const [isClearingFilters, setIsClearingFilters] = useState(false);
  const [isChangingCategory, setIsChangingCategory] = useState(false);

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
  const abortControllerRef = useRef(null);
  const isFetchingRef = useRef(false);
  
  useEffect(() => {
    loadInitialProducts();
  }, []);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && 
            hasMore && 
            !loading && 
            !isFetchingMore && 
            !isInitialLoad && 
            !isFiltering && 
            !isClearingFilters && 
            !isChangingCategory &&
            !isFetchingRef.current) {
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
  }, [hasMore, loading, isFetchingMore, isInitialLoad, isFiltering, isClearingFilters, isChangingCategory]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadProducts = useCallback(async (pageNum, filters = appliedFilters, sort = selectedSort, category = selectedCategory) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const products = await fetchProducts(
        filters, 
        sort, 
        category, 
        pageNum,
        abortControllerRef.current.signal
      );
      
      return products;
    } catch (err) {
      if (err.name === 'AbortError') {
        return [];
      }
      
      if (err.response?.status === 404 || err.message?.includes('404')) {
        return [];
      }
      
      throw err;
    }
  }, [appliedFilters, selectedSort, selectedCategory]);

  const loadInitialProducts = async () => {
    setLoading(true);
    setError(null);
    setHasMore(true);
    setPage(1);
    try {
      const products = await loadProducts(1);
      if (products.length === 0) {
        setShowNoProductsMessage(true);
        setHasMore(false);
        setFilteredProducts([]);
      } else {
        setFilteredProducts(products);
        setShowNoProductsMessage(false);
        setHasMore(products.length >= 10);
      }
      setIsInitialLoad(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || "Failed to load products. Please try again.");
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (isFetchingRef.current) return;
    
    const nextPage = page + 1;
    isFetchingRef.current = true;
    setIsFetchingMore(true);
    setError(null);
    
    try {
      const products = await loadProducts(nextPage);
      
      if (products.length === 0) {
        setHasMore(false);
      } else {
        setFilteredProducts(prev => [...prev, ...products]);
        setHasMore(products.length >= 10);
        setPage(nextPage);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || "Failed to load more products.");
        setHasMore(false);
      }
    } finally {
      setIsFetchingMore(false);
      isFetchingRef.current = false;
    }
  };

  const applyChanges = useCallback(async (action, options = {}) => {
    let loadingState, filters, sort, category;
    
    switch (action) {
      case 'category':
        loadingState = setIsChangingCategory;
        category = options.category;
        filters = appliedFilters;
        sort = selectedSort;
        break;
      case 'sort':
        loadingState = setIsFiltering;
        category = selectedCategory;
        filters = appliedFilters;
        sort = options.sort;
        break;
      case 'filter':
        loadingState = setIsFiltering;
        category = selectedCategory;
        filters = options.filters || localFilters;
        sort = selectedSort;
        break;
      case 'clear':
        loadingState = setIsClearingFilters;
        category = selectedCategory;
        filters = { priceRange: [0, 1000], sizes: [], colors: [], types: [] };
        sort = selectedSort;
        break;
      default:
        return;
    }
    
    loadingState(true);
    setError(null);
    setHasMore(true);
    setPage(1);
    
    try {
      const products = await loadProducts(1, filters, sort, category);
      
      if (products.length === 0) {
        setShowNoProductsMessage(true);
        setHasMore(false);
        setFilteredProducts([]);
      } else {
        setFilteredProducts(products);
        setShowNoProductsMessage(false);
        setHasMore(products.length >= 10);
      }
      
      switch (action) {
        case 'category':
          setSelectedCategory(category);
          break;
        case 'sort':
          setSelectedSort(sort);
          setSortOpen(false);
          break;
        case 'filter':
          setAppliedFilters(filters);
          setFilterOpen(false);
          break;
        case 'clear':
          setLocalFilters(filters);
          setAppliedFilters(filters);
          break;
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || `Failed to ${action} products.`);
        setHasMore(false);
      }
    } finally {
      loadingState(false);
    }
  }, [loadProducts, appliedFilters, selectedSort, selectedCategory, localFilters]);

  const handleCategorySelect = (category) => {
    if (category === selectedCategory || isChangingCategory) return;
    applyChanges('category', { category });
  };

  const handleSortSelect = (sort) => {
    if (sort === selectedSort || isFiltering) return;
    applyChanges('sort', { sort });
  };

  const applyFilters = () => {
    if (isFiltering) return;
    applyChanges('filter', { filters: localFilters });
  };

  const handleClearFilters = () => {
    if (isClearingFilters) return;
    applyChanges('clear');
  };

  const cancelFilters = () => {
    setLocalFilters(appliedFilters);
    setFilterOpen(false);
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

  return {
    products,
    filteredProducts,
    sortOpen,
    setSortOpen,
    filterOpen,
    setFilterOpen,
    selectedCategory,
    selectedSort,
    tabsBarVisible,
    localFilters,
    appliedFilters,
    loading,
    error,
    hasMore,
    showNoProductsMessage,
    isInitialLoad,
    isFetchingMore,
    isFiltering,
    isClearingFilters,
    isChangingCategory,
    handleSizeToggle,
    handleColorToggle,
    handleTypeToggle,
    handlePriceChange,
    applyFilters,
    cancelFilters,
    handleClearFilters,
    handleCategorySelect,
    handleSortSelect,
    sortRef,
    filterRef,
    footerRef,
    productsGridRef
  };
};