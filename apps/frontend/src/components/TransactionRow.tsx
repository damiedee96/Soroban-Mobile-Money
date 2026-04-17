import React from 'react';
import { Transaction } from '@soroban-mm/shared';

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const isCredit = tx.type === 'receive' || tx.type === 'cash_in';
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <span className="text-sm font-medium capitalize">{tx.type.replace('_', ' ')}</span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
          {isCredit ? '+' : '-'}{tx.amount} {tx.currency}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[tx.status] || 'bg-gray-100'}`}>
          {tx.status}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-400">
        {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="py-3 px-4 text-xs text-gray-400 font-mono truncate max-w-[120px]">
        {tx.stellarTxHash ? tx.stellarTxHash.slice(0, 12) + '...' : '—'}
      </td>
    </tr>
  );
}
