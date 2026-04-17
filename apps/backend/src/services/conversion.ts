// Mock exchange rates — replace with a live FX API (e.g. Stellar DEX, Wise, etc.)
const RATES: Record<string, number> = {
  XLM_USD: 0.11,
  XLM_KES: 14.3,
  XLM_GHS: 1.35,
  XLM_NGN: 170.0,
  XLM_TZS: 280.0,
  USDC_USD: 1.0,
  USDC_KES: 130.0,
};

export function convertAmount(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const key = `${from}_${to}`;
  const reverseKey = `${to}_${from}`;
  if (RATES[key]) return parseFloat((amount * RATES[key]).toFixed(7));
  if (RATES[reverseKey]) return parseFloat((amount / RATES[reverseKey]).toFixed(7));
  throw new Error(`Unsupported conversion: ${from} → ${to}`);
}

export function getRate(from: string, to: string): number {
  const key = `${from}_${to}`;
  const reverseKey = `${to}_${from}`;
  if (RATES[key]) return RATES[key];
  if (RATES[reverseKey]) return 1 / RATES[reverseKey];
  throw new Error(`No rate for ${from}/${to}`);
}
