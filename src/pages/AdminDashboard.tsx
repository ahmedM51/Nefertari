import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, TrendingUp, Users, Calendar, ShoppingBag, DollarSign, Plus, Edit2, Trash2, Eye, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats, Monument, Tour, Product, Booking, Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  
  // Tab control
  const [adminTab, setAdminTab] = useState<'analytics' | 'monuments' | 'tours' | 'products' | 'bookings' | 'orders'>('analytics');

  // Loading States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [monForm, setMonForm] = useState<Partial<Monument>>({ name: '', description: '', image_urls: [''], location_coords: '', governorate: 'Giza', category: 'historical', opening_hours: '08:00 - 17:00', ticket_prices: { foreign: 200, local: 30 } });
  const [tourForm, setTourForm] = useState<Partial<Tour>>({ title: '', description: '', duration_days: 1, price: 50, city: 'Luxor', image_urls: [''], slots_available: 10, itinerary: [{ day: 1, title: 'Arrival', description: 'Arrive at destination' }] });
  const [prodForm, setProdForm] = useState<Partial<Product>>({ name: '', description: '', price: 20, category: 'statues', image_urls: [''], stock: 5 });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardDetails();
  }, [adminTab]);

  const fetchDashboardDetails = async () => {
    setIsLoading(true);
    setFormMsg(null);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      if (adminTab === 'analytics') {
        const statsRes = await fetch('/api/admin/dashboard', { headers });
        const usersRes = await fetch('/api/admin/users', { headers });
        if (statsRes.ok && usersRes.ok) {
          setStats(await statsRes.json());
          setUsers(await usersRes.json());
        }
      } else if (adminTab === 'monuments') {
        const res = await fetch('/api/monuments');
        if (res.ok) setMonuments(await res.json());
      } else if (adminTab === 'tours') {
        const res = await fetch('/api/tours');
        if (res.ok) setTours(await res.json());
      } else if (adminTab === 'products') {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
      } else if (adminTab === 'bookings') {
        const res = await fetch('/api/admin/bookings', { headers });
        if (res.ok) setBookings(await res.json());
      } else if (adminTab === 'orders') {
        const res = await fetch('/api/admin/orders', { headers });
        if (res.ok) setOrders(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // ACTION BUTTONS (BOOKINGS & ORDERS STATUSES UPDATER)
  // ==========================================================
  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchDashboardDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchDashboardDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================================
  // DATABASE MONUMENT WRITERS (CRUD)
  // ==========================================================
  const handleMonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `/api/admin/monuments/${editingId}` : '/api/admin/monuments';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(monForm)
      });
      if (res.ok) {
        setFormMsg(`Monument ${editingId ? 'updated' : 'created'} successfully!`);
        setEditingId(null);
        setMonForm({ name: '', description: '', image_urls: [''], location_coords: '', governorate: 'Giza', category: 'historical', opening_hours: '08:00 - 17:00', ticket_prices: { foreign: 200, local: 30 } });
        fetchDashboardDetails();
      }
    } catch (err: any) { setFormMsg(err.message); }
  };

  const deleteMonument = async (id: string) => {
    if(!confirm("Erase this monument archive?")) return;
    try {
      const res = await fetch(`/api/admin/monuments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboardDetails();
      }
    } catch (e) { console.error(e); }
  };

  // ==========================================================
  // DATABASE TOUR WRITERS (CRUD)
  // ==========================================================
  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `/api/admin/tours/${editingId}` : '/api/admin/tours';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(tourForm)
      });
      if (res.ok) {
        setFormMsg(`Tour package ${editingId ? 'updated' : 'created'} successfully!`);
        setEditingId(null);
        setTourForm({ title: '', description: '', duration_days: 1, price: 50, city: 'Luxor', image_urls: [''], slots_available: 10, itinerary: [{ day: 1, title: 'Arrival', description: 'Arrive at destination' }] });
        fetchDashboardDetails();
      }
    } catch (err: any) { setFormMsg(err.message); }
  };

  const deleteTour = async (id: string) => {
    if(!confirm("Erase this tour package?")) return;
    try {
      const res = await fetch(`/api/admin/tours/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboardDetails();
      }
    } catch (e) { console.error(e); }
  };

  // ==========================================================
  // DATABASE PRODUCTS WRITERS (CRUD)
  // ==========================================================
  const handleProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(prodForm)
      });
      if (res.ok) {
        setFormMsg(`Relic product ${editingId ? 'updated' : 'created'} successfully!`);
        setEditingId(null);
        setProdForm({ name: '', description: '', price: 20, category: 'statues', image_urls: [''], stock: 5 });
        fetchDashboardDetails();
      }
    } catch (err: any) { setFormMsg(err.message); }
  };

  const deleteProduct = async (id: string) => {
    if(!confirm("Erase this craft product of the Bazaar?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboardDetails();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div id="admin-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-300 font-sans">
      
      {/* Title */}
      <div className="space-y-4 mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-wider font-mono uppercase">
          <Shield size={12} />
          <span>Restricted Admin Bureau Console</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
          Nefertari Heritage CMS
        </h1>
      </div>

      {/* Tabs Menu Controls */}
      <div className="flex flex-wrap gap-2 mb-8 select-none border-b border-[#D4AF37]/20 pb-3 text-xs sm:text-sm font-semibold">
        {(['analytics', 'monuments', 'tours', 'products', 'bookings', 'orders'] as const).map(tab => (
          <button
            key={tab}
            id={`admin-tab-${tab}`}
            onClick={() => {
              setAdminTab(tab);
              setEditingId(null);
            }}
            className={`px-4 py-2 rounded-xl border transition-all uppercase tracking-wide cursor-pointer duration-150 ${
              adminTab === tab
                ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-sm'
                : 'bg-zinc-950 border-zinc-850 text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
            }`}
          >
            {tab === 'analytics' ? 'KPI Numbers' : tab}
          </button>
        ))}
      </div>

      {formMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25 flex items-center gap-2 text-xs font-mono">
          <Sparkles size={16} />
          <span>{formMsg}</span>
        </div>
      )}

      {/* ==========================================================
          1. ANALYTICS METRICS DASHBOARD VIEW
          ========================================================== */}
      {adminTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Metrics grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            
            <div className="bg-[#121212] border border-[#D4AF37]/20 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Total Members</span>
                <span id="stat-users" className="text-3xl font-black text-white block">{stats?.total_users || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/15">
                <Users size={20} />
              </div>
            </div>

            <div className="bg-[#121212] border border-[#D4AF37]/20 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Tour Bookings</span>
                <span id="stat-bookings" className="text-3xl font-black text-white block">{stats?.total_bookings || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/15">
                <Calendar size={20} />
              </div>
            </div>

            <div className="bg-[#121212] border border-[#D4AF37]/20 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">E-commerce Orders</span>
                <span id="stat-orders" className="text-3xl font-black text-white block">{stats?.total_orders || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/15">
                <ShoppingBag size={20} />
              </div>
            </div>

            <div className="bg-[#121212] border border-[#D4AF37]/20 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Delivered Revenue</span>
                <span id="stat-revenue" className="text-3xl font-black text-[#D4AF37] block">${stats?.total_revenue || 0} <span className="text-xs text-gray-500 font-normal">USD</span></span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black text-emerald-400 flex items-center justify-center border border-emerald-400/20">
                <DollarSign size={20} />
              </div>
            </div>

          </div>

          {/* User profiles database table */}
          <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-white mb-4 pb-2 border-b border-[#D4AF37]/10">User Signatures Table ({users.length})</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#D4AF37]/15 text-gray-400 font-mono text-[10px] uppercase">
                    <th className="py-3 px-4">Full Tourist Name</th>
                    <th className="py-3 px-4">Role Role</th>
                    <th className="py-3 px-4">Phone Coordinates</th>
                    <th className="py-3 px-4">Shipping Destination</th>
                    <th className="py-3 px-4">Enlisted Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-zinc-900 last:border-b-0 text-gray-300 hover:bg-black/30">
                      <td className="py-3.5 px-4 font-bold text-white">{u.full_name}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${u.role === 'admin' ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-zinc-900 text-gray-300'}`}>{u.role}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{u.phone || 'None provided'}</td>
                      <td className="py-3.5 px-4 font-medium truncate max-w-[200px]">{u.address || 'None provided'}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==========================================================
          2. MONUMENTS MANAGEMENT (CRUD + URLS HANDLING)
          ========================================================== */}
      {adminTab === 'monuments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm font-sans">
          
          {/* Write panel (5 columns) */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#D4AF37]/25 p-6 rounded-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">{editingId ? 'Revise Monument Archive' : 'Index Monument Landmark'}</h3>
            
            <form onSubmit={handleMonSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Monument Name</label>
                <input required type="text" value={monForm.name} onChange={e => setMonForm({...monForm, name: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Governorate Location</label>
                <select value={monForm.governorate} onChange={e => setMonForm({...monForm, governorate: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]">
                  <option value="Giza">Giza</option>
                  <option value="Luxor">Luxor</option>
                  <option value="Aswan">Aswan</option>
                  <option value="South Sinai">South Sinai</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Primary Image URL</label>
                <input required type="url" value={monForm.image_urls?.[0]} onChange={e => setMonForm({...monForm, image_urls: [e.target.value]})} className="w-full px-3 py-2 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Chronicle Description</label>
                <textarea required rows={4} value={monForm.description} onChange={e => setMonForm({...monForm, description: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">Foreign Adult Price (LE)</label>
                  <input type="number" value={monForm.ticket_prices?.foreign} onChange={e => setMonForm({...monForm, ticket_prices: { ...monForm.ticket_prices!, foreign: Number(e.target.value) }})} className="w-full px-3 py-2 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">Egyptian Adult Price (LE)</label>
                  <input type="number" value={monForm.ticket_prices?.local} onChange={e => setMonForm({...monForm, ticket_prices: { ...monForm.ticket_prices!, local: Number(e.target.value) }})} className="w-full px-3 py-2 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black rounded-xl font-bold uppercase tracking-wider text-xs flex-1 cursor-pointer transition-colors duration-150">
                  {editingId ? 'Modify Record' : 'Index Landmark'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setMonForm({ name: '', description: '', image_urls: [''], governorate: 'Giza', category: 'historical', opening_hours: '08:00 - 17:00', ticket_prices: { foreign: 200, local: 30 } }); }} className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-gray-300 font-bold rounded-xl text-xs uppercase cursor-pointer hover:bg-zinc-800 transition-colors">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* List panel (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white pb-2 border-b border-[#D4AF37]/15">Archive Collection ({monuments.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {monuments.map(m => (
                <div key={m.id} className="p-4 border border-[#D4AF37]/15 rounded-xl bg-[#121212] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 font-sans">
                    <img src={m.image_urls[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#D4AF37]/10" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-white truncate">{m.name}</h4>
                      <p className="text-xs text-[#D4AF37] font-mono font-medium">{m.governorate} • {m.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(m.id); setMonForm(m); setFormMsg(null); }} className="p-1.5 rounded bg-zinc-900 hover:bg-[#D4AF37]/20 border border-zinc-800 text-gray-300 hover:text-[#D4AF37] cursor-pointer" title="Edit"><Edit2 size={14} /></button>
                    <button onClick={() => deleteMonument(m.id)} className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer" title="Erase"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==========================================================
          3. TOURS MANAGEMENT (CRUD)
          ========================================================== */}
      {adminTab === 'tours' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm font-sans">
          
          {/* Write panel (5 columns) */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#D4AF37]/25 p-6 rounded-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">{editingId ? 'Modify Tour Package' : 'Index Tour Package'}</h3>
            
            <form onSubmit={handleTourSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Tour Package Title</label>
                <input required type="text" value={tourForm.title} onChange={e => setTourForm({...tourForm, title: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">Price (USD)</label>
                  <input required type="number" value={tourForm.price} onChange={e => setTourForm({...tourForm, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">Available slots</label>
                  <input required type="number" value={tourForm.slots_available} onChange={e => setTourForm({...tourForm, slots_available: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">City Coordinates</label>
                <input required type="text" value={tourForm.city} onChange={e => setTourForm({...tourForm, city: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Primary Image URL</label>
                <input required type="url" value={tourForm.image_urls?.[0]} onChange={e => setTourForm({...tourForm, image_urls: [e.target.value]})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Brief Introduction description</label>
                <textarea required rows={4} value={tourForm.description} onChange={e => setTourForm({...tourForm, description: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black rounded-xl font-bold uppercase tracking-wider text-xs flex-1 cursor-pointer transition-colors duration-150">
                  {editingId ? 'Modify Tour Package' : 'Register Tour Package'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setTourForm({ title: '', description: '', duration_days: 1, price: 50, city: 'Luxor', image_urls: [''], slots_available: 10, itinerary: [{ day: 1, title: 'Arrival', description: 'Arrive at destination' }] }); }} className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-gray-300 font-bold rounded-xl text-xs uppercase cursor-pointer hover:bg-zinc-800 transition-colors">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* List panel (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white pb-2 border-b border-[#D4AF37]/15">Scheduled tour database catalogs ({tours.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {tours.map(t => (
                <div key={t.id} className="p-4 border border-[#D4AF37]/15 rounded-xl bg-[#121212] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 font-sans">
                    <img src={t.image_urls[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#D4AF37]/10" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-white truncate">{t.title}</h4>
                      <p className="text-xs text-[#D4AF37] font-mono font-medium">${t.price} USD • {t.slots_available} seats remaining</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(t.id); setTourForm(t); setFormMsg(null); }} className="p-1.5 rounded bg-zinc-900 hover:bg-[#D4AF37]/20 border border-zinc-800 text-gray-300 hover:text-[#D4AF37] cursor-pointer" title="Edit"><Edit2 size={14} /></button>
                    <button onClick={() => deleteTour(t.id)} className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer" title="Erase"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==========================================================
          4. HERITAGE BAZAAR PRODUCTS (CRUD)
          ========================================================== */}
      {adminTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm font-sans">
          
          {/* Write panel (5 columns) */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#D4AF37]/25 p-6 rounded-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">{editingId ? 'Modify Handicraft Product' : 'Index Handicraft Product'}</h3>
            
            <form onSubmit={handleProdSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Craft Product Name</label>
                <input required type="text" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Category Group</label>
                <select value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value as any})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]">
                  <option value="statues">sculptures (Statues)</option>
                  <option value="papyrus">papyrusPainting</option>
                  <option value="accessories">accessories Jewellery</option>
                  <option value="handicrafts">alabaster Handicrafts</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">Product Price (USD)</label>
                  <input required type="number" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">Initial stock units</label>
                  <input required type="number" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Image URL</label>
                <input required type="url" value={prodForm.image_urls?.[0]} onChange={e => setProdForm({...prodForm, image_urls: [e.target.value]})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">Product features description</label>
                <textarea required rows={4} value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className="w-full px-3 py-2 border border-[#D4AF37]/30 rounded-xl bg-black text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black rounded-xl font-bold uppercase tracking-wider text-xs flex-1 cursor-pointer transition-colors duration-150">
                  {editingId ? 'Modify Product detail' : 'Index Product'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setProdForm({ name: '', description: '', price: 20, category: 'statues', image_urls: [''], stock: 5 }); }} className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-gray-300 font-bold rounded-xl text-xs uppercase cursor-pointer hover:bg-zinc-800 transition-colors">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* List panel (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white pb-2 border-b border-[#D4AF37]/15">Bazaar inventory list ({products.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {products.map(p => (
                <div key={p.id} className="p-4 border border-[#D4AF37]/15 rounded-xl bg-[#121212] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image_urls[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#D4AF37]/10" referrerPolicy="no-referrer" />
                    <div className="min-w-0 font-sans">
                      <h4 className="font-serif font-bold text-white truncate">{p.name}</h4>
                      <p className="text-xs text-[#D4AF37] font-mono font-medium">${p.price} USD • Stock: {p.stock} units</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(p.id); setProdForm(p); setFormMsg(null); }} className="p-1.5 rounded bg-zinc-900 hover:bg-[#D4AF37]/20 border border-zinc-800 text-gray-300 hover:text-[#D4AF37] cursor-pointer" title="Edit"><Edit2 size={14} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer" title="Erase"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==========================================================
          5. BOOKINGS RESERVATIONS REVIEW PANEL
          ========================================================== */}
      {adminTab === 'bookings' && (
        <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-2xl p-6 shadow-sm font-sans text-xs sm:text-sm">
          <h3 className="font-serif text-lg font-bold text-white mb-4 pb-2 border-b border-[#D4AF37]/10">Tour Bookings Under Review ({bookings.length})</h3>
          
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No tour bookings are registered in the records.</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="border border-[#D4AF37]/15 bg-black/30 p-5 rounded-2xl hover:border-[#D4AF37]/35 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5 min-w-0 max-w-xl">
                    <div className="flex items-center gap-2 font-mono text-[9px] text-[#D4AF37]">
                      <span>Reserve ID: {b.id}</span>
                      <span>•</span>
                      <span>Enlisted: {new Date(b.created_at).toLocaleDateString()}</span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white truncate">{b.tour?.title}</h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs text-gray-400 font-sans mt-2">
                      <div>Date: <strong className="text-white">{b.tour_date}</strong></div>
                      <div>Travelers count: <strong className="text-white">{b.number_of_people} people</strong></div>
                      <div>Primary Tourist: <strong className="text-[#D4AF37] truncate block">{b.user?.full_name || 'Guest Tourist'}</strong></div>
                      <div>Contact Phone: <strong className="text-gray-300 font-mono block">{b.contact_info?.alt_phone || 'None'}</strong></div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-mono text-[9px] uppercase font-bold">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                        b.status === 'confirmed' ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]' : b.status === 'rejected' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-zinc-950 border border-zinc-800 text-yellow-500'
                      }`}>{b.status}</span>
                    </div>

                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-3 py-1 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold rounded-lg text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check size={11} /> Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'rejected')}
                          className="px-3 py-1 bg-rose-505/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-lg text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X size={11} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================================
          6. ORDERS REVIEW PANEL
          ========================================================== */}
      {adminTab === 'orders' && (
        <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-2xl p-6 shadow-sm font-sans text-xs sm:text-sm">
          <h3 className="font-serif text-lg font-bold text-white mb-4 pb-2 border-b border-[#D4AF37]/10">Bazaar Handcraft Orders Oversight ({orders.length})</h3>
          
          {orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-sans text-xs">No orders are recorded inside the database.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="border border-[#D4AF37]/15 bg-black/30 p-5 rounded-2xl hover:border-[#D4AF37]/35 transition-all font-sans text-xs">
                  {/* Top info line */}
                  <div className="flex flex-col md:flex-row justify-between pb-3 border-b border-[#D4AF37]/10 mb-3 gap-2">
                    <div>
                      <div className="font-mono text-[10px] text-[#D4AF37]">Order ID: <span className="font-bold text-white">{o.id}</span></div>
                      <span className="text-[10px] text-gray-400 font-mono">Registered Date: {new Date(o.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        Status: <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                          o.status === 'delivered' ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold'
                        }`}>{o.status}</span>
                      </div>
                      <span className="font-bold text-[#D4AF37] font-mono text-sm">${o.total_price.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* List products list details */}
                  <div className="space-y-1.5 mb-3 bg-black/40 border border-[#D4AF37]/10 p-2.5 rounded">
                    {o.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-gray-300 text-xs">
                        <span>{item.name} <strong className="text-[#D4AF37]">x{item.quantity}</strong></span>
                        <span className="font-mono text-[#D4AF37] font-medium">${item.price_at_purchase * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping and Actions bottom */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-2">
                    <span className="text-gray-400 font-mono text-[9px] block">
                      Customer: <strong className="text-white">{o.customer_name}</strong> ({o.phone}) | Shipping To: <strong className="text-[#D4AF37]">{o.shipping_address}</strong>
                    </span>

                    {/* Progress order buttons */}
                    <div className="flex gap-2">
                      {o.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'processing')}
                          className="px-3 py-1 bg-zinc-800 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 text-[#D4AF37] font-bold text-[10px] uppercase rounded cursor-pointer transition-colors"
                        >
                          Process
                        </button>
                      )}
                      {(o.status === 'pending' || o.status === 'processing') && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'shipped')}
                          className="px-3 py-1 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-semibold text-[10px] uppercase rounded cursor-pointer transition-colors"
                        >
                          Ship item
                        </button>
                      )}
                      {o.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'delivered')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] uppercase rounded cursor-pointer transition-colors"
                        >
                          Deliver item
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
