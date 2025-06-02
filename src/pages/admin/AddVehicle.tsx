import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/api';
import VehicleForm from '../../components/admin/VehicleForm';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const AddVehicle: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      await vehicleService.create(data);
      toast.success('Veículo adicionado com sucesso!');
      navigate('/admin/veiculos');
    } catch (error) {
      console.error('Failed to add vehicle', error);
      toast.error('Erro ao adicionar veículo. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Adicionar Novo Veículo</h1>
        <p className="text-gray-600 mt-1">
          Preencha o formulário abaixo para adicionar um novo veículo ao catálogo
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <VehicleForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default AddVehicle;