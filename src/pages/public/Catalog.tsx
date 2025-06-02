import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../types';
import VehicleCard from '../../components/common/VehicleCard';
import { vehicleService } from '../../services/api';
import { Search, Car, Filter } from 'lucide-react';

const Catalog: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    ordenacao: 'nome',
    marca: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique brands for filter
  const brands = vehicles.length > 0 
    ? ['all', ...new Set(vehicles.map(v => v.marca))] 
    : ['all'];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAll();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error('Failed to fetch vehicles', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...vehicles];
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(
        vehicle => 
          vehicle.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (filter.status !== 'all') {
      result = result.filter(vehicle => vehicle.status === filter.status);
    }
    
    // Brand filter
    if (filter.marca !== 'all') {
      result = result.filter(vehicle => vehicle.marca === filter.marca);
    }
    
    // Sort
    switch (filter.ordenacao) {
      case 'nome':
        result.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'valor_menor':
        result.sort((a, b) => a.valor_diaria - b.valor_diaria);
        break;
      case 'valor_maior':
        result.sort((a, b) => b.valor_diaria - a.valor_diaria);
        break;
      case 'ano_novo':
        result.sort((a, b) => b.ano - a.ano);
        break;
      case 'ano_antigo':
        result.sort((a, b) => a.ano - b.ano);
        break;
      default:
        break;
    }
    
    setFilteredVehicles(result);
  }, [vehicles, searchTerm, filter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Veículos</h1>
          <p className="text-gray-600 max-w-3xl">
            Explore nossa seleção de veículos disponíveis para locação. Utilize os filtros para encontrar o carro ideal para suas necessidades.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nome ou marca..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={toggleFilters}
              className="md:hidden flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
            >
              <Filter size={18} className="mr-2" />
              <span>Filtros</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4">
              <div>
                <select
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="disponível">Disponíveis</option>
                  <option value="indisponível">Indisponíveis</option>
                </select>
              </div>

              <div>
                <select
                  name="marca"
                  value={filter.marca}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas as marcas</option>
                  {brands.filter(b => b !== 'all').map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  name="ordenacao"
                  value={filter.ordenacao}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nome">Nome (A-Z)</option>
                  <option value="valor_menor">Menor preço</option>
                  <option value="valor_maior">Maior preço</option>
                  <option value="ano_novo">Mais novo</option>
                  <option value="ano_antigo">Mais antigo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-4 space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="disponível">Disponíveis</option>
                  <option value="indisponível">Indisponíveis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <select
                  name="marca"
                  value={filter.marca}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas as marcas</option>
                  {brands.filter(b => b !== 'all').map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenação</label>
                <select
                  name="ordenacao"
                  value={filter.ordenacao}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nome">Nome (A-Z)</option>
                  <option value="valor_menor">Menor preço</option>
                  <option value="valor_maior">Maior preço</option>
                  <option value="ano_novo">Mais novo</option>
                  <option value="ano_antigo">Mais antigo</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <>
            {filteredVehicles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
                <p className="mt-6 text-gray-600 text-center">
                  Mostrando {filteredVehicles.length} de {vehicles.length} veículos
                </p>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Car size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum veículo encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos veículos correspondentes aos filtros aplicados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter({
                      status: 'all',
                      ordenacao: 'nome',
                      marca: 'all'
                    });
                  }}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;