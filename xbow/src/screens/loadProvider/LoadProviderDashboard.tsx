import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  DocumentTextIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { loadAPI } from '../../services/api';
import type { Load, DashboardStats } from '../../types/index';
import { Button } from '../../components/common/CustomButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const LoadProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const loadsResponse = await loadAPI.getMyLoads();
      if (loadsResponse.data.success) {
        setLoads(loadsResponse.data.data);
        
        // Calculate stats from loads data
        const loadData = loadsResponse.data.data;
        const dashboardStats: DashboardStats = {
          totalLoads: loadData.length,
          totalVehicles: 0, // Not applicable for load providers
          activeLoads: loadData.filter((load: Load) => ['posted', 'assigned', 'enroute'].includes(load.status)).length,
          completedLoads: loadData.filter((load: Load) => load.status === 'completed').length,
          pendingApprovals: loadData.filter((load: Load) => load.status === 'posted').length,
          monthlyRevenue: loadData.filter((load: Load) => load.commissionApplicable).reduce((sum: number, load: Load) => sum + (load.commissionAmount || 0), 0)
        };
        setStats(dashboardStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-blue-100 text-blue-700';
      case 'assigned': return 'bg-yellow-100 text-yellow-700';
      case 'enroute': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your loads and track your logistics operations
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Loads</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalLoads}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Loads</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeLoads}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.completedLoads}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Commission</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">₹{(stats.monthlyRevenue ?? 0).toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CurrencyRupeeIcon className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/post-load">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <PlusIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Post New Load</h3>
                    <p className="text-blue-100 text-sm">Create a new load posting</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link to="/my-loads">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Manage Loads</h3>
                    <p className="text-emerald-100 text-sm">View and track your loads</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Loads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200"
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Loads</h2>
              <Link to="/my-loads">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {loads.slice(0, 5).map((load) => (
              <motion.div
                key={load.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {load.loadingLocation.place} → {load.unloadingLocation.place}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(load.status)}`}>
                        {load.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-slate-600">
                    <span>Vehicle: {load.vehicleRequirement.size}ft {load.vehicleRequirement.vehicleType}</span>

                     <span>Materials: {load.materials?.length ?? 0}</span>

                      <span>Posted: {new Date(load.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={<EyeIcon className="h-4 w-4" />}>
                    View
                  </Button>
                </div>
              </motion.div>
            ))}

            {loads.length === 0 && (
              <div className="p-12 text-center">
                <DocumentTextIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No loads posted yet</h3>
                <p className="text-slate-600 mb-6">Start by posting your first load to connect with vehicle owners</p>
                <Link to="/post-load">
                  <Button icon={<PlusIcon className="h-4 w-4" />}>
                    Post Your First Load
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};