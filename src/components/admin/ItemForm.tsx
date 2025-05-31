import React, { useState, useEffect } from 'react';
import { SaveIcon, ImageIcon } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { MenuItem, Category } from '../../types';
import { generateId } from '../../utils/formatters';

interface ItemFormProps {
  item?: MenuItem;
  onSubmit: (item: MenuItem) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MenuItem>({
    id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'food',
    available: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: generateId(),
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: 'food',
        available: true,
      });
    }
  }, [item]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (name === 'price') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'URL da imagem é obrigatória';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'URL da imagem inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome do Item"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ex: Pastel de Queijo"
        error={errors.name}
        required
      />
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição do item..."
          className={`block w-full px-4 py-2 rounded-md border ${
            errors.description
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
          } focus:outline-none focus:ring-2`}
          rows={3}
          required
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Preço (R$)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          required
        />
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Categoria
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-none focus:ring-2"
          >
            <option value="food">Comidas</option>
            <option value="drinks">Bebidas</option>
            <option value="snacks">Lanches</option>
            <option value="desserts">Sobremesas</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          URL da Imagem
        </label>
        <div className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
              className={`pl-10 pr-4 py-2 w-full border rounded-md ${
                errors.imageUrl
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
              } focus:outline-none focus:ring-2`}
              required
            />
          </div>
        </div>
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
        )}
        
        {formData.imageUrl && !errors.imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">Pré-visualização:</p>
            <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagem+Inválida';
                  setErrors((prev) => ({
                    ...prev,
                    imageUrl: 'Não foi possível carregar a imagem',
                  }));
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          name="available"
          id="available"
          checked={formData.available}
          onChange={handleChange}
          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="available" className="ml-2 text-gray-700">
          Item disponível para venda
        </label>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          <SaveIcon className="mr-2" size={18} />
          {item ? 'Atualizar Item' : 'Adicionar Item'}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;