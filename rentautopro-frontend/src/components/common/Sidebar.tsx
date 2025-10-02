import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  Users, 
  FileText, 
  BarChart 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { to: '/vehicles', icon: Car, label: 'Vehículos', color: 'from-emerald-500 to-emerald-600' },
    { to: '/maintenance', icon: Wrench, label: 'Mantenimiento', color: 'from-orange-500 to-orange-600' },
    { to: '/clients', icon: Users, label: 'Clientes', color: 'from-purple-500 to-purple-600' },
    { to: '/rentals', icon: FileText, label: 'Alquileres', color: 'from-indigo-500 to-indigo-600' },
    { to: '/reports', icon: BarChart, label: 'Reportes', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-gray-900/95 backdrop-blur-md shadow-xl border-r border-gray-800 overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-blue-200 font-medium shadow-md border border-blue-700'
                    : 'text-gray-200 hover:bg-gray-800 hover:shadow-sm hover:scale-[1.02]'
                }`
              }
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                'bg-gradient-to-r ' + item.color
              }`}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer de la sidebar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400 text-center">
          <p>RentAutoPro v1.0</p>
          <p className="mt-1">© 2024 Todos los derechos reservados</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
