const API_BASE = '/api';

export const api = {
  // Bins
  async getBins() {
    try {
      const res = await fetch(`${API_BASE}/bins`);
      if (!res.ok) throw new Error('Failed to fetch bins');
      return await res.json();
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      return null;
    }
  },

  async simulateBinSurge(binId = 'BIN-104', targetFill = 91) {
    const res = await fetch(`${API_BASE}/bins/${binId}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetFill })
    });
    return await res.json();
  },

  async collectBin(binId) {
    const res = await fetch(`${API_BASE}/bins/${binId}/collect`, {
      method: 'POST'
    });
    return await res.json();
  },

  // Waste AI
  async classifyWaste(payload) {
    const res = await fetch(`${API_BASE}/waste/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  // Routing
  async optimizeRoute(options = {}) {
    const res = await fetch(`${API_BASE}/routes/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    return await res.json();
  },

  // Hotspots
  async getHotspots() {
    const res = await fetch(`${API_BASE}/hotspots`);
    return await res.json();
  },

  // Citizen Reports
  async getReports() {
    const res = await fetch(`${API_BASE}/reports`);
    return await res.json();
  },

  async submitReport(payload) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    return await res.json();
  },

  // Simulator controls
  async advanceTime(hours = 2) {
    const res = await fetch(`${API_BASE}/simulator/advance-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours })
    });
    return await res.json();
  },

  async resetSimulator() {
    const res = await fetch(`${API_BASE}/simulator/reset`, {
      method: 'POST'
    });
    return await res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return await res.json();
  }
};
