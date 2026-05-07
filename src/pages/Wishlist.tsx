import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useShop } from '@/contexts/ShopContext';
import { products } from '@/data/products';

const Wishlist: React.FC = () => {
  const { wishlist } = useShop();
  const items = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Heart className="w-7 h-7 text-red-500 fill-red-500" /> My Wishlist</h1>
      <p className="text-slate-500 mb-6">{items.length} items saved</p>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h2 className="font-bold text-lg mb-1">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-4">Save items you love by tapping the heart icon</p>
          <Link to="/shop"><Button className="bg-green-700">Browse Products</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
