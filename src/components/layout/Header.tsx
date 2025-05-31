import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
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
    <header className="bg-orange-500 text-white sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Cantina Digital
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`hover:text-orange-200 ${
                location.pathname === '/' ? 'font-bold' : ''
              }`}
            >
              Cardápio
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                className={`hover:text-orange-200 ${
                  location.pathname.includes('/admin') ? 'font-bold' : ''
                }`}
              >
                Administração
              </Link>
            )}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hover:text-orange-200"
              >
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                className={`hover:text-orange-200 ${
                  location.pathname === '/login' ? 'font-bold' : ''
                }`}
              >
                <div className="flex items-center">
                  <User size={18} className="mr-1" />
                  Entrar
                </div>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="mr-4 relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
        <div className="md:hidden bg-orange-600 px-4 py-2 animate-fade-in">
          <nav className="flex flex-col space-y-3 text-white">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`py-2 ${
                location.pathname === '/' ? 'font-bold' : ''
              }`}
            >
              Cardápio
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 ${
                  location.pathname.includes('/admin') ? 'font-bold' : ''
                }`}
              >
                Administração
              </Link>
            )}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="py-2 text-left"
              >
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 ${
                  location.pathname === '/login' ? 'font-bold' : ''
                }`}
              >
                <div className="flex items-center">
                  <User size={18} className="mr-1" />
                  Entrar
                </div>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;