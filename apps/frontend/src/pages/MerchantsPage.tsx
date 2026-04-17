import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface Merchant {
  id: string;
  business_name: string;
  qr_code: string;
  is_active: boolean;
}

export default function MerchantsPage() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiClient.get('/merchants/me')
      .then((r) => setMerchant(r.data.data))
      .catch(() => setMerchant(null))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await apiClient.post('/merchants/register', { businessName });
      setMsg('Merchant registered!');
      const r = await apiClient.get('/merchants/me');
      setMerchant(r.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const copyQR = () => {
    if (merchant?.qr_code) {
      navigator.clipboard.writeText(merchant.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Merchant Portal</h2>

      {msg && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">{msg}</div>}
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      {merchant ? (
        <div className="max-w-lg space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">🛒</div>
              <div>
                <h3 className="font-semibold text-gray-900">{merchant.business_name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${merchant.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {merchant.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">Payment QR Code / Link</p>
              <p className="font-mono text-sm text-gray-800 break-all mb-3">{merchant.qr_code}</p>
              <button
                onClick={copyQR}
                className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {copied ? '✅ Copied!' : '📋 Copy Payment Link'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-2">How to Accept Payments</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Share your QR code or payment link with customers</li>
              <li>Customer scans or opens the link in Soroban MM app</li>
              <li>They enter the amount and confirm payment</li>
              <li>Funds arrive instantly in your wallet</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Register as Merchant</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Duka la Pesa"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Register as Merchant
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
