import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Tag, CheckCircle2, Smartphone, Banknote, Building2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/contexts/ShopContext';
import { formatKsh } from '@/data/products';
import MpesaModal from '@/components/MpesaModal';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const paymentGateways = [
  { id: 'mpesa', name: 'M-Pesa STK Push', desc: 'Daraja API · Most popular', icon: '💚', primary: true, badge: 'Recommended' },
  { id: 'airtel', name: 'Airtel Money', desc: 'Pay with your Airtel line', icon: '🔴' },
  { id: 'pesapal', name: 'Pesapal', desc: 'Card / mobile money', icon: '🅿️' },
  { id: 'flutterwave', name: 'Flutterwave', desc: 'Cards, USSD, banks', icon: '🌊' },
  { id: 'paystack', name: 'Paystack', desc: 'Visa, Mastercard', icon: '💳' },
  { id: 'intasend', name: 'IntaSend', desc: 'Crypto + cards', icon: '⚡' },
  { id: 'dpo', name: 'DPO Pay', desc: 'Pan-African gateway', icon: '🌍' },
  { id: 'ipay', name: 'iPay Africa', desc: 'East Africa', icon: '💱' },
  { id: 'jenga', name: 'Jenga (Equity)', desc: 'Equity Bank gateway', icon: '🏦' },
  { id: 'kcb', name: 'KCB Buni', desc: 'KCB Bank API', icon: '🏛️' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Manual EFT/RTGS', icon: '🏤' },
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay rider on delivery', icon: '💵' },
];

const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Kiambu', 'Kakamega', 'Meru'];

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart, user } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [selectedGateway, setSelectedGateway] = useState('mpesa');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [mpesaOpen, setMpesaOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string>('');

  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', email: user?.email || '',
    address: '', city: 'Nairobi', area: '', notes: ''
  });

  const subtotal = cartTotal;
  const deliveryFee = form.city === 'Nairobi' ? (subtotal >= 3000 ? 0 : 200) : (subtotal >= 5000 ? 0 : 500);
  const tax = Math.round(subtotal * 0.16); // 16% VAT
  const total = subtotal + deliveryFee + tax - discount;

  const applyCoupon = () => {
    const codes: Record<string, number> = { 'KARIBU10': Math.round(subtotal * 0.1), 'JAMBO500': 500, 'KENYA20': Math.round(subtotal * 0.2) };
    if (codes[coupon.toUpperCase()]) {
      setDiscount(codes[coupon.toUpperCase()]);
      setCouponApplied(coupon.toUpperCase());
      toast({ title: 'Coupon applied!', description: `You saved ${formatKsh(codes[coupon.toUpperCase()])}` });
    } else {
      toast({ title: 'Invalid coupon', description: 'Try KARIBU10, JAMBO500 or KENYA20', variant: 'destructive' });
    }
  };

  const handlePay = () => {
    if (!form.name || !form.phone || !form.address) {
      toast({ title: 'Missing info', description: 'Please fill all delivery details', variant: 'destructive' });
      setStep('address'); return;
    }
    const newOrderId = 'KS' + Date.now().toString().slice(-8);
    if (selectedGateway === 'mpesa') {
      setPendingOrderId(newOrderId);
      setMpesaOpen(true);
    } else if (selectedGateway === 'cod') {
      toast({ title: 'Order placed!', description: 'Pay the rider on delivery.' });
      localStorage.setItem('ks_last_order', JSON.stringify({ orderId: newOrderId, total, items: cart, address: form, gateway: 'cod', status: 'confirmed' }));
      clearCart();
      navigate(`/track?order=${newOrderId}`);
    } else {
      toast({ title: `${paymentGateways.find(g => g.id === selectedGateway)?.name} integration pending`, description: 'Demo flow — order will be marked as paid' });
      setTimeout(() => {
        localStorage.setItem('ks_last_order', JSON.stringify({ orderId: newOrderId, total, items: cart, address: form, gateway: selectedGateway, status: 'paid' }));
        clearCart();
        navigate(`/track?order=${newOrderId}`);
      }, 1500);
    }
  };

  const onMpesaSuccess = (receipt: { mpesaReceiptNumber?: string; reference?: string; checkoutRequestId?: string }) => {
    const orderId = pendingOrderId || ('KS' + Date.now().toString().slice(-8));
    localStorage.setItem('ks_last_order', JSON.stringify({
      orderId, total, items: cart, address: form,
      gateway: 'mpesa', status: 'paid',
      mpesaReceipt: receipt.mpesaReceiptNumber,
      reference: receipt.reference,
      checkoutRequestId: receipt.checkoutRequestId,
    }));
    clearCart();
    setMpesaOpen(false);
    navigate(`/track?order=${orderId}`);
  };

  if (cart.length === 0 && !mpesaOpen) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Add some products before checking out</p>
        <Link to="/shop"><Button className="bg-green-700">Browse Products</Button></Link>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-green-700 mb-4"><ArrowLeft className="w-4 h-4" /> Continue shopping</Link>

      <h1 className="text-3xl font-bold mb-1">Checkout</h1>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <span className={step === 'address' ? 'text-green-700 font-medium' : ''}>1. Delivery</span> →
        <span className={step === 'payment' ? 'text-green-700 font-medium' : ''}>2. Payment</span> →
        <span>3. Confirmation</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          {/* Address */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-700" /> Delivery Address</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Full Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jomo Kenyatta" /></div>
              <div><Label>Phone (M-Pesa) *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" /></div>
              <div className="md:col-span-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
              <div className="md:col-span-2"><Label>Street Address *</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Moi Avenue, Apt 4B" /></div>
              <div>
                <Label>County</Label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                  {counties.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><Label>Area / Estate</Label><Input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="Westlands" /></div>
              <div className="md:col-span-2"><Label>Order Notes (optional)</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Gate code, landmark, special instructions..." rows={2} /></div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-green-700" /> Payment Method</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {paymentGateways.map(g => (
                <button key={g.id} onClick={() => setSelectedGateway(g.id)} className={cn(
                  "flex items-center gap-3 p-3 border-2 rounded-lg text-left transition relative",
                  selectedGateway === g.id ? "border-green-600 bg-green-50 dark:bg-green-900/20" : "border-slate-200 hover:border-slate-300"
                )}>
                  <span className="text-2xl">{g.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {g.name}
                      {g.badge && <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">{g.badge}</span>}
                    </div>
                    <div className="text-xs text-slate-500">{g.desc}</div>
                  </div>
                  {selectedGateway === g.id && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />}
                </button>
              ))}
            </div>

            {selectedGateway === 'mpesa' && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4 flex gap-3">
                <Smartphone className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-green-800">How M-Pesa STK Push works:</p>
                  <ol className="list-decimal ml-5 mt-1 text-slate-700 space-y-0.5">
                    <li>Click "Pay {formatKsh(total)}" below</li>
                    <li>You'll receive an M-Pesa prompt on {form.phone || 'your phone'}</li>
                    <li>Enter your M-Pesa PIN to authorize</li>
                    <li>We'll confirm payment via Daraja callback</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map(i => (
                <div key={i.id} className="flex gap-3">
                  <img src={i.image} className="w-12 h-12 rounded object-cover bg-slate-50" alt="" />
                  <div className="flex-1 text-sm min-w-0">
                    <div className="font-medium line-clamp-1">{i.name}</div>
                    <div className="text-xs text-slate-500">Qty {i.quantity} × {formatKsh(i.price)}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatKsh(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-3">
              <div className="flex gap-2 mb-2">
                <Input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="text-sm h-9" />
                <Button onClick={applyCoupon} variant="outline" size="sm" className="gap-1"><Tag className="w-3 h-3" /> Apply</Button>
              </div>
              {couponApplied && <div className="text-xs text-green-700">✓ {couponApplied} applied — saved {formatKsh(discount)}</div>}
              <div className="text-xs text-slate-500 mt-1">Try: KARIBU10, JAMBO500, KENYA20</div>
            </div>

            <div className="border-t pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span>{formatKsh(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">VAT (16%)</span><span>{formatKsh(tax)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Delivery</span><span className={deliveryFee === 0 ? 'text-green-700 font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : formatKsh(deliveryFee)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatKsh(discount)}</span></div>}
              <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total</span><span className="text-green-700">{formatKsh(total)}</span></div>
            </div>

            <Button onClick={handlePay} className="w-full mt-4 h-12 bg-green-700 hover:bg-green-800 text-base">
              {selectedGateway === 'mpesa' && <><Smartphone className="w-4 h-4 mr-2" /> Pay {formatKsh(total)} with M-Pesa</>}
              {selectedGateway === 'cod' && <><Banknote className="w-4 h-4 mr-2" /> Place Order ({formatKsh(total)})</>}
              {selectedGateway !== 'mpesa' && selectedGateway !== 'cod' && <>Pay {formatKsh(total)}</>}
            </Button>
            <p className="text-xs text-slate-500 text-center mt-2">🔒 Secure payment · SSL encrypted</p>
          </div>
        </aside>
      </div>

      <MpesaModal
        open={mpesaOpen}
        onClose={() => setMpesaOpen(false)}
        amount={total}
        phone={form.phone}
        email={form.email}
        customerName={form.name}
        orderId={pendingOrderId}
        onSuccess={onMpesaSuccess}
      />

    </div>
  );
};

export default Checkout;
