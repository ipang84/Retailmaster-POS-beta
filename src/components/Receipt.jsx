import React from 'react';
import styled from 'styled-components';
import { FiPrinter } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';

const ReceiptContainer = styled.div`
  width: 80mm;
  background-color: white;
  padding: 10px;
  font-family: 'Courier New', monospace;
  color: #000;
  margin: 0 auto;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  
  @media print {
    box-shadow: none;
    width: 100%;
    padding: 0;
  }
`;

const ReceiptHeader = styled.div`
  text-align: center;
  margin-bottom: 10px;
  
  .logo {
    max-width: 60mm;
    max-height: 20mm;
    margin-bottom: 5px;
  }
  
  .store-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 3px;
  }
  
  .store-info {
    font-size: 12px;
    margin-bottom: 2px;
  }
  
  .license-number {
    font-size: 11px;
    margin-top: 5px;
    white-space: pre-line;
    line-height: 1.3;
  }
`;

const ReceiptDivider = styled.div`
  border-top: 1px dashed #000;
  margin: 5px 0;
`;

const ReceiptInfo = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
  }
`;

const ReceiptItems = styled.div`
  margin-bottom: 10px;
  
  .item-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 5px;
    
    .item-name {
      flex: 2;
    }
    
    .item-qty {
      flex: 0.5;
      text-align: center;
    }
    
    .item-price {
      flex: 1;
      text-align: right;
    }
  }
  
  .item-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 3px;
    
    .item-name {
      flex: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .item-qty {
      flex: 0.5;
      text-align: center;
    }
    
    .item-price {
      flex: 1;
      text-align: right;
    }
  }
`;

const ReceiptSummary = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
    
    &.total {
      font-weight: bold;
      font-size: 14px;
    }
  }
`;

const ReceiptPayment = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  
  .payment-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
  }
`;

const ReceiptFooter = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  
  .policy {
    margin-bottom: 5px;
  }
  
  .thank-you {
    font-weight: bold;
    margin-top: 10px;
  }
  
  .qr-code {
    margin: 10px auto;
    display: flex;
    justify-content: center;
  }
`;

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
  margin: 10px auto;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  @media print {
    display: none;
  }
`;

const Receipt = ({ order, settings = {}, onPrint }) => {
  // Default settings if not provided
  const defaultSettings = {
    storeName: 'Your Store Name',
    storeAddress: '123 Main St, City, State, ZIP',
    storePhone: '(123) 456-7890',
    storeEmail: 'store@example.com',
    showLogo: false,
    logoUrl: '',
    showQRCode: false,
    qrCodeUrl: '',
    licenseNumber: '',
    returnPolicy: 'Returns accepted within 30 days with receipt.',
    thankYouMessage: 'Thank you for your business!',
    footerText: '',
  };
  
  const mergedSettings = { ...defaultSettings, ...settings };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle print button click
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };
  
  // Generate QR code data
  const getQRCodeValue = () => {
    // If a custom URL is provided, use that
    if (mergedSettings.qrCodeUrl) {
      return mergedSettings.qrCodeUrl;
    }
    
    // Otherwise, create a simple JSON object with order details
    const qrData = {
      orderId: order.id,
      date: order.date,
      total: order.total,
      items: order.items.length
    };
    
    return JSON.stringify(qrData);
  };
  
  if (!order) return null;
  
  return (
    <>
      <ReceiptContainer>
        <ReceiptHeader>
          {mergedSettings.showLogo && mergedSettings.logoUrl && (
            <img src={mergedSettings.logoUrl} alt="Store Logo" className="logo" />
          )}
          <div className="store-name">{mergedSettings.storeName}</div>
          <div className="store-info">{mergedSettings.storeAddress}</div>
          <div className="store-info">Tel: {mergedSettings.storePhone}</div>
          <div className="store-info">{mergedSettings.storeEmail}</div>
          {mergedSettings.licenseNumber && (
            <div className="license-number">{mergedSettings.licenseNumber}</div>
          )}
        </ReceiptHeader>
        
        <ReceiptDivider />
        
        <ReceiptInfo>
          <div className="info-row">
            <span>Order #:</span>
            <span>{order.id}</span>
          </div>
          <div className="info-row">
            <span>Date:</span>
            <span>{formatDate(order.date)}</span>
          </div>
          <div className="info-row">
            <span>Customer:</span>
            <span>{order.customer || 'Walk in customer'}</span>
          </div>
          {order.cashier && (
            <div className="info-row">
              <span>Cashier:</span>
              <span>{order.cashier}</span>
            </div>
          )}
        </ReceiptInfo>
        
        <ReceiptDivider />
        
        <ReceiptItems>
          <div className="item-header">
            <div className="item-name">Item</div>
            <div className="item-qty">Qty</div>
            <div className="item-price">Price</div>
          </div>
          
          {order.items.map((item, index) => (
            <div className="item-row" key={index}>
              <div className="item-name">{item.name}</div>
              <div className="item-qty">{item.quantity}</div>
              <div className="item-price">${(item.quantity * item.price).toFixed(2)}</div>
            </div>
          ))}
        </ReceiptItems>
        
        <ReceiptDivider />
        
        <ReceiptSummary>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          
          {order.discount > 0 && (
            <div className="summary-row">
              <span>Discount:</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          
          {order.tax > 0 && (
            <div className="summary-row">
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
          )}
          
          <div className="summary-row total">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </ReceiptSummary>
        
        {order.payments && order.payments.length > 0 && (
          <>
            <ReceiptDivider />
            
            <ReceiptPayment>
              {order.payments.map((payment, index) => (
                <div className="payment-row" key={index}>
                  <span>{payment.method}:</span>
                  <span>${payment.amount.toFixed(2)}</span>
                </div>
              ))}
              
              {order.change > 0 && (
                <div className="payment-row">
                  <span>Change:</span>
                  <span>${order.change.toFixed(2)}</span>
                </div>
              )}
            </ReceiptPayment>
          </>
        )}
        
        <ReceiptDivider />
        
        <ReceiptFooter>
          {mergedSettings.returnPolicy && (
            <div className="policy">{mergedSettings.returnPolicy}</div>
          )}
          
          {mergedSettings.footerText && (
            <div className="footer-text">{mergedSettings.footerText}</div>
          )}
          
          {mergedSettings.showQRCode && (
            <div className="qr-code">
              <QRCodeSVG 
                value={getQRCodeValue()} 
                size={100}
                level="M"
              />
            </div>
          )}
          
          <div className="thank-you">{mergedSettings.thankYouMessage}</div>
        </ReceiptFooter>
      </ReceiptContainer>
      
      <PrintButton onClick={handlePrint}>
        <FiPrinter size={16} />
        Print Receipt
      </PrintButton>
    </>
  );
};

export default Receipt;
