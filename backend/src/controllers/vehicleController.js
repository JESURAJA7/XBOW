import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (Vehicle Owner only)
export const createVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      vehicleSize,
      vehicleWeight,
      dimensions,
      vehicleNumber,
      passingLimit,
      availability,
      isOpen,
      tarpaulin,
      trailerType,
      preferredOperatingArea
    } = req.body;

    const vehicle = await Vehicle.create({
      ownerId: req.user._id,
      ownerName: req.user.name,
      vehicleType,
      vehicleSize,
      vehicleWeight,
      dimensions,
      vehicleNumber,
      passingLimit,
      availability,
      isOpen,
      tarpaulin,
      trailerType,
      preferredOperatingArea
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalVehicles: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all vehicles for vehicle owner
// @route   GET /api/vehicles
// @access  Private (Vehicle Owner)
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('ownerId', 'name phone email');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (
      req.user.role === 'vehicle_owner' &&
      vehicle.ownerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this vehicle'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload vehicle photos
// @route   POST /api/vehicles/:id/photos
// @access  Private (Vehicle Owner)
export const uploadVehiclePhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const { photos } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    const uploadedPhotos = [];

    for (const photo of photos) {
      const result = await cloudinary.uploader.upload(photo.base64, {
        folder: `xbow/vehicles/${id}`,
        resource_type: 'auto'
      });

      uploadedPhotos.push({
        type: photo.type,
        url: result.secure_url,
        publicId: result.public_id
      });
    }

    vehicle.photos = uploadedPhotos;
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vehicle status
// @route   PUT /api/vehicles/:id/status
// @access  Private (Vehicle Owner)
export const updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    vehicle.status = status;
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle status updated successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get available vehicles for loads
// @route   GET /api/vehicles/available
// @access  Private (Admin, Load Provider)
export const getAvailableVehicles = async (req, res) => {
  try {
    const { state, district, vehicleSize, vehicleType } = req.query;

    let query = {
      status: 'available',
      isApproved: true
    };

    if (state) {
      query['preferredOperatingArea.state'] = state;
    }

    if (district) {
      query['preferredOperatingArea.district'] = district;
    }

    if (vehicleSize) {
      query.passingLimit = { $gte: vehicleSize };
    }

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    const vehicles = await Vehicle.find(query)
      .populate('ownerId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
