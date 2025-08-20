import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TruckIcon,
  PhotoIcon,
  DocumentTextIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/CustomButton';
import { Input } from '../../components/common/CustomInput';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { vehicleAPI, profileAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface VehiclePhoto {
  type: 'front' | 'side' | 'back' | 'rc_permit' | 'optional' | 'license' | 'rc_book' | 'vehicle_photo';
  file: File | null;
  preview: string;
}

export const AddVehiclePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: '10-wheel',
    vehicleSize: 14,
    vehicleWeight: 10,
    dimensions: {
      length: 14,
      breadth: 6
    },
    vehicleNumber: '',
    passingLimit: 10,
    availability: 'today' as 'today' | 'tomorrow' | 'immediate',
    isOpen: true,
    tarpaulin: 'one' as 'one' | 'two' | 'none',
    trailerType: 'none' as 'lowbed' | 'semi-lowbed' | 'hydraulic-axle-8' | 'crane-14t' | 'crane-25t' | 'crane-50t' | 'crane-100t' | 'crane-200t' | 'none',
    preferredOperatingArea: {
      state: '',
      district: '',
      place: ''
    }
  });

  const [photos, setPhotos] = useState<VehiclePhoto[]>([
    { type: 'front', file: null, preview: '' },
    { type: 'side', file: null, preview: '' },
    { type: 'back', file: null, preview: '' },
    { type: 'license', file: null, preview: '' },
    { type: 'rc_book', file: null, preview: '' },
    { type: 'vehicle_photo', file: null, preview: '' }
  ]);

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      const response = await profileAPI.getCompletionStatus();
      if (response.data.success) {
        setProfileComplete(response.data.data.isComplete);
        if (!response.data.data.isComplete) {
          toast.error('Please complete your profile first');
          navigate('/profile/complete');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (index: number, file: File) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index] = {
      ...updatedPhotos[index],
      file,
      preview: URL.createObjectURL(file)
    };
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required photos
      const requiredPhotos = photos.filter(photo => 
        ['front', 'side', 'back', 'rc_permit'].includes(photo.type) && photo.file
      );
      
      if (requiredPhotos.length < 4) {
        toast.error('Please upload all required photos (Front, Side, Back, RC/Permit)');
        return;
      }

      const response = await vehicleAPI.createVehicle(formData);
      
      if (response.data.success) {
        const vehicleId = response.data.data._id;
        
        // Upload photos
        const photoData = photos
          .filter(photo => photo.file)
          .map(photo => ({
            type: photo.type,
            base64: photo.preview // In real implementation, convert file to base64
          }));

        if (photoData.length > 0) {
          await vehicleAPI.uploadVehiclePhotos(vehicleId, photoData);
        }

        toast.success('Vehicle registered successfully! Waiting for admin approval.');
        navigate('/my-vehicles');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!profileComplete) {
    return null; // Will redirect to profile completion
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Vehicle</h1>
          <p className="text-slate-600">Register your vehicle to start receiving load assignments</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <TruckIcon className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold text-slate-900">Vehicle Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                >
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vehicle Size (ft) *
                </label>
                <select
                  value={formData.vehicleSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleSize: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                >
                  {[6, 8.5, 10, 14, 17, 19, 20, 22, 24].map(size => (
                    <option key={size} value={size}>{size} ft</option>
                  ))}
                </select>
              </div>

              <Input
                label="Vehicle Weight (Tons)"
                type="number"
                value={formData.vehicleWeight.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, vehicleWeight: Number(value) }))}
                required
              />

              <Input
                label="Length (ft)"
                type="number"
                value={formData.dimensions.length.toString()}
                onChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  dimensions: { ...prev.dimensions, length: Number(value) }
                }))}
                required
              />

              <Input
                label="Breadth (ft)"
                type="number"
                value={formData.dimensions.breadth.toString()}
                onChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  dimensions: { ...prev.dimensions, breadth: Number(value) }
                }))}
                required
              />

              <Input
                label="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(value) => setFormData(prev => ({ ...prev, vehicleNumber: value.toUpperCase() }))}
                placeholder="e.g., KA01AB1234"
                required
              />

              <Input
                label="Passing Limit (Tons)"
                type="number"
                value={formData.passingLimit.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, passingLimit: Number(value) }))}
                required
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Availability *
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value as any }))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                >
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="immediate">Immediate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vehicle Body Type *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.isOpen}
                      onChange={() => setFormData(prev => ({ ...prev, isOpen: true }))}
                      className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">Open</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.isOpen}
                      onChange={() => setFormData(prev => ({ ...prev, isOpen: false }))}
                      className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">Closed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tarpaulin *
                </label>
                <select
                  value={formData.tarpaulin}
                  onChange={(e) => setFormData(prev => ({ ...prev, tarpaulin: e.target.value as any }))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                >
                  <option value="one">One</option>
                  <option value="two">Two</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Trailer Type
                </label>
                <select
                  value={formData.trailerType}
                  onChange={(e) => setFormData(prev => ({ ...prev, trailerType: e.target.value as any }))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                >
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
              </div>
            </div>
          </motion.div>

          {/* Operating Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MapPinIcon className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold text-slate-900">Preferred Operating Area</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="State"
                value={formData.preferredOperatingArea.state}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  preferredOperatingArea: { ...prev.preferredOperatingArea, state: value }
                }))}
                required
              />

              <Input
                label="District"
                value={formData.preferredOperatingArea.district}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  preferredOperatingArea: { ...prev.preferredOperatingArea, district: value }
                }))}
                required
              />

              <Input
                label="Place"
                value={formData.preferredOperatingArea.place}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  preferredOperatingArea: { ...prev.preferredOperatingArea, place: value }
                }))}
                required
              />
            </div>
          </motion.div>

          {/* Vehicle Photos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold text-slate-900">Vehicle Documents & Photos</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {photos.map((photo, index) => (
                <div key={index} className="text-center">
                  <div className="w-full h-40 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    {photo.preview ? (
                      <img
                        src={photo.preview}
                        alt={photo.type}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PhotoIcon className="h-12 w-12 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(index, file);
                    }}
                    className="hidden"
                    id={`photo-${index}`}
                  />
                  <label
                    htmlFor={`photo-${index}`}
                    className="text-sm text-emerald-600 cursor-pointer hover:text-emerald-700 font-medium capitalize"
                  >
                    {photo.type.replace('_', ' ').replace('rc book', 'RC Book')} 
                    {['front', 'side', 'back', 'license', 'rc_book'].includes(photo.type) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    {photo.type === 'license' ? 'Upload License' : 
                     photo.type === 'rc_book' ? 'Upload RC Book' : 
                     photo.type === 'vehicle_photo' ? 'Vehicle Photo' : 
                     `${photo.type} view`}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Front, Side, Back, License, and RC Book uploads are required. 
                Vehicle Photo can be used for interior, tyres, or any additional details.
              </p>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <Button
              type="submit"
              loading={submitting}
              size="lg"
              className="px-12"
              variant="secondary"
            >
              Register Vehicle
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};