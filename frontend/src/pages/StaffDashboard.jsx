import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, UserPlus, BookOpen, Trash2, 
  ShieldAlert, CheckCircle2, Plus, User, FileText, CreditCard 
} from 'lucide-react';
import API from '../services/api';

export default function StaffDashboard() {
  const [students, setStudents] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [studentTab, setStudentTab] = useState('personal');

  // Payload structure mapped for student admission
  const [studentForm, setStudentForm] = useState({
    username: '', password: '', firstName: '', lastName: '',
    fatherName: '', motherName: '', guardianName: '', phone: '', address: '',
    aadhaarNumber: '', bankAccountNo: '', bloodGroup: '', dob: '', dateOfAdmission: '',
    sslcTotal: '', hscTotal: '', profilePic: '', passbookPic: '', tcDoc: ''
  });

  const [markForm, setMarkForm] = useState({ 
    studentId: '', subject: '', score: '', total: 100, academicYear: '2025-2026' 
  });

  const fetchStudents = async () => {
    try {
      const res = await API.get('/staff/students');
      setStudents(res.data);
    } catch (error) {
      showNotification('error', 'Failed to load student roster.');
    }
  };

  useEffect(() => { 
    fetchStudents(); 
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/staff/students', studentForm);
      showNotification('success', 'Student account registered successfully!');
      
      // Reset form state to initial values[cite: 47]
      setStudentForm({
        username: '', password: '', firstName: '', lastName: '',
        fatherName: '', motherName: '', guardianName: '', phone: '', address: '',
        aadhaarNumber: '', bankAccountNo: '', bloodGroup: '', dob: '', dateOfAdmission: '',
        sslcTotal: '', hscTotal: '', profilePic: '', passbookPic: '', tcDoc: ''
      });
      setStudentTab('personal');
      fetchStudents();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Error registering student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await API.delete(`/staff/students/${id}`);
      showNotification('success', 'Student removed successfully.');
      fetchStudents();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Error deleting student');
    }
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    try {
      await API.post('/staff/marks', markForm);
      showNotification('success', 'Academic mark recorded successfully!');
      setMarkForm({ studentId: '', subject: '', score: '', total: 100, academicYear: '2025-2026' });
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Error adding mark');
    }
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-gray-100 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Notifications */}
      {notification.message && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
            notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
          {notification.type === 'error' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        
        {/* --- STUDENT REGISTRATION FORM --- */}
        <div className="lg:col-span-2 bg-[#121622]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium flex items-center gap-2 text-white">
              <UserPlus className="w-5 h-5 text-emerald-400" /> Student Admission
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-3 overflow-x-auto">
            {[
              { id: 'personal', label: '1. Personal & Parents', icon: User },
              { id: 'academic', label: '2. Academic & Admission', icon: FileText },
              { id: 'financial', label: '3. Identity & Proofs', icon: CreditCard }
            ].map((tab) => (
              <button key={tab.id} type="button" onClick={() => setStudentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  studentTab === tab.id ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white bg-white/5'
                }`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleCreateStudent} className="space-y-4">
            {/* TAB 1: PERSONAL */}
            {studentTab === 'personal' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Username *" required value={studentForm.username}
                    onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <input type="password" placeholder="Password *" required value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <input type="text" placeholder="Last Name" value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Father's Name" value={studentForm.fatherName}
                    onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <input type="text" placeholder="Mother's Name" value={studentForm.motherName}
                    onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <input type="text" placeholder="Guardian Name" value={studentForm.guardianName}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Phone Number" value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <input type="text" placeholder="Blood Group (e.g. O+)" value={studentForm.bloodGroup}
                    onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Date of Birth</label>
                    <input type="date" value={studentForm.dob}
                      onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  </div>
                </div>

                <textarea placeholder="Residential Address" rows="2" value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                
                <button type="button" onClick={() => setStudentTab('academic')} className="w-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors py-2.5 rounded-xl text-sm font-medium">Next: Academic Info →</button>
              </motion.div>
            )}

            {/* TAB 2: ACADEMIC */}
            {studentTab === 'academic' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Date of Admission (Auto-calculates Academic Span)</label>
                  <input type="date" value={studentForm.dateOfAdmission}
                    onChange={(e) => setStudentForm({ ...studentForm, dateOfAdmission: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="number" placeholder="SSLC Total Score" value={studentForm.sslcTotal}
                    onChange={(e) => setStudentForm({ ...studentForm, sslcTotal: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <input type="number" placeholder="HSC Total Score" value={studentForm.hscTotal}
                    onChange={(e) => setStudentForm({ ...studentForm, hscTotal: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                </div>
                
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStudentTab('personal')} className="w-1/2 bg-white/5 hover:bg-white/10 transition-colors text-gray-300 py-2.5 rounded-xl text-sm font-medium">← Back</button>
                  <button type="button" onClick={() => setStudentTab('financial')} className="w-1/2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors py-2.5 rounded-xl text-sm font-medium">Next: Proofs →</button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: FINANCIAL & PROOFS */}
            {studentTab === 'financial' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Identity Document Number" value={studentForm.aadhaarNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, aadhaarNumber: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                  <input type="text" placeholder="Bank Account Number" value={studentForm.bankAccountNo}
                    onChange={(e) => setStudentForm({ ...studentForm, bankAccountNo: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                </div>
                
                <input type="url" placeholder="Profile Picture URL" value={studentForm.profilePic}
                  onChange={(e) => setStudentForm({ ...studentForm, profilePic: e.target.value })}
                  className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                <input type="url" placeholder="Bank Passbook Image URL" value={studentForm.passbookPic}
                  onChange={(e) => setStudentForm({ ...studentForm, passbookPic: e.target.value })}
                  className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />
                <input type="url" placeholder="TC Document URL (Optional)" value={studentForm.tcDoc}
                  onChange={(e) => setStudentForm({ ...studentForm, tcDoc: e.target.value })}
                  className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white" />

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStudentTab('academic')} className="w-1/2 bg-white/5 hover:bg-white/10 transition-colors text-gray-300 py-2.5 rounded-xl text-sm font-medium">← Back</button>
                  <button type="submit" className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-all text-sm cursor-pointer">Register Student</button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* --- ASSIGN MARKS & ROSTER --- */}
        <div className="space-y-6">
          
          {/* Marks Form */}
          <div className="bg-[#121622]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-medium flex items-center gap-2 text-white mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Assign Marks
            </h2>
            <form onSubmit={handleAddMark} className="space-y-4">
              <select required value={markForm.studentId}
                onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white">
                <option value="" disabled className="bg-[#121622]">Select Student</option>
                {students.map((std) => (
                  <option key={std._id} value={std._id} className="bg-[#121622]">
                    {std.studentDetails?.firstName ? `${std.studentDetails.firstName} (${std.username})` : std.username}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Subject Name" required value={markForm.subject}
                onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })}
                className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white" />
              
              <div className="flex gap-3">
                <input type="number" placeholder="Score" required value={markForm.score}
                  onChange={(e) => setMarkForm({ ...markForm, score: e.target.value })}
                  className="w-1/2 bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white" />
                <input type="number" placeholder="Total (100)" required value={markForm.total}
                  onChange={(e) => setMarkForm({ ...markForm, total: e.target.value })}
                  className="w-1/2 bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white" />
              </div>
              
              <input type="text" placeholder="Academic Year" required value={markForm.academicYear}
                onChange={(e) => setMarkForm({ ...markForm, academicYear: e.target.value })}
                className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white" />
              <button type="submit" className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-medium py-3 rounded-xl transition-all text-sm cursor-pointer">Save Marks</button>
            </form>
          </div>

          {/* Student Roster */}
          <div className="bg-[#121622]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-medium flex items-center gap-2 text-white mb-4">
              <GraduationCap className="w-5 h-5 text-purple-400" /> Student Roster ({students.length})
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {students.map((student) => (
                <div key={student._id} className="flex items-center justify-between bg-[#090b14]/60 border border-white/5 hover:border-white/10 transition-colors p-3 rounded-2xl">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {student.studentDetails?.firstName ? `${student.studentDetails.firstName} ${student.studentDetails?.lastName || ''}` : student.username}
                    </p>
                    <p className="text-xs text-gray-500">Year: {student.academicYear || 'Unassigned'}</p>
                  </div>
                  <button onClick={() => handleDeleteStudent(student._id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No students enrolled yet.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}