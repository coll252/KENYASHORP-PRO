import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Home, MapPin, Phone, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatKsh } from '@/data/products';
import { cn } from '@/lib/utils';

const stages = [
  { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Home },
];

const OrderTracking: React.FC = () => {
  const [params] = useSearchParams();
  const initialOrder = params.get('order') || '';
  const [orderId, setOrderId] = useState(initialOrder);
  const [order, setOrder] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (initialOrder) {
      const last = JSON.parse(localStorage.getItem('ks_last_order') || 'null');
      if (last && last.orderId === initialOrder) {
        setOrder(last);
        setCurrentStage(last.gateway === 'cod' ? 1 : 2);
      }
    }
  }, [initialOrder]);

  const lookup = () => {
    const last = JSON.parse(localStorage.getItem('ks_last_order') || 'null');
    if (last && last.orderId === orderId) { setOrder(last); setCurrentStage(2); }
    else alert('Order not found');
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-slate-500 mb-6">Enter your order number to see live status</p>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <Input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="KS12345678" className="text-lg font-mono" />
            <Button onClick={lookup} className="bg-green-700">Track</Button>
          </div>
          <p className="text-xs text-slate-500 mt-3">💡 Tip: Place an order first to test tracking. Order numbers are sent via SMS and email after checkout.</p>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-green-100">Order #{order.orderId}</p>
            <h1 className="text-3xl font-bold mt-1">Asante! Your order is on the way 🎉</h1>
            <p className="text-green-100 mt-1">Estimated delivery: 24-48 hours</p>
          </div>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2"><Download className="w-4 h-4" /> Invoice PDF</Button>
        </div>
      </div>

      {/* Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="font-bold mb-6">Delivery Status</h2>
        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-1 bg-slate-200 rounded">
            <div className="h-full bg-green-600 rounded transition-all duration-500" style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }} />
          </div>
          <div className="relative grid grid-cols-4 gap-2">
            {stages.map((s, i) => {
              const Icon = s.icon;
              const done = i <= currentStage;
              return (
                <div key={s.id} className="text-center">
                  <div className={cn("w-11 h-11 mx-auto rounded-full grid place-items-center border-4 transition", done ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-200 text-slate-400")}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={cn("text-xs mt-2 font-medium", done ? "text-slate-900 dark:text-white" : "text-slate-400")}>{s.label}</div>
                  {i === currentStage && <div className="text-[10px] text-green-700 mt-0.5 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> In progress</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Items */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="font-bold mb-4">Items ({order.items.length})</h2>
          <div className="space-y-3">
            {order.items.map((i: any) => (
              <div key={i.id} className="flex gap-3">
                <img src={i.image} className="w-14 h-14 rounded object-cover bg-slate-50" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-2">{i.name}</div>
                  <div className="text-xs text-slate-500">Qty {i.quantity}</div>
                </div>
                <div className="text-sm font-semibold">{formatKsh(i.price * i.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatKsh(subtotal)}</span></div>
            <div className="flex justify-between text-base font-bold pt-1"><span>Total Paid</span><span className="text-green-700">{formatKsh(order.total)}</span></div>
            <div className="text-xs text-slate-500 mt-2">Paid via <span className="font-medium uppercase">{order.gateway}</span> · {order.status}</div>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-700" /> Delivery Details</h2>
          <div className="text-sm space-y-1 mb-4">
            <div className="font-medium">{order.address.name}</div>
            <div className="text-slate-600">{order.address.phone}</div>
            <div className="text-slate-600">{order.address.address}</div>
            <div className="text-slate-600">{order.address.area}, {order.address.city}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center"><Truck className="w-5 h-5 text-blue-600" /></div>
            <div className="flex-1">
              <div className="text-sm font-medium">Rider: Brian Otieno</div>
              <div className="text-xs text-slate-500">Boda Express · 4.9 ★</div>
            </div>
            <Button size="sm" variant="outline" className="gap-1"><Phone className="w-3 h-3" /> Call</Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to="/shop"><Button variant="outline">Continue Shopping</Button></Link>
        <Link to="/dashboard"><Button className="bg-green-700">My Orders</Button></Link>
      </div>
    </div>
  );
};

export default OrderTracking;
