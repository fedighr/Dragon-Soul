// frontend/src/services/productApi.js (CRÉER ce fichier)
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API adaptée à TA structure Product -> ProductColor -> ProductColorSize
export const productAPI = {
  // Get all products
  getAll: async () => {
    const response = await api.get('/products/');
    return response.data;
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  // Get related products (simple version - returns random products)
  getRelated: async () => {
    const response = await api.get('/products/');
    const products = response.data;
    // Return 3 random products
    return products.sort(() => 0.5 - Math.random()).slice(0, 3);
  }
};

export default api;