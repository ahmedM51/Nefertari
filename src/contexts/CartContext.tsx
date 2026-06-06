import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  placeOrder: (shippingDetails: { customer_name: string; phone: string; shipping_address: string }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nefertari_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { token } = useAuth();

  useEffect(() => {
    localStorage.setItem('nefertari_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        // cap by stock if we want
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item =>
          item.product_id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.min(quantity, product.stock),
        image_url: product.image_urls[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async (shippingDetails: { customer_name: string; phone: string; shipping_address: string }) => {
    if (!token) {
      return { success: false, error: 'Auth credentials missing. Please log in.' };
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...shippingDetails,
          cart_items: cart
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        clearCart();
        return { success: true, orderId: data.order_id };
      } else {
        return { success: false, error: data.error || 'Failed to place order.' };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'An unexpected error occurred.' };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
};
