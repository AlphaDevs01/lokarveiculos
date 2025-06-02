import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types';
import { Calendar, DollarSign, Check, X } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Vehicle image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={vehicle.imagem_url}
          alt={vehicle.nome}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Status badge */}
        <div 
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold
            ${vehicle.status === 'disponível' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'}`}
        >
          {vehicle.status === 'disponível' ? 'Disponível' : 'Indisponível'}
        </div>
      </div>

      {/* Vehicle info */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{vehicle.nome}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <span className="font-medium">{vehicle.marca}</span>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{vehicle.ano}</span>
            </div>
          </div>
          
          <div className="flex items-center text-blue-900 font-bold">
            <DollarSign size={18} />
            <span>{formatCurrency(vehicle.valor_diaria)}</span>
            <span className="text-gray-500 font-normal ml-1">/dia</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center mb-4">
          {vehicle.status === 'disponível' ? (
            <div className="flex items-center text-green-500">
              <Check size={16} className="mr-1" />
              <span>Pronto para locação</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <X size={16} className="mr-1" />
              <span>Indisponível no momento</span>
            </div>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/veiculo/${vehicle.id}`}
          className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white py-2 rounded transition-colors duration-300"
        >
          Mais detalhes
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;