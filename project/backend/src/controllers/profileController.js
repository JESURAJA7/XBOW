import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to upload file to Cloudinary
const uploadToCloudinary = (file, folder, field) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            field,
            url: result.secure_url,
            publicId: result.public_id,
            type: field
          });
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

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
      
      // Check if required documents are uploaded for vehicle owners
      if (isComplete && updateData.documents) {
        const requiredDocs = ['ownerAadharFront', 'ownerAadharBack', 'ownerLicense'];
        if (updateData.ownerType === 'owner_with_driver') {
          requiredDocs.push('driverAadharFront', 'driverAadharBack', 'driverLicense');
        }
        
        const hasAllDocs = requiredDocs.every(docType => updateData.documents[docType]);
        if (hasAllDocs) {
          updateData.profileCompleted = true;
        }
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

// @desc    Upload single profile image
// @route   POST /api/profile/image
// @access  Private
export const uploadImage = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file was uploaded'
      });
    }

    const userId = req.user._id;
    const folder = req.body.folder || `xbow/users/${userId}/documents`;
    
    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid image file'
      });
    }

    // Validate file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size should be less than 5MB'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file, folder, 'image');

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        public_id: uploadResult.publicId
      }
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
};

// @desc    Upload multiple profile documents
// @route   POST /api/profile/documents
// @access  Private
export const uploadDocuments = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    const folder = `xbow/users/${userId}/documents`;
    
    // Validate all files before uploading
    for (const field in req.files) {
      const file = req.files[field];
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid image file`
        });
      }
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: `${field} size should be less than 5MB`
        });
      }
    }

    // Upload all files to Cloudinary
    const uploadPromises = [];
    for (const field in req.files) {
      const file = req.files[field];
      uploadPromises.push(uploadToCloudinary(file, folder, field));
    }

    const uploadResults = await Promise.all(uploadPromises);
    
    // Categorize documents
    const ownerDocs = [];
    const driverDocs = [];
    
    uploadResults.forEach(result => {
      const docData = {
        type: result.field,
        url: result.url,
        publicId: result.publicId
      };
      
      if (['ownerAadharFront', 'ownerAadharBack', 'ownerLicense'].includes(result.field)) {
        ownerDocs.push(docData);
      } else if (['driverAadharFront', 'driverAadharBack', 'driverLicense'].includes(result.field)) {
        driverDocs.push(docData);
      }
    });

    // Update user documents
    if (ownerDocs.length > 0) {
      user.ownerDocuments.push(...ownerDocs);
    }
    if (driverDocs.length > 0) {
      user.driverDocuments.push(...driverDocs);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: {
        ownerDocuments: user.ownerDocuments,
        driverDocuments: user.driverDocuments,
        uploadResults
      }
    });

  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload documents'
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

        // Check for required documents
        const requiredDocs = ['ownerAadharFront', 'ownerAadharBack', 'ownerLicense'];
        const uploadedOwnerDocs = user.ownerDocuments?.map(doc => doc.type) || [];
        
        requiredDocs.forEach(docType => {
          if (!uploadedOwnerDocs.includes(docType)) {
            completionStatus.missingFields.push(`${docType.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          }
        });

        // Check driver documents if owner with driver
        if (user.ownerType === 'owner_with_driver') {
          const requiredDriverDocs = ['driverAadharFront', 'driverAadharBack', 'driverLicense'];
          const uploadedDriverDocs = user.driverDocuments?.map(doc => doc.type) || [];
          
          requiredDriverDocs.forEach(docType => {
            if (!uploadedDriverDocs.includes(docType)) {
              completionStatus.missingFields.push(`${docType.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            }
          });
        }
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

// @desc    Delete uploaded document
// @route   DELETE /api/profile/document/:publicId
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const { publicId } = req.params;
    const userId = req.user._id;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from user documents
    const user = await User.findById(userId);
    user.ownerDocuments = user.ownerDocuments.filter(doc => doc.publicId !== publicId);
    user.driverDocuments = user.driverDocuments.filter(doc => doc.publicId !== publicId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete document'
    });
  }
};