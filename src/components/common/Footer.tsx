import React from 'react';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Lokar Veículos</span>
            </div>
            <p className="text-gray-400">
              Oferecendo os melhores veículos para locação, com qualidade e preços imbatíveis.
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} className="text-blue-400" />
                <span>(99) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} className="text-blue-400" />
                <span>contato@lokarveiculos.com</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="text-blue-400 mt-1" />
                <span>Av. Principal, 1000<br />Centro - São Paulo/SP</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/catalogo" className="text-gray-400 hover:text-white transition-colors">
                  Catálogo de Veículos
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Área Administrativa
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Lokar Veículos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;