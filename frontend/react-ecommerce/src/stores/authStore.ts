import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await axios.post('/api/auth/login', { email, password });
          const { accessToken } = response.data;

          // Decode token to get user info
          const base64Url = accessToken.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const payload = JSON.parse(window.atob(base64));

          set({
            token: accessToken,
            user: {
              id: payload.sub,
              email: payload.email,
              isAdmin: payload.isAdmin
            },
            isAuthenticated: true
          });
        } catch (error) {
          throw new Error('Login failed');
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string) => {
        try {
          const response = await axios.post('/api/auth/register', { 
            email, 
            password, 
            firstName, 
            lastName 
          });
          const { accessToken } = response.data;

          // Decode token to get user info
          const base64Url = accessToken.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const payload = JSON.parse(window.atob(base64));

          set({
            token: accessToken,
            user: {
              id: payload.sub,
              email: payload.email,
              isAdmin: payload.isAdmin
            },
            isAuthenticated: true
          });
        } catch (error) {
          throw new Error('Registration failed');
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
