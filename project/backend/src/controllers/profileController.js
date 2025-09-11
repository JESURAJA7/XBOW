import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };
    
    const user = await User.findById(userId);

    if (user.role === 'load_provider') {
      const requiredFields = ['address', 'businessDetails'];
      const isComplete = requiredFields.every(field => {
        if (field === 'address') {
          return updateData.address?.street && updateData.address?.city && 
                 updateData.address?.state && updateData.address?.pincode;
        }
        if (field === 'businessDetails') {
          return updateData.businessDetails?.companyName && updateData.businessDetails?.businessType;
        }
        return updateData[field] || user[field];
      });
      if (isComplete) {
        updateData.profileCompleted = true;
      }
    } else if (user.role === 'vehicle_owner') {
      const requiredFields = ['address', 'licenseNumber', 'licenseExpiry'];
      const isComplete = requiredFields.every(field => {
        if (field === 'address') {
          return updateData.address?.street && updateData.address?.city && 
                 updateData.address?.state && updateData.address?.pincode;
        }
        return updateData[field] || user[field];
      });
      if (isComplete) {
        updateData.profileCompleted = true;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload profile documents
// @route   POST /api/profile/documents
// @access  Private
export const uploadDocuments = async (req, res) => {
  try {
    const { documents } = req.body; // Array of { type, base64 }
    const userId = req.user._id;

    const uploadedDocs = [];
    for (const doc of documents) {
      const result = await cloudinary.uploader.upload(doc.base64, {
        folder: `xbow/users/${userId}/documents`,
        resource_type: 'auto'
      });

      uploadedDocs.push({
        type: doc.type,
        url: result.secure_url,
        publicId: result.public_id
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { documents: { $each: uploadedDocs } } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check profile completion status
// @route   GET /api/profile/completion-status
// @access  Private
export const getProfileCompletionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    let completionStatus = {
      isComplete: user.profileCompleted,
      missingFields: []
    };

    if (!user.profileCompleted) {
      if (user.role === 'load_provider') {
        const requiredFields = [
          { field: 'address', label: 'Address' },
          { field: 'businessDetails', label: 'Business Details' }
        ];

        requiredFields.forEach(({ field, label }) => {
          if (field === 'address') {
            if (!user.address?.street || !user.address?.city || 
                !user.address?.state || !user.address?.pincode) {
              completionStatus.missingFields.push(label);
            }
          } else if (field === 'businessDetails') {
            if (!user.businessDetails?.companyName || !user.businessDetails?.businessType) {
              completionStatus.missingFields.push(label);
            }
          } else if (!user[field]) {
            completionStatus.missingFields.push(label);
          }
        });
      } else if (user.role === 'vehicle_owner') {
        const requiredFields = [
          { field: 'address', label: 'Address' },
          { field: 'licenseNumber', label: 'License Number' },
          { field: 'licenseExpiry', label: 'License Expiry' }
        ];

        requiredFields.forEach(({ field, label }) => {
          if (field === 'address') {
            if (!user.address?.street || !user.address?.city || 
                !user.address?.state || !user.address?.pincode) {
              completionStatus.missingFields.push(label);
            }
          } else if (!user[field]) {
            completionStatus.missingFields.push(label);
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      data: completionStatus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
