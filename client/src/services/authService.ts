import api from './api';
import { RegisterData, LoginData, AuthResponse, UserResponse } from 'types';

export const authService = {
  /**
   * Registers a new user.
   * @param data - User registration data.
   * @returns Promise<AuthResponse>
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  /**
   * Logs in a user.
   * @param data - User login credentials.
   * @returns Promise<AuthResponse>
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('check');
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      console.log('error', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  /**
   * Fetches current user data.
   * @returns Promise<UserResponse>
   */
  getMe: async (): Promise<UserResponse> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  /**
   * Logs out the current user.
   * @returns Promise<{ message: string }>
   */
  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },
};
