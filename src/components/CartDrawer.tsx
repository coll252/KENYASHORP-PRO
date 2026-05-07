import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useShop } from '@/contexts/ShopContext';
import { formatKsh } from '@/data/products';

const CartDrawer: React.FC = () => {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  const goCheckout = () => { setCartOpen(false); navigate('/checkout'); };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-green-700" /> Your Cart ({cart.length})</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 grid place-items-center mb-4">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Your cart is empty</h3>
            <p className="text-sm text-slate-500 mb-4">Add some products to get started</p>
            <Button onClick={() => { setCartOpen(false); navigate('/shop'); }} className="bg-green-700 hover:bg-green-800">Browse Products</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 border border-slate-200 rounded-lg p-2">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover bg-slate-50" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-2">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.vendor}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1 border rounded">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 hover:bg-slate-100"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs px-2 min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 hover:bg-slate-100"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="text-sm font-bold text-green-700">{formatKsh(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="font-medium">{formatKsh(cartTotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-600">Delivery</span><span className="text-slate-500">Calculated at checkout</span></div>
              <div className="flex justify-between text-base font-bold border-t pt-2"><span>Total</span><span className="text-green-700">{formatKsh(cartTotal)}</span></div>
              <Button onClick={goCheckout} className="w-full bg-green-700 hover:bg-green-800 h-11">Checkout with M-Pesa</Button>
              <Button onClick={() => { setCartOpen(false); navigate('/shop'); }} variant="outline" className="w-full">Continue Shopping</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
