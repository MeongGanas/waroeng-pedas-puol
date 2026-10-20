import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('waroeng_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tableNumber, setTableNumber] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMeja = params.get('meja') || params.get('table');
      if (urlMeja) {
        localStorage.setItem('waroeng_table', urlMeja);
        return urlMeja;
      }
      return localStorage.getItem('waroeng_table') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMeja = params.get('meja') || params.get('table');
      if (urlMeja && urlMeja !== tableNumber) {
        setTableNumber(urlMeja);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('waroeng_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('waroeng_table', tableNumber);
    }
  }, [tableNumber]);

  const addToCart = (menu, quantity = 1, spicyLevel = 0, notes = '') => {
    setCartItems(prev => {
      // Cari apakah item dengan menu_id, level pedas, dan catatan yang sama persis sudah ada di keranjang
      const existingIndex = prev.findIndex(
        item => item.menu.id === menu.id && item.spicyLevel === spicyLevel && item.notes === notes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { menu, quantity, spicyLevel, notes }];
    });
  };

  const updateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.menu.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalAmount,
      totalItemsCount,
      tableNumber,
      setTableNumber,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

