import { useLayoutEffect, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import BasketBuilder from './pages/BasketBuilder';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Guide from './pages/Guide';
import OrderManagement from './pages/OrderManagement';
import Cart from './components/Cart';
import { useThemeStore } from './store/useThemeStore';

function App() {
  // Миграция/Очистка старых данных из localStorage, которые были до перехода на persist
  useEffect(() => {
    const oldUser = localStorage.getItem('user');
    const oldToken = localStorage.getItem('token');
    if (oldUser || oldToken) {
      // Если мы нашли старые ключи, которые не в 'auth-storage'
      // Мы можем либо удалить их, либо оставить, но лучше пользоваться только стором.
      // Чтобы не разлогинивать пользователя резко, просто оставим это тут как напоминание,
      // но в Profile.jsx перейдем на использование стора.
    }
  }, []);

  const theme = useThemeStore(state => state.theme);
  
  useLayoutEffect(() => {
    const root = document.documentElement;
    
    // 1. Отключаем абсолютно все анимации перед сменой темы
    root.classList.add('disable-transitions');
    
    // 2. Меняем тему
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 3. Возвращаем анимации (hover/focus эффекты) обратно после того,
    // как браузер отрисует новый кадр с измененными цветами.
    const timeoutId = setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [theme]);

  return (
    <div className="app min-h-screen flex flex-col w-full selection:bg-[#D4AF37] selection:text-white">
      <Header />
      <Cart />
      <main className="flex-grow flex flex-col relative w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/builder" element={<BasketBuilder />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/guide/:id" element={<Guide />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
