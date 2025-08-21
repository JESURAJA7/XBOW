import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  MapPinIcon,
  TruckIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

import type{ Load } from '../../types/index';
import { Button } from '../../components/common/CustomButton';
import { Input } from '../../components/common/CustomInput';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { mockLoads } from '../../data/mockData';

export const MyLoadsPage: React.FC = () => {
  const { user } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchLoads();
  }, []);

  useEffect(() => {
    filterLoads();
  }, [loads, searchTerm, statusFilter, dateFilter]);

  const fetchLoads = async () => {
    try {
      // Using mock data for demonstration
      setLoads(mockLoads);
    } catch (error) {
      console.error('Error fetching loads:', error);
      toast.error('Failed to fetch loads');
    } finally {
      setLoading(false);
    }
  };

  const filterLoads = () => {
    let filtered = [...loads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(load =>
        load.loadingLocation.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.unloadingLocation.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.materials?.some(material => 
          material.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(load => load.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(load => 
            new Date(load.createdAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(load => 
            new Date(load.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(load => 
            new Date(load.createdAt) >= filterDate
          );
          break;
      }
    }

    setFilteredLoads(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'assigned': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'enroute': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted': return DocumentTextIcon;
      case 'assigned': return CheckCircleIcon;
      case 'enroute': return TruckIcon;
      case 'delivered': return CheckCircleIcon;
      case 'completed': return CheckCircleIcon;
      default: return ClockIcon;
    }
  };

  const viewLoadDetails = (load: Load) => {
    setSelectedLoad(load);
    setIsModalOpen(true);
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Loads</h1>
          <p className="text-slate-600">Manage and track all your load postings</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search loads..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="pl-10"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="posted">Posted</option>
                <option value="assigned">Assigned</option>
                <option value="enroute">En Route</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              variant="outline"
              icon={<XCircleIcon className="h-4 w-4" />}
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Loads', value: loads.length, color: 'blue', icon: DocumentTextIcon },
            { label: 'Active', value: loads.filter(l => ['posted', 'assigned', 'enroute'].includes(l.status)).length, color: 'orange', icon: TruckIcon },
            { label: 'Completed', value: loads.filter(l => l.status === 'completed').length, color: 'green', icon: CheckCircleIcon },
            { label: 'Commission', value: `₹${loads.filter(l => l.commissionApplicable).reduce((sum, l) => sum + (l.commissionAmount || 0), 0).toLocaleString()}`, color: 'emerald', icon: CurrencyRupeeIcon }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Loads Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredLoads.map((load, index) => {
              const StatusIcon = getStatusIcon(load.status);
              return (
                <motion.div
                  key={load.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(load.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">{load.status}</span>
                      </div>
                      {load.commissionApplicable && (
                        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                          <span className="text-xs font-medium">5% Commission</span>
                        </div>
                      )}
                    </div>

                    {/* Route */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPinIcon className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-slate-900">{load.loadingLocation.place}</span>
                          </div>
                          <p className="text-sm text-slate-600">{load.loadingLocation.district}, {load.loadingLocation.state}</p>
                        </div>
                        <div className="text-slate-400">→</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPinIcon className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-slate-900">{load.unloadingLocation.place}</span>
                          </div>
                          <p className="text-sm text-slate-600">{load.unloadingLocation.district}, {load.unloadingLocation.state}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">Vehicle Required:</span>
                        <span className="font-medium text-slate-900">{load.vehicleRequirement.size}ft {load.vehicleRequirement.vehicleType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">Materials:</span>
                        <span className="font-medium text-slate-900">{load.materials?.length} item(s)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">Loading Date:</span>
                        <span className="font-medium text-slate-900">{new Date(load.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">Payment:</span>
                        <span className="font-medium text-slate-900 uppercase">{load.paymentTerms}</span>
                      </div>
                      {load.commissionApplicable && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-sm">Commission:</span>
                          <span className="font-medium text-emerald-600">₹{load.commissionAmount?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => viewLoadDetails(load)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        icon={<EyeIcon className="h-4 w-4" />}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredLoads.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <DocumentTextIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {loads.length === 0 ? 'No loads posted yet' : 'No loads match your filters'}
            </h3>
            <p className="text-slate-600 mb-6">
              {loads.length === 0 
                ? 'Start by posting your first load to connect with vehicle owners'
                : 'Try adjusting your search criteria or filters'
              }
            </p>
            {loads.length === 0 && (
              <Button onClick={() => window.location.href = '/post-load'}>
                Post Your First Load
              </Button>
            )}
          </motion.div>
        )}

        {/* Load Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Load Details"
          size="xl"
        >
          {selectedLoad && (
            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Load Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Load ID:</span>
                        <span className="font-medium">{selectedLoad.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedLoad.status)}`}>
                          <span className="text-sm font-medium capitalize">{selectedLoad.status}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Loading Date:</span>
                        <span className="font-medium">{new Date(selectedLoad.loadingTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Loading Time:</span>
                        <span className="font-medium">{selectedLoad.loadingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Payment Terms:</span>
                        <span className="font-medium uppercase">{selectedLoad.paymentTerms}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Vehicle Requirements</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-medium">{selectedLoad.vehicleRequirement.vehicleType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Size:</span>
                        <span className="font-medium">{selectedLoad.vehicleRequirement.size} ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Trailer:</span>
                        <span className="font-medium">{selectedLoad.vehicleRequirement.vehicleType || 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Route Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Loading Location
                    </h4>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">{selectedLoad.loadingLocation.place}</p>
                      <p>{selectedLoad.loadingLocation.district}, {selectedLoad.loadingLocation.state}</p>
                      <p>PIN: {selectedLoad.loadingLocation.pincode}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="font-medium text-emerald-800 mb-2 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Unloading Location
                    </h4>
                    <div className="text-sm text-emerald-700">
                      <p className="font-medium">{selectedLoad.unloadingLocation.place}</p>
                      <p>{selectedLoad.unloadingLocation.district}, {selectedLoad.unloadingLocation.state}</p>
                      <p>PIN: {selectedLoad.unloadingLocation.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Materials ({selectedLoad.materials?.length})</h3>
                <div className="space-y-4">
                  {selectedLoad.materials?.map((material, index) => (
                    <div key={material.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Material {index + 1}: {material.name}</h4>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p>Dimensions: {material.dimensions.length} × {material.dimensions.width} × {material.dimensions.height} ft</p>
                            <p>Pack Type: <span className="capitalize">{material.packType}</span></p>
                            <p>Total Count: {material.totalCount}</p>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>Single Weight: {material.singleWeight} kg</p>
                          <p>Total Weight: <span className="font-semibold text-slate-900">{material.totalWeight} kg</span></p>
                        </div>
                      </div>
                      
                      {/* Material Photos */}
                      {material.photos.length > 0 && (
                        <div>
                          <h5 className="font-medium text-slate-900 mb-3">Material Photos</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {material.photos.map((photo, photoIndex) => (
                              <div key={photoIndex} className="relative group">
                                <img
                                  src={photo.url}
                                  alt={photo.type}
                                  className="w-full h-24 object-cover rounded-lg border border-slate-200 group-hover:opacity-80 transition-opacity cursor-pointer"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                                  <EyeIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5" />
                                </div>
                                <div className="absolute bottom-1 left-1 right-1">
                                  <span className="text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded text-center block capitalize">
                                    {photo.type.replace('material_', '').replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Commission Info */}
              {selectedLoad.commissionApplicable && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-medium text-emerald-800 mb-2 flex items-center">
                    <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                    Commission Details
                  </h3>
                  <p className="text-sm text-emerald-700">
                    5% commission applicable (₹{selectedLoad.commissionAmount?.toLocaleString()}) as XBOW is responsible for coordinating this transport.
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};