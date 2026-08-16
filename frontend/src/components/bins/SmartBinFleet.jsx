import React, { useState } from 'react';
import { 
  Trash2, 
  Battery, 
  Sun, 
  Clock, 
  Thermometer, 
  Wind, 
  Zap, 
  CheckCircle2, 
  Search, 
  Filter,
  Flame,
  Layers,
  Radio
} from 'lucide-react';

export default function SmartBinFleet({ 
  bins = [], 
  onTriggerSurge = () => {}, 
  onCollectBin = () => {} 
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.bin_code.toLowerCase().includes(search.toLowerCase()) ||
                          bin.name.toLowerCase().includes(search.toLowerCase()) ||
                          bin.sector.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || bin.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                MODULE 2 • IOT HARDWARE TELEMETRICS
              </span>
              <span className="text-xs font-mono text-slate-400">Continuous 15s Ultrasonic Telemetry Pulse</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              Smart Bin Fleet & <span className="gradient-text-emerald">Sensor Matrix</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Monitors volumetric capacity, fill-velocity rates ($\Delta fill / hr$), solar harvesting, battery health, and odour indices across all municipal bins.
            </p>
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'NORMAL'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                  filterStatus === st
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-dark-950 shadow-glow-sm scale-105'
                    : 'bg-dark-900 text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by bin code (e.g. BIN #104), location name, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-dark-900/90 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* Bins Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBins.map((bin) => {
          const isCritical = bin.status === 'CRITICAL' || bin.currentFill >= 90;
          const isHigh = bin.status === 'HIGH';

          return (
            <div
              key={bin.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                isCritical ? 'glass-panel-critical-luxury' :
                isHigh ? 'glass-panel-luxury border-orange-500/30 hover:border-orange-500/50' :
                'glass-panel-luxury border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{bin.sector}</span>
                    <h3 className="text-xl font-heading font-black text-white mt-0.5">{bin.bin_code}</h3>
                    <p className="text-xs text-slate-300 truncate max-w-[200px]">{bin.name}</p>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${
                    isCritical ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-glow-red animate-pulse' :
                    isHigh ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                    bin.status === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-glow-sm'
                  }`}>
                    {bin.status}
                  </span>
                </div>

                {/* Fill Meter Bar */}
                <div className="my-5 p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">Fill Level</span>
                    <span className="text-2xl font-heading font-black text-white">{bin.currentFill}%</span>
                  </div>

                  <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        isHigh ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${bin.currentFill}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2.5">
                    <span>Rate: {bin.fillRatePerHour}% / hr</span>
                    <span className="text-emerald-400 font-bold">ETA: ~{bin.overflowEtaHours}h</span>
                  </div>
                </div>

                {/* Sensor Matrix Row */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 mb-5">
                  <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/[0.06] flex items-center gap-2">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{bin.batteryPercent}%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/[0.06] flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{bin.solarActive ? 'Solar' : 'Bat'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/[0.06] flex items-center gap-2">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{bin.temperatureC}°C</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => onTriggerSurge(bin.id, 92)}
                  className="flex-1 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  <span>Surge</span>
                </button>

                <button
                  onClick={() => onCollectBin(bin.id)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Collect</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
