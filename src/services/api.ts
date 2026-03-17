import { User, SOSAlert, CrimeReport, EmergencyService, Notification, DashboardStats, HeatmapPoint } from '@/types';

// Mock users
const users: User[] = [
  { _id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'citizen', phone: '+91-9412345678', createdAt: '2024-01-15' },
  { _id: '2', name: 'Admin User', email: 'admin@mysafecity.com', role: 'admin', phone: '+91-9410000001', createdAt: '2024-01-01' },
];

const CENTER = { lat: 30.3165, lng: 78.0322 };

// ── Shared mutable stores ──────────────────────────────────
// These arrays are mutated in-place so every part of the app
// (citizen pages AND admin dashboard) sees the same data.

const sosAlerts: SOSAlert[] = [
  { _id: 's1', userId: '1', userName: 'Rahul Sharma', location: { lat: 30.3165, lng: 78.0322, address: 'Clock Tower, Dehradun' }, status: 'active', createdAt: new Date(Date.now() - 120000).toISOString() },
  { _id: 's2', userId: '3', userName: 'Priya Patel', location: { lat: 30.3255, lng: 78.0438, address: 'Rajpur Road, Dehradun' }, status: 'responding', createdAt: new Date(Date.now() - 600000).toISOString() },
  { _id: 's3', userId: '4', userName: 'Amit Kumar', location: { lat: 30.3398, lng: 78.0644, address: 'ISBT Dehradun' }, status: 'resolved', createdAt: new Date(Date.now() - 3600000).toISOString(), resolvedAt: new Date(Date.now() - 1800000).toISOString() },
];

const crimeReports: CrimeReport[] = [
  { _id: 'c1', userId: '1', userName: 'Rahul Sharma', type: 'theft', title: 'Mobile snatched near Clock Tower', description: 'Someone snatched my phone while walking near Clock Tower market area.', location: { lat: 30.3165, lng: 78.0322, address: 'Clock Tower, Dehradun' }, status: 'approved', severity: 'medium', createdAt: '2024-12-10T14:30:00Z' },
  { _id: 'c2', userId: '3', userName: 'Priya Patel', type: 'vandalism', title: 'Car window smashed at Paltan Bazaar', description: 'Parked car had window smashed overnight in Paltan Bazaar parking.', location: { lat: 30.3220, lng: 78.0390, address: 'Paltan Bazaar, Dehradun' }, status: 'pending', severity: 'low', createdAt: '2024-12-12T08:00:00Z' },
  { _id: 'c3', userId: '4', userName: 'Amit Kumar', type: 'assault', title: 'Mugging near Sahastradhara Road', description: 'Was threatened at knifepoint near Sahastradhara Road entrance.', location: { lat: 30.3800, lng: 78.1200, address: 'Sahastradhara Road, Dehradun' }, status: 'investigating', severity: 'high', createdAt: '2024-12-14T22:15:00Z' },
  { _id: 'c4', userId: '5', userName: 'Sneha Reddy', type: 'robbery', title: 'Shop robbery at Rajpur Road', description: 'Armed robbery at jewellery shop on Rajpur Road.', location: { lat: 30.3255, lng: 78.0438, address: 'Rajpur Road, Dehradun' }, status: 'approved', severity: 'high', createdAt: '2024-12-15T03:45:00Z' },
  { _id: 'c5', userId: '6', userName: 'Deepak Verma', type: 'fraud', title: 'ATM skimming device found at Ballupur', description: 'Found a skimming device on ATM machine near Ballupur Chowk.', location: { lat: 30.3350, lng: 78.0500, address: 'Ballupur Chowk, Dehradun' }, status: 'approved', severity: 'medium', createdAt: '2024-12-16T11:20:00Z' },
  { _id: 'c6', userId: '7', userName: 'Anjali Desai', type: 'harassment', title: 'Street harassment near Dehradun Railway Station', description: 'Verbal harassment near the railway station exit.', location: { lat: 30.3183, lng: 78.0250, address: 'Dehradun Railway Station' }, status: 'pending', severity: 'medium', createdAt: '2024-12-17T19:30:00Z' },
];

