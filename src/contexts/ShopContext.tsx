import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { toast } from '@/components/ui/use-toast';

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'vendor' | 'rider' | 'admin' | 'superadmin';
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  cartOpen: boolean;
  authOpen: boolean;
  authMode: 'login' | 'register';
  authRole: User['role'];
  setCartOpen: (v: boolean) => void;
  setAuthOpen: (v: boolean) => void;
  setAuthMode: (v: 'login' | 'register') => void;
  setAuthRole: (v: User['role']) => void;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  login: (u: User) => void;
  logout: () => void;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('ks_cart') || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('ks_wishlist') || '[]'); } catch { return []; }
  });
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('ks_user') || 'null'); } catch { return null; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<User['role']>('customer');

  useEffect(() => { localStorage.setItem('ks_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('ks_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('ks_user', JSON.stringify(user)); }, [user]);

  const addToCart = (p: Product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...p, quantity: qty }];
    });
    toast({ title: 'Added to cart', description: p.name });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const login = (u: User) => { setUser(u); setAuthOpen(false); toast({ title: `Karibu, ${u.name}!`, description: 'You are now signed in.' }); };
  const logout = () => { setUser(null); toast({ title: 'Signed out' }); };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <ShopContext.Provider value={{
      cart, wishlist, user, cartOpen, authOpen, authMode, authRole,
      setCartOpen, setAuthOpen, setAuthMode, setAuthRole,
      addToCart, removeFromCart, updateQty, clearCart, toggleWishlist,
      login, logout, cartTotal, cartCount,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
};
