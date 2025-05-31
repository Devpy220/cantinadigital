import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import ItemList from '../../components/admin/ItemList';
import Modal from '../../components/common/Modal';
import ItemForm from '../../components/admin/ItemForm';
import { MenuItem } from '../../types';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../../utils/storage';

const AdminDashboard: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Set page title
  useEffect(() => {
    document.title = 'Administração | Cantina Digital';
    return () => {
      document.title = 'Cantina Digital';
    };
  }, []);
  
  useEffect(() => {
    loadItems();
  }, []);
  
  const loadItems = () => {
    const menuItems = getMenuItems();
    setItems(menuItems);
  };
  
  const handleAddItem = (item: MenuItem) => {
    addMenuItem(item);
    loadItems();
    setIsAddModalOpen(false);
    
    // Show success message
    showNotification('Item adicionado com sucesso!');
  };
  
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };
  
  const handleUpdateItem = (updatedItem: MenuItem) => {
    updateMenuItem(updatedItem);
    loadItems();
    setIsEditModalOpen(false);
    setSelectedItem(null);
    
    // Show success message
    showNotification('Item atualizado com sucesso!');
  };
  
  const handleDeleteItem = (id: string) => {
    deleteMenuItem(id);
    loadItems();
    
    // Show success message
    showNotification('Item excluído com sucesso!');
  };
  
  const handleToggleAvailability = (id: string, available: boolean) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const updatedItem = { ...item, available };
      updateMenuItem(updatedItem);
      loadItems();
      
      // Show success message
      showNotification(
        `Item ${available ? 'disponibilizado' : 'indisponibilizado'} com sucesso!`
      );
    }
  };
  
  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };
  
  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Administração do Cardápio
        </h1>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusCircle size={18} className="mr-2" />
          Adicionar Item
        </Button>
      </div>
      
      <ItemList
        items={items}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onToggleAvailability={handleToggleAvailability}
      />
      
      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Novo Item"
        size="lg"
      >
        <ItemForm
          onSubmit={handleAddItem}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      
      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        title="Editar Item"
        size="lg"
      >
        {selectedItem && (
          <ItemForm
            item={selectedItem}
            onSubmit={handleUpdateItem}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedItem(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;