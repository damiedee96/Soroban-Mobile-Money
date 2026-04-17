import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  login: (token: string, userId: string, role: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  role: null,

  login: (token, userId, role) => {
    localStorage.setItem('auth', JSON.stringify({ token, userId, role }));
    set({ token, userId, role });
  },

  logout: () => {
    localStorage.removeItem('auth');
    set({ token: null, userId: null, role: null });
  },

  hydrate: () => {
    const raw = localStorage.getItem('auth');
    if (raw) {
      const { token, userId, role } = JSON.parse(raw);
      set({ token, userId, role });
    }
  },
}));
