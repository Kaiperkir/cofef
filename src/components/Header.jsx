import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Coffee, User, Sun, Moon, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBasketStore } from '../store/useBasketStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

export default function Header() {
  const items = useBasketStore(state => state.items) || [];
  const user = useAuthStore(state => state.user);
  const { theme, toggleTheme } = useThemeStore();
  const favorites = useFavoritesStore(state => state.favorites) || [];
  const location = useLocation();

  const getNavLinkClass = (to) => {
    const isActive = location.pathname === to;
    const base = "text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full transition-[background-color,border-color,color] duration-300 border flex items-center justify-center whitespace-nowrap";
    
    if (isActive) {
      return `${base} bg-[#D4AF37] border-[#D4AF37] text-[#1C1614] shadow-md dark:shadow-black/20`;
    }
    
    return `${base} bg-transparent border-[#EADFD8] dark:border-[#4A3B32] text-[#1C1614] dark:text-[#F6F1E9] hover:bg-stone-50 dark:hover:bg-[#1C1614] hover:border-[#D4AF37] dark:hover:border-[#D4AF37]`;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] bg-white/70 dark:bg-black/80 backdrop-blur-xl border-b border-[#EADFD8] dark:border-[#4A3B32] shadow-sm transition-[background-color,backdrop-filter] duration-300"
    >
      <div className="max-w-[1800px] mx-auto px-8 h-24 flex items-center justify-between">
        
        {/* ЛОГОТИП */}
        <div className="flex items-center gap-12 lg:gap-16">
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#1C1614] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] rounded-full flex items-center justify-center shadow-lg transition-colors duration-500"
            >
              <Coffee className="w-5 h-5 stroke-[2]" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-serif font-medium tracking-tighter text-[#1C1614] dark:text-[#F6F1E9] leading-none mb-1 uppercase italic">
                Чашка Уюта
              </span>
              <span className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.4em] text-stone-400">
                Purveyors of Coffee
              </span>
            </div>
          </Link>

          <div className="hidden xl:flex flex-col border-l border-[#EADFD8] dark:border-[#4A3B32] pl-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1614] dark:text-[#F6F1E9] mb-1">
              Моздок, Юбилейная 57А
            </span>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
              Ежедневно: 09:00 — 20:00
            </span>
          </div>
        </div>

        {/* НАВИГАЦИЯ - ОТДЕЛЬНЫЕ КНОПКИ */}
        <nav className="hidden lg:flex items-center gap-4">
          <Link to="/catalog" className={getNavLinkClass('/catalog')}>
            Ассортимент
          </Link>
          <Link to="/about" className={getNavLinkClass('/about')}>
            О нас
          </Link>
          {(user?.role === 'ADMIN' || user?.role === 'SELLER') && (
            <Link to="/orders" className={getNavLinkClass('/orders')}>
              Заказы
            </Link>
          )}
        </nav>

        {/* ПРАВЫЙ БЛОК - Иконки */}
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={toggleTheme} 
            className="text-[#1C1614] dark:text-[#F6F1E9] hover:text-[#D4AF37] transition-colors p-2"
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
              {theme === 'dark' ? <Sun className="w-5 h-5 stroke-[1.5]" /> : <Moon className="w-5 h-5 stroke-[1.5]" />}
            </motion.div>
          </button>

          {user ? (
            <Link to="/profile" className="flex items-center gap-3 text-[#1C1614] dark:text-[#F6F1E9] hover:text-[#D4AF37] transition-colors group">
              <span className="text-[10px] font-bold tracking-widest uppercase hidden 2xl:block">
                {user.name || 'Профиль'}
              </span>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="p-2">
                <User className="w-5 h-5 stroke-[1.5]" />
              </motion.div>
            </Link>
          ) : (
            <Link to="/auth" className="text-[#1C1614] dark:text-[#F6F1E9] hover:text-[#D4AF37] transition-colors p-2">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                <User className="w-5 h-5 stroke-[1.5]" />
              </motion.div>
            </Link>
          )}

          <Link 
            to="/favorites"
            className="flex items-center gap-2 text-[#1C1614] dark:text-[#F6F1E9] hover:text-[#D4AF37] transition-colors group relative p-2"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'stroke-[1.5]'}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1C1614] dark:bg-[#F6F1E9] text-white dark:text-[#1C1614] text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white dark:border-[#140F0D]">
                  {favorites.length}
                </span>
              )}
            </motion.div>
          </Link>

          <Link 
            to="/cart"
            className="relative flex items-center gap-2 lg:gap-4 bg-[#1C1614] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] px-6 py-3 rounded-full hover:shadow-[0_8px_24px_rgba(28,22,20,0.2)] hover:dark:shadow-[0_8px_24px_rgba(212,175,55,0.2)] transition-all duration-300 group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              {items.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-white dark:bg-[#1C1614] text-[#1C1614] dark:text-[#D4AF37] text-[8px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {items.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase hidden sm:block">
              Корзина
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}