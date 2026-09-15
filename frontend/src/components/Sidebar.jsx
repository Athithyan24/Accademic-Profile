import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Users, Building, BookOpen, 
  GraduationCap, Settings, LogOut, Hexagon 
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Define links based on role
  const navLinks = {
    admin: [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard },
      { name: 'Departments', path: '/admin', icon: Building },
      { name: 'Staff Management', path: '/admin', icon: Users },
    ],
    staff: [
      { name: 'Overview', path: '/staff', icon: LayoutDashboard },
      { name: 'My Students', path: '/staff', icon: GraduationCap },
      { name: 'Academic Marks', path: '/staff', icon: BookOpen },
    ],
    student: [
      { name: 'My Portal', path: '/student', icon: LayoutDashboard },
      { name: 'Performance', path: '/student', icon: BookOpen },
    ]
  };

  const currentLinks = navLinks[user.role] || [];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-[#0b0e14] border-r border-white/5 hidden md:flex flex-col flex-shrink-0 sticky top-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl">
          <Hexagon className="w-6 h-6 text-white fill-white/20" />
        </div>
        <div>
          <h2 className="text-white font-bold tracking-wide">Fobework</h2>
          <p className="text-xs text-gray-500 capitalize">{user.role || 'Guest'} Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
        
        {currentLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;

          return (
            <Link key={link.name} to={link.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className="text-sm">{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill" 
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}

        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 mt-8 px-2">Others</p>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all cursor-pointer">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </div>
      </div>

      {/* Upgrade / Bottom Card (Matching UI Reference) */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#121622] to-[#0d101a] border border-white/5 rounded-2xl p-4 shadow-lg">
          <ul className="text-xs text-gray-400 space-y-2 mb-4">
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Unlimited features</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Premium support</li>
          </ul>
          <button 
            onClick={handleLogout}
            className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium py-2 rounded-lg border border-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}