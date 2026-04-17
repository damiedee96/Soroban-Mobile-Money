import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface Agent {
  id: string;
  business_name: string;
  location: string;
  liquidity_balance: string;
  is_active: boolean;
}

export default function AgentsPage() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ businessName: '', location: '' });
  const [cashForm, setCashForm] = useState({ userId: '', amount: '', type: 'cash_in' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/agents/me')
      .then((r) => setAgent(r.data.data))
      .catch(() => setAgent(null))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await apiClient.post('/agents/register', form);
      setMsg('Agent registered successfully!');
      const r = await apiClient.get('/agents/me');
      setAgent(r.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleCash = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await apiClient.post(`/agents/${cashForm.type}`, { userId: cashForm.userId, amount: cashForm.amount });
      setMsg(`${cashForm.type === 'cash_in' ? 'Cash-in' : 'Cash-out'} processed!`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Services</h2>

      {msg && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">{msg}</div>}
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      {agent ? (
        <div className="space-y-6 max-w-lg">
          {/* Agent profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🏪</div>
              <div>
                <h3 className="font-semibold text-gray-900">{agent.business_name}</h3>
                <p className="text-sm text-gray-500">{agent.location}</p>
              </div>
              <span className={`ml-auto text-xs px-2 py-1 rounded-full ${agent.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {agent.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Liquidity Balance</p>
              <p className="text-2xl font-bold text-gray-900">{parseFloat(agent.liquidity_balance).toFixed(4)} XLM</p>
            </div>
          </div>

          {/* Cash in/out */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Cash In / Cash Out</h3>
            <form onSubmit={handleCash} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                <select
                  value={cashForm.type}
                  onChange={(e) => setCashForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cash_in">Cash In</option>
                  <option value="cash_out">Cash Out</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer User ID</label>
                <input
                  type="text"
                  value={cashForm.userId}
                  onChange={(e) => setCashForm((f) => ({ ...f, userId: e.target.value }))}
                  placeholder="User UUID"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (XLM)</label>
                <input
                  type="number"
                  value={cashForm.amount}
                  onChange={(e) => setCashForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Process
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Register as Agent</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                placeholder="Mama Pesa Agency"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Nairobi CBD, Kenya"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Register as Agent
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
