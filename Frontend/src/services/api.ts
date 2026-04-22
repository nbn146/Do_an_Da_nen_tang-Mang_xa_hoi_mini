// Frontend Vite: src/services/api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; 

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// THUẬT TOÁN INTERCEPTOR: Tự động đính kèm Token từ localStorage
apiClient.interceptors.request.use(
  (config) => {
    // Web dùng localStorage có sẵn, không cần async/await
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;