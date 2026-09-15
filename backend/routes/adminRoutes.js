import express from 'express';
import { createDepartment, getDepartments, createStaff, getStaff } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply middleware to all routes in this file
// Only logged-in Admins can access these endpoints
router.use(protect, authorizeRoles('admin'));

// Department Routes
router.post('/departments', createDepartment);
router.get('/departments', getDepartments);

// Staff Routes
router.post('/staff', createStaff);
router.get('/staff', getStaff);

export default router;