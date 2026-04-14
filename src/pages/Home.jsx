import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Gift, Coffee, Award, Sparkles, Leaf, ShoppingBag } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="snap-container font-sans bg-[#FDFCFB] dark:bg-[#000000]">
      
      {/* СЕКЦИЯ 1: БУТИК (ГЛАВНАЯ) */}
      <section className="snap-section flex items-center justify-center px-6 relative overflow-hidden bg-[#FDFCFB] dark:bg-[#000000]">
        {/* Static Background Gradients instead of heavy animated ones */}
        <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
          <h2 className="text-[25vw] font-serif font-black uppercase leading-none">БУТИК</h2>
        </div>

        <div className="max-w-7xl mx-auto w-full z-10 grid lg:grid-cols-2 gap-16 items-center mt-10">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1 }}>
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block drop-shadow-sm">Кофейный куратор</span>
            <h1 className="text-7xl lg:text-[130px] font-serif leading-[0.85] tracking-tighter mb-10 text-[#0A0A0A] dark:text-[#FDFCFB] relative z-10">
              Чашка <br /> 
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#0A0A0A] dark:from-[#D4AF37] dark:to-[#FDFCFB]">Уюта.</span>
            </h1>
            <p className="max-w-md text-[#444444] dark:text-[#D0D0D0] text-lg font-light leading-relaxed mb-12">
              Мы отобрали лучшие лоты от топовых обжарщиков и плантаторов. В нашей коллекции — только проверенное качество, исключительный вкус и эстетика в каждой детали.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link to="/catalog" className="inline-flex items-center justify-center gap-4 bg-[#0A0A0A] dark:bg-[#FDFCFB] text-white dark:text-[#0A0A0A] px-10 py-6 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] hover:text-white dark:hover:text-white transition-all duration-500 shadow-xl shadow-[#0A0A0A]/20 group hover:shadow-[#D4AF37]/40 hover:-translate-y-1">
                Витрина сортов <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/builder" className="inline-flex items-center justify-center gap-4 bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/30 px-10 py-6 rounded-full font-bold uppercase tracking-widest text-[10px] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all shadow-xl shadow-[#0A0A0A]/20 group hover:shadow-[#D4AF37]/40 hover:-translate-y-1">
                <Gift className="w-4 h-4 group-hover:text-[#0A0A0A] transition-colors" /> Собрать подарок
              </Link>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="hidden lg:block relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/30 to-transparent rounded-[50px] transform group-hover:scale-105 transition-transform duration-700 blur-[30px] -z-10" />
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop" 
              className="rounded-[50px] shadow-2xl object-cover h-[750px] w-full border border-white/60" 
              alt="Магазин кофе" 
            />
            <div className="absolute -bottom-6 -left-6 p-8 rounded-[30px] shadow-2xl font-serif italic text-3xl text-[#0A0A0A] dark:text-[#FDFCFB] glass border border-white/40 group-hover:-translate-y-2 transition-transform duration-500 z-20">
              С любовью
            </div>
          </motion.div>
        </div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50 text-[#0A0A0A] dark:text-[#FDFCFB]"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* СЕКЦИЯ 2: ИСКУССТВО ОТБОРА */}
      <section className="snap-section flex items-center justify-center px-6 bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] relative">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="order-2 lg:order-1 relative">
             <div className="grid grid-cols-2 gap-4">
               <img src="https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&w=600" className="rounded-[30px] object-cover h-[400px] w-full mt-12" alt="Зерна кофе" loading="lazy" decoding="async" />
               <img src="https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&w=600" className="rounded-[30px] object-cover h-[400px] w-full" alt="Чай" loading="lazy" decoding="async" />
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="order-1 lg:order-2">
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Философия вкуса</span>
            <h2 className="text-5xl lg:text-7xl font-serif leading-[1.1] tracking-tight mb-8">
              Искусство <br /> <span className="italic font-light text-white/50">Отбора.</span>
            </h2>
            <p className="max-w-md text-white/70 text-lg font-light leading-relaxed mb-10">
              Каждый сорт в нашей коллекции — это результат тщательного отбора и дегустации. Мы предлагаем только зерна категории Specialty и чайные листы высшего грейда.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[11px] mb-2">Оценка SCA 80+</h4>
                  <p className="text-white/50 text-sm leading-relaxed">Только лучшие лоты с выдающимися характеристиками. Мы сделаем идеальный помол специально под ваш заказ прямо перед отправкой.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 text-[#111111]">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* СЕКЦИЯ 3: АЗБУКА ВКУСА / ГАЙДЫ */}
      <section className="snap-section flex flex-col items-center justify-center px-6 bg-white dark:bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="mb-20">
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Кураторская школа</span>
            <h2 className="text-5xl lg:text-7xl font-serif leading-tight text-[#0A0A0A] dark:text-[#FDFCFB]">
              Азбука <span className="italic font-light text-[#777777] dark:text-[#A0A0A0]">Вкуса.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                id: "v60",
                title: "Воронка (V60)", 
                time: "5 мин", 
                level: "Средний", 
                desc: "Как раскрыть всю кислотность и цветочные ноты светлой обжарки дома.",
                icon: Coffee
              },
              { 
                id: "cezve",
                title: "Турка", 
                time: "7 мин", 
                level: "Профи", 
                desc: "Секреты плотного тела и густой пенки по всем канонам востока.",
                icon: Sparkles
              },
              { 
                id: "tea",
                title: "Церемония чая", 
                time: "15 мин", 
                level: "Мастер", 
                desc: "Правильные проливы для раскрытия многогранного вкуса чая.",
                icon: Leaf
              },
              { 
                id: "storage",
                title: "Хранение", 
                time: "1 мин", 
                level: "База", 
                desc: "Как сохранить аромат кофе на месяцы.",
                icon: Award
              }
            ].map((guide, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-[#FDFCFB] dark:bg-[#111111] p-10 rounded-[40px] border border-white/5 hover:shadow-xl hover:shadow-[#0A0A0A]/5 transition-all group cursor-pointer"
                onClick={() => navigate(`/guide/${guide.id}`)}
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-white dark:bg-[#0A0A0A] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#D4AF37] group-hover:text-white transition-colors"
                >
                  <guide.icon className="w-6 h-6" />
                </motion.div>
                <div className="flex gap-4 mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">{guide.time}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#777777] dark:text-[#A0A0A0]">{guide.level}</span>
                </div>
                <h4 className="text-2xl font-serif mb-4 text-[#0A0A0A] dark:text-[#FDFCFB]">{guide.title}</h4>
                <p className="text-[12px] text-[#444444] dark:text-[#D0D0D0] leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 h-0 group-hover:h-auto overflow-hidden">
                  {guide.desc}
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#0A0A0A] dark:text-[#FDFCFB] flex items-center gap-2 group-hover:gap-4 transition-all">
                  Читать гайд <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ 4: КОЛЛЕКЦИЯ */}
      <section className="snap-section flex flex-col items-center justify-center px-6 bg-[#FDFCFB] dark:bg-[#000000]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Каталог</span>
          <h2 className="text-5xl lg:text-6xl font-serif leading-tight text-[#0A0A0A] dark:text-[#FDFCFB]">
            Исследуйте <span className="italic font-light text-[#777777] dark:text-[#A0A0A0]">Коллекцию</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          {[
            { title: "Specialty Кофе", img: "https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&w=600" },
            { title: "Элитный Чай", img: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&w=600" },
            { title: "Подарочные Наборы", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&w=600" }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.2 }}>
              <Link to="/catalog" className="group block relative rounded-[40px] overflow-hidden aspect-[4/5]">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] dark:from-[#D4AF37]/90 via-[#0A0A0A]/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-[#111111] text-3xl font-serif">{item.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* СЕКЦИЯ 5: КОНТАКТЫ */}
      <section className="snap-section flex items-center justify-center px-6 bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto w-full z-10 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Ваш уют</span>
            <h2 className="text-6xl lg:text-[100px] font-serif leading-[0.9] tracking-tighter mb-12">
              Время <br /> <span className="italic font-light text-white/40">Для себя.</span>
            </h2>
            
            <p className="max-w-md text-white/60 text-xl font-serif leading-relaxed italic mb-12">
              Мы верим, что каждая чашка кофе — это возможность замедлиться и насладиться моментом. Ждем вас в нашем уютном пространстве.
            </p>

            <Link to="/catalog" className="inline-flex items-center gap-4 bg-[#D4AF37] text-[#111111] px-10 py-6 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-[#0A0A0A] transition-all shadow-xl group">
              Перейти к покупкам <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="relative h-[600px] rounded-[48px] overflow-hidden group">
            <img src="https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&w=800" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt="Магазин" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-all" />
            <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 dark:bg-black/50 backdrop-blur-md rounded-[32px] border border-stone-200 dark:border-white/20">
               <p className="text-sm font-light text-[#111111] dark:text-white leading-relaxed italic opacity-90 text-center drop-shadow-md">
                 "Мы создали пространство, где время замедляется, а вкус раскрывается в полной мере."
               </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
