import { useState, useEffect, useCallback } from 'react';
import { 
  getCartItems, 
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
  const [stockErrors, setStockErrors] = useState({});
  const [addedItem, setAddedItem] = useState(null);

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
      const existingItem = cartItems.find(item => 
        item.id === product.id && 
        item.color === product.color && 
        item.size === product.size
      );

      if (existingItem) {
        try {
          const response = await updateCartItem(existingItem.id, 1, '+');
          
          if (response && response.success === false && response.message === 'Not enough') {
            setError('Not enough stock available');
            return false;
          }
        } catch (err) {
          console.error('Error checking stock:', err);
        }
        
        setCartItems(prev => prev.map(item =>
          item.id === product.id && item.color === product.color && item.size === product.size
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        ));
      } else {
        setCartItems(prev => [...prev, { 
          ...product, 
          quantity: product.quantity || 1,
          id: product.id || Date.now().toString()
        }]);
      }
      
      setAddedItem({
        id: product.id,
        name: product.name,
        color: product.color,
        size: product.size
      });
      
      setError(null);
      
      setTimeout(() => {
        setAddedItem(null);
      }, 4000);
      
      return true;
      
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cartItems]);

  const updateQuantity = useCallback(async (itemId, color, size, option) => {
    const itemKey = `${itemId}-${color}-${size}`;
    setLoadingItems(prev => ({ ...prev, [itemKey]: 'quantity' }));
    setStockErrors(prev => ({ ...prev, [itemKey]: false }));
    
    try {
      if (userId) {
        const response = await updateCartItem(itemId, 1, option);
        
        if (response && response.success === false) {
          if (response.message === 'Not enough') {
            setStockErrors(prev => ({ ...prev, [itemKey]: true }));
            return false;
          }
        }
      }
      
      setCartItems(prev =>
        prev.map(item => {
          if (item.id === itemId && item.color === color && item.size === size) {
            const newQuantity = option === '+' ? item.quantity + 1 : item.quantity - 1;
            
            if (newQuantity === 0) {
              const itemToDelete = prev.find(item => 
                item.id === itemId && item.color === color && item.size === size
              );
              setPendingDeleteItem(itemToDelete);
              return item;
            }
            
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
      return false;
    } finally {
      setLoadingItems(prev => {
        const newState = { ...prev };
        delete newState[itemKey];
        return newState;
      });
    }
  }, [cartItems, userId]);

  const incrementQuantity = useCallback(async (itemId, color, size) => {
    return await updateQuantity(itemId, color, size, '+');
  }, [updateQuantity]);

  const decrementQuantity = useCallback(async (itemId, color, size) => {
    const item = cartItems.find(item => 
      item.id === itemId && item.color === color && item.size === size
    );
    if (item && item.quantity === 1) {
      const itemToDelete = cartItems.find(item => 
        item.id === itemId && item.color === color && item.size === size
      );
      setPendingDeleteItem(itemToDelete);
      return true;
    }
    return await updateQuantity(itemId, color, size, '-');
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
      return true;
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart');
      return false;
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
        '+'
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

  const clearAddedItem = useCallback(() => {
    setAddedItem(null);
  }, []);

  return {
    cartItems,
    pendingDeleteItem,
    loading,
    error,
    loadingItems,
    isClearing,
    stockErrors,
    addedItem,
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
    setPendingDeleteItem,
    clearAddedItem
  };
};