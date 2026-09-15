import { Search, Bell, Clock } from 'lucide-react';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <nav className="sticky top-0 z-50 bg-[#090b14]/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-6 md:px-10">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 capitalize">{user.role || 'Dashboard'}</span>
        <span className="text-gray-600">/</span>
        <span className="text-gray-200 font-medium">Overview</span>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Search Bar (Visual) */}
        <div className="hidden md:flex items-center bg-[#121622] border border-white/5 rounded-full px-4 py-1.5 focus-within:border-indigo-500/50 transition-colors">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm text-white pl-2 w-32 focus:w-48 transition-all placeholder-gray-600"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 text-gray-400">
          <Clock className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 hover:text-white transition-colors" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#090b14]"></span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-tight">{user.username || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user.department || 'Administration'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold uppercase border-2 border-[#121622]">
            {user.username ? user.username.charAt(0) : 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
}