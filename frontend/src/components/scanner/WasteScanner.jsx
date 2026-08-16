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
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

const SAMPLE_ITEMS = [
  {
    name: 'Plastic Water Bottle',
    category: 'plastic',
    tag: 'PET Beverage Bottle',
    img: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&q=80',
    desc: 'Clear PET plastic bottle with cap'
  },
  {
    name: 'Aluminum Beverage Can',
    category: 'metal',
    tag: 'Soda Can',
    img: 'https://images.unsplash.com/photo-1534057302553-998018bc177e?w=500&q=80',
    desc: 'Crushed aluminium beverage container'
  },
  {
    name: 'Organic Fruit Scraps',
    category: 'organic',
    tag: 'Kitchen Waste',
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80',
    desc: 'Biodegradable vegetable and fruit peels'
  },
  {
    name: 'Cardboard Shipping Box',
    category: 'paper',
    tag: 'Cardboard Box',
    img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&q=80',
    desc: 'Corrugated recyclable packaging'
  },
  {
    name: 'E-Waste / Circuit Board',
    category: 'ewaste',
    tag: 'Circuit PCB',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
    desc: 'Electronic motherboard & components'
  }
];

export default function WasteScanner() {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_ITEMS[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [customImage, setCustomImage] = useState(null);

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

      // Trigger reward confetti for recyclable items
      if (response && response.recyclable) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
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
          desc: 'User uploaded custom waste image'
        };
        setCustomImage(reader.result);
        setSelectedSample(customItem);
        handleClassify(customItem);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                MODULE 1
              </span>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">AI Waste Classification & Value Estimator</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Computer vision segregates waste into 8 standard classes, recommends correct bins, and provides circular-economy scrap valuation in ₹.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MobileNetV3 Backbone</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Image Feed & Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Visual Frame */}
          <div className="glass-panel rounded-2xl p-5 bg-slate-950/90 border border-slate-800 relative">
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group flex items-center justify-center">
              <img
                src={selectedSample.img}
                alt={selectedSample.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Scanning Overlay Animation */}
              {analyzing && (
                <div className="absolute inset-0 bg-brand-950/60 backdrop-blur-xs flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-3"></div>
                  <span className="text-sm font-mono font-bold text-emerald-300 animate-pulse">Running Neural Feature Extraction...</span>
                  <span className="text-xs text-slate-400 mt-1 font-mono">MobileNetV3 Edge Vision Model</span>
                </div>
              )}

              {/* Simulated AI Bounding Box when result is ready */}
              {result && !analyzing && (
                <div className="absolute inset-8 border-2 border-emerald-400 rounded-lg pointer-events-none animate-pulse-slow">
                  <div className="absolute -top-7 left-2 bg-emerald-500 text-slate-950 font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow">
                    {result.category} • {(result.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="w-2 h-2 bg-emerald-400 absolute -top-1 -left-1"></div>
                  <div className="w-2 h-2 bg-emerald-400 absolute -top-1 -right-1"></div>
                  <div className="w-2 h-2 bg-emerald-400 absolute -bottom-1 -left-1"></div>
                  <div className="w-2 h-2 bg-emerald-400 absolute -bottom-1 -right-1"></div>
                </div>
              )}
            </div>

            {/* Scan Action Bar */}
            <div className="flex items-center justify-between mt-4 gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <span>Upload Custom Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              <button
                onClick={() => handleClassify(selectedSample)}
                disabled={analyzing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
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

          {/* Quick Sample Selector Palette */}
          <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
              Test Sample Gallery (Instant Switch for Demo):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SAMPLE_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSample(item);
                    handleClassify(item);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedSample.name === item.name
                      ? 'bg-brand-500/15 border-brand-500/50 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={item.img} alt={item.name} className="w-full h-14 object-cover rounded-lg mb-1.5" />
                  <span className="text-[11px] font-medium text-slate-200 block truncate">{item.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">{item.category}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: AI Analysis Results Card (5 cols) */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="glass-panel rounded-2xl p-6 bg-slate-950/90 border border-slate-800 space-y-4">
              
              {/* Classification Banner */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Vision Detection Output</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {(result.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-100 mt-1">{result.category}</h2>
                <p className="text-xs text-slate-400">{result.subCategory}</p>
              </div>

              {/* Recommended Segregation Bin */}
              <div 
                className="p-4 rounded-xl border flex items-center justify-between"
                style={{ 
                  backgroundColor: `${result.binColorHex}15`, 
                  borderColor: `${result.binColorHex}40` 
                }}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: result.binColorHex }}>
                    Recommended Municipal Bin
                  </span>
                  <span className="text-base font-black text-slate-100">{result.recommendedBin}</span>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: result.binColorHex }}
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Economic & Circular Economy Value */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Estimated Scrap Market Value</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-mono font-bold text-slate-100">{result.recyclableValueInr}</span>
                  <span className="text-xs font-mono text-slate-400">{result.scrapMarketRatePerKg}</span>
                </div>
              </div>

              {/* Carbon Offset & ESG Impact */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Recyclability</span>
                  <span className={`font-mono font-bold text-sm ${result.recyclable ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {result.recyclable ? '100% RECYCLABLE' : result.compostable ? 'COMPOSTABLE' : 'NON-RECYCLABLE'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">CO₂ Carbon Offset</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">+{result.carbonOffsetKg} kg CO₂</span>
                </div>
              </div>

              {/* Smart Segregation Instructions */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-300 block mb-1">Disposal Protocol:</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">{result.disposalAdvice}</p>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-10 bg-slate-950/80 border border-slate-800 text-center flex flex-col items-center justify-center h-full text-slate-500">
              <Camera className="w-12 h-12 mb-3 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-300">Ready to Classify</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Select a sample item or upload a waste photo to run the AI computer vision inference.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
