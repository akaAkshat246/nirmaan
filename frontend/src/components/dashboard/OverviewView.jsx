import React from 'react';
import { 
  Building2, 
  Trash2, 
  AlertTriangle, 
  Truck, 
  Activity, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Radio, 
  ShieldAlert, 
  TrendingUp, 
  Trees,
  Flame,
  Zap,
  Users
} from 'lucide-react';
import DelhiLeafletMap from '../map/DelhiLeafletMap';

export default function OverviewView({ 
  bins = [], 
  activeRoute = null, 
  onSelectBin = () => {}, 
  onTriggerSurge = () => {}, 
  onCollectBin = () => {}, 
  onNavigateTab = () => {} 
}) {
  const totalBins = bins.length || 10;
  const criticalBins = bins.filter(b => b.status === 'CRITICAL' || b.currentFill >= 90);
  const highBins = bins.filter(b => b.status === 'HIGH' || (b.currentFill >= 75 && b.currentFill < 90));
  const normalBins = bins.filter(b => b.status === 'NORMAL' || b.currentFill < 50);

  const avgFill = totalBins > 0
    ? Math.round(bins.reduce((acc, b) => acc + (b.currentFill || 0), 0) / totalBins)
    : 64;

  return (
    <div className="space-y-8">
      
      {/* 1. Executive Municipal Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Background Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE MUNICIPAL TELEMETRY
              </span>
              <span className="text-xs font-mono text-slate-400">
                NCT of Delhi • Central Sanitation Command
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Delhi Smart Sanitation & <span className="gradient-text-emerald">Waste Intelligence OS</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time ultrasonic capacity monitoring, predictive overflow forecasting, crowdsourced grievance triage, and Dijkstra shortest-path fleet routing across Delhi zones.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigateTab('routing')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-heading font-bold text-xs shadow-glow-cyan transition-all transform hover:scale-[1.02]"
            >
              <Truck className="w-4 h-4" />
              <span>DSA Fleet Optimizer</span>
            </button>

            <button
              onClick={() => onNavigateTab('hotspots')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 font-heading font-bold text-xs shadow-glow-amber transition-all transform hover:scale-[1.02]"
            >
              <Flame className="w-4 h-4" />
              <span>Hotspot Warning</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Bins */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Active Delhi Grid</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-white">{totalBins}</span>
            <span className="text-xs text-slate-400 font-mono">Smart Nodes</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono block mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Sensor Pulse Sync
          </span>
        </div>

        {/* Critical Overflow Alerts */}
        <div className={`rounded-2xl p-5 border transition-all duration-300 ${
          criticalBins.length > 0
            ? 'glass-panel-critical-luxury'
            : 'glass-panel-luxury border-white/[0.08]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Critical Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-glow-red">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-red-400">{criticalBins.length}</span>
            <span className="text-xs text-red-300 font-mono">Bins &gt; 90%</span>
          </div>
          <span className="text-[11px] text-red-300 font-mono block mt-1.5 font-bold">
            {criticalBins.length > 0 ? '⚠ Immediate Dispatch Req' : '✓ Zero Overflows'}
          </span>
        </div>

        {/* High Risk Queue */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">High Risk Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-amber-300">{highBins.length}</span>
            <span className="text-xs text-slate-400 font-mono">Bins (75-90%)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block mt-1.5">
            ETA to overflow: ~2.3h
          </span>
        </div>

        {/* Active Fleet Dispatched */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Active Fleet</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-cyan-300">3</span>
            <span className="text-xs text-slate-400 font-mono">Vehicles En-Route</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono block mt-1.5">
            DL-01-EA-4092 Active
          </span>
        </div>

        {/* CO2 Footprint Averted */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Carbon Cut</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-emerald-400">-29.6%</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono block mt-1.5">
            18.6 Tons CO₂ saved / mo
          </span>
        </div>

      </div>

      {/* 3. Real-Time Critical Escalation Banner (If Any Critical Bins) */}
      {criticalBins.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-950/70 border border-red-500/60 shadow-glow-red flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-500/50">
                  CRITICAL TELEMETRY ESCALATION
                </span>
                <span className="text-xs text-red-400 font-mono">NCT Delhi Grid Alarm</span>
              </div>
              <h4 className="text-base font-heading font-black text-white mt-1">
                {criticalBins[0].bin_code} ({criticalBins[0].name}) reached {criticalBins[0].currentFill}% Capacity
              </h4>
              <p className="text-xs text-red-200/90 font-mono">
                AI predicts overflow in <strong className="text-white">~{criticalBins[0].overflowEtaHours} hours</strong> (Velocity: {criticalBins[0].fillRatePerHour}%/hr).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onCollectBin(criticalBins[0].id)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-heading font-bold text-xs shadow-glow-red transition-all transform hover:scale-[1.02]"
            >
              Dispatch Collection Vehicle Now
            </button>
          </div>
        </div>
      )}

      {/* 4. Real Interactive Leaflet Delhi Map */}
      <DelhiLeafletMap
        bins={bins}
        activeRoute={activeRoute}
        onSelectBin={onSelectBin}
        onTriggerSurge={onTriggerSurge}
        onCollectBin={onCollectBin}
      />

    </div>
  );
}
