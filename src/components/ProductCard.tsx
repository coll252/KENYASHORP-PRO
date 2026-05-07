import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Zap } from 'lucide-react';
import { Product, formatKsh } from '@/data/products';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const liked = wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="block relative">
        <div className="aspect-square bg-slate-50 dark:bg-slate-900 overflow-hidden">
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{discount}%</span>
        )}
        {product.flashSale && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><Zap className="w-3 h-3" /> Flash</span>
        )}
        {product.newArrival && !product.flashSale && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
        )}
      </Link>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link to={`/product/${product.slug}`} className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 hover:text-green-700 min-h-[2.5rem]">
            {product.name}
          </Link>
          <button onClick={() => toggleWishlist(product.id)} className="shrink-0 p-1 hover:scale-110 transition">
            <Heart className={cn("w-4 h-4", liked ? "fill-red-500 text-red-500" : "text-slate-400")} />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
          <span>({product.reviews})</span>
          <span className="ml-auto truncate">{product.vendor}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-green-700 dark:text-green-500">{formatKsh(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">{formatKsh(product.originalPrice)}</span>
          )}
        </div>

        <Button onClick={() => addToCart(product)} size="sm" className="w-full bg-green-700 hover:bg-green-800 text-white gap-2">
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
