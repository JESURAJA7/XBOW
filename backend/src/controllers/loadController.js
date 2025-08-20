import Load from '../models/Load.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create new load
// @route   POST /api/loads
// @access  Private (Load Provider only)
export const createLoad = async (req, res) => {
  try {
    const {
      loadingLocation,
      unloadingLocation,
      vehicleRequirement,
      materials,
      loadingDate,
      loadingTime,
      paymentTerms,
      withXBowSupport
    } = req.body;

    const load = await Load.create({
      loadProviderId: req.user._id,
      loadProviderName: req.user.name,
      loadingLocation,
      unloadingLocation,
      vehicleRequirement,
      materials,
      loadingDate,
      loadingTime,
      paymentTerms,
      withXBowSupport
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalLoadsPosted: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Load created successfully',
      data: load
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all loads for load provider
// @route   GET /api/loads
// @access  Private (Load Provider)
export const getMyLoads = async (req, res) => {
  try {
    const loads = await Load.find({ loadProviderId: req.user._id })
      .populate('assignedVehicleId', 'vehicleNumber ownerName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: loads.length,
      data: loads
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get available loads for vehicle owners
// @route   GET /api/loads/available
// @access  Private (Vehicle Owner)
export const getAvailableLoads = async (req, res) => {
  try {
    const { state, district, vehicleSize, vehicleType, trailerType } = req.query;

    let query = { status: 'posted' };

    if (state) {
      query['loadingLocation.state'] = state;
    }

    if (district) {
      query['loadingLocation.district'] = district;
    }

    if (vehicleSize) {
      query['vehicleRequirement.size'] = vehicleSize;
    }

    if (vehicleType) {
      query['vehicleRequirement.vehicleType'] = vehicleType;
    }

    if (trailerType && trailerType !== 'none') {
      query['vehicleRequirement.trailerType'] = trailerType;
    }

    const loads = await Load.find(query)
      .populate('loadProviderId', 'name phone companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: loads.length,
      data: loads
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single load
// @route   GET /api/loads/:id
// @access  Private
export const getLoad = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id)
      .populate('loadProviderId', 'name phone email companyName')
      .populate('assignedVehicleId', 'vehicleNumber ownerName');

    if (!load) {
      return res.status(404).json({
        success: false,
        message: 'Load not found'
      });
    }

    if (req.user.role === 'load_provider' && load.loadProviderId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this load'
      });
    }

    res.status(200).json({
      success: true,
      data: load
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload material photos
// @route   POST /api/loads/:id/materials/:materialIndex/photos
// @access  Private (Load Provider)
export const uploadMaterialPhotos = async (req, res) => {
  try {
    const { id, materialIndex } = req.params;
    const { photos } = req.body;

    const load = await Load.findById(id);
    if (!load) {
      return res.status(404).json({
        success: false,
        message: 'Load not found'
      });
    }

    if (load.loadProviderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this load'
      });
    }

    const materialIdx = parseInt(materialIndex);
    if (materialIdx >= load.materials.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material index'
      });
    }

    const uploadedPhotos = [];
    for (const photo of photos) {
      const result = await cloudinary.uploader.upload(photo.base64, {
        folder: `xbow/loads/${id}/materials/${materialIdx}`,
        resource_type: 'auto'
      });

      uploadedPhotos.push({
        type: photo.type,
        url: result.secure_url,
        publicId: result.public_id
      });
    }

    load.materials[materialIdx].photos = uploadedPhotos;
    await load.save();

    res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      data: load.materials[materialIdx]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update load status
// @route   PUT /api/loads/:id/status
// @access  Private (Admin or Load Provider)
export const updateLoadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const load = await Load.findById(id);
    if (!load) {
      return res.status(404).json({
        success: false,
        message: 'Load not found'
      });
    }

    if (req.user.role !== 'admin' && load.loadProviderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this load'
      });
    }

    load.status = status;
    await load.save();

    res.status(200).json({
      success: true,
      message: 'Load status updated successfully',
      data: load
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
