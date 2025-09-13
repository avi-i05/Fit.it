import React, { createContext, useEffect, useMemo, useState } from "react";

// Context create
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("fitit_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse cart from storage", e);
      return [];
    }
  });

  // persist cart
  useEffect(() => {
    try {
      localStorage.setItem("fitit_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increment = (id) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
  };

  const decrement = (id) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    return { itemCount, totalPrice };
  }, [cart]);

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, increment, decrement, clearCart, ...totals }),
    [cart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
