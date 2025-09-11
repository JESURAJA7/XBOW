import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './screens/auth/LoginScreen';
import { RegisterPage } from './screens/auth/RegisterScreen';
import { Navbar } from './components/layout/Navbar';
import { LoadProviderDashboard } from './screens/loadProvider/LoadProviderDashboard';
import { VehicleOwnerDashboard } from './screens/vehicleOwner/VehicleOwnerDashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ProfileCompletion } from './components/profile/ProfileCompletion';
import { PostLoadPage } from './components/loads/PostLoadPage';
import { AddVehiclePage } from './components/vehicles/AddVehiclePage';
import { SubscriptionPage } from './screens/subscription/SubscriptionPage';
import { FindLoadsPage } from './screens/vehicleOwner/FindLoadsPage';
import { MyLoadsPage } from './screens/loadProvider/MyLoadsPage';
import { MyVehiclesPage } from './screens/vehicleOwner/MyVehiclesPage';
import { PODManagementPage } from './Admin/components/PODManagementPage';
import { BiddingInfo } from './screens/Bidding/BiddingInfo';
import { BiddingPage } from './screens/Bidding/BiddingPage';
import { AdminApp } from './Admin/components/AdminApp';
import { LoadMatchedVehiclesPage } from './screens/loadProvider/LoadMatchedVehiclesPage';
import { AdminLogin } from './Admin/auth/AdminLogin';
import { AdminRegister } from './Admin/auth/AdminRegister';
import { AdminProtectedRoute } from './Admin/auth/AdminProtectedRoute';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Dashboard Route Component
const DashboardRoute: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'load_provider') {
    return <LoadProviderDashboard />;
  } else if (user?.role === 'vehicle_owner') {
    return <VehicleOwnerDashboard />;
  }

  return <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <DashboardRoute />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/complete"
          element={
            <ProtectedRoute>
              <ProfileCompletion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-load"
          element={
            <ProtectedRoute>
              <Navbar />
              <PostLoadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-vehicle"
          element={
            <ProtectedRoute>
              <Navbar />
              <AddVehiclePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Navbar />
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-loads"
          element={
            <ProtectedRoute>
              <Navbar />
              <MyLoadsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-loads"
          element={
            <ProtectedRoute>
              <Navbar />
              <FindLoadsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-vehicles"
          element={
            <ProtectedRoute>
              <Navbar />
              <MyVehiclesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pods"
          element={
            <ProtectedRoute>
              <Navbar />
              <PODManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bidding-info"
          element={
            <ProtectedRoute>
              <Navbar />
              <BiddingInfo onBack={() => window.history.back()} />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/bidding"
          element={
            <ProtectedRoute>
              <Navbar />
              <BiddingPage
                load={null} // Replace null with the actual load object as needed
                onBack={() => window.history.back()}
                onVehicleSelect={() => {}} // Replace with actual handler if needed
              />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/load-matched-vehicles/:loadId"
          element={
            <ProtectedRoute>
              <Navbar />
              <LoadMatchedVehiclesPage />
            </ProtectedRoute>
          }
        />

          {/* ---------------- Admin Auth ---------------- */}
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/admin_register" element={<AdminRegister />} />

        {/* ---------------- Admin Protected ---------------- */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminApp />
            </AdminProtectedRoute>
          }
        />


        {/* Default redirect */}
      
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="*" element={<Navigate to="/login" replace />} />

</Routes>


    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;