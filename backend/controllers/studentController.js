import User from '../models/User.js';
import Mark from '../models/Mark.js';

// @desc    Get logged-in student's profile info
// @route   GET /api/student/profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
                              .select('-password')
                              .populate('department', 'name code');

    if (!student) return res.status(404).json({ message: "Student record not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged-in student's marks
// @route   GET /api/student/marks
export const getStudentMarks = async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.user.id });
    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};