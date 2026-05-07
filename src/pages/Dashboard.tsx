import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, DollarSign, Package, TrendingUp, Truck, Users, Store, Shield, AlertCircle, CheckCircle2, Clock, MapPin, Phone, Star, Settings } from 'lucide-react';
import { products, formatKsh } from '@/data/products';

const StatCard: React.FC<{ icon: any, label: string, value: string, change?: string, color: string }> = ({ icon: Icon, label, value, change, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg ${color} grid place-items-center`}><Icon className="w-5 h-5 text-white" /></div>
      {change && <span className="text-xs font-medium text-green-600">{change}</span>}
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    <div className="text-xs text-slate-500 mt-0.5">{label}</div>
  </div>
);

const Chart: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className={`w-full rounded-t ${color}`} style={{ height: `${(v / max) * 100}%` }} />
          <span className="text-[10px] text-slate-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
        </div>
      ))}
    </div>
  );
};

// =================== CUSTOMER DASHBOARD ===================
const CustomerDash: React.FC = () => {
  const orders = [
    { id: 'KS00012345', date: '2026-05-04', total: 28499, status: 'Delivered', items: 3 },
    { id: 'KS00012203', date: '2026-04-28', total: 4999, status: 'Shipped', items: 1 },
    { id: 'KS00011998', date: '2026-04-15', total: 12450, status: 'Delivered', items: 2 },
    { id: 'KS00011567', date: '2026-03-30', total: 1899, status: 'Delivered', items: 1 },
  ];
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShoppingBag} label="Total Orders" value="24" change="+3 this month" color="bg-green-600" />
        <StatCard icon={Package} label="In Transit" value="2" color="bg-orange-500" />
        <StatCard icon={DollarSign} label="Total Spent" value={formatKsh(184500)} color="bg-blue-600" />
        <StatCard icon={Star} label="Reward Points" value="2,340" color="bg-purple-600" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b"><h2 className="font-bold">Recent Orders</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-500"><tr>
            <th className="text-left p-3">Order #</th><th className="text-left p-3">Date</th><th className="text-left p-3">Items</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th><th></th>
          </tr></thead>
          <tbody>{orders.map(o => (
            <tr key={o.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <td className="p-3 font-mono">{o.id}</td><td className="p-3">{o.date}</td><td className="p-3">{o.items}</td>
              <td className="p-3 font-semibold">{formatKsh(o.total)}</td>
              <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span></td>
              <td className="p-3"><Button size="sm" variant="ghost">View</Button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
};

// =================== VENDOR DASHBOARD ===================
const VendorDash: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Sales (this month)" value={formatKsh(184500)} change="+24%" color="bg-green-600" />
        <StatCard icon={Package} label="Active Products" value="42" color="bg-blue-600" />
        <StatCard icon={ShoppingBag} label="Orders Pending" value="7" color="bg-orange-500" />
        <StatCard icon={TrendingUp} label="Settlement Balance" value={formatKsh(67200)} color="bg-purple-600" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 lg:col-span-2">
          <h3 className="font-bold mb-4">Sales This Week</h3>
          <Chart data={[12, 19, 15, 22, 18, 27, 31]} color="bg-green-600" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full justify-start bg-green-700">+ Add Product</Button>
            <Button variant="outline" className="w-full justify-start">Manage Inventory</Button>
            <Button variant="outline" className="w-full justify-start">Request M-Pesa Payout</Button>
            <Button variant="outline" className="w-full justify-start">Download Sales Report</Button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center"><h2 className="font-bold">My Products</h2><Button size="sm" className="bg-green-700">+ New Product</Button></div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-500"><tr>
            <th className="text-left p-3">Product</th><th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Sold</th><th></th>
          </tr></thead>
          <tbody>{products.slice(0, 5).map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-3 flex items-center gap-2"><img src={p.image} className="w-10 h-10 rounded object-cover" alt="" /><span className="line-clamp-1">{p.name}</span></td>
              <td className="p-3 font-semibold">{formatKsh(p.price)}</td>
              <td className="p-3">{p.stock}</td><td className="p-3">{p.reviews}</td>
              <td className="p-3"><Button size="sm" variant="ghost">Edit</Button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
};

// =================== RIDER DASHBOARD ===================
const RiderDash: React.FC = () => {
  const deliveries = [
    { id: 'KS00012345', customer: 'Wanjiku M.', area: 'Westlands', items: 3, status: 'pickup' },
    { id: 'KS00012346', customer: 'Otieno K.', area: 'Karen', items: 1, status: 'transit' },
    { id: 'KS00012347', customer: 'Achieng N.', area: 'Kilimani', items: 2, status: 'pickup' },
  ];
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Truck} label="Active Deliveries" value="3" color="bg-blue-600" />
        <StatCard icon={CheckCircle2} label="Completed Today" value="12" color="bg-green-600" />
        <StatCard icon={DollarSign} label="Earnings Today" value={formatKsh(2400)} color="bg-orange-500" />
        <StatCard icon={Star} label="Rating" value="4.9 ★" color="bg-yellow-500" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b"><h2 className="font-bold">Assigned Deliveries</h2></div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {deliveries.map(d => (
            <div key={d.id} className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full grid place-items-center ${d.status === 'transit' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                <Truck className={`w-5 h-5 ${d.status === 'transit' ? 'text-orange-600' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{d.customer} <span className="text-slate-400 text-xs ml-1">#{d.id}</span></div>
                <div className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="w-3 h-3" /> {d.area} · {d.items} items</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1"><Phone className="w-3 h-3" /></Button>
                <Button size="sm" className="bg-green-700">{d.status === 'pickup' ? 'Pick Up' : 'Mark Delivered'}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// =================== ADMIN DASHBOARD ===================
const AdminDash: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Platform Revenue" value={formatKsh(2840000)} change="+18%" color="bg-green-600" />
        <StatCard icon={ShoppingBag} label="Orders Today" value="247" change="+12" color="bg-blue-600" />
        <StatCard icon={Users} label="Total Customers" value="12,450" change="+340" color="bg-purple-600" />
        <StatCard icon={Store} label="Active Vendors" value="287" change="+5" color="bg-orange-500" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-4">Revenue (last 7 days)</h3>
          <Chart data={[180, 240, 210, 290, 260, 340, 380]} color="bg-green-600" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-4">Pending Actions</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-600" /> Vendor approvals</span>
              <span className="font-bold text-orange-600">8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600" /> Refund requests</span>
              <span className="font-bold text-red-600">3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> Orders awaiting rider</span>
              <span className="font-bold text-blue-600">14</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-yellow-600" /> Failed M-Pesa callbacks</span>
              <span className="font-bold text-yellow-600">2</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold mb-3">Quick Admin Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="outline" className="justify-start"><Users className="w-4 h-4 mr-2" /> Users</Button>
          <Button variant="outline" className="justify-start"><Store className="w-4 h-4 mr-2" /> Vendors</Button>
          <Button variant="outline" className="justify-start"><Package className="w-4 h-4 mr-2" /> Products</Button>
          <Button variant="outline" className="justify-start"><Truck className="w-4 h-4 mr-2" /> Riders</Button>
          <Button variant="outline" className="justify-start"><DollarSign className="w-4 h-4 mr-2" /> Payments</Button>
          <Button variant="outline" className="justify-start"><Shield className="w-4 h-4 mr-2" /> Fraud Monitor</Button>
          <Button variant="outline" className="justify-start"><Settings className="w-4 h-4 mr-2" /> Coupons</Button>
          <Button variant="outline" className="justify-start">Export CSV</Button>
        </div>
      </div>
    </>
  );
};

const Dashboard: React.FC = () => {
  const { user, setAuthOpen, setAuthRole } = useShop();
  const [params] = useSearchParams();
  const requestedRole = params.get('role') as any;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Sign in to view dashboard</h1>
        <p className="text-slate-500 mb-6">Choose your account type to continue</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { role: 'customer', label: 'Customer', color: 'bg-green-700' },
            { role: 'vendor', label: 'Vendor', color: 'bg-orange-600' },
            { role: 'rider', label: 'Rider', color: 'bg-blue-600' },
            { role: 'admin', label: 'Admin', color: 'bg-slate-800' },
          ].map(r => (
            <Button key={r.role} onClick={() => { setAuthRole(r.role as any); setAuthOpen(true); }} className={r.color}>
              {r.label} Login
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const role = requestedRole || user.role;
  const showTabs = user.role === 'admin' || user.role === 'superadmin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Karibu, {user.name}!</h1>
          <p className="text-slate-500 capitalize">{role} dashboard · KenyaShop Pro</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Settings</Button>
          <Button className="bg-green-700">Help</Button>
        </div>
      </div>

      {showTabs ? (
        <Tabs defaultValue="admin">
          <TabsList>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="vendor">Vendor View</TabsTrigger>
            <TabsTrigger value="customer">Customer View</TabsTrigger>
            <TabsTrigger value="rider">Rider View</TabsTrigger>
          </TabsList>
          <TabsContent value="admin" className="mt-4"><AdminDash /></TabsContent>
          <TabsContent value="vendor" className="mt-4"><VendorDash /></TabsContent>
          <TabsContent value="customer" className="mt-4"><CustomerDash /></TabsContent>
          <TabsContent value="rider" className="mt-4"><RiderDash /></TabsContent>
        </Tabs>
      ) : (
        <>
          {role === 'customer' && <CustomerDash />}
          {role === 'vendor' && <VendorDash />}
          {role === 'rider' && <RiderDash />}
          {role === 'admin' && <AdminDash />}
        </>
      )}
    </div>
  );
};

export default Dashboard;
