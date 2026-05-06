import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,        // accessToken (живет 15 мин)
      refreshToken: null, // refreshToken (живет 30 дней)

      // Сохранить сессию после входа / регистрации
      login: (userData, token, refreshToken = null) => {
        set({ user: userData, token, refreshToken });
      },

      // Обновить только accessToken (после /api/auth/refresh)
      updateToken: (newToken) => {
        set({ token: newToken });
      },

      // Очистить всю сессию
      logout: () => {
        // Пытаемся уведомить сервер, чтобы он вычистил refreshToken из БД
        const { token } = get();
        if (token) {
          fetch('http://127.0.0.1:5000/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(() => {}); // Игнорируем ошибки сети
        }
        set({ user: null, token: null, refreshToken: null });
      },

      // Попытаться обновить accessToken с помощью refreshToken
      // Вызывается автоматически при ответе сервера TOKEN_EXPIRED
      tryRefreshToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return false;
        }
        try {
          const res = await fetch('http://127.0.0.1:5000/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          if (res.ok) {
            const data = await res.json();
            set({ token: data.accessToken || data.token });
            return true;
          } else {
            // RefreshToken тоже протух — нужен новый логин
            get().logout();
            return false;
          }
        } catch {
          return false;
        }
      },

      // Верифицировать текущую сессию при загрузке приложения
      verifySession: async () => {
        const { token, tryRefreshToken } = get();
        if (!token) return;

        try {
          const res = await fetch('http://127.0.0.1:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (res.ok) {
            const data = await res.json();
            // Обновляем данные пользователя (например, если роль изменилась)
            set({ user: data.user });
          } else {
            const errorData = await res.json().catch(() => ({}));
            if (errorData.code === 'TOKEN_EXPIRED') {
              // Пробуем обновить токен
              await tryRefreshToken();
            } else {
              // Токен невалиден — выходим
              get().logout();
            }
          }
        } catch {
          // Сервер недоступен — не трогаем сессию, просто тихо ждем
        }
      }
    }),
    {
      name: 'auth-storage',
      // Сохраняем в localStorage только эти поля
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken
      })
    }
  )
);
