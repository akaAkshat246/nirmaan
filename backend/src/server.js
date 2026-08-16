import express from 'express';
import cors from 'cors';
import { store } from './models/store.js';
import { simulator } from './simulator/SensorGenerator.js';
import { RouteOptimizer } from './algorithms/RouteOptimizer.js';
import { AIBridge } from './services/aiBridge.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Start background sensor simulation
simulator.startAutoSimulation(15000);

// ==========================================
// 1. HEALTH & SYSTEM STATUS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'NIRMAAN Municipal Waste Intelligence Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. SMART BINS & TELEMATICS
// ==========================================
app.get('/api/bins', (req, res) => {
  const bins = store.getBins();
  const summary = {
    total: bins.length,
    critical: bins.filter(b => b.status === 'CRITICAL').length,
    high: bins.filter(b => b.status === 'HIGH').length,
    moderate: bins.filter(b => b.status === 'MODERATE').length,
    normal: bins.filter(b => b.status === 'NORMAL').length
  };
  res.json({ summary, bins });
});

app.get('/api/bins/:id', (req, res) => {
  const bin = store.getBinById(req.params.id);
  if (!bin) return res.status(404).json({ error: 'Bin not found' });
  res.json(bin);
});

app.patch('/api/bins/:id', (req, res) => {
  const updated = store.updateBin(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Bin not found' });
  res.json(updated);
});

// Trigger sensor surge or manual fill level (HACKATHON DEMO MOMENT)
app.post('/api/bins/:id/simulate', (req, res) => {
  const { targetFill = 91 } = req.body;
  const updated = simulator.triggerSurge(req.params.id, targetFill);
  if (!updated) return res.status(404).json({ error: 'Bin not found' });
  res.json({
    message: `Surge simulated for ${updated.bin_code}`,
    bin: updated
  });
});

// Simulate vehicle emptying a bin
app.post('/api/bins/:id/collect', (req, res) => {
  const updated = simulator.collectBin(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Bin not found' });
  res.json({
    message: `Collection recorded for ${updated.bin_code}`,
    bin: updated
  });
});

// ==========================================
// 3. AI WASTE CLASSIFICATION (Module 1)
// ==========================================
app.post('/api/waste/classify', async (req, res) => {
  const { image, imageName, category, tag } = req.body;
  const classification = await AIBridge.classifyWaste({ image, imageName, category, tag });
  
  store.logAudit(
    'AI_WASTE_CLASSIFIED',
    `Classified item as ${classification.category} (${(classification.confidence * 100).toFixed(1)}% conf) -> ${classification.recommendedBin}`
  );

  res.json(classification);
});

// ==========================================
// 4. AI OVERFLOW PREDICTIONS (Module 3)
// ==========================================
app.get('/api/predictions', async (req, res) => {
  const bins = store.getBins();
  const predictions = await Promise.all(
    bins.map(bin => AIBridge.predictOverflow(bin))
  );
  res.json(predictions);
});

app.get('/api/predictions/:binId', async (req, res) => {
  const bin = store.getBinById(req.params.binId);
  if (!bin) return res.status(404).json({ error: 'Bin not found' });
  const prediction = await AIBridge.predictOverflow(bin);
  res.json(prediction);
});

// ==========================================
// 5. DSA ROUTE OPTIMIZATION (Module 4)
// ==========================================
app.post('/api/routes/optimize', (req, res) => {
  const bins = store.getBins();
  const cityGraph = store.cityGraph;
  const { vehicleCapacityKg = 5000, minPriorityThreshold = 40 } = req.body;

  const optimizer = new RouteOptimizer(cityGraph);
  const routePlan = optimizer.optimizeCollectionRoute(bins, { vehicleCapacityKg, minPriorityThreshold });

  store.logAudit(
    'ROUTE_OPTIMIZED',
    `Generated optimal route with ${routePlan.totalStops} stops (${routePlan.totalDistanceKm} km). Estimated time: ${routePlan.estimatedDurationMinutes} mins.`
  );

  res.json(routePlan);
});

app.get('/api/routes/current', (req, res) => {
  const bins = store.getBins();
  const cityGraph = store.cityGraph;
  const optimizer = new RouteOptimizer(cityGraph);
  const routePlan = optimizer.optimizeCollectionRoute(bins, { minPriorityThreshold: 40 });
  res.json({
    vehicles: store.activeVehicles,
    activeRoute: routePlan
  });
});

// ==========================================
// 6. GARBAGE HOTSPOT PREDICTIONS (Module 6)
// ==========================================
app.get('/api/hotspots', (req, res) => {
  res.json(store.hotspotData);
});

// ==========================================
// 7. CITIZEN GRIEVANCE REPORTING (Module 8)
// ==========================================
app.get('/api/reports', (req, res) => {
  res.json(store.getReports());
});

app.post('/api/reports', async (req, res) => {
  const { userName, userPhone, sector, locationDesc, wasteType, severity, imageUrl } = req.body;

  // Auto AI verification on citizen report
  const aiVerification = await AIBridge.classifyWaste({ imageName: wasteType, tag: wasteType });

  const report = store.addReport({
    userName: userName || 'Citizen',
    userPhone: userPhone || '+91 99999 00000',
    sector: sector || 'Market Sector 4',
    locationDesc: locationDesc || 'Public Community Point',
    wasteType: wasteType || 'Mixed Waste',
    severity: severity || 'HIGH',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500&q=80',
    aiVerification: {
      detectedType: aiVerification.category,
      confidence: aiVerification.confidence,
      recommendedBin: aiVerification.recommendedBin
    }
  });

  res.status(201).json(report);
});

app.patch('/api/reports/:id/status', (req, res) => {
  const updated = store.updateReportStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ error: 'Report not found' });
  res.json(updated);
});

// ==========================================
// 8. ANALYTICS & ESG METRICS (Module 7)
// ==========================================
app.get('/api/analytics', (req, res) => {
  const bins = store.getBins();
  const criticalCount = bins.filter(b => b.status === 'CRITICAL').length;
  const highCount = bins.filter(b => b.status === 'HIGH').length;

  res.json({
    metrics: store.hotspotData.metrics,
    compositionGlobal: store.hotspotData.compositionGlobal,
    activeBinsTotal: bins.length,
    criticalCount,
    highCount,
    fleetEfficiency: '94.8%',
    totalWasteClearedTodayTons: 14.8,
    esgCreditsEarned: '420 Green Credits'
  });
});

// ==========================================
// 9. SIMULATOR CONTROLS (DEMO ACTIONS)
// ==========================================
app.post('/api/simulator/advance-time', (req, res) => {
  const { hours = 2 } = req.body;
  const result = simulator.advanceTime(hours);
  res.json(result);
});

app.post('/api/simulator/reset', (req, res) => {
  const result = store.resetToDefaults();
  res.json(result);
});

app.get('/api/audit-logs', (req, res) => {
  res.json(store.getAuditLogs());
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 NIRMAAN Backend API & DSA Engine running on http://localhost:${PORT}`);
  console.log(`📡 IoT Sensor Telemetry Simulator Active (15s Pulse)`);
  console.log(`====================================================`);
});
