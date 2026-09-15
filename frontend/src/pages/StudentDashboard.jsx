import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Standardized framer-motion import
import { 
  GraduationCap, BookOpen, Award, User, Building, Calendar, TrendingUp, Phone, FileText, AlertCircle
} from 'lucide-react';
import API from '../services/api';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [profileRes, marksRes] = await Promise.all([
          API.get('/student/profile'),
          API.get('/student/marks')
        ]);
        setProfile(profileRes.data);
        setMarks(marksRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load student data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const totalScore = marks.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossible = marks.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b14] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#090b14] flex items-center justify-center text-red-400 p-6">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4">
          <AlertCircle className="w-8 h-8"/>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const details = profile?.studentDetails || {};

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-gray-100 p-6 md:p-10 font-sans relative overflow-hidden">
      <motion.div 
        className="space-y-8 z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div variants={itemVariants} className="bg-[#121622]/80 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
            <User className="w-8 h-8 text-indigo-400"/>
            <div>
              <p className="text-xs text-gray-400 uppercase">Student Name</p>
              <p className="text-base font-semibold text-white">
                {details.firstName ? `${details.firstName} ${details.lastName}` : profile?.username}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#121622]/80 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
            <Building className="w-8 h-8 text-purple-400"/>
            <div>
              <p className="text-xs text-gray-400 uppercase">Department</p>
              <p className="text-base font-semibold text-white">{profile?.department?.name || 'Unassigned'}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#121622]/80 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
            <Calendar className="w-8 h-8 text-emerald-400"/>
            <div>
              <p className="text-xs text-gray-400 uppercase">Academic Span</p>
              <p className="text-base font-semibold text-white">{profile?.academicYear || 'N/A'}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-3xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <TrendingUp className="w-8 h-8 text-indigo-300"/>
            <div>
              <p className="text-xs text-indigo-200 uppercase">Overall Average</p>
              <p className="text-2xl font-bold text-white">{overallPercentage}%</p>
            </div>
          </motion.div>
        </div>

        {/* EXTENDED PROFILE CARD */}
        <motion.div variants={itemVariants} className="bg-[#121622]/80 border border-white/5 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400"/> Personal & Academic Record
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-[#090b14]/60 p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
              <p className="text-gray-400 text-xs mb-1">Parents / Guardian</p>
              <p className="text-white font-medium">Father: {details.parents?.fatherName || 'N/A'}</p>
              <p className="text-white font-medium">Mother: {details.parents?.motherName || 'N/A'}</p>
            </div>
            <div className="bg-[#090b14]/60 p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
              <p className="text-gray-400 text-xs mb-1">Previous Academic Scores</p>
              <p className="text-white font-medium">SSLC Total: {details.sslcTotal || 'N/A'}</p>
              <p className="text-white font-medium">HSC Total: {details.hscTotal || 'N/A'}</p>
            </div>
            <div className="bg-[#090b14]/60 p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
              <p className="text-gray-400 text-xs mb-1">Contact & Blood Group</p>
              <p className="text-white font-medium">Phone: {details.phone || 'N/A'}</p>
              <p className="text-white font-medium">Blood Group: {details.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </motion.div>

        {/* MARKS LIST */}
        <motion.div variants={itemVariants} className="bg-[#121622]/80 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-purple-400"/> Academic Performance
          </h2>
          {marks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[#090b14]/40 rounded-2xl border border-white/5 border-dashed">
              <BookOpen className="w-12 h-12 text-gray-500 mb-3"/>
              <p className="text-gray-400 text-sm">No academic marks uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {marks.map((item, index) => {
                const percentage = ((item.score / item.total) * 100).toFixed(0);
                return (
                  <motion.div 
                    key={item._id || index}
                    whileHover={{ y: -5 }}
                    className="bg-[#090b14]/60 border border-white/5 rounded-2xl p-5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                  >
                    <h3 className="font-semibold text-white">{item.subject}</h3>
                    <p className="text-xs text-gray-500 mb-4">Year: {item.academicYear}</p>
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-white">{item.score} / {item.total}</span>
                      <span className="text-sm font-semibold text-indigo-400">{percentage}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}