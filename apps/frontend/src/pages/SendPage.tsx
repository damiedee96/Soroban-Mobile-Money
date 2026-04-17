import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { calculateFee } from '@soroban-mm/shared';

export default function SendPage() {
  const [form, setForm] = useState({ receiverPhone: '', amount: '', currency: 'XLM', memo: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fee = form.amount ? calculateFee(parseFloat(form.amount)) : 0;
  const total = form.amount ? (parseFloat(form.amount) + fee).toFixed(7) : '0';

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await apiClient.post('/transactions/send', form);
      setSuccess(`Transaction submitted! ID: ${res.data.data.txId}`);
      setTimeout(() => navigate('/transactions'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Money</h2>

      <div className="max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">{success}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone</label>
            <input
              type="tel"
              value={form.receiverPhone}
              onChange={set('receiverPhone')}
              placeholder="+254711111111"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={set('amount')}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={set('currency')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="XLM">XLM</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Memo (optional)</label>
            <input
              type="text"
              value={form.memo}
              onChange={set('memo')}
              placeholder="e.g. rent, groceries"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Fee breakdown */}
          {form.amount && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Amount</span><span>{form.amount} {form.currency}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Fee (0.5%)</span><span>{fee} {form.currency}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-200 pt-1 mt-1">
                <span>Total</span><span>{total} {form.currency}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Money'}
          </button>
        </form>
      </div>
    </div>
  );
}
