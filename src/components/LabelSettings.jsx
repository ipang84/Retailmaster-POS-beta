import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiPrinter, FiType, FiTag } from 'react-icons/fi';
import { getLabelSettings, saveLabelSettings } from '../services/settingsService';
import JsBarcode from 'jsbarcode';

const LabelSettingsContainer = styled.div`
  max-width: 800px;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--text-color);
  }
  
  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    background-color: var(--card-background);
    color: var(--text-color);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  label {
    margin-left: 10px;
    margin-bottom: 0;
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: var(--primary-color);
  }
  
  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #0055cc;
  }
`;

const StatusMessage = styled.div`
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  
  &.success {
    background-color: rgba(76, 175, 80, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(76, 175, 80, 0.2);
  }
`;

const LabelPreview = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px dashed var(--border-color);
  border-radius: 4px;
  padding: 10px;
  background-color: white;
  color: black;
  width: ${props => props.width}mm;
  height: ${props => props.height}mm;
  position: relative;
  overflow: hidden;
  transform-origin: top left;
  transform: scale(${props => props.scale || 1});
  margin-left: 0;
  
  /* Responsive scaling */
  @media (min-width: 768px) {
    transform: scale(${props => props.scale * 1.5 || 1.5});
    margin-left: 10px;
    margin-bottom: 40px;
  }
  
  @media (min-width: 992px) {
    transform: scale(${props => props.scale * 2 || 2});
    margin-left: 20px;
    margin-bottom: 60px;
  }
`;

const PreviewTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-color);
`;

const PreviewContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  overflow: hidden;
  padding-bottom: 60px;
  min-height: 200px;
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

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--text-color);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const LabelSizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const LabelSizeOption = styled.div`
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  flex: 1;
  min-width: 150px;
  text-align: center;
  background-color: ${props => props.selected ? 'rgba(0, 102, 255, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: var(--primary-color);
  }
  
  .size-name {
    font-weight: 500;
    margin-bottom: 5px;
  }
  
  .size-dimensions {
    font-size: 12px;
    color: var(--text-secondary);
  }
`;

const CustomSizeInputs = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  
  input {
    width: 80px;
  }
`;

const BarcodeFormatSelect = styled.div`
  margin-top: 10px;
  
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    background-color: var(--card-background);
    color: var(--text-color);
  }
