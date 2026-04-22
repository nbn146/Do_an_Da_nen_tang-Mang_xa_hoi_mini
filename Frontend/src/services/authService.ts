import apiClient from './api';

export const authService = {
  // Hàm Đăng nhập
  login: async (username?: string, password?: string) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  },

  //Hàm Đăng ký
  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  // Hàm Đăng nhập với Google
  googleLogin: async (idToken: string) => {
    const response = await apiClient.post('/auth/google', { idToken });
    return response.data;
  },
  // Hàm Đăng xuất
  logout: () => {
    localStorage.removeItem('userToken');
  }
};