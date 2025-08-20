import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import type{ Vehicle  } from '../../types';
import { Modal } from '../Common/Modal';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ImageGallery } from '../Common/ImageGallery';

export const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const { getVehicles, approveVehicle, rejectVehicle, isLoading } = useApi();

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.preferredOperatingArea.place.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesApproval = approvalFilter === 'all' || 
                          (approvalFilter === 'approved' && vehicle.isApproved) ||
                          (approvalFilter === 'pending' && !vehicle.isApproved);
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'assigned': return 'bg-yellow-100 text-yellow-700';
      case 'in_transit': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const viewVehicleDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleApproveVehicle = async (vehicleId: string) => {
    await approveVehicle(vehicleId);
    // Refresh vehicles list
    const data = await getVehicles();
    setVehicles(data);
  };

  const handleRejectVehicle = async (vehicleId: string) => {
    await rejectVehicle(vehicleId);
    // Refresh vehicles list
    const data = await getVehicles();
    setVehicles(data);
  };

  if (isLoading && vehicles.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vehicle Management</h1>
        <p className="text-slate-600">Manage and approve vehicle registrations</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by owner, vehicle number, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="in_transit">In Transit</option>
            </select>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Approvals</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Vehicle Owner</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Vehicle Details</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Specifications</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Operating Area</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Approval</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{vehicle.ownerName}</p>
                      <p className="text-sm text-slate-500">ID: {vehicle.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{vehicle.vehicleNumber}</p>
                      <p className="text-sm text-slate-500">{vehicle.vehicleType}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-slate-900">Limit: {vehicle.passingLimit}T</p>
                      <p className="text-slate-500">{vehicle.isOpen ? 'Open' : 'Closed'}</p>
                      <p className="text-slate-500">Tarpaulin: {vehicle.tarpaulin}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-slate-900">{vehicle.preferredOperatingArea.place}</p>
                      <p className="text-slate-500">{vehicle.preferredOperatingArea.district}</p>
                      <p className="text-slate-500">{vehicle.preferredOperatingArea.state}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {vehicle.isApproved ? (
                      <span className="flex items-center space-x-1 text-green-600 text-sm">
                        <CheckCircle size={16} />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveVehicle(vehicle.id)}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectVehicle(vehicle.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => viewVehicleDetails(vehicle)}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Vehicle Details"
        size="xl"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Vehicle Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle ID:</span>
                    <span className="font-medium">{selectedVehicle.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Owner:</span>
                    <span className="font-medium">{selectedVehicle.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle Number:</span>
                    <span className="font-medium">{selectedVehicle.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium">{selectedVehicle.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Passing Limit:</span>
                    <span className="font-medium">{selectedVehicle.passingLimit} Tons</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-3">Specifications</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Body Type:</span>
                    <span className="font-medium">{selectedVehicle.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tarpaulin:</span>
                    <span className="font-medium capitalize">{selectedVehicle.tarpaulin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Availability:</span>
                    <span className="font-medium">{selectedVehicle.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className={`font-medium capitalize ${getStatusColor(selectedVehicle.status).replace('bg-', 'text-').replace('-100', '-600')}`}>
                      {selectedVehicle.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Area */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">Preferred Operating Area</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-slate-600">
                  <p>{selectedVehicle.preferredOperatingArea.place}</p>
                  <p>{selectedVehicle.preferredOperatingArea.district}, {selectedVehicle.preferredOperatingArea.state}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Photos */}
            {selectedVehicle.photos.length > 0 && (
              <ImageGallery 
                images={selectedVehicle.photos.map(photo => ({
                  id: photo.id,
                  url: photo.url,
                  type: photo.type,
                  uploadedAt: photo.uploadedAt
                }))} 
                title="Vehicle Photos"
              />
            )}

            {/* Approval Status */}
            <div className={`border rounded-lg p-4 ${selectedVehicle.isApproved ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
              <h3 className={`font-medium mb-2 ${selectedVehicle.isApproved ? 'text-green-800' : 'text-orange-800'}`}>
                Approval Status
              </h3>
              <p className={`text-sm ${selectedVehicle.isApproved ? 'text-green-700' : 'text-orange-700'}`}>
                {selectedVehicle.isApproved 
                  ? 'This vehicle has been approved and is ready for load assignments.'
                  : 'This vehicle is pending approval. Review the details and photos before approving.'
                }
              </p>
              {!selectedVehicle.isApproved && (
                <div className="flex space-x-3 mt-3">
                  <button
                    onClick={() => {
                      handleApproveVehicle(selectedVehicle.id);
                      setIsModalOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={16} />
                    <span>Approve Vehicle</span>
                  </button>
                  <button
                    onClick={() => {
                      handleRejectVehicle(selectedVehicle.id);
                      setIsModalOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={16} />
                    <span>Reject Vehicle</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};