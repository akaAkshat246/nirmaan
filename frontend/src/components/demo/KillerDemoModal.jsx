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
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'NIRMAAN monitors municipal smart bins across city sectors with ultrasonic fill telemetry, temperature, odour, and solar charging telematics.',
    highlight: 'Notice all bins operating normally on the vector city map.',
    tabTarget: 'dashboard',
    actionText: 'Inspect Live Map'
  },
  {
    step: 2,
    title: 'Scene 2: Sudden Waste Spike (IoT Sensor Pulse)',
    subtitle: 'Triggering Market Area Surge',
    icon: Zap,
    badge: 'SENSOR EVENT',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'During peak market hours, Bin #104 (Commercial Market Square) suddenly surges from 68% up to 91% capacity.',
    highlight: 'Simulate the sensor surge event to test how the system reacts in real time.',
    triggerSurge: true,
    tabTarget: 'dashboard',
    actionText: '🔥 Fire Sensor Surge on Bin #104 (68% → 91%)'
  },
  {
    step: 3,
    title: 'Scene 3: AI Overflow Prediction & Risk Escalation',
    subtitle: 'From Static Level to Time-to-Overflow',
    icon: AlertTriangle,
    badge: 'AI PREDICTION',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'NIRMAAN doesn’t just report “Bin is 91%”. The time-series AI calculates filling rate (8.4%/hr) and forecasts an imminent overflow in ~1.1 to 2.1 hours!',
    highlight: 'Status immediately auto-promotes to 🔴 CRITICAL with audio-visual telemetry alert.',
    tabTarget: 'bins',
    actionText: 'View Bin Telematics'
  },
  {
    step: 4,
    title: 'Scene 4: Dynamic Priority Queue Ranking',
    subtitle: 'Urgency Sorting in DSA Heap',
    icon: CheckCircle2,
    badge: 'DSA PRIORITY',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'The Binary Max-Heap recalculates priority weights: Score = (Fill% × 0.45) + (Risk × 0.30) + (Hours × 0.15) + Critical Boost. Bin #104 jumps to Rank #1 on the collection queue.',
    highlight: 'Automated dispatch task is registered without human dispatcher delay.',
    tabTarget: 'routing',
    actionText: 'Inspect Priority Queue Heap'
  },
  {
    step: 5,
    title: 'Scene 5: Dijkstra Route Optimization Engine',
    subtitle: 'Shortest Path Fleet Routing',
    icon: Truck,
    badge: 'DSA DIJKSTRA',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'The vehicle routing solver traverses the city road network graph from Central Depot → Bin #104 (Critical) → Bin #117 → Bin #109 → Depot.',
    highlight: 'Cuts 29.6% route distance, saving 4.8L diesel and 12.8 kg CO₂ per collection round.',
    tabTarget: 'routing',
    actionText: 'Examine Dijkstra Graph Route'
  },
  {
    step: 6,
    title: 'Scene 6: AI Computer Vision Waste Classifier',
    subtitle: 'Material Segregation & Scrap Pricing',
    icon: Camera,
    badge: 'VISION AI',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'A user/worker photographs a plastic bottle. MobileNetV3 extracts visual features, categorizes as PET Plastic (95.8% conf), recommends Blue Dry Bin, and quotes scrap value ₹2.50–₹4.00.',
    highlight: 'Seamless circular-economy incentives with scrap market integration.',
    tabTarget: 'scanner',
    actionText: 'Test AI Waste Scanner'
  },
  {
    step: 7,
    title: 'Scene 7: Tomorrow’s Hotspot Prediction',
    subtitle: 'Proactive Municipal Deployment',
    icon: Flame,
    badge: 'PROACTIVE AI',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Multivariate AI analyzes weekend footfall, food festivals, and historical trends: 🚨 Market Area has an 87% probability of becoming a garbage hotspot tomorrow with a 32% volume increase.',
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-glow rounded-3xl max-w-2xl w-full bg-slate-950 border border-slate-700/80 shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {DEMO_SCENES.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(idx);
                onNavigateTab(s.tabTarget);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-8 bg-emerald-400'
                  : idx < currentStep
                  ? 'w-3 bg-emerald-600'
                  : 'w-3 bg-slate-800'
              }`}
            />
          ))}
          <span className="text-[11px] font-mono text-slate-400 ml-2">
            Step {currentStep + 1} of {DEMO_SCENES.length}
          </span>
        </div>

        {/* Scene Card */}
        <div className="space-y-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${scene.badgeColor}`}>
                {scene.badge}
              </span>
              <h2 className="text-xl font-extrabold text-slate-100 mt-1">{scene.title}</h2>
              <p className="text-xs text-slate-400 font-medium">{scene.subtitle}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
            <p>{scene.description}</p>
            <p className="text-emerald-300 font-semibold font-mono text-xs flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{scene.highlight}</span>
            </p>
          </div>

          {/* Interactive Trigger Button for this Scene */}
          <button
            onClick={handleAction}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
          >
            <Icon className="w-4 h-4" />
            <span>{scene.actionText}</span>
          </button>

        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 underline font-mono text-[11px]"
          >
            Exit Story Mode
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === DEMO_SCENES.length - 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold disabled:opacity-30 disabled:pointer-events-none shadow-md shadow-brand-500/20 transition-all"
          >
            <span>Next Scene</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
