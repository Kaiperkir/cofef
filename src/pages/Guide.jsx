import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BarChart, Coffee, Leaf, Sparkles, Award } from 'lucide-react';

const guides = {
  "v60": {
    title: "Воронка (V60)",
    time: "5 мин",
    level: "Средний",
    icon: Coffee,
    content: "Метод Hario V60 позволяет максимально раскрыть терруар зерна. Вам понадобится: 15г кофе мелкого помола, 250мл воды (92-94°C), фильтр и весы. Процесс: 1. Смочите фильтр. 2. Предсмачивание (30г воды на 30 сек). 3. Влейте оставшуюся воду круговыми движениями.",
    img: "https://images.pexels.com/photos/4264049/pexels-photo-4264049.jpeg?auto=compress&w=800"
  },
  "cezve": {
    title: "Турка (Джезва)",
    time: "7 мин",
    level: "Профи",
    icon: Sparkles,
    content: "Классика, проверенная веками. Используйте кофе самого мелкого помола (как мука). Пропорция 1:10. Залейте холодной водой, поставьте на медленный огонь. Как только пенка начнет подниматься — снимайте. Повторите дважды, не доводя до кипения.",
    img: "https://images.pexels.com/photos/6805090/pexels-photo-6805090.jpeg?auto=compress&w=800"
  },
  "tea": {
    title: "Церемония чая",
    time: "15 мин",
    level: "Мастер",
    icon: Leaf,
    content: "Для китайского чая важны проливы. Используйте гайвань или маленький исинский чайник. Первый пролив — промывка листа (сразу слить). Каждый следующий пролив увеличивайте на 5-10 секунд. Так вкус будет меняться от чашки к чашке.",
    img: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&w=800"
  },
  "storage": {
    title: "Хранение",
    time: "1 мин",
    level: "База",
    icon: Award,
    content: "Главные враги кофе и чая: кислород, свет, влага и посторонние запахи. Храните только в плотно закрытых зип-пакетах или вакуумных банках в темном сухом месте. Не используйте холодильник — зерно моментально впитает запахи еды.",
    img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&w=800"
  }
};

export default function Guide() {
  const { id } = useParams();
  const guide = guides[id] || guides["v60"];

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#000000] pt-40 pb-20 px-6 font-sans text-[#0A0A0A] dark:text-[#FDFCFB]">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#777777] dark:text-[#A0A0A0] hover:text-[#D4AF37] transition-colors mb-12 text-[10px] font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Назад к истокам
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="relative aspect-video rounded-[48px] overflow-hidden shadow-2xl">
            <img src={guide.img} className="w-full h-full object-cover" alt={guide.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] dark:from-[#D4AF37]/60 to-transparent" />
            <div className="absolute bottom-10 left-10 text-[#111111]">
              <div className="flex gap-4 mb-4">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {guide.time}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <BarChart className="w-3 h-3" /> {guide.level}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif tracking-tight">{guide.title}</h1>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 bg-[#FDFCFB] dark:bg-[#000000] rounded-3xl flex items-center justify-center shrink-0">
                <guide.icon className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-xl leading-relaxed text-[#444444] dark:text-[#D0D0D0] first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
                {guide.content}
              </p>
            </div>
          </div>

          <div className="bg-[#0A0A0A] dark:bg-[#1A1A1A] p-12 rounded-[48px] text-[#111111]">
            <h3 className="text-3xl font-serif mb-6">Совет куратора</h3>
            <p className="text-white/70 leading-relaxed italic border-l-2 border-[#D4AF37] pl-8">
              "Вкус — это субъективно, но техника — это физика. Экспериментируйте с температурой воды и временем пролива, чтобы найти свой идеальный баланс. Помните, что вода составляет 98% вашего напитка, используйте только фильтрованную."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
