import React from 'react';
import { ShieldCheck, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
          <ShieldCheck className="w-6 h-6 text-sky-400" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">TraceGuard</span>
        <span className="bg-sky-500/10 text-sky-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-sky-500/20 tracking-wide">
          LIVE DEMO
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          SDK Status: <strong className="text-emerald-400 font-medium">Connected</strong>
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}