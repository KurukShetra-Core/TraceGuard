import React, { useState, useEffect } from 'react';
import { Flame, Activity, User, Zap } from 'lucide-react';
import { MOCK_ERRORS } from './data/mockErrors';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ErrorList from './components/ErrorList';
import ErrorDetails from './components/ErrorDetails';
import Auth from './components/Auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(MOCK_ERRORS);
  const [selectedError, setSelectedError] = useState(MOCK_ERRORS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);

  // Restore active user session on initial render
  useEffect(() => {
    const activeUser = localStorage.getItem('traceguard_active_user');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('traceguard_active_user');
    setUser(null);
  };

  const handleSelectError = (error) => {
    setSelectedError(error);
    setFixApplied(error.status === 'resolved');
  };

  const handleApplyFix = () => {
    setIsApplyingFix(true);
    setTimeout(() => {
      setIsApplyingFix(false);
      setFixApplied(true);
      
      // Update error status in global list
      setErrors(prev =>
        prev.map(err => (err.id === selectedError.id ? { ...err, status: 'resolved' } : err))
      );

      // Sync active selected error state
      setSelectedError(prev => ({ ...prev, status: 'resolved' }));
    }, 1200);
  };

  const filteredErrors = errors.filter(
    err =>
      err.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      err.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. Guard route: Render Auth if user session is absent
  if (!user) {
    return <Auth onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // 2. Main Dashboard View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Incidents"
            value={errors.length.toString()}
            icon={<Flame className="w-5 h-5 text-red-400" />}
            trend="+12% today"
          />
          <MetricCard
            title="Events Captured"
            value="1,482"
            icon={<Activity className="w-5 h-5 text-sky-400" />}
            trend="32 req/sec"
          />
          <MetricCard
            title="Affected Users"
            value="93"
            icon={<User className="w-5 h-5 text-amber-400" />}
            trend="2.4% of total active"
          />
          <MetricCard
            title="AI Diagnostics"
            value="100%"
            icon={<Zap className="w-5 h-5 text-purple-400" />}
            trend="Auto-patched"
          />
        </div>

        {/* Main Telemetry Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <ErrorList
            errors={filteredErrors}
            selectedError={selectedError}
            onSelectError={handleSelectError}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ErrorDetails
            selectedError={selectedError}
            onApplyFix={handleApplyFix}
            isApplyingFix={isApplyingFix}
            fixApplied={fixApplied}
          />
        </div>
      </main>
    </div>
  );
}