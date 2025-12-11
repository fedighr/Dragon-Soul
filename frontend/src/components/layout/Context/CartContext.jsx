import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  getCartItems, 
  updateCartItem,
  removeCartItem, 
  clearCartItems
} from "../../../services/order";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [isClearing, setIsClearing] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      } catch (err) {
        console.error('Error loading cart from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const token = localStorage.getItem('access');
  const userId = token ? jwtDecode(token).id : null;
  
  const fetchCartItems = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await getCartItems(userId);
      const items = Array.isArray(response) ? response : [];
      setCartItems(items);
      localStorage.setItem('cart', JSON.stringify(items));
      setError(null);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = useCallback(async (itemId, color, size, newQuantity) => {
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      const itemToDelete = cartItems.find(item => 
        item.id === itemId && item.color === color && item.size === size
      );
      setPendingDeleteItem(itemToDelete);
      return;
    }
    
    const itemKey = `${itemId}-${color}-${size}`;
    setLoadingItems(prev => ({ ...prev, [itemKey]: 'quantity' }));
    
    try {
      if (userId) {
        await updateCartItem(itemId, newQuantity, userId);
      }
      
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId && item.color === color && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    } finally {
      setLoadingItems(prev => {
        const newState = { ...prev };
        delete newState[itemKey];
        return newState;
      });
    }
  }, [cartItems, userId]);

  const incrementQuantity = useCallback(async (itemId, color, size) => {
    const item = cartItems.find(item => 
      item.id === itemId && item.color === color && item.size === size
    );
    if (item) {
      await updateQuantity(itemId, color, size, item.quantity + 1);
    }
  }, [cartItems, updateQuantity]);

  const decrementQuantity = useCallback(async (itemId, color, size) => {
    const item = cartItems.find(item => 
      item.id === itemId && item.color === color && item.size === size
    );
    if (item) {
      await updateQuantity(itemId, color, size, item.quantity - 1);
    }
  }, [cartItems, updateQuantity]);

  const removeFromCart = useCallback(async (itemId, color, size) => {
    const itemKey = `${itemId}-${color}-${size}`;
    setLoadingItems(prev => ({ ...prev, [itemKey]: 'remove' }));
    
    try {
      if (userId) {
        await removeCartItem(itemId, userId);
      }
      
      setCartItems(prev =>
        prev.filter(item =>
          !(item.id === itemId && item.color === color && item.size === size)
        )
      );
      setPendingDeleteItem(null);
      setError(null);
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoadingItems(prev => {
        const newState = { ...prev };
        delete newState[itemKey];
        return newState;
      });
    }
  }, [userId]);

  const addToCart = useCallback(async (product) => {
    try {
      setLoading(true);
      setCartItems(prev => {
        const existingItem = prev.find(item => 
          item.id === product.id && 
          item.color === product.color && 
          item.size === product.size
        );

        if (existingItem) {
          return prev.map(item =>
            item.id === product.id && item.color === product.color && item.size === product.size
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          );
        } else {
          return [...prev, { 
            ...product, 
            quantity: product.quantity || 1,
            id: product.id || Date.now().toString(),
            addedAt: Date.now()
          }];
        }
      });
      setError(null);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const keepItem = useCallback(async () => {
    if (pendingDeleteItem) {
      await updateQuantity(
        pendingDeleteItem.id,
        pendingDeleteItem.color,
        pendingDeleteItem.size,
        1
      );
      setPendingDeleteItem(null);
    }
  }, [pendingDeleteItem, updateQuantity]);

  const clearCart = useCallback(async () => {
    setIsClearing(true);
    try {
      if (userId) {
        await clearCartItems(userId);
      }
      setCartItems([]);
      setError(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  }, [userId]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getItemLoadingState = useCallback((itemId, color, size, type = 'quantity') => {
    const itemKey = `${itemId}-${color}-${size}`;
    return loadingItems[itemKey] === type;
  }, [loadingItems]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    setPendingDeleteItem(null);
  }, []);

  const value = {
    cartItems,
    pendingDeleteItem,
    loading,
    error,
    loadingItems,
    isClearing,
    isCartOpen,
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    keepItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemLoadingState,
    openCart,
    closeCart,
    setPendingDeleteItem,
    fetchCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};