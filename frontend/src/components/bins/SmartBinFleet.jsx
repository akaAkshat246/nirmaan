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
  Layers
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
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MODULE 2 • TELEMATICS
              </span>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Smart Bin Fleet Telematics</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Active ultrasonic IoT nodes reporting fill levels, fill velocity ($\Delta fill / hr$), odour index, and solar power metrics.
            </p>
          </div>

          {/* Quick Filter Status Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'NORMAL'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  filterStatus === st
                    ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by bin code (e.g. BIN #104), location name, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Bins Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBins.map((bin) => {
          const isCritical = bin.status === 'CRITICAL' || bin.currentFill >= 90;
          const isHigh = bin.status === 'HIGH';

          return (
            <div
              key={bin.id}
              className={`glass-panel rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isCritical ? 'glass-panel-critical' :
                isHigh ? 'border-orange-500/30 bg-slate-950/80 hover:border-orange-500/50' :
                'border-slate-800 bg-slate-950/70 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{bin.sector}</span>
                    <h3 className="text-base font-bold text-slate-100">{bin.bin_code}</h3>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{bin.name}</p>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isCritical ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' :
                    isHigh ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    bin.status === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {bin.status}
                  </span>
                </div>

                {/* Ultrasonic Fill Level Gauge */}
                <div className="my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-300">Fill Level</span>
                    <span className="text-xl font-black font-mono text-slate-100">{bin.currentFill}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        isHigh ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${bin.currentFill}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                    <span>Rate: {bin.fillRatePerHour}% / hr</span>
                    <span className="text-emerald-400 font-bold">ETA: ~{bin.overflowEtaHours}h</span>
                  </div>
                </div>

                {/* Sensors Row */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 mb-4">
                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{bin.batteryPercent}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{bin.solarActive ? 'Solar' : 'Bat'}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{bin.temperatureC}°C</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onTriggerSurge(bin.id, 92)}
                  className="flex-1 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Zap className="w-3 h-3 text-red-400" />
                  <span>Surge</span>
                </button>

                <button
                  onClick={() => onCollectBin(bin.id)}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
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
