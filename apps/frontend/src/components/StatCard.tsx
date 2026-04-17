import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: string;
  color?: string;
}

export default function StatCard({ title, value, sub, icon, color = 'bg-primary' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <span className={`${color} text-white text-xl w-10 h-10 rounded-lg flex items-center justify-center`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
