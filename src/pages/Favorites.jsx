import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from './Catalog';
import { HeartCrack, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Favorites page displaying the user's saved favorite products.
 */
export default function Favorites() {
  const favoritesIds = useFavoritesStore(state => state.favorites) || [];
  const { products, loading, fetchProducts, viewCols } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState(null); // Just for completing the ProductCard props

  useEffect(() => {
    // If products array is empty, fetch them so we can display them
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const favoriteProducts = useMemo(() => {
    return products.filter(p => favoritesIds.includes(p.id));
  }, [products, favoritesIds]);

  const gridClass = useMemo(() => {
    switch(viewCols) {
      case 4: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
      case 3: 
      default: return 'grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12';
    }
  }, [viewCols]);

  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#140F0D] pt-32 pb-20 font-sans">
      <Header />
      
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-6 mb-16">
          <Link 
            to="/catalog" 
            className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-stone-400 dark:text-stone-500 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Вернуться в каталог
          </Link>
          
          <div className="flex items-center gap-6">
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none text-[#1C1614] dark:text-[#F6F1E9]">
              Избранное.
            </h1>
            <div className="bg-[#1C1614] dark:bg-[#362A25] text-[#F6F1E9] dark:text-[#D4AF37] px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-lg">
              {favoritesIds.length} {favoritesIds.length === 1 ? 'товар' : 'товаров'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex p-20 justify-center">
            <div className="w-8 h-8 border-4 border-[#C06334] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-20 md:p-32 bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[48px] shadow-sm text-center"
          >
            <div className="w-24 h-24 bg-stone-50 dark:bg-[#2A201D] border-2 border-dashed border-[#EADFD8] dark:border-[#4A3B32] rounded-full flex items-center justify-center mb-8">
              <HeartCrack className="w-10 h-10 text-stone-300 dark:text-stone-600" />
            </div>
            <h2 className="text-3xl font-serif text-[#1C1614] dark:text-[#F6F1E9] mb-4">Список пуст</h2>
            <p className="text-sm font-medium text-stone-400 dark:text-stone-500 max-w-sm mx-auto mb-8">
              Вы пока ничего не добавили в избранное. Перейдите в каталог, чтобы порадовать себя вкусным кофе или чаем.
            </p>
            <Link 
              to="/catalog"
              className="bg-[#1C1614] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:bg-stone-800 dark:hover:bg-white transition-all shadow-lg hover:shadow-xl"
            >
              Смотреть ассортимент
            </Link>
          </motion.div>
        ) : (
          <div className={`grid ${gridClass} transition-all duration-500 ease-in-out`}>
            {favoriteProducts.map((p, idx) => (
              <ProductCard 
                key={p.id} 
                item={p} 
                index={idx} 
                onAdd={() => {}} 
                onOpenDetails={() => setSelectedProduct(p)} 
                viewCols={viewCols} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
