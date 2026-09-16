import express from 'express';
import multer from 'multer';
import { createDepartment, getDepartments, createStaff, getStaff } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure an 'uploads' folder exists in your backend root
  },
  filename: (req, file, cb) => {
    // Prevent filename collisions by prefixing the current timestamp
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

// Apply auth middleware
router.use(protect, authorizeRoles('admin'));

// Department Routes
router.post('/departments', createDepartment);
router.get('/departments', getDepartments);

// Staff Routes (Now injected with Multer to handle the two specific fields)
router.post('/staff', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'documentProof', maxCount: 1 }
]), createStaff);

router.get('/staff', getStaff);

export default router;