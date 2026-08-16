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
  ShieldCheck
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
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500&q=80'
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
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                MODULE 8 • CITIZEN ENGAGEMENT
              </span>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Citizen Grievance & Waste Reporting</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Public crowdsourced reporting with instant AI computer-vision validation, severity rating, and geotagging.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Total Open Tickets: <span className="text-cyan-400 font-bold">{reports.length} Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Grievance Submission Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 bg-slate-950/90 border border-slate-800">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-cyan-400" />
            <span>Report Waste Issue</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Citizen Name & Contact</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Your Name"
                  required
                />
                <input
                  type="text"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Phone"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">City Municipal Sector</label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
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
              <label className="text-slate-400 block mb-1">Location Details</label>
              <input
                type="text"
                value={formData.locationDesc}
                onChange={(e) => setFormData({ ...formData, locationDesc: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="Landmark / street description"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Observed Garbage Type</label>
              <input
                type="text"
                value={formData.wasteType}
                onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Overflowing Plastic Bottles / Wet Scraps"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Severity Assessment</label>
              <div className="grid grid-cols-3 gap-2">
                {['CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => setFormData({ ...formData, severity: sev })}
                    className={`py-2 rounded-lg font-mono font-bold text-[11px] border transition-all ${
                      formData.severity === sev
                        ? sev === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border-red-500' :
                          sev === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border-orange-500' :
                          'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting with AI Check...' : 'Submit Municipal Grievance'}</span>
            </button>
          </form>
        </div>

        {/* Right: Active Grievance Tickets Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Live Municipal Grievance Queue:
          </span>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800 flex gap-4 items-start"
              >
                <img
                  src={report.imageUrl}
                  alt="Waste issue"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{report.id}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border ${
                        report.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                        'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      }`}>
                        {report.severity}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      report.status === 'ASSIGNED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mt-1">{report.wasteType}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{report.sector} • {report.locationDesc}</span>
                  </p>

                  {/* AI Verification Badge */}
                  {report.aiVerification && (
                    <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>AI Verified: {report.aiVerification.detectedType} ({(report.aiVerification.confidence * 100).toFixed(0)}% conf)</span>
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
