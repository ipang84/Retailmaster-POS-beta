import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import Receipt from './Receipt';
import { getReceiptSettings } from '../services/settingsService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #000;
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #d32f2f;
  
  h3 {
    margin-bottom: 10px;
  }
  
  p {
    margin-bottom: 15px;
  }
`;

const PrintReceiptModal = ({ isOpen, onClose, order }) => {
  const [receiptSettings, setReceiptSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const receiptRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load receipt settings
        const settings = getReceiptSettings();
        setReceiptSettings(settings);
        
        // Validate order data
        if (!order || !order.id || !order.items) {
          setError("Invalid order data. Cannot generate receipt.");
        }
        
        // Auto-print if configured
        if (settings.printAutomatically) {
          setTimeout(() => {
            handlePrint();
          }, 500);
        }
      } catch (err) {
        setError("Failed to load receipt settings: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isOpen, order]);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
        
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading receipt...</div>
        ) : error ? (
          <ErrorMessage>
            <h3>Error</h3>
            <p>{error}</p>
          </ErrorMessage>
        ) : !order ? (
          <ErrorMessage>
            <h3>No Preview Available</h3>
            <p>The order data is missing or invalid.</p>
          </ErrorMessage>
        ) : (
          <div ref={receiptRef}>
            <Receipt 
              order={order} 
              settings={receiptSettings} 
              onPrint={handlePrint} 
            />
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default PrintReceiptModal;
