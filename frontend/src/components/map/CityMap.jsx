import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  AlertTriangle, 
  Clock, 
  Battery, 
  Sun, 
  Wind, 
  Thermometer, 
  CheckCircle2, 
  Zap,
  Info,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';

export default function CityMap({ 
  bins = [], 
  activeRoute = null, 
  onSelectBin = () => {}, 
  onTriggerSurge = () => {}, 
  onCollectBin = () => {} 
}) {
  const [selectedBinId, setSelectedBinId] = useState('BIN-104');
  const [hoveredNode, setHoveredNode] = useState(null);

  // City Network Nodes Coordinates for SVG ViewBox (860 x 640)
  const nodeMap = {
    'DEPOT':  { x: 130, y: 480, name: 'Central Depot Hub', sector: 'Industrial Sector 1', isDepot: true },
    'NODE_A': { x: 270, y: 160, name: 'Commercial Market Square', sector: 'Market Sector 4' },
    'NODE_B': { x: 530, y: 130, name: 'City Tech Park East', sector: 'IT Hub Sector 18' },
    'NODE_C': { x: 740, y: 180, name: 'Greenfield University Campus', sector: 'Knowledge Park' },
    'NODE_D': { x: 310, y: 360, name: 'Heritage Old Town Bazaar', sector: 'Old City Sector 2' },
    'NODE_E': { x: 510, y: 340, name: 'Metro Transit Interchange', sector: 'Central Sector 7' },
    'NODE_F': { x: 720, y: 350, name: 'Lakeview Residency Colony', sector: 'Residential Zone 12' },
    'NODE_G': { x: 270, y: 550, name: 'South Extension Food Court', sector: 'Commercial Sector 9' },
    'NODE_H': { x: 500, y: 530, name: 'Civic Hospital & Health Enclave', sector: 'Medical Sector 15' },
    'NODE_I': { x: 730, y: 510, name: 'Eco Botanical Riverfront', sector: 'Green Belt Sector 21' },
  };

  const edges = [
    { from: 'DEPOT', to: 'NODE_D', dist: '3.8 km' },
    { from: 'DEPOT', to: 'NODE_G', dist: '2.9 km' },
    { from: 'NODE_A', to: 'NODE_B', dist: '4.5 km' },
    { from: 'NODE_A', to: 'NODE_D', dist: '3.2 km' },
    { from: 'NODE_B', to: 'NODE_C', dist: '3.9 km' },
    { from: 'NODE_B', to: 'NODE_E', dist: '3.4 km' },
    { from: 'NODE_C', to: 'NODE_F', dist: '2.8 km' },
    { from: 'NODE_D', to: 'NODE_E', dist: '3.1 km' },
    { from: 'NODE_D', to: 'NODE_G', dist: '3.6 km' },
    { from: 'NODE_E', to: 'NODE_F', dist: '3.5 km' },
    { from: 'NODE_E', to: 'NODE_H', dist: '2.7 km' },
    { from: 'NODE_F', to: 'NODE_I', dist: '3.0 km' },
    { from: 'NODE_G', to: 'NODE_H', dist: '3.3 km' },
    { from: 'NODE_H', to: 'NODE_I', dist: '3.7 km' },
  ];

  const binsByNode = {};
  bins.forEach(b => {
    if (b.nodeId) binsByNode[b.nodeId] = b;
  });

  const selectedBin = bins.find(b => b.id === selectedBinId) || bins[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return { bg: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)', border: '#f87171', fillHex: '#ef4444' };
      case 'HIGH': return { bg: '#f97316', glow: 'rgba(249, 115, 22, 0.5)', border: '#fb923c', fillHex: '#f97316' };
      case 'MODERATE': return { bg: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', border: '#fbbf24', fillHex: '#f59e0b' };
      default: return { bg: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', border: '#34d399', fillHex: '#10b981' };
    }
  };

  let routePathD = '';
  if (activeRoute && activeRoute.fullPathNodes && activeRoute.fullPathNodes.length > 1) {
    const coords = activeRoute.fullPathNodes.map(nodeId => nodeMap[nodeId]).filter(Boolean);
    if (coords.length > 1) {
      routePathD = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Vector GIS City Map (8 cols) */}
      <div className="lg:col-span-8 glass-panel-luxury rounded-3xl p-6 relative overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between">
        
        {/* Map Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-heading font-extrabold text-white tracking-wide">
                City Sector Telematics Grid
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">Dijkstra Weighted Adjacency Road Graph & Ultrasonic Nodes</p>
          </div>

          {/* Legend Badges */}
          <div className="flex items-center gap-3 text-[11px] font-mono p-1.5 rounded-xl bg-dark-900/90 border border-white/[0.08]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-sm"></span> &lt;50%
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 50–75%
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 75–90%
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-red animate-ping"></span> &gt;90% Critical
            </span>
          </div>
        </div>

        {/* Vector SVG Map Container */}
        <div className="relative w-full h-[520px] bg-dark-900/70 rounded-2xl border border-white/[0.08] p-2 overflow-hidden cyber-grid">
          
          <svg viewBox="0 0 860 640" className="w-full h-full select-none">
            <defs>
              <filter id="neon-glow-red" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="neon-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Road Graph Edges (Highways & City Avenues) */}
            {edges.map((edge, idx) => {
              const u = nodeMap[edge.from];
              const v = nodeMap[edge.to];
              if (!u || !v) return null;
              return (
                <g key={`edge-${idx}`}>
                  {/* Road Base */}
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#14213d"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Road Center Stripe */}
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#2a3f6d"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Edge Weight Distance Pill */}
                  <rect
                    x={(u.x + v.x) / 2 - 20}
                    y={(u.y + v.y) / 2 - 9}
                    width="40"
                    height="16"
                    rx="4"
                    fill="#0a101f"
                    stroke="#203055"
                    strokeWidth="1"
                  />
                  <text
                    x={(u.x + v.x) / 2}
                    y={(u.y + v.y) / 2 + 3}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {edge.dist}
                  </text>
                </g>
              );
            })}

            {/* Active Dijkstra Vehicle Route Highlight */}
            {routePathD && (
              <g>
                <path
                  d={routePathD}
                  fill="none"
                  stroke="#00e1ff"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                  filter="url(#neon-glow-cyan)"
                />
                <path
                  d={routePathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="10 6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </g>
            )}

            {/* Vertices & Smart Bin Nodes */}
            {Object.entries(nodeMap).map(([nodeId, node]) => {
              const bin = binsByNode[nodeId];
              const isSelected = bin && bin.id === selectedBinId;
              const isDepot = node.isDepot;
              const isCritical = bin && (bin.status === 'CRITICAL' || bin.currentFill >= 90);
              const colorInfo = bin ? getStatusColor(bin.status) : { bg: '#64748b', glow: 'transparent', border: '#94a3b8' };

              return (
                <g 
                  key={nodeId}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => {
                    if (bin) {
                      setSelectedBinId(bin.id);
                      onSelectBin(bin);
                    }
                  }}
                  onMouseEnter={() => setHoveredNode({ nodeId, node, bin })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Ping Animation on Critical */}
                  {isCritical && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  )}

                  {/* Outer Glowing Energy Ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isDepot ? 25 : 21}
                    fill="#080e1a"
                    stroke={isSelected ? '#38bdf8' : isDepot ? '#10b981' : colorInfo.border}
                    strokeWidth={isSelected ? 3.5 : 2}
                    filter={isCritical ? 'url(#neon-glow-red)' : undefined}
                  />

                  {/* Icon or Percentage Center */}
                  {isDepot ? (
                    <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                      <Truck className="w-5 h-5 text-emerald-400" />
                    </g>
                  ) : bin ? (
                    <text
                      x={node.x}
                      y={node.y + 4.5}
                      fill={colorInfo.bg}
                      fontSize="11"
                      fontWeight="800"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {bin.currentFill}%
                    </text>
                  ) : null}

                  {/* Node Name & Sector Labels */}
                  <rect
                    x={node.x - 48}
                    y={node.y + (isDepot ? 30 : 26)}
                    width="96"
                    height="18"
                    rx="6"
                    fill="#080e1a"
                    stroke={isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}
                    strokeWidth="1"
                  />
                  <text
                    x={node.x}
                    y={node.y + (isDepot ? 42 : 38)}
                    fill={isSelected ? '#38bdf8' : '#ffffff'}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                  >
                    {isDepot ? 'Depot Hub' : bin ? bin.bin_code : node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Route HUD Overlay Pill */}
          {activeRoute && activeRoute.stops && activeRoute.stops.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-dark-950/90 border border-cyan-500/40 shadow-glow-cyan backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-bounce">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-heading font-bold text-white text-sm">Active Fleet Route:</span>
                  <span className="text-cyan-300 font-mono ml-2">
                    {activeRoute.totalStops} Urgent Stops ({activeRoute.totalDistanceKm} km)
                  </span>
                </div>
              </div>

              <div className="text-slate-400 font-mono text-[11px] flex items-center gap-3">
                <span>ETA: <strong className="text-emerald-400">{activeRoute.estimatedDurationMinutes} mins</strong></span>
                <span>•</span>
                <span className="text-cyan-300 font-bold">Dijkstra Shortest Path</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. Selected Smart Bin Telematics Inspector (4 cols) */}
      <div className="lg:col-span-4 glass-panel-luxury rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
        {selectedBin ? (
          <div className="space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Node Telematics</span>
                <h3 className="text-2xl font-heading font-black text-white mt-0.5">{selectedBin.bin_code}</h3>
                <p className="text-xs text-slate-300 font-medium">{selectedBin.name}</p>
                <span className="text-[11px] text-slate-500 font-mono">{selectedBin.sector}</span>
              </div>

              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase border shadow-md ${
                selectedBin.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-glow-red animate-pulse' :
                selectedBin.status === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                selectedBin.status === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-glow-sm'
              }`}>
                {selectedBin.status}
              </span>
            </div>

            {/* Ultrasonic Fill Meter */}
            <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Ultrasonic Fill Level</span>
                <span className="text-3xl font-heading font-black text-white">{selectedBin.currentFill}%</span>
              </div>

              <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedBin.currentFill >= 90 ? 'bg-gradient-to-r from-orange-500 via-red-500 to-red-600' :
                    selectedBin.currentFill >= 75 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    'bg-gradient-to-r from-teal-400 to-emerald-400'
                  }`}
                  style={{ width: `${selectedBin.currentFill}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2.5">
                <span>0% Clean</span>
                <span>Capacity: {selectedBin.capacityLiters} L</span>
                <span>100% Full</span>
              </div>
            </div>

            {/* AI Overflow Prediction Box */}
            <div className={`p-4 rounded-2xl border transition-all ${
              selectedBin.status === 'CRITICAL' ? 'bg-red-950/40 border-red-500/50 text-red-200' :
              selectedBin.status === 'HIGH' ? 'bg-orange-950/30 border-orange-500/40 text-orange-200' :
              'bg-dark-900/90 border-white/[0.08] text-slate-300'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200">
                  AI Time-to-Overflow Forecast
                </span>
              </div>
              <p className="text-sm font-semibold">
                Estimated Overflow: <span className="font-mono text-emerald-400 font-bold text-base">~{selectedBin.overflowEtaHours} hours</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Velocity: <span className="text-slate-200 font-bold">{selectedBin.fillRatePerHour}% / hr</span> | Last pickup: {selectedBin.lastCollectedHoursAgo}h ago
              </p>
            </div>

            {/* IoT Sensor Matrix */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-dark-900/70 border border-white/[0.06] flex items-center gap-2.5">
                <Battery className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Battery</span>
                  <span className="font-mono font-bold text-white">{selectedBin.batteryPercent}%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/70 border border-white/[0.06] flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Solar Cell</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedBin.solarActive ? 'ACTIVE' : 'OFF'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/70 border border-white/[0.06] flex items-center gap-2.5">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Core Temp</span>
                  <span className="font-mono font-bold text-white">{selectedBin.temperatureC}°C</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/70 border border-white/[0.06] flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Odour Index</span>
                  <span className="font-mono font-bold text-white">{selectedBin.odourIndex}/100</span>
                </div>
              </div>
            </div>

            {/* Quick Action Simulation Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => onTriggerSurge(selectedBin.id, 92)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-red-400" />
                <span>Simulate Surge</span>
              </button>

              <button
                onClick={() => onCollectBin(selectedBin.id)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Mark Empty</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Info className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>Click any node on the city map to inspect real-time telematics.</p>
          </div>
        )}
      </div>

    </div>
  );
}
