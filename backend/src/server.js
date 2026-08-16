import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { db } from './models/db.js';
import { simulator } from './simulator/SensorGenerator.js';
import { RouteOptimizer } from './algorithms/RouteOptimizer.js';
import { AIBridge } from './services/aiBridge.js';
import { generateToken, authenticateToken, requireRole } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Start background sensor simulation
simulator.startAutoSimulation(15000);

// ==========================================
// 1. HEALTH & SYSTEM DIAGNOSTICS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'NIRMAAN Delhi Municipal Waste OS',
    version: '2.0.0',
    jurisdiction: 'National Capital Territory of Delhi (MCD)',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. AUTHENTICATION & ROLE ACCESS
// ==========================================

// Pre-seeded demo credentials for 1-click fast login in demos
app.get('/api/auth/demo-users', (req, res) => {
  res.json({
    admin: { email: 'admin@nirmaan.delhi.gov.in', password: 'admin123', label: 'Admin (MCD Command HQ)' },
    worker: { email: 'worker@nirmaan.delhi.gov.in', password: 'worker123', label: 'Worker (Fleet Operations)' },
    citizen: { email: 'citizen@delhi.in', password: 'citizen123', label: 'Citizen (Delhi Resident)' }
  });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'CITIZEN', phone, zone, designation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = db.createUser({
      name,
      email,
      passwordHash,
      role: role.toUpperCase(),
      phone: phone || '+91 99999 00000',
      zone: zone || 'Central Delhi',
      designation: designation || (role === 'CITIZEN' ? 'Resident' : 'Municipal Operator')
    });

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        zone: newUser.zone,
        designation: newUser.designation,
        phone: newUser.phone,
        avatarUrl: newUser.avatarUrl
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration error: ' + err.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        zone: user.zone,
        designation: user.designation,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        assignedVehiclePlate: user.assignedVehiclePlate,
        karmaPoints: user.karmaPoints || 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login error: ' + err.message });
  }
});

// Get Current Authenticated User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User profile not found.' });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    zone: user.zone,
    designation: user.designation,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    assignedVehiclePlate: user.assignedVehiclePlate,
    karmaPoints: user.karmaPoints || 0
  });
});

// ==========================================
// 3. DELHI SMART BINS & TELEMATICS
// ==========================================
app.get('/api/bins', (req, res) => {
  const bins = db.getBins();
  const summary = {
    total: bins.length,
    critical: bins.filter(b => b.status === 'CRITICAL' || b.currentFill >= 90).length,
    high: bins.filter(b => b.status === 'HIGH').length,
    moderate: bins.filter(b => b.status === 'MODERATE').length,
    normal: bins.filter(b => b.status === 'NORMAL').length
  };
  res.json({ summary, bins });
});

app.get('/api/bins/:id', (req, res) => {
  const bin = db.getBinById(req.params.id);
  if (!bin) return res.status(404).json({ error: 'Smart bin not found in Delhi grid.' });
  res.json(bin);
});

