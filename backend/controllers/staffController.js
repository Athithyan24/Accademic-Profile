import User from '../models/User.js';
import Mark from '../models/Mark.js';
import bcrypt from 'bcryptjs';

// --- STUDENT MANAGEMENT ---

// @desc    Create a student under the staff's department
// @route   POST /api/staff/students
export const createStudent = async (req, res) => {
  try {
    const { 
      username, password, firstName, lastName, fatherName, motherName, 
      guardianName, phone, address, aadhaarNumber, bankAccountNo, bloodGroup, 
      dob, dateOfAdmission, sslcTotal, hscTotal, profilePic, passbookPic, tcDoc,
      communityCert, incomeCert, nativityCert, birthCert, adharCert
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      username,
      password: hashedPassword,
      role: 'student',
      department: req.user.department,
      studentDetails: {
        firstName, lastName, profilePic,
        parents: { fatherName, motherName, guardianName },
        address, phone, aadhaarNumber, bankAccountNo, passbookPic, tcDoc,
        bloodGroup, dob, dateOfAdmission, 
        sslcTotal: Number(sslcTotal), hscTotal: Number(hscTotal),
        communityCert, incomeCert, nativityCert, birthCert, adharCert
      }
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all students in the staff's department
// @route   GET /api/staff/students
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ 
      role: 'student', 
      department: req.user.department 
    }).select('-password');
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a student (Must be in staff's department)
// @route   DELETE /api/staff/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndDelete({ 
      _id: req.params.id, 
      department: req.user.department 
    });

    if (!student) return res.status(404).json({ message: "Student not found in your department" });
    
    // Optionally delete associated marks
    await Mark.deleteMany({ student: req.params.id });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- MARKS MANAGEMENT ---

// @desc    Add marks for a student
// @route   POST /api/staff/marks
export const addMark = async (req, res) => {
  try {
    const { studentId, subject, score, total, academicYear } = req.body;

    // Verify student belongs to staff's department
    const student = await User.findOne({ _id: studentId, department: req.user.department });
    if (!student) return res.status(404).json({ message: "Invalid student" });

    const mark = await Mark.create({
      student: studentId,
      subject,
      score,
      total: total || 100,
      academicYear
    });

    res.status(201).json({ message: "Marks added successfully", mark });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStaffProfile = async (req, res) => {
  try {
    const staff = await User.findById(req.user.id)
                              .select('-password')
                              .populate('department', 'name code');
    if (!staff) return res.status(404).json({ message: "Staff record not found" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};