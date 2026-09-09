import api from './api';

export const userService = {
  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/me', {
      name: profileData.name ? profileData.name.trim() : undefined,
      phone: profileData.phone ? profileData.phone.trim() : undefined,
      avatar: profileData.avatar ? profileData.avatar.trim() : undefined
    });
    return response.data;
  }
};
