import React, { useEffect, useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function WalletPage() {
  const { wallet, loading, fetchWallet, createWallet } = useWalletStore();
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchWallet(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    await createWallet();
    await fetchWallet();
    setCreating(false);
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet</h2>

      {loading ? (
        <div className="text-gray-400">Loading wallet...</div>
      ) : wallet ? (
        <div className="space-y-6">
          {/* Address card */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white max-w-lg">
            <p className="text-sm opacity-70 mb-2">Stellar Wallet Address</p>
            <p className="font-mono text-sm break-all mb-4">{wallet.address}</p>
            <button
              onClick={copyAddress}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              {copied ? '✅ Copied!' : '📋 Copy Address'}
            </button>
          </div>

          {/* Balances */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Balances</h3>
            {wallet.balances?.length > 0 ? (
              <div className="space-y-3">
                {wallet.balances.map((b) => (
                  <div key={b.currency} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-primary">
                        {b.currency.slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-700">{b.currency}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{parseFloat(b.amount).toFixed(4)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No balances yet. Fund your wallet to get started.</p>
            )}
          </div>

          {/* Stellar explorer link */}
          <a
            href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            🔍 View on Stellar Explorer
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
          <p className="text-4xl mb-4">👛</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Wallet Yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create a Stellar wallet to start sending and receiving funds.</p>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create Wallet'}
          </button>
        </div>
      )}
    </div>
  );
}
