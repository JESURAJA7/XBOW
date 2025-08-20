// routes/profile.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadDocuments,
  getProfileCompletionStatus
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All profile routes require authentication

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/documents', uploadDocuments);
router.get('/completion-status', getProfileCompletionStatus);

export default router;
