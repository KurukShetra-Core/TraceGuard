import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

export default function ErrorList({ errors, selectedError, onSelectError, searchQuery, setSearchQuery }) {
  return (
    <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search issues, services, or stack traces..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
        />
      </div>

      <div className="flex flex-col gap-3">
        {errors.map(item => {
          const isSelected = selectedError?.id === item.id;
          const isCritical = item.severity === 'critical';
          
          return (
            <div 
              key={item.id}
              onClick={() => onSelectError(item)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-slate-950 border-sky-500/50 shadow-md ring-1 ring-sky-500/20' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              } ${isCritical ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.service}</span>
                <span className="text-xs text-slate-500">{item.timestamp}</span>
              </div>
              <div className="font-semibold text-sm text-slate-100 mb-2 line-clamp-1">
                {item.title}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span><strong className="text-slate-200">{item.count}</strong> events</span>
                <span><strong className="text-slate-200">{item.usersAffected}</strong> users</span>
                {item.status === 'resolved' && (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}