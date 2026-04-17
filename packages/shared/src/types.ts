export type Currency = 'XLM' | 'USDC' | 'USD' | 'KES' | 'GHS' | 'NGN' | 'TZS';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export type TransactionType = 'send' | 'receive' | 'cash_in' | 'cash_out' | 'merchant_payment' | 'cross_border';

export type UserRole = 'user' | 'merchant' | 'agent' | 'admin';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  walletAddress?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balances: WalletBalance[];
  createdAt: string;
}

export interface WalletBalance {
  currency: Currency;
  amount: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  senderId: string;
  receiverId: string;
  amount: string;
  currency: Currency;
  fee: string;
  stellarTxHash?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  userId: string;
  businessName: string;
  location: string;
  liquidityBalance: string;
  isActive: boolean;
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  qrCode: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