app.patch('/api/bins/:id', (req, res) => {
  const updated = db.updateBin(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Bin not found.' });
  res.json(updated);
});

// Trigger sensor surge or manual fill level (HACKATHON DEMO ACTION)
app.post('/api/bins/:id/simulate', (req, res) => {
  const { targetFill = 91 } = req.body;
  const bin = db.getBinById(req.params.id);
  if (!bin) return res.status(404).json({ error: 'Bin not found' });

  const updated = db.updateBin(bin.id, {
    currentFill: targetFill,
    status: targetFill >= 90 ? 'CRITICAL' : targetFill >= 75 ? 'HIGH' : 'MODERATE',
    overflowEtaHours: Number(((100 - targetFill) / Math.max(1, bin.fillRatePerHour)).toFixed(1)),
    overflowRisk: targetFill >= 90 ? 'CRITICAL' : 'HIGH'
  });

  res.json({
    message: `Surge simulated for ${updated.bin_code}`,
    bin: updated
  });
});

// Simulate vehicle emptying a bin
app.post('/api/bins/:id/collect', (req, res) => {
  const updated = db.updateBin(req.params.id, {
    currentFill: 8,
    status: 'NORMAL',
    overflowEtaHours: 24.0,
    overflowRisk: 'NORMAL',
    lastCollectedHoursAgo: 0
  });

  if (!updated) return res.status(404).json({ error: 'Bin not found' });
  res.json({
    message: `Collection completed for ${updated.bin_code}`,
    bin: updated
  });
});

// ==========================================
// 4. FIELD COLLECTION TASKS (WORKER & ADMIN)
// ==========================================
app.get('/api/tasks', (req, res) => {
  const { workerId } = req.query;
  const tasks = db.getTasks(workerId);
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { binId, priority = 'HIGH', assignedWorkerId, notes } = req.body;
  const bin = db.getBinById(binId);
  if (!bin) return res.status(404).json({ error: 'Bin not found' });

  const newTask = {
    id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
    binId: bin.id,
    binCode: bin.bin_code,
    binName: bin.name,
    sector: bin.sector,
    latitude: bin.latitude,
    longitude: bin.longitude,
    priority,
    assignedWorkerId: assignedWorkerId || 'USR-WORKER-01',
    assignedWorkerName: 'Sunil Kumar',
    vehiclePlate: 'DL-01-EA-4092',
    status: 'ASSIGNED',
    fillBeforeCollection: bin.currentFill,
    fillAfterCollection: null,
    wasteType: bin.wasteType,
    estimatedWeightKg: Math.round((bin.currentFill / 100) * (bin.capacityLiters * 0.4)),
    distanceKm: 3.2,
    etaMinutes: 20,
    notes: notes || 'Scheduled via Admin Command Center',
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  db.tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/status', (req, res) => {
  const { status, fillAfter, notes } = req.body;
  const updated = db.updateTaskStatus(req.params.id, { status, fillAfter, notes });
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// ==========================================
// 5. CITIZEN GRIEVANCE REPORTS (CITIZEN & ADMIN)
// ==========================================
app.get('/api/reports', (req, res) => {
  const { citizenId } = req.query;
  const reports = db.getReports(citizenId);
  res.json(reports);
});

app.post('/api/reports', async (req, res) => {
  try {
    const { 
      citizenId, 
      citizenName, 
      citizenPhone, 
      sector, 
      locality, 
      locationDesc, 
      latitude, 
      longitude, 
      wasteType, 
      severity, 
      imageUrl,
      imageName 
    } = req.body;

    // Run AI multi-object classification on report
    const aiAnalysis = await AIBridge.classifyWaste({ 
      imageName: imageName || wasteType, 
      category: wasteType,
      tag: wasteType 
    });

    const newReport = db.addReport({
      citizenId: citizenId || 'USR-CITIZEN-01',
      citizenName: citizenName || 'Delhi Resident',
      citizenPhone: citizenPhone || '+91 98765 43210',
      sector: sector || 'Connaught Place',
      locality: locality || 'Central Delhi',
      locationDesc: locationDesc || 'Public Community Point',
      latitude: latitude ? parseFloat(latitude) : 28.6328,
      longitude: longitude ? parseFloat(longitude) : 77.2197,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80',
      wasteType: wasteType || 'Commercial Solid Waste',
      severity: severity || 'HIGH',
      assignedWorkerName: null,
      aiVerification: {
        acceptableQuality: aiAnalysis.image_quality?.acceptable ?? true,
        qualityScore: aiAnalysis.image_quality?.quality_score ?? 0.92,
        primaryMaterial: aiAnalysis.primaryMaterial || aiAnalysis.primaryCategory,
        confidence: aiAnalysis.primaryConfidence || 0.94,
        recyclable: aiAnalysis.recyclable,
        estimatedScrapInr: aiAnalysis.scrapValueInr
      }
    });

    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: 'Report submission failed: ' + err.message });
  }
});

app.patch('/api/reports/:id/status', (req, res) => {
  const { status, workerName } = req.body;
  const updated = db.updateReportStatus(req.params.id, status, workerName);
  if (!updated) return res.status(404).json({ error: 'Report not found' });
  res.json(updated);
});

// ==========================================
// 6. AI WASTE CLASSIFICATION (Module 1)
// ==========================================
app.post('/api/waste/classify', async (req, res) => {
  const { image, imageName, category, tag } = req.body;
  const classification = await AIBridge.classifyWaste({ image, imageName, category, tag });
  res.json(classification);
});

// ==========================================
// 7. DSA ROUTE OPTIMIZATION (Module 4)
// ==========================================
app.post('/api/routes/optimize', (req, res) => {
  const bins = db.getBins();
  const cityGraph = {
    depot: { id: 'DEPOT', name: 'Central MCD Depot Hub', lat: 28.6139, lng: 77.2090 },
    nodes: bins.map(b => ({ id: b.nodeId, name: b.name, sector: b.sector, lat: b.latitude, lng: b.longitude })),
    edges: [
      { from: 'DEPOT', to: 'NODE_D', distance: 3.8 },
      { from: 'DEPOT', to: 'NODE_G', distance: 2.9 },
      { from: 'NODE_A', to: 'NODE_B', distance: 4.5 },
      { from: 'NODE_A', to: 'NODE_D', distance: 3.2 },
      { from: 'NODE_B', to: 'NODE_C', distance: 3.9 },
      { from: 'NODE_B', to: 'NODE_E', distance: 3.4 },
      { from: 'NODE_C', to: 'NODE_F', distance: 2.8 },
      { from: 'NODE_D', to: 'NODE_E', distance: 3.1 },
      { from: 'NODE_D', to: 'NODE_G', distance: 3.6 },
      { from: 'NODE_E', to: 'NODE_F', distance: 3.5 },
      { from: 'NODE_E', to: 'NODE_H', distance: 2.7 },
      { from: 'NODE_F', to: 'NODE_I', distance: 3.0 },
      { from: 'NODE_G', to: 'NODE_H', distance: 3.3 },
      { from: 'NODE_H', to: 'NODE_I', distance: 3.7 }
    ]
  };

  const optimizer = new RouteOptimizer(cityGraph);
  const routePlan = optimizer.optimizeCollectionRoute(bins, { minPriorityThreshold: 40 });
  res.json(routePlan);
});

// ==========================================
// 8. HOTSPOT PREDICTIONS (Module 6)
// ==========================================
app.get('/api/hotspots', (req, res) => {
  res.json({
    sectors: [
      {
        sectorId: 'DEL-SEC-KB-01',
        sectorName: 'Karol Bagh Market Enclave',
        nodeId: 'NODE_D',
        historicalDailyLoadKg: [850, 920, 940, 890, 1020, 1150, 1100],
        avgDailyFillPercent: [74, 80, 82, 78, 91, 96, 94],
        predictedTomorrowRiskPercent: 88,
        tomorrowExpectedIncreasePercent: 34,
        factors: ['Weekend Wholesale Clothing Rush', 'High Single-Use Plastic Bags', 'Heavy Evening Pedestrian Footfall'],
        recommendedAction: 'Deploy 1 secondary compactor vehicle by 11:00 AM'
      },
      {
        sectorId: 'DEL-SEC-CC-02',
        sectorName: 'Chandni Chowk Heritage Zone',
        nodeId: 'NODE_E',
        historicalDailyLoadKg: [900, 950, 970, 920, 1080, 1200, 1180],
        avgDailyFillPercent: [78, 82, 85, 80, 94, 98, 96],
        predictedTomorrowRiskPercent: 92,
        tomorrowExpectedIncreasePercent: 38,
        factors: ['Street Food Festival Rush', 'High Organic & Wet Waste', 'Narrow Lane Vehicle Restriction'],
        recommendedAction: 'Deploy early-morning mini-tipper clearance (06:30 AM)'
      },
      {
        sectorId: 'DEL-SEC-LN-03',
        sectorName: 'Lajpat Nagar Part 2',
        nodeId: 'NODE_G',
        historicalDailyLoadKg: [600, 640, 680, 650, 820, 960, 910],
        avgDailyFillPercent: [58, 62, 65, 63, 81, 92, 88],
        predictedTomorrowRiskPercent: 78,
        tomorrowExpectedIncreasePercent: 26,
        factors: ['Weekend Retail Peak', 'Packaging Cartons Inflow', 'Evening Food Court Density'],
        recommendedAction: 'Schedule secondary afternoon clearance loop (03:00 PM)'
      },
      {
        sectorId: 'DEL-SEC-CP-04',
        sectorName: 'Connaught Place Commercial Circle',
        nodeId: 'NODE_A',
        historicalDailyLoadKg: [700, 720, 750, 740, 880, 950, 920],
        avgDailyFillPercent: [62, 65, 68, 66, 80, 88, 85],
        predictedTomorrowRiskPercent: 68,
        tomorrowExpectedIncreasePercent: 18,
        factors: ['Restaurant & Bar Density', 'Corporate Weekday Flow', 'Metro Commuter Footfall'],
        recommendedAction: 'Maintain standard bi-daily schedule'
      }
    ]
  });
});

// ==========================================
// 9. NOTIFICATIONS (ROLE FILTERED)
// ==========================================
app.get('/api/notifications', authenticateToken, (req, res) => {
  const list = db.getNotifications(req.user.id, req.user.role);
  res.json(list);
});

app.patch('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const updated = db.markNotificationRead(req.params.id);
  res.json(updated || { success: true });
});

// ==========================================
// 10. EXECUTIVE ANALYTICS
// ==========================================
app.get('/api/analytics', (req, res) => {
  const bins = db.getBins();
  res.json({
    metrics: {
      collectionResponseHoursBefore: 8.2,
      collectionResponseHoursWithNirmaan: 4.7,
      overflowIncidentsPreventedMonthly: 142,
      fuelSavedPercent: 27.4,
      co2ReducedTonsMonthly: 18.6
    },
    compositionGlobal: {
      Plastic: 32,
      Organic: 41,
      Paper: 15,
      Metal: 7,
      Glass: 3,
      EWaste: 2
    },
    activeBinsTotal: bins.length,
    criticalCount: bins.filter(b => b.status === 'CRITICAL' || b.currentFill >= 90).length,
    highCount: bins.filter(b => b.status === 'HIGH').length,
    totalWasteClearedTodayTons: 16.4,
    esgCreditsEarned: '420 Green Credits'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 NIRMAAN Delhi Waste OS REST API running on port ${PORT}`);
  console.log(`📡 Connected to Delhi MCD Smart Sensor Network`);
  console.log(`====================================================`);
});
