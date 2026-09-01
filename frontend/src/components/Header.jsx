import React from 'react';
import { ShieldCheck, LogOut, User } from 'lucide-react';

export default function Header({ user, onLogout }) {
  // Optional helper to assign distinct badge colors based on the user's role
  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'devops engineer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'security analyst':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'system admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* App Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              TraceGuard
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                v1.0
              </span>
            </h1>
          </div>
        </div>

        {/* User Info & Role Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-semibold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">
                  {user?.name || 'Developer'}
                </span>

                {/* ROLE BADGE */}
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                    user?.role
                  )}`}
                >
                  {user?.role || 'Developer'}
                </span>
              </div>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={onLogout}
            className="px-3 py-2 text-slate-400 hover:text-red-400 bg-slate-950/40 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}