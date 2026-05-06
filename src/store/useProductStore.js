import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

const API_URL = 'http://127.0.0.1:5000/api';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  viewCols: localStorage.getItem('viewCols') ? parseInt(localStorage.getItem('viewCols')) : 3,

  setViewCols: (cols) => {
    localStorage.setItem('viewCols', cols);
    set({ viewCols: cols });
  },

  fetchProducts: async (search = '') => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/products`, {
        params: { search }
      });
      // Гарантируем что products всегда массив
      const data = Array.isArray(res.data) ? res.data : [];
      set({ products: data, loading: false });
    } catch (err) {
      console.error('Fetch products error:', err);
      set({ error: 'Ошибка при загрузке товаров', loading: false, products: [] });
    }
  },

  fetchWeeklyProducts: async () => {
    try {
      const res = await axios.get(`${API_URL}/products`, {
        params: { is_weekly: 'true' }
      });
      return res.data;
    } catch (err) {
      console.error('Ошибка при загрузке товаров недели:', err);
      return [];
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
