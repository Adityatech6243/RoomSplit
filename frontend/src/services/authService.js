import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password
    });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', {
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
      phone: userData.phone ? userData.phone.trim() : null
    });
    return response.data;
  }
};
