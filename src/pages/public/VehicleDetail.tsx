import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehicleService } from '../../services/api';
import { Vehicle } from '../../types';
import { ArrowLeft, Calendar, DollarSign, Check, X, Car } from 'lucide-react';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        if (!id) throw new Error('ID não fornecido');
        
        const data = await vehicleService.getById(parseInt(id));
        setVehicle(data);
      } catch (err) {
        console.error('Failed to fetch vehicle details', err);
        setError('Não foi possível carregar os detalhes do veículo.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Car size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Veículo não encontrado</h2>
            <p className="text-gray-600 mb-6">{error || 'O veículo solicitado não está disponível.'}</p>
            <Link 
              to="/catalogo" 
              className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar para o Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mock characteristics (in a real app, these would come from the database)
  const characteristics = [
    '4 Portas',
    'Ar Condicionado',
    'Direção Hidráulica',
    'Vidros Elétricos',
    'Travas Elétricas',
    'Airbag',
    'Freios ABS',
    'Câmbio Manual',
    'Sensor de Estacionamento',
    'Combustível: Flex'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            to="/catalogo" 
            className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Voltar para o Catálogo
          </Link>
        </div>

        {/* Vehicle details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="h-96 lg:h-auto">
              <img
                src={vehicle.imagem_url}
                alt={vehicle.nome}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-6 lg:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.nome}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="font-medium">{vehicle.marca}</span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{vehicle.ano}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center text-2xl text-blue-900 font-bold mb-6">
                  <DollarSign size={24} />
                  <span>{formatCurrency(vehicle.valor_diaria)}</span>
                  <span className="text-gray-500 font-normal text-lg ml-1">/dia</span>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <div 
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold
                      ${vehicle.status === 'disponível' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}
                  >
                    {vehicle.status === 'disponível' ? (
                      <>
                        <Check size={16} className="mr-1" />
                        <span>Disponível para locação</span>
                      </>
                    ) : (
                      <>
                        <X size={16} className="mr-1" />
                        <span>Indisponível no momento</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-600">
                    {vehicle.descricao || `${vehicle.nome} ${vehicle.ano} em excelente estado. Ideal para viagens longas ou curtas, oferecendo conforto e economia.`}
                  </p>
                </div>

                {/* Características */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Características</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(vehicle.caracteristicas || characteristics).map((item, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              {vehicle.status === 'disponível' ? (
                <button className="w-full py-3 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800 transition-colors">
                  Solicitar Reserva
                </button>
              ) : (
                <button disabled className="w-full py-3 bg-gray-300 text-gray-500 font-semibold rounded cursor-not-allowed">
                  Indisponível para Reserva
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Condições de Locação</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Idade mínima: 21 anos</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>CNH categoria B (no mínimo 2 anos)</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Documentos de identificação válidos</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Cartão de crédito em nome do condutor</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Garantias Incluídas</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Seguro contra colisão</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Proteção contra roubo</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Assistência 24 horas</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Quilometragem livre</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formas de Pagamento</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Cartão de crédito (parcelamento em até 12x)</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Cartão de débito</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>Transferência bancária</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1" />
                <span>PIX</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;