import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import VehicleCard from '../../components/common/VehicleCard';
import { vehicleService } from '../../services/api';
import { Vehicle } from '../../types';

const Home: React.FC = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await vehicleService.getAll();
        // Get only available vehicles and limit to 4
        const available = vehicles
          .filter((v: Vehicle) => v.status === 'disponível')
          .slice(0, 4);
        setFeaturedVehicles(available);
      } catch (error) {
        console.error('Failed to fetch vehicles', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center z-0"></div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Encontre o veículo perfeito para sua jornada
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Na Lokar Veículos, oferecemos uma ampla seleção de carros para locação, 
              com os melhores preços e condições do mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/catalogo" 
                className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-md hover:bg-blue-50 transition-colors text-center"
              >
                Ver Catálogo
              </Link>
              <a 
                href="#featured" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors text-center"
              >
                Veículos em Destaque
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section id="featured" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Veículos em Destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça alguns dos nossos melhores veículos disponíveis para locação. 
              Qualidade, conforto e segurança para sua jornada.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <>
              {featuredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <Car size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Nenhum veículo disponível no momento.</p>
                </div>
              )}

              <div className="text-center mt-12">
                <Link 
                  to="/catalogo" 
                  className="px-8 py-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors inline-block"
                >
                  Ver Todos os Veículos
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher a Lokar Veículos?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma experiência diferenciada de locação de veículos, com foco na qualidade e satisfação dos clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6 mx-auto">
                <Car className="text-blue-900 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Frota Moderna</h3>
              <p className="text-gray-600 text-center">
                Veículos novos e bem mantidos, garantindo conforto e segurança durante sua viagem.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Preços Competitivos</h3>
              <p className="text-gray-600 text-center">
                Oferecemos as melhores tarifas do mercado, sem taxas ocultas ou surpresas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Atendimento Premium</h3>
              <p className="text-gray-600 text-center">
                Equipe capacitada para oferecer o melhor atendimento e suporte durante toda sua locação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Pronto para alugar seu veículo?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Visite nosso catálogo e encontre o veículo ideal para suas necessidades.
          </p>
          <Link 
            to="/catalogo" 
            className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-md hover:bg-blue-50 transition-colors inline-block"
          >
            Ver Catálogo Completo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;