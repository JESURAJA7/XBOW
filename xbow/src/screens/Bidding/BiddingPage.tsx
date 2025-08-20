import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  TruckIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  PhoneIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { Vehicle } from '../../types/index';
import { mockBiddingVehicles } from '../../data/mockData';
import { Button } from '../../components/common/CustomButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';

interface BiddingPageProps {
  onBack: () => void;
}

export const BiddingPage: React.FC<BiddingPageProps> = ({ onBack }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // Simulate API call with loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sort vehicles by price in ascending order (lowest first)
      const sortedVehicles = [...mockBiddingVehicles].sort((a, b) => 
        (a.bidPrice || 0) - (b.bidPrice || 0)
      );
      
      setVehicles(sortedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    
    const sorted = [...vehicles].sort((a, b) => {
      if (newOrder === 'asc') {
        return (a.bidPrice || 0) - (b.bidPrice || 0);
      } else {
        return (b.bidPrice || 0) - (a.bidPrice || 0);
      }
    });
    
    setVehicles(sorted);
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {star <= rating ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
        <span className="text-sm text-slate-600 ml-1">({rating})</span>
      </div>
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'immediate': return 'bg-green-100 text-green-700 border-green-200';
      case 'today': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'tomorrow': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'assigned': return 'text-orange-600';
      case 'in_transit': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                icon={<ArrowLeftIcon className="h-5 w-5" />}
              >
                Back to Loads
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Vehicle Bidding</h1>
                <p className="text-slate-600">Available vehicles sorted by pricing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600">Sort by Price:</span>
              <Button
                onClick={toggleSortOrder}
                variant="outline"
                size="sm"
              >
                {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
              </div>
              <TruckIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. Price</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{Math.round(vehicles.reduce((sum, v) => sum + (v.bidPrice || 0), 0) / vehicles.length).toLocaleString()}
                </p>
              </div>
              <CurrencyRupeeIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Lowest Bid</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ₹{Math.min(...vehicles.map(v => v.bidPrice || 0)).toLocaleString()}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Highest Bid</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{Math.max(...vehicles.map(v => v.bidPrice || 0)).toLocaleString()}
                </p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* Vehicles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Vehicle Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vehicle.photos[0]?.url || 'https://images.pexels.com/photos/1198171/pexels-photo-1198171.jpeg'}
                    alt={`${vehicle.vehicleType} - ${vehicle.vehicleNumber}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getAvailabilityColor(vehicle.availability)}`}>
                      {vehicle.availability.charAt(0).toUpperCase() + vehicle.availability.slice(1)}
                    </div>
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200">
                      <span className="text-xs font-medium text-slate-700">
                        {vehicle.isApproved ? '✓ Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      ₹{vehicle.bidPrice?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6">
                  {/* Owner Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{vehicle.ownerName}</h3>
                      <p className="text-sm text-slate-600">{vehicle.vehicleNumber}</p>
                    </div>
                    <div className="text-right">
                      {renderStars(vehicle.rating)}
                      <p className="text-xs text-slate-600 mt-1">{vehicle.totalTrips} trips</p>
                    </div>
                  </div>

                  {/* Vehicle Specs */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Type:</span>
                        <p className="font-medium text-slate-900">{vehicle.vehicleType}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Size:</span>
                        <p className="font-medium text-slate-900">{vehicle.vehicleSize} ft</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Weight:</span>
                        <p className="font-medium text-slate-900">{vehicle.vehicleWeight}T</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Limit:</span>
                        <p className="font-medium text-slate-900">{vehicle.passingLimit}T</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {vehicle.preferredOperatingArea.place}, {vehicle.preferredOperatingArea.state}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center space-x-4 mb-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(vehicle.status) === 'text-green-600' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <span className={getStatusColor(vehicle.status)}>{vehicle.status}</span>
                    </div>
                    <div className="text-slate-600">
                      Tarpaulin: {vehicle.tarpaulin}
                    </div>
                    {vehicle.isOpen && (
                      <div className="text-blue-600">Open Body</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
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
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      icon={<PhoneIcon className="h-4 w-4" />}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Vehicle Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Vehicle Details"
          size="xl"
        >
          {selectedVehicle && (
            <div className="space-y-6">
              {/* Vehicle Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedVehicle.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.type}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200 group-hover:opacity-80 transition-opacity cursor-pointer"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded text-center block capitalize">
                        {photo.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Owner & Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">Owner Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-blue-600">Name:</span> <span className="font-medium">{selectedVehicle.ownerName}</span></p>
                    <p><span className="text-blue-600">Rating:</span> {renderStars(selectedVehicle.rating)}</p>
                    <p><span className="text-blue-600">Total Trips:</span> <span className="font-medium">{selectedVehicle.totalTrips}</span></p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-3">Pricing</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-700">
                      ₹{selectedVehicle.bidPrice?.toLocaleString()}
                    </div>
                    <p className="text-sm text-emerald-600">Competitive bidding price</p>
                  </div>
                </div>
              </div>

              {/* Complete Specifications */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Complete Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">Basic Details</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Vehicle Number: <span className="font-medium text-slate-900">{selectedVehicle.vehicleNumber}</span></p>
                      <p>Type: <span className="font-medium text-slate-900">{selectedVehicle.vehicleType}</span></p>
                      <p>Size: <span className="font-medium text-slate-900">{selectedVehicle.vehicleSize} ft</span></p>
                      <p>Weight: <span className="font-medium text-slate-900">{selectedVehicle.vehicleWeight} tons</span></p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">Capacity</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Length: <span className="font-medium text-slate-900">{selectedVehicle.dimensions.length} ft</span></p>
                      <p>Breadth: <span className="font-medium text-slate-900">{selectedVehicle.dimensions.breadth} ft</span></p>
                      <p>Passing Limit: <span className="font-medium text-slate-900">{selectedVehicle.passingLimit} tons</span></p>
                      <p>Body Type: <span className="font-medium text-slate-900">{selectedVehicle.isOpen ? 'Open' : 'Closed'}</span></p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">Features</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Tarpaulin: <span className="font-medium text-slate-900 capitalize">{selectedVehicle.tarpaulin}</span></p>
                      <p>Trailer: <span className="font-medium text-slate-900 capitalize">{selectedVehicle.trailerType.replace('-', ' ')}</span></p>
                      <p>Availability: <span className="font-medium text-slate-900 capitalize">{selectedVehicle.availability}</span></p>
                      <p>Status: <span className={`font-medium capitalize ${getStatusColor(selectedVehicle.status)}`}>{selectedVehicle.status}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h3 className="font-semibold text-orange-800 mb-3">Preferred Operating Area</h3>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-700">
                    {selectedVehicle.preferredOperatingArea.place}, {selectedVehicle.preferredOperatingArea.district}, {selectedVehicle.preferredOperatingArea.state}
                  </span>
                </div>
              </div>

              {/* Action Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Ready to Book?</h3>
                    <p className="text-slate-600 text-sm">Contact the owner to finalize the deal</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      icon={<PhoneIcon className="h-4 w-4" />}
                    >
                      Call Now
                    </Button>
                    <Button
                      variant="primary"
                    >
                      Book Vehicle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};