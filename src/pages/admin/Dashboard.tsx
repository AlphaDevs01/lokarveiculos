import React from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, LogOut, Home, List, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!authState.isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white hidden md:block">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <Car className="h-8 w-8" />
            <h1 className="text-xl font-bold">Lokar Veículos</h1>
          </div>

          <nav className="space-y-2">
            <Link
              to="/admin"
              end
              className={`flex items-center space-x-3 p-3 rounded-md hover:bg-blue-800 transition-colors ${
                location.pathname === '/admin' ? 'bg-blue-800' : ''
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/admin/veiculos"
              className={`flex items-center space-x-3 p-3 rounded-md hover:bg-blue-800 transition-colors ${
                location.pathname.includes('/admin/veiculos') ? 'bg-blue-800' : ''
              }`}
            >
              <List size={20} />
              <span>Listar Veículos</span>
            </Link>
            
            <Link
              to="/admin/veiculos/novo"
              className={`flex items-center space-x-3 p-3 rounded-md hover:bg-blue-800 transition-colors ${
                location.pathname === '/admin/veiculos/novo' ? 'bg-blue-800' : ''
              }`}
            >
              <Plus size={20} />
              <span>Adicionar Veículo</span>
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-md text-red-200 hover:bg-red-900 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-blue-900 text-white w-full fixed top-0 left-0 right-0 z-10 shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <h1 className="text-lg font-bold">Lokar Veículos</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-200 hover:text-white"
          >
            <LogOut size={20} />
          </button>
        </div>
        
        <nav className="flex border-t border-blue-800">
          <Link
            to="/admin"
            end
            className={`flex-1 flex flex-col items-center py-2 ${
              location.pathname === '/admin' ? 'bg-blue-800' : ''
            }`}
          >
            <Home size={18} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          <Link
            to="/admin/veiculos"
            className={`flex-1 flex flex-col items-center py-2 ${
              location.pathname.includes('/admin/veiculos') && location.pathname !== '/admin/veiculos/novo' ? 'bg-blue-800' : ''
            }`}
          >
            <List size={18} />
            <span className="text-xs mt-1">Listar</span>
          </Link>
          
          <Link
            to="/admin/veiculos/novo"
            className={`flex-1 flex flex-col items-center py-2 ${
              location.pathname === '/admin/veiculos/novo' ? 'bg-blue-800' : ''
            }`}
          >
            <Plus size={18} />
            <span className="text-xs mt-1">Adicionar</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 md:ml-0 mt-20 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;