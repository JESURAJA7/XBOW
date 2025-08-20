import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Auth/Login';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LoadManagement } from './components/LoadManagement/LoadManagement';
import { VehicleManagement } from './components/VehicleManagement/VehicleManagement';
import { LoadingSpinner } from './components/Common/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'loads':
        return <LoadManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'users':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-600 mt-2">Manage load providers and vehicle owners</p>
            <div className="mt-6 bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-500">User Management module coming soon...</p>
            </div>
          </div>
        );
      case 'subscriptions':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900">Subscription Management</h1>
            <p className="text-slate-600 mt-2">Manage user subscriptions and payments</p>
            <div className="mt-6 bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-500">Subscription Management module coming soon...</p>
            </div>
          </div>
        );
      case 'commission':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900">Commission Management</h1>
            <p className="text-slate-600 mt-2">Track and manage commission earnings</p>
            <div className="mt-6 bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-500">Commission Management module coming soon...</p>
            </div>
          </div>
        );
      case 'pods':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900">POD Management</h1>
            <p className="text-slate-600 mt-2">Review and approve proof of delivery documents</p>
            <div className="mt-6 bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-500">POD Management module coming soon...</p>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
            <p className="text-slate-600 mt-2">Track payments and transactions</p>
            <div className="mt-6 bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-500">Payment Management module coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-2">Configure system settings and preferences</p>
            <div className="mt-6 bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-500">Settings module coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;