export const STELLAR_NETWORK = {
  TESTNET: 'https://horizon-testnet.stellar.org',
  MAINNET: 'https://horizon.stellar.org',
} as const;

export const SOROBAN_RPC = {
  TESTNET: 'https://soroban-testnet.stellar.org',
  MAINNET: 'https://soroban-rpc.stellar.org',
} as const;

export const SUPPORTED_CURRENCIES = ['XLM', 'USDC', 'USD', 'KES', 'GHS', 'NGN', 'TZS'] as const;

export const MIN_TRANSACTION_AMOUNT = '0.01';
export const MAX_TRANSACTION_AMOUNT = '100000';

export const TX_FEE_PERCENT = 0.005; // 0.5%
export const CROSS_BORDER_FEE_PERCENT = 0.01; // 1%
