import { User, SOSAlert, CrimeReport, EmergencyService, Notification, DashboardStats, HeatmapPoint } from '@/types';

// Mock users
const users: User[] = [
  { _id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'citizen', phone: '+91-9412345678', createdAt: '2024-01-15' },
  { _id: '2', name: 'Admin User', email: 'admin@mysafecity.com', role: 'admin', phone: '+91-9410000001', createdAt: '2024-01-01' },
];

// Center point: Dehradun, Uttarakhand
const CENTER = { lat: 30.3165, lng: 78.0322 };

const mockSOSAlerts: SOSAlert[] = [
  { _id: 's1', userId: '1', userName: 'Rahul Sharma', location: { lat: 30.3165, lng: 78.0322, address: 'Clock Tower, Dehradun' }, status: 'active', createdAt: new Date(Date.now() - 120000).toISOString() },
  { _id: 's2', userId: '3', userName: 'Priya Patel', location: { lat: 30.3255, lng: 78.0438, address: 'Rajpur Road, Dehradun' }, status: 'responding', createdAt: new Date(Date.now() - 600000).toISOString() },
  { _id: 's3', userId: '4', userName: 'Amit Kumar', location: { lat: 30.3398, lng: 78.0644, address: 'ISBT Dehradun' }, status: 'resolved', createdAt: new Date(Date.now() - 3600000).toISOString(), resolvedAt: new Date(Date.now() - 1800000).toISOString() },
];

const crimeTypes: CrimeReport['type'][] = ['theft', 'assault', 'vandalism', 'robbery', 'fraud', 'harassment', 'other'];

const mockCrimeReports: CrimeReport[] = [
  { _id: 'c1', userId: '1', userName: 'Rahul Sharma', type: 'theft', title: 'Mobile snatched near Clock Tower', description: 'Someone snatched my phone while walking near Clock Tower market area.', location: { lat: 30.3165, lng: 78.0322, address: 'Clock Tower, Dehradun' }, status: 'approved', severity: 'medium', createdAt: '2024-12-10T14:30:00Z' },
  { _id: 'c2', userId: '3', userName: 'Priya Patel', type: 'vandalism', title: 'Car window smashed at Paltan Bazaar', description: 'Parked car had window smashed overnight in Paltan Bazaar parking.', location: { lat: 30.3220, lng: 78.0390, address: 'Paltan Bazaar, Dehradun' }, status: 'pending', severity: 'low', createdAt: '2024-12-12T08:00:00Z' },
  { _id: 'c3', userId: '4', userName: 'Amit Kumar', type: 'assault', title: 'Mugging near Sahastradhara Road', description: 'Was threatened at knifepoint near Sahastradhara Road entrance.', location: { lat: 30.3800, lng: 78.1200, address: 'Sahastradhara Road, Dehradun' }, status: 'investigating', severity: 'high', createdAt: '2024-12-14T22:15:00Z' },
  { _id: 'c4', userId: '5', userName: 'Sneha Reddy', type: 'robbery', title: 'Shop robbery at Rajpur Road', description: 'Armed robbery at jewellery shop on Rajpur Road.', location: { lat: 30.3255, lng: 78.0438, address: 'Rajpur Road, Dehradun' }, status: 'approved', severity: 'high', createdAt: '2024-12-15T03:45:00Z' },
  { _id: 'c5', userId: '6', userName: 'Deepak Verma', type: 'fraud', title: 'ATM skimming device found at Ballupur', description: 'Found a skimming device on ATM machine near Ballupur Chowk.', location: { lat: 30.3350, lng: 78.0500, address: 'Ballupur Chowk, Dehradun' }, status: 'approved', severity: 'medium', createdAt: '2024-12-16T11:20:00Z' },
  { _id: 'c6', userId: '7', userName: 'Anjali Desai', type: 'harassment', title: 'Street harassment near Dehradun Railway Station', description: 'Verbal harassment near the railway station exit.', location: { lat: 30.3183, lng: 78.0250, address: 'Dehradun Railway Station' }, status: 'pending', severity: 'medium', createdAt: '2024-12-17T19:30:00Z' },
];

const mockEmergencyServices: EmergencyService[] = [
  { _id: 'e1', name: 'Kotwali Police Station', type: 'police', location: { lat: 30.3190, lng: 78.0340 }, address: 'Clock Tower, Rajpur Road, Dehradun', phone: '0135-2653100', distance: 0.5 },
  { _id: 'e2', name: 'Race Course Police Station', type: 'police', location: { lat: 30.3100, lng: 78.0280 }, address: 'Race Course, Dehradun', phone: '0135-2624500', distance: 1.2 },
  { _id: 'e3', name: 'Doon Hospital', type: 'hospital', location: { lat: 30.3170, lng: 78.0310 }, address: 'EC Road, Dehradun', phone: '0135-2650610', distance: 0.8 },
  { _id: 'e4', name: 'Max Super Speciality Hospital', type: 'hospital', location: { lat: 30.3400, lng: 78.0650 }, address: 'Mussoorie Diversion Road, Dehradun', phone: '0135-7116800', distance: 2.5 },
  { _id: 'e5', name: 'Dehradun Fire Station', type: 'fire', location: { lat: 30.3200, lng: 78.0350 }, address: 'Chakrata Road, Dehradun', phone: '0135-2653534', distance: 0.6 },
  { _id: 'e6', name: 'Prem Nagar Fire Station', type: 'fire', location: { lat: 30.3500, lng: 78.0100 }, address: 'Prem Nagar, Dehradun', phone: '0135-2770101', distance: 3.5 },
];

const mockNotifications: Notification[] = [
  { _id: 'n1', type: 'sos', title: 'SOS Alert Nearby', message: 'An emergency alert was triggered near Clock Tower, Dehradun.', read: false, createdAt: new Date(Date.now() - 60000).toISOString() },
  { _id: 'n2', type: 'crime', title: 'Crime Report Update', message: 'Your report #c1 has been approved by admin.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'n3', type: 'alert', title: 'Safety Advisory', message: 'Increased police presence in Rajpur Road area tonight.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: 'n4', type: 'system', title: 'Welcome to MySafeCity', message: 'Your account has been created. Stay safe!', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const mockHeatmapPoints: HeatmapPoint[] = [
  { lat: 30.3165, lng: 78.0322, intensity: 0.9, type: 'theft' },
  { lat: 30.3255, lng: 78.0438, intensity: 0.7, type: 'assault' },
  { lat: 30.3220, lng: 78.0390, intensity: 0.5, type: 'vandalism' },
  { lat: 30.3800, lng: 78.1200, intensity: 0.3, type: 'assault' },
  { lat: 30.3350, lng: 78.0500, intensity: 0.8, type: 'fraud' },
  { lat: 30.3183, lng: 78.0250, intensity: 0.9, type: 'robbery' },
  { lat: 30.3400, lng: 78.0650, intensity: 0.6, type: 'harassment' },
  { lat: 30.3100, lng: 78.0280, intensity: 0.7, type: 'theft' },
  { lat: 30.3500, lng: 78.0100, intensity: 0.5, type: 'vandalism' },
  { lat: 30.3300, lng: 78.0400, intensity: 0.8, type: 'robbery' },
  { lat: 30.2900, lng: 78.0200, intensity: 0.4, type: 'theft' },
  { lat: 30.3600, lng: 78.0800, intensity: 0.6, type: 'assault' },
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
