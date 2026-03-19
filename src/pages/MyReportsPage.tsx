import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, Clock, CheckCircle, XCircle, Search, Image, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { CrimeReport } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  pending: { color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  approved: { color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  rejected: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
  investigating: { color: 'bg-primary/10 text-primary border-primary/20', icon: Search },
};

export default function MyReportsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [selected, setSelected] = useState<CrimeReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const load = () => {
      api.getUserReports(user?._id || '1').then(r => { setReports(r); setLoading(false); });
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-[var(--nav-height)] py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">My Reports</h1>
              <p className="text-muted-foreground">Track status updates of your submitted reports</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-medium">No reports yet</p>
              <p className="text-sm text-muted-foreground mb-4">Submit a crime report to see it here</p>
              <button onClick={() => navigate('/report')} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium">
                Report a Crime
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r, i) => {
                const sc = statusConfig[r.status] || statusConfig.pending;
                const StatusIcon = sc.icon;
                return (
                  <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(r)}
                    className="glass-card-hover rounded-xl p-4 flex items-center gap-4 cursor-pointer group">
                    <div className={`p-2.5 rounded-xl shrink-0 ${r.severity === 'high' ? 'bg-destructive/10' : r.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10'}`}>
                      <FileText className={`h-5 w-5 ${r.severity === 'high' ? 'text-destructive' : r.severity === 'medium' ? 'text-warning' : 'text-success'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{r.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="capitalize">{r.type}</span>
                        <span>·</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                        {r.mediaNames && r.mediaNames.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1"><Image className="h-3 w-3" />{r.mediaNames.length} file(s)</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border ${sc.color}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />{r.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription>Report Details & Status Updates</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Type</p>
                      <p className="text-sm font-semibold capitalize">{selected.type}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Severity</p>
                      <p className={`text-sm font-semibold capitalize ${selected.severity === 'high' ? 'text-destructive' : selected.severity === 'medium' ? 'text-warning' : 'text-success'}`}>{selected.severity}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current Status</p>
                      <p className="text-sm font-semibold capitalize">{selected.status}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Submitted</p>
                      <p className="text-sm font-semibold">{new Date(selected.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Submitted From</p>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />{selected.location.address || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">Lat: {selected.location.lat.toFixed(4)}, Lng: {selected.location.lng.toFixed(4)}</p>
                  </div>

                  {selected.crimeLocation && (
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Crime Location</p>
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-destructive" />{selected.crimeLocation.address || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">Lat: {selected.crimeLocation.lat.toFixed(4)}, Lng: {selected.crimeLocation.lng.toFixed(4)}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm leading-relaxed">{selected.description}</p>
                  </div>

                  {selected.mediaNames && selected.mediaNames.length > 0 && (
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Evidence Files</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selected.mediaNames.map((name, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                            <Image className="h-3 w-3" />{name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Timeline */}
                  {selected.statusUpdates && selected.statusUpdates.length > 0 && (
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Status Timeline</p>
                      <div className="space-y-3">
                        {selected.statusUpdates.map((u, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`h-3 w-3 rounded-full shrink-0 ${
                                u.status === 'approved' ? 'bg-success' :
                                u.status === 'rejected' ? 'bg-destructive' :
                                u.status === 'investigating' ? 'bg-primary' : 'bg-warning'
                              }`} />
                              {i < selected.statusUpdates!.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
                            </div>
                            <div className="-mt-0.5">
                              <p className="text-sm font-semibold capitalize">{u.status}</p>
                              <p className="text-xs text-muted-foreground">{new Date(u.timestamp).toLocaleString()}</p>
                              {u.note && <p className="text-xs text-muted-foreground mt-0.5 italic">{u.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
