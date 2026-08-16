import React from 'react';
import { 
  Zap, 
  FastForward, 
  RotateCcw, 
  Radio, 
  Flame, 
  Sparkles,
  Activity,
  Cpu
} from 'lucide-react';

export default function DemoControlBar({ 
  onTriggerSurge, 
  onAdvanceTime, 
  onReset, 
  isLoading,
  lastActionMessage
}) {
  return (
    <div className="border-b border-white/[0.06] bg-dark-900/60 backdrop-blur-xl px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: IoT Telemetry Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-950/80 border border-emerald-500/30 shadow-glow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-emerald-300 font-bold tracking-wide">
              IoT Sensor Mesh Stream
            </span>
            <span className="text-[10px] text-slate-500 font-mono">| 15s Ultrasonic Telemetry</span>
          </div>

          {lastActionMessage && (
            <div className="hidden lg:flex items-center gap-2 text-emerald-300 font-mono text-[11px] bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30 animate-in fade-in slide-in-from-left-2 duration-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>{lastActionMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Interactive Cockpit Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-slate-400 font-mono text-[11px] tracking-wider uppercase hidden sm:inline flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span>Simulator Cockpit:</span>
          </span>

          {/* Core Demo Surge Trigger */}
          <button
            onClick={() => onTriggerSurge('BIN-104', 91)}
            disabled={isLoading}
            className="group relative flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-orange-500 text-white font-heading font-bold text-xs shadow-glow-red transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] border border-red-400/40"
            title="Simulate sudden garbage surge in Market Area (Bin #104 jumps from 68% to 91% CRITICAL)"
          >
            <Flame className="w-3.5 h-3.5 text-amber-200 group-hover:animate-bounce" />
            <span>🔥 Surge Bin #104 (68% → 91%)</span>
          </button>

          {/* Advance Time +2h */}
          <button
            onClick={() => onAdvanceTime(2)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 border border-white/[0.08] hover:border-cyan-500/40 font-mono text-xs transition-all duration-200"
            title="Fast-forward simulation by +2 hours"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>+2h Time Warp</span>
          </button>

          {/* Reset State */}
          <button
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-slate-200 border border-white/[0.08] font-mono text-xs transition-all duration-200"
            title="Reset simulation to initial baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
}
