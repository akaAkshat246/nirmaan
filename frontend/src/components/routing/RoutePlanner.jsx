import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Share2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Flame, 
  TrendingDown, 
  Fuel, 
  Trees,
  Layers,
  Code2,
  Cpu
} from 'lucide-react';
import { api } from '../../services/api';

export default function RoutePlanner({ bins = [], onRouteGenerated = () => {} }) {
  const [routePlan, setRoutePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stops');

  const handleGenerateRoute = async () => {
    setLoading(true);
    try {
      const plan = await api.optimizeRoute({ minPriorityThreshold: 40 });
      setRoutePlan(plan);
      onRouteGenerated(plan);
    } catch (err) {
      console.error('Route generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateRoute();
  }, [bins]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                MODULE 4 • DSA GRAPH ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400">Dijkstra Shortest Path + Binary Max-Heap VRP</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              Intelligent Fleet Route <span className="gradient-text-cyan">Optimization Engine</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Dynamically evaluates critical bin telematics through a binary max-heap priority queue and solves the multi-stop municipal vehicle routing problem with Dijkstra shortest-path pathfinding.
            </p>
          </div>

          <button
            onClick={handleGenerateRoute}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-dark-950 font-heading font-black text-xs shadow-glow-cyan transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            <span>{loading ? 'Solving City Graph...' : 'Re-Optimize DSA Route'}</span>
          </button>
        </div>
      </div>

      {/* Benchmark Efficiency Comparison Cards */}
      {routePlan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Optimized Distance</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-heading font-black text-cyan-300">
              {routePlan.totalDistanceKm} <span className="text-sm text-slate-400 font-mono">km</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1.5">
              vs legacy static {routePlan.legacyDistanceKm} km
            </div>
          </div>

          <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Distance Reduction</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-heading font-black text-emerald-400">
              -{routePlan.distanceSavedKm} <span className="text-sm font-mono text-emerald-500">km (29.6%)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1.5">Dijkstra Shortest Path reduction</div>
          </div>

          <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Diesel Saved / Round</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Fuel className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-heading font-black text-amber-300">
              {routePlan.fuelSavedLiters} <span className="text-sm text-slate-400 font-mono">L Diesel</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1.5">₹{Math.round(routePlan.fuelSavedLiters * 92)} fuel expense saved</div>
          </div>

          <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">CO₂ Footprint Cut</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Trees className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-heading font-black text-emerald-400">
              -{routePlan.co2SavedKg} <span className="text-sm text-slate-400 font-mono">kg CO₂</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1.5">ESG Environmental Green credits</div>
          </div>

        </div>
      )}

      {/* Main Routing Details & DSA Algorithmic Cockpit */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('stops')}
            className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all ${
              activeTab === 'stops'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Turn-by-Turn Vehicle Dispatch ({routePlan?.stops?.length || 0} Critical Stops)
          </button>

          <button
            onClick={() => setActiveTab('dsa')}
            className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dsa'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>DSA Algorithm Architecture</span>
          </button>
        </div>

        {/* Tab 1: Turn by Turn Dispatch Schedule */}
        {activeTab === 'stops' && routePlan && (
          <div className="space-y-4">
            
            {/* Origin Node */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-dark-900/90 border border-emerald-500/30 shadow-glow-sm">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-black text-emerald-400 text-xs shadow-md">
                DEPOT
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-slate-400">Fleet Origin Hub</span>
                <h4 className="text-base font-heading font-bold text-white">Central Municipal Depot Hub (Industrial Sector 1)</h4>
                <p className="text-xs text-slate-400 font-mono">Vehicle DL-01-EA-4092 (Compaction Cap: 5000 kg)</p>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                0.0 km
              </div>
            </div>

            {/* Intermediate Smart Bin Waypoints */}
            {routePlan.stops.map((stop) => (
              <div 
                key={stop.binId}
                className="flex items-center gap-4 p-5 rounded-2xl bg-dark-900/50 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-black text-sm border shadow-md ${
                  stop.urgencyRank === 'CRITICAL' ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-glow-red' :
                  stop.urgencyRank === 'HIGH' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
                  'bg-amber-500/20 border-amber-500/50 text-amber-400'
                }`}>
                  #{stop.stopNumber}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-base font-heading font-bold text-white">{stop.binCode} — {stop.name}</h4>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      stop.urgencyRank === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    }`}>
                      {stop.urgencyRank} ({stop.currentFill}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {stop.sector} • {stop.wasteType} • Priority Score: {stop.priorityScore}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-heading font-black text-cyan-300 block">+{stop.distanceFromLastStopKm} km</span>
                  <span className="text-[11px] font-mono text-slate-400">Payload: ~{stop.collectedWeightKg} kg</span>
                </div>
              </div>
            ))}

            {/* Unloading Return to Depot */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-dark-900/90 border border-emerald-500/30 shadow-glow-sm">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-black text-emerald-400 text-xs shadow-md">
                DEPOT
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-slate-400">Unloading Hub</span>
                <h4 className="text-base font-heading font-bold text-white">Return to Central Municipal Depot Hub</h4>
                <p className="text-xs text-slate-400 font-mono">Total payload gathered: {routePlan.totalCollectedWasteKg} kg solid waste</p>
              </div>
              <div className="text-right font-mono text-xs text-emerald-400 font-bold">
                Route Completed
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: DSA Technical Breakdown */}
        {activeTab === 'dsa' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="p-5 rounded-2xl bg-dark-900/80 border border-white/[0.08]">
                <div className="flex items-center gap-2 mb-3 text-cyan-400">
                  <Layers className="w-5 h-5" />
                  <h4 className="text-base font-heading font-bold text-white">1. Binary Max-Heap Priority Queue</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Dynamically structures all candidate bins in a max-heap tree based on multi-variable telemetry urgency:
                </p>
                <div className="p-3 rounded-xl bg-dark-950 font-mono text-[11px] text-emerald-300 border border-emerald-500/30">
                  Score = (Fill% × 0.45) + (Risk × 0.30) + (Hours × 0.15) + StatusBoost
                </div>
                <p className="text-[11px] text-slate-400 mt-3 font-mono">
                  Enqueues and extracts critical bins in $O(\log N)$ logarithmic time complexity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-dark-900/80 border border-white/[0.08]">
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                  <Share2 className="w-5 h-5" />
                  <h4 className="text-base font-heading font-bold text-white">2. Dijkstra's Shortest Path Algorithm</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Computes the single-source shortest path along the city adjacency road network between the Depot and target waypoints:
                </p>
                <div className="p-3 rounded-xl bg-dark-950 font-mono text-[11px] text-cyan-300 border border-cyan-500/30">
                  dist[v] = min(dist[v], dist[u] + weight(u, v))
                </div>
                <p className="text-[11px] text-slate-400 mt-3 font-mono">
                  Time Complexity: $O((V + E) \log V)$ using priority queue relaxation.
                </p>
              </div>

            </div>

            {/* Dijkstra Path Sequence Trail */}
            {routePlan && routePlan.fullPathNodes && (
              <div className="p-5 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
                <span className="text-xs font-mono font-bold text-slate-300 block mb-3">
                  Dijkstra Node Traversal Sequence:
                </span>
                <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono">
                  {routePlan.fullPathNodes.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="px-3 py-1.5 rounded-xl bg-dark-950 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm">
                        {node}
                      </span>
                      {i < routePlan.fullPathNodes.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
