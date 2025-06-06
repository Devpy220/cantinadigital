import React, { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { initializeStorage } from '../../utils/storage';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  useEffect(() => {
    initializeStorage();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background with blur effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;