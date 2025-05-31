import React, { useEffect, useState } from 'react';
import MenuList from '../components/menu/MenuList';
import { MenuItem } from '../types';
import { getMenuItems } from '../utils/storage';

const HomePage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating API call with a slight delay
    const timer = setTimeout(() => {
      const items = getMenuItems();
      setMenuItems(items);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <MenuList items={menuItems} />
    </div>
  );
};

export default HomePage;