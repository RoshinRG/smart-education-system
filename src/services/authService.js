import { apiClient } from './api.js';
import { appStore, persistAuthToken, clearAuthToken } from '../state/store.js';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      persistAuthToken(response.token);
      apiClient.setToken(response.token);

      appStore.setState('user', response.user);
      appStore.setState('isAuthenticated', true);

      return response.user;
    } catch (error) {
      appStore.setState('error', error.message);
      throw error;
    }
  }

  async signup(email, password, name, role) {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        name,
        role,
      });

      persistAuthToken(response.token);
      apiClient.setToken(response.token);

      appStore.setState('user', response.user);
      appStore.setState('isAuthenticated', true);

      return response.user;
    } catch (error) {
      appStore.setState('error', error.message);
      throw error;
    }
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      clearAuthToken();
      apiClient.clearToken();
      appStore.setState('user', null);
      appStore.setState('isAuthenticated', false);
      window.location.href = '/login';
    }
  }

  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh', {});
      persistAuthToken(response.token);
      apiClient.setToken(response.token);
      return response.token;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await apiClient.get('/auth/profile');
      appStore.setState('user', response.user);
      return response.user;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }

  async updateProfile(updates) {
    try {
      const response = await apiClient.put('/auth/profile', updates);
      appStore.setState('user', response.user);
      return response.user;
    } catch (error) {
      appStore.setState('error', error.message);
      throw error;
    }
  }

  isAuthenticated() {
    return !!appStore.getState('authToken');
  }

  getUser() {
    return appStore.getState('user');
  }
}

export const authService = new AuthService();

// Check auth on app load
if (appStore.getState('authToken')) {
  authService.getProfile().catch(() => {
    clearAuthToken();
  });
}
