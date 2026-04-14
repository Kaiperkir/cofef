import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Check, Bean, Leaf, CakeSlice, Package, X, Info, Compass, Coffee, ArrowRight, Star, AlertTriangle } from 'lucide-react';
import { useBasketStore } from '../store/useBasketStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop";

export default function Catalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('все');
  const [showToast, setShowToast] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVariant, setModalVariant] = useState(null);
  const [modalGrind, setModalGrind] = useState('Мелкий');
  const [isModalAdded, setIsModalAdded] = useState(false);
  const addToBasket = useBasketStore(state => state.addToBasket);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки товаров', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
      const vBest = selectedProduct.variants.find(v => v.weight === 100) || selectedProduct.variants[0];
      setModalVariant(vBest);
      setModalGrind('Мелкий');
      setIsModalAdded(false);
    }
  }, [selectedProduct]);

  const handleModalAdd = () => {
    if (!selectedProduct || !modalVariant) return;
    addToBasket({
      ...selectedProduct,
      cartId: Math.random().toString(36).substr(2, 9),
      price: modalVariant.price,
      weight: modalVariant.weight,
      grind: selectedProduct.category?.name?.toLowerCase().includes('кофе') ? modalGrind : null
    });
    setIsModalAdded(true);
    triggerToast();
    setTimeout(() => setIsModalAdded(false), 2000);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'все' || 
                           (p.category && p.category.name.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="pt-40 pb-40 px-6 max-w-[1400px] mx-auto min-h-screen font-sans bg-transparent">
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[500] bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] px-10 py-5 rounded-full flex items-center gap-4 shadow-2xl border border-stone-100 dark:border-white/10"
          >
            <Check className="w-5 h-5 text-[#D4AF37] stroke-[3]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Добавлено в корзину</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-32 text-center">
        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Selection 2026</span>
        <h1 className="text-7xl lg:text-9xl font-serif tracking-tighter mb-8 text-[#0A0A0A] dark:text-[#FDFCFB]">Эксклюзив</h1>
        <div className="h-1 w-20 bg-[#D4AF37] mx-auto mb-8" />
        <p className="text-[#777777] dark:text-[#A0A0A0] text-[13px] font-medium uppercase tracking-[0.4em]">Только лучшие лоты со всего мира</p>
      </div>

      <div className="mb-32 space-y-12">
        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500 group-focus-within:text-[#D4AF37] transition-colors" />
          <input 
            type="text"
            placeholder="Поиск по коллекции..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#0A0A0A] border border-stone-200 dark:border-white/20 rounded-full py-8 pl-20 pr-10 text-base focus:outline-none focus:border-[#D4AF37] focus:shadow-2xl focus:shadow-[#D4AF37]/10 transition-all shadow-sm"
          />
        </div>

        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'все', label: 'Все', icon: Compass },
              { id: 'Кофе', label: 'Кофе', icon: Bean },
              { id: 'Чай', label: 'Чай', icon: Leaf },
              { id: 'Сладости', label: 'Десерты', icon: CakeSlice },
              { id: 'Подарки', label: 'Наборы', icon: Package }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                  activeCategory === cat.id 
                  ? 'bg-[#0A0A0A] text-[#D4AF37] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 scale-105' 
                  : 'bg-transparent text-[#777777] dark:text-[#A0A0A0] border-stone-200 dark:border-white/20 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'
                }`}
              >
                <cat.icon className="w-4 h-4" strokeWidth={1.5} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
          {filteredProducts.map((p, index) => (
            <ProductCard key={p.id} item={p} index={index} onAdd={triggerToast} onOpenDetails={() => setSelectedProduct(p)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 bg-[#0A0A0A]/70 backdrop-blur-xl z-[400]" />
            <motion.div 
              layoutId={`card-${selectedProduct.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-10 md:bottom-10 md:w-full md:max-w-7xl bg-white dark:bg-[#0A0A0A] rounded-[40px] md:rounded-[60px] shadow-2xl z-[410] overflow-hidden flex flex-col border border-stone-200 dark:border-white/20"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-3 md:p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full hover:bg-stone-100 transition-all shadow-sm"><X className="w-5 h-5 text-[#0A0A0A] dark:text-[#FDFCFB]" /></button>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col md:flex-row min-h-full">
                  
                  {/* КОЛОНКА 1: ИЗОБРАЖЕНИЕ */}
                  <div className="w-full md:w-[30%] h-80 md:h-auto bg-[#FDFCFB] dark:bg-[#000000] flex items-center justify-center p-10 relative border-b md:border-b-0 md:border-r border-stone-100 dark:border-white/10 overflow-hidden shrink-0">
                    <motion.img 
                      layoutId={`img-${selectedProduct.id}`}
                      src={selectedProduct.imageUrl || PLACEHOLDER_IMAGE} 
                      className="max-w-full max-h-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.15)] z-10 scale-110" 
                      alt={selectedProduct.name} 
                      loading="lazy"
                      decoding="async"
                    />
                    {selectedProduct.isTop && (
                      <div className="absolute top-8 left-8 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-sm border border-orange-200/50 z-20">
                        <Star className="w-2.5 h-2.5 fill-current" /> Bestseller
                      </div>
                    )}
                  </div>

                  {/* КОЛОНКА 2: ОПИСАНИЕ И ХАРАКТЕРИСТИКИ */}
                  <div className="flex-1 p-8 md:p-16 space-y-12 bg-white dark:bg-[#0A0A0A] border-b md:border-b-0 md:border-r border-stone-50">
                    <header>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em]">{selectedProduct.brand || selectedProduct.region || 'World Selection'}</span>
                        <div className="h-px flex-1 bg-[#0A0A0A] dark:bg-[#1A1A1A]" />
                      </div>
                      <h2 className="text-4xl lg:text-6xl font-serif text-[#0A0A0A] dark:text-[#FDFCFB] mb-8 leading-[0.9] tracking-tight">{selectedProduct.name}</h2>
                      <p className="text-lg font-serif text-[#777777] dark:text-[#A0A0A0] leading-relaxed italic border-l-4 border-[#D4AF37] pl-8">
                        {selectedProduct.description}
                      </p>
                    </header>

                    <div className="space-y-12">
                      {selectedProduct.category?.name?.toLowerCase().includes('кофе') ? (
                        <>
                          <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase text-[#0A0A0A] dark:text-[#FDFCFB] tracking-[0.4em] border-b border-stone-100 dark:border-white/10 pb-4">Характеристики</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              <FlavorBar label="Степень обжарки" value={selectedProduct.roast === 'Light' ? 2 : selectedProduct.roast === 'Dark' ? 5 : 3} />
                              <FlavorBar label="Кислотность" value={selectedProduct.acid || 3} />
                              <FlavorBar label="Горечь" value={selectedProduct.body || 4} />
                              <div className="flex justify-between items-center p-4 bg-stone-50 dark:bg-[#111111] rounded-2xl border border-stone-100 dark:border-white/10">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0]">SCA Score</span>
                                 <span className="text-xl font-serif text-[#D4AF37] font-bold">{selectedProduct.sca || '86.5'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase text-[#0A0A0A] dark:text-[#FDFCFB] tracking-[0.4em] border-b border-stone-100 dark:border-white/10 pb-4">Букет вкуса</h4>
                            <div className="flex flex-wrap gap-3">
                              {(selectedProduct.notes || 'Какао, Фундук, Карамель').split(',').map((note, i) => (
                                <span key={i} className="px-4 py-2 bg-stone-50 dark:bg-[#111111] rounded-full text-[9px] font-bold uppercase tracking-widest text-[#444444] dark:text-[#D0D0D0] border border-stone-100 dark:border-white/10 hover:border-[#D4AF37] transition-colors">
                                  {note.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : selectedProduct.category?.name?.toLowerCase().includes('чай') ? (
                        <>
                          <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase text-[#0A0A0A] dark:text-[#FDFCFB] tracking-[0.4em] border-b border-stone-100 dark:border-white/10 pb-4">Искусство заваривания</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex items-center gap-6 p-6 bg-stone-50 dark:bg-[#071810] rounded-[32px] border border-stone-100 dark:border-[#D4AF37]/20">
                                <div className="w-12 h-12 bg-white dark:bg-[#0A0A0A] rounded-full flex items-center justify-center shadow-sm border border-stone-100 dark:border-white/10 shrink-0">
                                  <Compass className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 block mb-1">t° заваривания</span>
                                  <span className="text-xl font-serif text-[#0A0A0A] dark:text-[#FDFCFB]">{selectedProduct.brewing_temp || '85-90°C'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 p-6 bg-stone-50 dark:bg-[#071810] rounded-[32px] border border-stone-100 dark:border-[#D4AF37]/20">
                                <div className="w-12 h-12 bg-white dark:bg-[#0A0A0A] rounded-full flex items-center justify-center shadow-sm border border-stone-100 dark:border-[#D4AF37]/20 shrink-0">
                                  <Info className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 block mb-1">Время настоя</span>
                                  <span className="text-xl font-serif text-[#0A0A0A] dark:text-[#FDFCFB]">{selectedProduct.steeping_time || '3-5 минут'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase text-[#0A0A0A] dark:text-[#FDFCFB] tracking-[0.4em] border-b border-stone-100 dark:border-white/10 pb-4">Профиль</h4>
                            <div className="flex flex-wrap gap-3">
                              {(selectedProduct.notes || 'Насыщенный, Ароматный').split(',').map((note, i) => (
                                <span key={i} className="px-5 py-2.5 bg-stone-50 dark:bg-[#111111] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#444444] dark:text-[#D0D0D0] border border-stone-100 dark:border-white/10">
                                  {note.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* КОЛОНКА 3: ВЫБОР И ПОКУПКА */}
                  <div className="w-full md:w-[25%] p-8 md:p-10 bg-stone-50/50 flex flex-col justify-center space-y-10 shrink-0">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">Выберите вес</span>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedProduct.variants?.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setModalVariant(v)}
                              className={`px-4 py-3 rounded-2xl text-[11px] font-bold tracking-widest transition-all border ${
                                modalVariant?.id === v.id 
                                ? 'bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] border-[#0A0A0A] dark:border-[#555555] shadow-lg' 
                                : 'bg-white dark:bg-[#0A0A0A] border-stone-200 dark:border-white/20 text-[#777777] dark:text-[#A0A0A0] hover:border-[#D4AF37]'
                              }`}
                            >
                              {v.weight >= 1000 ? (v.weight / 1000) + ' КГ' : v.weight + ' Г'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedProduct.category?.name?.toLowerCase().includes('кофе') && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">Помол</span>
                          <div className="grid grid-cols-2 gap-2">
                            {['Мелкий', 'Средний', 'Крупный', 'Зерно'].map(grind => (
                              <button
                                key={grind}
                                onClick={() => setModalGrind(grind)}
                                className={`px-3 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                                  modalGrind === grind 
                                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]' 
                                  : 'bg-white dark:bg-[#0A0A0A] border-stone-100 dark:border-white/10 text-[#777777] dark:text-[#A0A0A0] hover:bg-stone-50'
                                }`}
                              >
                                {grind}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-stone-200 dark:border-white/20 space-y-6">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">Итого</span>
                         <span className="text-3xl md:text-4xl font-serif text-[#0A0A0A] dark:text-[#FDFCFB] leading-none">{modalVariant?.price || 0} ₽</span>
                      </div>

                      <button
                        onClick={handleModalAdd}
                        disabled={!modalVariant || modalVariant.stock === 0}
                        className={`w-full py-5 rounded-full flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-xl ${
                          !modalVariant || modalVariant.stock === 0
                          ? 'bg-stone-200 dark:bg-[#222222] text-stone-400 dark:text-stone-500 cursor-not-allowed'
                          : isModalAdded 
                            ? 'bg-[#D4AF37] text-[#111111] scale-[0.98]' 
                            : 'bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] hover:bg-[#D4AF37] hover:shadow-[#D4AF37]/30'
                        }`}
                      >
                        {modalVariant?.stock === 0 ? (
                          'Нет в наличии'
                        ) : isModalAdded ? (
                          <><Check className="w-5 h-5 stroke-[3]" /> Добавлено</>
                        ) : (
                          <><ShoppingBag className="w-4 h-4" /> В корзину</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-[#111111] rounded-2xl border border-stone-100 dark:border-white/10">
      <div className="w-10 h-10 bg-white dark:bg-[#0A0A0A] rounded-xl flex items-center justify-center shadow-sm border border-stone-100 dark:border-white/10">
        <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
      </div>
      <div>
        <span className="text-[8px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0] block mb-0.5">{label}</span>
        <span className="text-[13px] font-bold text-[#0A0A0A] dark:text-[#FDFCFB] uppercase tracking-tighter">{value}</span>
      </div>
    </div>
  );
}

function FlavorBar({ label, value, max = 5 }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
        <span>{label}</span>
        <span className="text-[#D4AF37]">{value}/{max}</span>
      </div>
      <div className="h-1.5 w-full bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-full bg-[#D4AF37]"
        />
      </div>
    </div>
  );
}

function ProductCard({ item, index, onAdd, onOpenDetails }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedGrind, setSelectedGrind] = useState('Мелкий');
  const [isAdded, setIsAdded] = useState(false);
  const addToBasket = useBasketStore(state => state.addToBasket);

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
    } else {
      return { label: `${stock} шт. в наличии`, color: stock > 5 ? "text-stone-400 dark:text-stone-500" : "text-red-500" };
    }
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

  return (
    <motion.div 
      layoutId={`card-${item.id}`}
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.4 }}
      whileHover={{ y: -10 }}
      className="group flex flex-col h-full bg-white dark:bg-[#0A0A0A] rounded-[56px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-300 relative border border-stone-100 dark:border-white/10"
    >
      {item.isTop && (
        <div className="absolute -top-6 left-10 bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl z-20 border border-stone-100 dark:border-white/10">
          <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" /> Топ продаж
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">{item.region || 'Exclusive'}</span>
        <div className="px-4 py-2 rounded-full bg-stone-50 dark:bg-[#071E14] border border-stone-100 dark:border-[#123927] text-[8px] font-bold uppercase tracking-widest text-stone-400 dark:text-[#88C5A8] group-hover:border-[#D4AF37]/30 transition-colors">
          Specialty
        </div>
      </div>

      <div 
        className="aspect-[4/5] bg-[#FDFCFB] dark:bg-[#040C08] rounded-[48px] mb-10 relative cursor-pointer overflow-hidden flex items-center justify-center p-2 transition-colors duration-700 group-hover:bg-stone-50 dark:group-hover:bg-[#081810]"
        onClick={onOpenDetails}
      >
        <motion.img 
          layoutId={`img-${item.id}`}
          src={item.imageUrl || PLACEHOLDER_IMAGE} 
          className="w-full h-full object-contain scale-105 group-hover:scale-110 transition-all duration-1000 z-10 drop-shadow-2xl" 
          alt={item.name}
        />
        
        <div className="absolute top-8 right-8 bg-white/90 dark:bg-black/90 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl z-20">
          <Info className="w-5 h-5 text-[#0A0A0A] dark:text-[#FDFCFB]" />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-8 cursor-pointer" onClick={onOpenDetails}>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#777777] dark:text-[#A0A0A0] mb-1 block">
            {item.brand || 'Premium Selection'}
          </span>
          <h3 className="text-4xl font-serif text-[#0A0A0A] dark:text-[#FDFCFB] mb-4 leading-tight tracking-tight group-hover:text-[#D4AF37] transition-colors">
            {item.name}
          </h3>
          {isCoffee && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                     {[...Array(5)].map((_, i) => (
                       <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (item.acid || 3) ? 'bg-[#D4AF37]' : 'bg-[#0A0A0A] dark:bg-[#1A1A1A]'}`} />
                     ))}
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Кислотность</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter ${stockInfo.color}`}>
                   {stockInfo.icon && <AlertTriangle className="w-3 h-3" />}
                   {stockInfo.label}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (item.body || 4) ? 'bg-[#D4AF37]' : 'bg-[#0A0A0A] dark:bg-[#1A1A1A]'}`} />
                   ))}
                 </div>
                 <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Горечь</span>
              </div>
            </div>
          )}
          {!isCoffee && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-stone-50/50 rounded-2xl border border-stone-100 dark:border-white/10">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">Градусы</span>
                  <div className="flex items-center gap-2">
                    <Compass className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200">{item.brewing_temp || '90°C'}</span>
                  </div>
                </div>
                
                <div className="w-px h-6 bg-stone-200 dark:bg-[#222222]" />
                
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 text-right">Настой</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 text-right">{item.steeping_time || '5 мин'}</span>
                    <Info className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter ${stockInfo.color}`}>
                 {stockInfo.icon && <AlertTriangle className="w-3 h-3" />}
                 {stockInfo.label}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 mt-auto">
          {/* ВЫБОР ГРАММОВКИ */}
          <div className="space-y-3">
            <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">Объем / Вес</span>
            <div className="flex flex-wrap gap-2.5">
              {item.variants.map(v => (
                <button
                  key={v.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariant(v); }}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all border ${
                    selectedVariant.id === v.id 
                    ? 'bg-[#0A0A0A] text-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20' 
                    : 'bg-transparent border-stone-200 dark:border-white/20 text-[#777777] dark:text-[#A0A0A0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  {v.weight >= 1000 ? (v.weight / 1000) + ' КГ' : v.weight + ' Г'}
                </button>
              ))}
            </div>
          </div>

          {/* ВЫБОР ПОМОЛА ДЛЯ КОФЕ */}
          {isCoffee && (
            <div className="space-y-3">
              <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">Помол</span>
              <div className="flex flex-wrap gap-2">
                {['Мелкий', 'Средний', 'Крупный', 'Зерно'].map(grind => (
                  <button
                    key={grind}
                    onClick={(e) => { e.stopPropagation(); setSelectedGrind(grind); }}
                    className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                      selectedGrind === grind 
                      ? 'bg-[#0A0A0A] text-[#D4AF37] border-[#D4AF37]' 
                      : 'bg-transparent border-stone-200 dark:border-white/20 text-[#777777] dark:text-[#A0A0A0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
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
            className={`w-full py-6 rounded-full flex items-center justify-between px-10 text-[11px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl ${
              selectedVariant.stock === 0
              ? 'bg-stone-200 dark:bg-[#222222] text-stone-400 dark:text-stone-500 cursor-not-allowed'
              : isAdded 
                ? 'bg-[#D4AF37] text-[#111111] scale-[0.98]' 
                : 'bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] hover:shadow-[#D4AF37]/30'
            }`}
          >
            {selectedVariant.stock === 0 ? (
              <span className="mx-auto uppercase">Нет в наличии</span>
            ) : isAdded ? (
              <span className="flex items-center gap-3 mx-auto"><Check className="w-5 h-5 stroke-[3]" /> Добавлено</span>
            ) : (
              <><span>В корзину</span> <span className="font-serif text-xl tracking-normal">{selectedVariant.price} ₽</span></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0A0A] rounded-[56px] p-10 border border-stone-100 dark:border-white/10 shadow-sm animate-pulse relative">
      <div className="flex justify-between items-center mb-8">
        <div className="w-24 h-4 bg-stone-200 dark:bg-[#222222] rounded-full" />
        <div className="w-16 h-6 bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full" />
      </div>
      <div className="aspect-[4/5] bg-stone-50 dark:bg-[#111111] rounded-[48px] mb-10" />
      <div className="flex-1">
        <div className="w-20 h-3 bg-stone-200 dark:bg-[#222222] rounded-full mb-4" />
        <div className="w-full h-8 bg-stone-200 dark:bg-[#222222] rounded-lg mb-2" />
        <div className="w-3/4 h-8 bg-stone-200 dark:bg-[#222222] rounded-lg mb-8" />
        <div className="flex justify-between mb-8">
           <div className="w-12 h-10 bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full" />
           <div className="w-12 h-10 bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
           <div className="w-16 h-8 bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full" />
           <div className="w-16 h-8 bg-[#0A0A0A] dark:bg-[#1A1A1A] rounded-full" />
        </div>
        <div className="w-full h-14 bg-stone-200 dark:bg-[#222222] rounded-full" />
      </div>
    </div>
  );
}
