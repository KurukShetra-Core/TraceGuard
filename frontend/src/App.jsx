import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [user, setUser] = useState(null);

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

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Auth onLoginSuccess={(userData) => setUser(userData)} />
          }
        />

        {/* Protected Routes nested in MainLayout via Outlet */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
            <Route path="/" element={<Dashboard />} />
            {/* Future routes like <Route path="/settings" element={<Settings />} /> go here */}
          </Route>
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}