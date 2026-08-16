import React from 'react';
import { 
  Trash2, 
  Cpu, 
  MapPin, 
  Truck, 
  Flame, 
  BarChart3, 
  Users, 
  Sparkles,
  Radio,
  Layers,
  Play
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onStartKillerDemo, criticalCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: MapPin },
    { id: 'scanner', label: 'AI Waste Vision', icon: Cpu, badge: 'VISION' },
    { id: 'bins', label: 'Smart Bin Fleet', icon: Trash2, alertCount: criticalCount },
    { id: 'routing', label: 'DSA Route Optimizer', icon: Truck, badge: 'DIJKSTRA' },
    { id: 'hotspots', label: 'Hotspot Forecast', icon: Flame },
    { id: 'analytics', label: 'Analytics & ESG', icon: BarChart3 },
    { id: 'citizen', label: 'Citizen Grievance', icon: Users }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-dark-950/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Telemetry Status */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group select-none" 
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Holographic Glowing Icon */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-11 h-11 rounded-2xl bg-dark-900 border border-white/15 flex items-center justify-center shadow-2xl">
                <Trash2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            {/* Typography */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-wider gradient-text-emerald">
                  NIRMAAN
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  AI Waste OS
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-emerald-400 font-bold">12 Bins Active</span>
                </span>
                <span>•</span>
                <span className="text-slate-500 hidden sm:inline">Dijkstra Fleet VRP</span>
              </div>
            </div>
          </div>

          {/* Luxury Segmented Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-dark-900/90 border border-white/[0.08] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="tracking-wide">{item.label}</span>
                  
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}

                  {item.alertCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 shadow-glow-red animate-pulse">
                      {item.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTA: Guided Story Presentation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onStartKillerDemo}
              className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 rounded-xl blur-xs group-hover:blur-sm transition-all duration-300"></span>
              <span className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-900/90 text-white text-xs font-heading font-bold tracking-wide transition-all duration-300 group-hover:bg-dark-900/70">
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Interactive Story Mode</span>
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Scroller */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-white/[0.05]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'text-slate-400 bg-dark-900/60 border border-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
