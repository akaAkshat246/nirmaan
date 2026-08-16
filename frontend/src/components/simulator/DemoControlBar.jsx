import React, { useState } from 'react';
import { 
  Zap, 
  FastForward, 
  RotateCcw, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Flame
} from 'lucide-react';

export default function DemoControlBar({ 
  onTriggerSurge, 
  onAdvanceTime, 
  onReset, 
  isLoading,
  lastActionMessage
}) {
  const [pulseActive, setPulseActive] = useState(true);

  return (
    <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: IoT Telemetry Indicator & Alert */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-300 font-medium">IoT Sensor Mesh Active</span>
            <span className="text-[10px] text-slate-500 font-mono">| 15s pulse</span>
          </div>

          {lastActionMessage && (
            <div className="hidden md:flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lastActionMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Interactive Demo Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-mono text-[11px] mr-1 hidden sm:inline">Demo Controls:</span>

          {/* Core Demo Moment: 68% -> 91% surge */}
          <button
            onClick={() => onTriggerSurge('BIN-104', 91)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold shadow-md shadow-red-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-red-400/30"
            title="Simulate sudden garbage spike in Market Area (Bin #104 jumps from 68% to 91% CRITICAL)"
          >
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>🔥 Surge Bin #104 (68% → 91%)</span>
          </button>

          {/* Advance Time +2h */}
          <button
            onClick={() => onAdvanceTime(2)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Fast forward simulation by +2 hours to observe fill rate evolution"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>Advance +2h</span>
          </button>

          {/* Reset Store */}
          <button
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Reset simulation to default seed state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
}
