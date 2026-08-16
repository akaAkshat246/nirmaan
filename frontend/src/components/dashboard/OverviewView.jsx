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
  ArrowUpRight
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
    <div className="space-y-6">
      
      {/* Top Level Municipal Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Bins */}
        <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Monitored Bins</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-100 mt-0.5">{total}</div>
            <span className="text-[10px] text-emerald-400 font-mono">100% Sensors Online</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
            <Trash2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Critical Bins */}
        <div className={`glass-panel rounded-2xl p-4 border flex items-center justify-between transition-all ${
          critical.length > 0 ? 'glass-panel-critical' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Critical (&gt;90%)</span>
            <div className={`text-2xl sm:text-3xl font-black font-mono mt-0.5 ${critical.length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              {critical.length}
            </div>
            <span className="text-[10px] text-red-400 font-mono">Immediate Action</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: High Priority Bins */}
        <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">High (75-90%)</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-orange-400 mt-0.5">{high.length}</div>
            <span className="text-[10px] text-orange-400 font-mono">In Queue Priority</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Fleet Vehicles Active */}
        <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Fleet Active</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 mt-0.5">4 / 4</div>
            <span className="text-[10px] text-cyan-400 font-mono">Dijkstra Dispatch</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 5: Avg Response Time */}
        <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800 flex items-center justify-between col-span-2 sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Collection ETA</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-0.5">4.7h</div>
            <span className="text-[10px] text-emerald-500 font-mono">↓ 42% vs 8.2h Legacy</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Critical Alert Warning Ticker if any bin is Critical */}
      {critical.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/70 via-red-900/40 to-slate-950 border border-red-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-red-500/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-200">
                🚨 CRITICAL OVERFLOW RISK: {critical[0].bin_code} ({critical[0].name}) at {critical[0].currentFill}% Fill!
              </h4>
              <p className="text-[11px] text-slate-300">
                AI predicts overflow in <span className="text-red-400 font-bold font-mono">~{critical[0].overflowEtaHours} hours</span>. Priority Queue has queued this bin for immediate vehicle routing.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('routing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-slate-950 text-xs font-bold shadow-md transition-all"
          >
            <span>Dispatch Optimized Route</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive GIS City Map & Realtime Inspector */}
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
