import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/CustomButton';
import { Input } from '../common/CustomInput';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { profileAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
}

export const ProfileCompletion: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchCompletionStatus();
    fetchProfile();
  }, []);

  const fetchCompletionStatus = async () => {
    try {
      const response = await profileAPI.getCompletionStatus();
      if (response.data.success) {
        setCompletionStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching completion status:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await profileAPI.updateProfile(formData);
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        await refreshUser();
        await fetchCompletionStatus();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (completionStatus?.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Profile Complete!</h2>
          <p className="text-slate-600 mb-6">
            Your profile is fully set up. You can now access all platform features.
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
          <p className="text-slate-600">
            Please complete your profile to access all platform features
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {user?.role === 'load_provider' ? (
              <>
                {/* Address Information */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Address Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Street Address"
                      value={formData.address?.street || ''}
                      onChange={(value) => updateNestedFormData('address', 'street', value)}
                      required
                    />
                    <Input
                      label="City"
                      value={formData.address?.city || ''}
                      onChange={(value) => updateNestedFormData('address', 'city', value)}
                      required
                    />
                    <Input
                      label="State"
                      value={formData.address?.state || ''}
                      onChange={(value) => updateNestedFormData('address', 'state', value)}
                      required
                    />
                    <Input
                      label="Pincode"
                      value={formData.address?.pincode || ''}
                      onChange={(value) => updateNestedFormData('address', 'pincode', value)}
                      required
                    />
                    <Input
                      label="Landmark (Optional)"
                      value={formData.address?.landmark || ''}
                      onChange={(value) => updateNestedFormData('address', 'landmark', value)}
                    />
                  </div>
                </div>

                {/* Business Details */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Business Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company Name"
                      value={formData.businessDetails?.companyName || ''}
                      onChange={(value) => updateNestedFormData('businessDetails', 'companyName', value)}
                      required
                    />
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        value={formData.businessDetails?.businessType || ''}
                        onChange={(e) => updateNestedFormData('businessDetails', 'businessType', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        required
                      >
                        <option value="">Select Business Type</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="trader">Trader</option>
                        <option value="logistics">Logistics</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Input
                      label="GST Number (Optional)"
                      value={formData.businessDetails?.gstNumber || ''}
                      onChange={(value) => updateNestedFormData('businessDetails', 'gstNumber', value)}
                    />
                    <Input
                      label="PAN Number (Optional)"
                      value={formData.businessDetails?.panNumber || ''}
                      onChange={(value) => updateNestedFormData('businessDetails', 'panNumber', value)}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Address Information */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <UserIcon className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Address Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Street Address"
                      value={formData.address?.street || ''}
                      onChange={(value) => updateNestedFormData('address', 'street', value)}
                      required
                    />
                    <Input
                      label="City"
                      value={formData.address?.city || ''}
                      onChange={(value) => updateNestedFormData('address', 'city', value)}
                      required
                    />
                    <Input
                      label="State"
                      value={formData.address?.state || ''}
                      onChange={(value) => updateNestedFormData('address', 'state', value)}
                      required
                    />
                    <Input
                      label="Pincode"
                      value={formData.address?.pincode || ''}
                      onChange={(value) => updateNestedFormData('address', 'pincode', value)}
                      required
                    />
                    <Input
                      label="Landmark (Optional)"
                      value={formData.address?.landmark || ''}
                      onChange={(value) => updateNestedFormData('address', 'landmark', value)}
                    />
                  </div>
                </div>

                {/* License Information */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">License Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="License Number"
                      value={formData.licenseNumber || ''}
                      onChange={(value) => updateFormData('licenseNumber', value)}
                      required
                    />
                    <Input
                      label="License Expiry Date"
                      type="date"
                      value={formData.licenseExpiry ? new Date(formData.licenseExpiry).toISOString().split('T')[0] : ''}
                      onChange={(value) => updateFormData('licenseExpiry', value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-6 border-t border-slate-200">
              <Button
                type="submit"
                loading={updating}
                size="lg"
                className="px-8"
              >
                Complete Profile
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};