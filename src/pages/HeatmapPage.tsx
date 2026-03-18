import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';
import type { HeatmapPoint, CrimeReport } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const riskColors = {
  low: { fill: '#22c55e', stroke: '#16a34a', bg: 'bg-success/10', text: 'text-success' },
  medium: { fill: '#f59e0b', stroke: '#d97706', bg: 'bg-warning/10', text: 'text-warning' },
  high: { fill: '#ef4444', stroke: '#dc2626', bg: 'bg-emergency/10', text: 'text-emergency' },
};

function getRisk(intensity: number) {
  if (intensity >= 0.7) return 'high';
  if (intensity >= 0.4) return 'medium';
  return 'low';
}

function getColor(intensity: number) {
  return riskColors[getRisk(intensity)];
}

export default function HeatmapPage() {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    api.getHeatmapData().then(setPoints);
    api.getCrimeReports().then(setReports);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current).setView([30.3165, 78.0322], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    layerGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const filteredPoints = useMemo(() => {
    if (filter === 'all') return points;
    return points.filter(p => p.type === filter);
  }, [points, filter]);

  // Area stats
  const areaStats = useMemo(() => {
    const map = new Map<string, { incidents: number; highestRisk: string; types: Set<string> }>();
    filteredPoints.forEach(p => {
      const name = p.areaName || 'Unknown';
      const existing = map.get(name) || { incidents: 0, highestRisk: 'low', types: new Set<string>() };
      existing.incidents += (p.incidentCount || 1);
      existing.types.add(p.type);
      const risk = getRisk(p.intensity);
      if (risk === 'high' || (risk === 'medium' && existing.highestRisk === 'low')) {
        existing.highestRisk = risk;
      }
      map.set(name, existing);
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data, types: Array.from(data.types) }))
      .sort((a, b) => b.incidents - a.incidents);
  }, [filteredPoints]);

  // Update markers with rich tooltips
  useEffect(() => {
    if (!layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();

    filteredPoints.forEach(point => {
      const colors = getColor(point.intensity);
      const risk = getRisk(point.intensity);
      const areaName = point.areaName || 'Unknown Area';
      const incidents = point.incidentCount || 1;

      const tooltipContent = `
        <div style="min-width:180px;padding:4px 0;">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px;border-bottom:1px solid rgba(128,128,128,0.2);padding-bottom:6px;">${areaName}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="color:#888;font-size:12px;">Crime Type</span>
            <span style="font-weight:600;font-size:12px;text-transform:capitalize;">${point.type}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="color:#888;font-size:12px;">Risk Level</span>
            <span style="font-weight:700;font-size:12px;color:${colors.fill};text-transform:uppercase;">${risk}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="color:#888;font-size:12px;">Incidents</span>
            <span style="font-weight:600;font-size:12px;">${incidents}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#888;font-size:12px;">Intensity</span>
            <span style="font-weight:600;font-size:12px;">${(point.intensity * 100).toFixed(0)}%</span>
          </div>
        </div>
      `;

      L.circleMarker([point.lat, point.lng], {
        radius: point.intensity * 25 + 8,
        fillColor: colors.fill,
        color: colors.stroke,
        weight: 2,
        fillOpacity: 0.4,
      })
        .bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top',
          className: 'heatmap-tooltip',
          offset: [0, -10],
        })
        .addTo(layerGroupRef.current!);
    });

    reports.forEach(r => {
      const tooltipContent = `
        <div style="min-width:160px;padding:4px 0;">
          <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${r.title}</div>
          <div style="font-size:12px;color:#888;text-transform:capitalize;margin-bottom:2px;">${r.type} · ${r.severity} severity</div>
          <div style="font-size:11px;color:#aaa;">${r.location.address || ''}</div>
        </div>
      `;

      L.circleMarker([r.location.lat, r.location.lng], {
        radius: 6,
        fillColor: r.severity === 'high' ? '#ef4444' : r.severity === 'medium' ? '#f59e0b' : '#22c55e',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9,
      })
        .bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top',
          className: 'heatmap-tooltip',
          offset: [0, -8],
        })
        .addTo(layerGroupRef.current!);
    });
  }, [filteredPoints, reports]);

  const types = ['all', 'theft', 'assault', 'vandalism', 'robbery', 'fraud', 'harassment'];

  const totalIncidents = areaStats.reduce((sum, a) => sum + a.incidents, 0);
  const highRiskAreas = areaStats.filter(a => a.highestRisk === 'high').length;

  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <style>{`
        .heatmap-tooltip {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 12px !important;
          padding: 10px 14px !important;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3) !important;
          font-family: inherit !important;
          color: hsl(var(--foreground)) !important;
        }
        .heatmap-tooltip::before {
          border-top-color: hsl(var(--border)) !important;
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Crime Heatmap</h1>
              <p className="text-muted-foreground">Visualize crime hotspots across Dehradun</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><BarChart3 className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-extrabold">{totalIncidents}</p>
                <p className="text-xs text-muted-foreground">Total Incidents</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emergency/10"><AlertTriangle className="h-5 w-5 text-emergency" /></div>
              <div>
                <p className="text-2xl font-extrabold">{highRiskAreas}</p>
                <p className="text-xs text-muted-foreground">High Risk Zones</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
              <div>
                <p className="text-2xl font-extrabold">{areaStats.length}</p>
                <p className="text-xs text-muted-foreground">Monitored Areas</p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mb-4">
            {[
              { label: 'Low Risk', color: 'bg-success' },
              { label: 'Medium Risk', color: 'bg-warning' },
              { label: 'High Risk', color: 'bg-emergency' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 text-sm">
                <div className={`h-3 w-3 rounded-full ${l.color}`} />
                <span className="text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg" style={{ height: '55vh' }}>
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
          </div>

          {/* Area Stats Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6">
            <h2 className="text-lg font-bold mb-4">Area-wise Crime Statistics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {areaStats.map((area, i) => {
                const riskStyle = riskColors[area.highestRisk as keyof typeof riskColors];
                return (
                  <motion.div key={area.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="glass-card rounded-xl p-4 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm">{area.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${riskStyle.bg} ${riskStyle.text}`}>
                        {area.highestRisk}
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold">{area.incidents}</p>
                    <p className="text-xs text-muted-foreground">incidents reported</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {area.types.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium capitalize text-secondary-foreground">{t}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
