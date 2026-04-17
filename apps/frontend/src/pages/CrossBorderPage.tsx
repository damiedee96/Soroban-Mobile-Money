import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export default function CrossBorderPage() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ receiverPhone: '', amount: '', fromCurrency: 'XLM', toCurrency: 'KES', memo: '' });
  const [preview, setPreview] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get('/crossborder/rates').then((r) => setRates(r.data.data));
  }, []);

  const rateKey = `${form.fromCurrency}_${form.toCurrency}`;
  const rate = rates[rateKey];
  const converted = form.amount && rate ? (parseFloat(form.amount) * rate).toFixed(4) : null;

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsg('');
    setLoading(true);
    try {
      const res = await apiClient.post('/crossborder/send', form);
      setPreview(res.data.data);
      setMsg('Transfer submitted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Cross-Border Transfer</h2>
      <p className="text-gray-500 text-sm mb-6">Send money internationally with low fees via Soroban</p>

      {msg && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">{msg}</div>}
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone</label>
              <input type="tel" value={form.receiverPhone} onChange={set('receiverPhone')} placeholder="+233..." required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <select value={form.fromCurrency} onChange={set('fromCurrency')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="XLM">XLM</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient receives in</label>
              <select value={form.toCurrency} onChange={set('toCurrency')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="KES">KES (Kenya)</option>
                <option value="GHS">GHS (Ghana)</option>
                <option value="NGN">NGN (Nigeria)</option>
                <option value="TZS">TZS (Tanzania)</option>
                <option value="USD">USD</option>
              </select>
            </div>
            {converted && (
              <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">
                Recipient gets approx. <strong>{converted} {form.toCurrency}</strong>
                <span className="text-indigo-400 ml-2">(rate: 1 {form.fromCurrency} = {rate} {form.toCurrency})</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
              {loading ? 'Sending...' : 'Send Transfer'}
            </button>
          </form>
        </div>

        {/* Rates table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Live Exchange Rates</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="text-left py-2">Pair</th>
                <th className="text-right py-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rates).map(([pair, rate]) => (
                <tr key={pair} className="border-b border-gray-50">
                  <td className="py-2 font-mono text-gray-700">{pair.replace('_', ' → ')}</td>
                  <td className="py-2 text-right font-semibold text-gray-900">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt */}
      {preview && (
        <div className="mt-6 max-w-md bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-800 mb-3">Transfer Receipt</h3>
          <div className="space-y-1 text-sm text-green-700">
            <div className="flex justify-between"><span>Sent</span><span>{preview.sentAmount} {preview.fromCurrency}</span></div>
            <div className="flex justify-between"><span>Received</span><span>{preview.receivedAmount} {preview.toCurrency}</span></div>
            <div className="flex justify-between"><span>Fee (1%)</span><span>{preview.fee} {preview.fromCurrency}</span></div>
            <div className="flex justify-between font-semibold border-t border-green-200 pt-1 mt-1"><span>Status</span><span>{preview.status}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
