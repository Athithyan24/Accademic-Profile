import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, Users, Plus, ShieldAlert, CheckCircle2, 
  UserCheck, Briefcase, FileText, Trash2
} from 'lucide-react';
import API from '../services/api';

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [staffTab, setStaffTab] = useState('basic');

  const [deptForm, setDeptForm] = useState({ name: '', code: '' });
  
  // Adjusted initial state for files to be null
  const [staffForm, setStaffForm] = useState({
    username: '', password: '', departmentId: '',
    fullName: '', phone: '', email: '', address: '', dob: '', dateOfJoining: '',
    qualifications: '', skills: '', awards: '',
    profilePic: null, documentProof: null
  });

  const [experienceList, setExperienceList] = useState([]);

  const fetchData = async () => {
    try {
      const [deptRes, staffRes] = await Promise.all([
        API.get('/admin/departments'),
        API.get('/admin/staff')
      ]);
      setDepartments(deptRes.data);
      setStaffList(staffRes.data);
    } catch (error) {
      showNotification('error', 'Failed to load dashboard data.');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/departments', deptForm);
      showNotification('success', 'Department created successfully!');
      setDeptForm({ name: '', code: '' });
      fetchData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Error creating department');
    }
  };

  const handleAddExperience = () => {
    setExperienceList([...experienceList, { from: '', to: '', role: '', organization: '' }]);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  const handleRemoveExperience = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      if (!staffForm.departmentId || !String(staffForm.departmentId).trim()) {
        showNotification('error', 'Please select a department before creating a staff account.');
        return;
      }

      const formData = new FormData();

      // 1. Append standard text fields
      Object.keys(staffForm).forEach((key) => {
        if (key !== 'profilePic' && key !== 'documentProof') {
          const value = staffForm[key];
          if (key === 'departmentId' && (!value || !String(value).trim())) {
            return;
          }
          formData.append(key, value ?? '');
        }
      });

      // 2. Append the complex experience array (Must be stringified for FormData)
      formData.append('experience', JSON.stringify(experienceList));

      // 3. Append the actual files (if the user selected them)
      if (staffForm.profilePic instanceof File) {
        formData.append('profilePic', staffForm.profilePic);
      }
      if (staffForm.documentProof instanceof File) {
        formData.append('documentProof', staffForm.documentProof);
      }

      // 4. Send request as multipart/form-data
      await API.post('/admin/staff', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showNotification('success', 'Staff account created successfully!');
      
      // Reset forms
      setStaffForm({
        username: '', password: '', departmentId: '',
        fullName: '', phone: '', email: '', address: '', dob: '', dateOfJoining: '',
        qualifications: '', skills: '', awards: '',
        profilePic: null, documentProof: null
      });
      setExperienceList([]);
      setStaffTab('basic');
      fetchData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Error creating staff');
    }
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-gray-100 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />

      {notification.message && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
            notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
          }`}>
          {notification.type === 'error' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        {/* --- CREATE DEPARTMENT --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#121622]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium flex items-center gap-2 text-white">
                <Building className="w-5 h-5 text-indigo-400" /> Department
              </h2>
              <span className="text-xs font-medium px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                Count: {departments.length}
              </span>
            </div>
            <form onSubmit={handleCreateDept} className="space-y-4">
              <input type="text" placeholder="Department Name" required value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white" />
              <input type="text" placeholder="Department Code (e.g. CS101)" required value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white" />
              <button type="submit" className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
                <Plus className="w-4 h-4" /> Add Department
              </button>
            </form>
          </div>
        </div>

        {/* --- REGISTER STAFF (MULTI-SECTION TAB FORM) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121622]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-purple-400" /> Staff Registration
              </h2>
              <span className="text-xs font-medium px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                Total Staff: {staffList.length}
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-3 overflow-x-auto">
              {[
                { id: 'basic', label: '1. Account & Personal', icon: UserCheck },
                { id: 'prof', label: '2. Professional & Exp', icon: Briefcase },
                { id: 'docs', label: '3. Documents & Media', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStaffTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    staffTab === tab.id 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              {/* TAB 1: BASIC & PERSONAL */}
              {staffTab === 'basic' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Username *" required value={staffForm.username}
                      onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                    <input type="password" placeholder="Password *" required value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={staffForm.fullName}
                      onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                    <select required value={staffForm.departmentId}
                      onChange={(e) => setStaffForm({ ...staffForm, departmentId: e.target.value })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white">
                      <option value="" disabled className="bg-[#121622]">Assign Department *</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id} className="bg-[#121622]">{dept.name} ({dept.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" placeholder="Email Address" value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                    <input type="text" placeholder="Phone Number" value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Date of Birth</label>
                      <input type="date" value={staffForm.dob}
                        onChange={(e) => setStaffForm({ ...staffForm, dob: e.target.value })}
                        className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Date of Joining</label>
                      <input type="date" value={staffForm.dateOfJoining}
                        onChange={(e) => setStaffForm({ ...staffForm, dateOfJoining: e.target.value })}
                        className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white" />
                    </div>
                  </div>

                  <textarea placeholder="Residential Address" rows="2" value={staffForm.address}
                    onChange={(e) => setStaffForm({ ...staffForm, address: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                  
                  <button type="button" onClick={() => setStaffTab('prof')} className="w-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-300 py-2.5 rounded-xl text-sm font-medium">Next: Professional Details →</button>
                </motion.div>
              )}

              {/* TAB 2: QUALIFICATIONS, SKILLS & EXPERIENCE */}
              {staffTab === 'prof' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <input type="text" placeholder="Qualifications (comma-separated, e.g., M.Tech, Ph.D)" value={staffForm.qualifications}
                    onChange={(e) => setStaffForm({ ...staffForm, qualifications: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                  <input type="text" placeholder="Skills (comma-separated, e.g., Python, React, Data Science)" value={staffForm.skills}
                    onChange={(e) => setStaffForm({ ...staffForm, skills: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                  <input type="text" placeholder="Awards & Achievements (comma-separated)" value={staffForm.awards}
                    onChange={(e) => setStaffForm({ ...staffForm, awards: e.target.value })}
                    className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white" />

                  {/* Dynamic Experience Builder */}
                  <div className="p-4 bg-[#090b14]/40 border border-white/5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Previous Experience</label>
                      <button type="button" onClick={handleAddExperience} className="text-xs flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg hover:bg-purple-500/30 transition-colors">
                        <Plus className="w-3 h-3" /> Add Role
                      </button>
                    </div>
                    
                    {experienceList.map((exp, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center bg-[#121622] p-3 rounded-lg border border-white/5">
                        <input type="text" placeholder="Role (e.g. Lecturer)" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} className="w-full bg-transparent border border-white/10 focus:border-purple-500 focus:outline-none rounded-md px-2 py-1.5 text-xs text-white" />
                        <input type="text" placeholder="Organization" value={exp.organization} onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)} className="w-full bg-transparent border border-white/10 focus:border-purple-500 focus:outline-none rounded-md px-2 py-1.5 text-xs text-white md:col-span-2" />
                        <input type="text" placeholder="From (YYYY)" value={exp.from} onChange={(e) => handleExperienceChange(index, 'from', e.target.value)} className="w-full bg-transparent border border-white/10 focus:border-purple-500 focus:outline-none rounded-md px-2 py-1.5 text-xs text-white" />
                        <div className="flex gap-2">
                          <input type="text" placeholder="To (YYYY)" value={exp.to} onChange={(e) => handleExperienceChange(index, 'to', e.target.value)} className="w-full bg-transparent border border-white/10 focus:border-purple-500 focus:outline-none rounded-md px-2 py-1.5 text-xs text-white" />
                          <button type="button" onClick={() => handleRemoveExperience(index)} className="text-red-400 hover:text-red-300 p-1.5 bg-red-500/10 hover:bg-red-500/20 transition-colors rounded-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {experienceList.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-2">No experience added yet.</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStaffTab('basic')} className="w-1/2 bg-white/5 hover:bg-white/10 transition-colors text-gray-300 py-2.5 rounded-xl text-sm font-medium">← Back</button>
                    <button type="button" onClick={() => setStaffTab('docs')} className="w-1/2 bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-300 py-2.5 rounded-xl text-sm font-medium">Next: Documents →</button>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {staffTab === 'docs' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Profile Picture (Image)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setStaffForm({ ...staffForm, profilePic: e.target.files[0] })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 transition-all cursor-pointer" 
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Document Proof (PDF)</label>
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={(e) => setStaffForm({ ...staffForm, documentProof: e.target.files[0] })}
                      className="w-full bg-[#090b14]/60 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 transition-all cursor-pointer" 
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setStaffTab('prof')} className="w-1/2 bg-white/5 hover:bg-white/10 transition-colors text-gray-300 py-2.5 rounded-xl text-sm font-medium">← Back</button>
                    <button type="submit" className="w-1/2 bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 rounded-xl transition-all text-sm cursor-pointer">Register Staff</button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}