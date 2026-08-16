import bcrypt from 'bcryptjs';

/**
 * Production-grade In-Memory Relational Database for NIRMAAN
 * Structured specifically for Delhi Municipal Corporation (MCD) operations.
 */
class DelhiDatabase {
  constructor() {
    this.users = [];
    this.bins = [];
    this.tasks = [];
    this.reports = [];
    this.vehicles = [];
    this.notifications = [];
    this.auditLogs = [];

    this.seed();
  }

  seed() {
    // 1. SEED USERS WITH BCRYPT HASHED PASSWORDS
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const workerPasswordHash = bcrypt.hashSync('worker123', 10);
    const citizenPasswordHash = bcrypt.hashSync('citizen123', 10);

    this.users = [
      {
        id: 'USR-ADMIN-01',
        name: 'Shri Rajesh Meena, IAS',
        email: 'admin@nirmaan.delhi.gov.in',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        designation: 'Additional Commissioner (Sanitation & AI Command)',
        zone: 'Central Delhi MCD HQ',
        phone: '+91 11 2322 8000',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: 'USR-WORKER-01',
        name: 'Sunil Kumar',
        email: 'worker@nirmaan.delhi.gov.in',
        passwordHash: workerPasswordHash,
        role: 'WORKER',
        designation: 'Senior Fleet Driver & Field Operator',
        zone: 'Central & West Zone',
        phone: '+91 98112 34567',
        vehicleId: 'VEH-DL-01',
        assignedVehiclePlate: 'DL-01-EA-4092',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
        tasksCompletedToday: 7,
        shiftStatus: 'ON_DUTY',
        createdAt: new Date().toISOString()
      },
      {
        id: 'USR-CITIZEN-01',
        name: 'Ananya Sharma',
        email: 'citizen@delhi.in',
        passwordHash: citizenPasswordHash,
        role: 'CITIZEN',
        designation: 'Resident',
        zone: 'South Delhi (Saket)',
        phone: '+91 98765 43210',
        karmaPoints: 340,
        reportsSubmitted: 4,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
        createdAt: new Date().toISOString()
      }
    ];

    // 2. DELHI SMART BINS (REAL GPS COORDINATES & SECTOR METRICS)
    this.bins = [
      {
        id: 'BIN-DL-104',
        bin_code: 'BIN #DL-104',
        name: 'Connaught Place Inner Circle (Block B)',
        sector: 'Connaught Place (CP)',
        locality: 'Central Delhi',
        nodeId: 'NODE_A',
        latitude: 28.6328,
        longitude: 77.2197,
        capacityLiters: 1200,
        currentFill: 68,
        wasteType: 'Mixed Commercial',
        status: 'MODERATE',
        fillRatePerHour: 4.8,
        overflowEtaHours: 6.6,
        overflowRisk: 'MODERATE',
        batteryPercent: 94,
        solarActive: true,
        temperatureC: 28.4,
        odourIndex: 42,
        lastCollectedHoursAgo: 18,
        history: [
          { time: '08:00 AM', fill: 52 },
          { time: '10:00 AM', fill: 58 },
          { time: '12:00 PM', fill: 62 },
          { time: '02:00 PM', fill: 68 }
        ]
      },
      {
        id: 'BIN-DL-102',
        bin_code: 'BIN #DL-102',
        name: 'Ajmal Khan Road Market Junction',
        sector: 'Karol Bagh',
        locality: 'Central West Delhi',
        nodeId: 'NODE_D',
        latitude: 28.6517,
        longitude: 77.1906,
        capacityLiters: 1000,
        currentFill: 88,
        wasteType: 'Organic / Wet',
        status: 'HIGH',
        fillRatePerHour: 5.2,
        overflowEtaHours: 2.3,
        overflowRisk: 'HIGH',
        batteryPercent: 82,
        solarActive: true,
        temperatureC: 31.0,
        odourIndex: 78,
        lastCollectedHoursAgo: 26,
        history: [
          { time: '08:00 AM', fill: 60 },
          { time: '10:00 AM', fill: 70 },
          { time: '12:00 PM', fill: 79 },
          { time: '02:00 PM', fill: 88 }
        ]
      },
      {
        id: 'BIN-DL-117',
        bin_code: 'BIN #DL-117',
        name: 'Central Market Footwear Lane',
        sector: 'Lajpat Nagar Part 2',
        locality: 'South East Delhi',
        nodeId: 'NODE_G',
        latitude: 28.5677,
        longitude: 77.2433,
        capacityLiters: 1500,
        currentFill: 85,
        wasteType: 'Packaging & Plastic',
        status: 'HIGH',
        fillRatePerHour: 4.6,
        overflowEtaHours: 3.2,
        overflowRisk: 'HIGH',
        batteryPercent: 76,
        solarActive: false,
        temperatureC: 29.5,
        odourIndex: 64,
        lastCollectedHoursAgo: 22,
        history: [
          { time: '08:00 AM', fill: 55 },
          { time: '10:00 AM', fill: 65 },
          { time: '12:00 PM', fill: 76 },
          { time: '02:00 PM', fill: 85 }
        ]
      },
      {
        id: 'BIN-DL-109',
        bin_code: 'BIN #DL-109',
        name: 'Janakpuri West District Centre Complex',
        sector: 'Janakpuri',
        locality: 'West Delhi',
        nodeId: 'NODE_B',
        latitude: 28.6289,
        longitude: 77.0788,
        capacityLiters: 800,
        currentFill: 77,
        wasteType: 'Dry (Plastic & Paper)',
        status: 'HIGH',
        fillRatePerHour: 3.8,
        overflowEtaHours: 6.0,
        overflowRisk: 'HIGH',
        batteryPercent: 98,
        solarActive: true,
        temperatureC: 26.2,
        odourIndex: 20,
        lastCollectedHoursAgo: 16,
        history: [
          { time: '08:00 AM', fill: 45 },
          { time: '10:00 AM', fill: 56 },
          { time: '12:00 PM', fill: 66 },
          { time: '02:00 PM', fill: 77 }
        ]
      },
      {
        id: 'BIN-DL-131',
        bin_code: 'BIN #DL-131',
        name: 'Chandni Chowk Pedestrian Heritage Walk',
        sector: 'Chandni Chowk',
        locality: 'Old Delhi',
        nodeId: 'NODE_E',
        latitude: 28.6506,
        longitude: 77.2303,
        capacityLiters: 1200,
        currentFill: 93,
        wasteType: 'Food & Plastic Cutlery',
        status: 'CRITICAL',
        fillRatePerHour: 6.2,
        overflowEtaHours: 1.1,
        overflowRisk: 'CRITICAL',
        batteryPercent: 89,
        solarActive: true,
        temperatureC: 32.8,
        odourIndex: 85,
        lastCollectedHoursAgo: 28,
        history: [
          { time: '08:00 AM', fill: 62 },
          { time: '10:00 AM', fill: 74 },
          { time: '12:00 PM', fill: 84 },
          { time: '02:00 PM', fill: 93 }
        ]
      },
      {
        id: 'BIN-DL-112',
        bin_code: 'BIN #DL-112',
        name: 'Select Citywalk Promenade Plaza',
        sector: 'Saket District Centre',
        locality: 'South Delhi',
        nodeId: 'NODE_C',
        latitude: 28.5284,
        longitude: 77.2194,
        capacityLiters: 1000,
        currentFill: 42,
        wasteType: 'Recyclables',
        status: 'NORMAL',
        fillRatePerHour: 2.1,
        overflowEtaHours: 27.6,
        overflowRisk: 'NORMAL',
        batteryPercent: 91,
        solarActive: true,
        temperatureC: 25.0,
        odourIndex: 18,
        lastCollectedHoursAgo: 10,
        history: [
          { time: '08:00 AM', fill: 32 },
          { time: '10:00 AM', fill: 35 },
          { time: '12:00 PM', fill: 38 },
          { time: '02:00 PM', fill: 42 }
        ]
      },
      {
        id: 'BIN-DL-120',
        bin_code: 'BIN #DL-120',
        name: 'Dwarka Sector 10 Market Complex',
        sector: 'Dwarka',
        locality: 'South West Delhi',
        nodeId: 'NODE_F',
        latitude: 28.5812,
        longitude: 77.0583,
        capacityLiters: 900,
        currentFill: 38,
        wasteType: 'Mixed Residential',
        status: 'NORMAL',
        fillRatePerHour: 1.5,
        overflowEtaHours: 41.3,
        overflowRisk: 'NORMAL',
        batteryPercent: 95,
        solarActive: true,
        temperatureC: 24.5,
        odourIndex: 12,
        lastCollectedHoursAgo: 8,
        history: [
          { time: '08:00 AM', fill: 30 },
          { time: '10:00 AM', fill: 32 },
          { time: '12:00 PM', fill: 35 },
          { time: '02:00 PM', fill: 38 }
        ]
      },
      {
        id: 'BIN-DL-125',
        bin_code: 'BIN #DL-125',
        name: 'Rohini Sector 7 Main Market',
        sector: 'Rohini Sector 7',
        locality: 'North West Delhi',
        nodeId: 'NODE_H',
        latitude: 28.7126,
        longitude: 77.1192,
        capacityLiters: 1000,
        currentFill: 64,
        wasteType: 'Mixed Commercial',
        status: 'MODERATE',
        fillRatePerHour: 3.2,
        overflowEtaHours: 11.2,
        overflowRisk: 'MODERATE',
        batteryPercent: 87,
        solarActive: false,
        temperatureC: 23.8,
        odourIndex: 35,
        lastCollectedHoursAgo: 14,
        history: [
          { time: '08:00 AM', fill: 48 },
          { time: '10:00 AM', fill: 53 },
          { time: '12:00 PM', fill: 59 },
          { time: '02:00 PM', fill: 64 }
        ]
      },
      {
        id: 'BIN-DL-129',
        bin_code: 'BIN #DL-129',
        name: 'Hauz Khas Village Fort Entrance',
        sector: 'Hauz Khas',
        locality: 'South Delhi',
        nodeId: 'NODE_I',
        latitude: 28.5494,
        longitude: 77.1932,
        capacityLiters: 1000,
        currentFill: 28,
        wasteType: 'Dry Recyclables',
        status: 'NORMAL',
        fillRatePerHour: 1.2,
        overflowEtaHours: 60.0,
        overflowRisk: 'NORMAL',
        batteryPercent: 100,
        solarActive: true,
        temperatureC: 24.1,
        odourIndex: 8,
        lastCollectedHoursAgo: 6,
        history: [
          { time: '08:00 AM', fill: 20 },
          { time: '10:00 AM', fill: 22 },
          { time: '12:00 PM', fill: 25 },
          { time: '02:00 PM', fill: 28 }
        ]
      },
      {
        id: 'BIN-DL-135',
        bin_code: 'BIN #DL-135',
        name: 'Vasant Kunj Promenade Mall Gate 3',
        sector: 'Vasant Kunj',
        locality: 'South West Delhi',
        nodeId: 'NODE_A',
        latitude: 28.5401,
        longitude: 77.1557,
        capacityLiters: 1200,
        currentFill: 54,
        wasteType: 'Dry & Packaging',
        status: 'MODERATE',
        fillRatePerHour: 2.5,
        overflowEtaHours: 18.4,
        overflowRisk: 'MODERATE',
        batteryPercent: 92,
        solarActive: true,
        temperatureC: 25.4,
        odourIndex: 22,
        lastCollectedHoursAgo: 12,
        history: [
          { time: '08:00 AM', fill: 40 },
          { time: '10:00 AM', fill: 45 },
          { time: '12:00 PM', fill: 50 },
          { time: '02:00 PM', fill: 54 }
        ]
      }
    ];

    // 3. SEED VEHICLES
    this.vehicles = [
      {
        id: 'VEH-DL-01',
        plateNumber: 'DL-01-EA-4092',
        vehicleType: 'Compactor Truck (10-Ton)',
        assignedWorkerId: 'USR-WORKER-01',
        assignedWorkerName: 'Sunil Kumar',
        capacityKg: 5000,
        currentLoadKg: 2850,
        fuelPercent: 82,
        status: 'EN_ROUTE',
        currentSector: 'Karol Bagh & Central Zone',
        latitude: 28.6480,
        longitude: 77.2050
      },
      {
        id: 'VEH-DL-02',
        plateNumber: 'DL-04-GB-9811',
        vehicleType: 'Electric Mini-Tipper (3-Ton)',
        assignedWorkerId: null,
        assignedWorkerName: 'Ramesh Yadav',
        capacityKg: 3000,
        currentLoadKg: 950,
        fuelPercent: 94,
        status: 'AVAILABLE',
        currentSector: 'Central Depot Hub',
        latitude: 28.6139,
        longitude: 77.2090
      },
      {
        id: 'VEH-DL-03',
        plateNumber: 'DL-11-TC-5520',
        vehicleType: 'Heavy Compaction Unit (14-Ton)',
        assignedWorkerId: null,
        assignedWorkerName: 'Vijay Singh',
        capacityKg: 6000,
        currentLoadKg: 4600,
        fuelPercent: 68,
        status: 'COLLECTING',
        currentSector: 'Chandni Chowk',
        latitude: 28.6506,
        longitude: 77.2303
      }
    ];

    // 4. SEED FIELD COLLECTION TASKS
    this.tasks = [
      {
        id: 'TSK-8901',
        binId: 'BIN-DL-131',
        binCode: 'BIN #DL-131',
        binName: 'Chandni Chowk Pedestrian Heritage Walk',
        sector: 'Chandni Chowk (Old Delhi)',
        latitude: 28.6506,
        longitude: 77.2303,
        priority: 'CRITICAL',
        assignedWorkerId: 'USR-WORKER-01',
        assignedWorkerName: 'Sunil Kumar',
        vehiclePlate: 'DL-01-EA-4092',
        status: 'IN_PROGRESS', // IN_PROGRESS, ASSIGNED, COMPLETED
        fillBeforeCollection: 93,
        fillAfterCollection: null,
        wasteType: 'Food & Plastic Cutlery',
        estimatedWeightKg: 446,
        distanceKm: 2.4,
        etaMinutes: 12,
        notes: '🚨 Immediate clearance required before evening wholesale crowd.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        completedAt: null
      },
      {
        id: 'TSK-8902',
        binId: 'BIN-DL-102',
        binCode: 'BIN #DL-102',
        binName: 'Ajmal Khan Road Market Junction',
        sector: 'Karol Bagh',
        latitude: 28.6517,
        longitude: 77.1906,
        priority: 'HIGH',
        assignedWorkerId: 'USR-WORKER-01',
        assignedWorkerName: 'Sunil Kumar',
        vehiclePlate: 'DL-01-EA-4092',
        status: 'ASSIGNED',
        fillBeforeCollection: 88,
        fillAfterCollection: null,
        wasteType: 'Organic / Wet',
        estimatedWeightKg: 352,
        distanceKm: 3.8,
        etaMinutes: 24,
        notes: 'High odour index detected. Disinfectant spray recommended after clearance.',
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        completedAt: null
      },
      {
        id: 'TSK-8903',
        binId: 'BIN-DL-117',
        binCode: 'BIN #DL-117',
        binName: 'Central Market Footwear Lane',
        sector: 'Lajpat Nagar Part 2',
        latitude: 28.5677,
        longitude: 77.2433,
        priority: 'HIGH',
        assignedWorkerId: 'USR-WORKER-01',
        assignedWorkerName: 'Sunil Kumar',
        vehiclePlate: 'DL-01-EA-4092',
        status: 'ASSIGNED',
        fillBeforeCollection: 85,
        fillAfterCollection: null,
        wasteType: 'Packaging & Plastic',
        estimatedWeightKg: 510,
        distanceKm: 5.2,
        etaMinutes: 38,
        notes: 'Scheduled for South-East collection loop.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: null
      }
    ];

    // 5. SEED CITIZEN GRIEVANCE REPORTS
    this.reports = [
      {
        id: 'REP-DL-401',
        citizenId: 'USR-CITIZEN-01',
        citizenName: 'Ananya Sharma',
        citizenPhone: '+91 98765 43210',
        sector: 'Saket District Centre',
        locality: 'South Delhi',
        locationDesc: 'Rear parking lane behind Select Citywalk Mall, near pillar P-14',
        latitude: 28.5290,
        longitude: 77.2185,
        imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80',
        wasteType: 'Commercial Food Packaging & Polythene Bags',
        severity: 'HIGH',
        status: 'IN_PROGRESS', // SUBMITTED, UNDER_REVIEW, ASSIGNED, IN_PROGRESS, RESOLVED
        assignedWorkerName: 'Sunil Kumar',
        aiVerification: {
          acceptableQuality: true,
          qualityScore: 0.94,
          primaryMaterial: 'Plastic Packaging & Wet Scraps',
          confidence: 0.952,
          recyclable: true,
          estimatedScrapInr: '₹28 – ₹45'
        },
        timeline: [
          { status: 'SUBMITTED', title: 'Report Logged by Citizen', time: '10:14 AM' },
          { status: 'UNDER_REVIEW', title: 'AI Verification Passed', time: '10:15 AM' },
          { status: 'ASSIGNED', title: 'Assigned to MCD Field Worker Sunil Kumar', time: '10:45 AM' },
          { status: 'IN_PROGRESS', title: 'Worker Vehicle En-Route (DL-01-EA-4092)', time: '11:20 AM' }
        ],
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'REP-DL-402',
        citizenId: 'USR-CITIZEN-01',
        citizenName: 'Mohit Rawat',
        citizenPhone: '+91 98110 55443',
        sector: 'Karol Bagh',
        locality: 'Central West Delhi',
        locationDesc: 'Near Metro Pillar 114, Saraswati Marg intersection',
        latitude: 28.6520,
        longitude: 77.1890,
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80',
        wasteType: 'Overflowing Community Rubbish & Cardboard Cartons',
        severity: 'CRITICAL',
        status: 'ASSIGNED',
        assignedWorkerName: 'Sunil Kumar',
        aiVerification: {
          acceptableQuality: true,
          qualityScore: 0.91,
          primaryMaterial: 'Corrugated Cardboard & Mixed Solid Waste',
          confidence: 0.965,
          recyclable: true,
          estimatedScrapInr: '₹60 – ₹90'
        },
        timeline: [
          { status: 'SUBMITTED', title: 'Report Logged by Citizen', time: '11:30 AM' },
          { status: 'UNDER_REVIEW', title: 'AI Verification Passed', time: '11:31 AM' },
          { status: 'ASSIGNED', title: 'Task Scheduled on MCD Priority Queue', time: '11:50 AM' }
        ],
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
      }
    ];

    // 6. SYSTEM NOTIFICATIONS
    this.notifications = [
      {
        id: 'NTF-01',
        userId: 'USR-ADMIN-01',
        role: 'ADMIN',
        title: '🚨 Critical Bin Alert: Chandni Chowk',
        message: 'Bin #DL-131 reached 93% capacity. Estimated overflow in ~1.1 hours.',
        type: 'CRITICAL',
        read: false,
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'NTF-02',
        userId: 'USR-WORKER-01',
        role: 'WORKER',
        title: '🚛 New High Priority Task Assigned',
        message: 'Collection Task #TSK-8901 (Chandni Chowk Heritage Walk) assigned to vehicle DL-01-EA-4092.',
        type: 'ACTION_REQUIRED',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'NTF-03',
        userId: 'USR-CITIZEN-01',
        role: 'CITIZEN',
        title: '✅ Report Status Update: In Progress',
        message: 'Your report REP-DL-401 for Saket District Centre has been assigned to a field vehicle.',
        type: 'SUCCESS',
        read: false,
        createdAt: new Date(Date.now() - 2400000).toISOString()
      }
    ];

    this.auditLogs = [
      { id: 'LOG-01', timestamp: '10:00 AM', action: 'SYSTEM_BOOT', details: 'NIRMAAN Delhi Municipal OS initialized with 10 smart nodes across 6 zones.' },
      { id: 'LOG-02', timestamp: '10:15 AM', action: 'REPORT_VERIFIED', details: 'AI verified citizen grievance REP-DL-401 with 95.2% confidence.' },
      { id: 'LOG-03', timestamp: '11:20 AM', action: 'TASK_DISPATCH', details: 'Vehicle DL-01-EA-4092 dispatched for Task #TSK-8901.' }
    ];
  }

