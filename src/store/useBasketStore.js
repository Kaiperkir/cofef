import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBasketStore = create(
  persist(
    (set) => ({
      items: [], 
      isCartOpen: false,
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      
      addToBasket: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === newItem.id && 
                    item.weight === newItem.weight && 
                    item.grind === newItem.grind
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity = (updatedItems[existingItemIndex].quantity || 1) + 1;
          return { items: updatedItems };
        }

        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }),

      updateQuantity: (cartId, delta) => set((state) => {
        const updatedItems = state.items.map(item => {
          if (item.cartId === cartId) {
            const newQty = (item.quantity || 1) + delta;
            // Не даем опуститься ниже 1. Если нужно удалить — есть кнопка удаления.
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        });
        return { items: updatedItems };
      }),
      
      removeFromBasket: (cartId) => set((state) => ({
        items: state.items.filter((item) => item.cartId !== cartId)
      })),

      clearBasket: () => set({ items: [] }),
    }),
    {
      name: 'basket-storage',
    }
  )
);