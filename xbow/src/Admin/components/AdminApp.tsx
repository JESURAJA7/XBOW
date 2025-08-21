import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from '../auth/AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { UserManagement } from './UserManagement';
import { VehicleManagement } from './VehicleManagement';
import { LoadVehicleMatching } from './LoadVehicleMatching';
import { CommissionManagement } from './CommissionManagement';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { AdminRegister } from '../auth/AdminRegister';
import Cookies from 'js-cookie';

export const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    const token = Cookies.get('xbow_admin_token');
    const userData = Cookies.get('xbow_admin_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin' || user.role === 'super_admin') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        Cookies.remove('xbow_admin_token');
        Cookies.remove('xbow_admin_user');
      }
    }
    
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleShowLogin = () => {
    setShowRegister(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'matching':
        return <LoadVehicleMatching />;
      case 'commission':
        return <CommissionManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return <AdminRegister onLoginRedirect={handleShowLogin} onRegisterSuccess={handleRegisterSuccess} />;
    } else {
      return <AdminLogin onRegisterRedirect={handleShowRegister} onLoginSuccess={handleLoginSuccess} />;
    }
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};