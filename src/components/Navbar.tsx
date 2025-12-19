import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
  const { admin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement global search functionality
      // You can navigate to a search results page or filter current page data
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 fixed top-0 right-0 z-20 transition-all duration-300" 
      style={{ left: isSidebarOpen ? '16rem' : '5rem' }}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Search Section */}
        <div className="flex-1 max-w-2xl">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search anything... (Press Enter)"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 ml-6">
          {/* Divider */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100/50 px-4 py-2 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {admin?.firstName} {admin?.lastName}
                </p>
                <p className="text-xs font-medium text-gray-500">{admin?.role?.replace('_', ' ')}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-slideDown">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
          