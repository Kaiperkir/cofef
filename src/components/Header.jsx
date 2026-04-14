import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, User, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBasketStore } from '../store/useBasketStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export default function Header() {
  const openCart = useBasketStore(state => state.openCart);
  const items = useBasketStore(state => state.items) || [];
  const user = useAuthStore(state => state.user);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-white/50 dark:border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:bg-white/95 dark:hover:bg-black/95 transition-all duration-[400ms]"
    >
      <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
        
        {/* ЛОГОТИП */}
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-[#D4AF37] text-white dark:text-[#0A0A0A] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#0A0A0A] group-hover:dark:bg-[#FDFCFB] group-hover:text-white group-hover:dark:text-[#0A0A0A] transition-all duration-500"
            >
              <Coffee className="w-5 h-5 stroke-[2]" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-medium tracking-tighter text-[#0A0A0A] dark:text-[#FDFCFB] leading-none mb-1 uppercase italic">
                Чашка Уюта
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400">
                Purveyors of Coffee
              </span>
            </div>
          </Link>

          {/* КОНТАКТЫ - ВЫНЕСЕНЫ ОТ ЛОГОТИПА */}
          <div className="hidden xl:flex flex-col border-l border-stone-100 dark:border-white/10 pl-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A0A] dark:text-[#FDFCFB] mb-1">
              Моздок, Юбилейная 57А
            </span>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
              Ежедневно: 09:00 — 20:00
            </span>
          </div>
        </div>

        {/* НАВИГАЦИЯ - ЕДИНЫЙ СТИЛЬ */}
        <nav className="hidden lg:flex items-center gap-4">
          <Link 
            to="/catalog" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A0A] dark:text-[#FDFCFB] px-8 py-3 border border-stone-200 dark:border-white/20 rounded-full hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
          >
            Ассортимент
          </Link>
          
          <Link 
            to="/builder" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A0A] dark:text-[#FDFCFB] px-8 py-3 border border-stone-200 dark:border-white/20 rounded-full hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
          >
            Собрать подарок
          </Link>

          {(user?.role === 'ADMIN' || user?.role === 'SELLER') && (
            <Link 
              to="/orders" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] px-8 py-3 border border-[#D4AF37]/30 rounded-full hover:bg-[#D4AF37] hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              Заказы
            </Link>
          )}
        </nav>

        {/* ПРАВЫЙ БЛОК - Иконки */}
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme} 
            className="text-[#0A0A0A] dark:text-[#FDFCFB] hover:text-[#D4AF37] transition-colors"
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
              {theme === 'dark' ? <Sun className="w-5 h-5 stroke-[1.5]" /> : <Moon className="w-5 h-5 stroke-[1.5]" />}
            </motion.div>
          </button>

          {user ? (
            <Link to="/profile" className="flex items-center gap-2 text-[#0A0A0A] dark:text-[#FDFCFB] hover:text-[#D4AF37] transition-colors group">
              <span className="text-[10px] font-bold tracking-widest uppercase hidden sm:block">
                {user.name || 'Профиль'}
              </span>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                <User className="w-5 h-5 stroke-[1.5]" />
              </motion.div>
            </Link>
          ) : (
            <Link to="/auth" className="text-[#0A0A0A] dark:text-[#FDFCFB] hover:text-[#D4AF37] transition-colors">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                <User className="w-5 h-5 stroke-[1.5]" />
              </motion.div>
            </Link>
          )}

          <button 
            onClick={openCart} 
            className="relative flex items-center gap-3 text-[#0A0A0A] dark:text-[#FDFCFB] hover:text-[#D4AF37] transition-colors group"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#111111] text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </motion.div>
            <span className="text-[11px] font-bold tracking-widest uppercase">
              Корзина
            </span>
          </button>
        </div>

      </div>
    </motion.header>
  );
}