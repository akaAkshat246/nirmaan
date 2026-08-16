import React from 'react';
import { 
  Trash2, 
  Cpu, 
  MapPin, 
  Truck, 
  Flame, 
  BarChart3, 
  Users, 
  PlayCircle,
  Activity,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onStartKillerDemo, criticalCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: MapPin },
    { id: 'scanner', label: 'AI Waste Vision', icon: Cpu, badge: 'AI' },
    { id: 'bins', label: 'Smart Bins Fleet', icon: Trash2, alertCount: criticalCount },
    { id: 'routing', label: 'DSA Route Optimizer', icon: Truck, badge: 'DSA' },
    { id: 'hotspots', label: 'Hotspot Forecast', icon: Flame },
    { id: 'analytics', label: 'Analytics & ESG', icon: BarChart3 },
    { id: 'citizen', label: 'Citizen Grievances', icon: Users }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/25 border border-emerald-300/30">
              <Trash2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                  NIRMAAN
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AI Waste Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Municipal Telematics & DSA Dispatch</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.alertCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                      {item.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Button: Killer Demo Flow */}
          <div className="flex items-center gap-3">
            <button
              onClick={onStartKillerDemo}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Interactive Story Demo</span>
            </button>
          </div>

        </div>

        {/* Mobile Nav Scroller */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  isActive ? 'bg-brand-500/20 text-brand-300' : 'text-slate-400'
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
