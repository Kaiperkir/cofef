import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Package, Heart, LogOut, Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useBasketStore } from '../store/useBasketStore';
import { useNavigate } from 'react-router-dom';
import ProductManager from '../components/ProductManager';

export default function Profile() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);
  const [myOrders, setMyOrders] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('orders'); // 'orders', 'admin', 'products'
  const [loadingOrders, setLoadingOrders] = React.useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && token) {
      fetchMyOrders();
    }
  }, [user, token]);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch('http://localhost:5000/api/orders/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMyOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error(err));
    }
  }, [user, token]);

  if (!user) return null;

  const getStatusDetails = (status, address) => {
    const isPickup = address?.toLowerCase().includes('самовывоз');
    
    const details = {
      'PENDING': { label: 'Ожидает оплаты', color: 'text-stone-400 dark:text-stone-500', bg: 'bg-stone-50 dark:bg-[#111111]', progress: 10, desc: 'Заказ зарегистрирован в системе' },
      'PAID': { label: 'Оплачен', color: 'text-blue-500', bg: 'bg-blue-50', progress: 30, desc: 'Платеж подтвержден, ожидаем сборку' },
      'ASSEMBLING': { label: 'В сборке', color: 'text-yellow-600', bg: 'bg-yellow-50', progress: 50, desc: 'Наш бариста бережно собирает ваш заказ' },
      'DELIVERING': { 
        label: isPickup ? 'Заказ собран' : 'В пути', 
        color: 'text-purple-600', 
        bg: 'bg-purple-50', 
        progress: 80, 
        desc: isPickup ? 'Ваш заказ готов к выдаче! Можете забирать.' : 'Заказ передан курьеру и скоро будет у вас (доставка по городу).' 
      },
      'COMPLETED': { label: 'Выдан', color: 'text-green-600', bg: 'bg-green-50', progress: 100, desc: 'Заказ успешно получен. Наслаждайтесь!' },
      'CANCELLED': { label: 'Отменен', color: 'text-red-600', bg: 'bg-red-50', progress: 0, desc: 'К сожалению, заказ был отменен' }
    };
    return details[status] || details['PENDING'];
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'SELLER' ? 'USER' : 'SELLER';
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRepeatOrder = (orderItems) => {
    const addToBasket = useBasketStore.getState().addToBasket;
    const openCart = useBasketStore.getState().openCart;
    
    orderItems.forEach(item => {
      addToBasket({
        id: item.productId,
        name: item.name,
        price: item.price,
        weight: item.weight,
        grind: item.grind,
        cartId: Math.random().toString(36).substr(2, 9)
      });
    });
    
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#000000] pt-40 pb-20 px-6 font-sans text-[#0A0A0A] dark:text-[#FDFCFB]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Левая колонка - Инфо */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] text-center shadow-sm">
            <div className="w-32 h-32 bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
              <span className="text-4xl font-serif text-[#0A0A0A] dark:text-[#FDFCFB]">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <h2 className="text-3xl font-serif tracking-tight mb-2">{user.name}</h2>
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-8">{user.email}</p>
            <p className="text-[10px] font-black bg-[#FDFCFB] dark:bg-[#000000] inline-block px-4 py-1 rounded-full uppercase tracking-widest text-[#0A0A0A] dark:text-[#FDFCFB] mb-8">{user.role}</p>
            
            {(user.role === 'ADMIN' || user.role === 'SELLER') && (
              <button 
                onClick={() => navigate('/orders')}
                className="w-full flex items-center justify-center gap-4 py-6 mb-4 bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] rounded-[30px] hover:bg-[#D4AF37] transition-all shadow-xl shadow-[#0A0A0A]/10 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Package className="w-4 h-4" /> Управление заказами
              </button>
            )}

            <button className="w-full flex items-center justify-center gap-2 py-4 border border-stone-100 dark:border-white/10 rounded-2xl hover:bg-white hover:border-[#0A0A0A]/30 transition-all text-[10px] font-bold uppercase tracking-widest text-[#444444] dark:text-[#D0D0D0]">
              <Settings className="w-4 h-4" /> Настройки
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-6 text-red-500 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-red-50 transition-all rounded-[30px]"
          >
            <LogOut className="w-4 h-4" /> Выйти из системы
          </button>
        </div>

        {/* Правая колонка - Контент */}
        <div className="lg:col-span-8 space-y-12">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <h1 className="text-5xl lg:text-7xl font-serif tracking-tighter italic">Кабинет.</h1>
              {(user.role === 'ADMIN' || user.role === 'SELLER') && (
                <div className="flex bg-[#FDFCFB] dark:bg-[#000000] p-1 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FDFCFB] shadow-sm' : 'text-[#777777] dark:text-[#A0A0A0]'}`}
                  >
                    История
                  </button>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FDFCFB] shadow-sm' : 'text-[#777777] dark:text-[#A0A0A0]'}`}
                  >
                    Товары
                  </button>
                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => setActiveTab('admin')}
                      className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FDFCFB] shadow-sm' : 'text-[#777777] dark:text-[#A0A0A0]'}`}
                    >
                      Команда
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="bg-[#D4AF37] p-8 rounded-[40px] text-[#111111] shadow-xl shadow-[#D4AF37]/20">
                    <Heart className="w-8 h-8 mb-6" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Привилегии</p>
                    <h4 className="text-4xl font-serif italic">Premium</h4>
                  </div>
                  <div className="bg-[#0A0A0A] dark:bg-[#1A1A1A] p-8 rounded-[40px] text-[#111111] shadow-xl shadow-[#0A0A0A]/20">
                    <Package className="w-8 h-8 mb-6" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Ваши заказы</p>
                    <h4 className="text-4xl font-serif italic">{myOrders.length} Посылок</h4>
                  </div>
                </div>

                <h3 className="text-2xl font-serif tracking-tight mb-6">Последние события</h3>
                <div className="space-y-4">
                  {loadingOrders ? (
                    <div className="py-20 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                    </div>
                  ) : myOrders.length === 0 ? (
                    <div className="bg-white dark:bg-[#0A0A0A] border border-white/5 p-12 rounded-[32px] text-center opacity-40">
                      <p className="font-serif italic text-xl">Вы еще не делали заказов</p>
                    </div>
                  ) : (
                    myOrders.map(order => {
                      const statusInfo = getStatusDetails(order.status, order.address);
                      return (
                        <div key={order.id} className="bg-white dark:bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-lg transition-all">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] block mb-1">ID: #{order.id}</span>
                            <span className="font-medium text-[#0A0A0A] dark:text-[#FDFCFB]">{new Date(order.createdAt).toLocaleDateString()}</span>
                            <p className="text-[10px] text-[#777777] dark:text-[#A0A0A0] mt-1">{order.OrderItem.length} поз. • {order.address}</p>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 flex-1">
                            <div className="flex-1 w-full space-y-4">
                              <div className="flex justify-between items-end mb-1">
                                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusInfo.color}`}>
                                   {statusInfo.label}
                                 </span>
                                 <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                                   {statusInfo.progress}%
                                 </span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${statusInfo.progress}%` }}
                                   className={`h-full ${order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-[#D4AF37]'}`}
                                 />
                              </div>
                              <p className="text-[10px] text-stone-400 dark:text-stone-500 italic">
                                {statusInfo.desc}
                              </p>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto shrink-0">
                              <div className="text-right">
                                <span className="block font-serif text-3xl text-[#0A0A0A] dark:text-[#FDFCFB] mb-1">{order.total} ₽</span>
                              </div>
                              <button 
                                onClick={() => handleRepeatOrder(order.OrderItem)}
                                className="flex items-center gap-2 bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
                              >
                                <RefreshCw className="w-3 h-3" /> Повторить
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <ProductManager user={user} />
            )}

            {activeTab === 'admin' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-serif tracking-tight mb-6">Управление персоналом</h3>
                <div className="bg-white dark:bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-[#FDFCFB]/50">
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0]">Пользователь</th>
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0]">Роль</th>
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0A0A0A]/5">
                      {users.filter(u => u.id !== user.id).map(u => (
                        <tr key={u.id} className="hover:bg-[#FDFCFB] transition-colors">
                          <td className="p-6">
                            <p className="font-bold text-[#0A0A0A] dark:text-[#FDFCFB]">{u.name}</p>
                            <p className="text-xs text-[#777777] dark:text-[#A0A0A0]">{u.email}</p>
                          </td>
                          <td className="p-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              u.role === 'SELLER' ? 'bg-green-100 text-green-700' : 
                              u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {u.role === 'SELLER' && <ShieldCheck className="w-3 h-3" />}
                              {u.role}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            {u.role !== 'ADMIN' && (
                              <button 
                                onClick={() => handleToggleRole(u.id, u.role)}
                                className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                                  u.role === 'SELLER' 
                                  ? 'text-red-500 hover:bg-red-50' 
                                  : 'text-[#D4AF37] hover:bg-[#D4AF37]/5'
                                }`}
                              >
                                {u.role === 'SELLER' ? 'Удалить продавца' : 'Назначить продавцом'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
