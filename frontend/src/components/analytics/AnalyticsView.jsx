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
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MODULE 7 • MUNICIPAL METRICS
              </span>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Executive Analytics & ESG Impact</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring of waste stream segregation, carbon offsets, and collection turnaround efficiency.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>420 Green ESG Credits Accrued</span>
          </div>
        </div>
      </div>

      {/* High-Level Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Avg Collection Turnaround</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-cyan-300">4.7h</span>
            <span className="text-xs text-slate-400 font-mono line-through">8.2h</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium block mt-1">↓ 42.6% faster response</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Fuel Consumption Cut</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-amber-300">27.4%</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Dijkstra VRP Optimization</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">CO₂ Averted / Month</span>
            <Trees className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-400">18.6 <span className="text-xs">Tons</span></span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Equivalent to 840 trees planted</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Overflows Prevented</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-purple-300">142</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Preemptive ETA dispatch</span>
        </div>

      </div>

      {/* Visual Charts & Telematics Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Waste Composition Pie Chart (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 bg-slate-950/90 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Municipal Waste Composition</h3>
              <p className="text-xs text-slate-400">AI Vision Classified Material Distribution</p>
            </div>
            <PieIcon className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPOSITION_COLORS[index % COMPOSITION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Composition']}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Live Telematics Audit Trail (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Real-time System Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-400">Chronological feed of sensor spikes, AI scans, and routing events</p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {auditLogs.slice(0, 8).map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span className="font-bold text-cyan-400">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed font-sans">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-800 mt-2">
            Telemetry pulse active • Node backend & AI sync OK
          </div>
        </div>

      </div>

    </div>
  );
}
