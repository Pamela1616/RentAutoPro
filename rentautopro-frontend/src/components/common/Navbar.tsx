import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-200">RentAutoPro</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 text-gray-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-all duration-200 hidden sm:block">
            <Bell size={20} />
          </button>

          <button className="p-2 text-gray-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-all duration-200 hidden sm:block">
            <Settings size={20} />
          </button>

          <div className="flex items-center space-x-2 md:space-x-3 px-2 md:px-4 py-2 bg-gray-800 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex flex-col hidden sm:block">
              <span className="text-sm font-medium text-blue-200">{user?.name}</span>
              <span className="text-xs text-gray-400 capitalize">{user?.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 text-sm text-red-400 hover:bg-red-900 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
