import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, BarChart, Coffee, Leaf, Sparkles, Award,
  CheckCircle2, ChevronRight, Thermometer, Scale, Droplets, Package
} from 'lucide-react';

const guides = {
  v60: {
    title: 'Воронка (V60)',
    subtitle: 'Японская точность в каждой капле',
    time: '5 мин',
    level: 'Средний',
    levelColor: 'text-[#D4AF37]',
    icon: Coffee,
    img: 'https://picsum.photos/id/430/1200/600',
    accentColor: '#C06334',
    intro:
      'Hario V60 — это метод пуровера, раскрывающий лучшие ноты зерна благодаря полному контролю над процессом заваривания. Результат — прозрачная чашка с ярким, многогранным вкусом.',
    equipment: [
      { icon: Coffee, label: 'Воронка V60 (размер 02)' },
      { icon: Package, label: 'Фильтр V60 (белый или натуральный)' },
      { icon: Scale, label: 'Весы с таймером' },
      { icon: Thermometer, label: 'Чайник-гусь (гусиный носик)' },
      { icon: Droplets, label: '250 мл воды, 92–94°C' },
      { icon: Coffee, label: '15 г кофе, помол средний-мелкий' },
    ],
    steps: [
      {
        title: 'Подготовка',
        time: '0:00',
        desc: 'Вставьте бумажный фильтр в воронку. Промойте его горячей водой, чтобы убрать бумажный привкус и прогреть сервер и чашку. Слейте промывочную воду.',
      },
      {
        title: 'Засыпка кофе',
        time: '0:30',
        desc: 'Засыпьте 15 г свежемолотого кофе в фильтр. Слегка встряхните воронку, чтобы выровнять слой. Установите на весы и обнулите показания.',
      },
      {
        title: 'Предсмачивание (блюм)',
        time: '1:00',
        desc: 'Налейте 30–40 г воды (≈ двойная масса кофе). Равномерно смочите весь кофе круговыми движениями от центра к краям. Ждите 30–45 секунд — газ выходит из свежей обжарки, кофе «цветёт».',
      },
      {
        title: 'Первый пролив',
        time: '1:45',
        desc: 'Медленно вливайте воду круговыми движениями до отметки 150 г. Держите чайник на высоте 5–10 см над кофе. Темп — равномерный, без спешки.',
      },
      {
        title: 'Второй пролив',
        time: '2:30',
        desc: 'Когда уровень воды немного опустится, долейте до 250 г. Снова — круговыми спиральными движениями. Центр → края → центр.',
      },
      {
        title: 'Слив и подача',
        time: '3:00–3:30',
        desc: 'Дождитесь полного стекания. Вся заварка должна уйти за 3:00–3:30 с момента первого влития. Если быстрее — помол крупнее. Медленнее — мельче. Ваш напиток готов.',
      },
    ],
    tip: 'Температура воды критична: при 92°C кофе раскрывается мягче, при 94°C — интенсивнее. Вода составляет 98% напитка — используйте только фильтрованную или бутилированную с нейтральным pH.',
    curator: 'Ключ к V60 — это работа с водой. Не торопитесь: равномерный, спокойный пролив даёт гораздо более сбалансированный вкус, чем быстрый.'
  },
  cezve: {
    title: 'Турка (Джезва)',
    subtitle: 'Тысячелетний ритуал Востока',
    time: '7 мин',
    level: 'Профи',
    levelColor: 'text-[#C06334]',
    icon: Sparkles,
    img: 'https://picsum.photos/id/63/1200/600',
    accentColor: '#D4AF37',
    intro:
      'Турецкий кофе — это не просто напиток, это медитация. Медленный огонь, нежная пенка и аромат кардамома — турка требует терпения и вознаграждает за него.',
    equipment: [
      { icon: Coffee, label: 'Медная или стальная турка (200 мл)' },
      { icon: Coffee, label: '2 ч. л. кофе (7–10 г), помол — как мука' },
      { icon: Droplets, label: '150 мл холодной воды' },
      { icon: Sparkles, label: '1 щепотка кардамона (по желанию)' },
      { icon: Scale, label: 'Сахар по вкусу' },
      { icon: Thermometer, label: 'Источник тепла: газ или песок' },
    ],
    steps: [
      {
        title: 'Засыпка',
        time: '0:00',
        desc: 'В холодную турку засыпьте кофе и сахар (если нужен). Всыпьте щепотку кардамона. Никогда не засыпайте кофе в горячую воду — вкус будет плоским.',
      },
      {
        title: 'Залив воды',
        time: '0:15',
        desc: 'Залейте холодную воду до сужения горлышка турки — примерно ⅔ объёма. Перемешайте. Поставьте на самый медленный огонь.',
      },
      {
        title: 'Первый подъём',
        time: '2:00–3:00',
        desc: 'Наблюдайте за туркой. Никогда не отходите! Как только тёмная пенка начнёт медленно подниматься — СРАЗУ снимите с огня. Не кипятите.',
      },
      {
        title: 'Первый сброс',
        time: '3:00',
        desc: 'Как только пенка поднялась — снимите и дайте осесть 15–20 секунд. Ложкой снимите немного пенки в чашку. Она — самая ароматная часть напитка.',
      },
      {
        title: 'Второй подъём',
        time: '3:30',
        desc: 'Снова на медленный огонь. Второй раз дождитесь поднятия пенки и снимите. Повторите 2–3 раза для самого насыщенного результата.',
      },
      {
        title: 'Подача',
        time: '4:30',
        desc: 'Перелейте в маленькую чашку медленно — чтобы гуща осела на дне. Дайте постоять 1 минуту перед первым глотком. Подавайте с холодной водой.',
      },
    ],
    tip: 'Настоящий мастер никогда не доводит турку до кипения — как только кофе закипел, напиток испорчен. Пенка — это «крема» турецкого кофе, берегите её.',
    curator: 'Главный секрет: медленный огонь и холодная вода в начале. Такой «термошок» помогает кофе медленно нагреться и отдать максимум вкуса и аромата.'
  },
  tea: {
    title: 'Церемония чая',
    subtitle: 'Гунфу-ча: путь совершенства',
    time: '15 мин',
    level: 'Мастер',
    levelColor: 'text-[#4A7C59]',
    icon: Leaf,
    img: 'https://picsum.photos/id/225/1200/600',
    accentColor: '#4A7C59',
    intro:
      'Гунфу-ча (功夫茶) — это китайская чайная практика многократных коротких проливов. Каждая чашка — новая встреча с тем же листом. Вкус меняется от пролива к проливу.',
    equipment: [
      { icon: Coffee, label: 'Гайвань (110–150 мл) или исинский чайник' },
      { icon: Package, label: 'Че Хэ (茶荷) — бамбуковый совок' },
      { icon: Droplets, label: 'Вода: 90–95°C для улуна, 80–85°C для зелёного' },
      { icon: Scale, label: '4–6 г рассыпного листа на 100 мл' },
      { icon: Coffee, label: 'Чайный поднос (или миска для слива)' },
      { icon: Sparkles, label: 'Чашки пиньча — маленькие, без ручек' },
    ],
    steps: [
      {
        title: 'Прогрев посуды',
        time: '0:00',
        desc: 'Залейте гайвань горячей водой до краёв, выдержите 10 секунд, слейте. Это убирает посторонние запахи и создаёт правильную температуру для чайника.',
      },
      {
        title: 'Закладка листа',
        time: '1:00',
        desc: 'Насыпьте 4–6 г листа. Понюхайте сухой лист в прогретой гайвани — это первый «нос» напитка. Тугие скрученные листы расправятся постепенно.',
      },
      {
        title: 'Промывка (первый пролив)',
        time: '1:30',
        desc: 'Залейте горячую воду быстро, накройте крышкой и СРАЗУ слейте — 3–5 секунд. Этот пролив не пьют: он смывает пыль, пробуждает лист и «открывает» аромат.',
      },
      {
        title: 'Второй пролив — первый к столу',
        time: '2:00',
        desc: 'Залейте воду мягкой струёй по краю гайвани (не на लист прямо). Выдержите 20–30 секунд. Слейте через крышку-фильтр в чашки. Это вкус первого знакомства.',
      },
      {
        title: 'Третий и последующие проливы',
        time: '3:30',
        desc: 'Каждый следующий пролив — на 5–10 секунд дольше предыдущего. Хороший высокогорный улун даёт 7–10 насыщенных проливов. Наблюдайте, как раскрываются новые грани.',
      },
      {
        title: 'Финал',
        time: '13:00',
        desc: 'Последний пролив часто самый мягкий и сладкий. Разверните заваренный лист, рассмотрите — целый, живой и ароматный лист говорит о высоком качестве.',
      },
    ],
    tip: 'Никогда не заливайте зелёный или белый чай кипятком: 80–85°C — максимум. Кипяток «обжигает» лист и добавляет горечь. Дайте кипятку остыть 3–5 минут в открытом чайнике.',
    curator: 'Гунфу — это не рецепт, это практика. Каждый раз вы немного меняете время, температуру, количество листа. Именно через эти эксперименты приходит понимание чая.'
  },
  storage: {
    title: 'Хранение',
    subtitle: 'Сохрани вкус от первой чашки до последней',
    time: '1 мин',
    level: 'База',
    levelColor: 'text-stone-500',
    icon: Award,
    img: 'https://picsum.photos/id/292/1200/600',
    accentColor: '#4A3B32',
    intro:
      'Специальный кофе или редкий чай — инвестиция. Правильное хранение означает разницу между яркой, живой чашкой и безвкусным напитком, хотя пакет тот же самый.',
    equipment: [
      { icon: Package, label: 'Вакуумный контейнер с клапаном' },
      { icon: Package, label: 'Зип-пакет с клапаном дегазации (от обжарщика)' },
      { icon: Award, label: 'Тёмное, прохладное место' },
      { icon: Thermometer, label: 'Температура: 15–22°C (комнатная)' },
    ],
    steps: [
      {
        title: 'Правило. Враги кофе и чая',
        time: '',
        desc: 'Кислород окисляет масла. Свет разрушает летучие ароматы. Влага запускает гниение и плесень. Чужие запахи — кофе и чай впитывают всё вокруг. Избегайте всего этого.',
      },
      {
        title: 'Идеальная тара',
        time: '',
        desc: 'Лучший вариант — оригинальный зип-пакет от обжарщика с клапаном дегазации: он выпускает CO₂ из зерна, но не пускает кислород внутрь. Стекло с вакуумной крышкой — второй вариант.',
      },
      {
        title: 'Где хранить',
        time: '',
        desc: 'Шкаф вдали от плиты, не у окна. Не в прозрачном контейнере. Не рядом со специями, луком, чесноком. Кофе на прилавке — это красиво, но губительно для вкуса.',
      },
      {
        title: 'Холодильник и морозилка',
        time: '',
        desc: 'Холодильник — табу. Конденсат и чужие запахи разрушают кофе мгновенно. Морозилка допустима лишь для больших запасов: порционно, в герметичных пакетах. Размороженное — уже не замораживайте.',
      },
      {
        title: 'Когда пить',
        time: '',
        desc: 'Спешелти кофе оптимален на 7–21 день после обжарки. Слишком свежий (1–3 дня) — нестабильный, газирует в чашке. Старше 4–6 недель (зерно) или 2 недель (молотый) — вкус теряется.',
      },
      {
        title: 'Чай',
        time: '',
        desc: 'Пуэр и улун — чем старше, тем ценнее (при правильном хранении). Зелёный и белый чай — пейте в течение года. Все виды: плотно закрытая жестянка или фольгированный пакет, вдали от запахов.',
      },
    ],
    tip: 'Никогда не покупайте молотый кофе впрок. Молотый кофе теряет 60% аромата в первые 15 минут после помола. Мелите только на одну заварку.',
    curator: 'Лучший контейнер для кофе — тот, который плотно закрывается и который вы действительно используете. Идеальный на полке хуже простого зип-пакета в шкафу.'
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
};

export default function Guide() {
  const { id } = useParams();
  const guide = guides[id] || guides.v60;
  const Icon = guide.icon;
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#140F0D] pb-24 font-sans text-[#1C1614] dark:text-[#F6F1E9]">
      {/* ── Hero ── */}
      <div className="relative w-full h-[50vh] min-h-[380px] overflow-hidden">
        <img
          src={guide.img}
          alt={guide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1614] via-[#1C1614]/50 to-transparent" />

        {/* Back link */}
        <div className="absolute top-0 left-0 right-0 pt-28 px-6 md:px-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Назад к азбуке
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-10 left-6 md:left-16 right-6 md:right-16">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-white/15 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3" /> {guide.time}
            </span>
            <span className={`bg-white/15 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}>
              <BarChart className="w-3 h-3" /> {guide.level}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter text-white leading-none">
            {guide.title}
          </h1>
          <p className="text-white/60 text-base md:text-lg mt-3 font-light">{guide.subtitle}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* Intro */}
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl leading-relaxed text-[#444444] dark:text-[#D0D0D0] font-light max-w-3xl"
          >
            {guide.intro}
          </motion.p>

          {/* Equipment */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C06334] dark:text-[#D4AF37] mb-6">
              Что понадобится
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {guide.equipment.map((eq, i) => {
                const EqIcon = eq.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[20px] px-5 py-4 flex items-center gap-3"
                  >
                    <EqIcon className="w-4 h-4 shrink-0 text-[#C06334] dark:text-[#D4AF37]" />
                    <span className="text-xs font-medium leading-snug">{eq.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C06334] dark:text-[#D4AF37] mb-8">
              Пошаговый процесс
            </h2>
            <div className="space-y-0">
              {guide.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  className="w-full text-left group"
                >
                  <div className={`flex gap-6 border-b border-[#EADFD8] dark:border-[#4A3B32] py-6 transition-colors ${activeStep === i ? '' : 'hover:bg-white/30 dark:hover:bg-white/5'}`}>
                    {/* Number */}
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                      activeStep === i
                        ? 'bg-[#C06334] dark:bg-[#D4AF37] text-white dark:text-[#1C1614]'
                        : 'bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] text-[#C06334] dark:text-[#D4AF37]'
                    }`}>
                      {activeStep === i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg md:text-xl font-serif tracking-tight">{step.title}</h3>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          {step.time && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 font-price">
                              {step.time}
                            </span>
                          )}
                          <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${activeStep === i ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                        </div>
                      </div>

                      {/* Expanded content */}
                      {activeStep === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-base leading-relaxed text-[#444444] dark:text-[#D0D0D0] mt-3 pr-4"
                        >
                          {step.desc}
                        </motion.p>
                      )}
                      {activeStep !== i && (
                        <p className="text-sm text-stone-400 dark:text-stone-500 line-clamp-1 pr-4">{step.desc}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tip block */}
          <motion.div
            variants={fadeUp}
            className="bg-[#1C1614] dark:bg-[#2A201D] rounded-[40px] p-10 md:p-14 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
              style={{ background: `radial-gradient(circle, ${guide.accentColor}, transparent)`, transform: 'translate(30%, -30%)' }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Icon className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Важно знать</span>
              </div>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light">{guide.tip}</p>
            </div>
          </motion.div>

          {/* Curator note */}
          <motion.div
            variants={fadeUp}
            className="border-l-4 border-[#C06334] dark:border-[#D4AF37] pl-8 py-4"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C06334] dark:text-[#D4AF37] mb-4">
              Слово куратора
            </p>
            <p className="text-xl md:text-2xl font-serif italic text-[#1C1614] dark:text-[#F6F1E9] leading-relaxed">
              «{guide.curator}»
            </p>
          </motion.div>

          {/* Navigation to other guides */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 dark:text-stone-500 mb-6">
              Другие гайды
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(guides)
                .filter(([key]) => key !== id)
                .map(([key, g]) => {
                  const GIcon = g.icon;
                  return (
                    <Link
                      key={key}
                      to={`/guide/${key}`}
                      className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[24px] p-6 flex flex-col gap-3 hover:border-[#C06334] dark:hover:border-[#D4AF37] hover:shadow-lg transition-all group"
                    >
                      <GIcon className="w-5 h-5 text-[#C06334] dark:text-[#D4AF37]" />
                      <div>
                        <p className="font-serif text-base tracking-tight leading-tight">{g.title}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mt-1">{g.time} · {g.level}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#C06334] dark:group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all mt-auto" />
                    </Link>
                  );
                })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
