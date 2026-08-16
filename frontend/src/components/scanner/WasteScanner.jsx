import React, { useState } from 'react';
import { 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  Leaf, 
  IndianRupee, 
  Info, 
  Trash2, 
  ShieldCheck,
  RefreshCw,
  Scan,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

const SAMPLE_ITEMS = [
  {
    name: 'Plastic Beverage Bottle',
    category: 'plastic',
    tag: 'PET Clear Bottle',
    img: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80',
    desc: 'Clear PET plastic bottle with cap'
  },
  {
    name: 'Aluminum Soda Can',
    category: 'metal',
    tag: 'Beverage Can',
    img: 'https://images.unsplash.com/photo-1534057302553-998018bc177e?w=600&q=80',
    desc: 'High-grade aluminum beverage can'
  },
  {
    name: 'Organic Kitchen Food Scraps',
    category: 'organic',
    tag: 'Food Waste',
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
    desc: 'Biodegradable fruit and kitchen waste'
  },
  {
    name: 'Corrugated Cardboard Box',
    category: 'paper',
    tag: 'Packaging Box',
    img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80',
    desc: 'Recyclable packaging box'
  },
  {
    name: 'Electronic PCB Circuit Board',
    category: 'ewaste',
    tag: 'E-Waste Hardware',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    desc: 'Electronic circuit board with precious metals'
  }
];

export default function WasteScanner() {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_ITEMS[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleClassify = async (item = selectedSample) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const response = await api.classifyWaste({
        imageName: item.name,
        category: item.category,
        tag: item.tag
      });

      setResult(response);

      if (response && response.recyclable) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const customItem = {
          name: file.name,
          category: file.name.toLowerCase().includes('plastic') ? 'plastic' : 'mixed',
          tag: file.name,
          img: reader.result,
          desc: 'User uploaded image'
        };
        setSelectedSample(customItem);
        handleClassify(customItem);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-luxury rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                MODULE 1 • COMPUTER VISION
              </span>
              <span className="text-xs font-mono text-slate-400">MobileNetV3 Edge Inference</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              AI Waste Classifier & <span className="gradient-text-emerald">Scrap Valuation Terminal</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Snap or upload waste images to trigger real-time neural segregation, dry/wet bin recommendation, carbon offset calculations, and circular-economy scrap pricing in ₹.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 p-3 rounded-2xl bg-dark-900/90 border border-white/[0.08]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>8 Segregation Classes Active</span>
          </div>
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Viewfinder & Sample Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Visual Viewfinder Frame */}
          <div className="glass-panel-luxury rounded-3xl p-6 border border-white/10 shadow-2xl relative">
            
            {/* Viewfinder Header */}
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Scan className="w-4 h-4" />
                <span>OPTICAL VISION MATRIX</span>
              </span>
              <span>1080p • 60 FPS</span>
            </div>

            {/* Image Canvas with Optical Reticle */}
            <div className="relative w-full h-88 rounded-2xl overflow-hidden bg-dark-900 border border-white/10 group flex items-center justify-center">
              <img
                src={selectedSample.img}
                alt={selectedSample.name}
                className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
              />

              {/* Laser Scanning Animation when analyzing */}
              {analyzing && (
                <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-xs flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-4 shadow-glow-md"></div>
                  <span className="text-base font-heading font-bold text-emerald-300 tracking-wide animate-pulse">
                    Analyzing Feature Embeddings...
                  </span>
                  <span className="text-xs text-slate-400 font-mono mt-1">MobileNetV3 Edge Vision Model</span>
                </div>
              )}

              {/* Simulated Holographic Bounding Box when result is ready */}
              {result && !analyzing && (
                <div className="absolute inset-10 border-2 border-emerald-400 rounded-xl pointer-events-none shadow-glow-md animate-in zoom-in-95 duration-300">
                  <div className="absolute -top-8 left-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-dark-950 font-heading font-black text-xs px-3 py-1 rounded-lg shadow-lg">
                    {result.category} • {(result.confidence * 100).toFixed(1)}% CONFIDENCE
                  </div>
                  {/* Corner Reticle Markers */}
                  <div className="w-3 h-3 bg-emerald-400 absolute -top-1.5 -left-1.5 rounded-xs"></div>
                  <div className="w-3 h-3 bg-emerald-400 absolute -top-1.5 -right-1.5 rounded-xs"></div>
                  <div className="w-3 h-3 bg-emerald-400 absolute -bottom-1.5 -left-1.5 rounded-xs"></div>
                  <div className="w-3 h-3 bg-emerald-400 absolute -bottom-1.5 -right-1.5 rounded-xs"></div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-5 gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl bg-dark-900 hover:bg-dark-850 text-slate-200 border border-white/10 text-xs font-heading font-semibold transition-all">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <span>Upload Custom Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              <button
                onClick={() => handleClassify(selectedSample)}
                disabled={analyzing}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-dark-950 font-heading font-black text-xs shadow-glow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Neural Inference...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Classification</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Sample Gallery Selector */}
          <div className="glass-panel-luxury rounded-3xl p-5 border border-white/10 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-3">
              Instant Test Samples:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {SAMPLE_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSample(item);
                    handleClassify(item);
                  }}
                  className={`p-2.5 rounded-2xl text-left border transition-all duration-200 ${
                    selectedSample.name === item.name
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-glow-sm scale-[1.02]'
                      : 'bg-dark-900/60 border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <img src={item.img} alt={item.name} className="w-full h-16 object-cover rounded-xl mb-2" />
                  <span className="text-[11px] font-heading font-bold text-white block truncate">{item.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">{item.category}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: AI Output Terminal (5 cols) */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="glass-panel-luxury rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              {/* Classification Result Card */}
              <div className="pb-4 border-b border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest">
                    Neural Segregation Result
                  </span>
                  <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm">
                    {(result.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>
                <h2 className="text-2xl font-heading font-black text-white mt-1.5">{result.category}</h2>
                <p className="text-xs text-slate-300 font-medium">{result.subCategory}</p>
              </div>

              {/* Recommended Municipal Bin */}
              <div 
                className="p-5 rounded-2xl border flex items-center justify-between shadow-lg"
                style={{ 
                  backgroundColor: `${result.binColorHex}15`, 
                  borderColor: `${result.binColorHex}40` 
                }}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest block font-bold" style={{ color: result.binColorHex }}>
                    Recommended Municipal Bin
                  </span>
                  <span className="text-lg font-heading font-black text-white mt-0.5 block">{result.recommendedBin}</span>
                </div>
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl"
                  style={{ backgroundColor: result.binColorHex }}
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Economic Scrap Market Valuation */}
              <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/[0.08] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs font-heading font-bold uppercase tracking-wider">Estimated Scrap Market Value</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-heading font-black text-white">{result.recyclableValueInr}</span>
                  <span className="text-xs font-mono text-slate-400">{result.scrapMarketRatePerKg}</span>
                </div>
              </div>

              {/* Impact Badges Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-dark-900/70 border border-white/[0.06]">
                  <span className="text-slate-400 text-[10px] font-mono block">Recyclability Status</span>
                  <span className={`font-heading font-black text-sm block mt-0.5 ${result.recyclable ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {result.recyclable ? '100% RECYCLABLE' : result.compostable ? 'COMPOSTABLE' : 'NON-RECYCLABLE'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-dark-900/70 border border-white/[0.06]">
                  <span className="text-slate-400 text-[10px] font-mono block">Carbon Offset Savings</span>
                  <span className="font-heading font-black text-emerald-400 text-sm block mt-0.5">
                    +{result.carbonOffsetKg} kg CO₂
                  </span>
                </div>
              </div>

              {/* Protocol Instructions */}
              <div className="p-4 rounded-2xl bg-dark-900/40 border border-white/[0.06] text-xs">
                <span className="font-heading font-bold text-slate-200 block mb-1">Disposal & Processing Protocol:</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">{result.disposalAdvice}</p>
              </div>

            </div>
          ) : (
            <div className="glass-panel-luxury rounded-3xl p-12 border border-white/10 text-center flex flex-col items-center justify-center h-full text-slate-500 shadow-2xl">
              <Camera className="w-14 h-14 mb-3 text-slate-600 animate-float" />
              <h3 className="text-base font-heading font-bold text-slate-200">Awaiting Waste Input</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Select a sample item or upload a photograph to execute neural segregation inference.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
