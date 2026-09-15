import express from 'express';
import { getStudentProfile, getStudentMarks } from '../controllers/studentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Restrict access to logged-in students only
router.use(protect, authorizeRoles('student'));

router.get('/profile', getStudentProfile);
router.get('/marks', getStudentMarks);

export default router;