import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveRight, Mail, Lock, User, AlertCircle, KeyRound, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteField, setShowInviteField] = useState(false);
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
    if (!isLogin && password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return;
    }

    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { email, password }
      : { name, email, password, ...(inviteCode.trim() ? { inviteCode: inviteCode.trim() } : {}) };

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

      // Сохраняем оба токена в стор
      login(data.user, data.accessToken || data.token, data.refreshToken || null);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setInviteCode('');
    setShowInviteField(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#140F0D] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Декоративный фон */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C06334]/8 dark:bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1C1614]/5 dark:bg-[#362A25]/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl bg-white/70 dark:bg-black/60 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[40px] p-12 shadow-2xl relative z-10"
      >
        {/* Заголовок */}
        <div className="mb-10">
          <motion.h1
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-serif leading-tight tracking-tight mb-3 text-[#1C1614] dark:text-[#F6F1E9]"
          >
            {isLogin ? 'С возвращением' : 'Присоединяйтесь'}
          </motion.h1>
          <p className="text-[#C06334] dark:text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-[10px]">
            {isLogin ? 'Вход в личный кабинет' : 'Начните своё кофейное путешествие'}
          </p>
        </div>

        {/* Ошибка */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Имя — только при регистрации */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="ВАШЕ ИМЯ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-[#F6F1E9] dark:bg-[#1C1614] border border-transparent rounded-2xl py-5 pl-16 pr-6 font-bold text-xs tracking-widest text-[#1C1614] dark:text-[#F6F1E9] focus:border-[#C06334] dark:focus:border-[#D4AF37] focus:bg-white dark:focus:bg-[#2A201D] transition-all outline-none placeholder:text-stone-400"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#F6F1E9] dark:bg-[#1C1614] border border-transparent rounded-2xl py-5 pl-16 pr-6 font-bold text-xs tracking-widest text-[#1C1614] dark:text-[#F6F1E9] focus:border-[#C06334] dark:focus:border-[#D4AF37] focus:bg-white dark:focus:bg-[#2A201D] transition-all outline-none placeholder:text-stone-400"
            />
          </div>

          {/* Пароль */}
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="password"
              placeholder="ПАРОЛЬ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#F6F1E9] dark:bg-[#1C1614] border border-transparent rounded-2xl py-5 pl-16 pr-6 font-bold text-xs tracking-widest text-[#1C1614] dark:text-[#F6F1E9] focus:border-[#C06334] dark:focus:border-[#D4AF37] focus:bg-white dark:focus:bg-[#2A201D] transition-all outline-none placeholder:text-stone-400"
            />
          </div>

          {/* Инвайт-код — только при регистрации, раскрывается по клику */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <button
                  type="button"
                  onClick={() => setShowInviteField(!showInviteField)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#C06334] dark:hover:text-[#D4AF37] transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  Есть код приглашения сотрудника?
                  <ChevronDown className={`w-4 h-4 transition-transform ${showInviteField ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showInviteField && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C06334] dark:text-[#D4AF37]" />
                      <input
                        type="text"
                        placeholder="КОД ПРИГЛАШЕНИЯ"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="w-full bg-amber-50 dark:bg-[#2A201D] border border-[#C06334]/30 dark:border-[#D4AF37]/20 rounded-2xl py-4 pl-16 pr-6 font-bold text-xs tracking-widest text-[#C06334] dark:text-[#D4AF37] focus:border-[#C06334] dark:focus:border-[#D4AF37] transition-all outline-none placeholder:text-[#C06334]/40"
                      />
                      <p className="text-[9px] text-stone-400 mt-1.5 px-2">
                        Если вы сотрудник Craft Coffee — введите код, выданный администратором
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Согласие — только при регистрации */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-4 px-2"
              >
                <input
                  type="checkbox"
                  id="consent"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-stone-300 text-[#C06334] focus:ring-[#C06334]"
                />
                <label htmlFor="consent" className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest cursor-pointer leading-relaxed">
                  Я согласен на <span className="text-[#C06334] underline">обработку персональных данных</span> в соответствии с политикой конфиденциальности
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка Submit */}
          <button
            disabled={isLoading}
            className={`w-full bg-[#1C1614] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 hover:bg-[#C06334] dark:hover:bg-[#C06334] dark:hover:text-white transition-all shadow-xl group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
            {!isLoading && <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        {/* Переключение Login/Register */}
        <div className="mt-8 text-center">
          <button
            onClick={switchMode}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-[#1C1614] dark:hover:text-[#F6F1E9] transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}