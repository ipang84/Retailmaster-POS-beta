import React, { useState } from 'react';
import styled from 'styled-components';
import { FiDownload, FiUpload, FiX } from 'react-icons/fi';
import { getProducts, updateProduct } from '../services/productService';
import { addInventoryLog } from '../services/inventoryLogService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : '#555'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background-color: ${props => props.primary ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#0055cc' : '#e0e0e0'};
  }
`;

const InfoText = styled.p`
  margin: 16px 0;
  color: #666;
  font-size: 14px;
`;

const MessageBox = styled.div`
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  font-weight: 500;
  background-color: ${props => props.type === 'success' ? '#e6f7e6' : '#ffebee'};
  color: ${props => props.type === 'success' ? '#2e7d32' : '#d32f2f'};
`;

const DisabledFeatureMessage = styled.div`
  background-color: #fff8e1;
  color: #f57c00;
  padding: 16px;
  border-radius: 4px;
  margin: 16px 0;
  text-align: center;
  
  h3 {
    margin-top: 0;
    margin-bottom: 8px;
  }
  
  p {
    margin: 0;
  }
`;

function ImportExportInventory({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('export');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage({ text: '', type: '' });
  };
  
  const handleExport = () => {
    try {
      // Get all products
      const products = getProducts();
      
      // Create CSV header
      let csv = 'ID,SKU,Product Name,Current Stock,Min Stock\n';
      
      // Add product data
      products.forEach(product => {
        const row = [
          product.id,
          product.sku || '',
          `"${(product.name || '').replace(/"/g, '""')}"`, // Escape quotes in product names
          product.inventory !== null ? product.inventory : 0,
          product.minStock || 0
        ];
        csv += row.join(',') + '\n';
      });
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessage({ text: 'Inventory data exported successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setMessage({ text: 'Failed to export inventory data. Please try again.', type: 'error' });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Import/Export Inventory</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'export'} 
            onClick={() => handleTabChange('export')}
          >
            Export
          </Tab>
          <Tab 
            active={activeTab === 'import'} 
            onClick={() => handleTabChange('import')}
          >
            Import
          </Tab>
        </TabContainer>
        
        {activeTab === 'export' ? (
          <>
            <InfoText>
              Export inventory data as a CSV file. This file can be used for backup, reporting, or to update inventory in another system.
            </InfoText>
            
            <ActionButton primary onClick={handleExport}>
              <FiDownload />
              Export Inventory as CSV
            </ActionButton>
          </>
        ) : (
          <DisabledFeatureMessage>
            <h3>Import Feature Temporarily Disabled</h3>
            <p>We're currently working on improving this feature. Please check back soon!</p>
          </DisabledFeatureMessage>
        )}
        
        {message.text && (
          <MessageBox type={message.type}>
            {message.text}
          </MessageBox>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default ImportExportInventory;
