import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

const API_URL = 'http://localhost:5000/api';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (search = '') => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/products`, {
        params: { search }
      });
      set({ products: res.data, loading: false });
    } catch (err) {
      set({ error: 'Ошибка при загрузке товаров', loading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ products: [res.data, ...get().products] });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  deleteProduct: async (id) => {
    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ products: get().products.filter(p => p.id !== id) });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}));
