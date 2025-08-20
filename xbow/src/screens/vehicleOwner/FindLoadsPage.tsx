import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  TruckIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  EyeIcon,
  HandRaisedIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
//import { loadAPI, vehicleAPI } from '../../../services/webApi';
import type{ Load, Vehicle } from '../../types/index';
import { Button } from '../../components/common/CustomButton';
import { Input } from '../../components/common/CustomInput';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { mockLoads, mockVehicles } from '../../data/mockData';

export const FindLoadsPage: React.FC = () => {
  const { user } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  

  const [filters, setFilters] = useState({
    search: '',
    state: '',
    district: '',
    vehicleType: '',
    vehicleSize: '',
    trailerType: '',
    paymentTerms: '',
    withCommission: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterLoads();
  }, [loads, filters]);

  const fetchData = async () => {
    try {
      // Using mock data for demonstration
      setLoads(mockLoads );
      setMyVehicles(mockVehicles);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch available loads');
    } finally {
      setLoading(false);
    }
  };

  const filterLoads = () => {
    let filtered = [...loads];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(load =>
        load.loadingLocation.place.toLowerCase().includes(filters.search.toLowerCase()) ||
        load.unloadingLocation.place.toLowerCase().includes(filters.search.toLowerCase()) ||
        load.loadProviderName.toLowerCase().includes(filters.search.toLowerCase()) ||
        Array.isArray(load.materials) && load.materials.some(material => 
          material.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    // Location filters
    if (filters.state) {
      filtered = filtered.filter(load => 
        load.loadingLocation.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    if (filters.district) {
      filtered = filtered.filter(load => 
        load.loadingLocation.district.toLowerCase().includes(filters.district.toLowerCase())
      );
    }

    // Vehicle requirement filters
    if (filters.vehicleType) {
      filtered = filtered.filter(load => load.vehicleRequirement.vehicleType === filters.vehicleType);
    }

    if (filters.vehicleSize) {
      filtered = filtered.filter(load => load.vehicleRequirement.size === Number(filters.vehicleSize));
    }

    if (filters.trailerType) {
      filtered = filtered.filter(load => load.vehicleRequirement.vehicleType === filters.trailerType);
    }

    // Payment terms filter
    if (filters.paymentTerms) {
      filtered = filtered.filter(load => load.paymentTerms === filters.paymentTerms);
    }

    // Commission filter
    if (filters.withCommission) {
      filtered = filtered.filter(load => load.commissionApplicable);
    }

    setFilteredLoads(filtered);
  };

  const updateFilter = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      state: '',
      district: '',
      vehicleType: '',
      vehicleSize: '',
      trailerType: '',
      paymentTerms: '',
      withCommission: false
    });
  };

  const applyForLoad = async (loadId: string) => {
    setApplying(loadId);
    try {
      // In a real implementation, this would send an application to the load provider
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Application sent successfully!');
    } catch (error) {
      toast.error('Failed to apply for load');
    } finally {
      setApplying(null);
    }
  };

  const calculateDistance = (load: Load) => {
    // Mock distance calculation - in real implementation, use Google Maps API
    return Math.floor(Math.random() * 800) + 200; // Random distance between 200-1000 km
  };

  const isVehicleCompatible = (load: Load) => {
    return myVehicles.some(vehicle => 
      vehicle.vehicleSize >= load.vehicleRequirement.size &&
      vehicle.passingLimit >= (Array.isArray(load.materials) ? load.materials.reduce((sum, material) => sum + material.totalWeight, 0) : 0) / 1000 &&
      vehicle.isApproved &&
      vehicle.status === 'available'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Loads</h1>
          <p className="text-slate-600">Discover available loads matching your vehicles</p>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search loads..."
                value={filters.search}
                onChange={(value) => updateFilter('search', value)}
                className="pl-10"
              />
            </div>

            <Input
              placeholder="State"
              value={filters.state}
              onChange={(value) => updateFilter('state', value)}
            />

            <Input
              placeholder="District"
              value={filters.district}
              onChange={(value) => updateFilter('district', value)}
            />

            <select
              value={filters.vehicleType}
              onChange={(e) => updateFilter('vehicleType', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Vehicle Types</option>
              <option value="2-wheel">2-wheel</option>
              <option value="3-wheel">3-wheel</option>
              <option value="4-wheel">4-wheel</option>
              <option value="6-wheel">6-wheel</option>
              <option value="8-wheel">8-wheel</option>
              <option value="10-wheel">10-wheel</option>
              <option value="12-wheel">12-wheel</option>
              <option value="14-wheel">14-wheel</option>
              <option value="16-wheel">16-wheel</option>
              <option value="18-wheel">18-wheel</option>
              <option value="20-wheel">20-wheel</option>
            </select>

            <select
              value={filters.vehicleSize}
              onChange={(e) => updateFilter('vehicleSize', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Sizes</option>
              {[6, 8.5, 10, 14, 17, 19, 20, 22, 24].map(size => (
                <option key={size} value={size}>{size} ft</option>
              ))}
            </select>

            <select
              value={filters.trailerType}
              onChange={(e) => updateFilter('trailerType', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Trailer Types</option>
              <option value="none">None</option>
              <option value="lowbed">Lowbed</option>
              <option value="semi-lowbed">Semi-Lowbed</option>
              <option value="hydraulic-axle-8">Hydraulic Axle (8 Axle)</option>
              <option value="crane-14t">Crane (14T)</option>
              <option value="crane-25t">Crane (25T)</option>
              <option value="crane-50t">Crane (50T)</option>
              <option value="crane-100t">Crane (100T)</option>
              <option value="crane-200t">Crane (200T)</option>
            </select>

            <select
              value={filters.paymentTerms}
              onChange={(e) => updateFilter('paymentTerms', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Payment Terms</option>
              <option value="advance">Advance</option>
              <option value="cod">COD</option>
              <option value="after_pod">After POD</option>
              <option value="to_pay">To Pay</option>
              <option value="credit">Credit</option>
            </select>

            <label className="flex items-center space-x-3 px-4 py-3 border-2 border-slate-300 rounded-xl">
              <input
                type="checkbox"
                checked={filters.withCommission}
                onChange={(e) => updateFilter('withCommission', e.target.checked)}
                className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-slate-700">With Commission</span>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Showing {filteredLoads.length} of {loads.length} loads
            </p>
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              icon={<FunnelIcon className="h-4 w-4" />}
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Loads Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredLoads.map((load, index) => {
              const distance = calculateDistance(load);
              const isCompatible = isVehicleCompatible(load);
              
              return (
                <motion.div
                  key={load.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    isCompatible ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-600">Available</span>
                      </div>
                      <div className="flex space-x-2">
                        {load.commissionApplicable && (
                          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                            <span className="text-xs font-medium">5% Commission</span>
                          </div>
                        )}
                        {isCompatible && (
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                            <span className="text-xs font-medium">Compatible</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Load Provider */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900 mb-1">{load.loadProviderName}</h3>
                      <p className="text-sm text-slate-600">Load Provider</p>
                    </div>

                    {/* Route */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-slate-900 text-sm">{load.loadingLocation.place}</span>
                          </div>
                          <p className="text-xs text-slate-600 ml-5">{load.loadingLocation.state}</p>
                        </div>
                        <div className="text-slate-400 text-sm">{distance} km</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
                            <span className="font-medium text-slate-900 text-sm">{load.unloadingLocation.place}</span>
                          </div>
                          <p className="text-xs text-slate-600 ml-5">{load.unloadingLocation.state}</p>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Requirements */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2 text-slate-600" />
                        Vehicle Required
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-600">Type:</span>
                          <p className="font-medium text-slate-900">{load.vehicleRequirement.vehicleType}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Size:</span>
                          <p className="font-medium text-slate-900">{load.vehicleRequirement.size} ft</p>
                        </div>
                        {load.vehicleRequirement.vehicleType && load.vehicleRequirement.vehicleType !== 'none' && (
                          <div className="col-span-2">
                            <span className="text-slate-600">Trailer:</span>
                            <p className="font-medium text-slate-900">{load.vehicleRequirement.vehicleType}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Load Details */}
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Materials:</span>
                        <span className="font-medium text-slate-900">{(load.materials?.length ?? 0)} item(s)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Weight:</span>
                        <span className="font-medium text-slate-900">
                          {(load.materials?.reduce((sum, material) => sum + material.totalWeight, 0) ?? 0)} kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Loading Date:</span>
                        <span className="font-medium text-slate-900">{new Date(load.loadingTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Payment:</span>
                        <span className="font-medium text-slate-900 uppercase">{load.paymentTerms}</span>
                      </div>
                      {load.commissionApplicable && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Commission:</span>
                          <span className="font-medium text-emerald-600">₹{load.commissionAmount?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => {
                          setSelectedLoad(load);
                          setIsModalOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        icon={<EyeIcon className="h-4 w-4" />}
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => applyForLoad(load.id)}
                        loading={applying === load.id}
                        disabled={!isCompatible}
                        variant={isCompatible ? "secondary" : "ghost"}
                        size="sm"
                        className="flex-1"
                        icon={<HandRaisedIcon className="h-4 w-4" />}
                      >
                        {isCompatible ? 'Apply' : 'Not Compatible'}
                      </Button>
                    </div>
                  </div>

                  {/* Compatibility Indicator */}
                  {isCompatible && (
                    <div className="bg-emerald-50 border-t border-emerald-200 px-6 py-3">
                      <p className="text-sm text-emerald-700 font-medium">
                        ✓ Compatible with your vehicles
                      </p>
                    </div>
                  )}
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
              {loads.length === 0 ? 'No loads available' : 'No loads match your filters'}
            </h3>
            <p className="text-slate-600 mb-6">
              {loads.length === 0 
                ? 'Check back later for new load postings'
                : 'Try adjusting your search criteria or filters'
              }
            </p>
            {loads.length > 0 && (
              <Button onClick={clearFilters}>
                Clear All Filters
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
              {/* Load Provider Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Load Provider</h3>
                <p className="text-blue-700 font-medium">{selectedLoad.loadProviderName}</p>
                <p className="text-blue-600 text-sm">Contact for direct communication</p>
              </div>

              {/* Route Information */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Route Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Loading Location
                    </h4>
                    <div className="text-sm text-slate-600">
                      <p className="font-medium text-slate-900">{selectedLoad.loadingLocation.place}</p>
                      <p>{selectedLoad.loadingLocation.district}, {selectedLoad.loadingLocation.state}</p>
                      <p>PIN: {selectedLoad.loadingLocation.pincode}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Unloading Location
                    </h4>
                    <div className="text-sm text-slate-600">
                      <p className="font-medium text-slate-900">{selectedLoad.unloadingLocation.place}</p>
                      <p>{selectedLoad.unloadingLocation.district}, {selectedLoad.unloadingLocation.state}</p>
                      <p>PIN: {selectedLoad.unloadingLocation.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Requirements */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Vehicle Requirements</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Type:</span>
                      <p className="font-medium text-slate-900">{selectedLoad.vehicleRequirement.vehicleType}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Size:</span>
                      <p className="font-medium text-slate-900">{selectedLoad.vehicleRequirement.size} ft</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Trailer:</span>
                      <p className="font-medium text-slate-900">{selectedLoad.vehicleRequirement.vehicleType || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Materials ({selectedLoad.materials?.length ?? 0})</h3>
                <div className="space-y-4">
                  {selectedLoad.materials?.map((material, index) => (
                    <div key={material.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">{material.name}</h4>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p>Dimensions: {material.dimensions.length} × {material.dimensions.width} × {material.dimensions.height} ft</p>
                            <p>Pack Type: <span className="capitalize">{material.packType}</span></p>
                            <p>Count: {material.totalCount}</p>
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
                          <h5 className="font-medium text-slate-900 mb-3">Photos</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {material.photos.map((photo, photoIndex) => (
                              <div key={photoIndex} className="relative group">
                                <img
                                  src={photo.url}
                                  alt={photo.type}
                                  className="w-full h-20 object-cover rounded-lg border border-slate-200 group-hover:opacity-80 transition-opacity cursor-pointer"
                                />
                                <div className="absolute bottom-1 left-1 right-1">
                                  <span className="text-xs bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-center block capitalize">
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

              {/* Apply Section */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                {(() => {
                  const compatible = isVehicleCompatible(selectedLoad);
                  return (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-emerald-800 mb-1">Ready to Apply?</h3>
                        <p className="text-emerald-700 text-sm">
                          {compatible
                            ? 'This load is compatible with your vehicles'
                            : 'Check vehicle compatibility before applying'
                          }
                        </p>
                      </div>
                      <Button
                        onClick={() => applyForLoad(selectedLoad.id)}
                        loading={applying === selectedLoad.id}
                        disabled={!compatible}
                        variant={compatible ? "secondary" : "ghost"}
                        icon={<HandRaisedIcon className="h-4 w-4" />}
                      >
                        Apply for Load
                      </Button>
                      
                    </div>
                    
                  );
                })()}

              
               
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};