import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUpload, FiX, FiEye, FiSave } from 'react-icons/fi';
import { getReceiptSettings, saveReceiptSettings } from '../services/settingsService';
import Receipt from './Receipt';

const SettingsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
`;

const SettingsForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="number"],
  input[type="url"],
  textarea {
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
  
  textarea {
    min-height: 80px;
    resize: vertical;
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

const LogoUploadContainer = styled.div`
  margin-top: 10px;
  border: 2px dashed #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  .upload-instructions {
    margin-bottom: 15px;
    color: #666;
    font-size: 14px;
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  input {
    display: none;
  }
`;

const LogoPreviewContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .logo-image-container {
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  .remove-logo {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

const LogoActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
`;

const SaveLogoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #0055cc;
  }
  
  &:disabled {
    background-color: #a5c0e5;
    cursor: not-allowed;
  }
`;

const PreviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
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
  width: 100%;
  
  &:hover {
    background-color: #0055cc;
  }
  
  &:disabled {
    background-color: #a5c0e5;
    cursor: not-allowed;
  }
`;

const PreviewContainer = styled.div`
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
  padding: 20px;
  
  .preview-content {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    
    .close-preview {
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
  }
`;

const StatusMessage = styled.div`
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  
  &.success {
    background-color: #e6f7e6;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  &.error {
    background-color: #fdecea;
    color: #d32f2f;
    border: 1px solid #ffcdd2;
  }
`;

