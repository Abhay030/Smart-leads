import type { User } from '../types';
import api from './axios';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  
  demoLogin: async () => {
    const response = await api.post<AuthResponse>('/auth/demo-login');
    return response.data;
  },

  register: async (data: RegisterDto) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data;
  }
};
