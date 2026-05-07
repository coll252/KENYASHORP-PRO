import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Plus, Minus, ShieldCheck, Truck, RotateCcw, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { products, formatKsh } from '@/data/products';
import { useShop } from '@/contexts/ShopContext';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.slug === slug);
  const { addToCart, toggleWishlist, wishlist, setCartOpen } = useShop();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState('Black');
  const [size, setSize] = useState('M');

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link to="/shop" className="text-green-700 hover:underline mt-4 inline-block">← Back to shop</Link>
    </div>;
  }

  const liked = wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-sm text-slate-500 mb-4">
        <Link to="/" className="hover:text-green-700">Home</Link> / <Link to="/shop" className="hover:text-green-700">Shop</Link> / <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div>
          <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[product.image, product.image, product.image, product.image].map((img, i) => (
              <div key={i} className="aspect-square bg-slate-50 rounded-lg overflow-hidden border-2 border-transparent hover:border-green-600 cursor-pointer">
                <img src={img} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.bestSeller && <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded">Best Seller</span>}
            {product.newArrival && <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">New</span>}
            <span className="text-xs text-slate-500">SKU: KS-{product.id.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-4 h-4", i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
            <span className="text-slate-300">|</span>
            <Link to="#" className="text-sm text-green-700 hover:underline">By {product.vendor}</Link>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-black text-green-700">{formatKsh(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-slate-400 line-through">{formatKsh(product.originalPrice)}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-5">{product.description}</p>

          {product.category === 'fashion' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {['Black', 'Red', 'Green', 'Blue'].map(c => (
                    <button key={c} onClick={() => setColor(c)} className={cn("px-3 py-1.5 rounded-lg border text-sm", color === c ? "border-green-700 bg-green-50 text-green-800 font-medium" : "border-slate-300 hover:border-slate-500")}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <button key={s} onClick={() => setSize(s)} className={cn("w-10 h-10 rounded-lg border text-sm font-medium", size === s ? "border-green-700 bg-green-50 text-green-800" : "border-slate-300 hover:border-slate-500")}>{s}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Quantity ({product.stock} available)</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-slate-100"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-medium min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2 hover:bg-slate-100"><Plus className="w-4 h-4" /></button>
              </div>
              <span className="text-sm text-slate-500">Total: <strong className="text-green-700">{formatKsh(product.price * qty)}</strong></span>
            </div>
          </div>

          <div className="flex gap-2 mb-5">
            <Button onClick={() => { addToCart(product, qty); setCartOpen(true); }} className="flex-1 bg-green-700 hover:bg-green-800 h-12">Add to Cart</Button>
            <Button onClick={handleBuyNow} className="flex-1 bg-orange-500 hover:bg-orange-600 h-12">Buy Now via M-Pesa</Button>
            <Button onClick={() => toggleWishlist(product.id)} variant="outline" size="icon" className="h-12 w-12">
              <Heart className={cn("w-5 h-5", liked && "fill-red-500 text-red-500")} />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12"><Share2 className="w-5 h-5" /></Button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
            <div className="text-center"><Truck className="w-5 h-5 mx-auto text-green-700 mb-1" /><div className="text-xs">Fast delivery</div></div>
            <div className="text-center"><ShieldCheck className="w-5 h-5 mx-auto text-green-700 mb-1" /><div className="text-xs">Genuine product</div></div>
            <div className="text-center"><RotateCcw className="w-5 h-5 mx-auto text-green-700 mb-1" /><div className="text-xs">7-day returns</div></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <Tabs defaultValue="desc">
          <TabsList>
            <TabsTrigger value="desc">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="prose prose-slate max-w-none mt-4">
            <p>{product.description}</p>
            <ul>
              <li>Genuine product with manufacturer warranty</li>
              <li>Sold and shipped by {product.vendor}</li>
              <li>Brand: {product.brand}</li>
              <li>Free delivery within Nairobi for orders over KSh 3,000</li>
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 space-y-4">
            {[
              { name: 'Wanjiku M.', rating: 5, text: 'Niliipata vizuri sana, kifaa ni cha hali ya juu. Highly recommend!' },
              { name: 'Otieno K.', rating: 4, text: 'Good quality, fast delivery to Kisumu. Packaging could be better.' },
              { name: 'Achieng N.', rating: 5, text: 'Asante sana KenyaShop! Delivered same day in Nairobi via M-Pesa payment.' },
            ].map((r, i) => (
              <div key={i} className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 grid place-items-center text-sm font-bold">{r.name[0]}</div>
                  <span className="font-medium text-sm">{r.name}</span>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={cn("w-3 h-3", j < r.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{r.text}</p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="shipping" className="mt-4 prose prose-slate max-w-none">
            <h4>Delivery options</h4>
            <ul>
              <li><strong>Nairobi:</strong> Same-day delivery (KSh 200, free over KSh 3,000)</li>
              <li><strong>Major towns:</strong> 1-2 days (KSh 350)</li>
              <li><strong>Rest of Kenya:</strong> 2-4 days (KSh 500)</li>
            </ul>
            <p>All deliveries handled by our verified rider network or G4S courier.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
