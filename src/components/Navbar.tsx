import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Bell, Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'Report Crime' },
    { path: '/heatmap', label: 'Crime Map' },
    { path: '/emergency-services', label: 'Emergency' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Dashboard' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] glass-card border-b border-border/50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
          <Shield className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-200" />
          <span className="gradient-text">MySafeCity</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-all duration-200 hover:scale-105" title="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5 text-warning" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-accent transition-all duration-200 hover:scale-105">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-emergency text-emergency-foreground text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent border border-border/30 hover:border-primary/20 transition-colors">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-accent transition-all duration-200 text-muted-foreground hover:text-emergency hover:scale-105">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
                Sign In
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
            {theme === 'dark' ? <Sun className="h-5 w-5 text-warning" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
          </button>
          <button className="p-2 rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass-card border-b border-border/50 p-4 space-y-1"
          >
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
