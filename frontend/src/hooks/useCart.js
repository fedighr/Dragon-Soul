import { useState, useEffect, useCallback } from 'react';
import { 
  getCartItems, 
  /*addCartItem,*/
  updateCartItem,
  removeCartItem, 
  clearCartItems
} from "../services/order";
import { jwtDecode } from 'jwt-decode';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [isClearing, setIsClearing] = useState(false); 

  const token = localStorage.getItem('access');
  const userId = token ? jwtDecode(token).id : null;
  
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await getCartItems(userId);
        console.log(response);
        setCartItems(response || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to load cart items');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const addToCart = useCallback(async (product) => {
    try {
      setLoading(true);
      const response = await addCartItem(product);
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
            id: product.id || Date.now().toString()
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

  const updateQuantity = useCallback(async (itemId, color, size, newQuantity, userId) => {
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
      await updateCartItem(itemId, newQuantity, userId);
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
  }, [cartItems]);

  const incrementQuantity = useCallback(async (itemId, color, size) => {
    const item = cartItems.find(item => 
      item.id === itemId && item.color === color && item.size === size
    );
    if (item) {
      await updateQuantity(itemId, color, size, item.quantity + 1, userId);
    }
  }, [cartItems, updateQuantity, userId]);

  const decrementQuantity = useCallback(async (itemId, color, size) => {
    const item = cartItems.find(item => 
      item.id === itemId && item.color === color && item.size === size
    );
    if (item) {
      await updateQuantity(itemId, color, size, item.quantity - 1, userId);
    }
  }, [cartItems, updateQuantity, userId]);

  const removeFromCart = useCallback(async (itemId, color, size) => {
    const itemKey = `${itemId}-${color}-${size}`;
    setLoadingItems(prev => ({ ...prev, [itemKey]: 'remove' }));
    
    try {
      await removeCartItem(itemId, userId);
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

  const keepItem = useCallback(async () => {
    if (pendingDeleteItem) {
      await updateQuantity(
        pendingDeleteItem.id,
        pendingDeleteItem.color,
        pendingDeleteItem.size,
        1,
        userId
      );
      setPendingDeleteItem(null);
    }
  }, [pendingDeleteItem, updateQuantity, userId]);

  const clearCart = useCallback(async () => {
    setIsClearing(true);
    try {
      await clearCartItems(userId);
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

  return {
    cartItems,
    pendingDeleteItem,
    loading,
    error,
    loadingItems,
    isClearing,
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
    setPendingDeleteItem
  };
};