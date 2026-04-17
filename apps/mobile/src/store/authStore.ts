import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  login: (token: string, userId: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  role: null,

  login: async (token, userId, role) => {
    await AsyncStorage.setItem('auth', JSON.stringify({ token, userId, role }));
    set({ token, userId, role });
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth');
    set({ token: null, userId: null, role: null });
  },

  hydrate: async () => {
    const raw = await AsyncStorage.getItem('auth');
    if (raw) {
      const { token, userId, role } = JSON.parse(raw);
      set({ token, userId, role });
    }
  },
}));
