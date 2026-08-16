import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Navigation, 
  Clock, 
  Battery, 
  Sparkles, 
  Check, 
  ChevronRight, 
  User, 
  Radio, 
  Flame,
  Award,
  History,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export default function WorkerPortal() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [fillAfter, setFillAfter] = useState(10);
  const [workerNotes, setWorkerNotes] = useState('');
  const [completing, setCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'route', 'history'
  const [actionSuccess, setActionSuccess] = useState('');

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching worker tasks:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStartTask = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IN_PROGRESS' })
      });
      if (res.ok) {
        setActionSuccess(`Task #${task.id} started. Vehicle navigating to ${task.sector}.`);
        loadTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteTask = async (e) => {
    e.preventDefault();
    if (!activeTask) return;

    setCompleting(true);
    try {
      const res = await fetch(`/api/tasks/${activeTask.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          fillAfter: Number(fillAfter),
          notes: workerNotes || 'Cleaned and disinfected by field operator.'
        })
      });

      if (res.ok) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        setActionSuccess(`✅ Task #${activeTask.id} completed! Bin emptied from ${activeTask.fillBeforeCollection}% to ${fillAfter}%.`);
        setActiveTask(null);
        setWorkerNotes('');
        loadTasks();
      }
    } catch (err) {
      console.error('Error completing task:', err);
    } finally {
      setCompleting(false);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* 1. Worker Profile & Shift Header */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 p-1 flex-shrink-0 shadow-glow-cyan">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"}
                alt="Worker"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  FIELD OPERATIONS CREW
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>ON DUTY</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                {user?.name || 'Sunil Kumar'}
              </h1>
              <p className="text-xs text-slate-300 font-mono">
                Assigned Vehicle: <strong className="text-cyan-300">DL-01-EA-4092</strong> • Central & West Delhi Zone
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] text-center min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Pending</span>
              <span className="text-2xl font-heading font-black text-orange-400">{pendingTasks.length}</span>
              <span className="text-[10px] text-slate-500 font-mono">Collection Stops</span>
            </div>

            <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] text-center min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Completed</span>
              <span className="text-2xl font-heading font-black text-emerald-400">{completedTasks.length + 7}</span>
              <span className="text-[10px] text-slate-500 font-mono">Bins Emptied</span>
            </div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2.5 shadow-glow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 2. Sub Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-dark-900/90 border border-white/[0.08] max-w-md">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
            activeTab === 'tasks' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Assigned Tasks ({pendingTasks.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
            activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          Collection History
        </button>
      </div>

      {/* 3. Task List & Field Completion Grid */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Task Cards List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
              Today's Field Collection Stops:
            </span>

            {pendingTasks.map((task) => {
              const isCritical = task.priority === 'CRITICAL';
              const isInProgress = task.status === 'IN_PROGRESS';

              return (
                <div
                  key={task.id}
                  className={`rounded-3xl p-6 border transition-all duration-300 shadow-xl ${
                    isInProgress ? 'border-cyan-500/60 bg-dark-900 shadow-glow-cyan' :
                    isCritical ? 'glass-panel-critical-luxury' :
                    'glass-panel-luxury border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-cyan-300">{task.id}</span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          isCritical ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-glow-red' :
                          'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        }`}>
                          {task.priority} PRIORITY
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isInProgress ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse' :
                          'bg-dark-950 text-slate-400 border border-white/10'
                        }`}>
                          {task.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-heading font-bold text-white mt-1.5">
                        {task.binCode} — {task.binName}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{task.sector}</span>
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xl font-heading font-black text-white">{task.fillBeforeCollection}%</span>
                      <span className="text-[10px] text-slate-400 block">Fill Level</span>
                    </div>
                  </div>

                  {/* Notes & Payload */}
                  <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-white/[0.06] text-xs text-slate-300 my-4 space-y-1">
                    <p><strong>Waste Type:</strong> {task.wasteType} (~{task.estimatedWeightKg} kg payload)</p>
                    <p className="text-slate-400">{task.notes}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs font-mono">
                    <span className="text-slate-400">
                      Distance: <strong className="text-white">{task.distanceKm} km</strong> • ETA: {task.etaMinutes}m
                    </span>

                    <div className="flex items-center gap-2">
                      {task.status !== 'IN_PROGRESS' ? (
                        <button
                          onClick={() => handleStartTask(task)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-cyan-300 border border-cyan-500/40 text-xs font-heading font-bold transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Start Route</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => setActiveTask(task)}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-dark-950 font-heading font-black text-xs shadow-glow-sm transition-all transform hover:scale-[1.02]"
                      >
                        <Check className="w-4 h-4" />
                        <span>Log Collection</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Right: Task Completion Action Modal / Terminal (5 cols) */}
          <div className="lg:col-span-5">
            {activeTask ? (
              <div className="glass-panel-luxury rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 sticky top-28 animate-in fade-in slide-in-from-right-3 duration-200">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Field Execution Form
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">{activeTask.id}</span>
                  </div>
                  <h3 className="text-xl font-heading font-black text-white mt-1">
                    Complete Collection
                  </h3>
                  <p className="text-xs text-slate-300">{activeTask.binCode} — {activeTask.sector}</p>
                </div>

                <form onSubmit={handleCompleteTask} className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
                    <span className="text-slate-400 text-[10px] font-mono block">BEFORE COLLECTION FILL:</span>
                    <span className="text-2xl font-heading font-black text-orange-400">{activeTask.fillBeforeCollection}%</span>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-mono">
                      AFTER COLLECTION FILL LEVEL (%)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={fillAfter}
                        onChange={(e) => setFillAfter(e.target.value)}
                        className="w-full accent-emerald-400"
                      />
                      <span className="text-lg font-mono font-black text-emerald-400 w-12 text-right">
                        {fillAfter}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Normally 5%–12% post compaction</span>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-mono">Field Inspection Notes</label>
                    <textarea
                      value={workerNotes}
                      onChange={(e) => setWorkerNotes(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-dark-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                      placeholder="e.g. Cleared 440 kg waste. Sensor optics wiped clean. No mechanical faults."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTask(null)}
                      className="py-3 px-4 rounded-2xl bg-dark-850 text-slate-400 hover:text-white border border-white/10 font-mono text-xs"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={completing}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-dark-950 font-heading font-black text-xs shadow-glow-sm transition-all"
                    >
                      {completing ? 'Saving State...' : 'Submit & Clear Bin ✓'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="glass-panel-luxury rounded-3xl p-10 border border-white/10 text-center flex flex-col items-center justify-center text-slate-500 shadow-2xl h-80">
                <Truck className="w-12 h-12 mb-3 text-slate-600 animate-float" />
                <h4 className="text-base font-heading font-bold text-slate-300">Ready for Field Task</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 font-mono">
                  Select "Log Collection" on any pending task to verify clearance and update the database.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. Collection History View */}
      {activeTab === 'history' && (
        <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="text-xl font-heading font-bold text-white">Completed Collection Ledger</h3>
              <p className="text-xs text-slate-400 font-mono">Historical record of emptied bins and tonnage</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              100% Shift Compliance
            </span>
          </div>

          <div className="space-y-3">
            {[
              { code: 'BIN #DL-112', sector: 'Saket District Centre', time: '09:15 AM', before: 88, after: 8, load: 380 },
              { code: 'BIN #DL-120', sector: 'Dwarka Sector 10', time: '08:30 AM', before: 91, after: 10, load: 410 },
              { code: 'BIN #DL-125', sector: 'Rohini Sector 7', time: '07:45 AM', before: 86, after: 6, load: 360 }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">{item.code}</h4>
                    <span className="text-slate-400 text-[11px]">{item.sector}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-bold">{item.before}% → {item.after}%</span>
                  <span className="text-slate-500 text-[10px] block">{item.time} • {item.load} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
