import React, { useState } from 'react';
import { 
  Play, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Camera, 
  Flame, 
  Sparkles,
  Zap
} from 'lucide-react';

const DEMO_SCENES = [
  {
    step: 1,
    title: 'Scene 1: Municipal Command Center Overview',
    subtitle: 'Baseline City Operations',
    icon: Sparkles,
    badge: 'BASELINE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-sm',
    description: 'NIRMAAN continuously monitors municipal smart bins across city sectors with ultrasonic fill telemetry, internal temperature, odour, and solar charging metrics.',
    highlight: 'Observe all bins operating normally on the vector city map.',
    tabTarget: 'dashboard',
    actionText: 'Inspect Live Map'
  },
  {
    step: 2,
    title: 'Scene 2: Sudden Waste Surge (IoT Sensor Pulse)',
    subtitle: 'Triggering Market Area Spike',
    icon: Zap,
    badge: 'SENSOR SPIKE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber',
    description: 'During peak market hours, Bin #104 (Commercial Market Square) suddenly surges from 68% up to 91% capacity in real time.',
    highlight: 'Trigger the sensor surge event to observe instant system escalation.',
    triggerSurge: true,
    tabTarget: 'dashboard',
    actionText: '🔥 Fire Sensor Surge on Bin #104 (68% → 91%)'
  },
  {
    step: 3,
    title: 'Scene 3: AI Overflow Forecast & Risk Escalation',
    subtitle: 'From Static Fill to Predictive ETA',
    icon: AlertTriangle,
    badge: 'TIME-SERIES AI',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40 shadow-glow-red',
    description: 'NIRMAAN calculates the fill-velocity rate (8.4%/hr) and forecasts an imminent overflow in ~1.1 to 2.1 hours, auto-promoting the status to 🔴 CRITICAL.',
    highlight: 'Automated telemetry alert with zero human supervisor lag.',
    tabTarget: 'bins',
    actionText: 'Inspect Bin Telematics'
  },
  {
    step: 4,
    title: 'Scene 4: Dynamic Priority Queue Ranking',
    subtitle: 'Urgency Ordering in Binary Max-Heap',
    icon: CheckCircle2,
    badge: 'DSA PRIORITY',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan',
    description: 'The Binary Max-Heap recalculates priority weights: Score = (Fill% × 0.45) + (Risk × 0.30) + (Hours × 0.15) + StatusBoost. Bin #104 jumps to Rank #1 on the dispatch heap.',
    highlight: 'Mathematical priority ranking in O(log N) complexity.',
    tabTarget: 'routing',
    actionText: 'Inspect Priority Queue Heap'
  },
  {
    step: 5,
    title: 'Scene 5: Dijkstra Route Optimization Engine',
    subtitle: 'Shortest Path Fleet Routing',
    icon: Truck,
    badge: 'DSA DIJKSTRA',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan',
    description: 'The vehicle routing solver traverses the city road network graph from Central Depot → Bin #104 (Critical) → Bin #117 → Bin #109 → Depot.',
    highlight: 'Cuts 29.6% route distance, saving 4.8L diesel and 12.8 kg CO₂ per collection round.',
    tabTarget: 'routing',
    actionText: 'Examine Dijkstra Graph Route'
  },
  {
    step: 6,
    title: 'Scene 6: AI Computer Vision Waste Classifier',
    subtitle: 'Material Segregation & Circular Scrap Pricing',
    icon: Camera,
    badge: 'VISION AI',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'MobileNetV3 extracts visual features from waste photos, categorizes PET Plastic (95.8% conf), recommends Blue Dry Bin, and quotes scrap value ₹2.50–₹4.00.',
    highlight: 'Circular economy scrap incentives with green carbon offset.',
    tabTarget: 'scanner',
    actionText: 'Test AI Waste Scanner'
  },
  {
    step: 7,
    title: 'Scene 7: Tomorrow’s Hotspot Prediction',
    subtitle: 'Proactive Municipal Deployment',
    icon: Flame,
    badge: 'PREDICTIVE AI',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-glow-amber',
    description: 'Multivariate AI analyzes weekend footfalls, food festivals, and historical trends: 🚨 Market Area has an 87% probability of becoming a garbage hotspot tomorrow with a 32% volume increase.',
    highlight: 'Municipality proactively schedules a 5-Ton compactor truck before overflow happens.',
    tabTarget: 'hotspots',
    actionText: 'View Hotspot Early Warning'
  }
];

export default function KillerDemoModal({ 
  isOpen, 
  onClose, 
  onNavigateTab, 
  onTriggerSurge 
}) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const scene = DEMO_SCENES[currentStep];
  const Icon = scene.icon;

  const handleNext = () => {
    if (currentStep < DEMO_SCENES.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onNavigateTab(DEMO_SCENES[nextStep].tabTarget);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onNavigateTab(DEMO_SCENES[prevStep].tabTarget);
    }
  };

  const handleAction = () => {
    if (scene.triggerSurge) {
      onTriggerSurge('BIN-104', 91);
    }
    onNavigateTab(scene.tabTarget);
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="relative rounded-3xl max-w-2xl w-full bg-dark-900 border border-white/15 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-dark-850 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Step Bar */}
        <div className="flex items-center gap-2 mb-6">
          {DEMO_SCENES.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(idx);
                onNavigateTab(s.tabTarget);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-10 bg-emerald-400 shadow-glow-sm'
                  : idx < currentStep
                  ? 'w-4 bg-emerald-600'
                  : 'w-3 bg-dark-800'
              }`}
            />
          ))}
          <span className="text-xs font-mono text-slate-400 ml-2">
            Scene {currentStep + 1} / {DEMO_SCENES.length}
          </span>
        </div>

        {/* Scene Details */}
        <div className="space-y-5">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-sm">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <span className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase border ${scene.badgeColor}`}>
                {scene.badge}
              </span>
              <h2 className="text-2xl font-heading font-black text-white mt-1">{scene.title}</h2>
              <p className="text-xs text-slate-400 font-mono">{scene.subtitle}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-950/80 border border-white/[0.08] text-sm text-slate-300 leading-relaxed space-y-3">
            <p>{scene.description}</p>
            <p className="text-emerald-300 font-bold font-mono text-xs flex items-center gap-2 pt-1">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{scene.highlight}</span>
            </p>
          </div>

          {/* Trigger Action Button */}
          <button
            onClick={handleAction}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-dark-950 font-heading font-black text-xs shadow-glow-md transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
          >
            <Icon className="w-4 h-4" />
            <span>{scene.actionText}</span>
          </button>

        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.08] text-xs">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors font-mono"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white underline font-mono text-xs"
          >
            Exit Story Mode
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === DEMO_SCENES.length - 1}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-heading font-bold disabled:opacity-30 disabled:pointer-events-none shadow-glow-sm transition-all"
          >
            <span>Next Scene</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
