import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Users, 
  Trash2, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthScreen() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@nirmaan.delhi.gov.in');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Role Configurations
  const roles = [
    {
      id: 'ADMIN',
      title: 'MUNICIPAL ADMIN',
      subtitle: 'City Command HQ',
      icon: Building2,
      desc: 'City-wide monitoring, telematics, predictive hotspots, worker dispatch, and ESG ledger.',
      demoEmail: 'admin@nirmaan.delhi.gov.in',
      demoPass: 'admin123',
      color: 'emerald',
      badge: 'GOVERNMENT / MCD'
    },
    {
      id: 'WORKER',
      title: 'FIELD WORKER',
      subtitle: 'Collection Fleet Operations',
      icon: Truck,
      desc: 'Assigned collection tasks, turn-by-turn routing, nearby critical bins, and live task completion.',
      demoEmail: 'worker@nirmaan.delhi.gov.in',
      demoPass: 'worker123',
      color: 'cyan',
      badge: 'FLEET CREW'
    },
    {
      id: 'CITIZEN',
      title: 'DELHI CITIZEN',
      subtitle: 'Public Grievance Portal',
      icon: Users,
      desc: 'Report roadside garbage with camera + GPS, track grievance status, and circular scrap valuation in ₹.',
      demoEmail: 'citizen@delhi.in',
      demoPass: 'citizen123',
      color: 'amber',
      badge: 'COMMUNITY'
    }
  ];

  const handleRoleSelect = (roleObj) => {
    setSelectedRole(roleObj.id);
    setEmail(roleObj.demoEmail);
    setPassword(roleObj.demoPass);
    setError('');
  };

  const handleFastDemoLogin = (roleId) => {
    const target = roles.find(r => r.id === roleId);
    if (target) {
      setSelectedRole(target.id);
      setEmail(target.demoEmail);
      setPassword(target.demoPass);
      executeLogin(target.demoEmail, target.demoPass);
    }
  };

  const executeLogin = async (loginEmail, loginPass) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: selectedRole, phone })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        login(data.user, data.token);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      executeLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest shadow-glow-sm mb-4">
          <Trash2 className="w-4 h-4 text-emerald-400" />
          <span>Government of NCT Delhi • Municipal OS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
          NIRMAAN
        </h1>
        <p className="text-base sm:text-lg text-slate-300 mt-2 font-medium max-w-xl mx-auto">
          AI-Powered Municipal Waste Intelligence & Smart Fleet Operations Platform
        </p>
      </div>

      {/* Main 3 Role Selection Cards */}
      <div className="max-w-5xl mx-auto w-full my-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => handleRoleSelect(r)}
                className={`rounded-3xl p-6 cursor-pointer transition-all duration-300 border flex flex-col justify-between relative shadow-xl ${
                  isSelected
                    ? r.id === 'ADMIN' ? 'border-emerald-500/60 bg-dark-900 shadow-glow-md scale-[1.02]' :
                      r.id === 'WORKER' ? 'border-cyan-500/60 bg-dark-900 shadow-glow-cyan scale-[1.02]' :
                      'border-amber-500/60 bg-dark-900 shadow-glow-amber scale-[1.02]'
                    : 'glass-panel-luxury border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md ${
                      r.id === 'ADMIN' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
                      r.id === 'WORKER' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' :
                      'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-dark-950 border border-white/10 text-slate-400">
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-black text-white">{r.title}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{r.subtitle}</p>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">{r.desc}</p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFastDemoLogin(r.id);
                    }}
                    className={`text-xs font-heading font-bold flex items-center gap-1.5 hover:underline ${
                      r.id === 'ADMIN' ? 'text-emerald-400' :
                      r.id === 'WORKER' ? 'text-cyan-400' :
                      'text-amber-400'
                    }`}
                  >
                    <span>Fast 1-Click Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-emerald-400 shadow-glow-sm' : 'bg-dark-800 border border-white/10'}`}></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credentials Form Box */}
        <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl max-w-md mx-auto mt-8">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Authentication Portal</span>
              <h4 className="text-lg font-heading font-bold text-white">
                {isRegister ? 'Create Resident Account' : `Login as ${selectedRole}`}
              </h4>
            </div>

            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline"
            >
              {isRegister ? 'Already have account?' : 'Register new'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <div>
                <label className="text-slate-400 block mb-1 font-mono">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="e.g. Ramesh Chandra"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="name@nirmaan.delhi.gov.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-dark-950 font-heading font-black text-xs shadow-glow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Register Account' : `Enter as ${selectedRole}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-[11px] font-mono text-slate-500 relative z-10">
        NIRMAAN AI Waste OS • NCT of Delhi Municipal Corporation • Secure JWT Session
      </div>

    </div>
  );
}