const notifications: Notification[] = [
  { _id: 'n1', type: 'sos', title: 'SOS Alert Nearby', message: 'An emergency alert was triggered near Clock Tower, Dehradun.', read: false, createdAt: new Date(Date.now() - 60000).toISOString() },
  { _id: 'n2', type: 'crime', title: 'Crime Report Update', message: 'Your report #c1 has been approved by admin.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'n3', type: 'alert', title: 'Safety Advisory', message: 'Increased police presence in Rajpur Road area tonight.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: 'n4', type: 'system', title: 'Welcome to MySafeCity', message: 'Your account has been created. Stay safe!', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const heatmapPoints: HeatmapPoint[] = [
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

const mockEmergencyServices: EmergencyService[] = [
  { _id: 'e1', name: 'Kotwali Police Station', type: 'police', location: { lat: 30.3190, lng: 78.0340 }, address: 'Clock Tower, Rajpur Road, Dehradun', phone: '0135-2653100', distance: 0.5 },
  { _id: 'e2', name: 'Race Course Police Station', type: 'police', location: { lat: 30.3100, lng: 78.0280 }, address: 'Race Course, Dehradun', phone: '0135-2624500', distance: 1.2 },
  { _id: 'e3', name: 'Doon Hospital', type: 'hospital', location: { lat: 30.3170, lng: 78.0310 }, address: 'EC Road, Dehradun', phone: '0135-2650610', distance: 0.8 },
  { _id: 'e4', name: 'Max Super Speciality Hospital', type: 'hospital', location: { lat: 30.3400, lng: 78.0650 }, address: 'Mussoorie Diversion Road, Dehradun', phone: '0135-7116800', distance: 2.5 },
  { _id: 'e5', name: 'Dehradun Fire Station', type: 'fire', location: { lat: 30.3200, lng: 78.0350 }, address: 'Chakrata Road, Dehradun', phone: '0135-2653534', distance: 0.6 },
  { _id: 'e6', name: 'Prem Nagar Fire Station', type: 'fire', location: { lat: 30.3500, lng: 78.0100 }, address: 'Prem Nagar, Dehradun', phone: '0135-2770101', distance: 3.5 },
];

// ── Helper: compute live dashboard stats from the shared stores ──
function computeDashboardStats(): DashboardStats {
  const totalReports = crimeReports.length;
  const activeAlerts = sosAlerts.filter(a => a.status === 'active').length;
  const resolvedCases = crimeReports.filter(r => r.status === 'approved').length + sosAlerts.filter(a => a.status === 'resolved').length;
  const pendingReports = crimeReports.filter(r => r.status === 'pending').length;

  // Count by type
  const typeCounts: Record<string, number> = {};
  crimeReports.forEach(r => {
    const label = r.type.charAt(0).toUpperCase() + r.type.slice(1);
    typeCounts[label] = (typeCounts[label] || 0) + 1;
  });
  const reportsByType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

  // Count by month
  const monthCounts: Record<string, number> = {};
  crimeReports.forEach(r => {
    const d = new Date(r.createdAt);
    const month = d.toLocaleString('en', { month: 'short' });
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  const reportsByMonth = Object.entries(monthCounts).map(([month, count]) => ({ month, count }));

  // Severity
  const sevCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
  crimeReports.forEach(r => {
    const label = r.severity ? r.severity.charAt(0).toUpperCase() + r.severity.slice(1) : 'Medium';
    sevCounts[label] = (sevCounts[label] || 0) + 1;
  });
  const severityDistribution = Object.entries(sevCounts).map(([severity, count]) => ({ severity, count }));

  return { totalReports, activeAlerts, resolvedCases, pendingReports, reportsByType, reportsByMonth, severityDistribution };
}

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
      location: { ...location, address: 'Current Location, Dehradun' },
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    sosAlerts.unshift(alert); // ← persist to shared store
    // Also add a notification
    notifications.unshift({
      _id: 'n-' + Date.now(),
      type: 'sos',
      title: 'New SOS Alert',
      message: `SOS triggered at ${alert.location.address}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return alert;
  },

  getSOSAlerts: async (): Promise<SOSAlert[]> => {
    await delay(300);
    return [...sosAlerts]; // return copy of live array
  },

  updateSOSStatus: async (id: string, status: SOSAlert['status']): Promise<SOSAlert> => {
    await delay(300);
    const idx = sosAlerts.findIndex(a => a._id === id);
    if (idx === -1) throw new Error('Alert not found');
    sosAlerts[idx] = { ...sosAlerts[idx], status, ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}) };
    return sosAlerts[idx];
  },

  // Crime Reports
  getCrimeReports: async (): Promise<CrimeReport[]> => {
    await delay(300);
    return [...crimeReports]; // return copy of live array
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
    crimeReports.unshift(report); // ← persist to shared store
    // Add heatmap point
    heatmapPoints.push({
      lat: report.location.lat ?? CENTER.lat,
      lng: report.location.lng ?? CENTER.lng,
      intensity: report.severity === 'high' ? 0.9 : report.severity === 'medium' ? 0.6 : 0.3,
      type: report.type,
    });
    // Add notification
    notifications.unshift({
      _id: 'n-' + Date.now(),
      type: 'crime',
      title: 'New Crime Report',
      message: `New ${report.type} report: ${report.title}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return report;
  },

  updateReportStatus: async (id: string, status: CrimeReport['status']): Promise<CrimeReport> => {
    await delay(300);
    const idx = crimeReports.findIndex(r => r._id === id);
    if (idx === -1) throw new Error('Report not found');
    crimeReports[idx] = { ...crimeReports[idx], status };
    return crimeReports[idx];
  },

  // Heatmap
  getHeatmapData: async (): Promise<HeatmapPoint[]> => {
    await delay(200);
    return [...heatmapPoints];
  },

  // Emergency Services
  getEmergencyServices: async (): Promise<EmergencyService[]> => {
    await delay(300);
    return mockEmergencyServices;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(200);
    return [...notifications];
  },

  // Dashboard — now computed live from shared stores
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(300);
    return computeDashboardStats();
  },
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
