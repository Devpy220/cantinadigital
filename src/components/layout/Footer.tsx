import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Cantina Digital</h3>
            <p className="text-gray-400 mt-1">
              Sua cantina digital para eventos e festas
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400">
              &copy; {currentYear} Cantina Digital. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;