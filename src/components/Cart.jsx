import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasketStore } from '../store/useBasketStore';
import { useAuthStore } from '../store/useAuthStore';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Minus, Plus } from 'lucide-react';

export default function Cart() {
  const { items, isCartOpen, closeCart, removeFromBasket, updateQuantity, clearBasket } = useBasketStore();
  const { token } = useAuthStore();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' or 'delivery'
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
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

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

      console.log('[ORDER] Sending data:', orderData);

      const res = await fetch('http://localhost:5000/api/orders', {
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
          closeCart();
          setAddress('');
          setPhone('');
          setComment('');
        }, 3000);
      } else {
        const errorData = await res.json();
        alert(`Ошибка сервера: ${errorData.error || 'Неизвестная ошибка'}`);
        setIsPaying(false);
      }
    } catch (error) {
      console.error('[ORDER] Error:', error);
      alert(`Сетевая ошибка: ${error.message}`);
      setIsPaying(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart}
            className="fixed inset-0 bg-white/20 backdrop-blur-sm z-[150]"
          />

          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FDFCFB] dark:bg-[#000000] z-[200] shadow-2xl flex flex-col border-l border-[#EEEEEE]"
          >
            <div className="p-8 pb-6 border-b border-[#EEEEEE] flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-serif font-medium text-[#0A0A0A] dark:text-[#FDFCFB] tracking-tight mb-2">Ваш заказ</h2>
                <p className="text-[#777777] dark:text-[#A0A0A0] text-[9px] font-bold uppercase tracking-[0.3em]">
                  Чашка Уюта • Premium
                </p>
              </div>
              <button onClick={closeCart} className="p-2 text-[#777777] dark:text-[#A0A0A0] hover:text-[#D4AF37] transition-colors">
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {isPaying ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#0A0A0A]">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-t-2 border-[#D4AF37] rounded-full mb-8"
                />
                <h3 className="text-2xl font-serif mb-2 italic">Безопасная оплата...</h3>
                <p className="text-[#777777] dark:text-[#A0A0A0] text-[10px] font-bold uppercase tracking-widest">Соединение с банковским шлюзом</p>
                <div className="mt-12 flex gap-4 opacity-20">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Mir-logo.svg" className="h-4" alt="Mir" />
                </div>
              </div>
            ) : orderSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#D4AF37] mb-6">
                  <CheckCircle2 className="w-20 h-20" />
                </motion.div>
                <h3 className="text-3xl font-serif mb-2 italic text-[#0A0A0A] dark:text-[#FDFCFB]">Оплачено успешно!</h3>
                <p className="text-[#777777] dark:text-[#A0A0A0] text-sm">Ваш заказ уже поступил на кухню. Сотрудники начали сборку.</p>
              </div>
            ) : (
              <>
                <div className="px-8 py-6 bg-white/50 border-b border-[#EEEEEE]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#444444] dark:text-[#D0D0D0] mb-4">
                    {leftForFree <= 0 
                      ? '✨ Бесплатная доставка по городу' 
                      : `До бесплатной доставки по городу: ${leftForFree} ₽`}
                  </p>                  <div className="w-full h-[3px] bg-[#EEEEEE] rounded-full overflow-hidden mb-4">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                      className={`h-full transition-colors duration-500 ${leftForFree <= 0 ? 'bg-[#D4AF37]' : 'bg-[#0A0A0A] dark:bg-[#1A1A1A]'}`}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Items List */}
                  <div className="space-y-6">
                    {items.length === 0 ? (
                      <div className="text-center py-10 opacity-50">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-6 stroke-[1]" />
                        <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Корзина пуста</p>
                      </div>
                    ) : (
                      items.map((item, idx) => (
                        <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={item.cartId || idx} 
                          className="flex gap-6 group"
                        >
                          <div className="w-16 h-20 overflow-hidden bg-[#EEEEEE] rounded-lg shrink-0">
                            <img src={item.imageUrl || item.image || item.img || 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&w=600'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} loading="lazy" decoding="async" />
                          </div>
                          <div className="flex-1 py-0.5 flex flex-col">
                            <h4 className="font-serif text-base leading-tight text-[#0A0A0A] dark:text-[#FDFCFB] mb-1">{item.name}</h4>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] mb-auto">
                              {item.weight >= 1000 ? `${item.weight / 1000} кг` : `${item.weight} г`} {item.grind ? `• ${item.grind}` : ''}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 bg-white dark:bg-[#0A0A0A] border border-[#EEEEEE] px-2 py-1 rounded-lg scale-90 origin-left">
                                <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1 hover:text-[#D4AF37]"><Minus className="w-3 h-3" /></button>
                                <span className="text-[10px] font-black min-w-[20px] text-center">{item.quantity || 1}</span>
                                <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1 hover:text-[#D4AF37]"><Plus className="w-3 h-3" /></button>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="font-medium text-sm text-[#0A0A0A] dark:text-[#FDFCFB]">{item.price * (item.quantity || 1)} ₽</div>
                                <button 
                                  onClick={() => removeFromBasket(item.cartId)} 
                                  className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                                  title="Удалить из корзины"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-[#EEEEEE]">
                      {/* Delivery Method */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0A0A0A] dark:text-[#FDFCFB] mb-4">Способ получения</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setDeliveryMethod('pickup')}
                            className={`py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                              deliveryMethod === 'pickup' 
                                ? 'bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] border-[#0A0A0A] dark:border-[#555555]' 
                                : 'bg-white dark:bg-[#0A0A0A] text-[#777777] dark:text-[#A0A0A0] border-[#EEEEEE] hover:border-[#D4AF37]'
                            }`}
                          >
                            Самовывоз
                          </button>
                          <button 
                            onClick={() => setDeliveryMethod('delivery')}
                            className={`py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                              deliveryMethod === 'delivery' 
                                ? 'bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] border-[#0A0A0A] dark:border-[#555555]' 
                                : 'bg-white dark:bg-[#0A0A0A] text-[#777777] dark:text-[#A0A0A0] border-[#EEEEEE] hover:border-[#D4AF37]'
                            }`}
                          >
                            Доставка
                          </button>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] mb-2 block">Телефон для связи</label>
                          <input 
                            type="tel" placeholder="+7 (900) 000-00-00" value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white dark:bg-[#0A0A0A] border border-[#EEEEEE] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                          />
                        </div>
                        
                        {deliveryMethod === 'delivery' ? (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] mb-2 block">Адрес доставки</label>
                            <textarea 
                              placeholder="Улица, дом, квартира..." value={address} onChange={(e) => setAddress(e.target.value)}
                              className="w-full bg-white dark:bg-[#0A0A0A] border border-[#EEEEEE] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] transition-colors h-24 resize-none"
                            />
                          </motion.div>
                        ) : (
                          <div className="bg-[#FDFCFB] dark:bg-[#000000] p-4 rounded-xl border border-white/5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#0A0A0A] dark:text-[#FDFCFB] mb-1">Пункт выдачи:</p>
                            <p className="text-[11px] text-[#777777] dark:text-[#A0A0A0] leading-relaxed">г. Моздок, ул. Юбилейная, 57а<br/>Ежедневно с 08:00 до 21:00</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] mb-2 block">Комментарий к заказу (необязательно)</label>
                          <textarea 
                            placeholder="Например: позвоните за 15 минут или номер подъезда..." value={comment} onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-white dark:bg-[#0A0A0A] border border-[#EEEEEE] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] transition-colors h-20 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-8 bg-[#FDFCFB] dark:bg-[#0A0A0A] border-t border-white/10">
                    <div className="space-y-3 mb-6 text-[#444444] dark:text-[#D0D0D0]">
                      <div className="flex justify-between text-xs">
                        <span>Сумма</span>
                        <span>{totalPrice} ₽</span>
                      </div>
                      <div className="flex justify-between text-xs pb-3 border-b border-white/10">
                        <span>Доставка</span>
                        <span className={leftForFree <= 0 || deliveryMethod === 'pickup' ? 'text-[#D4AF37]' : ''}>
                          {deliveryMethod === 'pickup' ? 'Бесплатно' : (leftForFree <= 0 ? '0 ₽' : 'По тарифам')}
                        </span>
                      </div>
                      <div className="flex justify-between items-end pt-2">
                        <span className="font-bold uppercase tracking-widest text-[10px]">Итого</span>
                        <span className="text-4xl font-serif text-[#0A0A0A] dark:text-[#FDFCFB]">{totalPrice} ₽</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckout} 
                      disabled={isSubmitting}
                      className={`w-full bg-[#0A0A0A] dark:bg-[#D4AF37] text-white dark:text-[#0A0A0A] py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-4 group shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'} 
                      {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
