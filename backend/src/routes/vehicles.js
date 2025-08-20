import express from 'express';
import {
  createVehicle,
  getMyVehicles,
  getVehicle,
  uploadVehiclePhotos,
  updateVehicleStatus,
  getAvailableVehicles
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('vehicle_owner'), createVehicle);
router.get('/', protect, authorize('vehicle_owner'), getMyVehicles);
router.get('/available', protect, getAvailableVehicles);
router.get('/:id', protect, getVehicle);
router.post('/:id/photos', protect, authorize('vehicle_owner'), uploadVehiclePhotos);
router.put('/:id/status', protect, authorize('vehicle_owner'), updateVehicleStatus);

export default router;
