import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, default: 100 },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Mark', markSchema);