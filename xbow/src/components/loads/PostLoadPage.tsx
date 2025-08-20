import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    PlusIcon,
    TrashIcon,
    PhotoIcon,
    MapPinIcon,
    TruckIcon,
    DocumentTextIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/CustomButton';
import { Input } from '../common/CustomInput';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MapLocationSelector } from '../MapModal/MapLocationSelector';
import { RouteMapPreview } from '../MapModal/RouteMapPreview';
import { loadAPI, profileAPI } from '../../services/api';
import toast from 'react-hot-toast';
import type { FormData, Material, MaterialPhoto } from '../../types/index';

export const PostLoadPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [profileComplete, setProfileComplete] = useState(false);
    const [mapSelector, setMapSelector] = useState<{
        isOpen: boolean;
        type: 'loading' | 'unloading';
    }>({ isOpen: false, type: 'loading' });

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        loadingLocation: {
            address: '',
            city: '',
            state: '',
            zipCode: '',
            coordinates: { latitude: 0, longitude: 0 },
            pincode: '',
            district: '',
            place: ''
        },
        unloadingLocation: {
            address: '',
            city: '',
            state: '',
            zipCode: '',
            coordinates: { latitude: 0, longitude: 0 },
            pincode: '',
            district: '',
            place: ''
        },
        pickupDate: '',
        deliveryDate: '',
        weight: '',
        dimensions: { length: '', width: '', height: '' },
        specialRequirements: '',
        rate: '',
        vehicleRequirement: {
            vehicleType: '2-wheel',
            size: 6,
            trailerType: 'none'
        },
        materials: [],
        loadingDate: '',
        loadingTime: '',
        paymentTerms: 'advance',
        withXBowSupport: false
    });

    const [materials, setMaterials] = useState<Material[]>([
        {
            name: '',
            packType: 'single',
            totalCount: 0,
            dimensions: { length: 0, width: 0, height: 0 },
            singleWeight: 0,
            totalWeight: 0,
            photos: [
                { type: 'material_front', file: null, preview: null },
                { type: 'material_back', file: null, preview: null },
                { type: 'material_left', file: null, preview: null },
                { type: 'material_right', file: null, preview: null }
            ]
        }
    ]);

    useEffect(() => {
        checkProfileCompletion();
        // Update formData materials when materials state changes
        setFormData(prev => ({ ...prev, materials }));
    }, [materials]);

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

    const handleInputChange = (field: string, value: any) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as object),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleLocationChange = (locationType: 'loadingLocation' | 'unloadingLocation', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [locationType]: {
                ...prev[locationType],
                [field]: value
            }
        }));
    };

    const addMaterial = () => {
        if (materials.length < 5) {
            setMaterials([...materials, {
                name: '',
                packType: 'single',
                totalCount: 0,
                dimensions: { length: 0, width: 0, height: 0 },
                singleWeight: 0,
                totalWeight: 0,
                photos: [
                    { type: 'material_front', file: null, preview: null },
                    { type: 'material_back', file: null, preview: null },
                    { type: 'material_left', file: null, preview: null },
                    { type: 'material_right', file: null, preview: null }
                ]
            }]);
        }
    };

    const removeMaterial = (index: number) => {
        const updatedMaterials = materials.filter((_, i) => i !== index);
        setMaterials(updatedMaterials);
    };

    const updateMaterial = (index: number, field: string, value: any) => {
        const updatedMaterials = materials.map((material, i) =>
            i === index ? {
                ...material,
                ...(field.includes('.') ? {
                    [field.split('.')[0]]: {
                        ...((material[field.split('.')[0] as keyof Material] || {}) as object),
                        [field.split('.')[1]]: value
                    }
                } : { [field]: value }),
                // Auto-calculate total weight when single weight or total count changes
                totalWeight: field === 'singleWeight' || field === 'totalCount'
                    ? (field === 'singleWeight' ? value : material.singleWeight) *
                    (field === 'totalCount' ? value : material.totalCount)
                    : material.totalWeight
            } : material
        );
        setMaterials(updatedMaterials);
    };

    const handlePhotoUpload = (materialIndex: number, photoIndex: number, file: File) => {
        const updatedMaterials = [...materials];
        const reader = new FileReader();

        reader.onload = (e) => {
            updatedMaterials[materialIndex].photos[photoIndex] = {
                ...updatedMaterials[materialIndex].photos[photoIndex],
                file,
                preview: e.target?.result as string
            };
            setMaterials(updatedMaterials);
        };

        reader.readAsDataURL(file);
    };

    const handleLocationSelect = (location: any, type: 'loading' | 'unloading') => {
        setFormData(prev => ({
            ...prev,
            [`${type}Location`]: location
        }));
    };

    const openMapSelector = (type: 'loading' | 'unloading') => {
        setMapSelector({ isOpen: true, type });
    };

    const closeMapSelector = () => {
        setMapSelector({ isOpen: false, type: 'loading' });
    };

    const hasValidCoordinates = (location: any) => {
        return location.coordinates.latitude !== 0 && location.coordinates.longitude !== 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profileComplete) {
            toast.error('Please complete your profile before creating loads');
            navigate('/profile');
            return;
        }

        setSubmitting(true);

        try {
            const loadData = {
                ...formData,
                materials,
                status: 'active'
            };

            await loadAPI.createLoad(loadData);
            toast.success('Load created successfully!');
            navigate('/loads');
        } catch (error: any) {
            console.error('Error creating load:', error);
            toast.error(error.response?.data?.message || 'Failed to create load');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!profileComplete) {
        return (
            <div className="min-h-screen bg-slate-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center"
                    >
                        <DocumentTextIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Complete Your Profile First
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Before you can create loads, please complete your company profile with all required information.
                        </p>
                        <Button
                            onClick={() => navigate('/profile')}
                            className="w-full sm:w-auto"
                        >
                            Complete Profile
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Load</h1>
                    <p className="text-slate-600">Post a new load for carriers to bid on</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Load Title"
                                value={formData.title}
                                onChange={(value: string) => handleInputChange('title', value)}
                                placeholder="e.g., Steel coils from Chicago to Detroit"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Provide detailed information about the load..."
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Locations */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.13 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Pickup & Delivery Locations
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Loading Location */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-slate-900">Loading Location</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openMapSelector('loading')}
                                        icon={<GlobeAltIcon className="h-4 w-4" />}
                                    >
                                        Select on Map
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Input
                                            label="Address"
                                            value={formData.loadingLocation.address}
                                            onChange={(value: string) => handleLocationChange('loadingLocation', 'address', value)}
                                            placeholder="123 Main St"
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="City"
                                        value={formData.loadingLocation.city}
                                        onChange={(value: string) => handleLocationChange('loadingLocation', 'city', value)}
                                        placeholder="Chicago"
                                        required
                                    />
                                    <Input
                                        label="State"
                                        value={formData.loadingLocation.state}
                                        onChange={(value: string) => handleLocationChange('loadingLocation', 'state', value)}
                                        placeholder="IL"
                                        required
                                    />
                                    <Input
                                        label=" Pin Code"
                                        value={formData.loadingLocation.zipCode}
                                        onChange={(value: string) => handleLocationChange('loadingLocation', 'zipCode', value)}
                                        placeholder="60601"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Unloading Location */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-slate-900">Unloading Location</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openMapSelector('unloading')}
                                        icon={<GlobeAltIcon className="h-4 w-4" />}
                                    >
                                        Select on Map
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Input
                                            label="Address"
                                            value={formData.unloadingLocation.address}
                                            onChange={(value: string) => handleLocationChange('unloadingLocation', 'address', value)}
                                            placeholder="456 Oak Ave"
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="City"
                                        value={formData.unloadingLocation.city}
                                        onChange={(value: string) => handleLocationChange('unloadingLocation', 'city', value)}
                                        placeholder="Detroit"
                                        required
                                    />
                                    <Input
                                        label="State"
                                        value={formData.unloadingLocation.state}
                                        onChange={(value: string) => handleLocationChange('unloadingLocation', 'state', value)}
                                        placeholder="MI"
                                        required
                                    />
                                    <Input
                                        label="Pin Code"
                                        value={formData.unloadingLocation.zipCode}
                                        onChange={(value: string) => handleLocationChange('unloadingLocation', 'zipCode', value)}
                                        placeholder="48201"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Route Preview */}
                    {hasValidCoordinates(formData.loadingLocation) && hasValidCoordinates(formData.unloadingLocation) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <RouteMapPreview
                                loadingLocation={formData.loadingLocation}
                                unloadingLocation={formData.unloadingLocation}
                            />
                        </motion.div>
                    )}

                    {/* Vehicle Requirements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <TruckIcon className="h-6 w-6 text-blue-600" />
                            <h3 className="text-xl font-semibold text-slate-900">Vehicle Requirements</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Vehicle Type *
                                </label>
                                <select
                                    value={formData.vehicleRequirement.vehicleType}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        vehicleRequirement: { ...prev.vehicleRequirement, vehicleType: e.target.value }
                                    }))}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
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
                                    value={formData.vehicleRequirement.size}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        vehicleRequirement: { ...prev.vehicleRequirement, size: Number(e.target.value) }
                                    }))}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                    required
                                >
                                    {[6, 8.5, 10, 14, 17, 19, 20, 22, 24].map(size => (
                                        <option key={size} value={size}>{size} ft</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Trailer Type
                                </label>
                                <select
                                    value={formData.vehicleRequirement.trailerType}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        vehicleRequirement: { ...prev.vehicleRequirement, trailerType: e.target.value }
                                    }))}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
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

                    {/* Materials Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Materials ({materials.length}/5)</h3>
                            </div>
                            {materials.length < 5 && (
                                <Button
                                    type="button"
                                    onClick={addMaterial}
                                    variant="outline"
                                    size="sm"
                                    icon={<PlusIcon className="h-4 w-4" />}
                                >
                                    Add Material
                                </Button>
                            )}
                        </div>

                        <div className="space-y-8">
                            {materials.map((material, index) => (
                                <div key={index} className="border border-slate-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-slate-900">Material {index + 1}</h4>
                                        {materials.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => removeMaterial(index)}
                                                variant="ghost"
                                                size="sm"
                                                icon={<TrashIcon className="h-4 w-4" />}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        <Input
                                            label="Material Name"
                                            value={material.name}
                                            onChange={(value) => updateMaterial(index, 'name', value)}
                                            required
                                        />
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Pack Type *
                                            </label>
                                            <select
                                                value={material.packType}
                                                onChange={(e) => updateMaterial(index, 'packType', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                required
                                            >
                                                <option value="single">Single Pack</option>
                                                <option value="multi">Multi Pack</option>
                                            </select>
                                        </div>
                                        <Input
                                            label="Total Count"
                                            type="number"
                                            value={material.totalCount.toString()}
                                            onChange={(value) => updateMaterial(index, 'totalCount', Number(value))}
                                            required
                                        />
                                        <Input
                                            label="Length (ft)"
                                            type="number"
                                            value={material.dimensions.length.toString()}
                                            onChange={(value) => updateMaterial(index, 'dimensions.length', Number(value))}
                                            required
                                        />
                                        <Input
                                            label="Width (ft)"
                                            type="number"
                                            value={material.dimensions.width.toString()}
                                            onChange={(value) => updateMaterial(index, 'dimensions.width', Number(value))}
                                            required
                                        />
                                        <Input
                                            label="Height (ft)"
                                            type="number"
                                            value={material.dimensions.height.toString()}
                                            onChange={(value) => updateMaterial(index, 'dimensions.height', Number(value))}
                                            required
                                        />
                                        <Input
                                            label="Single Weight (kg)"
                                            type="number"
                                            value={material.singleWeight.toString()}
                                            onChange={(value) => updateMaterial(index, 'singleWeight', Number(value))}
                                            required
                                        />
                                        <Input
                                            label="Total Weight (kg)"
                                            type="number"
                                            value={material.totalWeight.toString()}
                                            onChange={(value) => updateMaterial(index, 'totalWeight', Number(value))}
                                            disabled
                                        />
                                    </div>

                                    {/* Photo Upload Section */}
                                    <div>
                                        <h5 className="font-medium text-slate-900 mb-4">Material Photos (4 Required)</h5>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {material.photos.map((photo, photoIndex) => (
                                                <div key={photoIndex} className="text-center">
                                                    <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                                                        {photo.preview ? (
                                                            <img
                                                                src={photo.preview}
                                                                alt={photo.type}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <PhotoIcon className="h-8 w-8 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handlePhotoUpload(index, photoIndex, file);
                                                        }}
                                                        className="hidden"
                                                        id={`photo-${index}-${photoIndex}`}
                                                    />
                                                    <label
                                                        htmlFor={`photo-${index}-${photoIndex}`}
                                                        className="text-xs text-blue-600 cursor-pointer hover:text-blue-700 capitalize"
                                                    >
                                                        {photo.type.replace('material_', '').replace('_', ' ')}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Load Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h3 className="text-xl font-semibold text-slate-900 mb-6">Load Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Loading Date"
                                type="date"
                                value={formData.loadingDate}
                                onChange={(value) => setFormData(prev => ({ ...prev, loadingDate: value }))}
                                required
                            />

                            <Input
                                label="Loading Time"
                                type="time"
                                value={formData.loadingTime}
                                onChange={(value) => setFormData(prev => ({ ...prev, loadingTime: value }))}
                                required
                            />

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Payment Terms *
                                </label>
                                <select
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value as any }))}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                    required
                                >
                                    <option value="advance">Advance</option>
                                    <option value="cod">COD</option>
                                    <option value="after_pod">After POD</option>
                                    <option value="to_pay">To Pay</option>
                                    <option value="credit">Credit</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={formData.withXBowSupport}
                                    onChange={(e) => setFormData(prev => ({ ...prev, withXBowSupport: e.target.checked }))}
                                    className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    With X-Bow Support (Admin will contact vehicle owners manually - 5% commission applies)
                                </span>
                            </label>
                            <p className="text-xs text-slate-500 mt-2 ml-8">
                                Without X-Bow Support: Direct interaction between load provider and vehicle owners
                            </p>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="flex justify-end"
                    >
                        <Button
                            type="submit"
                            loading={submitting}
                            className="w-full sm:w-auto px-8"
                        >
                            Create Load
                        </Button>

                        <Button onClick={() => {

                            window.location.href = '/bidding';
                        }}>
                            Go to Bidding
                        </Button>
                    </motion.div>
                </form>

                {/* Map Location Selector Modal */}
                <MapLocationSelector
                    isOpen={mapSelector.isOpen}
                    onClose={closeMapSelector}
                    onLocationSelect={(location) => handleLocationSelect(location, mapSelector.type)}
                    title={`Select ${mapSelector.type === 'loading' ? 'Loading' : 'Unloading'} Location`}
                    initialLocation={
                        mapSelector.type === 'loading'
                            ? formData.loadingLocation
                            : formData.unloadingLocation
                    }
                />
            </div>
        </div>
    );
};

export default PostLoadPage;