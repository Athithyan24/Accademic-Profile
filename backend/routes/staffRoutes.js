import express from 'express';
import { 
  createStudent, 
  getStudents, 
  deleteStudent, 
  addMark 
} from '../controllers/staffController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce staff-only access
router.use(protect, authorizeRoles('staff'));

// Student Routes
router.route('/students')
  .post(createStudent)
  .get(getStudents);

router.route('/students/:id')
  .delete(deleteStudent);

// Marks Routes
router.post('/marks', addMark);

export default router;