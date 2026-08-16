import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingDown, 
  Fuel, 
  Trees, 
  Clock, 
  Award, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { api } from '../../services/api';

const COMPOSITION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

export default function AnalyticsView() {
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await api.getAnalytics();
      setAnalytics(data);
      const logs = await api.getAuditLogs();
      if (Array.isArray(logs)) setAuditLogs(logs);
    }
    loadData();
  }, []);

  const compositionData = analytics?.compositionGlobal
    ? Object.entries(analytics.compositionGlobal).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                MODULE 7 • ESG SUSTAINABILITY
              </span>
              <span className="text-xs font-mono text-slate-400">Carbon Offset & Turnaround Ledger</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              Executive Analytics & <span className="gradient-text-emerald">ESG Impact Metrics</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Quantifiable environmental savings, AI waste composition stream breakdown, and real-time municipal telemetry audit ledger.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-dark-900/90 border border-emerald-500/30 text-xs font-heading font-bold text-emerald-400 flex items-center gap-2.5 shadow-glow-sm">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>420 Green ESG Credits Accrued</span>
          </div>
        </div>
      </div>

      {/* Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Avg Turnaround</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-cyan-300">4.7h</span>
            <span className="text-xs text-slate-500 font-mono line-through">8.2h</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono block mt-1.5">↓ 42.6% response time</span>
        </div>

        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Fuel Consumption</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-amber-300">27.4%</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block mt-1.5">Dijkstra VRP Optimization</span>
        </div>

        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">CO₂ Averted / Month</span>
            <Trees className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-emerald-400">18.6 <span className="text-sm font-mono">Tons</span></span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block mt-1.5">Equiv to 840 trees planted</span>
        </div>

        <div className="glass-panel-luxury rounded-2xl p-5 border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Overflows Prevented</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-purple-300">142</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block mt-1.5">Preemptive ETA dispatch</span>
        </div>

      </div>

      {/* Visual Composition Chart & Realtime Audit Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Waste Composition Donut Chart (6 cols) */}
        <div className="lg:col-span-6 glass-panel-luxury rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Municipal Waste Composition</h3>
              <p className="text-xs text-slate-400 font-mono">AI Vision Material Breakdown</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPOSITION_COLORS[index % COMPOSITION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#080e1a', borderColor: '#233867', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Composition']}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Live Telematics Audit Trail (6 cols) */}
        <div className="lg:col-span-6 glass-panel-luxury rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span>Real-time System Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">Live feed of sensor pulses, AI inferences, and routing events</p>
              </div>
            </div>

            <div className="space-y-3 max-h-76 overflow-y-auto pr-1">
              {auditLogs.slice(0, 8).map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 rounded-2xl bg-dark-900/60 border border-white/[0.06] text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span className="font-bold text-cyan-300 font-heading">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-xs font-sans leading-relaxed">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-white/[0.08] mt-3 flex items-center justify-between">
            <span>Mesh Telemetry: 15s Pulse</span>
            <span className="text-emerald-400">Node API & AI Sync 100% OK</span>
          </div>
        </div>

      </div>

    </div>
  );
}