const QRCodeContainer = styled.div`
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const LicenseNumberContainer = styled.div`
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const ReceiptSettings = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    showLogo: false,
    logoUrl: '',
    showQRCode: false,
    qrCodeUrl: '',
    licenseNumber: '',
    returnPolicy: '',
    thankYouMessage: '',
    footerText: '',
    printAutomatically: false,
    copies: 1
  });
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewOrder, setPreviewOrder] = useState(null);
  const [tempLogoUrl, setTempLogoUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  
  // Load settings on component mount
  useEffect(() => {
    const loadedSettings = getReceiptSettings();
    setSettings(loadedSettings);
    setTempLogoUrl(loadedSettings.logoUrl || '');
    
    // Create a sample order for preview
    setPreviewOrder({
      id: 'ORD-12345',
      date: new Date().toISOString(),
      customer: 'John Doe',
      cashier: 'Jane Smith',
      items: [
        { name: 'Product 1', quantity: 2, price: 10.99 },
        { name: 'Product 2', quantity: 1, price: 24.99 },
        { name: 'Product with a very long name that might wrap', quantity: 3, price: 5.99 }
      ],
      subtotal: 64.94,
      discount: 5.00,
      tax: 4.79,
      total: 64.73,
      payments: [
        { method: 'Cash', amount: 70.00 }
      ],
      change: 5.27
    });
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        setStatusMessage({
          type: 'error',
          message: 'Image is too large. Please upload an image smaller than 1MB.'
        });
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setStatusMessage({
          type: 'error',
          message: 'Please upload a valid image file (JPEG, PNG, GIF).'
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempLogoUrl(event.target.result);
        setStatusMessage({
          type: 'success',
          message: 'Image uploaded successfully. Click "Save Logo" to apply changes.'
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveLogo = () => {
    setSettings(prev => ({
      ...prev,
      logoUrl: tempLogoUrl,
      showLogo: true
    }));
    setStatusMessage({
      type: 'success',
      message: 'Logo saved successfully!'
    });
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage({ type: '', message: '' });
    }, 3000);
  };
  
  const handleRemoveLogo = () => {
    setTempLogoUrl('');
    setSettings(prev => ({
      ...prev,
      logoUrl: '',
      showLogo: false
    }));
    setStatusMessage({
      type: 'success',
      message: 'Logo removed successfully!'
    });
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage({ type: '', message: '' });
    }, 3000);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    saveReceiptSettings(settings);
    setStatusMessage({
      type: 'success',
      message: 'Receipt settings saved successfully!'
    });
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage({ type: '', message: '' });
    }, 3000);
  };
  
  const handleOpenPreview = () => {
    // Ensure we have a valid preview order before opening
    if (!previewOrder) {
      // Create a sample order if it doesn't exist
      setPreviewOrder({
        id: 'ORD-12345',
        date: new Date().toISOString(),
        customer: 'John Doe',
        cashier: 'Jane Smith',
        items: [
          { name: 'Product 1', quantity: 2, price: 10.99 },
          { name: 'Product 2', quantity: 1, price: 24.99 },
          { name: 'Product with a very long name that might wrap', quantity: 3, price: 5.99 }
        ],
        subtotal: 64.94,
        discount: 5.00,
        tax: 4.79,
        total: 64.73,
        payments: [
          { method: 'Cash', amount: 70.00 }
        ],
        change: 5.27
      });
    }
    
    // Open the preview modal
    setIsPreviewOpen(true);
  };
  
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };
  
  return (
    <SettingsContainer>
      <SettingsHeader>
        <h2>Receipt Settings</h2>
        <PreviewButton type="button" onClick={handleOpenPreview}>
          <FiEye size={16} />
          Preview Receipt
        </PreviewButton>
      </SettingsHeader>
      
      <SettingsForm onSubmit={handleSubmit}>
        <div>
          <FormSection>
            <h3>Store Information</h3>
            <FormGroup>
              <label htmlFor="storeName">Store Name</label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={settings.storeName}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="storeAddress">Store Address</label>
              <input
                type="text"
                id="storeAddress"
                name="storeAddress"
                value={settings.storeAddress}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="storePhone">Store Phone</label>
              <input
                type="tel"
                id="storePhone"
                name="storePhone"
                value={settings.storePhone}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="storeEmail">Store Email</label>
              <input
                type="email"
                id="storeEmail"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <LicenseNumberContainer>
              <FormGroup>
                <label htmlFor="licenseNumber">License Number</label>
                <textarea
                  id="licenseNumber"
                  name="licenseNumber"
                  value={settings.licenseNumber}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter your business license number or other registration information"
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Enter up to 4 lines of license or registration information to display on receipts.
                </p>
              </FormGroup>
            </LicenseNumberContainer>
          </FormSection>
          
          <FormSection>
            <h3>Receipt Content</h3>
            <FormGroup>
              <label htmlFor="returnPolicy">Return Policy</label>
              <textarea
                id="returnPolicy"
                name="returnPolicy"
                value={settings.returnPolicy}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="thankYouMessage">Thank You Message</label>
              <input
                type="text"
                id="thankYouMessage"
                name="thankYouMessage"
                value={settings.thankYouMessage}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="footerText">Footer Text</label>
              <textarea
                id="footerText"
                name="footerText"
                value={settings.footerText}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormSection>
        </div>
        
        <div>
          <FormSection>
            <h3>Receipt Appearance</h3>
            <ToggleGroup>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  id="showLogo"
                  name="showLogo"
                  checked={settings.showLogo}
                  onChange={handleInputChange}
                />
                <span className="slider"></span>
              </ToggleSwitch>
              <label htmlFor="showLogo">Show Store Logo</label>
            </ToggleGroup>
            
            <LogoUploadContainer>
              {!tempLogoUrl ? (
                <>
                  <div className="upload-instructions">
                    Upload your store logo to display on receipts.<br />
                    Recommended size: 300px × 150px. Max size: 1MB.
                  </div>
                  <UploadButton htmlFor="logoUpload">
                    <FiUpload size={18} />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      id="logoUpload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </UploadButton>
                </>
              ) : (
                <>
                  <LogoPreviewContainer>
                    <div className="logo-image-container">
                      <img src={tempLogoUrl} alt="Store Logo" />
                    </div>
                    <div className="remove-logo" onClick={handleRemoveLogo}>
                      <FiX size={14} />
                    </div>
                  </LogoPreviewContainer>
                  
                  <LogoActionButtons>
                    <SaveLogoButton 
                      type="button" 
                      onClick={handleSaveLogo}
                      disabled={tempLogoUrl === settings.logoUrl}
                    >
                      <FiSave size={16} />
                      Save Logo
                    </SaveLogoButton>
                  </LogoActionButtons>
                </>
              )}
              
              {statusMessage.message && (
                <StatusMessage className={statusMessage.type}>
                  {statusMessage.message}
                </StatusMessage>
              )}
            </LogoUploadContainer>
            
            <ToggleGroup>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  id="showQRCode"
                  name="showQRCode"
                  checked={settings.showQRCode}
                  onChange={handleInputChange}
                />
                <span className="slider"></span>
              </ToggleSwitch>
              <label htmlFor="showQRCode">Show QR Code</label>
            </ToggleGroup>
            
            {settings.showQRCode && (
              <QRCodeContainer>
                <FormGroup>
                  <label htmlFor="qrCodeUrl">QR Code Link</label>
                  <input
                    type="url"
                    id="qrCodeUrl"
                    name="qrCodeUrl"
                    placeholder="https://example.com"
                    value={settings.qrCodeUrl}
                    onChange={handleInputChange}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Enter a URL that customers can scan to visit your website, social media, or feedback form.
                  </p>
                </FormGroup>
              </QRCodeContainer>
            )}
          </FormSection>
          
          <FormSection>
            <h3>Print Settings</h3>
            <ToggleGroup>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  id="printAutomatically"
                  name="printAutomatically"
                  checked={settings.printAutomatically}
                  onChange={handleInputChange}
                />
                <span className="slider"></span>
              </ToggleSwitch>
              <label htmlFor="printAutomatically">Print Automatically After Sale</label>
            </ToggleGroup>
            
            <FormGroup>
              <label htmlFor="copies">Number of Copies</label>
              <input
                type="number"
                id="copies"
                name="copies"
                min="1"
                max="5"
                value={settings.copies}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormSection>
          
          <SaveButton type="submit">
            Save Receipt Settings
          </SaveButton>
          
          {statusMessage.message && statusMessage.type === 'success' && (
            <StatusMessage className={statusMessage.type}>
              {statusMessage.message}
            </StatusMessage>
          )}
        </div>
      </SettingsForm>
      
      {isPreviewOpen && previewOrder && (
        <PreviewContainer onClick={handleClosePreview}>
          <div className="preview-content" onClick={e => e.stopPropagation()}>
            <button className="close-preview" onClick={handleClosePreview}>
              <FiX />
            </button>
            <Receipt order={previewOrder} settings={settings} />
          </div>
        </PreviewContainer>
      )}
    </SettingsContainer>
  );
};

export default ReceiptSettings;
