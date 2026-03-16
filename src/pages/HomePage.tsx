import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, MapPin, FileText, Phone, ArrowRight, Zap, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: AlertTriangle, title: 'SOS Emergency', desc: 'One-tap emergency alert with live GPS tracking', link: '/', color: 'text-emergency', bg: 'bg-emergency/10', hoverBg: 'group-hover:bg-emergency/15' },
  { icon: FileText, title: 'Report Crime', desc: 'Submit detailed crime reports with photo evidence', link: '/report', color: 'text-primary', bg: 'bg-primary/10', hoverBg: 'group-hover:bg-primary/15' },
  { icon: MapPin, title: 'Crime Heatmap', desc: 'Visualize crime hotspots across Mumbai', link: '/heatmap', color: 'text-warning', bg: 'bg-warning/10', hoverBg: 'group-hover:bg-warning/15' },
  { icon: Phone, title: 'Emergency Services', desc: 'Find nearest police, hospitals & fire stations', link: '/emergency-services', color: 'text-success', bg: 'bg-success/10', hoverBg: 'group-hover:bg-success/15' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      {/* Hero */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emergency/5" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-emergency/10 rounded-full blur-3xl" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 hover:bg-primary/15 transition-colors cursor-default"
            >
              <Shield className="h-4 w-4" />
              Protecting Our Communities
              <Zap className="h-3.5 w-3.5" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Your City, <br className="hidden sm:block" /><span className="gradient-text">Safer Together</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              MySafeCity empowers citizens to report crimes, trigger emergency alerts, and stay informed about safety in their neighborhood — all in real time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/register')}
                    className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/login')}
                    className="px-8 py-3.5 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-accent transition-colors border border-border/50"
                  >
                    Sign In
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/report')}
                  className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 flex items-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                >
                  {user?.role === 'admin' ? 'Go to Dashboard' : 'Report a Crime'}
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-center mb-4">How MySafeCity Keeps You Safe</motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">Comprehensive safety tools designed for the citizens of Mumbai</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link
                  to={f.link}
                  className="block glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className={`inline-flex p-3 rounded-xl ${f.bg} ${f.hoverBg} transition-colors duration-300 mb-4`}>
                    <f.icon className={`h-7 w-7 ${f.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '247', label: 'Reports Filed', icon: FileText },
              { value: '189', label: 'Cases Resolved', icon: Shield },
              { value: '24/7', label: 'Monitoring', icon: Clock },
              { value: '50K+', label: 'Citizens Protected', icon: Users },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 rounded-2xl hover:bg-card/50 transition-colors duration-300 group cursor-default"
              >
                <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3 group-hover:scale-110 transition-transform">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center glass-card rounded-3xl p-10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3">Ready to Make Your City Safer?</h3>
            <p className="text-muted-foreground mb-8">Join thousands of citizens keeping Mumbai safe together.</p>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(isAuthenticated ? '/report' : '/register')}
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow inline-flex items-center gap-2"
            >
              {isAuthenticated ? 'Report a Crime' : 'Join MySafeCity'}
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
