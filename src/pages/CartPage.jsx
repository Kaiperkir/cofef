import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasketStore } from '../store/useBasketStore';
import { useAuthStore } from '../store/useAuthStore';
import { Trash2, ArrowRight, CheckCircle2, Minus, Plus, ShoppingBag, ArrowLeft, Truck, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getPlaceholderImage } from '../utils/placeholders';
import Header from '../components/Header';

/**
 * Shopping cart page for viewing selected items, updating quantities, and proceeding to checkout.
 */
export default function CartPage() {
  const { items, removeFromBasket, updateQuantity, clearBasket } = useBasketStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  
  const totalPrice = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  const FREE_SHIPPING_THRESHOLD = 1000;
  const leftForFree = FREE_SHIPPING_THRESHOLD - totalPrice;
  const progress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (deliveryMethod === 'delivery' && !address.trim()) {
      alert("Пожалуйста, введите адрес доставки (только по городу)");
      return;
    }
    if (!phone.trim()) {
      alert("Пожалуйста, введите номер телефона для связи");
      return;
    }

    setIsPaying(true);
    setIsSubmitting(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const orderData = {
        items: items.map(item => ({
          id: parseInt(item.id) || null,
          name: item.name,
          price: parseInt(item.price),
          weight: parseInt(item.weight),
          grind: item.grind || null,
          quantity: parseInt(item.quantity) || 1
        })),
        total: parseInt(totalPrice),
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address : 'Самовывоз',
        phone,
        comment
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        setOrderSuccess(true);
        setIsPaying(false);
        clearBasket();
        setTimeout(() => {
          setOrderSuccess(false);
          setAddress('');
          setPhone('');
          setComment('');
          navigate('/profile');
        }, 5000);
      } else {
        const errorData = await res.json();
        alert(`Ошибка сервера: ${errorData.error || 'Неизвестная ошибка'}`);
        setIsPaying(false);
      }
    } catch (error) {
      alert(`Сетевая ошибка: ${error.message}`);
      setIsPaying(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F1E9] dark:bg-[#140F0D] pt-32 pb-20 font-sans text-[#1C1614] dark:text-[#F6F1E9]">
      <Header />
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 mt-10">
        
        <Link 
          to="/catalog" 
          className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-stone-400 dark:text-stone-500 hover:text-[#C06334] dark:hover:text-[#D4AF37] w-fit transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Продолжить покупки
        </Link>
        
        {isPaying || orderSuccess ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-[#1C1614] rounded-[48px] border border-[#EADFD8] dark:border-[#4A3B32] p-12 text-center shadow-lg">
            {isPaying ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-t-2 border-[#C06334] dark:border-[#D4AF37] rounded-full mb-10"
                />
                <h3 className="text-3xl font-serif mb-2 italic">Безопасная оплата...</h3>
                <p className="text-[#777777] dark:text-[#A0A0A0] text-[10px] font-bold uppercase tracking-widest">Соединение с банковским шлюзом</p>
              </>
            ) : (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-8" />
                <h3 className="text-4xl lg:text-6xl font-serif mb-4 italic text-[#1C1614] dark:text-[#F6F1E9] tracking-tighter">Оплачено успешно!</h3>
                <p className="text-[#777777] dark:text-[#A0A0A0] text-sm max-w-sm mx-auto mb-10">Ваш заказ принят в работу. Бариста уже смалывает зерно. Вас автоматически перенаправит в профиль.</p>
                <div className="w-16 h-1 bg-[#EADFD8] dark:bg-[#4A3B32] mx-auto rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4 }}
                    className="h-full bg-[#C06334] dark:bg-[#D4AF37]"
                  />
                </div>
              </motion.div>
            )}
          </div>
        ) : items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-20 md:p-32 bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[48px] shadow-sm text-center"
          >
            <div className="w-24 h-24 bg-stone-50 dark:bg-[#2A201D] border-2 border-dashed border-[#EADFD8] dark:border-[#4A3B32] rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="w-10 h-10 text-stone-300 dark:text-stone-600" />
            </div>
            <h2 className="text-4xl font-serif text-[#1C1614] dark:text-[#F6F1E9] mb-4 tracking-tighter">Корзина пуста</h2>
            <p className="text-sm font-medium text-stone-400 dark:text-stone-500 max-w-sm mx-auto mb-10">
              Похоже, вы еще не выбрали кофе. Перейдите в каталог, чтобы порадовать себя.
            </p>
            <Link 
              to="/catalog"
              className="bg-[#1C1614] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] dark:hover:bg-[#C06334] dark:hover:text-white transition-all shadow-xl hover:shadow-2xl"
            >
              Смотреть ассортимент
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Левая колонка - Товары */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              <div className="flex items-end justify-between border-b border-[#EADFD8] dark:border-[#4A3B32] pb-6 mb-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tighter italic leading-none">
                  Ваша Корзина.
                </h1>
                <span className="text-[12px] font-black uppercase tracking-widest text-stone-400">
                  {items.length} {items.length === 1 ? 'товар' : 'товаров'}
                </span>
              </div>
              
              <div className="flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item, idx) => (
                    <motion.div 
                      layout 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      key={item.cartId || idx} 
                      className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-[#1C1614] p-6 rounded-[32px] border border-[#EADFD8] dark:border-[#4A3B32] group"
                    >
                      <div className="w-full sm:w-32 h-40 sm:h-32 bg-stone-50 dark:bg-[#2A201D] overflow-hidden rounded-[20px] shrink-0">
                        <img 
                          src={item.imageUrl || item.image || item.img || getPlaceholderImage(item)} 
                          onError={(e) => { e.target.src = getPlaceholderImage(item); }}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                          alt={item.name} 
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-serif text-xl md:text-2xl text-[#1C1614] dark:text-[#F6F1E9] line-clamp-2 md:line-clamp-1">{item.name}</h4>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] mt-2">
                              {item.weight >= 1000 ? `${item.weight / 1000} кг` : `${item.weight} г`} {item.grind ? `• ${item.grind}` : ''}
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromBasket(item.cartId)} 
                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-6">
                          <div className="flex items-center gap-3 bg-stone-50 dark:bg-[#2A201D] border border-[#EADFD8] dark:border-[#4A3B32] p-1.5 rounded-full">
                            <button onClick={() => updateQuantity(item.cartId, -1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-[#1C1614] hover:shadow-sm transition-all text-stone-500 hover:text-[#C06334] dark:hover:text-[#D4AF37]">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-[12px] font-black min-w-[24px] text-center">{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity(item.cartId, 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-[#1C1614] hover:shadow-sm transition-all text-stone-500 hover:text-[#C06334] dark:hover:text-[#D4AF37]">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="font-price text-2xl md:text-3xl tracking-tight">
                            {item.price * (item.quantity || 1)} ₽
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Правая колонка - Сводка & Чекаут */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white dark:bg-[#1C1614] p-8 md:p-10 rounded-[40px] border border-[#EADFD8] dark:border-[#4A3B32] sticky top-32 shadow-xl shadow-black/5 dark:shadow-black/20">
                <h3 className="text-2xl font-serif tracking-tight mb-8">Сводка заказа</h3>
                
                <div className="mb-8 bg-stone-50 dark:bg-[#2A201D] p-5 rounded-2xl border border-[#EADFD8] dark:border-[#4A3B32]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#444444] dark:text-[#D0D0D0] mb-3">
                    {leftForFree <= 0 
                      ? '✨ Бесплатная доставка по городу' 
                      : `До бесплатной доставки: ${leftForFree} ₽`}
                  </p>
                    <div className="w-full h-[4px] bg-[#EADFD8] dark:bg-[#1C1614] rounded-full overflow-hidden">
                    <motion.div 
                      key={progress}
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${leftForFree <= 0 ? 'bg-[#219653]' : 'bg-[#D4AF37]'}`}
                    />
                  </div>
                </div>

                <div className="space-y-8 mb-8">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] mb-3 block">Получение</label>
                    <div className="grid grid-cols-2 gap-3 p-1 bg-stone-50 dark:bg-[#2A201D] border border-[#EADFD8] dark:border-[#4A3B32] rounded-2xl">
                      <button 
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`flex items-center justify-center py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          deliveryMethod === 'pickup' 
                            ? 'bg-white dark:bg-[#362A25] text-[#1C1614] dark:text-[#D4AF37] shadow-sm border border-[#EADFD8] dark:border-[#555555]' 
                            : 'text-[#777777] dark:text-[#A0A0A0] hover:text-[#1C1614] dark:hover:text-[#F6F1E9]'
                        }`}
                      >
                        Самовывоз
                      </button>
                      <button 
                        onClick={() => setDeliveryMethod('delivery')}
                        className={`flex items-center justify-center py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          deliveryMethod === 'delivery' 
                            ? 'bg-white dark:bg-[#362A25] text-[#1C1614] dark:text-[#D4AF37] shadow-sm border border-[#EADFD8] dark:border-[#555555]' 
                            : 'text-[#777777] dark:text-[#A0A0A0] hover:text-[#1C1614] dark:hover:text-[#F6F1E9]'
                        }`}
                      >
                        Доставка
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <input 
                        type="tel" placeholder="Телефон: +7 (900) 000-00-00" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-[#EADFD8] dark:border-[#4A3B32] px-2 py-4 text-sm font-medium focus:outline-none focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-colors placeholder:text-stone-400"
                      />
                    </div>
                    
                    <AnimatePresence mode="popLayout">
                      {deliveryMethod === 'delivery' ? (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <input 
                            type="text" placeholder="Улица, дом, квартира..." value={address} onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-[#EADFD8] dark:border-[#4A3B32] px-2 py-4 text-sm font-medium focus:outline-none focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-colors placeholder:text-stone-400"
                          />
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-stone-50 dark:bg-[#2A201D] p-4 rounded-xl border border-[#EADFD8] dark:border-[#4A3B32] flex gap-4 items-start">
                          <Package className="w-5 h-5 text-[#C06334] dark:text-[#D4AF37] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-bold text-[#1C1614] dark:text-[#F6F1E9] mb-1">Кофейня Craft Coffee</p>
                            <p className="text-[11px] text-stone-500 leading-relaxed">г. Моздок, ул. Юбилейная, 57а<br/>Ежедневно с 08:00 до 21:00</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div>
                      <textarea 
                        placeholder="Комментарий (позвонить за 15 минут...)" value={comment} onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-[#2A201D] border border-[#EADFD8] dark:border-[#4A3B32] p-4 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-colors h-24 resize-none placeholder:text-stone-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#EADFD8] dark:border-[#4A3B32] mb-8">
                  <div className="flex justify-between text-sm font-medium text-stone-500 dark:text-stone-400 mb-4">
                    <span>Товары ({items.length})</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-stone-500 dark:text-stone-400 mb-6">
                    <span>Доставка</span>
                    <span className={leftForFree <= 0 || deliveryMethod === 'pickup' ? 'text-green-600 dark:text-green-500 font-bold' : ''}>
                      {deliveryMethod === 'pickup' ? '0 ₽' : (leftForFree <= 0 ? '0 ₽' : 'По тарифам')}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-black uppercase tracking-widest text-[12px]">Итого</span>
                    <span className="text-4xl md:text-5xl font-price text-[#1C1614] dark:text-[#F6F1E9] tracking-tighter">{totalPrice} ₽</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={isSubmitting}
                  className={`w-full bg-[#1C1614] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-stone-800 dark:hover:bg-white transition-all flex items-center justify-center gap-4 group shadow-xl hover:shadow-2xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Оформление...' : 'Оплатить заказ'} 
                  {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
