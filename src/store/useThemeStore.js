import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Zustand store for managing the application theme (light/dark mode).
 */
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark', // Default to true dark as requested
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
