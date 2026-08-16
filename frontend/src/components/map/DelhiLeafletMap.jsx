import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Compass, 
  MapPin, 
  Trash2, 
  Truck, 
  AlertTriangle, 
  Crosshair, 
  Battery, 
  Sun, 
  Wind, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';

// Custom SVG Icons for Leaflet Markers
const createBinIcon = (status, fillPercent) => {
  const color = status === 'CRITICAL' || fillPercent >= 90 ? '#ef4444' :
                status === 'HIGH' ? '#f97316' :
                status === 'MODERATE' ? '#f59e0b' : '#10b981';

  return L.divIcon({
    className: 'custom-leaflet-bin-marker',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: #080e1a;
        border: 2.5px solid ${color};
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${color};
        font-family: monospace;
        font-weight: 800;
        font-size: 11px;
        box-shadow: 0 0 15px ${color}60, 0 4px 8px rgba(0,0,0,0.5);
        cursor: pointer;
        position: relative;
      ">
        ${fillPercent}%
        ${status === 'CRITICAL' ? '<span style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;border-radius:50%;background:#ef4444;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>' : ''}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
};

const createTruckIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-truck-marker',
    html: `
      <div style="
        width: 42px;
        height: 42px;
        background: #080e1a;
        border: 2.5px solid #00e1ff;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(0,225,255,0.6);
        cursor: pointer;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e1ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 17h4V5H2v12h3m10 0h2l3-3h-5v3M5 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/>
        </svg>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  });
};

const createUserGpsIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-user-gps-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #38bdf8;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(56,189,248,0.8);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Map Recenter Controller Component
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export default function DelhiLeafletMap({ 
  bins = [], 
  reports = [],
  activeRoute = null,
  onSelectBin = () => {},
  onTriggerSurge = () => {},
  onCollectBin = () => {}
}) {
  const [selectedBin, setSelectedBin] = useState(bins[0] || null);
  const [userGps, setUserGps] = useState(null);
  const [gpsError, setGpsError] = useState('');
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi Central coordinates

  useEffect(() => {
    if (bins.length > 0 && !selectedBin) {
      setSelectedBin(bins[0]);
    }
  }, [bins]);

  const handleGetLocation = () => {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('Browser geolocation is not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserGps(coords);
        setMapCenter(coords);
      },
      (err) => {
        setGpsError('GPS permission denied. Displaying Central Delhi default map.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Build route polylines from bins in activeRoute
  const routePoints = [];
  if (activeRoute && activeRoute.stops) {
    routePoints.push([28.6139, 77.2090]); // Central Depot Hub
    activeRoute.stops.forEach(stop => {
      const b = bins.find(item => item.id === stop.binId);
      if (b) routePoints.push([b.latitude, b.longitude]);
    });
    routePoints.push([28.6139, 77.2090]); // Return to Depot
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Real Leaflet Map Container (8 cols) */}
      <div className="lg:col-span-8 glass-panel-luxury rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Map Header & GPS Tool */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-heading font-extrabold text-white tracking-wide">
                NCT of Delhi Municipal GIS Map
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">OpenStreetMap Vector Grid • 100% Georeferenced Coordinates</p>
          </div>

          <div className="flex items-center gap-3">
            {/* GPS Locator Button */}
            <button
              onClick={handleGetLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all shadow-glow-cyan"
              title="Locate my position in Delhi"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{userGps ? 'GPS Located' : 'Locate My GPS'}</span>
            </button>

            {/* Legend Badges */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono p-1.5 rounded-xl bg-dark-900/90 border border-white/[0.08]">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> &lt;50%
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 50–75%
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 75–90%
              </span>
              <span className="flex items-center gap-1 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> &gt;90%
              </span>
            </div>
          </div>
        </div>

        {gpsError && (
          <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
            {gpsError}
          </div>
        )}

        {/* Real Leaflet Map Container */}
        <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-white/10 shadow-inner z-0">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', backgroundColor: '#060a12' }}
          >
            <ChangeMapView coords={mapCenter} />

            {/* Dark Matter Carto TileLayer for high-tech aesthetic */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Smart Bins Markers */}
            {bins.map((bin) => (
              <Marker
                key={bin.id}
                position={[bin.latitude, bin.longitude]}
                icon={createBinIcon(bin.status, bin.currentFill)}
                eventHandlers={{
                  click: () => {
                    setSelectedBin(bin);
                    onSelectBin(bin);
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 text-xs font-sans text-slate-900">
                    <strong className="block font-heading text-sm">{bin.bin_code} — {bin.name}</strong>
                    <span className="text-slate-600 block">{bin.sector} ({bin.locality})</span>
                    <div className="mt-2 flex items-center justify-between font-mono font-bold">
                      <span>Fill: {bin.currentFill}%</span>
                      <span>ETA: ~{bin.overflowEtaHours}h</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Live Collection Truck Marker */}
            <Marker
              position={[28.6480, 77.2050]}
              icon={createTruckIcon()}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <strong>MCD Compactor Truck (DL-01-EA-4092)</strong>
                  <p>Operator: Sunil Kumar • Status: EN_ROUTE</p>
                </div>
              </Popup>
            </Marker>

            {/* User GPS Pin if permission granted */}
            {userGps && (
              <Marker position={userGps} icon={createUserGpsIcon()}>
                <Popup>
                  <div className="p-1 text-xs">
                    <strong>Your Current GPS Location</strong>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Polylines */}
            {routePoints.length > 1 && (
              <Polyline
                positions={routePoints}
                color="#00e1ff"
                weight={4}
                opacity={0.85}
                dashArray="8, 6"
              />
            )}
          </MapContainer>
        </div>

      </div>

      {/* 2. Selected Delhi Smart Bin Inspector (4 cols) */}
      <div className="lg:col-span-4 glass-panel-luxury rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
        {selectedBin ? (
          <div className="space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Delhi Telematics</span>
                <h3 className="text-2xl font-heading font-black text-white mt-0.5">{selectedBin.bin_code}</h3>
                <p className="text-xs text-slate-200 font-medium">{selectedBin.name}</p>
                <span className="text-[11px] text-slate-400 font-mono">{selectedBin.sector}, {selectedBin.locality}</span>
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

            {/* Fill Level Meter */}
            <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Live Ultrasonic Level</span>
                <span className="text-3xl font-heading font-black text-white">{selectedBin.currentFill}%</span>
              </div>

              <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedBin.currentFill >= 90 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    selectedBin.currentFill >= 75 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    'bg-gradient-to-r from-teal-400 to-emerald-400'
                  }`}
                  style={{ width: `${selectedBin.currentFill}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2.5">
                <span>Lat: {selectedBin.latitude}°N</span>
                <span>Cap: {selectedBin.capacityLiters} L</span>
                <span>Lng: {selectedBin.longitude}°E</span>
              </div>
            </div>

            {/* AI Overflow Prediction */}
            <div className={`p-4 rounded-2xl border transition-all ${
              selectedBin.status === 'CRITICAL' ? 'bg-red-950/40 border-red-500/50 text-red-200' :
              selectedBin.status === 'HIGH' ? 'bg-orange-950/30 border-orange-500/40 text-orange-200' :
              'bg-dark-900/90 border-white/[0.08] text-slate-300'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200">
                  AI Overflow Forecast
                </span>
              </div>
              <p className="text-sm font-semibold">
                Estimated Overflow: <span className="font-mono text-emerald-400 font-bold text-base">~{selectedBin.overflowEtaHours} hours</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Velocity: <span className="text-slate-200 font-bold">{selectedBin.fillRatePerHour}% / hr</span> | Last collected: {selectedBin.lastCollectedHoursAgo}h ago
              </p>
            </div>

            {/* IoT Matrix */}
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
                  <span className="text-[10px] text-slate-400 block font-mono">Solar Active</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedBin.solarActive ? 'YES' : 'BAT'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
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
                <span>Empty / Clear</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <MapPin className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>Select any bin on the Delhi map to view telematics.</p>
          </div>
        )}
      </div>

    </div>
  );
}
