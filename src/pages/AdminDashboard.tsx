import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, AlertTriangle, FileText, TrendingUp, CheckCircle, Clock, XCircle, Eye, Shield, Activity, ArrowUpRight, ArrowDownRight, MapPin, Zap, User, Calendar, Tag, Plus, Trash2, Building2, Phone } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { SOSAlert, CrimeReport, DashboardStats, EmergencyService } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const PIE_COLORS = ['hsl(145, 65%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(0, 90%, 50%)'];
const CHART_BLUE = 'hsl(220, 70%, 55%)';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0, 0, 0.2, 1] as const } }),
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-2xl border border-border/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const SERVICE_TYPES = ['police', 'hospital', 'fire'] as const;
const SERVICE_ICONS: Record<string, string> = { police: '🚔', hospital: '🏥', fire: '🚒' };

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [tab, setTab] = useState<'overview' | 'alerts' | 'reports' | 'services'>('overview');
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null);

  // Service form state
  const [newService, setNewService] = useState({ name: '', type: 'police' as EmergencyService['type'], address: '', phone: '', lat: '', lng: '' });

  const fetchData = () => {
    api.getDashboardStats().then(setStats);
    api.getSOSAlerts().then(setAlerts);
    api.getCrimeReports().then(setReports);
    api.getEmergencyServices().then(setServices);
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, navigate]);

  const handleReportAction = (id: string, action: CrimeReport['status']) => {
    api.updateReportStatus(id, action).then(() => {
      fetchData();
      toast.success(`Report ${action}`);
    });
  };

  const handleAlertAction = (id: string, status: SOSAlert['status']) => {
    api.updateSOSStatus(id, status).then(() => {
      fetchData();
      toast.success(`Alert ${status}`);
    });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.address || !newService.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    await api.addEmergencyService({
      name: newService.name,
      type: newService.type,
      address: newService.address,
      phone: newService.phone,
      location: { lat: parseFloat(newService.lat) || 30.3165, lng: parseFloat(newService.lng) || 78.0322 },
    });
    setNewService({ name: '', type: 'police', address: '', phone: '', lat: '', lng: '' });
    fetchData();
    toast.success('Emergency service added');
  };

  const handleDeleteService = async (id: string) => {
    await api.deleteEmergencyService(id);
    fetchData();
    toast.success('Service removed');
  };

  if (!stats) return (
    <div className="min-h-screen pt-[var(--nav-height)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Reports', value: stats.totalReports, icon: FileText, color: 'text-primary', bgGrad: 'from-primary/10 to-primary/5', trend: '+12%', up: true },
    { label: 'Active Alerts', value: stats.activeAlerts, icon: AlertTriangle, color: 'text-emergency', bgGrad: 'from-emergency/10 to-emergency/5', trend: '-8%', up: false },
    { label: 'Resolved Cases', value: stats.resolvedCases, icon: CheckCircle, color: 'text-success', bgGrad: 'from-success/10 to-success/5', trend: '+23%', up: true },
    { label: 'Pending Review', value: stats.pendingReports, icon: Clock, color: 'text-warning', bgGrad: 'from-warning/10 to-warning/5', trend: '-5%', up: false },
  ];

  const resolutionRate = stats.totalReports > 0 ? Math.round((stats.resolvedCases / stats.totalReports) * 100) : 0;

  return (
    <div className="min-h-screen pt-[var(--nav-height)] py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <LayoutDashboard className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Command Center</h1>
                <p className="text-sm text-muted-foreground">Real-time city safety monitoring · Dehradun</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">System Online</span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className="stat-card group cursor-default">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.bgGrad} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                    <div className={`p-2 rounded-lg bg-card border border-border/50 ${s.color} group-hover:scale-110 transition-transform duration-300`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold mb-1">{s.value.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    {s.up ? <ArrowUpRight className="h-3.5 w-3.5 text-success" /> : <ArrowDownRight className="h-3.5 w-3.5 text-emergency" />}
                    <span className={`text-xs font-semibold ${s.up ? 'text-success' : 'text-emergency'}`}>{s.trend}</span>
                    <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-secondary/60 backdrop-blur-sm rounded-xl p-1 w-fit border border-border/30">
            {(['overview', 'alerts', 'reports', 'services'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  tab === t 
                    ? 'bg-card shadow-md text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}>
                {t}
                {t === 'alerts' && alerts.filter(a => a.status === 'active').length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-emergency text-emergency-foreground text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                    {alerts.filter(a => a.status === 'active').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-card-hover rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-base">Reports by Type</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Crime category breakdown</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10"><Activity className="h-4 w-4 text-primary" /></div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.reportsByType} barCategoryGap="20%">
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={1} />
                        <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="type" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 45%)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 10%, 45%)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Reports" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Pie */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="glass-card-hover rounded-2xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base">Severity</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Distribution breakdown</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emergency/10"><Zap className="h-4 w-4 text-emergency" /></div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={stats.severityDistribution} dataKey="count" nameKey="severity" cx="50%" cy="50%"
                        innerRadius={55} outerRadius={85} paddingAngle={4} strokeWidth={0}>
                        {stats.severityDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {stats.severityDistribution.map((s, i) => (
                    <div key={s.severity} className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-xs text-muted-foreground">{s.severity}</span>
                      <span className="text-xs font-bold">{s.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Area Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card-hover rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-base">Monthly Trend</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Report volume over time</p>
                  </div>
                  <div className="p-2 rounded-lg bg-success/10"><TrendingUp className="h-4 w-4 text-success" /></div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={stats.reportsByMonth}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 45%)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 10%, 45%)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" name="Reports" stroke={CHART_BLUE} strokeWidth={3} fill="url(#areaGrad)" dot={{ r: 4, fill: CHART_BLUE, strokeWidth: 2, stroke: 'hsl(0, 0%, 100%)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Resolution Rate */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="glass-card-hover rounded-2xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base">Resolution Rate</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Case closure performance</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-4 w-4 text-primary" /></div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-36 h-36" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(220, 15%, 88%)" strokeWidth="8" strokeOpacity="0.3" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke={CHART_BLUE} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${resolutionRate * 2.64} ${264 - resolutionRate * 2.64}`}
                        strokeDashoffset="66" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold">{resolutionRate}%</span>
                      <span className="text-[10px] text-muted-foreground">resolved</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg font-extrabold">{stats.totalReports}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg font-extrabold text-success">{stats.resolvedCases}</p>
                    <p className="text-[10px] text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card-hover rounded-2xl p-6 lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base">Recent Activity</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest reports and alerts</p>
                  </div>
                  <div className="p-2 rounded-lg bg-warning/10"><Eye className="h-4 w-4 text-warning" /></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {reports.slice(0, 3).map((r, i) => (
                    <motion.div key={r._id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                      className="p-4 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/50 hover:border-primary/20 transition-all duration-200 cursor-default group">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${r.severity === 'high' ? 'bg-emergency/10' : r.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10'} group-hover:scale-110 transition-transform`}>
                          <FileText className={`h-4 w-4 ${r.severity === 'high' ? 'text-emergency' : r.severity === 'medium' ? 'text-warning' : 'text-success'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.type} · {r.location.address}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                              r.status === 'approved' ? 'bg-success/10 text-success' :
                              r.status === 'pending' ? 'bg-warning/10 text-warning' :
                              'bg-primary/10 text-primary'
                            }`}>{r.status}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {tab === 'alerts' && (
            <div className="space-y-3">
              {alerts.length === 0 && <p className="text-center text-muted-foreground py-10">No alerts</p>}
              {alerts.map((a, i) => (
                <motion.div key={a._id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  className="glass-card-hover rounded-xl p-4 flex items-center gap-4 group">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    a.status === 'active' ? 'bg-emergency/10' : a.status === 'responding' ? 'bg-warning/10' : 'bg-success/10'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${a.status === 'active' ? 'text-emergency' : a.status === 'responding' ? 'text-warning' : 'text-success'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{a.userName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">{a.location.address} · {new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                    a.status === 'active' ? 'bg-emergency/10 text-emergency border border-emergency/20' : 
                    a.status === 'responding' ? 'bg-warning/10 text-warning border border-warning/20' : 
                    'bg-success/10 text-success border border-success/20'
                  }`}>{a.status}</span>
                  {a.status === 'active' && (
                    <button onClick={() => handleAlertAction(a._id, 'responding')} 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                      Respond
                    </button>
                  )}
                  {a.status === 'responding' && (
                    <button onClick={() => handleAlertAction(a._id, 'resolved')} 
                      className="px-4 py-2 bg-success text-success-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-success/20 active:scale-95">
                      Resolve
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 && <p className="text-center text-muted-foreground py-10">No reports</p>}
              {reports.map((r, i) => (
                <motion.div key={r._id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  className="glass-card-hover rounded-xl p-4 flex items-center gap-4 group cursor-pointer"
                  onClick={() => setSelectedReport(r)}>
                  <div className={`p-2.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    r.severity === 'high' ? 'bg-emergency/10' : r.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10'
                  }`}>
                    <FileText className={`h-5 w-5 ${r.severity === 'high' ? 'text-emergency' : r.severity === 'medium' ? 'text-warning' : 'text-success'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{r.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">{r.userName} · {r.type} · {r.location.address}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                    r.status === 'approved' ? 'bg-success/10 text-success border border-success/20' :
                    r.status === 'rejected' ? 'bg-emergency/10 text-emergency border border-emergency/20' :
                    r.status === 'investigating' ? 'bg-primary/10 text-primary border border-primary/20' :
                    'bg-warning/10 text-warning border border-warning/20'
                  }`}>{r.status}</span>
                  {r.status === 'pending' && (
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleReportAction(r._id, 'approved')} 
                        className="p-2 rounded-lg bg-success/10 hover:bg-success/20 border border-success/20 transition-all active:scale-90">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </button>
                      <button onClick={() => handleReportAction(r._id, 'rejected')} 
                        className="p-2 rounded-lg bg-emergency/10 hover:bg-emergency/20 border border-emergency/20 transition-all active:scale-90">
                        <XCircle className="h-4 w-4 text-emergency" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Report Detail Dialog */}
              <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <DialogContent className="max-w-lg">
                  {selectedReport && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {selectedReport.title}
                        </DialogTitle>
                        <DialogDescription>Crime Report Details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-secondary/50">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Type</p>
                            <p className="text-sm font-semibold capitalize flex items-center gap-1.5">
                              <Tag className="h-3.5 w-3.5 text-primary" />{selectedReport.type}
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-secondary/50">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Severity</p>
                            <p className={`text-sm font-semibold capitalize ${
                              selectedReport.severity === 'high' ? 'text-emergency' : selectedReport.severity === 'medium' ? 'text-warning' : 'text-success'
                            }`}>{selectedReport.severity}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-secondary/50">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                            <p className="text-sm font-semibold capitalize">{selectedReport.status}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-secondary/50">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                            <p className="text-sm font-semibold flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              {new Date(selectedReport.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reported By</p>
                          <p className="text-sm font-semibold flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-primary" />{selectedReport.userName}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                          <p className="text-sm font-semibold flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-emergency" />{selectedReport.location.address || 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Lat: {selectedReport.location.lat.toFixed(4)}, Lng: {selectedReport.location.lng.toFixed(4)}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                          <p className="text-sm leading-relaxed">{selectedReport.description}</p>
                        </div>
                        {selectedReport.status === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <button onClick={() => { handleReportAction(selectedReport._id, 'approved'); setSelectedReport(null); }}
                              className="flex-1 py-2.5 rounded-xl bg-success text-success-foreground font-semibold text-sm hover:opacity-90 transition-all active:scale-95">
                              Approve
                            </button>
                            <button onClick={() => { handleReportAction(selectedReport._id, 'investigating'); setSelectedReport(null); }}
                              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all active:scale-95">
                              Investigate
                            </button>
                            <button onClick={() => { handleReportAction(selectedReport._id, 'rejected'); setSelectedReport(null); }}
                              className="flex-1 py-2.5 rounded-xl bg-emergency text-emergency-foreground font-semibold text-sm hover:opacity-90 transition-all active:scale-95">
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {tab === 'services' && (
            <div className="space-y-6">
              {/* Add Service Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base">Add Emergency Service</h3>
                </div>
                <form onSubmit={handleAddService} className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Name *</label>
                    <input value={newService.name} onChange={e => setNewService(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g. Central Police Station" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Type *</label>
                    <select value={newService.type} onChange={e => setNewService(p => ({ ...p, type: e.target.value as EmergencyService['type'] }))}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {SERVICE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Address *</label>
                    <input value={newService.address} onChange={e => setNewService(p => ({ ...p, address: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Full address" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Phone *</label>
                    <input value={newService.phone} onChange={e => setNewService(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="0135-XXXXXXX" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Latitude</label>
                      <input value={newService.lat} onChange={e => setNewService(p => ({ ...p, lat: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="30.3165" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Longitude</label>
                      <input value={newService.lng} onChange={e => setNewService(p => ({ ...p, lng: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="78.0322" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                      Add Service
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Services List */}
              <div className="space-y-3">
                {services.map((s, i) => (
                  <motion.div key={s._id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                    className="glass-card-hover rounded-xl p-4 flex items-center gap-4 group">
                    <div className="text-2xl">{SERVICE_ICONS[s.type] || '📍'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{s.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{s.address}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize bg-primary/10 text-primary border border-primary/20">{s.type}</span>
                    <button onClick={() => handleDeleteService(s._id)}
                      className="p-2 rounded-lg hover:bg-emergency/10 transition-all text-muted-foreground hover:text-emergency active:scale-90">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
