import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasketStore } from '../store/useBasketStore';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 'box', title: 'Упаковка', options: [
    { name: 'Массив Дуба', price: 1200, desc: 'Деревянный бокс с гравировкой', img: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400' },
    { name: 'Минимализм', price: 300, desc: 'Плотный крафт-картон и лента', img: 'https://images.unsplash.com/photo-1542841791-1925b02a2bfb?w=400' }
  ]},
  { id: 'coffee', title: 'Основа', options: [
    { name: 'Эфиопия Иргачеффе', price: 850, desc: 'Яркая кислинка, жасмин', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400' },
    { name: 'Дикая Вишня', price: 400, desc: 'Черный чай с сублиматами', img: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?w=400' }
  ]},
  { id: 'sweets', title: 'Детали', options: [
    { name: 'Трюфели (6 шт)', price: 500, desc: 'Темный шоколад и морская соль', img: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=400' },
    { name: 'Кантуччи', price: 350, desc: 'Итальянское печенье с миндалем', img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400' } 
  ]}
];

export default function BasketBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({ box: null, coffee: null, sweets: null });
  const navigate = useNavigate();
  const { addToBasket } = useBasketStore();

  const handleSelect = (option) => {
    setSelections({ ...selections, [STEPS[currentStep].id]: option });
    if (currentStep < STEPS.length - 1) setTimeout(() => setCurrentStep(currentStep + 1), 500);
  };

  const handleFinish = () => {
    const total = (selections.box?.price || 0) + (selections.coffee?.price || 0) + (selections.sweets?.price || 0);
    addToBasket({
      id: Date.now(), name: 'Свой Набор "Уют"', price: total, imageUrl: selections.box?.img || '',
      desc: `${selections.box?.name}, ${selections.coffee?.name}, ${selections.sweets?.name}`,
    });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1C1614] dark:text-[#F6F1E9] pt-40 pb-32 px-8 font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 border-b border-white/5 pb-16">
          <div>
            <Link to="/catalog" className="flex items-center gap-2 text-[#777777] dark:text-[#A0A0A0] hover:text-[#C06334] dark:hover:text-[#D4AF37] transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Вернуться в ассортимент</span>
            </Link>
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none italic">Свой Набор.</h1>
          </div>
          <div className="flex gap-12">
            {STEPS.map((s, idx) => (
              <div key={idx} className={`text-center space-y-2 transition-opacity duration-500 ${idx <= currentStep ? 'opacity-100' : 'opacity-20'}`}>
                <p className="text-[9px] font-black uppercase tracking-widest">{s.title}</p>
                <div className={`h-1 w-full ${idx === currentStep ? 'bg-[#C06334] dark:bg-[#D4AF37]' : 'bg-[#1C1614] dark:bg-[#362A25]'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            <AnimatePresence mode="popLayout">
              {STEPS[currentStep].options.map((opt) => {
                const isSelected = selections[STEPS[currentStep].id]?.name === opt.name;
                return (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={opt.name} onClick={() => handleSelect(opt)}
                    className={`bg-white dark:bg-[#1C1614] p-10 cursor-pointer flex flex-col gap-8 transition-all duration-500 hover:bg-[#F6F1E9] relative ${
                      isSelected ? 'z-10 shadow-[0_40px_100px_rgba(44,30,22,0.1)]' : ''
                    }`}
                  >
                    <div className="aspect-[4/3] bg-[#F6F1E9] dark:bg-[#140F0D] overflow-hidden rounded-2xl">
                      <img src={opt.img} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-serif text-3xl italic leading-tight">{opt.name}</h4>
                        <span className="font-serif text-lg font-bold text-[#C06334] dark:text-[#D4AF37]">+{opt.price} ₽</span>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-2 text-[#C06334] dark:text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mt-auto">
                          <Check className="w-4 h-4" /> Выбрано
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {selections.box && selections.coffee && selections.sweets && currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-20 text-center">
              <button onClick={handleFinish} className="bg-[#1C1614] dark:bg-[#362A25] text-[#1C1614] dark:text-[#F6F1E9] px-16 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#C06334] dark:hover:bg-[#D4AF37] transition-all inline-flex items-center gap-6 shadow-2xl">
                Завершить сборку <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
