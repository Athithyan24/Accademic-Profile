import express from 'express';
import { 
  createStudent, 
  getStudents, 
  deleteStudent, 
  addMark,
  getStaffProfile
} from '../controllers/staffController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles('staff'));

router.get('/profile', getStaffProfile);

router.route('/students')
  .post(createStudent)
  .get(getStudents);

router.route('/students/:id')
  .delete(deleteStudent);

router.post('/marks', addMark);

export default router;