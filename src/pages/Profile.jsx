import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Package, Heart, LogOut, Users, User, ShieldCheck, RefreshCw, Clock, Truck, CheckCircle2, BellRing, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useBasketStore } from '../store/useBasketStore';
import { useNavigate } from 'react-router-dom';
import ProductManager from '../components/ProductManager';

/**
 * User profile page displaying user details, order history, and options like logging out or managing products (for admins).
 */
export default function Profile() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);
  const [myOrders, setMyOrders] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('orders'); // 'orders', 'admin', 'products'
  const [loadingOrders, setLoadingOrders] = React.useState(true);

  // Состояния для пароля
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [passwordMessage, setPasswordMessage] = React.useState({ text: '', type: '' });
  const [showPasswords, setShowPasswords] = React.useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && token) {
      fetchMyOrders();
      // Автообновление заказов каждые 15 секунд
      const interval = setInterval(fetchMyOrders, 15000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch('/api/orders/my', {
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
      fetch('/api/admin/users', {
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
      'PENDING': { label: 'Ожидает оплаты', color: 'text-stone-400', step: 0, desc: 'Заказ зарегистрирован' },
      'PAID':    { label: 'Принят',         color: 'text-[#D4AF37]', step: 1, desc: 'Платёж подтверждён, заказ передан в работу' },
      'ASSEMBLING': { label: 'Собирается',    color: 'text-[#C06334]', step: 2, desc: 'Бариста бережно собирает ваш заказ' },
      'DELIVERING': {
        label: isPickup ? 'Готов к выдаче' : 'В пути',
        color: 'text-[#C06334]',
        step: 3,
        desc: isPickup ? 'Можете забирать заказ' : 'Курьер уже в пути'
      },
      'COMPLETED': { label: 'Выдан',        color: 'text-green-600 dark:text-green-400', step: 4, desc: 'Заказ успешно получен. Наслаждайтесь!' },
      'CANCELLED': { label: 'Отменён',       color: 'text-red-500', step: 0, desc: 'Заказ отменён' },
    };
    return details[status] || details['PENDING'];
  };

  // Шаги статуса заказа
  const STATUS_STEPS = [
    { key: 'PAID',       label: 'Принят',      icon: BellRing },
    { key: 'ASSEMBLING', label: 'Собирается', icon: Package },
    { key: 'DELIVERING', label: 'В пути',      icon: Truck },
    { key: 'COMPLETED',  label: 'Выдан',       icon: CheckCircle2 },
  ];


  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'SELLER' ? 'USER' : 'SELLER';
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
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
    
    navigate('/cart');
  };

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword || !repeatPassword) {
      setPasswordMessage({ text: 'Заполните все поля', type: 'error' });
      return;
    }
    if (newPassword !== repeatPassword) {
      setPasswordMessage({ text: 'Новые пароли не совпадают', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'Новый пароль должен быть не менее 6 символов', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ text: 'Пароль успешно обновлен', type: 'success' });
        setOldPassword('');
        setNewPassword('');
        setRepeatPassword('');
      } else {
        setPasswordMessage({ text: data.error || 'Ошибка при обновлении', type: 'error' });
      }
    } catch (err) {
      setPasswordMessage({ text: 'Ошибка сети', type: 'error' });
    }
    setTimeout(() => setPasswordMessage({ text: '', type: '' }), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#140F0D] pt-32 pb-20 px-6 font-sans text-[#1C1614] dark:text-[#F6F1E9]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Левая колонка - Инфо */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] text-center shadow-md dark:shadow-black/40">
            <div className="w-32 h-32 bg-white dark:bg-[#362A25] rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl border-[6px] border-white dark:border-[#140F0D] ring-1 ring-[#EADFD8] dark:ring-[#4A3B32]">
              <span className="text-5xl font-serif text-[#C06334] dark:text-[#F6F1E9] italic">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <h2 className="text-3xl font-serif tracking-tight mb-2">{user.name}</h2>
            <p className="text-[#C06334] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-8">{user.email}</p>
            <p className="text-[10px] font-black bg-[#F6F1E9] dark:bg-[#140F0D] inline-block px-4 py-1 rounded-full uppercase tracking-widest text-[#1C1614] dark:text-[#F6F1E9] mb-8">{user.role}</p>
            
            {(user.role === 'ADMIN' || user.role === 'SELLER') && (
              <button 
                onClick={() => navigate('/orders')}
                className="w-full flex items-center justify-center gap-4 py-6 mb-4 bg-white dark:bg-[#1C1614] text-[#D4AF37] dark:text-[#D4AF37] border-2 border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] hover:shadow-lg rounded-[30px] transition-all shadow-md text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Package className="w-4 h-4" /> Управление заказами
              </button>
            )}

            <button onClick={() => setActiveTab('settings')} className="w-full flex items-center justify-center gap-2 py-4 border border-[#EADFD8] dark:border-[#4A3B32] rounded-2xl hover:bg-stone-50 dark:hover:bg-white/5 hover:border-[#C06334] dark:hover:border-[#D4AF37] transition-all text-[10px] font-bold uppercase tracking-widest text-[#444444] dark:text-[#F6F1E9] group">
              <Settings className="w-4 h-4 text-[#C06334] dark:text-[#D4AF37]" /> Настройки
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-6 text-red-500 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-[30px]"
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
                <div className="flex bg-[#F6F1E9] dark:bg-[#140F0D] p-1 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-[#1C1614] text-[#1C1614] dark:text-[#F6F1E9] shadow-md dark:shadow-black/40' : 'text-[#777777] dark:text-[#A0A0A0]'}`}
                  >
                    История
                  </button>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white dark:bg-[#1C1614] text-[#1C1614] dark:text-[#F6F1E9] shadow-md dark:shadow-black/40' : 'text-[#777777] dark:text-[#A0A0A0]'}`}
                  >
                    Товары
                  </button>
                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => setActiveTab('admin')}
                      className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-white dark:bg-[#1C1614] text-[#1C1614] dark:text-[#F6F1E9] shadow-md dark:shadow-black/40' : 'text-[#777777] dark:text-[#A0A0A0]'}`}
                    >
                      Команда
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <button 
                    onClick={() => navigate('/about')}
                    className="bg-[#C06334] dark:bg-[#D4AF37] p-8 rounded-[40px] text-white dark:text-[#1C1614] shadow-xl shadow-[#C06334]/20 dark:shadow-[#D4AF37]/20 text-left hover:scale-[1.02] transition-transform cursor-pointer block"
                  >
                    <Heart className="w-8 h-8 mb-6" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">О нашем магазине</p>
                    <h4 className="text-4xl font-serif italic">Контакты</h4>
                  </button>
                  <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 rounded-[40px] text-[#1C1614] dark:text-[#D4AF37] shadow-xl shadow-black/5">
                    <Package className="w-8 h-8 mb-6 text-[#C06334] dark:text-[#D4AF37]" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">Ваши заказы</p>
                    <h4 className="text-4xl font-serif italic">{myOrders.length} Посылок</h4>
                  </div>
                </div>

                <h3 className="text-2xl font-serif tracking-tight mb-6">Последние события</h3>
                <div className="space-y-4">
                  {loadingOrders ? (
                    <div className="py-20 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C06334] dark:border-[#D4AF37]"></div>
                    </div>
                  ) : myOrders.length === 0 ? (
                    <div className="bg-white dark:bg-[#1C1614] border border-white/5 p-12 rounded-[32px] text-center opacity-40">
                      <p className="font-serif italic text-xl">Вы еще не делали заказов</p>
                    </div>
                  ) : (
                    myOrders.map(order => {
                      const statusInfo = getStatusDetails(order.status, order.address);
                      const isCancelled = order.status === 'CANCELLED';
                      return (
                        <div key={order.id} className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 rounded-[32px] flex flex-col gap-6 hover:shadow-lg transition-all">
                          {/* Заголовок заказа */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">#{order.id} · {new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{order.OrderItem.length} поз. · {order.address}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-price text-2xl text-[#1C1614] dark:text-[#F6F1E9]">{order.total} ₽</span>
                              <button
                                onClick={() => handleRepeatOrder(order.OrderItem)}
                                className="flex items-center gap-2 bg-white dark:bg-[#1C1614] text-[#D4AF37] border border-[#EADFD8] dark:border-[#4A3B32] px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white dark:hover:text-[#1C1614] transition-all"
                              >
                                <RefreshCw className="w-3 h-3" /> Повторить
                              </button>
                            </div>
                          </div>

                          {/* Статус-степпер */}
                          {isCancelled ? (
                            <div className="bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-center">
                              Отменён
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              {STATUS_STEPS.map((step, idx) => {
                                const StepIcon = step.icon;
                                const done = statusInfo.step > idx;
                                const active = statusInfo.step === idx + 1;
                                return (
                                  <React.Fragment key={step.key}>
                                    <div className="flex flex-col items-center gap-1.5 min-w-0">
                                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                        done || active
                                          ? 'bg-[#C06334] dark:bg-[#D4AF37] text-white dark:text-[#1C1614]'
                                          : 'bg-stone-100 dark:bg-[#2A201D] text-stone-300 dark:text-stone-600'
                                      }`}>
                                        <StepIcon className="w-4 h-4" />
                                      </div>
                                      <span className={`text-[8px] font-black uppercase tracking-wide text-center leading-none ${
                                        done || active ? 'text-[#C06334] dark:text-[#D4AF37]' : 'text-stone-300 dark:text-stone-600'
                                      }`}>{step.label}</span>
                                    </div>
                                    {idx < STATUS_STEPS.length - 1 && (
                                      <div className={`flex-1 h-0.5 mb-5 transition-all ${
                                        done ? 'bg-[#C06334] dark:bg-[#D4AF37]' : 'bg-stone-100 dark:bg-[#2A201D]'
                                      }`} />
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          )}

                          {/* Описание текущего статуса */}
                          <p className={`text-[11px] italic ${statusInfo.color}`}>{statusInfo.desc}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ProductManager user={user} />
              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="text-2xl font-serif tracking-tight mb-6">Управление персоналом</h3>
                <div className="bg-white dark:bg-[#1C1614] border border-white/5 rounded-[40px] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#EADFD8] dark:border-[#4A3B32] bg-stone-50 dark:bg-[#2A201D]">
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Пользователь</th>
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Роль</th>
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1C1614]/5">
                      {users.filter(u => u.id !== user.id).map(u => (
                        <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-[#2A201D] transition-colors border-b border-[#EADFD8]/50 dark:border-[#4A3B32]/50 last:border-0">
                          <td className="p-6">
                            <p className="font-bold text-[#1C1614] dark:text-[#F6F1E9]">{u.name}</p>
                            <p className="text-xs text-[#777777] dark:text-[#A0A0A0]">{u.email}</p>
                          </td>
                          <td className="p-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              u.role === 'SELLER' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 
                              u.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 
                              'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
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
                                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' 
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

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-serif tracking-tight text-[#1C1614] dark:text-[#F6F1E9]">Настройки профиля</h3>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500 mt-2">Управление аккаунтом и предпочтениями</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 lg:p-10 rounded-[40px] shadow-lg shadow-black/5 flex flex-col gap-8">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#C06334] dark:text-[#D4AF37] flex items-center gap-3">
                      <User className="w-5 h-5" /> Личные данные
                    </h4>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Имя</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-5 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-all text-base font-medium text-stone-800 dark:text-stone-200" defaultValue={user?.name || ''} placeholder="Ваше имя" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Email</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-5 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-all text-base font-medium text-stone-800 dark:text-stone-200" defaultValue={user?.email || ''} placeholder="Электронная почта" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Телефон</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-5 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-all text-base font-medium text-stone-800 dark:text-stone-200" placeholder="+7 (999) 000-00-00" />
                      </div>
                    </div>
                    <button className="mt-auto w-full bg-stone-900 dark:bg-[#362A25] text-white dark:text-[#D4AF37] py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#C06334] dark:hover:bg-[#D4AF37] hover:text-white transition-all shadow-md">
                      Сохранить данные
                    </button>
                  </div>

                  <div className="space-y-8 flex flex-col">
                    <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] p-8 lg:p-10 rounded-[40px] shadow-lg shadow-black/5 flex flex-col gap-6">
                      <h4 className="text-sm font-black uppercase tracking-widest text-[#C06334] dark:text-[#D4AF37] flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5" /> Безопасность
                      </h4>
                      
                      {passwordMessage.text && (
                        <div className={`p-4 rounded-2xl text-[11px] font-bold tracking-wider uppercase text-center ${
                          passwordMessage.type === 'success' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {passwordMessage.text}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Старый пароль</label>
                          <div className="relative">
                            <input 
                              type={showPasswords ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="w-full bg-stone-50 dark:bg-[#2A201D] p-4 pr-12 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-all text-sm font-medium" 
                              placeholder="••••••••" 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPasswords(!showPasswords)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#C06334] dark:hover:text-[#D4AF37] transition-colors"
                            >
                              {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Новый пароль</label>
                          <div className="relative">
                            <input 
                              type={showPasswords ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-stone-50 dark:bg-[#2A201D] p-4 pr-12 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-all text-sm font-medium" 
                              placeholder="••••••••" 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPasswords(!showPasswords)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#C06334] dark:hover:text-[#D4AF37] transition-colors"
                            >
                              {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Повторите новый пароль</label>
                          <div className="relative">
                            <input 
                              type={showPasswords ? "text" : "password"}
                              value={repeatPassword}
                              onChange={(e) => setRepeatPassword(e.target.value)}
                              className="w-full bg-stone-50 dark:bg-[#2A201D] p-4 pr-12 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-all text-sm font-medium" 
                              placeholder="••••••••" 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPasswords(!showPasswords)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#C06334] dark:hover:text-[#D4AF37] transition-colors"
                            >
                              {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handlePasswordUpdate}
                        className="w-full mt-2 bg-transparent border-2 border-stone-200 dark:border-[#4A3B32] text-stone-600 dark:text-stone-300 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:border-[#C06334] dark:hover:border-[#D4AF37] hover:text-[#C06334] dark:hover:text-[#D4AF37] transition-all"
                      >
                        Обновить пароль
                      </button>
                    </div>

                    <div className="bg-[#C06334]/5 dark:bg-[#D4AF37]/5 border border-[#C06334]/10 dark:border-[#D4AF37]/10 p-8 lg:p-10 rounded-[40px] flex-1 flex flex-col gap-6 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C06334]/10 dark:bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-[#C06334] dark:text-[#D4AF37] flex items-center gap-3 relative z-10">
                        <BellRing className="w-5 h-5" /> Уведомления
                      </h4>
                      <div className="space-y-4 mt-2 relative z-10">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm font-bold text-stone-700 dark:text-stone-300 group-hover:text-[#C06334] dark:group-hover:text-[#D4AF37] transition-colors">Статусы заказов по Email</span>
                          <div className="w-12 h-6 rounded-full bg-[#C06334] dark:bg-[#D4AF37] relative transition-colors shadow-inner">
                            <div className="w-4 h-4 rounded-full bg-white absolute right-1 top-1 shadow-sm transition-transform" />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
