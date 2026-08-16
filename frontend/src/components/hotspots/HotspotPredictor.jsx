import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { api } from '../../services/api';

export default function HotspotPredictor() {
  const [hotspotData, setHotspotData] = useState(null);
  const [deployedSectors, setDeployedSectors] = useState({});
  const [selectedSector, setSelectedSector] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await api.getHotspots();
      if (data) {
        setHotspotData(data);
        if (data.sectors && data.sectors.length > 0) {
          setSelectedSector(data.sectors[0]);
        }
      }
    }
    loadData();
  }, []);

  const handleDeployProactive = (sectorId) => {
    setDeployedSectors(prev => ({
      ...prev,
      [sectorId]: true
    }));
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const chartData = selectedSector ? selectedSector.historicalDailyLoadKg.map((val, idx) => ({
    day: daysOfWeek[idx],
    loadKg: val,
    fillPercent: selectedSector.avgDailyFillPercent[idx]
  })) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                MODULE 6 • PREDICTIVE AI
              </span>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Garbage Hotspot Early Warning System</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Time-series AI forecasts tomorrow's high-risk municipal sectors using multi-factor footfall, event spikes, and historical load models.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-mono">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>Tomorrow's Peak Forecast: Market Sector 4 (87% Risk)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sector Alert Cards & Historical Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Sector Risk Forecast Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Tomorrow's Municipal Sector Hotspot Probability:
          </span>

          {hotspotData?.sectors?.map((sector) => {
            const isSelected = selectedSector?.sectorId === sector.sectorId;
            const isDeployed = deployedSectors[sector.sectorId];
            const isHighRisk = sector.predictedTomorrowRiskPercent >= 75;

            return (
              <div
                key={sector.sectorId}
                onClick={() => setSelectedSector(sector)}
                className={`glass-panel rounded-2xl p-5 cursor-pointer transition-all border ${
                  isSelected ? 'border-orange-500/60 bg-slate-900/90 shadow-lg shadow-orange-500/10' :
                  isHighRisk ? 'border-orange-500/30 bg-slate-950/80 hover:border-slate-700' :
                  'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100">{sector.sectorName}</h3>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border ${
                        sector.predictedTomorrowRiskPercent >= 75 ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                        sector.predictedTomorrowRiskPercent >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {sector.predictedTomorrowRiskPercent}% RISK
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{sector.sectorId}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-orange-400 block">
                      +{sector.tomorrowExpectedIncreasePercent}% Surge
                    </span>
                    <span className="text-[10px] text-slate-400">Expected waste volume</span>
                  </div>
                </div>

                {/* Factors Tag Cloud */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {sector.factors.map((f, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      • {f}
                    </span>
                  ))}
                </div>

                {/* Recommended Municipal Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <div className="text-slate-300 flex-1 pr-2">
                    <span className="text-slate-500 font-mono text-[10px] block">AI RECOMMENDED ACTION:</span>
                    <span className="text-[11px] font-medium">{sector.recommendedAction}</span>
                  </div>

                  {isDeployed ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Vehicle Scheduled</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeployProactive(sector.sectorId);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 font-bold transition-all text-xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-orange-400" />
                      <span>Deploy Proactive Truck</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Right: Selected Sector 7-Day Trend Chart (5 cols) */}
        <div className="lg:col-span-5">
          {selectedSector ? (
            <div className="glass-panel rounded-2xl p-5 bg-slate-950/90 border border-slate-800 space-y-4 sticky top-24">
              
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">7-Day Historical Waste Intake</span>
                <h3 className="text-lg font-bold text-slate-100">{selectedSector.sectorName}</h3>
                <p className="text-xs text-slate-400">Daily recorded tonnage vs weekend surges</p>
              </div>

              {/* Chart */}
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} unit="kg" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val) => [`${val} kg`, 'Waste Load']}
                    />
                    <Bar dataKey="loadKg" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index >= 4 ? '#f97316' : '#10b981'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Insight Summary */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Predictive Insight</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Historical weekend load averages <span className="font-mono font-bold text-orange-300">990 kg</span> compared to weekday baseline of 860 kg. Proactive deployment at 11:00 AM avoids 3 community bin overflow events.
                </p>
              </div>

            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
}
