import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            <Calendar className="inline-block mr-2" size={28} />
            EventHub
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`hover:text-blue-600 transition-colors ${
                location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Eventos
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`hover:text-blue-600 transition-colors ${
                    location.pathname.includes('/dashboard') ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Meus Eventos
                </Link>
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={18} />
                  <span className="text-sm">{user?.name}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} className="mr-1" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hover:text-blue-600 transition-colors ${
                    location.pathname === '/login' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Conta
                </Link>
              </>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-gray-700 hover:text-blue-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="mr-4 relative">
              <ShoppingCart size={24} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200/50 px-4 py-2">
          <nav className="flex flex-col space-y-3 text-gray-700">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`py-2 ${location.pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Eventos
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-2 ${location.pathname.includes('/dashboard') ? 'text-blue-600 font-semibold' : ''}`}
                >
                  Meus Eventos
                </Link>
                
                <div className="py-2 text-sm text-gray-600">
                  Logado como: {user?.name}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-red-600"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-2 ${location.pathname === '/login' ? 'text-blue-600 font-semibold' : ''}`}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-2 ${location.pathname === '/register' ? 'text-blue-600 font-semibold' : ''}`}
                >
                  Criar Conta
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;