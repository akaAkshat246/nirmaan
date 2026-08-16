import React from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  Truck, 
  Clock, 
  Activity, 
  Flame, 
  ShieldAlert, 
  TrendingDown, 
  Sparkles,
  ArrowUpRight,
  Sun,
  Wind,
  CheckCircle2,
  Layers,
  Radio
} from 'lucide-react';
import CityMap from '../map/CityMap';

export default function OverviewView({ 
  bins = [], 
  activeRoute = null, 
  onSelectBin = () => {}, 
  onTriggerSurge = () => {}, 
  onCollectBin = () => {},
  onNavigateTab = () => {} 
}) {
  const total = bins.length;
  const critical = bins.filter(b => b.status === 'CRITICAL' || b.currentFill >= 90);
  const high = bins.filter(b => b.status === 'HIGH');
  const moderate = bins.filter(b => b.status === 'MODERATE');
  const normal = bins.filter(b => b.status === 'NORMAL');

  return (
    <div className="space-y-8">
      
      {/* 1. Hero Municipal Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-luxury p-6 sm:p-8 border border-white/10 shadow-2xl">
        {/* Background Ambient Glow Spheres */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>MUNICIPAL COMMAND CENTER</span>
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">Sector 1–21 Grid</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
              AI Waste Intelligence & <br className="hidden sm:inline" />
              <span className="gradient-text-emerald">Predictive Collection OS</span>
            </h1>

            <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
              Real-time ultrasonic bin telemetry, computer vision segregation, time-series overflow prediction, and graph shortest-path routing for sustainable smart cities.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] shadow-inner text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Fleet Optimization</span>
              <span className="text-xl font-heading font-black text-emerald-400">94.8%</span>
              <span className="text-[10px] text-slate-500 font-mono">Dijkstra Routing</span>
            </div>

            <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] shadow-inner text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Daily CO₂ Offset</span>
              <span className="text-xl font-heading font-black text-cyan-400">+620 kg</span>
              <span className="text-[10px] text-slate-500 font-mono">Circular Scraps</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top-Level KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Bins */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Smart Bins</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-black text-white">{total}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>100% Sensors Online</span>
          </div>
        </div>

        {/* Card 2: Critical Bins (>90%) */}
        <div className={`rounded-2xl p-5 border transition-all duration-300 group ${
          critical.length > 0 ? 'glass-panel-critical-luxury' : 'glass-panel-luxury border-white/[0.08]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Critical (&gt;90%)</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-heading font-black ${critical.length > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {critical.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-mono mt-1.5">
            <span>{critical.length > 0 ? 'Immediate Action' : 'All Levels Safe'}</span>
          </div>
        </div>

        {/* Card 3: High Priority Bins (75-90%) */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-orange-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">High (75–90%)</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-black text-orange-400">{high.length}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-orange-400 font-mono mt-1.5">
            <span>Priority Queue Stage</span>
          </div>
        </div>

        {/* Card 4: Fleet Vehicles Active */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Fleet Deployed</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-black text-cyan-300">4 / 4</div>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono mt-1.5">
            <span>VRP Routing Active</span>
          </div>
        </div>

        {/* Card 5: Response Time Benchmark */}
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 group col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Avg Collection ETA</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-emerald-400">4.7h</span>
            <span className="text-xs text-slate-500 font-mono line-through">8.2h</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1.5">
            ↓ 42.6% Turnaround Time
          </div>
        </div>

      </div>

      {/* 3. Real-time Emergency Alert Banner if Critical */}
      {critical.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-5 glass-panel-critical-luxury border border-red-500/50 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold uppercase border border-red-500/40">
                  CRITICAL TELEMETRY ALERT
                </span>
                <span className="text-xs text-slate-400 font-mono">{critical[0].sector}</span>
              </div>
              <h4 className="text-base font-heading font-bold text-white mt-1">
                {critical[0].bin_code} ({critical[0].name}) reached {critical[0].currentFill}% Fill Level!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                AI predicts overflow in <span className="font-mono text-red-400 font-bold">~{critical[0].overflowEtaHours} hours</span>. Priority Queue has queued this bin at Rank #1 for automated collection.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('routing')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-heading font-bold text-xs shadow-glow-red transition-all transform hover:scale-[1.02]"
          >
            <span>Dispatch Optimized Route</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Vector GIS City Map & Real-time Node Telematics */}
      <CityMap
        bins={bins}
        activeRoute={activeRoute}
        onSelectBin={onSelectBin}
        onTriggerSurge={onTriggerSurge}
        onCollectBin={onCollectBin}
      />

    </div>
  );
}
