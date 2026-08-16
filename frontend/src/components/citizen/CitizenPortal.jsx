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
  Smartphone
} from 'lucide-react';
import { api } from '../../services/api';

export default function CitizenPortal({ onReportAdded = () => {} }) {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    userName: 'Priya Verma',
    userPhone: '+91 98765 12340',
    sector: 'Market Sector 4',
    locationDesc: 'Near Central Vegetable Market gate 2',
    wasteType: 'Overflowing Plastic & Commercial Packaging',
    severity: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80'
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadReports = async () => {
    const list = await api.getReports();
    if (Array.isArray(list)) setReports(list);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const created = await api.submitReport(formData);
      setSuccessMsg(`Grievance Ticket #${created.id} submitted! AI classified severity as ${created.severity}.`);
      loadReports();
      onReportAdded();
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                MODULE 8 • CROWDSOURCED GRIEVANCE
              </span>
              <span className="text-xs font-mono text-slate-400">Public Geotagged Reporting</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              Citizen Grievance & <span className="gradient-text-cyan">Waste Intelligence Portal</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Enables residents to upload roadside waste photos with instant GPS verification and computer vision classification into municipal dispatch queues.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-300 p-3 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
            Active Grievance Queue: <span className="text-cyan-400 font-bold">{reports.length} Open Tickets</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Grievance Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel-luxury rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl">
          <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2 mb-5">
            <Camera className="w-5 h-5 text-cyan-400" />
            <span>Submit Citizen Report</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-mono">Citizen Contact</label>
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="p-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  className="p-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                  placeholder="Phone"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Municipal Sector</label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full p-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
              >
                <option>Market Sector 4</option>
                <option>Old City Sector 2</option>
                <option>Commercial Sector 9</option>
                <option>IT Hub Sector 18</option>
                <option>Knowledge Park</option>
                <option>Residential Zone 12</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Location Landmark</label>
              <input
                type="text"
                value={formData.locationDesc}
                onChange={(e) => setFormData({ ...formData, locationDesc: e.target.value })}
                className="w-full p-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="Street address or nearby landmark"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Observed Garbage Type</label>
              <input
                type="text"
                value={formData.wasteType}
                onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                className="w-full p-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="e.g. Overflowing plastic packaging & wet waste"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Severity Tag</label>
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

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow-glow-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-dark-950 font-heading font-black text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Verifying with AI Vision...' : 'Submit Grievance to Dispatch'}</span>
            </button>
          </form>
        </div>

        {/* Right: Live Grievances Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
            Live Crowdsourced Grievance Stream:
          </span>

          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="glass-panel-luxury rounded-3xl p-5 border border-white/10 shadow-xl flex gap-4 items-start"
              >
                <img
                  src={report.imageUrl}
                  alt="Report issue"
                  className="w-24 h-24 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-300">{report.id}</span>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        report.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-glow-red' :
                        'bg-orange-500/20 text-orange-400 border-orange-500/50'
                      }`}>
                        {report.severity}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg ${
                      report.status === 'ASSIGNED' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
                      'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <h4 className="text-base font-heading font-bold text-white mt-1.5">{report.wasteType}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{report.sector} • {report.locationDesc}</span>
                  </p>

                  {report.aiVerification && (
                    <div className="mt-3 text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI Verification: {report.aiVerification.detectedType} ({(report.aiVerification.confidence * 100).toFixed(0)}% conf)</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
