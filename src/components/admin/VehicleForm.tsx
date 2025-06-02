import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Vehicle } from '../../types';

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: SubmitHandler<Partial<Vehicle>>;
  isLoading: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<Partial<Vehicle>>({
    defaultValues: initialData || {
      nome: '',
      marca: '',
      ano: new Date().getFullYear(),
      valor_diaria: 0,
      status: 'disponível',
      imagem_url: '',
      descricao: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
            Nome do Veículo
          </label>
          <input
            id="nome"
            type="text"
            {...register('nome', { required: 'Nome é obrigatório' })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>

        {/* Marca */}
        <div>
          <label htmlFor="marca" className="block text-gray-700 font-medium mb-2">
            Marca
          </label>
          <input
            id="marca"
            type="text"
            {...register('marca', { required: 'Marca é obrigatória' })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.marca ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.marca && (
            <p className="mt-1 text-sm text-red-500">{errors.marca.message}</p>
          )}
        </div>

        {/* Ano */}
        <div>
          <label htmlFor="ano" className="block text-gray-700 font-medium mb-2">
            Ano
          </label>
          <input
            id="ano"
            type="number"
            {...register('ano', { 
              required: 'Ano é obrigatório',
              min: {
                value: 1900,
                message: 'Ano inválido'
              },
              max: {
                value: new Date().getFullYear() + 1,
                message: `Ano não pode ser maior que ${new Date().getFullYear() + 1}`
              }
            })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.ano ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.ano && (
            <p className="mt-1 text-sm text-red-500">{errors.ano.message}</p>
          )}
        </div>

        {/* Valor Diária */}
        <div>
          <label htmlFor="valor_diaria" className="block text-gray-700 font-medium mb-2">
            Valor da Diária (R$)
          </label>
          <input
            id="valor_diaria"
            type="number"
            step="0.01"
            min="0"
            {...register('valor_diaria', { 
              required: 'Valor da diária é obrigatório',
              min: {
                value: 0,
                message: 'Valor não pode ser negativo'
              }
            })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.valor_diaria ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.valor_diaria && (
            <p className="mt-1 text-sm text-red-500">{errors.valor_diaria.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status é obrigatório' })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="disponível">Disponível</option>
            <option value="indisponível">Indisponível</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        {/* Imagem URL */}
        <div>
          <label htmlFor="imagem_url" className="block text-gray-700 font-medium mb-2">
            URL da Imagem
          </label>
          <input
            id="imagem_url"
            type="text"
            {...register('imagem_url', { required: 'URL da imagem é obrigatória' })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.imagem_url ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.imagem_url && (
            <p className="mt-1 text-sm text-red-500">{errors.imagem_url.message}</p>
          )}
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-gray-700 font-medium mb-2">
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={4}
          {...register('descricao')}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Salvando...' : 'Salvar Veículo'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;