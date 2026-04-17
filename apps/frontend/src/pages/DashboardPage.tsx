import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';
import { useAuthStore } from '../store/authStore';
import StatCard from '../components/StatCard';
import TransactionRow from '../components/TransactionRow';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { wallet, transactions, fetchWallet, fetchTransactions, loading } = useWalletStore();
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const xlmBalance = wallet?.balances?.find((b) => b.currency === 'XLM')?.amount || '0';
  const completed = transactions.filter((t) => t.status === 'completed').length;
  const pending = transactions.filter((t) => t.status === 'pending').length;
  const totalVolume = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    .toFixed(2);

  // Build chart data from last 7 days of transactions
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const volume = transactions
      .filter((t) => new Date(t.createdAt).toDateString() === d.toDateString())
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return { day: label, volume: parseFloat(volume.toFixed(2)) };
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1 capitalize">{role} overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="XLM Balance" value={`${parseFloat(xlmBalance).toFixed(2)} XLM`} icon="💰" color="bg-primary" />
        <StatCard title="Total Volume" value={`${totalVolume} XLM`} sub="Completed transactions" icon="📊" color="bg-violet-500" />
        <StatCard title="Completed" value={String(completed)} sub="Transactions" icon="✅" color="bg-green-500" />
        <StatCard title="Pending" value={String(pending)} sub="Awaiting settlement" icon="⏳" color="bg-yellow-500" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Transaction Volume (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="volume" stroke="#4f46e5" fill="url(#colorVolume)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Wallet card + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
          <p className="text-sm opacity-70 mb-1">Wallet Address</p>
          {wallet ? (
            <>
              <p className="font-mono text-xs break-all mb-4">{wallet.address}</p>
              <p className="text-3xl font-bold">{parseFloat(xlmBalance).toFixed(4)} XLM</p>
            </>
          ) : (
            <div>
              <p className="text-sm opacity-80 mb-3">No wallet yet</p>
              <Link to="/wallet" className="bg-white text-primary text-sm font-semibold px-4 py-2 rounded-lg">
                Create Wallet
              </Link>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/send', label: 'Send Money', icon: '💸', color: 'bg-indigo-50 text-primary' },
              { to: '/transactions', label: 'View History', icon: '📋', color: 'bg-purple-50 text-purple-600' },
              { to: '/agents', label: 'Agent Services', icon: '🏪', color: 'bg-green-50 text-green-600' },
              { to: '/merchants', label: 'Merchants', icon: '🛒', color: 'bg-orange-50 text-orange-600' },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`flex items-center gap-3 p-4 rounded-lg ${a.color} font-medium text-sm hover:opacity-80 transition-opacity`}
              >
                <span className="text-xl">{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No transactions yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
