import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Zustand store for managing favorite products (toggle favorites, check if favorite).
 */
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [], // array of product IDs
      
      toggleFavorite: (productId) => set((state) => {
        const isFav = state.favorites.includes(productId);
        if (isFav) {
          return { favorites: state.favorites.filter((id) => id !== productId) };
        } else {
          return { favorites: [...state.favorites, productId] };
        }
      }),
      
      isFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: 'favorites-storage', // name of the item in the storage (must be unique)
    }
  )
);
