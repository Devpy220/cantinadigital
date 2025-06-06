import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Event, MenuItem } from '../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ItemForm from '../admin/ItemForm';
import ItemList from '../admin/ItemList';
import { addMenuItem, updateMenuItem, deleteMenuItem } from '../../utils/storage';

interface ProductManagementProps {
  event: Event;
  items: MenuItem[];
  onUpdate: () => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  event,
  items,
  onUpdate,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const handleAddItem = (item: MenuItem) => {
    const itemWithEvent = { ...item, eventId: event.id };
    addMenuItem(itemWithEvent);
    onUpdate();
    setIsAddModalOpen(false);
    showNotification('Produto adicionado com sucesso!');
  };
  
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };
  
  const handleUpdateItem = (updatedItem: MenuItem) => {
    updateMenuItem(updatedItem);
    onUpdate();
    setIsEditModalOpen(false);
    setSelectedItem(null);
    showNotification('Produto atualizado com sucesso!');
  };
  
  const handleDeleteItem = (id: string) => {
    deleteMenuItem(id);
    onUpdate();
    showNotification('Produto excluído com sucesso!');
  };
  
  const handleToggleAvailability = (id: string, available: boolean) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const updatedItem = { ...item, available };
      updateMenuItem(updatedItem);
      onUpdate();
      showNotification(
        `Produto ${available ? 'disponibilizado' : 'indisponibilizado'} com sucesso!`
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
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Produtos - {event.name}
          </h2>
          <p className="text-gray-600">Gerencie os produtos do seu evento</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} className="mr-2" />
          Adicionar Produto
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
        title="Adicionar Novo Produto"
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
        title="Editar Produto"
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

export default ProductManagement;