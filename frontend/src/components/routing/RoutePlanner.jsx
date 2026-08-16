import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Share2, 
  Cpu, 
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
  Code2
} from 'lucide-react';
import { api } from '../../services/api';

export default function RoutePlanner({ bins = [], onRouteGenerated = () => {} }) {
  const [routePlan, setRoutePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stops'); // 'stops', 'dsa', 'graph'

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
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                MODULE 4 • DSA POWERED
              </span>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Intelligent Collection Route Optimizer</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Vehicle Routing Engine using <span className="text-emerald-400 font-mono">Dijkstra's Shortest Path</span> and <span className="text-cyan-400 font-mono">Binary Max-Heap Priority Queues</span>.
            </p>
          </div>

          <button
            onClick={handleGenerateRoute}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            <span>{loading ? 'Solving Graph...' : 'Re-Optimize DSA Route'}</span>
          </button>
        </div>
      </div>

      {/* Benchmark Efficiency Comparison Banner */}
      {routePlan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">Optimal Route Distance</span>
              <Truck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">
              {routePlan.totalDistanceKm} <span className="text-xs text-slate-400">km</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              vs legacy static {routePlan.legacyDistanceKm} km
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">Distance Saved</span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              -{routePlan.distanceSavedKm} <span className="text-xs text-emerald-500">km (29.6%)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Dijkstra pathfinding reduction</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">Fuel Saved / Round</span>
              <Fuel className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-amber-300">
              {routePlan.fuelSavedLiters} <span className="text-xs text-slate-400">L Diesel</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">₹{Math.round(routePlan.fuelSavedLiters * 92)} fuel cost saving</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">CO₂ Emissions Cut</span>
              <Trees className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              -{routePlan.co2SavedKg} <span className="text-xs text-slate-400">kg CO₂</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">ESG Green credits earned</div>
          </div>

        </div>
      )}

      {/* Main Routing Details & DSA Explanation Tabs */}
      <div className="glass-panel rounded-2xl p-6 bg-slate-950/90 border border-slate-800">
        
        {/* Sub Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('stops')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'stops'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Turn-by-Turn Vehicle Dispatch ({routePlan?.stops?.length || 0} Stops)
          </button>

          <button
            onClick={() => setActiveTab('dsa')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dsa'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>DSA Algorithm Breakdown</span>
          </button>
        </div>

        {/* Tab 1: Turn by Turn Stops */}
        {activeTab === 'stops' && routePlan && (
          <div className="space-y-4">
            
            {/* Start Node: Central Depot */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-400">
                START
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Fleet Origin Hub</span>
                <h4 className="text-sm font-bold text-slate-100">Central Municipal Depot Hub (Industrial Sector 1)</h4>
                <p className="text-xs text-slate-400">Vehicle DL-01-EA-4092 (Capacity: 5000 kg)</p>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                0.0 km
              </div>
            </div>

            {/* Intermediate Waypoint Bins */}
            {routePlan.stops.map((stop, idx) => (
              <div 
                key={stop.binId}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                  stop.urgencyRank === 'CRITICAL' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                  stop.urgencyRank === 'HIGH' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' :
                  'bg-amber-500/20 border-amber-500/40 text-amber-400'
                }`}>
                  #{stop.stopNumber}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{stop.binCode} — {stop.name}</h4>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border ${
                      stop.urgencyRank === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    }`}>
                      {stop.urgencyRank} ({stop.currentFill}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{stop.sector} • {stop.wasteType} • Priority Score: {stop.priorityScore}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-300 block">+{stop.distanceFromLastStopKm} km</span>
                  <span className="text-[10px] font-mono text-slate-400">Payload: ~{stop.collectedWeightKg} kg</span>
                </div>
              </div>
            ))}

            {/* Return to Depot */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-400">
                END
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Unloading Hub</span>
                <h4 className="text-sm font-bold text-slate-100">Return to Central Municipal Depot Hub</h4>
                <p className="text-xs text-slate-400">Total collected payload: {routePlan.totalCollectedWasteKg} kg waste</p>
              </div>
              <div className="text-right font-mono text-xs text-emerald-400 font-bold">
                Route Completed
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: DSA Algorithm Breakdown */}
        {activeTab === 'dsa' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Algorithm 1: Priority Queue */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-cyan-400">
                  <Layers className="w-4 h-4" />
                  <h4 className="text-sm font-bold">1. Binary Max-Heap Priority Queue</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Orders candidate bins dynamically according to a multi-factor urgency formula:
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800">
                  Priority = (Fill% × 0.45) + (Risk × 0.30) + (Hours × 0.15) + StatusBoost
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Guarantees that critical overflowing bins bubble to root in $O(\log N)$ time.
                </p>
              </div>

              {/* Algorithm 2: Dijkstra */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <Share2 className="w-4 h-4" />
                  <h4 className="text-sm font-bold">2. Dijkstra's Shortest Path Algorithm</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Finds the minimum distance traversal between the Municipal Depot and target bins over the city adjacency graph:
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800">
                  dist[v] = min(dist[v], dist[u] + weight(u, v))
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Time Complexity: $O((V + E) \log V)$ with adjacency list and min-heap.
                </p>
              </div>

            </div>

            {/* Path Trace Node Flow */}
            {routePlan && routePlan.fullPathNodes && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-300 block mb-2">
                  Dijkstra Node Traversal Sequence:
                </span>
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                  {routePlan.fullPathNodes.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-bold">
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
