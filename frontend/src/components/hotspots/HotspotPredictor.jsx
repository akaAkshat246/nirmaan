import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Layers,
  Radio
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
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                MODULE 6 • TIME-SERIES FORECASTING
              </span>
              <span className="text-xs font-mono text-slate-400">Multivariate Risk Assessment</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              Municipal Garbage Hotspot <span className="gradient-text-gold">Early Warning System</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Synthesizes historical intake data, day-of-week retail spikes, event footfalls, and weather conditions to forecast tomorrow's high-risk sectors before overflowing incidents occur.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-heading font-bold shadow-glow-amber">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>Tomorrow's Peak Risk: Market Sector 4 (87% Probability)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sector Alert Cards & 7-Day Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Sector Risk Forecast Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
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
                className={`rounded-3xl p-6 cursor-pointer transition-all duration-300 border shadow-xl ${
                  isSelected ? 'border-orange-500/60 bg-dark-900 shadow-glow-amber scale-[1.01]' :
                  isHighRisk ? 'glass-panel-luxury border-orange-500/30 hover:border-orange-500/50' :
                  'glass-panel-luxury border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-heading font-bold text-white">{sector.sectorName}</h3>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        sector.predictedTomorrowRiskPercent >= 75 ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-glow-red' :
                        sector.predictedTomorrowRiskPercent >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      }`}>
                        {sector.predictedTomorrowRiskPercent}% RISK
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{sector.sectorId}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-heading font-black text-orange-400 block">
                      +{sector.tomorrowExpectedIncreasePercent}% Surge
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Predicted volume rise</span>
                  </div>
                </div>

                {/* Factors Tag Cloud */}
                <div className="flex flex-wrap gap-2 my-4">
                  {sector.factors.map((f, i) => (
                    <span key={i} className="text-[10px] font-mono px-3 py-1 rounded-xl bg-dark-950 text-slate-300 border border-white/[0.06]">
                      • {f}
                    </span>
                  ))}
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs">
                  <div className="text-slate-300 flex-1 pr-3">
                    <span className="text-slate-500 font-mono text-[10px] uppercase block tracking-wider">Recommended Municipal Action:</span>
                    <span className="text-xs font-semibold text-white">{sector.recommendedAction}</span>
                  </div>

                  {isDeployed ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 shadow-glow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vehicle Scheduled</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeployProactive(sector.sectorId);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-heading font-bold transition-all text-xs shadow-glow-amber transform hover:scale-[1.02]"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-200" />
                      <span>Deploy Prevention Fleet</span>
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
            <div className="glass-panel-luxury rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 sticky top-28">
              
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">7-Day Historical Waste Intake</span>
                <h3 className="text-xl font-heading font-black text-white mt-1">{selectedSector.sectorName}</h3>
                <p className="text-xs text-slate-400 font-mono">Daily recorded tonnage vs weekend surges</p>
              </div>

              {/* Chart */}
              <div className="h-68 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#19284a" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} unit="kg" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#080e1a', borderColor: '#233867', borderRadius: '12px', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                      formatter={(val) => [`${val} kg`, 'Waste Load']}
                    />
                    <Bar dataKey="loadKg" radius={[6, 6, 0, 0]}>
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
              <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-orange-400 font-heading font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Early Warning Summary</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
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
