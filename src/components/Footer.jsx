import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Clock, Phone, Mail, Send, Heart, Instagram, Youtube } from 'lucide-react';

const FooterLink = ({ to, children, external }) => {
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm font-light leading-relaxed block py-1"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to={to}
      className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm font-light leading-relaxed block py-1"
    >
      {children}
    </Link>
  );
};

const FooterHeading = ({ children }) => (
  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 mb-6">
    {children}
  </h4>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1614] dark:bg-[#0D0A09] border-t border-white/5 font-sans">
      <div className="max-w-[1800px] mx-auto px-8 pt-16 pb-10">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 mb-16">

          {/* ── Колонка 1: Бренд ── */}
          <div className="space-y-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Coffee className="w-4 h-4 text-[#1C1614]" />
              </div>
              <div>
                <span className="block text-lg font-serif text-white italic tracking-tight leading-none">
                  Чашка Уюта
                </span>
                <span className="block text-[8px] font-bold uppercase tracking-[0.4em] text-white/30 mt-0.5">
                  Purveyors of Coffee
                </span>
              </div>
            </Link>

            <p className="text-white/35 text-sm font-light leading-relaxed max-w-[220px]">
              Specialty кофе и чай высшего грейда от лучших обжарщиков мира — прямо к вашей двери.
            </p>

            {/* Соц. сети */}
            <div className="flex gap-3">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://vk.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                aria-label="ВКонтакте"
              >
                <span className="text-xs font-black">VK</span>
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ── Колонка 2: Магазин ── */}
          <div>
            <FooterHeading>Магазин</FooterHeading>
            <nav className="space-y-0.5">
              <FooterLink to="/catalog">Весь ассортимент</FooterLink>
              <FooterLink to="/catalog">Кофе в зёрнах</FooterLink>
              <FooterLink to="/catalog">Молотый кофе</FooterLink>
              <FooterLink to="/catalog">Элитный чай</FooterLink>
              <FooterLink to="/catalog">Подарочные наборы</FooterLink>
              <FooterLink to="/favorites">Избранное</FooterLink>
              <FooterLink to="/cart">Корзина</FooterLink>
            </nav>
          </div>

          {/* ── Колонка 3: Поддержка и гайды ── */}
          <div>
            <FooterHeading>Поддержка</FooterHeading>
            <nav className="space-y-0.5">
              <FooterLink to="/guide/v60">Гайд: Воронка V60</FooterLink>
              <FooterLink to="/guide/cezve">Гайд: Турка</FooterLink>
              <FooterLink to="/guide/tea">Гайд: Чайная церемония</FooterLink>
              <FooterLink to="/guide/storage">Гайд: Хранение</FooterLink>
            </nav>

            <div className="mt-10">
              <FooterHeading>Информация</FooterHeading>
              <nav className="space-y-0.5">
                <FooterLink to="/auth">Войти / Регистрация</FooterLink>
                <FooterLink to="/profile">Личный кабинет</FooterLink>
                <FooterLink to="/profile">История заказов</FooterLink>
              </nav>
            </div>
          </div>

          {/* ── Колонка 4: Контакты ── */}
          <div>
            <FooterHeading>Контакты</FooterHeading>

            {/* Phone big */}
            <a
              href="tel:+78002223344"
              className="block text-2xl lg:text-3xl font-price text-white hover:text-[#D4AF37] transition-colors mb-1 tracking-tight whitespace-nowrap"
            >
              8 800 222-33-44
            </a>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-8">
              Бесплатно по России
            </p>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/60 text-sm leading-snug">Моздок, Юбилейная 57А</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm leading-snug">Ежедневно: 09:00 — 20:00</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <a
                  href="mailto:hello@chashkauyta.ru"
                  className="text-white/60 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  hello@chashkauyta.ru
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <a
                  href="tel:+78002223344"
                  className="text-white/60 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Связаться с поддержкой
                </a>
              </div>
            </div>

            {/* Write to us button */}
            <a
              href="mailto:hello@chashkauyta.ru"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 border border-white/10 hover:border-[#D4AF37]/40 text-white/40 hover:text-[#D4AF37] rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <Send className="w-3 h-3" /> Написать нам
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/20 text-xs font-light tracking-widest">
            © {year} Чашка Уюта. Все права защищены.
          </p>
          <div className="flex items-center gap-1 text-white/20 text-xs">
            <span>Сделано с</span>
            <Heart className="w-3 h-3 fill-[#C06334] text-[#C06334] mx-1" />
            <span>для ценителей вкуса</span>
          </div>
          <div className="flex gap-6">
            <span className="text-white/20 text-xs hover:text-white/40 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="text-white/20 text-xs hover:text-white/40 cursor-pointer transition-colors">Публичная оферта</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
