import React, { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { initializeStorage } from '../../utils/storage';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Initialize local storage with sample data
    initializeStorage();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;