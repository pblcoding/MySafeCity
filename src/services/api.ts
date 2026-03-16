import { User, SOSAlert, CrimeReport, EmergencyService, Notification, DashboardStats, HeatmapPoint } from '@/types';

// Mock users
const users: User[] = [
  { _id: '1', name: 'John Citizen', email: 'john@example.com', role: 'citizen', phone: '+1234567890', createdAt: '2024-01-15' },
  { _id: '2', name: 'Admin User', email: 'admin@mysafecity.com', role: 'admin', createdAt: '2024-01-01' },
];

// Center point: Mumbai, India
const CENTER = { lat: 19.076, lng: 72.8777 };

const mockSOSAlerts: SOSAlert[] = [
  { _id: 's1', userId: '1', userName: 'Rahul Sharma', location: { lat: 19.0760, lng: 72.8777, address: 'Gateway of India, Mumbai' }, status: 'active', createdAt: new Date(Date.now() - 120000).toISOString() },
  { _id: 's2', userId: '3', userName: 'Priya Patel', location: { lat: 19.0990, lng: 72.8638, address: 'Dadar Station, Mumbai' }, status: 'responding', createdAt: new Date(Date.now() - 600000).toISOString() },
  { _id: 's3', userId: '4', userName: 'Amit Kumar', location: { lat: 19.0178, lng: 72.8478, address: 'Bandra Kurla Complex, Mumbai' }, status: 'resolved', createdAt: new Date(Date.now() - 3600000).toISOString(), resolvedAt: new Date(Date.now() - 1800000).toISOString() },
];

const crimeTypes: CrimeReport['type'][] = ['theft', 'assault', 'vandalism', 'robbery', 'fraud', 'harassment', 'other'];

const mockCrimeReports: CrimeReport[] = [
  { _id: 'c1', userId: '1', userName: 'Rahul Sharma', type: 'theft', title: 'Mobile snatched at station', description: 'Someone snatched my phone while boarding the local train at Churchgate.', location: { lat: 18.9352, lng: 72.8274, address: 'Churchgate Station, Mumbai' }, status: 'approved', severity: 'medium', createdAt: '2024-12-10T14:30:00Z' },
  { _id: 'c2', userId: '3', userName: 'Priya Patel', type: 'vandalism', title: 'Car window smashed in parking', description: 'Parked car had window smashed overnight in society parking.', location: { lat: 19.1197, lng: 72.9051, address: 'Powai, Mumbai' }, status: 'pending', severity: 'low', createdAt: '2024-12-12T08:00:00Z' },
  { _id: 'c3', userId: '4', userName: 'Amit Kumar', type: 'assault', title: 'Mugging near Juhu Beach', description: 'Was threatened at knifepoint near the beach entrance.', location: { lat: 19.0948, lng: 72.8267, address: 'Juhu Beach, Mumbai' }, status: 'investigating', severity: 'high', createdAt: '2024-12-14T22:15:00Z' },
  { _id: 'c4', userId: '5', userName: 'Sneha Reddy', type: 'robbery', title: 'Shop robbery at Linking Road', description: 'Armed robbery at jewellery shop.', location: { lat: 19.0700, lng: 72.8334, address: 'Linking Road, Bandra' }, status: 'approved', severity: 'high', createdAt: '2024-12-15T03:45:00Z' },
  { _id: 'c5', userId: '6', userName: 'Deepak Verma', type: 'fraud', title: 'ATM skimming device found', description: 'Found a skimming device on ATM machine near station.', location: { lat: 19.0540, lng: 72.8402, address: 'Mahim Station, Mumbai' }, status: 'approved', severity: 'medium', createdAt: '2024-12-16T11:20:00Z' },
  { _id: 'c6', userId: '7', userName: 'Anjali Desai', type: 'harassment', title: 'Street harassment incident', description: 'Verbal harassment near railway station exit.', location: { lat: 18.9400, lng: 72.8356, address: 'CST Station, Mumbai' }, status: 'pending', severity: 'medium', createdAt: '2024-12-17T19:30:00Z' },
];

const mockEmergencyServices: EmergencyService[] = [
  { _id: 'e1', name: 'Colaba Police Station', type: 'police', location: { lat: 18.9220, lng: 72.8347 }, address: 'Shahid Bhagat Singh Rd, Colaba, Mumbai', phone: '022-22821855', distance: 0.8 },
  { _id: 'e2', name: 'Bandra Police Station', type: 'police', location: { lat: 19.0544, lng: 72.8402 }, address: 'Hill Road, Bandra West, Mumbai', phone: '022-26422242', distance: 2.1 },
  { _id: 'e3', name: 'KEM Hospital', type: 'hospital', location: { lat: 19.0003, lng: 72.8416 }, address: 'Acharya Donde Marg, Parel, Mumbai', phone: '022-24107000', distance: 1.5 },
  { _id: 'e4', name: 'Lilavati Hospital', type: 'hospital', location: { lat: 19.0509, lng: 72.8289 }, address: 'A-791, Bandra Reclamation, Mumbai', phone: '022-26568000', distance: 1.8 },
  { _id: 'e5', name: 'Byculla Fire Station', type: 'fire', location: { lat: 18.9785, lng: 72.8330 }, address: 'Dr Babasaheb Ambedkar Rd, Byculla, Mumbai', phone: '022-23086181', distance: 1.2 },
  { _id: 'e6', name: 'Dadar Fire Station', type: 'fire', location: { lat: 19.0178, lng: 72.8440 }, address: 'Senapati Bapat Marg, Dadar, Mumbai', phone: '022-24321958', distance: 3.0 },
];

