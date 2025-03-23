import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiPrinter, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { getLabelSettings } from '../services/settingsService';
import JsBarcode from 'jsbarcode';

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
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 14px;
  }
  
  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      border-color: var(--primary-color);
    }
  }
  
  input {
    width: 60px;
    text-align: center;
    margin: 0 8px;
  }
`;

const LabelPreview = styled.div`
  margin: 0 auto;
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: white;
  color: black;
  width: ${props => props.width}mm;
  height: ${props => props.height}mm;
  position: relative;
  overflow: hidden;
  transform-origin: center;
  transform: scale(${props => props.scale || 1});
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LabelContent = styled.div`
  font-size: ${props => props.fontSize}px;
  line-height: 1.2;
  
  .product-name {
    font-weight: bold;
    margin-bottom: 2px;
    font-size: ${props => props.fontSize + 2}px;
  }
  
  .product-sku {
    margin-bottom: 2px;
  }
  
  .product-price {
    font-weight: bold;
    margin-bottom: 2px;
    font-size: ${props => props.fontSize + 1}px;
  }
  
  .product-barcode {
    margin-bottom: 2px;
    display: flex;
    justify-content: center;
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  overflow: hidden;
  min-height: 220px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
`;

const PreviewTitle = styled.div`
  font-weight: 500;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
`;

