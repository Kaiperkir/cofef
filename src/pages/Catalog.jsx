import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Info, ShoppingBag, 
  ChevronRight, ArrowLeft, Star, Heart,
  Coffee, Leaf, Wind, MapPin, 
  Compass, AlertTriangle, Check, Sparkles,
  LayoutGrid, Grid2X2, Grid3X3, SlidersHorizontal, ChevronDown
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useBasketStore } from '../store/useBasketStore';
import Header from '../components/Header';
import { getPlaceholderImage } from '../utils/placeholders';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const FlavorTag = React.memo(({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-[#2A201D] rounded-2xl border border-[#EADFD8] dark:border-[#4A3B32]">
    <div className="w-10 h-10 bg-white dark:bg-[#1C1614] rounded-xl flex items-center justify-center shadow-md dark:shadow-black/40 border border-[#EADFD8] dark:border-[#4A3B32]">
      <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
    </div>
    <div>
      <span className="text-[8px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] block mb-0.5">{label}</span>
      <span className="text-[13px] font-bold text-[#1C1614] dark:text-[#F6F1E9] uppercase tracking-tighter">{value}</span>
    </div>
  </div>
));

const FlavorBar = React.memo(({ label, value, max = 5 }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
      <span>{label}</span>
      <span className="text-[#D4AF37]">{value}/{max}</span>
    </div>
    <div className="h-1.5 w-full bg-[#1C1614] dark:bg-[#362A25] rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-full bg-[#D4AF37]"
      />
    </div>
  </div>
));

export const ProductCard = React.memo(({ item, index, onAdd, onOpenDetails, viewCols = 3 }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedGrind, setSelectedGrind] = useState('Мелкий');
  const [isAdded, setIsAdded] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const addToBasket = useBasketStore(state => state.addToBasket);
  
  const isFavorite = useFavoritesStore(state => state.isFavorite(item.id));
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);

  useEffect(() => {
    if (item.variants && item.variants.length > 0) {
      const vBest = item.variants.find(v => v.weight === 100) || item.variants[0];
      setSelectedVariant(vBest);
    }
  }, [item.variants]);

  const getStockStatus = (stock, category) => {
    const isDescriptive = category?.toLowerCase().includes('кофе') || category?.toLowerCase().includes('чай');
    if (stock === 0) return { label: "Нет в наличии", color: "text-red-400" };
    if (isDescriptive) {
      if (stock > 15) return { label: "В наличии: Много", color: "text-green-600" };
      if (stock > 5) return { label: "В наличии: Средне", color: "text-orange-500" };
      return { label: "Заканчивается", color: "text-red-500", icon: true };
    }
    return { label: `${stock} шт. в наличии`, color: stock > 5 ? "text-stone-400 dark:text-stone-500" : "text-red-500" };
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!selectedVariant) return;
    addToBasket({
      ...item,
      cartId: Math.random().toString(36).substr(2, 9),
      price: selectedVariant.price,
      weight: selectedVariant.weight,
      grind: item.category?.name?.toLowerCase().includes('кофе') ? selectedGrind : null
    });
    setIsAdded(true);
    onAdd();
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!selectedVariant) return null;

  const stockInfo = getStockStatus(selectedVariant.stock, item.category?.name);
  const isCoffee = item.category?.name?.toLowerCase().includes('кофе');
  
  // Conditionally reduce padding/text size for 4-column layout
  const isCompact = viewCols >= 4;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "100px" }} 
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className={`group flex flex-col h-full bg-white dark:bg-[#1C1614] rounded-[40px] md:rounded-[56px] ${isCompact ? 'p-6 md:p-8' : 'p-8 md:p-10'} shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-300 relative border border-[#EADFD8] dark:border-[#4A3B32] hover:-translate-y-2`}
      style={{ transform: 'translate3d(0,0,0)', willChange: 'transform, opacity' }}
    >
      {item.isTop && (
        <div className={`absolute ${isCompact ? '-top-4 left-6 px-4 py-2' : '-top-5 left-8 px-6 py-3'} bg-[#1C1614] dark:bg-[#362A25] text-[#D4AF37] rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl z-20 border border-[#EADFD8] dark:border-[#4A3B32]`}>
          <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" /> Топ
        </div>
      )}

      {item.isWeekly && (
        <div className={`absolute ${isCompact ? '-top-4 right-6 px-4 py-2' : '-top-5 right-8 px-6 py-3'} bg-white dark:bg-[#362A25] text-[#1C1614] dark:text-[#D4AF37] rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl z-20 border-2 border-[#D4AF37] dark:border-[#4A3B32]`}>
          <Sparkles className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" /> Сорт недели
        </div>
      )}

      <div className={`flex justify-between items-center ${isCompact ? 'mb-4' : 'mb-6 md:mb-8'}`}>
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] truncate mr-2">{item.region || 'Exclusive'}</span>
        {item.isSpecialty && (
          <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-50 dark:bg-[#071E14] border border-emerald-200/60 dark:border-[#123927] text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-emerald-600 dark:text-[#88C5A8] shadow-sm shadow-emerald-500/5 dark:shadow-none group-hover:border-emerald-300 dark:group-hover:border-[#22553B] transition-colors">
            Specialty
          </div>
        )}
      </div>

      <div 
        className={`aspect-[4/5] bg-[#F6F1E9] dark:bg-[#040C08] rounded-[32px] md:rounded-[48px] ${isCompact ? 'mb-6' : 'mb-8 md:mb-10'} relative cursor-pointer overflow-hidden flex items-center justify-center p-2 transition-colors duration-700 group-hover:bg-stone-50 dark:group-hover:bg-[#081810]`}
        onClick={onOpenDetails}
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        {!isImgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-stone-200 dark:bg-[#1C1614] z-20" />
        )}
        <img 
          src={item.imageUrl || getPlaceholderImage(item)} 
          onLoad={() => setIsImgLoaded(true)}
          onError={(e) => { 
            e.target.src = getPlaceholderImage(item); 
            setIsImgLoaded(true);
          }}
          className={`w-full h-full object-contain scale-90 group-hover:scale-105 transition-all duration-700 z-10 drop-shadow-2xl ${isImgLoaded ? 'opacity-100' : 'opacity-0'}`} 
          alt={item.name}
          loading="lazy"
          decoding="async"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
          className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 md:p-3 rounded-full transition-all shadow-xl z-30 hover:scale-110"
        >
          <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-red-500 text-red-500 dark:fill-red-500 dark:text-red-500' : 'text-[#1C1614] dark:text-[#F6F1E9]'}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className={`${isCompact ? 'mb-6' : 'mb-8'} cursor-pointer`} onClick={onOpenDetails}>
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#777777] dark:text-[#A0A0A0] mb-1 block">
            {item.brand || 'Premium Selection'}
          </span>
          <h3 className={`${isCompact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-serif text-[#1C1614] dark:text-[#F6F1E9] mb-4 leading-tight tracking-tight group-hover:text-[#D4AF37] dark:group-hover:text-[#D4AF37] transition-colors`}>
            {item.name}
          </h3>
          {isCoffee && (
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                   <div className="flex gap-1.5">
                     {[...Array(5)].map((_, i) => (
                       <div key={i} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500 ${i < (item.acid || 3) ? 'bg-[#D4AF37]' : 'bg-[#EADFD8] dark:bg-[#362A25]'}`} />
                     ))}
                   </div>
                   <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Кислотность</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                 <div className="flex gap-1.5">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500 ${i < (item.body || 4) ? 'bg-[#D4AF37]' : 'bg-[#EADFD8] dark:bg-[#362A25]'}`} />
                   ))}
                 </div>
                 <span className="text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Горечь</span>
              </div>
              <div className={`flex items-center gap-1.5 text-[12px] md:text-[13px] font-black uppercase tracking-tighter ${stockInfo.color}`}>
                 {stockInfo.icon && <AlertTriangle className="w-3 h-3" />}
                 {stockInfo.label}
              </div>
            </div>
          )}
          {!isCoffee && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 md:p-4 bg-stone-50/50 dark:bg-[#2A201D] rounded-2xl border border-[#EADFD8] dark:border-[#4A3B32]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">Градусы</span>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Compass className="w-3 h-3 text-[#D4AF37] dark:text-[#D4AF37]" />
                    <span className="text-[13px] md:text-[14px] font-bold text-stone-800 dark:text-stone-200">{item.brewing_temp || '90°C'}</span>
                  </div>
                </div>
                <div className="w-px h-6 bg-stone-200 dark:bg-[#222222]" />
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 text-right">Настой</span>
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="text-[13px] md:text-[14px] font-bold text-stone-800 dark:text-stone-200 text-right">{item.steeping_time || '5 м'}</span>
                    <Info className="w-3 h-3 text-[#D4AF37] dark:text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-[12px] md:text-[13px] font-black uppercase tracking-tighter ${stockInfo.color}`}>
                 {stockInfo.icon && <AlertTriangle className="w-3 h-3" />}
                 {stockInfo.label}
              </div>
            </div>
          )}
        </div>

        <div className={`space-y-4 md:space-y-6 mt-auto ${isCompact ? 'pt-2' : 'pt-4'}`}>
          <div className="space-y-3">
            <span className={`font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ${isCompact ? 'text-[11px]' : 'text-[12px]'}`}>Объем / Вес</span>
            <div className={`flex flex-wrap ${isCompact ? 'gap-1.5' : 'gap-2'}`}>
              {item.variants.map(v => (
                <button
                  key={v.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariant(v); }}
                  className={`rounded-full font-bold tracking-widest transition-all border ${
                    isCompact 
                    ? 'px-3.5 py-1.5 text-[10px] md:text-[11px]' 
                    : 'px-5 py-2 text-[11px] md:text-[12px]'
                  } ${
                    selectedVariant.id === v.id 
                    ? 'bg-white dark:bg-[#1C1614] text-[#D4AF37] border-[#D4AF37] shadow-sm' 
                    : 'bg-transparent border-[#DED0C6] dark:border-[#5A4B42] text-[#777777] dark:text-[#A0A0A0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  {v.weight >= 1000 ? (v.weight / 1000) + ' КГ' : v.weight + ' Г'}
                </button>
              ))}
            </div>
          </div>

          {isCoffee && (
            <div className="space-y-3">
              <span className={`font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ${isCompact ? 'text-[11px]' : 'text-[12px]'}`}>Помол</span>
              <div className={`flex flex-wrap ${isCompact ? 'gap-1.5' : 'gap-2'}`}>
                {['Мелкий', 'Средний', 'Крупный', 'Зерно'].map(grind => (
                  <button
                    key={grind}
                    onClick={(e) => { e.stopPropagation(); setSelectedGrind(grind); }}
                    className={`rounded-full font-bold uppercase tracking-widest transition-all border ${
                      isCompact 
                      ? 'px-3.5 py-1.5 text-[10px] md:text-[11px]' 
                      : 'px-5 py-2 text-[11px] md:text-[12px]'
                    } ${
                      selectedGrind === grind 
                      ? 'bg-white dark:bg-[#1C1614] text-[#D4AF37] border-[#D4AF37] shadow-sm' 
                      : 'bg-transparent border-[#DED0C6] dark:border-[#5A4B42] text-[#777777] dark:text-[#A0A0A0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    }`}
                  >
                    {grind}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={selectedVariant.stock === 0}
            className={`w-full ${isCompact ? 'py-4 px-6' : 'py-6 px-10'} rounded-full flex items-center justify-between text-[11px] md:text-[12px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl ${
              selectedVariant.stock === 0
              ? 'bg-stone-200 dark:bg-[#222222] text-stone-400 dark:text-stone-500 cursor-not-allowed'
              : isAdded 
                ? 'bg-white text-[#D4AF37] dark:text-[#D4AF37] scale-[0.98]' 
                : 'bg-white dark:bg-[#1C1614] text-[#D4AF37] dark:text-[#D4AF37] border border-[#EADFD8] dark:border-[#D4AF37]/30 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] hover:text-white dark:hover:text-[#1C1614] hover:shadow-[#D4AF37]/30'
            }`}
          >
            {selectedVariant.stock === 0 ? (
              <span className="mx-auto uppercase">Нет в наличии</span>
            ) : isAdded ? (
              <span className="flex items-center gap-3 mx-auto"><Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" /> Добавлено</span>
            ) : (
              <>
                <span>В корзину</span> 
                <div className="flex flex-col items-end">
                  {selectedVariant.oldPrice > 0 && (
                    <span className="text-[11px] line-through opacity-50 tracking-normal leading-none mb-1">{selectedVariant.oldPrice} ₽</span>
                  )}
                  <span className={`${isCompact ? 'text-lg' : 'text-xl'} font-price tracking-normal leading-none`}>{selectedVariant.price} ₽</span>
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

const PAGE_SIZE = 21;

export default function Catalog() {
  const { products, loading, error, fetchProducts, viewCols, setViewCols } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');
  const [modalGrind, setModalGrind] = useState('Мелкий');
  const [sortBy, setSortBy] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  const { addToBasket } = useBasketStore();
  const favoritesIds = useFavoritesStore(state => state.favorites) || [];

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Reset pagination whenever filters or sorting change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, activeCategory, sortBy]);

  // Блокировка прокрутки страницы когда модал открыт
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedProduct]);

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ['Все', 'Сладкое', 'Корзинки'];
    const dynamicCats = [...new Set(products.map(p => p.category?.name))].filter(Boolean);
    const requiredCats = ['Сладкое', 'Корзинки'];
    const combinedCats = [...new Set([...dynamicCats, ...requiredCats])];
    return ['Все', ...combinedCats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Все' || p.category?.name === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Always sort isWeekly products first
    result.sort((a, b) => {
      if (a.isWeekly && !b.isWeekly) return -1;
      if (!a.isWeekly && b.isWeekly) return 1;
      return 0;
    });

    if (sortBy === 'favorites') {
      // Secondary sort if sorting by favorites
      result.sort((a, b) => {
        if (a.isWeekly !== b.isWeekly) return 0; // Keep weekly group separate
        const aFav = favoritesIds.includes(a.id) ? 1 : 0;
        const bFav = favoritesIds.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      });
    } else if (sortBy === 'new') {
      result.sort((a, b) => {
        if (a.isWeekly !== b.isWeekly) return 0;
        return parseInt(b.id) - parseInt(a.id);
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        if (a.isWeekly !== b.isWeekly) return 0;
        return (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0);
      });
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        if (a.isWeekly !== b.isWeekly) return 0;
        return (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0);
      });
    }

    return result;
  }, [products, searchQuery, activeCategory, sortBy, favoritesIds]);

  const gridClass = useMemo(() => {
    switch(viewCols) {
      case 4: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
      case 3: 
      default: return 'grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12';
    }
  }, [viewCols]);

  const handleAddToCartFromModal = () => {
    if (!selectedProduct) return;
    const v = selectedProduct.variants[0];
    addToBasket({
      ...selectedProduct,
      cartId: Math.random().toString(36).substr(2, 9),
      price: v.price,
      weight: v.weight,
      grind: selectedProduct.category?.name?.toLowerCase().includes('кофе') ? modalGrind : null
    });
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#140F0D] pt-32 pb-20 font-sans">
      {/* Header удален, так как он есть в App.jsx */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-12 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none text-[#1C1614] dark:text-[#F6F1E9]">Коллекция.</h1>
            <div className="relative group w-full md:w-[400px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500 group-focus-within:text-[#D4AF37] dark:group-focus-within:text-[#D4AF37] transition-colors" />
              <input 
                type="text" placeholder="Поиск по названию..." 
                className="w-full bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-full py-5 pl-16 pr-8 text-sm focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:shadow-xl transition-all shadow-md dark:shadow-black/40"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between pb-4 border-b border-[#EADFD8] dark:border-[#4A3B32]">
            <div className="flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-2">
              {categories.map(cat => (
                <button
                  key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                    activeCategory === cat 
                    ? 'bg-white dark:bg-[#362A25] text-[#D4AF37] dark:text-[#D4AF37] border-[#D4AF37] dark:border-[#555555] shadow-md' 
                    : 'bg-white dark:bg-[#1C1614] text-stone-400 dark:text-stone-500 border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] dark:hover:border-[#D4AF37]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 z-[45] w-full lg:w-auto">
              <div className="flex w-full md:w-auto bg-white dark:bg-[#1C1614] p-1.5 rounded-full border border-[#EADFD8] dark:border-[#4A3B32] shadow-sm">
                {[3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setViewCols(num)}
                    className={`flex-1 md:flex-none flex items-center justify-center w-auto md:w-12 h-12 rounded-full transition-all ${
                      viewCols === num 
                      ? 'bg-white dark:bg-[#362A25] text-[#D4AF37] border border-[#D4AF37] dark:border-[#D4AF37] block shadow-md' 
                      : 'text-stone-400 hover:bg-stone-50 dark:hover:bg-[#2A201D]'
                    }`}
                  >
                    {num === 3 ? <Grid3X3 className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                  </button>
                ))}
              </div>
              
              <div className="relative group w-full md:min-w-[240px]">
                <button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="w-full bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-full px-6 h-14 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#1C1614] dark:text-[#F6F1E9] transition-all hover:border-[#D4AF37] dark:hover:border-[#D4AF37]"
                >
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {sortBy === 'favorites' ? 'Избранное' :
                     sortBy === 'new' ? 'Новое' :
                     sortBy === 'price-desc' ? 'Цена: по убыванию' :
                     sortBy === 'price-asc' ? 'Цена: по возрастанию' :
                     'Сортировать по'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </button>
              
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute top-[calc(100%+0.5rem)] right-0 w-full bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[24px] shadow-2xl overflow-hidden py-2"
                  >
                    {[
                      { id: '', label: 'Сбросить' },
                      { id: 'favorites', label: 'Избранное' },
                      { id: 'new', label: 'Новое' },
                      { id: 'price-desc', label: 'Цена: от высокой к низкой' },
                      { id: 'price-asc', label: 'Цена: от низкой к высокой' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setShowSortDropdown(false); }}
                        className={`w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                          sortBy === opt.id 
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37]' 
                          : 'text-[#1C1614] dark:text-[#F6F1E9] hover:bg-stone-50 dark:hover:bg-[#2A201D]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white dark:bg-[#1C1614] rounded-[40px] border border-red-100 dark:border-red-900/20 shadow-xl">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-[#1C1614] dark:text-[#F6F1E9] mb-4">Ой! Не удалось загрузить товары</h2>
            <p className="text-stone-500 dark:text-stone-400 max-w-md mb-8">{error}</p>
            <button 
              onClick={() => fetchProducts()}
              className="flex items-center gap-3 bg-[#1C1614] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Попробовать снова
            </button>
          </div>
        ) : loading ? (
          <div className={`grid ${gridClass}`}>
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} viewCols={viewCols} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className={`grid ${gridClass} transition-all duration-500 ease-in-out`}>
              {filteredProducts.slice(0, visibleCount).map((p, idx) => (
                <ProductCard key={p.id} item={p} index={idx} onAdd={() => {}} onOpenDetails={() => setSelectedProduct(p)} viewCols={viewCols} />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="flex flex-col items-center gap-4 mt-16 mb-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  Показано {Math.min(visibleCount, filteredProducts.length)} из {filteredProducts.length} товаров
                </p>
                <button
                  onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                  className="group relative flex items-center gap-4 bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] rounded-full px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-[#1C1614] dark:text-[#F6F1E9] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:-translate-y-0.5"
                >
                  <span>Показать ещё</span>
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] transition-colors duration-300">
                    <ChevronDown className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-stone-100 dark:bg-[#1C1614] rounded-full flex items-center justify-center mb-8">
              <Search className="w-10 h-10 text-stone-300 dark:text-stone-600" />
            </div>
            <h3 className="text-3xl font-serif text-[#1C1614] dark:text-[#F6F1E9] mb-4">Ничего не нашли</h3>
            <p className="text-stone-400 dark:text-stone-500 max-w-sm">Попробуйте изменить параметры поиска или сбросить фильтры.</p>
            {(searchQuery || activeCategory !== 'Все') && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('Все'); }}
                className="mt-8 text-[#D4AF37] font-black uppercase tracking-widest text-[10px] border-b-2 border-[#D4AF37] pb-1 hover:opacity-70 transition-opacity"
              >
                Сбросить всё
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-[#1C1614]/80 backdrop-blur-md z-[100] cursor-crosshair"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-x-0 bottom-0 top-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-6xl md:top-24 md:bottom-0 bg-white dark:bg-[#1C1614] rounded-t-[40px] md:rounded-t-[60px] shadow-2xl z-[110] overflow-hidden flex flex-col md:flex-row border border-[#DED0C6] dark:border-[#4A3B32]"
              style={{ willChange: 'transform, opacity' }}
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 md:top-10 md:right-10 p-4 md:p-5 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full shadow-2xl z-[120] hover:rotate-90 transition-transform"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-[#1C1614] dark:text-[#F6F1E9]" />
              </button>

              <div className="w-full md:w-5/12 h-64 md:h-full bg-[#F6F1E9] dark:bg-[#040C08] p-6 md:p-10 flex items-center justify-center relative shrink-0">
                <div className="h-full w-full relative flex items-center justify-center">
                  <img 
                    src={selectedProduct.imageUrl || getPlaceholderImage(selectedProduct)} 
                    onError={(e) => { e.target.src = getPlaceholderImage(selectedProduct); }}
                    className="max-w-[75%] max-h-[75%] object-contain drop-shadow-2xl" 
                    alt={selectedProduct.name}
                    decoding="async"
                  />
                </div>
                {selectedProduct.sca > 0 && (
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 bg-[#1C1614] dark:bg-[#362A25] p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-2xl border border-white/5">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] dark:text-[#D4AF37] mb-1">SCA Score</div>
                    <div className="text-3xl md:text-5xl font-serif font-black text-white">{selectedProduct.sca}</div>
                  </div>
                )}
              </div>

              <div className="w-full md:w-7/12 h-1/2 md:h-full flex flex-col text-[#1C1614] dark:text-[#F6F1E9]">
                {/* Скроллируемый контент сверху */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 lg:p-12 pb-4">
                  <div className="mb-5 md:mb-8">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37] dark:text-[#D4AF37] mb-2 md:mb-3 block">
                      {selectedProduct.brand || 'Selection'} • {selectedProduct.category?.name}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif leading-[0.95] tracking-tighter mb-3 md:mb-5">{selectedProduct.name}</h2>
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed text-[#444444] dark:text-[#D0D0D0] font-light max-w-xl">
                      {selectedProduct.description || "Исключительный лот с уникальным профилем вкуса, отобранный нашими экспертами."}
                    </p>
                  </div>

                  {selectedProduct.category?.name?.toLowerCase().includes('кофе') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                      <div className="space-y-4">
                        <FlavorBar label="Кислотность" value={selectedProduct.acid || 3} />
                        <FlavorBar label="Тело / Плотность" value={selectedProduct.body || 4} />
                      </div>
                      <div className="flex flex-wrap gap-2 content-start">
                        {(selectedProduct.notes || "Шоколад, Орехи, Ягоды").split(',').map(note => (
                          <span key={note} className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-stone-50 dark:bg-[#2A201D] text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-[#EADFD8] dark:border-[#4A3B32]">
                            {note.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <FlavorTag label="Происхождение" value={selectedProduct.origin || "Бразилия"} icon={MapPin} />
                    <FlavorTag label="Обработка" value={selectedProduct.region || "Натуральная"} icon={Wind} />
                  </div>
                </div>

                {/* Нижняя панель — всегда видна */}
                <div className="shrink-0 px-8 md:px-10 lg:px-12 py-5 border-t border-[#EADFD8] dark:border-[#4A3B32] bg-white dark:bg-[#1C1614]">
                  {selectedProduct.category?.name?.toLowerCase().includes('кофе') && (
                    <div className="mb-4">
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 mb-2.5">Помол для вашего метода</div>
                      <div className="flex flex-wrap gap-2">
                        {['Мелкий', 'Средний', 'Крупный', 'Зерно'].map(grind => (
                          <button
                            key={grind}
                            onClick={() => setModalGrind(grind)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                              modalGrind === grind
                              ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-md'
                              : 'bg-stone-50 dark:bg-[#2A201D] border-[#EADFD8] dark:border-[#4A3B32] text-[#555555] dark:text-[#A0A0A0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                            }`}
                          >
                            {grind}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleAddToCartFromModal}
                    className="w-full bg-white dark:bg-[#1C1614] text-[#D4AF37] dark:text-[#D4AF37] border border-[#EADFD8] dark:border-[#D4AF37]/30 px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:border-[#D4AF37] dark:hover:border-[#D4AF37] hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] hover:text-white dark:hover:text-[#1C1614] transition-all shadow-lg hover:shadow-[#D4AF37]/20 flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">В корзину <span className="text-xl font-price tracking-normal">{selectedProduct.variants[0]?.price} ₽</span></span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkeletonCard({ viewCols }) {
  const isCompact = viewCols >= 4;
  return (
    <div className={`flex flex-col h-full bg-white dark:bg-[#1C1614] rounded-[40px] md:rounded-[56px] ${isCompact ? 'p-6 md:p-8' : 'p-10'} border border-[#EADFD8] dark:border-[#4A3B32] shadow-md dark:shadow-black/40 animate-pulse relative`}>
      <div className="flex justify-between items-center mb-8">
        <div className="w-24 h-4 bg-stone-200 dark:bg-[#222222] rounded-full" />
        <div className="w-16 h-6 bg-stone-300 dark:bg-[#362A25] rounded-full" />
      </div>
      <div className={`aspect-[4/5] bg-stone-50 dark:bg-[#2A201D] rounded-[32px] md:rounded-[48px] ${isCompact ? 'mb-6' : 'mb-10'}`} />
      <div className="flex-1">
        <div className="w-20 h-3 bg-stone-200 dark:bg-[#222222] rounded-full mb-4" />
        <div className="w-full h-8 bg-stone-200 dark:bg-[#222222] rounded-lg mb-2" />
        <div className="w-3/4 h-8 bg-stone-200 dark:bg-[#222222] rounded-lg mb-8" />
        {!isCompact && (
          <div className="flex justify-between mb-8">
             <div className="w-12 h-10 bg-stone-300 dark:bg-[#362A25] rounded-full" />
             <div className="w-12 h-10 bg-stone-300 dark:bg-[#362A25] rounded-full" />
          </div>
        )}
      </div>
      <div className="space-y-4">
        {!isCompact && (
          <div className="flex gap-2">
             <div className="w-16 h-8 bg-stone-300 dark:bg-[#362A25] rounded-full" />
             <div className="w-16 h-8 bg-stone-300 dark:bg-[#362A25] rounded-full" />
          </div>
        )}
        <div className="w-full h-14 bg-stone-200 dark:bg-[#222222] rounded-full" />
      </div>
    </div>
  );
}
