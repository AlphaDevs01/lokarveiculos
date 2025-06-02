import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-blue-900" />
          <span className="text-2xl font-bold text-blue-900">Lokar Veículos</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-gray-700 hover:text-blue-900 transition-colors ${
              location.pathname === '/' ? 'font-semibold border-b-2 border-blue-900' : ''
            }`}
          >
            Início
          </Link>
          <Link
            to="/catalogo"
            className={`text-gray-700 hover:text-blue-900 transition-colors ${
              location.pathname === '/catalogo' ? 'font-semibold border-b-2 border-blue-900' : ''
            }`}
          >
            Catálogo
          </Link>
          {authState.isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className="text-gray-700 hover:text-blue-900 transition-colors"
              >
                Painel Admin
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
            >
              <User size={18} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-900 py-2 transition-colors"
              onClick={toggleMenu}
            >
              Início
            </Link>
            <Link
              to="/catalogo"
              className="text-gray-700 hover:text-blue-900 py-2 transition-colors"
              onClick={toggleMenu}
            >
              Catálogo
            </Link>
            {authState.isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-900 py-2 transition-colors"
                  onClick={toggleMenu}
                >
                  Painel Admin
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="text-left py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 py-2 text-blue-900 hover:text-blue-800 transition-colors"
                onClick={toggleMenu}
              >
                <User size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;