  // --- USER METHODS ---
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: `USR-${userData.role}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      karmaPoints: userData.role === 'CITIZEN' ? 100 : 0,
      reportsSubmitted: 0,
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- BIN METHODS ---
  getBins() {
    return this.bins;
  }

  getBinById(id) {
    return this.bins.find(b => b.id === id || b.bin_code === id);
  }

  updateBin(id, updates) {
    const idx = this.bins.findIndex(b => b.id === id || b.bin_code === id);
    if (idx !== -1) {
      this.bins[idx] = { ...this.bins[idx], ...updates };
      return this.bins[idx];
    }
    return null;
  }

  // --- TASK METHODS ---
  getTasks(workerId = null) {
    if (workerId) {
      return this.tasks.filter(t => t.assignedWorkerId === workerId);
    }
    return this.tasks;
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  }

  updateTaskStatus(id, { status, fillAfter = null, notes = null }) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    task.status = status;
    if (fillAfter !== null) task.fillAfterCollection = fillAfter;
    if (notes) task.notes = notes;

    if (status === 'COMPLETED') {
      task.completedAt = new Date().toISOString();
      
      // Also update the associated bin
      const bin = this.getBinById(task.binId);
      if (bin) {
        const resetFill = fillAfter !== null ? fillAfter : 10;
        bin.currentFill = resetFill;
        bin.status = resetFill < 50 ? 'NORMAL' : resetFill < 75 ? 'MODERATE' : 'HIGH';
        bin.overflowEtaHours = Number(((100 - resetFill) / Math.max(1, bin.fillRatePerHour)).toFixed(1));
        bin.lastCollectedHoursAgo = 0;
        bin.history.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fill: resetFill
        });
      }

      // If associated with a citizen report, resolve it
      const report = this.reports.find(r => r.sector === task.sector && r.status !== 'RESOLVED');
      if (report) {
        report.status = 'RESOLVED';
        report.timeline.push({
          status: 'RESOLVED',
          title: 'Waste Collected & Cleanliness Verified',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }

    return task;
  }

  // --- REPORT METHODS ---
  getReports(citizenId = null) {
    if (citizenId) {
      return this.reports.filter(r => r.citizenId === citizenId);
    }
    return this.reports;
  }

  addReport(reportData) {
    const newReport = {
      id: `REP-DL-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'SUBMITTED',
      timeline: [
        { status: 'SUBMITTED', title: 'Report Logged by Citizen', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { status: 'UNDER_REVIEW', title: 'AI Vision Validation Passed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ],
      ...reportData
    };
    this.reports.unshift(newReport);
    return newReport;
  }

  updateReportStatus(id, status, workerName = null) {
    const report = this.reports.find(r => r.id === id);
    if (!report) return null;

    report.status = status;
    if (workerName) report.assignedWorkerName = workerName;

    report.timeline.push({
      status,
      title: status === 'ASSIGNED' ? `Assigned to MCD Operator ${workerName || 'Staff'}` :
             status === 'IN_PROGRESS' ? 'Collection Team Dispatched' :
             status === 'RESOLVED' ? 'Issue Resolved & Site Cleared' : 'Status Updated',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return report;
  }

  // --- NOTIFICATION METHODS ---
  getNotifications(userId = null, role = null) {
    if (userId) {
      return this.notifications.filter(n => n.userId === userId || n.role === role);
    }
    return this.notifications;
  }

  markNotificationRead(id) {
    const n = this.notifications.find(item => item.id === id);
    if (n) n.read = true;
    return n;
  }
}

export const db = new DelhiDatabase();
