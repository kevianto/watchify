import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Video } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors">
              <Video className="h-8 w-8" />
              <span className="text-xl font-bold">Watchify</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/home" 
              className="flex items-center space-x-1 text-white hover:text-purple-200 transition-colors px-3 py-2 rounded-md"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className="text-white/80">
                Welcome, {user.username}
                {user.isAnonymous && <span className="ml-1 text-xs text-purple-200">(Guest)</span>}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors px-3 py-2 rounded-md hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;