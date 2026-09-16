import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'staff', 'student'], 
    required: true 
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department',
    default: null 
  },

  // --- EXTENDED STAFF DETAILS ---
  staffDetails: {
    fullName: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    dob: { type: Date },
    dateOfJoining: { type: Date },
    experience: [{
      from: { type: String },
      to: { type: String },
      role: { type: String },
      organization: { type: String }
    }],
    qualifications: [{ type: String }],
    skills: [{ type: String }],
    awards: [{ type: String }],
    profilePic: { type: String },     
    documentProof: { type: String }   
  },

  // --- EXTENDED STUDENT DETAILS ---
  studentDetails: {
    firstName: { type: String },
    lastName: { type: String },
    profilePic: { type: String },
    parents: {
      fatherName: { type: String },
      motherName: { type: String },
      guardianName: { type: String }
    },
    address: { type: String },
    phone: { type: String },
    aadhaarNumber: { type: String },
    bankAccountNo: { type: String },
    passbookPic: { type: String },
    tcDoc: { type: String, required: false },
    bloodGroup: { type: String },
    dob: { type: Date },
    dateOfAdmission: { type: Date },
    sslcTotal: { type: Number },
    hscTotal: { type: Number },
    // --- NEW CERTIFICATE FIELDS ---
    communityCert: { type: String },
    incomeCert: { type: String },
    nativityCert: { type: String },
    birthCert: { type: String },
    adharCert: { type: String }
  },

  academicYear: { type: String, default: null },
}, { timestamps: true });

// Auto-calculate Academic Year for Students before saving
userSchema.pre('save', function () {
  if (this.role === 'student' && this.studentDetails?.dateOfAdmission) {
    const admissionYear = new Date(this.studentDetails.dateOfAdmission).getFullYear();
    this.academicYear = `${admissionYear}-${admissionYear + 4}`; 
  }
});

export default mongoose.model('User', userSchema);