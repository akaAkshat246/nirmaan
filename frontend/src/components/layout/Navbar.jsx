import React from 'react';
import { 
  Building2, 
  Trash2, 
  MapPin, 
  Truck, 
  Flame, 
  BarChart3, 
  Camera, 
  Users, 
  Play, 
  LogOut, 
  Radio, 
  Sparkles,
  RefreshCw,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onStartKillerDemo = () => {}, 
  criticalCount = 0 
}) {
  const { user, logout, switchRole } = useAuth();
  const role = user?.role || 'ADMIN';

  // Navigation Items per Role
  const adminNavItems = [
    { id: 'dashboard', label: 'Command Center', icon: Building2 },
    { id: 'bins', label: 'Smart Bins', icon: Trash2 },
    { id: 'routing', label: 'DSA Route Optimizer', icon: Truck },
    { id: 'scanner', label: 'AI Waste Vision', icon: Camera },
    { id: 'hotspots', label: 'Hotspot Warning', icon: Flame },
    { id: 'analytics', label: 'Analytics & ESG', icon: BarChart3 }
  ];

  const workerNavItems = [
    { id: 'worker-home', label: 'Field Operations', icon: Truck },
    { id: 'bins', label: 'Smart Bins Grid', icon: Trash2 },
    { id: 'routing', label: 'Assigned Route', icon: MapPin },
    { id: 'scanner', label: 'AI Waste Scanner', icon: Camera }
  ];

  const citizenNavItems = [
    { id: 'citizen-home', label: 'Citizen Home', icon: Users },
    { id: 'scanner', label: 'AI Scrap Valuator', icon: Camera }
  ];

  const navItems = role === 'ADMIN' ? adminNavItems :
                   role === 'WORKER' ? workerNavItems :
                   citizenNavItems;

  return (
    <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab(role === 'ADMIN' ? 'dashboard' : role === 'WORKER' ? 'worker-home' : 'citizen-home')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-0.5 shadow-glow-sm flex items-center justify-center">
              <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-heading font-black tracking-tight text-white">
                  NIRMAAN
                </span>
                <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                  role === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-sm' :
                  role === 'WORKER' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan' :
                  'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber'
                }`}>
                  {role}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 block -mt-0.5">
                Delhi Municipal OS
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-dark-900/90 border border-white/[0.08] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all duration-200 ${
                    isActive
                      ? role === 'ADMIN' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-dark-950 shadow-glow-sm scale-[1.02]' :
                        role === 'WORKER' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-dark-950 shadow-glow-cyan scale-[1.02]' :
                        'bg-gradient-to-r from-amber-500 to-orange-500 text-dark-950 shadow-glow-amber scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile, Role Switcher & Story Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* Interactive Story Presentation Mode */}
            <button
              onClick={onStartKillerDemo}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-dark-950 font-heading font-black text-xs shadow-glow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-dark-950" />
              <span>Interactive Story</span>
            </button>

            {/* Role Quick Switch Menu for Testing */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-dark-900 border border-white/[0.08] text-[11px] font-mono">
              <span className="text-slate-500 px-1.5">Switch:</span>
              <button 
                onClick={() => { switchRole('ADMIN'); setActiveTab('dashboard'); }}
                className={`px-2 py-1 rounded-lg ${role === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => { switchRole('WORKER'); setActiveTab('worker-home'); }}
                className={`px-2 py-1 rounded-lg ${role === 'WORKER' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Worker
              </button>
              <button 
                onClick={() => { switchRole('CITIZEN'); setActiveTab('citizen-home'); }}
                className={`px-2 py-1 rounded-lg ${role === 'CITIZEN' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Citizen
              </button>
            </div>

            {/* User Profile Badge & Logout */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-heading font-bold text-white block leading-tight">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {user?.zone || 'Delhi'}
                </span>
              </div>

              <button
                onClick={logout}
                title="Logout Session"
                className="w-9 h-9 rounded-xl bg-dark-900 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/40 flex items-center justify-center transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
