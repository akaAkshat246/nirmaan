import { store } from '../models/store.js';

/**
 * IoT Sensor Generator & Realtime Simulation Controller
 */
export class SensorSimulator {
  constructor() {
    this.timer = null;
    this.isRunning = false;
  }

  startAutoSimulation(intervalMs = 15000) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => {
      this.tick();
    }, intervalMs);
    store.logAudit('SIMULATOR_START', `IoT background sensor pulse started (${intervalMs / 1000}s interval)`);
  }

  stopAutoSimulation() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    store.logAudit('SIMULATOR_STOP', 'IoT sensor simulation paused');
  }

  tick() {
    const bins = store.getBins();
    bins.forEach(bin => {
      // Normal bins slowly increment fill based on fillRatePerHour
      if (bin.currentFill < 98) {
        const delta = Number(((bin.fillRatePerHour / 60) * (Math.random() * 0.8 + 0.6)).toFixed(2));
        const newFill = Math.min(100, Math.round(bin.currentFill + delta));
        
        // Recalculate ETA and status
        this._updateBinCalculations(bin, newFill);
      }
    });
  }

  /**
   * THE HACKATHON DEMO SURGE TRIGGER:
   * Instantly surges BIN #104 from 68% -> 91% (CRITICAL), triggering immediate alerts & priority routing
   */
  triggerSurge(binId = 'BIN-104', targetFill = 91) {
    const bin = store.getBinById(binId);
    if (!bin) return null;

    const previousFill = bin.currentFill;
    const history = [...(bin.history || [])];
    history.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fill: targetFill
    });

    const updated = this._updateBinCalculations(bin, targetFill, 8.4); // higher surge fill rate
    updated.history = history;
    
    store.logAudit(
      'CRITICAL_SURGE_EVENT',
      `⚠️ Sensor Surge detected at ${bin.bin_code} (${bin.name}): Fill jumped from ${previousFill}% to ${targetFill}%!`
    );

    return updated;
  }

  /**
   * Simulates waste collection action on a bin
   */
  collectBin(binId) {
    const bin = store.getBinById(binId);
    if (!bin) return null;

    const oldFill = bin.currentFill;
    const updated = this._updateBinCalculations(bin, 8, 2.0); // Reset to 8%
    updated.lastCollectedHoursAgo = 0;
    updated.history = [
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), fill: 8 }
    ];

    store.logAudit(
      'BIN_COLLECTION_COMPLETED',
      `🚛 Vehicle collected ${bin.bin_code}. Emptied from ${oldFill}% down to 8%.`
    );

    return updated;
  }

  /**
   * Advance time by N hours
   */
  advanceTime(hours = 2) {
    const bins = store.getBins();
    bins.forEach(bin => {
      const addedFill = Math.round(bin.fillRatePerHour * hours);
      const newFill = Math.min(100, bin.currentFill + addedFill);
      this._updateBinCalculations(bin, newFill);
      bin.lastCollectedHoursAgo = (bin.lastCollectedHoursAgo || 0) + hours;
    });

    store.logAudit('TIME_FAST_FORWARD', `⏩ Fast-forwarded city telemetry by +${hours} hours.`);
    return { success: true, message: `Advanced city simulation by ${hours} hours.` };
  }

  _updateBinCalculations(bin, newFill, customRate = null) {
    bin.currentFill = newFill;
    
    if (customRate) {
      bin.fillRatePerHour = customRate;
    }

    // Dynamic ETA calculation: (100 - fill) / fillRate
    const remainingPercent = Math.max(0, 100 - newFill);
    const rate = Math.max(0.5, bin.fillRatePerHour || 2.0);
    const eta = Number((remainingPercent / rate).toFixed(1));
    bin.overflowEtaHours = eta;

    // Status assignment
    if (newFill >= 90 || eta <= 2.0) {
      bin.status = 'CRITICAL';
      bin.overflowRisk = 'CRITICAL';
    } else if (newFill >= 75 || eta <= 5.0) {
      bin.status = 'HIGH';
      bin.overflowRisk = 'HIGH';
    } else if (newFill >= 50 || eta <= 12.0) {
      bin.status = 'MODERATE';
      bin.overflowRisk = 'MODERATE';
    } else {
      bin.status = 'NORMAL';
      bin.overflowRisk = 'NORMAL';
    }

    store.updateBin(bin.id, bin);
    return bin;
  }
}

export const simulator = new SensorSimulator();
