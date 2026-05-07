import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, Search, X, LogOut, LayoutDashboard, Phone } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { categories } from '@/data/products';

const Header: React.FC = () => {
  const { cartCount, setCartOpen, setAuthOpen, setAuthMode, setAuthRole, user, logout, wishlist } = useShop();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(search)}`);
    setMobileOpen(false);
  };

  const openAuth = (role: any, mode: 'login' | 'register' = 'login') => {
    setAuthRole(role); setAuthMode(mode); setAuthOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="hidden sm:flex items-center gap-2"><Phone className="w-3 h-3" /> +254 700 000 000 — Karibu KenyaShop Pro</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Free delivery in Nairobi over KSh 3,000</span>
            <button onClick={() => openAuth('vendor', 'register')} className="hover:underline">Sell on KenyaShop</button>
            <button onClick={() => openAuth('rider', 'login')} className="hover:underline">Rider Login</button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 grid place-items-center text-white font-black">K</div>
          <div className="leading-tight">
            <div className="font-black text-slate-900 dark:text-white text-lg">KenyaShop <span className="text-orange-500">Pro</span></div>
            <div className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">Powered by M-Pesa Daraja</div>
          </div>
        </Link>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for phones, fashion, groceries..." className="pl-10 pr-24 h-10" />
            <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 bg-orange-500 hover:bg-orange-600">Search</Button>
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/wishlist')} className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 grid place-items-center">{wishlist.length}</span>}
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 grid place-items-center">{cartCount}</span>}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white grid place-items-center text-xs font-bold">{user.name[0]?.toUpperCase()}</div>
                  <span className="hidden sm:inline text-sm">{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}><LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/track')}>Track Orders</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')}>Wishlist</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}><LogOut className="w-4 h-4 mr-2" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => openAuth('customer', 'login')} variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" /> <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Categories nav */}
      <nav className="hidden md:block border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
          <Link to="/shop" className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-green-700 whitespace-nowrap">All Products</Link>
          {categories.map(c => (
            <Link key={c.id} to={`/shop?cat=${c.id}`} className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-green-700 whitespace-nowrap">{c.name}</Link>
          ))}
          <Link to="/shop?flash=1" className="px-3 py-2.5 text-sm font-semibold text-orange-600 hover:text-orange-700 whitespace-nowrap">⚡ Flash Sales</Link>
          <Link to="/help" className="ml-auto px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-green-700">Help Center</Link>
          <Link to="/contact" className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-green-700">Contact</Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-4 space-y-3">
          <form onSubmit={onSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-10" />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(c => (
              <Link key={c.id} to={`/shop?cat=${c.id}`} onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-lg">{c.name}</Link>
            ))}
          </div>
          <Link to="/help" onClick={() => setMobileOpen(false)} className="block text-sm py-2">Help Center</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm py-2">Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
