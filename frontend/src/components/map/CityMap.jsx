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
  Layers, 
  Zap,
  Info
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
    'DEPOT':  { x: 120, y: 480, name: 'Central Depot Hub', sector: 'Industrial Sector 1', isDepot: true },
    'NODE_A': { x: 260, y: 160, name: 'Commercial Market Square', sector: 'Market Sector 4' },
    'NODE_B': { x: 520, y: 120, name: 'City Tech Park East', sector: 'IT Hub Sector 18' },
    'NODE_C': { x: 740, y: 180, name: 'Greenfield University Campus', sector: 'Knowledge Park' },
    'NODE_D': { x: 300, y: 360, name: 'Heritage Old Town Bazaar', sector: 'Old City Sector 2' },
    'NODE_E': { x: 500, y: 340, name: 'Metro Transit Interchange', sector: 'Central Sector 7' },
    'NODE_F': { x: 720, y: 350, name: 'Lakeview Residency Colony', sector: 'Residential Zone 12' },
    'NODE_G': { x: 260, y: 550, name: 'South Extension Food Court', sector: 'Commercial Sector 9' },
    'NODE_H': { x: 490, y: 530, name: 'Civic Hospital & Health Enclave', sector: 'Medical Sector 15' },
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

  // Map bins to their graph nodes
  const binsByNode = {};
  bins.forEach(b => {
    if (b.nodeId) binsByNode[b.nodeId] = b;
  });

  const selectedBin = bins.find(b => b.id === selectedBinId) || bins[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return { bg: '#ef4444', ring: 'rgba(239, 68, 68, 0.4)', text: 'text-red-400', border: 'border-red-500' };
      case 'HIGH': return { bg: '#f97316', ring: 'rgba(249, 115, 22, 0.4)', text: 'text-orange-400', border: 'border-orange-500' };
      case 'MODERATE': return { bg: '#f59e0b', ring: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400', border: 'border-amber-500' };
      default: return { bg: '#10b981', ring: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400', border: 'border-emerald-500' };
    }
  };

  // Build active route path string for SVG
  let routePathD = '';
  if (activeRoute && activeRoute.fullPathNodes && activeRoute.fullPathNodes.length > 1) {
    const coords = activeRoute.fullPathNodes.map(nodeId => nodeMap[nodeId]).filter(Boolean);
    if (coords.length > 1) {
      routePathD = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* City GIS Vector Map (2 cols) */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-5 relative overflow-hidden bg-slate-950/80 border border-slate-800">
        
        {/* Map Header */}
        <div className="flex items-center justify-between mb-3 z-10 relative">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>City Telematics & Smart Bin Grid</span>
            </h2>
            <p className="text-xs text-slate-400">Real-time GPS sensor mesh with Dijkstra topological routing</p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal (&lt;50%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 50-75%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 75-90%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> &gt;90% Critical</span>
          </div>
        </div>

        {/* Vector SVG Map Display */}
        <div className="relative w-full h-[480px] bg-slate-900/60 rounded-xl border border-slate-800/80 p-2 overflow-hidden bg-grid-pattern">
          
          <svg viewBox="0 0 860 640" className="w-full h-full">
            <defs>
              {/* Glow filter for critical nodes */}
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Road Graph Edges (Background roads) */}
            {edges.map((edge, idx) => {
              const u = nodeMap[edge.from];
              const v = nodeMap[edge.to];
              if (!u || !v) return null;
              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#1e293b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Distance label */}
                  <text
                    x={(u.x + v.x) / 2}
                    y={(u.y + v.y) / 2 - 4}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.dist}
                  </text>
                </g>
              );
            })}

            {/* Active Optimized Collection Route Highlight (DSA Dijkstra Path) */}
            {routePathD && (
              <g>
                <path
                  d={routePathD}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                  filter="url(#glow-cyan)"
                />
                <path
                  d={routePathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </g>
            )}

            {/* Nodes (Depot & Smart Bins) */}
            {Object.entries(nodeMap).map(([nodeId, node]) => {
              const bin = binsByNode[nodeId];
              const isSelected = bin && bin.id === selectedBinId;
              const isDepot = node.isDepot;
              const isCritical = bin && (bin.status === 'CRITICAL' || bin.currentFill >= 90);
              const colorInfo = bin ? getStatusColor(bin.status) : { bg: '#64748b', ring: 'transparent', text: 'text-slate-400' };

              return (
                <g 
                  key={nodeId}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    if (bin) {
                      setSelectedBinId(bin.id);
                      onSelectBin(bin);
                    }
                  }}
                  onMouseEnter={() => setHoveredNode({ nodeId, node, bin })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer pulse for critical or selected */}
                  {isCritical && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="26"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.6"
                    />
                  )}

                  {/* Node Base Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isDepot ? 22 : 18}
                    fill={isDepot ? '#0f172a' : '#090d16'}
                    stroke={isSelected ? '#38bdf8' : isDepot ? '#10b981' : colorInfo.bg}
                    strokeWidth={isSelected ? 3.5 : 2.5}
                    filter={isCritical ? 'url(#glow-red)' : undefined}
                  />

                  {/* Inner fill status indicator */}
                  {isDepot ? (
                    <g transform={`translate(${node.x - 9}, ${node.y - 9})`}>
                      <Truck className="w-4 h-4 text-emerald-400" />
                    </g>
                  ) : bin ? (
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill={colorInfo.bg}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {bin.currentFill}%
                    </text>
                  ) : null}

                  {/* Node Name Label */}
                  <text
                    x={node.x}
                    y={node.y + 32}
                    fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : '500'}
                    textAnchor="middle"
                  >
                    {isDepot ? 'Depot Hub' : bin ? bin.bin_code : node.name}
                  </text>
                  
                  <text
                    x={node.x}
                    y={node.y + 45}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {node.sector}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Route Floating Banner */}
          {activeRoute && activeRoute.stops && activeRoute.stops.length > 0 && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-cyan-500/30 rounded-lg p-2.5 backdrop-blur-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span className="font-semibold text-slate-200">Active Collection Route:</span>
                <span className="text-cyan-300 font-mono">
                  {activeRoute.totalStops} Stops ({activeRoute.totalDistanceKm} km)
                </span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Est. Duration: <span className="text-emerald-400 font-bold">{activeRoute.estimatedDurationMinutes}m</span> | Dijkstra Shortest Path
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Selected Smart Bin Telematics Inspector (1 col) */}
      <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
        {selectedBin ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Telematics Inspector</span>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>{selectedBin.bin_code}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                    selectedBin.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' :
                    selectedBin.status === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    selectedBin.status === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {selectedBin.status}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{selectedBin.name} ({selectedBin.sector})</p>
              </div>
            </div>

            {/* Fill Level Big Meter */}
            <div className="my-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-300">Live Ultrasonic Fill Level</span>
                <span className="text-2xl font-black font-mono tracking-tight text-slate-100">
                  {selectedBin.currentFill}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedBin.currentFill >= 90 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    selectedBin.currentFill >= 75 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    selectedBin.currentFill >= 50 ? 'bg-gradient-to-r from-emerald-500 to-amber-500' :
                    'bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                  style={{ width: `${selectedBin.currentFill}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                <span>0% Empty</span>
                <span>Cap: {selectedBin.capacityLiters} L</span>
                <span>100% Full</span>
              </div>
            </div>

            {/* AI Overflow Forecast Box */}
            <div className={`p-3.5 rounded-xl mb-4 border ${
              selectedBin.status === 'CRITICAL' ? 'bg-red-950/30 border-red-500/40 text-red-200' :
              selectedBin.status === 'HIGH' ? 'bg-orange-950/30 border-orange-500/40 text-orange-200' :
              'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-wide">AI Overflow Prediction</span>
              </div>
              <p className="text-sm font-semibold">
                Estimated Overflow: <span className="font-mono text-emerald-400 font-bold">~{selectedBin.overflowEtaHours} hours</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Filling rate: <span className="font-mono text-slate-200 font-bold">{selectedBin.fillRatePerHour}% / hr</span> | Last collected: {selectedBin.lastCollectedHoursAgo}h ago
              </p>
            </div>

            {/* IoT Sensor Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                <Battery className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Battery</span>
                  <span className="font-mono font-bold">{selectedBin.batteryPercent}%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Solar Harvester</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedBin.solarActive ? 'ACTIVE' : 'OFF'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Internal Temp</span>
                  <span className="font-mono font-bold">{selectedBin.temperatureC}°C</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                <Wind className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Odour Index</span>
                  <span className="font-mono font-bold">{selectedBin.odourIndex}/100</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons for Judge Demo */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onTriggerSurge(selectedBin.id, 92)}
                className="flex-1 py-2 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate Surge</span>
              </button>

              <button
                onClick={() => onCollectBin(selectedBin.id)}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Empty / Collect</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Select a bin on the map to inspect live telematics.</p>
          </div>
        )}
      </div>

    </div>
  );
}
