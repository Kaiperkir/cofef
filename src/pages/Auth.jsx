import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoveRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !agreed) {
      setError('Необходимо согласие на обработку персональных данных');
      return;
    }

    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Что-то пошло не так');
      }

      login(data.user, data.token);
      navigate('/profile'); // После успеха перенаправляем в профиль
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white/60 dark:bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 shadow-2xl relative z-10"
      >
        <div className="mb-12">
          <h1 className="text-5xl font-serif leading-tight tracking-tight mb-4 text-[#0A0A0A] dark:text-[#FDFCFB]">
            {isLogin ? 'С возвращением' : 'Присоединяйтесь'}
          </h1>
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-[10px]">
            {isLogin ? 'Вход в личный кабинет' : 'Начните свое кофейное путешествие'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="ВАШЕ ИМЯ" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full bg-[#FDFCFB] dark:bg-[#000000] border border-transparent rounded-2xl py-5 pl-16 pr-6 font-bold text-xs tracking-widest focus:border-[#D4AF37] focus:bg-white transition-all outline-none"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              placeholder="EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#FDFCFB] dark:bg-[#000000] border border-transparent rounded-2xl py-5 pl-16 pr-6 font-bold text-xs tracking-widest focus:border-[#D4AF37] focus:bg-white transition-all outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="ПАРОЛЬ" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#FDFCFB] dark:bg-[#000000] border border-transparent rounded-2xl py-5 pl-16 pr-6 font-bold text-xs tracking-widest focus:border-[#D4AF37] focus:bg-white transition-all outline-none"
            />
          </div>

          {!isLogin && (
            <div className="flex items-start gap-4 px-2">
              <input 
                type="checkbox" 
                id="consent"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-stone-200 dark:border-white/20 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <label htmlFor="consent" className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest cursor-pointer leading-relaxed">
                Я согласен на <span className="text-[#D4AF37] underline">обработку персональных данных</span> в соответствии с политикой конфиденциальности
              </label>
            </div>
          )}

          <button 
            disabled={isLoading}
            className={`w-full bg-[#0A0A0A] dark:bg-[#1A1A1A] text-[#111111] py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 hover:bg-[#D4AF37] transition-all shadow-xl group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
            {!isLoading && <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#0A0A0A] transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}