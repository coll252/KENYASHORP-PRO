import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useShop } from '@/contexts/ShopContext';
import { Mail, Phone, Shield, Truck, Store, UserCog } from 'lucide-react';

const roleConfig = {
  customer: { label: 'Customer', icon: null, color: 'bg-green-700' },
  vendor: { label: 'Vendor', icon: Store, color: 'bg-orange-600' },
  rider: { label: 'Rider', icon: Truck, color: 'bg-blue-600' },
  admin: { label: 'Admin', icon: Shield, color: 'bg-slate-800' },
  superadmin: { label: 'Super Admin', icon: UserCog, color: 'bg-red-700' },
};

const AuthModal: React.FC = () => {
  const { authOpen, setAuthOpen, authMode, setAuthMode, authRole, login } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const navigate = useNavigate();

  const cfg = roleConfig[authRole];
  const Icon = cfg.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register' && step === 'form' && phone) {
      // Subscribe to CRM
      try {
        await fetch('https://famous.ai/api/crm/69fbb62b6a319bdf2d4c3d4b/subscribe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, source: `register-${authRole}`, tags: [authRole, 'registration'] })
        });
      } catch {}
      setStep('otp');
      return;
    }
    if (step === 'otp' && otp.length !== 6) return;
    const display = name || email.split('@')[0] || 'User';
    login({ email: email || `${authRole}@kenyashop.co.ke`, name: display, phone, role: authRole });
    setAuthOpen(false);
    setStep('form');
    if (authRole !== 'customer') navigate('/dashboard');
  };

  const switchMode = () => setAuthMode(authMode === 'login' ? 'register' : 'login');

  const quickLogin = () => {
    login({ email: `demo-${authRole}@kenyashop.co.ke`, name: `Demo ${cfg.label}`, role: authRole });
    setAuthOpen(false);
    if (authRole !== 'customer') navigate('/dashboard');
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className={`w-12 h-12 rounded-xl ${cfg.color} text-white grid place-items-center mb-2`}>
            {Icon ? <Icon className="w-6 h-6" /> : <span className="font-black text-xl">K</span>}
          </div>
          <DialogTitle className="text-2xl">
            {step === 'otp' ? 'Verify your phone' : authMode === 'login' ? `${cfg.label} Sign In` : `Create ${cfg.label} Account`}
          </DialogTitle>
          <DialogDescription>
            {step === 'otp' ? `We sent a 6-digit OTP to ${phone}` :
             authMode === 'login' ? 'Welcome back to KenyaShop Pro' : 'Karibu! Join thousands of Kenyans shopping smart'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {step === 'otp' ? (
            <>
              <Label>Enter OTP code</Label>
              <Input value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} className="text-center text-2xl tracking-[0.5em] font-bold" />
              <p className="text-xs text-slate-500 text-center">Demo: enter any 6 digits</p>
            </>
          ) : (
            <>
              {authMode === 'register' && (
                <div>
                  <Label>Full Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Jomo Kenyatta" required />
                </div>
              )}
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" required />
                </div>
              </div>
              {authMode === 'register' && (
                <div>
                  <Label>Phone (Safaricom/Airtel)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678" className="pl-10" required />
                  </div>
                </div>
              )}
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </>
          )}

          <Button type="submit" className={`w-full ${cfg.color} hover:opacity-90`}>
            {step === 'otp' ? 'Verify & Continue' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>

          {step === 'form' && authRole === 'customer' && (
            <>
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-500">or continue with</span></div>
              </div>
              <Button type="button" onClick={quickLogin} variant="outline" className="w-full gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Quick Demo Login
              </Button>
            </>
          )}

          {step === 'form' && (
            <p className="text-center text-sm text-slate-600">
              {authMode === 'login' ? "Don't have an account? " : 'Already a member? '}
              <button type="button" onClick={switchMode} className="text-green-700 font-medium hover:underline">
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
