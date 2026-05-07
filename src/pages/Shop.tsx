import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products, categories, brands, formatKsh } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Shop: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const initialCat = params.get('cat') || '';
  const initialQ = params.get('q') || '';
  const flashOnly = params.get('flash') === '1';

  const [search, setSearch] = useState(initialQ);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (flashOnly) list = list.filter(p => p.flashSale);
    if (selectedCat) list = list.filter(p => p.category === selectedCat);
    if (selectedBrands.length) list = list.filter(p => selectedBrands.includes(p.brand));
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    return list;
  }, [search, selectedCat, selectedBrands, priceRange, sort, flashOnly]);

  const toggleBrand = (b: string) =>
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Search</h3>
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className="space-y-1">
          <button onClick={() => { setSelectedCat(''); setParams({}); }} className={`block w-full text-left px-2 py-1.5 rounded text-sm ${!selectedCat ? 'bg-green-100 text-green-800 font-medium' : 'hover:bg-slate-100'}`}>All Categories</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => { setSelectedCat(c.id); setParams({ cat: c.id }); }} className={`block w-full text-left px-2 py-1.5 rounded text-sm ${selectedCat === c.id ? 'bg-green-100 text-green-800 font-medium' : 'hover:bg-slate-100'}`}>
              {c.name} <span className="text-slate-400 text-xs">({c.count})</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={200000} step={1000} className="my-4" />
        <div className="flex justify-between text-sm text-slate-600">
          <span>{formatKsh(priceRange[0])}</span>
          <span>{formatKsh(priceRange[1])}</span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Brands</h3>
        <div className="space-y-2">
          {brands.map(b => (
            <label key={b} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={selectedBrands.includes(b)} onCheckedChange={() => toggleBrand(b)} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {flashOnly ? '⚡ Flash Sale' : selectedCat ? categories.find(c => c.id === selectedCat)?.name : 'All Products'}
          </h1>
          <p className="text-sm text-slate-500">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="lg:hidden gap-2" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="hidden lg:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 h-fit sticky top-32">
          <FilterPanel />
        </aside>

        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-5 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between mb-4"><h2 className="font-bold">Filters</h2><button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button></div>
              <FilterPanel />
              <Button onClick={() => setShowFilters(false)} className="w-full mt-6 bg-green-700">Show {filtered.length} products</Button>
            </div>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
              <h3 className="font-bold text-lg mb-2">No products found</h3>
              <p className="text-sm text-slate-500 mb-4">Try adjusting your filters</p>
              <Button onClick={() => { setSearch(''); setSelectedCat(''); setSelectedBrands([]); setPriceRange([0, 200000]); setParams({}); }} variant="outline">Reset filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
