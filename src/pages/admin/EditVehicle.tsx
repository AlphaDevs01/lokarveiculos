import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/api';
import VehicleForm from '../../components/admin/VehicleForm';
import { Vehicle } from '../../types';
import toast from 'react-hot-toast';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        if (!id) throw new Error('ID não fornecido');
        
        const data = await vehicleService.getById(parseInt(id));
        setVehicle(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch vehicle details', err);
        setError('Não foi possível carregar os detalhes do veículo.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleSubmit = async (data: Partial<Vehicle>) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await vehicleService.update(parseInt(id), data);
      toast.success('Veículo atualizado com sucesso!');
      navigate('/admin/veiculos');
    } catch (error) {
      console.error('Failed to update vehicle', error);
      toast.error('Erro ao atualizar veículo. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando informações do veículo...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-4 text-red-500">
          <AlertCircle size={24} className="mr-2" />
          <h2 className="text-xl font-semibold">Erro</h2>
        </div>
        <p className="text-gray-600 mb-6">{error || 'Veículo não encontrado.'}</p>
        <button
          onClick={() => navigate('/admin/veiculos')}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          Voltar para a Lista
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/veiculos')}
          className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Voltar para lista
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Editar Veículo</h1>
        <p className="text-gray-600 mt-1">
          Atualize as informações do veículo no formulário abaixo
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <VehicleForm 
          initialData={vehicle}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditVehicle;