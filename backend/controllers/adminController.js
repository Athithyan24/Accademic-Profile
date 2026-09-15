import Department from '../models/Department.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// --- DEPARTMENT MANAGEMENT ---

// @desc    Create a new department
// @route   POST /api/admin/departments
export const createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;
    
    const existingDept = await Department.findOne({ code });
    if (existingDept) return res.status(400).json({ message: "Department code already exists" });

    const department = await Department.create({ name, code });
    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- STAFF MANAGEMENT ---

// @desc    Create a new staff member and assign to department
// @route   POST /api/admin/staff
export const createStaff = async (req, res) => {
  try {
    const { 
      username, 
      password, 
      departmentId,
      fullName,
      phone,
      email,
      address,
      dob,
      dateOfJoining,
      experience,
      qualifications,
      skills,
      awards,
      profilePic,
      documentProof
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      username,
      password: hashedPassword,
      role: 'staff',
      department: departmentId,
      staffDetails: {
        fullName,
        phone,
        email,
        address,
        dob,
        dateOfJoining,
        experience: typeof experience === 'string' ? JSON.parse(experience || '[]') : experience,
        qualifications: Array.isArray(qualifications) ? qualifications : qualifications?.split(',').map(s => s.trim()),
        skills: Array.isArray(skills) ? skills : skills?.split(',').map(s => s.trim()),
        awards: Array.isArray(awards) ? awards : awards?.split(',').map(s => s.trim()),
        profilePic,
        documentProof
      }
    });

    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/admin/staff
export const getStaff = async (req, res) => {
  try {
    // Find all users with role 'staff' and populate their department details
    const staff = await User.find({ role: 'staff' })
                            .select('-password') // Exclude passwords from response
                            .populate('department', 'name code');
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};