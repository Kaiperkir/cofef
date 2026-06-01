import { useLayoutEffect, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import BasketBuilder from './pages/BasketBuilder';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Guide from './pages/Guide';
import OrderManagement from './pages/OrderManagement';
import CartPage from './pages/CartPage';
import About from './pages/About';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';
import Footer from './components/Footer';

// ──────────────────────────────────────────────────────────
// Простая GPU-анимация (только opacity, без сдвигов).
// willChange: 'opacity' → браузер заранее выделяет слой.
// initial={false} на AnimatePresence → без анимации при первой загрузке.
// ──────────────────────────────────────────────────────────
const PageFade = ({ children, noFooter }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18, ease: 'easeInOut' }}
    style={{ willChange: 'opacity' }}
    className="flex flex-col flex-grow w-full"
  >
    {children}
    {!noFooter && <Footer />}
  </motion.div>
);

/**
 * Main application component that sets up routing, theming, and layout structure.
 */
function App() {
  const verifySession = useAuthStore(state => state.verifySession);
  useEffect(() => {
    verifySession();
  }, []);

  const theme = useThemeStore(state => state.theme);
  const location = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add('disable-transitions');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const timeoutId = setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [theme]);

  // Reset scroll to top on every route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="app min-h-screen flex flex-col w-full selection:bg-[#C06334] selection:text-white">
      <Header />
      <main className="flex-grow flex flex-col relative w-full">
        {/*
          mode="wait" — ждём исчезновения старой страницы перед показом новой.
          initial={false} — не анимируем страницу на первой загрузке сайта.
          Ключ по pathname гарантирует что AnimatePresence видит смену компонента.
        */}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"        element={<PageFade noFooter><Home /></PageFade>} />
            <Route path="/catalog" element={<PageFade><Catalog /></PageFade>} />
            <Route path="/builder" element={<PageFade><BasketBuilder /></PageFade>} />
            <Route path="/cart"    element={<PageFade><CartPage /></PageFade>} />
            <Route path="/favorites" element={<PageFade><Favorites /></PageFade>} />
            <Route path="/auth"    element={<PageFade><Auth /></PageFade>} />
            <Route path="/profile" element={<PageFade><Profile /></PageFade>} />
            <Route path="/orders"  element={<PageFade><OrderManagement /></PageFade>} />
            <Route path="/about"   element={<PageFade><About /></PageFade>} />
            <Route path="/guide/:id" element={<PageFade><Guide /></PageFade>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
