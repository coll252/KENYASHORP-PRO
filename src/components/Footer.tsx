import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('https://famous.ai/api/crm/69fbb62b6a319bdf2d4c3d4b/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer-signup', tags: ['newsletter', 'kenyashop'] })
      });
      toast({ title: 'Asante sana!', description: 'You are subscribed to KenyaShop Pro deals.' });
      setEmail('');
    } catch {
      toast({ title: 'Subscription failed', description: 'Please try again later.', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="text-2xl font-bold">Get exclusive deals & flash-sale alerts</h3>
            <p className="text-green-100 text-sm mt-1">Join 50,000+ Kenyans saving with KenyaShop Pro</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full md:w-auto gap-2 max-w-md">
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="bg-white text-slate-900 border-0" />
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">{loading ? '...' : 'Subscribe'}</Button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 grid place-items-center text-white font-black">K</div>
            <div className="font-black text-white text-lg">KenyaShop <span className="text-orange-400">Pro</span></div>
          </div>
          <p className="text-sm text-slate-400 mb-4 max-w-sm">Kenya's all-in-one marketplace. Pay with M-Pesa, Airtel Money, Pesapal, or cash on delivery — countrywide shipping in 24–48 hours.</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500" /> Westlands, Nairobi, Kenya</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-500" /> +254 700 000 000</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-green-500" /> support@kenyashop.co.ke</div>
          </div>
          <div className="flex gap-3 mt-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-green-700 grid place-items-center transition"><Icon className="w-4 h-4" /></a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
            <li><Link to="/shop?flash=1" className="hover:text-white">Flash Sales</Link></li>
            <li><Link to="/shop?cat=electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link to="/shop?cat=fashion" className="hover:text-white">Fashion</Link></li>
            <li><Link to="/shop?cat=food" className="hover:text-white">Groceries</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-white">My Account</Link></li>
            <li><Link to="/track" className="hover:text-white">Track Order</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
            <li><Link to="/dashboard?role=vendor" className="hover:text-white">Vendor Portal</Link></li>
            <li><Link to="/dashboard?role=rider" className="hover:text-white">Rider Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/policy/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/policy/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/policy/refund" className="hover:text-white">Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Payment badges */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <span className="text-xs text-slate-500 mr-2">We accept:</span>
            {['M-Pesa', 'Airtel Money', 'Pesapal', 'Flutterwave', 'Paystack', 'Visa/Mastercard', 'COD'].map(p => (
              <span key={p} className="px-3 py-1.5 bg-slate-800 rounded text-xs font-medium">{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-green-500" /> SSL secured · PCI-DSS compliant
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} KenyaShop Pro Ltd. All rights reserved. Hapa ndipo!
        </div>
      </div>
    </footer>
  );
};

export default Footer;