const mockNotifications: Notification[] = [
  { _id: 'n1', type: 'sos', title: 'SOS Alert Nearby', message: 'An emergency alert was triggered near Gateway of India.', read: false, createdAt: new Date(Date.now() - 60000).toISOString() },
  { _id: 'n2', type: 'crime', title: 'Crime Report Update', message: 'Your report #c1 has been approved by admin.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'n3', type: 'alert', title: 'Safety Advisory', message: 'Increased police presence in Bandra area tonight.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: 'n4', type: 'system', title: 'Welcome to MySafeCity', message: 'Your account has been created. Stay safe!', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const mockHeatmapPoints: HeatmapPoint[] = [
  { lat: 19.0760, lng: 72.8777, intensity: 0.9, type: 'theft' },
  { lat: 19.0990, lng: 72.8638, intensity: 0.7, type: 'assault' },
  { lat: 18.9352, lng: 72.8274, intensity: 0.5, type: 'theft' },
  { lat: 19.1197, lng: 72.9051, intensity: 0.3, type: 'vandalism' },
  { lat: 19.0948, lng: 72.8267, intensity: 0.8, type: 'assault' },
  { lat: 19.0700, lng: 72.8334, intensity: 0.9, type: 'robbery' },
  { lat: 19.0540, lng: 72.8402, intensity: 0.6, type: 'fraud' },
  { lat: 18.9400, lng: 72.8356, intensity: 0.4, type: 'harassment' },
  { lat: 19.0003, lng: 72.8416, intensity: 0.7, type: 'theft' },
  { lat: 19.0509, lng: 72.8289, intensity: 0.5, type: 'vandalism' },
  { lat: 18.9785, lng: 72.8330, intensity: 0.8, type: 'robbery' },
  { lat: 19.0178, lng: 72.8440, intensity: 0.6, type: 'assault' },
];

const mockDashboardStats: DashboardStats = {
  totalReports: 247,
  activeAlerts: 3,
  resolvedCases: 189,
  pendingReports: 12,
  reportsByType: [
    { type: 'Theft', count: 78 },
    { type: 'Assault', count: 45 },
    { type: 'Vandalism', count: 38 },
    { type: 'Robbery', count: 32 },
    { type: 'Fraud', count: 28 },
    { type: 'Harassment', count: 18 },
    { type: 'Other', count: 8 },
  ],
  reportsByMonth: [
    { month: 'Jul', count: 28 },
    { month: 'Aug', count: 35 },
    { month: 'Sep', count: 42 },
    { month: 'Oct', count: 38 },
    { month: 'Nov', count: 51 },
    { month: 'Dec', count: 53 },
  ],
  severityDistribution: [
    { severity: 'Low', count: 89 },
    { severity: 'Medium', count: 102 },
    { severity: 'High', count: 56 },
  ],
};

// Simulated API service
export const api = {
  // Auth
  login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
    await delay(500);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return { user, token: 'mock-jwt-token-' + user._id };
  },

  register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<{ user: User; token: string }> => {
    await delay(500);
    const newUser: User = {
      _id: String(Date.now()),
      name: data.name,
      email: data.email,
      role: 'citizen',
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };
    return { user: newUser, token: 'mock-jwt-token-' + newUser._id };
  },

  // SOS
  triggerSOS: async (location: { lat: number; lng: number }): Promise<SOSAlert> => {
    await delay(300);
    const alert: SOSAlert = {
      _id: 'sos-' + Date.now(),
      userId: '1',
      userName: 'Current User',
      location: { ...location, address: 'Current Location' },
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    return alert;
  },

  getSOSAlerts: async (): Promise<SOSAlert[]> => {
    await delay(300);
    return mockSOSAlerts;
  },

  updateSOSStatus: async (id: string, status: SOSAlert['status']): Promise<SOSAlert> => {
    await delay(300);
    const alert = mockSOSAlerts.find(a => a._id === id);
    if (!alert) throw new Error('Alert not found');
    return { ...alert, status };
  },

  // Crime Reports
  getCrimeReports: async (): Promise<CrimeReport[]> => {
    await delay(300);
    return mockCrimeReports;
  },

  submitCrimeReport: async (data: Partial<CrimeReport>): Promise<CrimeReport> => {
    await delay(500);
    const report: CrimeReport = {
      _id: 'cr-' + Date.now(),
      userId: '1',
      userName: 'Current User',
      type: data.type || 'other',
      title: data.title || '',
      description: data.description || '',
      location: data.location || { lat: CENTER.lat, lng: CENTER.lng },
      status: 'pending',
      severity: data.severity || 'medium',
      createdAt: new Date().toISOString(),
    };
    return report;
  },

  updateReportStatus: async (id: string, status: CrimeReport['status']): Promise<CrimeReport> => {
    await delay(300);
    const report = mockCrimeReports.find(r => r._id === id);
    if (!report) throw new Error('Report not found');
    return { ...report, status };
  },

  // Heatmap
  getHeatmapData: async (): Promise<HeatmapPoint[]> => {
    await delay(200);
    return mockHeatmapPoints;
  },

  // Emergency Services
  getEmergencyServices: async (): Promise<EmergencyService[]> => {
    await delay(300);
    return mockEmergencyServices;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(200);
    return mockNotifications;
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(300);
    return mockDashboardStats;
  },
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
