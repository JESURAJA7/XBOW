import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, MapPin, Package } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import type{ Load } from '../../types';
import { Modal } from '../Common/Modal';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ImageGallery } from '../Common/ImageGallery';

export const LoadManagement: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { getLoads, isLoading } = useApi();

  useEffect(() => {
    const fetchLoads = async () => {
      const data = await getLoads();
      setLoads(data);
    };
    fetchLoads();
  }, []);

  const filteredLoads = loads.filter(load => {
    const matchesSearch = load.loadProviderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         load.loadingLocation.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         load.unloadingLocation.place.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const viewLoadDetails = (load: Load) => {
    setSelectedLoad(load);
    setIsModalOpen(true);
  };

  if (isLoading && loads.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Load Management</h1>
        <p className="text-slate-600">Manage and track all load postings</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by provider, location..."
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
              <option value="posted">Posted</option>
              <option value="assigned">Assigned</option>
              <option value="enroute">En Route</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loads Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Load Provider</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Route</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Vehicle Required</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Payment Terms</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Commission</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLoads.map((load) => (
                <tr key={load.id} className="hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{load.loadProviderName}</p>
                      <p className="text-sm text-slate-500">ID: {load.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {load.loadingLocation.place}, {load.loadingLocation.state}
                        </p>
                        <div className="flex items-center text-slate-500 text-xs">
                          <MapPin size={12} className="mr-1" />
                          {load.unloadingLocation.place}, {load.unloadingLocation.state}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{load.vehicleRequirement.size} ft</p>
                      <p className="text-xs text-slate-500">{load.vehicleRequirement.type}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-700">{load.paymentTerms}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(load.status)}`}>
                      {load.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {load.commissionApplicable ? (
                      <div>
                        <span className="text-sm font-medium text-green-600">₹{load.commissionAmount}</span>
                        <p className="text-xs text-slate-500">5% applicable</p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => viewLoadDetails(load)}
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

      {/* Load Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Load Details"
        size="xl"
      >
        {selectedLoad && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Load Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Load ID:</span>
                    <span className="font-medium">{selectedLoad.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Provider:</span>
                    <span className="font-medium">{selectedLoad.loadProviderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Loading Time:</span>
                    <span className="font-medium">{selectedLoad.loadingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Terms:</span>
                    <span className="font-medium">{selectedLoad.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">XBOW Responsible:</span>
                    <span className={`font-medium ${selectedLoad.isXBOWResponsible ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedLoad.isXBOWResponsible ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-3">Vehicle Requirements</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Size:</span>
                    <span className="font-medium">{selectedLoad.vehicleRequirement.size} ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium">{selectedLoad.vehicleRequirement.type}</span>
                  </div>
                  {selectedLoad.vehicleRequirement.trailer && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Trailer:</span>
                      <span className="font-medium">{selectedLoad.vehicleRequirement.trailer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">Route Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-2">Loading Location</h4>
                  <div className="text-sm text-slate-600">
                    <p>{selectedLoad.loadingLocation.place}</p>
                    <p>{selectedLoad.loadingLocation.district}, {selectedLoad.loadingLocation.state}</p>
                    <p>PIN: {selectedLoad.loadingLocation.pincode}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-2">Unloading Location</h4>
                  <div className="text-sm text-slate-600">
                    <p>{selectedLoad.unloadingLocation.place}</p>
                    <p>{selectedLoad.unloadingLocation.district}, {selectedLoad.unloadingLocation.state}</p>
                    <p>PIN: {selectedLoad.unloadingLocation.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">Materials ({selectedLoad.materials.length})</h3>
              <div className="space-y-4">
                {selectedLoad.materials.map((material, index) => (
                  <div key={material.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Material {index + 1}: {material.name}</h4>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>Dimensions: {material.dimensions.length} x {material.dimensions.width} x {material.dimensions.height} ft</p>
                          <p>Pack Type: {material.packType}</p>
                          <p>Total Count: {material.totalCount}</p>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>Single Weight: {material.singleWeight} kg</p>
                        <p>Total Weight: {material.totalWeight} kg</p>
                      </div>
                    </div>
                    
                    {/* Material Photos */}
                    {material.photos.length > 0 && (
                      <ImageGallery 
                        images={material.photos.map(photo => ({
                          id: photo.id,
                          url: photo.url,
                          type: photo.type,
                          uploadedAt: photo.uploadedAt
                        }))} 
                        title={`${material.name} Photos`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Info */}
            {selectedLoad.commissionApplicable && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Commission Details</h3>
                <p className="text-sm text-green-700">
                  5% commission applicable (₹{selectedLoad.commissionAmount}) as XBOW is responsible for full transport.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};