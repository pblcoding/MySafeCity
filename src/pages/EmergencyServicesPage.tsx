import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield as ShieldIcon, Siren, Flame, Hospital, Navigation, ExternalLink } from 'lucide-react';
import { api } from '@/services/api';
import type { EmergencyService } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconMap = {
  police: { icon: ShieldIcon, color: 'text-primary', bg: 'bg-primary/10' },
  hospital: { icon: Hospital, color: 'text-success', bg: 'bg-success/10' },
  fire: { icon: Flame, color: 'text-emergency', bg: 'bg-emergency/10' },
};

const markerColors: Record<string, string> = { police: '#2563eb', hospital: '#22c55e', fire: '#ef4444' };

export default function EmergencyServicesPage() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    api.getEmergencyServices().then(setServices);
  }, []);

  // Initialize map
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

  const filtered = filter === 'all' ? services : services.filter(s => s.type === filter);

  // Update markers
  useEffect(() => {
    if (!layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();

    filtered.forEach(s => {
      const color = markerColors[s.type] || '#2563eb';
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([s.location.lat, s.location.lng], { icon })
        .bindPopup(`<div class="text-sm"><p class="font-bold">${s.name}</p><p>${s.address}</p><p>${s.phone}</p></div>`)
        .addTo(layerGroupRef.current!);
    });
  }, [filtered]);

  return (
    <div className="min-h-screen pt-[var(--nav-height)] py-10 px-4">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Siren className="h-8 w-8 text-emergency" />
            <div>
              <h1 className="text-3xl font-bold">Nearby Emergency Services</h1>
              <p className="text-muted-foreground">Find police, hospitals, and fire stations near you</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {['all', 'police', 'hospital', 'fire'].map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}>
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg" style={{ height: '500px' }}>
              <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map(s => {
                const meta = iconMap[s.type];
                const Icon = meta.icon;
                return (
                  <motion.div key={s._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-xl p-4 flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${meta.bg}`}>
                      <Icon className={`h-6 w-6 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.address}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <a href={`tel:${s.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Phone className="h-3 w-3" />{s.phone}
                        </a>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Navigation className="h-3 w-3" />{s.distance} km
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${s.location.lat},${s.location.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
