import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Truck, Shield, Headphones, Smartphone, Shirt, Home as HomeIcon, Sparkles, ShoppingBasket, Dumbbell, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products, categories, formatKsh } from '@/data/products';

const iconMap: any = { Smartphone, Shirt, Home: HomeIcon, Sparkles, ShoppingBasket, Dumbbell };

const FlashCountdown: React.FC = () => {
  const [time, setTime] = useState({ h: 5, m: 47, s: 33 });
  useEffect(() => {
    const i = setInterval(() => {
      setTime(t => {
        let { h, m, s } = t; s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 23, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5">
      {[time.h, time.m, time.s].map((v, i) => (
        <React.Fragment key={i}>
          <div className="bg-slate-900 text-white font-mono font-bold text-sm px-2 py-1 rounded min-w-[2rem] text-center">{pad(v)}</div>
          {i < 2 && <span className="text-slate-900 font-bold">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const flashSales = products.filter(p => p.flashSale);
  const featured = products.filter(p => p.tags.includes('featured')).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104086368_79b245f8.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-800/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">🇰🇪 #1 Kenyan Marketplace</span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Pay with <span className="text-orange-400">M-Pesa</span><br />
              Shop with confidence
            </h1>
            <p className="text-lg text-green-100 mb-6 max-w-lg">
              From phones to fashion, groceries to electronics — get authentic products delivered to your doorstep across Kenya in 24-48 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop"><Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white gap-2 h-12 px-8">Shop Now <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link to="/shop?flash=1"><Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 px-8 backdrop-blur"><Zap className="w-4 h-4 mr-2" /> Flash Sales</Button></Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-orange-400" /> Free delivery in Nairobi</div>
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-orange-400" /> Buyer protection</div>
              <div className="flex items-center gap-2"><Headphones className="w-5 h-5 text-orange-400" /> 24/7 support</div>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full grid place-items-center font-black text-xl">M</div>
                <div>
                  <div className="font-bold">M-Pesa STK Push</div>
                  <div className="text-xs text-green-200">Daraja API · Instant</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-white/10 p-2 rounded"><span>Pay Bill</span><span className="font-mono font-bold">247247</span></div>
                <div className="flex justify-between bg-white/10 p-2 rounded"><span>Account</span><span className="font-mono">KSHOP</span></div>
                <div className="flex justify-between bg-white/10 p-2 rounded"><span>Status</span><span className="text-green-300 font-medium">● Online</span></div>
              </div>
              <p className="text-xs text-green-200 mt-3">Plus Airtel Money, Pesapal, Flutterwave & 8 more gateways</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(c => {
            const Icon = iconMap[c.icon];
            return (
              <Link key={c.id} to={`/shop?cat=${c.id}`} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-green-600 hover:shadow-md transition group">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 grid place-items-center mb-2 group-hover:bg-green-600 group-hover:text-white transition">
                  <Icon className="w-6 h-6 text-green-700 group-hover:text-white" />
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</div>
                <div className="text-xs text-slate-500">{c.count} items</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 grid place-items-center"><Zap className="w-5 h-5 text-white" /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">Flash Sale</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Ending soon — limited stock!</p>
                </div>
              </div>
              <FlashCountdown />
              <Link to="/shop?flash=1" className="text-sm font-medium text-orange-600 hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flashSales.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Products</h2>
            <p className="text-sm text-slate-500">Handpicked by our team</p>
          </div>
          <Link to="/shop" className="text-sm font-medium text-green-700 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Star className="w-6 h-6 text-yellow-500 fill-yellow-400" /> Best Sellers</h2>
              <p className="text-sm text-slate-500">Most loved by Kenyans</p>
            </div>
            <Link to="/shop" className="text-sm font-medium text-green-700 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">✨ New Arrivals</h2>
          <Link to="/shop" className="text-sm font-medium text-green-700 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-3">FOR BUSINESSES</span>
            <h3 className="text-3xl md:text-4xl font-bold mb-3">Sell on KenyaShop Pro</h3>
            <p className="text-slate-300 mb-6">Reach 500,000+ Kenyan shoppers. Get paid via M-Pesa, manage inventory, and grow your business with our free vendor tools.</p>
            <Link to="/dashboard?role=vendor"><Button size="lg" className="bg-orange-500 hover:bg-orange-600">Become a Vendor →</Button></Link>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10"><div className="text-3xl font-black text-orange-400">5K+</div><div className="text-xs text-slate-400 mt-1">Vendors</div></div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10"><div className="text-3xl font-black text-orange-400">500K</div><div className="text-xs text-slate-400 mt-1">Buyers</div></div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10"><div className="text-3xl font-black text-orange-400">47</div><div className="text-xs text-slate-400 mt-1">Counties</div></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
