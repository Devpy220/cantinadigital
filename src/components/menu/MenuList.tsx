import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType, Category } from '../../types';

interface MenuListProps {
  items: MenuItemType[];
  eventName?: string;
}

const MenuList: React.FC<MenuListProps> = ({ items, eventName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  
  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'food', label: 'Comidas' },
    { value: 'drinks', label: 'Bebidas' },
    { value: 'snacks', label: 'Lanches' },
    { value: 'desserts', label: 'Sobremesas' },
  ];
  
  const filteredItems = items
    .filter((item) => item.available)
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedCategory === 'all' ? true : item.category === selectedCategory
    );
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {eventName ? `Cardápio - ${eventName}` : 'Cardápio'}
        </h2>
        <p className="text-gray-600">
          Escolha entre nossos deliciosos itens preparados especialmente para você
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category)}
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white/80 backdrop-blur-sm"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8">
            <p className="text-gray-500 text-lg">
              {items.length === 0 
                ? 'Este evento ainda não possui itens no cardápio.'
                : 'Nenhum item encontrado. Tente outra busca ou categoria.'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;