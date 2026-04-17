import { TX_FEE_PERCENT, CROSS_BORDER_FEE_PERCENT } from './constants';

export function calculateFee(amount: number, isCrossBorder = false): number {
  const rate = isCrossBorder ? CROSS_BORDER_FEE_PERCENT : TX_FEE_PERCENT;
  return parseFloat((amount * rate).toFixed(7));
}

export function formatAmount(amount: string, currency: string): string {
  const num = parseFloat(amount);
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 7 })} ${currency}`;
}

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function generateMemo(type: string, id: string): string {
  return `${type.toUpperCase()}-${id.slice(0, 8)}`;
}