`;

const LabelSettings = () => {
  const [labelSettings, setLabelSettings] = useState(() => {
    const settings = getLabelSettings();
    // Add default barcodeFormat if it doesn't exist
    if (!settings.barcodeFormat) {
      settings.barcodeFormat = 'CODE128';
    }
    return settings;
  });
  const [statusMessage, setStatusMessage] = useState('');
  const barcodeRef = useRef(null);
  
  useEffect(() => {
    // Generate barcode when settings change or component mounts
    if (labelSettings.showBarcode && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, "SAMPLE-123", {
          format: labelSettings.barcodeFormat || "CODE128",
          width: 1.5,
          height: 30,
          displayValue: false,
          margin: 0,
          background: "transparent"
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [labelSettings.showBarcode, labelSettings.barcodeFormat]);
  
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLabelSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleLabelSizeSelect = (size) => {
    setLabelSettings(prev => ({
      ...prev,
      labelSize: size
    }));
  };
  
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    saveLabelSettings(labelSettings);
    setStatusMessage('Label settings saved successfully!');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
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
  
  // Calculate appropriate scale based on dimensions
  const calculateScale = () => {
    // Base scale factor
    const baseScale = 0.5;
    
    // Adjust scale for different label sizes
    if (labelSettings.labelSize === 'small') return baseScale * 1.2;
    if (labelSettings.labelSize === 'large') return baseScale * 0.8;
    if (labelSettings.labelSize === 'custom') {
      const width = parseInt(labelSettings.customWidth) || 50;
      // Adjust scale for very wide or narrow custom labels
      if (width > 70) return baseScale * 0.6;
      if (width < 40) return baseScale * 1.3;
    }
    
    return baseScale;
  };
  
  return (
    <LabelSettingsContainer>
      <SectionTitle>
        <FiPrinter size={18} />
        Product Label Settings
      </SectionTitle>
      
      <form onSubmit={handleSettingsSubmit}>
        <FormGroup>
          <label>Label Size</label>
          <LabelSizeOptions>
            <LabelSizeOption 
              selected={labelSettings.labelSize === 'small'} 
              onClick={() => handleLabelSizeSelect('small')}
            >
              <div className="size-name">Small</div>
              <div className="size-dimensions">37mm × 22mm</div>
            </LabelSizeOption>
            
            <LabelSizeOption 
              selected={labelSettings.labelSize === 'medium'} 
              onClick={() => handleLabelSizeSelect('medium')}
            >
              <div className="size-name">Medium</div>
              <div className="size-dimensions">50mm × 25mm</div>
            </LabelSizeOption>
            
            <LabelSizeOption 
              selected={labelSettings.labelSize === 'large'} 
              onClick={() => handleLabelSizeSelect('large')}
            >
              <div className="size-name">Large</div>
              <div className="size-dimensions">62mm × 29mm</div>
            </LabelSizeOption>
            
            <LabelSizeOption 
              selected={labelSettings.labelSize === 'custom'} 
              onClick={() => handleLabelSizeSelect('custom')}
            >
              <div className="size-name">Custom</div>
              <div className="size-dimensions">Custom Size</div>
            </LabelSizeOption>
          </LabelSizeOptions>
          
          {labelSettings.labelSize === 'custom' && (
            <CustomSizeInputs>
              <FormGroup>
                <label htmlFor="customWidth">Width (mm)</label>
                <input 
                  type="number" 
                  id="customWidth" 
                  name="customWidth" 
                  min="20" 
                  max="100" 
                  value={labelSettings.customWidth || ''}
                  onChange={handleSettingsChange}
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="customHeight">Height (mm)</label>
                <input 
                  type="number" 
                  id="customHeight" 
                  name="customHeight" 
                  min="10" 
                  max="100" 
                  value={labelSettings.customHeight || ''}
                  onChange={handleSettingsChange}
                />
              </FormGroup>
            </CustomSizeInputs>
          )}
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="fontSize">
            <FiType size={16} style={{ marginRight: '5px' }} />
            Font Size (px)
          </label>
          <input 
            type="range" 
            id="fontSize" 
            name="fontSize" 
            min="6" 
            max="14" 
            value={labelSettings.fontSize || '10'}
            onChange={handleSettingsChange}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Small</span>
            <span>Current: {labelSettings.fontSize || '10'}px</span>
            <span>Large</span>
          </div>
        </FormGroup>
        
        <ToggleGroup>
          <ToggleSwitch>
            <input
              type="checkbox"
              id="showSku"
              name="showSku"
              checked={!!labelSettings.showSku}
              onChange={handleSettingsChange}
            />
            <span className="slider"></span>
          </ToggleSwitch>
          <label htmlFor="showSku">Show SKU Number</label>
        </ToggleGroup>
        
        <ToggleGroup>
          <ToggleSwitch>
            <input
              type="checkbox"
              id="showBarcode"
              name="showBarcode"
              checked={!!labelSettings.showBarcode}
              onChange={handleSettingsChange}
            />
            <span className="slider"></span>
          </ToggleSwitch>
          <label htmlFor="showBarcode">Show Barcode</label>
        </ToggleGroup>
        
        {labelSettings.showBarcode && (
          <BarcodeFormatSelect>
            <label htmlFor="barcodeFormat">Barcode Format</label>
            <select
              id="barcodeFormat"
              name="barcodeFormat"
              value={labelSettings.barcodeFormat || 'CODE128'}
              onChange={handleSettingsChange}
            >
              <option value="CODE128">CODE128 (General purpose)</option>
              <option value="EAN13">EAN-13 (European Article Number)</option>
              <option value="UPC">UPC (Universal Product Code)</option>
              <option value="CODE39">CODE39 (Alpha-numeric)</option>
              <option value="ITF14">ITF-14 (Shipping containers)</option>
              <option value="MSI">MSI (Inventory marking)</option>
              <option value="pharmacode">Pharmacode (Pharmaceutical marking)</option>
            </select>
          </BarcodeFormatSelect>
        )}
        
        <ToggleGroup>
          <ToggleSwitch>
            <input
              type="checkbox"
              id="showPrice"
              name="showPrice"
              checked={!!labelSettings.showPrice}
              onChange={handleSettingsChange}
            />
            <span className="slider"></span>
          </ToggleSwitch>
          <label htmlFor="showPrice">Show Price</label>
        </ToggleGroup>
        
        <PreviewContainer>
          <PreviewTitle>Label Preview</PreviewTitle>
          <LabelPreview 
            width={dimensions.width} 
            height={dimensions.height}
            scale={calculateScale()}
          >
            <LabelContent fontSize={parseInt(labelSettings.fontSize || '10')}>
              <div className="product-name">Sample Product Name</div>
              
              {labelSettings.showSku && (
                <div className="product-sku">SKU: SAMPLE-123</div>
              )}
              
              {labelSettings.showBarcode && (
                <div className="product-barcode">
                  <svg ref={barcodeRef}></svg>
                </div>
              )}
              
              {labelSettings.showPrice && (
                <div className="product-price">$19.99</div>
              )}
            </LabelContent>
          </LabelPreview>
        </PreviewContainer>
        
        <SaveButton type="submit">
          Save Label Settings
        </SaveButton>
        
        {statusMessage && (
          <StatusMessage className="success">
            {statusMessage}
          </StatusMessage>
        )}
      </form>
    </LabelSettingsContainer>
  );
};

export default LabelSettings;
