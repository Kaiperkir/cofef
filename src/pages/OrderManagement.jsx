import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Package, Truck, CheckCircle2, Clock, 
  ChevronRight, Phone, MapPin, User as UserIcon, 
  AlertCircle, LayoutDashboard, History,
  BellRing, CheckSquare, Search, Trash2, 
  TrendingUp, Users, Settings, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP = {
  'PAID': { label: 'Новый', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/20', icon: BellRing },
  'ASSEMBLING': { label: 'Сборка', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/20', icon: Package },
  'DELIVERING': { label: 'Доставка', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/20', icon: Truck },
  'COMPLETED': { label: 'Готов', color: 'text-green-600 dark:text-green-500', bg: 'bg-green-50/50 dark:bg-green-900/10', border: 'border-green-100 dark:border-green-900/20', icon: CheckCircle2 },
  'CANCELLED': { label: 'Отмена', color: 'text-red-600 dark:text-red-500', bg: 'bg-red-50/50 dark:bg-red-900/10', border: 'border-red-100 dark:border-red-900/20', icon: AlertCircle }
};

const OrderTimer = ({ createdAt, status }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === 'COMPLETED' || status === 'CANCELLED') return;
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date() - new Date(createdAt)) / 1000);
      setElapsed(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt, status]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLate = elapsed > 900; 

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold ${isLate ? 'bg-red-100 dark:bg-red-900/20 text-red-600 animate-pulse' : 'bg-stone-100 dark:bg-[#362A25] text-stone-600 dark:text-stone-400'}`}>
      <Clock className="w-3 h-3" />
      {formatTime(elapsed)}
    </div>
  );
};

/**
 * Admin page for managing and viewing all user orders and their statuses.
 */
export default function OrderManagement() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('DASHBOARD'); 
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SELLER')) {
      navigate('/profile');
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000); 
    return () => clearInterval(interval);
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (error) {
      console.error('Fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error('Update error', error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Вы уверены, что хотите БЕЗВОЗВРАТНО удалить этот заказ из базы?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  // Расширенная фильтрация и поиск
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const isCorrectView = view === 'DASHBOARD' 
        ? ['PAID', 'ASSEMBLING', 'DELIVERING'].includes(o.status)
        : ['COMPLETED', 'CANCELLED'].includes(o.status);
      
      if (!isCorrectView) return false;

      if (!searchQuery) return true;
      
      const q = searchQuery.toLowerCase();
      return (
        o.id.toString().includes(q) ||
        (o.user?.name || '').toLowerCase().includes(q) ||
        (o.phone || '').includes(q) ||
        (o.address || '').toLowerCase().includes(q)
      );
    });
  }, [orders, view, searchQuery]);

  // Статистика только для Админа
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const completedToday = orders.filter(o => o.status === 'COMPLETED' && new Date(o.createdAt).toDateString() === today);
    const active = orders.filter(o => ['PAID', 'ASSEMBLING', 'DELIVERING'].includes(o.status)).length;
    const revenue = orders.reduce((acc, o) => o.status === 'COMPLETED' ? acc + o.total : acc, 0);
    const avgCheck = completedToday.length > 0 ? Math.round(revenue / orders.filter(o => o.status === 'COMPLETED').length) : 0;
    
    return { active, completedToday: completedToday.length, revenue, avgCheck };
  }, [orders]);

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center bg-[#F6F1E9] dark:bg-[#140F0D]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C06334] dark:border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#140F0D] text-[#1C1614] dark:text-[#F6F1E9] pt-32 pb-32 px-4 md:px-12 font-sans">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter">
                {isAdmin ? 'Управление Бизнесом.' : 'Рабочее Место.'}
              </h1>
              <div className="px-4 py-1.5 bg-[#C06334] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-[#C06334]/20 dark:shadow-[#D4AF37]/20">Live</div>
            </div>
            <div className="flex items-center gap-6">
               <p className="text-[#777777] dark:text-[#A0A0A0] text-[10px] font-bold uppercase tracking-[0.4em]">
                {user?.name} • <span className={isAdmin ? 'text-[#C06334] dark:text-[#D4AF37]' : 'text-[#1C1614] dark:text-[#F6F1E9]'}>{user?.role}</span>
              </p>
              {isAdmin && (
                <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 hover:text-[#1C1614] transition-colors border-l border-[#DED0C6] dark:border-[#5A4B42] pl-6">
                  <Users className="w-3.5 h-3.5" /> Управление штатом
                </button>
              )}
            </div>
          </div>

          {/* Search & Global Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="relative group flex-1 sm:min-w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500 group-focus-within:text-[#C06334] dark:group-focus-within:text-[#D4AF37] transition-colors" />
              <input 
                type="text" 
                placeholder="Поиск по ID, телефону или имени клиента..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] h-16 pl-14 pr-6 rounded-2xl text-sm focus:outline-none focus:border-[#C06334] dark:focus:border-[#D4AF37] focus:shadow-xl transition-all"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid - Visible to Admin or meaningful parts to Seller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 rounded-[32px] shadow-md dark:shadow-black/40">
            <div className="flex justify-between items-start mb-4">
              <LayoutDashboard className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">В РАБОТЕ</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Активные задачи</p>
            <p className="text-4xl font-serif italic font-bold text-[#1C1614] dark:text-[#F6F1E9]">{stats.active}</p>
          </div>

          <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 rounded-[32px] shadow-md dark:shadow-black/40">
            <div className="flex justify-between items-start mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">СЕГОДНЯ</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Завершено</p>
            <p className="text-4xl font-serif italic font-bold text-[#1C1614] dark:text-[#F6F1E9]">{stats.completedToday}</p>
          </div>

          {isAdmin && (
            <>
              <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 rounded-[32px] shadow-md dark:shadow-black/40">
                <div className="flex justify-between items-start mb-4">
                  <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                  <span className="text-[10px] font-black text-[#D4AF37] bg-amber-50 dark:bg-black/50 px-2 py-1 rounded">FINANCE</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Общая выручка</p>
                <p className="text-4xl font-serif italic font-bold text-[#D4AF37]">{stats.revenue.toLocaleString()} ₽</p>
              </div>

              <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 rounded-[32px] shadow-md dark:shadow-black/40">
                <div className="flex justify-between items-start mb-4">
                  <Settings className="w-6 h-6 text-stone-400 dark:text-stone-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Средний чек</p>
                <p className="text-4xl font-serif italic font-bold">{stats.avgCheck.toLocaleString()} ₽</p>
              </div>
            </>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap gap-4 mb-10 pb-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              view === 'DASHBOARD' ? 'bg-white dark:bg-[#1C1614] text-[#D4AF37] border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' : 'bg-white dark:bg-[#1C1614] text-stone-400 dark:text-stone-500 border border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] dark:hover:border-[#D4AF37]'
            }`}
          >
            <BellRing className="w-4 h-4" /> Операционная панель
          </button>
          <button 
            onClick={() => setView('HISTORY')}
            className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              view === 'HISTORY' ? 'bg-white dark:bg-[#1C1614] text-[#D4AF37] border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' : 'bg-white dark:bg-[#1C1614] text-stone-400 dark:text-stone-500 border border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] dark:hover:border-[#D4AF37]'
            }`}
          >
            <History className="w-4 h-4" /> Глобальный архив
          </button>
        </div>

        {/* Content Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-40 text-center opacity-20 border-2 border-dashed border-[#DED0C6] dark:border-[#5A4B42] rounded-[40px]">
            <Package className="w-20 h-20 mx-auto mb-6 stroke-[0.5]" />
            <p className="text-3xl font-serif italic">Нет данных для отображения</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => {
                const statusInfo = STATUS_MAP[order.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={order.id}
                    className={`bg-white dark:bg-[#1C1614] border ${statusInfo.border} rounded-[40px] overflow-hidden flex flex-col shadow-md dark:shadow-black/40 hover:shadow-2xl transition-all duration-500 relative group`}
                  >
                    {/* Status Header */}
                    <div className={`p-6 px-8 flex justify-between items-center ${statusInfo.bg}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white dark:bg-[#1C1614] shadow-md dark:shadow-black/40 ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <OrderTimer createdAt={order.createdAt} status={order.status} />
                    </div>

                    {/* Order Details */}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">ID Транзакции</p>
                          <h4 className="text-4xl font-serif font-bold italic tracking-tighter">#{order.id}</h4>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => deleteOrder(order.id)}
                            className="p-3 text-stone-400 dark:text-stone-500 hover:text-red-500 transition-colors bg-stone-50 dark:bg-[#2A201D] rounded-2xl"
                            title="Удалить из системы"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="bg-[#F6F1E9] dark:bg-[#140F0D] rounded-3xl p-6 mb-8 border border-[#EADFD8] dark:border-[#4A3B32] flex-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-4 flex items-center gap-2">
                          <CheckSquare className="w-3.5 h-3.5" /> Спецификация
                        </p>
                        <div className="space-y-4">
                          {order.OrderItem.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-[#EADFD8]/50 pb-3 last:border-0 last:pb-0">
                              <div>
                                <p className="text-[13px] font-bold text-stone-800 dark:text-stone-200 leading-tight mb-1">{item.name}</p>
                                <p className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-tighter">
                                  {item.weight}г {item.grind ? `• ${item.grind}` : ''}
                                </p>
                              </div>
                              <span className="text-xs font-bold text-[#C06334] dark:text-[#D4AF37]">{item.price} ₽</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Client & Delivery */}
                      <div className="space-y-4 mb-8 bg-[#F6F1E9] dark:bg-[#0D0A09] p-6 rounded-3xl border border-[#EADFD8] dark:border-[#4A3B32]">
                        <div className="flex items-center gap-3">
                          <UserIcon className="w-3.5 h-3.5 text-[#C06334] dark:text-[#D4AF37]" />
                          <p className="text-[11px] font-bold text-[#1C1614] dark:text-[#F6F1E9]">{order.user?.name || 'Гостевой заказ'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-3.5 h-3.5 text-[#C06334] dark:text-[#D4AF37]" />
                          <a href={`tel:${order.phone}`} className="text-[11px] font-bold text-[#1C1614] dark:text-[#F6F1E9] hover:text-[#C06334] dark:hover:text-[#D4AF37] transition-colors">{order.phone}</a>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-3.5 h-3.5 text-[#C06334] dark:text-[#D4AF37] mt-0.5" />
                          <p className="text-[11px] font-medium leading-relaxed italic text-[#1C1614] dark:text-[#F6F1E9]">{order.address}</p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-end mb-8 px-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">К оплате:</span>
                         <span className="text-4xl font-serif font-bold italic text-[#1C1614] dark:text-[#F6F1E9] leading-none">{order.total} ₽</span>
                      </div>

                      {/* Status Controls */}
                      <div className="mt-auto space-y-3">
                        {order.status === 'PAID' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'ASSEMBLING')}
                            className="w-full bg-[#1C1614] dark:bg-[#362A25] text-white dark:text-[#D4AF37] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#C06334] dark:hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1C1614]/10"
                          >
                            Принять в сборку <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'ASSEMBLING' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'DELIVERING')}
                            className="w-full bg-yellow-500 text-[#2A201D] dark:text-[#D4AF37] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-yellow-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-yellow-100"
                          >
                            Заказ собран <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'DELIVERING' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'COMPLETED')}
                            className="w-full bg-green-600 text-[#2A201D] dark:text-[#D4AF37] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-100"
                          >
                            Завершить <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        {isAdmin && order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'CANCELLED')}
                            className="w-full bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] text-red-500 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
                          >
                            Отменить транзакцию
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Footer Info for Admin */}
                    {isAdmin && (
                      <div className="px-8 py-4 bg-stone-50 dark:bg-[#2A201D] border-t border-[#EADFD8] dark:border-[#4A3B32] flex justify-between items-center">
                         <span className="text-[8px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                           Update: {new Date(order.updatedAt || order.createdAt).toLocaleTimeString()}
                         </span>
                         <span className="text-[8px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                           User ID: {order.userId || 'Guest'}
                         </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
