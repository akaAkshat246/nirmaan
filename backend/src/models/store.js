import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data files path
const dataDir = path.resolve(__dirname, '../../../data');
const binsFilePath = path.join(dataDir, 'seed_bins.json');
const cityGraphPath = path.join(dataDir, 'city_graph.json');
const hotspotPath = path.join(dataDir, 'hotspot_history.json');

export class MemoryStore {
  constructor() {
    this.bins = [];
    this.cityGraph = null;
    this.hotspotData = null;
    this.collectionTasks = [];
    this.citizenReports = [];
    this.activeVehicles = [
      { id: 'VEH-01', plateNumber: 'DL-01-EA-4092', driver: 'Rajesh Kumar', capacityKg: 5000, currentLoadKg: 1200, status: 'AVAILABLE', currentSector: 'Central Depot', lat: 28.6139, lng: 77.2090 },
      { id: 'VEH-02', plateNumber: 'DL-04-GB-9811', driver: 'Amit Verma', capacityKg: 4000, currentLoadKg: 3100, status: 'EN_ROUTE', currentSector: 'Old City Sector 2', lat: 28.6180, lng: 77.2300 },
      { id: 'VEH-03', plateNumber: 'DL-11-TC-5520', driver: 'Sanjay Sharma', capacityKg: 5000, currentLoadKg: 0, status: 'AVAILABLE', currentSector: 'Central Depot', lat: 28.6139, lng: 77.2090 },
      { id: 'VEH-04', plateNumber: 'DL-09-MK-1284', driver: 'Sunil Yadav', capacityKg: 6000, currentLoadKg: 4200, status: 'COLLECTING', currentSector: 'Market Sector 4', lat: 28.6350, lng: 77.2250 }
    ];
    this.auditLogs = [];

    this.init();
  }

  init() {
    try {
      if (fs.existsSync(binsFilePath)) {
        this.bins = JSON.parse(fs.readFileSync(binsFilePath, 'utf-8'));
      }
      if (fs.existsSync(cityGraphPath)) {
        this.cityGraph = JSON.parse(fs.readFileSync(cityGraphPath, 'utf-8'));
      }
      if (fs.existsSync(hotspotPath)) {
        this.hotspotData = JSON.parse(fs.readFileSync(hotspotPath, 'utf-8'));
      }
      
      // Initialize seed citizen reports
      this.citizenReports = [
        {
          id: 'REP-701',
          userName: 'Aarav Patel',
          userPhone: '+91 98765 43210',
          sector: 'Market Sector 4',
          locationDesc: 'Near Central Sweet Shop, Lane 3',
          wasteType: 'Mixed Commercial Garbage',
          severity: 'HIGH',
          imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500&q=80',
          status: 'PENDING',
          aiVerification: {
            detectedType: 'Mixed Plastic & Organic Waste',
            confidence: 0.93,
            hazardLevel: 'MODERATE'
          },
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'REP-702',
          userName: 'Pooja Sharma',
          userPhone: '+91 98111 22334',
          sector: 'Old City Sector 2',
          locationDesc: 'Back alley near Old Clock Tower',
          wasteType: 'Overflowing Community Bin',
          severity: 'CRITICAL',
          imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&q=80',
          status: 'ASSIGNED',
          aiVerification: {
            detectedType: 'Overflowing Organic & Cardboard',
            confidence: 0.96,
            hazardLevel: 'HIGH'
          },
          createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
        }
      ];

      this.logAudit('SYSTEM_INIT', 'Memory store loaded with smart bin seeds and city network graph.');
    } catch (err) {
      console.error('Error loading seed data into store:', err);
    }
  }

  getBins() {
    return this.bins;
  }

  getBinById(id) {
    return this.bins.find(b => b.id === id || b.bin_code === id);
  }

  updateBin(id, updates) {
    const index = this.bins.findIndex(b => b.id === id || b.bin_code === id);
    if (index !== -1) {
      this.bins[index] = { ...this.bins[index], ...updates };
      return this.bins[index];
    }
    return null;
  }

  addReport(report) {
    const newReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      ...report
    };
    this.citizenReports.unshift(newReport);
    this.logAudit('CITIZEN_REPORT_SUBMITTED', `New report ${newReport.id} created for ${newReport.sector}`);
    return newReport;
  }

  getReports() {
    return this.citizenReports;
  }

  updateReportStatus(id, status) {
    const report = this.citizenReports.find(r => r.id === id);
    if (report) {
      report.status = status;
      return report;
    }
    return null;
  }

  logAudit(action, details) {
    const entry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      action,
      details
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 50) this.auditLogs.pop();
    return entry;
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  resetToDefaults() {
    this.init();
    return { success: true, message: 'Store reset to seed default state' };
  }
}

export const store = new MemoryStore();