const PreviewSection = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: ${props => props.secondary ? 'white' : 'var(--primary-color)'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: ${props => props.secondary ? '1px solid #ddd' : 'none'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.secondary ? '#f5f5f5' : '#0055cc'};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
`;

// Printable label container - clean, minimal styling for print only
const PrintableLabelContainer = styled.div`
  width: ${props => props.width}mm;
  height: ${props => props.height}mm;
  background-color: white;
  padding: 10px;
  box-sizing: border-box;
  margin: 0 auto 10mm auto;
  page-break-inside: avoid;
  position: relative;
  
  @media print {
    box-shadow: none;
    border: none;
  }
`;

// Print view container with proper print styling
const PrintViewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  
  @media print {
    padding: 0;
    
    /* Hide everything except the labels */
    & > *:not(.print-labels-container) {
      display: none;
    }
  }
`;

// Container for the labels to be printed
const PrintLabelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  @media print {
    /* This ensures only the labels are visible when printing */
    & > * {
      visibility: visible !important;
    }
  }
`;

// Print button
const PrintButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin: 20px auto;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  @media print {
    display: none;
  }
`;

// Label component for printing - clean and minimal
const PrintableLabel = ({ product, settings, width, height }) => {
  const barcodeRef = useRef(null);
  
  useEffect(() => {
    // Generate barcode when component mounts
    if (settings.showBarcode && barcodeRef.current && product && product.barcode) {
      try {
        JsBarcode(barcodeRef.current, product.barcode, {
          format: settings.barcodeFormat || "CODE128",
          width: 1.5,
          height: 30,
          displayValue: false,
          margin: 0,
          background: "transparent"
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
        // Fallback to a default value if the barcode is invalid
        JsBarcode(barcodeRef.current, "0000000000000", {
          format: settings.barcodeFormat || "CODE128",
          width: 1.5,
          height: 30,
          displayValue: false,
          margin: 0,
          background: "transparent"
        });
      }
    }
  }, [product, settings]);
  
  return (
    <PrintableLabelContainer width={width} height={height}>
      <LabelContent fontSize={parseInt(settings.fontSize)}>
        <div className="product-name">{product.name}</div>
        
        {settings.showSku && product.sku && (
          <div className="product-sku">SKU: {product.sku}</div>
        )}
        
        {settings.showBarcode && product.barcode && (
          <div className="product-barcode">
            <svg ref={barcodeRef}></svg>
          </div>
        )}
        
        {settings.showPrice && (
          <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
        )}
      </LabelContent>
    </PrintableLabelContainer>
  );
};

const PrintLabelModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [labelSettings, setLabelSettings] = useState(() => getLabelSettings());
  const barcodeRef = useRef(null);
  const previewRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [showPrintView, setShowPrintView] = useState(false);
  
  useEffect(() => {
    // Load label settings
    const settings = getLabelSettings();
    setLabelSettings(settings);
  }, [isOpen]);
  
  useEffect(() => {
    // Generate barcode when settings change or component mounts
    if (labelSettings.showBarcode && barcodeRef.current && product && product.barcode) {
      try {
        JsBarcode(barcodeRef.current, product.barcode, {
          format: labelSettings.barcodeFormat || "CODE128",
          width: 1.5,
          height: 30,
          displayValue: false,
          margin: 0,
          background: "transparent"
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
        // Fallback to a default value if the barcode is invalid
        JsBarcode(barcodeRef.current, "0000000000000", {
          format: labelSettings.barcodeFormat || "CODE128",
          width: 1.5,
          height: 30,
          displayValue: false,
          margin: 0,
          background: "transparent"
        });
      }
    }
  }, [labelSettings.showBarcode, labelSettings.barcodeFormat, product]);
  
  // Calculate appropriate scale based on container size and label dimensions
  useEffect(() => {
    if (previewContainerRef.current && isOpen) {
      const containerWidth = previewContainerRef.current.clientWidth - 60; // Subtract padding
      const dimensions = getLabelDimensions();
      
      // Convert mm to px (approximate conversion)
      const mmToPx = 3.779528;
      const labelWidthPx = dimensions.width * mmToPx;
      
      // Calculate scale to fit the container width
      const scale = containerWidth / labelWidthPx;
      
      // Limit the scale to a reasonable range
      const limitedScale = Math.min(Math.max(scale, 0.5), 3);
      
      setPreviewScale(limitedScale);
    }
  }, [labelSettings.labelSize, labelSettings.customWidth, labelSettings.customHeight, isOpen]);
  
  if (!isOpen || !product) return null;
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Get dimensions based on selected label size
  const getLabelDimensions = () => {
    switch (labelSettings.labelSize) {
      case 'small':
        return { width: 37, height: 22 };
      case 'medium':
        return { width: 50, height: 25 };
      case 'large':
        return { width: 62, height: 29 };
      case 'custom':
        return { 
          width: parseInt(labelSettings.customWidth) || 50, 
          height: parseInt(labelSettings.customHeight) || 25 
        };
      default:
        return { width: 50, height: 25 };
    }
  };
  
  const dimensions = getLabelDimensions();
  
  // Create an array of the specified length for rendering multiple labels
  const createArrayOfLength = (length) => {
    return Array.from({ length }, (_, i) => i);
  };
  
  const handlePrint = () => {
    setShowPrintView(true);
    // Use setTimeout to ensure the print view is rendered before printing
    setTimeout(() => {
      window.print();
      // Reset after printing
      setTimeout(() => {
        setShowPrintView(false);
      }, 500);
    }, 300);
  };
  
  // If in print view, show only the printable labels
  if (showPrintView) {
    return (
      <PrintViewContainer>
        <style>
          {`
            @page {
              size: auto;
              margin: 0;
            }
            
            @media print {
              /* Hide all browser-generated content */
              @page {
                margin: 0;
              }
              
              html, body {
                margin: 0;
                padding: 0;
                height: 100%;
              }
              
              /* Hide everything except the labels */
              body * {
                visibility: hidden;
              }
              
              /* Only show the print labels container and its children */
              .print-labels-container, .print-labels-container * {
                visibility: visible;
              }
              
              /* Position the print container at the top left */
              .print-labels-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              
              /* Hide browser-generated headers and footers */
              body::before, body::after {
                content: none !important;
              }
              
              /* Hide date, page numbers, URL, etc. */
              html {
                -webkit-print-color-adjust: exact;
              }
            }
          `}
        </style>
        
        <PrintLabelsContainer className="print-labels-container">
          {createArrayOfLength(quantity).map((_, index) => (
            <PrintableLabel
              key={index}
              product={product}
              settings={labelSettings}
              width={dimensions.width}
              height={dimensions.height}
            />
          ))}
        </PrintLabelsContainer>
        
        <PrintButton onClick={() => setShowPrintView(false)}>
          <FiX size={16} />
          Close Print View
        </PrintButton>
      </PrintViewContainer>
    );
  }
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Print Product Label</h2>
          <button onClick={onClose} type="button">
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <label>Product</label>
            <input type="text" value={product.name} disabled />
          </FormGroup>
          
          <FormGroup>
            <label>Quantity</label>
            <QuantitySelector>
              <button onClick={decrementQuantity} type="button">
                <FiMinus size={16} />
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange} 
              />
              <button onClick={incrementQuantity} type="button">
                <FiPlus size={16} />
              </button>
            </QuantitySelector>
          </FormGroup>
          
          <PreviewSection>
            <PreviewTitle>Label Preview</PreviewTitle>
            <PreviewContainer ref={previewContainerRef}>
              <LabelPreview 
                width={dimensions.width} 
                height={dimensions.height}
                scale={previewScale}
                ref={previewRef}
              >
                <LabelContent fontSize={parseInt(labelSettings.fontSize)}>
                  <div className="product-name">{product.name}</div>
                  
                  {labelSettings.showSku && product.sku && (
                    <div className="product-sku">SKU: {product.sku}</div>
                  )}
                  
                  {labelSettings.showBarcode && product.barcode && (
                    <div className="product-barcode">
                      <svg ref={barcodeRef}></svg>
                    </div>
                  )}
                  
                  {labelSettings.showPrice && (
                    <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                  )}
                </LabelContent>
              </LabelPreview>
            </PreviewContainer>
          </PreviewSection>
        </ModalBody>
        
        <ModalFooter>
          <ActionButton secondary onClick={onClose} type="button">
            Cancel
          </ActionButton>
          <ActionButton onClick={handlePrint} type="button">
            <FiPrinter size={16} />
            Print Labels
          </ActionButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PrintLabelModal;
