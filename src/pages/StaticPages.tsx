import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, MessageCircle, Search, ChevronDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const policyContent: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: 'Terms & Conditions',
    body: [
      'Welcome to KenyaShop Pro. By accessing our platform you agree to be bound by these terms.',
      '1. Account: You must be 18+ and a Kenyan resident to register. Provide accurate information including a valid Safaricom or Airtel phone number.',
      '2. Orders: All prices are in Kenyan Shillings (KSh) and include 16% VAT where applicable. We reserve the right to refuse or cancel orders at our discretion.',
      '3. Payments: Payments via M-Pesa Daraja, Airtel Money, Pesapal, Flutterwave, Paystack, IntaSend, DPO, iPay, Jenga, KCB Buni, bank transfer, or cash on delivery. All payments are verified through gateway callbacks before order confirmation.',
      '4. Vendors: Sellers warrant they have legal right to sell listed products and that listings are accurate. Commission is 8% on each successful sale.',
      '5. Liability: KenyaShop Pro acts as a marketplace and is not liable for vendor-supplied product defects beyond the 7-day return window.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We respect your privacy and comply with the Data Protection Act, 2019 (Kenya).',
      'Data we collect: name, email, phone, delivery address, payment details (tokenised — never stored in plaintext), order history, device information.',
      'How we use it: to fulfil orders, process payments via M-Pesa Daraja and other gateways, send delivery updates via SMS/email, prevent fraud, and improve our service.',
      'Sharing: with vendors (delivery info only), riders (contact details for delivery), payment processors, and law enforcement when legally required.',
      'Your rights: access, correct, or delete your data at any time by contacting privacy@kenyashop.co.ke.',
      'Cookies: we use essential and analytics cookies. You can control these in your browser settings.',
    ],
  },
  refund: {
    title: 'Refund Policy',
    body: [
      'KenyaShop Pro offers a 7-day return window for most products from the date of delivery.',
      'Eligible: damaged on arrival, wrong item delivered, expired (groceries), counterfeit, or significantly different from listing.',
      'Not eligible: opened cosmetics/perfumes, perishables consumed, intimate apparel, custom-made items, digital downloads.',
      'Refund process: open a request from your dashboard → upload photos → admin review (24-48h) → refund via original payment method (M-Pesa B2C, card reversal, or bank transfer) within 3-7 business days.',
      'Partial refunds may apply for products returned in non-original condition.',
      'Cash on delivery refunds are sent via M-Pesa to the phone number used at checkout.',
    ],
  },
};

export const PolicyPage: React.FC = () => {
  const { type } = useParams();
  const policy = policyContent[type || 'terms'] || policyContent.terms;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{policy.title}</h1>
      <p className="text-slate-500 text-sm mb-8">Last updated: January 2026 · KenyaShop Pro Ltd</p>
      <div className="prose prose-slate max-w-none">
        {policy.body.map((p, i) => <p key={i} className="text-slate-700 leading-relaxed mb-4">{p}</p>)}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('https://famous.ai/api/crm/69fbb62b6a319bdf2d4c3d4b/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name, source: 'contact-form', tags: ['contact', 'inquiry'] })
      });
      toast({ title: 'Message sent!', description: "We'll respond within 2 hours during business hours." });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {}
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Get in Touch</h1>
        <p className="text-slate-500">We're here to help. Karibu sana!</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { icon: Phone, label: 'Phone Support', value: '+254 700 000 000', sub: 'Mon-Sat 8am - 8pm' },
            { icon: Mail, label: 'Email', value: 'support@kenyashop.co.ke', sub: 'We reply in 2 hours' },
            { icon: MessageCircle, label: 'WhatsApp', value: '+254 700 000 001', sub: '24/7 chat support' },
            { icon: MapPin, label: 'Office', value: 'Westlands Square, 5th Floor', sub: 'Nairobi, Kenya' },
          ].map((c, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 grid place-items-center"><c.icon className="w-6 h-6 text-green-700" /></div>
              <div>
                <div className="text-xs text-slate-500">{c.label}</div>
                <div className="font-semibold">{c.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-lg">Send us a message</h3>
          <Input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Textarea placeholder="How can we help you?" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
          <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800">{loading ? 'Sending...' : 'Send Message'}</Button>
        </form>
      </div>
    </div>
  );
};

const faqs = [
  { q: 'How does M-Pesa payment work on KenyaShop?', a: 'After choosing M-Pesa at checkout, you receive an STK Push prompt on your phone. Enter your M-Pesa PIN and the payment is verified via Safaricom Daraja API callback before your order is confirmed.' },
  { q: 'How long does delivery take?', a: 'Same-day in Nairobi (orders before 1pm), 1-2 days for major towns (Mombasa, Kisumu, Nakuru, Eldoret), 2-4 days for other counties.' },
  { q: 'Can I pay cash on delivery?', a: 'Yes! Cash on delivery is available in 47 counties for orders under KSh 30,000.' },
  { q: 'What payment methods do you accept?', a: 'M-Pesa Daraja, Airtel Money, Pesapal, Flutterwave, Paystack, IntaSend, DPO Pay, iPay Africa, Jenga (Equity), KCB Buni, bank transfer, and cash on delivery.' },
  { q: 'How do I become a vendor?', a: 'Click "Sell on KenyaShop" in the top bar, complete vendor registration, upload your business documents, and our team will approve within 24 hours.' },
  { q: 'How do refunds work?', a: 'Open a refund request from your dashboard within 7 days of delivery. Approved refunds go back via M-Pesa B2C, card reversal, or bank transfer in 3-7 business days.' },
];

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Help Center</h1>
        <p className="text-slate-500">Find answers to common questions</p>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search help articles..." className="pl-11 h-12 text-base" />
      </div>
      <div className="space-y-2">
        {filtered.map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <span className="font-medium">{f.q}</span>
              <ChevronDown className={`w-4 h-4 transition ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
