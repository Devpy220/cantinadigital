import React from 'react';
import { Calendar } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800/90 backdrop-blur-md text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Calendar className="mr-2" size={24} />
              <h3 className="text-xl font-bold">EventHub</h3>
            </div>
            <p className="text-gray-400 mt-1">
              Plataforma completa para gestão de eventos
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400">
              &copy; {currentYear} EventHub. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;