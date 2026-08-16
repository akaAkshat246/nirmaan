import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import DemoControlBar from './components/simulator/DemoControlBar';
import OverviewView from './components/dashboard/OverviewView';
import WasteScanner from './components/scanner/WasteScanner';
import SmartBinFleet from './components/bins/SmartBinFleet';
import RoutePlanner from './components/routing/RoutePlanner';
import HotspotPredictor from './components/hotspots/HotspotPredictor';
import AnalyticsView from './components/analytics/AnalyticsView';
import CitizenPortal from './components/citizen/CitizenPortal';
import KillerDemoModal from './components/demo/KillerDemoModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bins, setBins] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState('');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Load bins and route data
  const refreshData = async () => {
    try {
      const data = await api.getBins();
      if (data && data.bins) {
        setBins(data.bins);
      }
    } catch (err) {
      console.warn('Backend sync warning, using local state.');
    }
  };

  useEffect(() => {
    refreshData();
    // Background polling every 10 seconds to sync IoT sensor simulation
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for Demo Actions
  const handleTriggerSurge = async (binId = 'BIN-104', targetFill = 91) => {
    setIsLoading(true);
    try {
      const res = await api.simulateBinSurge(binId, targetFill);
      if (res && res.bin) {
        setBins(prev => prev.map(b => b.id === binId ? res.bin : b));
        setLastActionMessage(`🔥 Surge Triggered: ${res.bin.bin_code} escalated to ${res.bin.currentFill}% (CRITICAL)`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectBin = async (binId) => {
    setIsLoading(true);
    try {
      const res = await api.collectBin(binId);
      if (res && res.bin) {
        setBins(prev => prev.map(b => b.id === binId ? res.bin : b));
        setLastActionMessage(`🚛 Collected ${res.bin.bin_code}. Reset to ${res.bin.currentFill}%`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvanceTime = async (hours = 2) => {
    setIsLoading(true);
    try {
      await api.advanceTime(hours);
      await refreshData();
      setLastActionMessage(`⏩ Simulation advanced by +${hours} hours.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await api.resetSimulator();
      await refreshData();
      setLastActionMessage('🔄 System reset to baseline initial seed state.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const criticalCount = bins.filter(b => b.status === 'CRITICAL' || b.currentFill >= 90).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Navigation */}
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartKillerDemo={() => setIsDemoModalOpen(true)}
          criticalCount={criticalCount}
        />

        {/* 2. Interactive Demo Controller Bar */}
        <DemoControlBar
          onTriggerSurge={handleTriggerSurge}
          onAdvanceTime={handleAdvanceTime}
          onReset={handleReset}
          isLoading={isLoading}
          lastActionMessage={lastActionMessage}
        />

        {/* 3. Main Views Router */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <OverviewView
              bins={bins}
              activeRoute={activeRoute}
              onSelectBin={(bin) => console.log('Selected bin:', bin)}
              onTriggerSurge={handleTriggerSurge}
              onCollectBin={handleCollectBin}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'scanner' && (
            <WasteScanner />
          )}

          {activeTab === 'bins' && (
            <SmartBinFleet
              bins={bins}
              onTriggerSurge={handleTriggerSurge}
              onCollectBin={handleCollectBin}
            />
          )}

          {activeTab === 'routing' && (
            <RoutePlanner
              bins={bins}
              onRouteGenerated={(route) => setActiveRoute(route)}
            />
          )}

          {activeTab === 'hotspots' && (
            <HotspotPredictor />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'citizen' && (
            <CitizenPortal
              onReportAdded={refreshData}
            />
          )}
        </main>
      </div>

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 font-bold">NIRMAAN v1.0.0</span>
            <span>• AI-First Municipal Waste Segregation & Collection System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>FastAPI AI Port: 8000</span>
            <span>Express API Port: 5000</span>
            <span>Vite UI Port: 5173</span>
          </div>
        </div>
      </footer>

      {/* 5. Guided Story Walkthrough Modal */}
      <KillerDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
        }}
        onTriggerSurge={handleTriggerSurge}
      />

    </div>
  );
}
