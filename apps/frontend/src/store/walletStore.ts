import { create } from 'zustand';
import { Wallet, Transaction } from '@soroban-mm/shared';
import { apiClient } from '../api/client';

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  fetchWallet: () => Promise<void>;
  createWallet: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  transactions: [],
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

  fetchTransactions: async () => {
    try {
      const res = await apiClient.get('/transactions?limit=50');
      set({ transactions: res.data.data });
    } catch {
      set({ transactions: [] });
    }
  },
}));
