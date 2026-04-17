import { create } from 'zustand';
import { Wallet } from '@soroban-mm/shared';
import { apiClient } from '../api/client';

interface WalletState {
  wallet: Wallet | null;
  loading: boolean;
  fetchWallet: () => Promise<void>;
  createWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  loading: false,

  fetchWallet: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.get('/wallet');
      set({ wallet: res.data.data });
    } catch {
      set({ wallet: null });
    } finally {
      set({ loading: false });
    }
  },

  createWallet: async () => {
    set({ loading: true });
    try {
      await apiClient.post('/wallet/create');
    } finally {
      set({ loading: false });
    }
  },
}));
