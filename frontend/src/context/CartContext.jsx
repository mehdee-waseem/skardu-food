import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    // load whatever was saved last time, so the cart survives a refresh
    const saved = localStorage.getItem('skardu-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('skardu-cart', JSON.stringify(items));
  }, [items]);

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQty(productId, qty) {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
