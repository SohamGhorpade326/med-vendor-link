import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  brand?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  requiresPrescription?: boolean;
  vendorName?: string;
  vendorId?: string; // ✅ keep vendor id for orders
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "medihub_cart_v1";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (incoming: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.productId === incoming.productId);
      if (idx >= 0) {
        const merged: CartItem = {
          ...prev[idx],
          // ✅ preserve vendorId/brand in case previous item was missing them
          vendorId: incoming.vendorId ?? prev[idx].vendorId,
          brand: incoming.brand ?? prev[idx].brand,
          vendorName: incoming.vendorName ?? prev[idx].vendorName,
          quantity: prev[idx].quantity + (incoming.quantity || 1),
        };
        const copy = [...prev];
        copy[idx] = merged;
        return copy;
      }
      // ✅ make sure vendorId is stored
      return [
        ...prev,
        {
          productId: incoming.productId,
          name: incoming.name,
          brand: incoming.brand,
          price: incoming.price,
          quantity: incoming.quantity || 1,
          imageUrl: incoming.imageUrl,
          requiresPrescription: incoming.requiresPrescription,
          vendorName: incoming.vendorName,
          vendorId: incoming.vendorId, // ✅ keep it
        },
      ];
    });
  };

  const removeFromCart = (productId: string) =>
    setItems((prev) => prev.filter((p) => p.productId !== productId));

  const updateQuantity = (productId: string, qty: number) =>
    setItems((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, quantity: Math.max(1, Math.floor(qty || 1)) } : p
      )
    );

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
