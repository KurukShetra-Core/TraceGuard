import React from 'react';

export default function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start">
      <div>
        <div className="text-xs font-medium text-slate-400 mb-1">{title}</div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-emerald-400 font-medium mt-1">{trend}</div>
      </div>
      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">{icon}</div>
    </div>
  );
}