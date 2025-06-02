import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/api';
import { Vehicle } from '../../types';
import { Car, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminHome: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
  });
  
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicles = await vehicleService.getAll();
        
        // Calculate stats
        const total = vehicles.length;
        const available = vehicles.filter(v => v.status === 'disponível').length;
        const unavailable = total - available;
        
        setStats({
          total,
          available,
          unavailable
        });
        
        // Get 5 most recent vehicles
        const recent = [...vehicles]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        
        setRecentVehicles(recent);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao painel administrativo da Lokar Veículos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Car className="h-6 w-6 text-blue-900" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total de Veículos</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.total}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Veículos Disponíveis</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.available}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Veículos Indisponíveis</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.unavailable}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Veículos Recentes</h3>
        </div>
        
        {recentVehicles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veículo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca / Ano
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Diária
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={vehicle.imagem_url} 
                            alt={vehicle.nome} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vehicle.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.marca}</div>
                      <div className="text-sm text-gray-500">{vehicle.ano}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatCurrency(vehicle.valor_diaria)}
                      </div>
                      <div className="text-xs text-gray-500">por dia</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.status === 'disponível' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status === 'disponível' ? 'Disponível' : 'Indisponível'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/admin/veiculos/editar/${vehicle.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhum veículo cadastrado ainda.</p>
          </div>
        )}
        
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
          <Link 
            to="/admin/veiculos" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Ver todos os veículos
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/veiculos/novo"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Car className="h-5 w-5 text-blue-900" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Adicionar Veículo</h4>
              <p className="text-xs text-gray-500">Cadastre um novo veículo no sistema</p>
            </div>
          </Link>
          
          <Link
            to="/catalogo"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <SearchIcon className="h-5 w-5 text-blue-900" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Ver Catálogo</h4>
              <p className="text-xs text-gray-500">Visualize o catálogo como cliente</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Search icon component
const SearchIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default AdminHome;