import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Instagram } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#140F0D] pt-32 pb-20 font-sans text-[#1C1614] dark:text-[#F6F1E9]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Заголовок */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24 mt-10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-6 block">Философия вкуса</span>
          <h1 className="text-5xl md:text-8xl font-serif tracking-tighter mb-8 italic">О нас и нашем кофе</h1>
          <p className="text-lg md:text-2xl text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-6">
            Мы — не просто магазин. Мы — проводники в мир исключительного спешелти кофе и премиального чая. Наша цель — сделать так, чтобы каждая ваша чашка была не просто утренней рутиной, а настоящим гастрономическим открытием.
          </p>
          <p className="text-base md:text-lg text-stone-500 dark:text-stone-400 font-light leading-relaxed">
            Всё началось с одной простой идеи: кофе должен говорить сам за себя. За каждым зерном стоит огромный труд фермеров, особенности климата, высота произрастания и мастерство обжарщика. Мы объединили эти элементы, чтобы принести в ваш дом вкус, который заставляет остановиться и насладиться моментом.
          </p>
        </motion.div>

        {/* Эмоциональный баннер или цитата */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-[#1C1614] dark:bg-[#0A1A12] text-[#F6F1E9] dark:text-[#EADFD8] rounded-[40px] md:rounded-[60px] p-12 md:p-24 text-center mb-32 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <h2 className="text-3xl md:text-5xl font-serif italic mb-6 relative z-10">"Кофе — это не напиток. Это искусство мгновения."</h2>
          <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-[#D4AF37] relative z-10">— Наш главный роаст-мастер</p>
        </motion.div>

        {/* Блоки с контентом */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1C1614] p-10 rounded-[40px] border border-[#EADFD8] dark:border-[#4A3B32] shadow-xl shadow-black/5 hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-serif italic mb-4">Терруар и фермы</h3>
            <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed text-sm md:text-base">
              Мы путешествуем по кофейному поясу земли, от Эфиопии до Колумбии, выстраивая прямые отношения (Direct Trade) с фермерами. Мы точно знаем, на какой высоте выросла ягода и как она была обработана.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#C06334] dark:bg-[#D4AF37] p-10 rounded-[40px] text-white dark:text-[#1C1614] shadow-xl shadow-[#C06334]/20 dark:shadow-[#D4AF37]/20 hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-serif italic mb-4">Искусство обжарки</h3>
            <p className="opacity-90 font-light leading-relaxed text-sm md:text-base">
              Используем передовые ростеры Probat и Loring. Мы создаем индивидуальный профиль обжарки для каждого микролота, чтобы вытянуть максимум сладости и сохранить тонкие энзимные ноты.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-[#1C1614] p-10 rounded-[40px] border border-[#EADFD8] dark:border-[#4A3B32] shadow-xl shadow-black/5 hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-serif italic mb-4">SCA Стандарты</h3>
            <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed text-sm md:text-base">
              Весь наш кофе проходит строгий каппинг. В наш ассортимент попадает только спешелти сегмент — лоты, получившие оценку Q-грейдеров не ниже 84 баллов. Это элита кофейного мира.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#F6F1E9] dark:bg-[#2A201D] p-10 rounded-[40px] border border-[#EADFD8] dark:border-[#4A3B32] shadow-inner hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-serif italic mb-4">Чайная коллекция</h3>
            <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed text-sm md:text-base">
              Мы не забываем и про чай. Наша коллекция включает редкие улуны, выдержанные пуэры и нежные белые чаи, собранные вручную на высокогорных плантациях Азии.
            </p>
          </motion.div>
        </div>

        {/* Секция Контакты и Карта */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Контакты */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-serif tracking-tighter mb-8">Наши контакты</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white dark:bg-[#1C1614] rounded-full flex items-center justify-center shrink-0 border border-[#EADFD8] dark:border-[#4A3B32] group-hover:border-[#D4AF37] transition-colors shadow-sm">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Адрес</h3>
                    <p className="text-lg font-medium">г. Моздок, Юбилейная 57А</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Ежедневно, без выходных</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white dark:bg-[#1C1614] rounded-full flex items-center justify-center shrink-0 border border-[#EADFD8] dark:border-[#4A3B32] group-hover:border-[#D4AF37] transition-colors shadow-sm">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Режим работы</h3>
                    <p className="text-lg font-medium">08:00 – 22:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white dark:bg-[#1C1614] rounded-full flex items-center justify-center shrink-0 border border-[#EADFD8] dark:border-[#4A3B32] group-hover:border-[#D4AF37] transition-colors shadow-sm">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Телефон</h3>
                    <a href="tel:+78002223344" className="text-lg font-medium font-price hover:text-[#D4AF37] transition-colors">8 800 222-33-44</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#EADFD8] dark:border-[#4A3B32]">
              <h3 className="font-bold text-sm uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-6">Мы в соцсетях</h3>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 bg-white dark:bg-[#1C1614] rounded-full flex items-center justify-center border border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm group">
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-14 h-14 bg-white dark:bg-[#1C1614] rounded-full flex items-center justify-center border border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm group">
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Яндекс Карта */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full h-[500px] md:h-[600px] bg-white dark:bg-[#1C1614] rounded-[40px] p-2 md:p-4 border border-[#EADFD8] dark:border-[#4A3B32] shadow-2xl relative overflow-hidden"
          >
            <div className="w-full h-full rounded-[32px] overflow-hidden bg-stone-100 dark:bg-stone-900">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?text=г.+Моздок,+Юбилейная+улица,+57А&z=17" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                title="Мы на Яндекс Карте"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
