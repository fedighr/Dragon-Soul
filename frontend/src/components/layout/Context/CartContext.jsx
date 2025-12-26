import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  getCartItems, 
  updateCartItem,
  removeCartItem, 
  clearCartItems,
  getAdminById
} from "../../../services/order";
import {addCartItem} from "../../../services/store";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [isClearing, setIsClearing] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stockErrors, setStockErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  const token = localStorage.getItem('access');
  const userId = token ? jwtDecode(token).id : null;
  
  const fetchCartItems = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await getCartItems(userId);
      setCartItems(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to load cart items');
    }
  }, [userId]);

    useEffect(()=>{
    if(!userId) {
      setIsAdmin(false);
      return;

    }
    const verifyAdmin = async(userId)=>{
      try{
      const res = await getAdminById(userId);
      setIsAdmin(res.is_Admin);
      }catch(e){
        console.log(e);
              setIsAdmin(false);

      }
    }
    verifyAdmin(userId)
  },[userId]);


  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId, fetchCartItems]);

  const showToast = useCallback((text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

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
            showToast('Not enough stock available', 'error');
            setTimeout(() => {
              setStockErrors(prev => ({ ...prev, [itemKey]: false }));
            }, 2000);
            return false;
          }
        }
      }
      
      await fetchCartItems();
      return true;
    } catch (err) {
      console.error('Error updating quantity:', err);
      showToast('Failed to update quantity', 'error');
      return false;
    } finally {
      setLoadingItems(prev => {
        const newState = { ...prev };
        delete newState[itemKey];
        return newState;
      });
    }
  }, [userId, fetchCartItems, showToast]);

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
      
      await fetchCartItems();
      setPendingDeleteItem(null);
      showToast('Item removed from cart', 'success');
      return true;
    } catch (err) {
      console.error('Error removing item from cart:', err);
      showToast('Failed to remove item', 'error');
      return false;
    } finally {
      setLoadingItems(prev => {
        const newState = { ...prev };
        delete newState[itemKey];
        return newState;
      });
    }
  }, [userId, fetchCartItems, showToast]);

  const addToCart = useCallback(async (product) => {
    try {
      setLoading(true);
      setLastAddedItem(product.name);
      await addCartItem(product);
      await fetchCartItems();
      showToast(`${product.name} added to cart`, 'success');
      setTimeout(() => setLastAddedItem(null), 2000);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      showToast('Failed to add item to cart', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchCartItems, showToast]);


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
      await fetchCartItems();
      showToast('Cart cleared successfully', 'success');
    } catch (err) {
      console.error('Error clearing cart:', err);
      showToast('Failed to clear cart', 'error');
    } finally {
      setIsClearing(false);
    }
  }, [userId, fetchCartItems, showToast]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price , 0);
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

  const clearToastMessage = useCallback(() => {
    setToastMessage(null);
  }, []);

  const value = {
    cartItems,
    pendingDeleteItem,
    loading,
    error,
    isAdmin,
    loadingItems,
    isClearing,
    isCartOpen,
    stockErrors,
    toastMessage,
    lastAddedItem,
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
    fetchCartItems,
    clearToastMessage
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