import React from 'react';
import { Cpu, Code2, Terminal, Clock, ChevronRight } from 'lucide-react';

export default function ErrorDetails({ selectedError, onApplyFix, isApplyingFix, fixApplied }) {
  if (!selectedError) return null;

  return (
    <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6">
      {/* Issue Header */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="bg-red-500/10 text-red-400 text-xs font-mono px-2.5 py-1 rounded border border-red-500/20">
            {selectedError.id}
          </span>
          <h2 className="text-lg font-bold text-slate-100 mt-2 mb-1">{selectedError.title}</h2>
          <div className="text-xs text-slate-400">
            Environment: <span className="text-slate-200 font-medium">{selectedError.environment}</span>
          </div>
        </div>
      </div>

      {/* AI Root Cause Panel */}
      <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-5 mb-6 ring-1 ring-purple-500/20">
        <div className="flex items-center gap-2 text-purple-400 mb-2 font-bold text-sm">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span>TraceGuard AI Incident Analysis</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {selectedError.aiAnalysis.rootCause}
        </p>

        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Code2 className="w-4 h-4 text-purple-400" /> Recommended Code Patch
            </span>
            <button 
              onClick={onApplyFix}
              disabled={fixApplied || isApplyingFix}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                fixApplied 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 active:scale-95'
              }`}
            >
              {isApplyingFix ? 'Applying...' : fixApplied ? 'Patch Applied ✓' : 'Auto-Generate PR'}
            </button>
          </div>
          <pre className="text-xs font-mono text-sky-300 bg-slate-950 p-3 rounded border border-slate-800/80 overflow-x-auto">
            {selectedError.aiAnalysis.suggestedFix}
          </pre>
        </div>
      </div>

      {/* Stack Trace */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4" /> Stack Trace
        </h3>
        <pre className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-red-400 border border-slate-800 overflow-x-auto leading-relaxed">
          {selectedError.stackTrace}
        </pre>
      </div>

      {/* Event Breadcrumbs */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Crash Breadcrumbs
        </h3>
        <div className="space-y-2">
          {selectedError.breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-2 rounded-md border border-slate-800/60">
              <span className="text-slate-500 font-mono text-[11px]">{crumb.time}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className={
                crumb.type === 'error' ? 'text-red-400 font-medium' : 
                crumb.type === 'network' ? 'text-sky-400' : 'text-slate-300'
              }>
                {crumb.event}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}