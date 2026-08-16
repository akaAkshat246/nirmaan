import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Camera, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Crosshair, 
  Compass,
  ArrowRight,
  TrendingUp,
  Coins
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WasteScanner from '../scanner/WasteScanner';
import DelhiLeafletMap from '../map/DelhiLeafletMap';
import confetti from 'canvas-confetti';

export default function CitizenApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'my-reports', 'nearby', 'scanner'
  const [reports, setReports] = useState([]);
  const [bins, setBins] = useState([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');
  
  // Grievance Form State
  const [formData, setFormData] = useState({
    sector: 'Saket District Centre',
    locationDesc: 'Pillar P-14, rear parking area near Select Citywalk',
    wasteType: 'Overflowing Plastic Packaging & Wet Food Waste',
    severity: 'HIGH',
    latitude: 28.5290,
    longitude: 77.2185,
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80'
  });

  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      const [resReports, resBins] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/bins')
      ]);
      const dataReports = await resReports.json();
      const dataBins = await resBins.json();

      if (Array.isArray(dataReports)) setReports(dataReports);
      if (dataBins && dataBins.bins) setBins(dataBins.bins);
    } catch (err) {
      console.error('Error loading citizen data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGetGps = () => {
    setGpsLoading(true);
    setGpsStatus('');

    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by browser. Using Saket default.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4))
        }));
        setGpsStatus(`GPS Verified: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        setGpsLoading(false);
      },
      (err) => {
        setGpsStatus('GPS permission denied. Using selected Delhi landmark.');
        setGpsLoading(false);
      },
      { timeout: 6000 }
    );
  };

  // Run AI analysis on image selection / sample change
  const handleRunAiAnalysis = async () => {
    setAnalyzingAi(true);
    try {
      const res = await fetch('/api/waste/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageName: formData.wasteType,
          category: formData.wasteType,
          tag: formData.wasteType
        })
      });
      const data = await res.json();
      setAiPreview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenId: user?.id || 'USR-CITIZEN-01',
          citizenName: user?.name || 'Ananya Sharma',
          citizenPhone: user?.phone || '+91 98765 43210',
          ...formData
        })
      });

      const data = await res.json();
      if (res.ok) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSuccessMsg(`🎉 Grievance Ticket #${data.id} submitted! +50 Karma Points awarded.`);
        loadData();
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* 1. Citizen Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 p-1 flex-shrink-0 shadow-glow-amber">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"}
                alt="Citizen"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  CITIZEN CLEANLINESS PORTAL
                </span>
                <span className="text-xs text-slate-400 font-mono">Swachh Delhi Community OS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                {user?.name || 'Ananya Sharma'}
              </h1>
              <p className="text-xs text-slate-300 font-mono">
                Locality: <strong className="text-amber-300">Saket (South Delhi)</strong> • Active Reporter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-dark-900/90 border border-amber-500/30 text-center min-w-[120px] shadow-glow-amber">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Coins className="w-4 h-4" />
                <span className="text-xl font-heading font-black">{user?.karmaPoints || 340}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Green Karma Pts</span>
            </div>

            <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] text-center min-w-[120px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Submitted</span>
              <span className="text-xl font-heading font-black text-cyan-300">{reports.length}</span>
              <span className="text-[10px] text-slate-500 font-mono">Grievances</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-dark-900/90 border border-white/[0.08] max-w-xl">
        {[
          { id: 'report', label: 'Report Garbage' },
          { id: 'my-reports', label: `My Reports (${reports.length})` },
          { id: 'nearby', label: 'Nearby Map' },
          { id: 'scanner', label: 'AI Scrap Valuator' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. TAB 1: Report Garbage Grievance Form */}
      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2.5 mb-6">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Log Community Garbage Grievance</span>
            </h3>

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono mb-5 flex items-center gap-2.5 shadow-glow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Sector Selection */}
              <div>
                <label className="text-slate-300 block mb-1 font-mono">Delhi Municipal Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full p-3 bg-dark-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                >
                  <option>Saket District Centre</option>
                  <option>Connaught Place (CP)</option>
                  <option>Karol Bagh Market</option>
                  <option>Lajpat Nagar Part 2</option>
                  <option>Chandni Chowk Heritage</option>
                  <option>Dwarka Sector 10</option>
                  <option>Rohini Sector 7</option>
                  <option>Janakpuri West</option>
                  <option>Hauz Khas Village</option>
                  <option>Vasant Kunj Promenade</option>
                </select>
              </div>

              {/* Landmark description */}
              <div>
                <label className="text-slate-300 block mb-1 font-mono">Location Landmark / Street Details</label>
                <input
                  type="text"
                  value={formData.locationDesc}
                  onChange={(e) => setFormData({ ...formData, locationDesc: e.target.value })}
                  className="w-full p-3 bg-dark-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
                  placeholder="e.g. Near Metro gate 3 / Opposite community bin"
                  required
                />
              </div>

              {/* GPS Location Bar */}
              <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">GPS Geotag Coordinates</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {formData.latitude}°N, {formData.longitude}°E
                  </span>
                  {gpsStatus && <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{gpsStatus}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleGetGps}
                  disabled={gpsLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{gpsLoading ? 'Locating...' : 'Auto-Fill GPS'}</span>
                </button>
              </div>

              {/* Waste Type */}
              <div>
                <label className="text-slate-300 block mb-1 font-mono">Observed Waste Material</label>
                <input
                  type="text"
                  value={formData.wasteType}
                  onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                  className="w-full p-3 bg-dark-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
                  placeholder="e.g. Discarded plastic packaging, bottles, and food residue"
                  required
                />
              </div>

              {/* Severity Buttons */}
              <div>
                <label className="text-slate-300 block mb-1 font-mono">Urgency / Severity</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setFormData({ ...formData, severity: sev })}
                      className={`py-2.5 rounded-xl font-mono font-bold text-[11px] border transition-all ${
                        formData.severity === sev
                          ? sev === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border-red-500 shadow-glow-red' :
                            sev === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border-orange-500' :
                            'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-dark-900 text-slate-400 border-white/[0.06]'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger AI Quality & Classification Preview */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  disabled={analyzingAi}
                  className="w-full py-2.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{analyzingAi ? 'Running Neural Quality & Segmentation...' : 'Pre-Validate with AI Vision'}</span>
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-dark-950 font-heading font-black text-xs shadow-glow-amber transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting to MCD Dispatch...' : 'Dispatch Grievance Ticket'}</span>
              </button>
            </form>
          </div>

          {/* Right: AI Vision Preview Card (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-panel-luxury rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Computer Vision Inspection</span>
                  <h4 className="text-base font-heading font-bold text-white">Neural Verification HUD</h4>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 h-44">
                <img
                  src={formData.imageUrl}
                  alt="Waste Photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-mono text-emerald-300 font-bold bg-dark-900/80 px-2 py-1 rounded-lg border border-emerald-500/30">
                    Geotagged Photo Sample
                  </span>
                </div>
              </div>

              {/* AI Details */}
              {aiPreview ? (
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
                    <span className="text-slate-400 text-[10px] block">Image Quality Score</span>
                    <span className="text-emerald-400 font-bold">
                      {aiPreview.image_quality?.acceptable ? 'PASSED (94% Clarity)' : 'RETAKE SUGGESTED'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
                    <span className="text-slate-400 text-[10px] block">Detected Material Taxonomy</span>
                    <span className="text-white font-bold">{aiPreview.primaryCategory}</span>
                    <p className="text-[11px] text-slate-400 mt-1">{aiPreview.disposalAdvice}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-mono text-center py-4">
                  Click "Pre-Validate with AI Vision" to test image clarity and material segmentation.
                </p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 4. TAB 2: My Reports Tracker with Timeline */}
      {activeTab === 'my-reports' && (
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
            Your Active & Resolved Grievance Tickets:
          </span>

          <div className="space-y-5">
            {reports.map((rep) => {
              const isResolved = rep.status === 'RESOLVED';
              const isInProgress = rep.status === 'IN_PROGRESS';

              return (
                <div
                  key={rep.id}
                  className="glass-panel-luxury rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-mono font-bold text-amber-300">{rep.id}</span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          rep.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-glow-red' :
                          'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        }`}>
                          {rep.severity}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg ${
                          isResolved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          isInProgress ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {rep.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-heading font-bold text-white mt-1.5">{rep.wasteType}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {rep.sector} • {rep.locationDesc}
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono text-slate-400">
                      <span>Assigned Operator: </span>
                      <strong className="text-white">{rep.assignedWorkerName || 'MCD Dispatch Queue'}</strong>
                    </div>
                  </div>

                  {/* Lifecycle Stepper Timeline */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-3">
                      Resolution Progress Tracker:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'].map((step, idx) => {
                        const stepIndex = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].indexOf(rep.status);
                        const thisIndex = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'].indexOf(step);
                        const isDone = stepIndex >= thisIndex;

                        return (
                          <div
                            key={step}
                            className={`p-3 rounded-2xl border transition-all ${
                              isDone
                                ? 'bg-dark-900/90 border-emerald-500/40 text-emerald-300 shadow-glow-sm'
                                : 'bg-dark-950/50 border-white/[0.06] text-slate-600'
                            }`}
                          >
                            <span className="text-[10px] block opacity-70">STEP 0{idx + 1}</span>
                            <span className="font-bold text-xs block">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB 3: Nearby Cleanliness Map */}
      {activeTab === 'nearby' && (
        <DelhiLeafletMap
          bins={bins}
          reports={reports}
          onSelectBin={() => {}}
        />
      )}

      {/* 6. TAB 4: AI Scrap Valuator */}
      {activeTab === 'scanner' && (
        <WasteScanner />
      )}

    </div>
  );
}
