import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiTrash2, FiPercent, FiDollarSign, FiShoppingCart, FiUser, FiSearch, FiX } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import { getCustomers } from '../services/customerService';
import { saveOrder } from '../services/orderService';
import CheckoutModal from './CheckoutModal';
import CustomerModal from './CustomerModal';
import DiscountModal from './DiscountModal';
import ItemDiscountModal from './ItemDiscountModal';
import CustomItemModal from './CustomItemModal';

// Styled components for the order interface
const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  background-color: white;
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CustomerSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid #eee;
  
  .customer-icon {
    color: #666;
  }
  
  .customer-info {
    flex: 1;
    
    .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }
    
    .name {
      font-weight: 500;
      color: #333;
    }
  }
  
  button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const OrderItemsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background-color: white;
`;

const EmptyOrderMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  padding: 24px;
  text-align: center;
  
  svg {
    font-size: 32px;
    margin-bottom: 16px;
    color: #ccc;
  }
  
  p {
    margin: 0;
    margin-bottom: 8px;
  }
  
  .suggestion {
    font-size: 14px;
    color: #999;
  }
`;

const OrderItem = styled.div`
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  
  .item-details {
    flex: 1;
    
    .item-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }
    
    .item-price {
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: center;
      
      .original-price {
        text-decoration: line-through;
        color: #999;
        margin-right: 8px;
      }
      
      .discount-badge {
        background-color: #e3f2fd;
        color: #1976d2;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 8px;
      }
    }
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    gap: 8px;
    
    button {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .quantity {
      font-weight: 500;
      min-width: 24px;
      text-align: center;
    }
  }
  
  .item-total {
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    margin-left: 16px;
    min-width: 70px;
    justify-content: flex-end;
  }
  
  .item-actions {
    display: flex;
    align-items: center;
    margin-left: 8px;
    
    button {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      
      &:hover {
        color: #d32f2f;
      }
    }
  }
`;

const OrderActionsBar = styled.div`
  display: flex;
  padding: 12px 16px;
  background-color: white;
  border-top: 1px solid #eee;
  gap: 8px;
  
  button {
    flex: 1;<boltAction type="file" filePath="src/components/NewOrder.jsx">
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    color: #333;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    &.primary {
      background-color: var(--primary-color);
      color: white;
      border: none;
      
      &:hover {
        background-color: #0055cc;
      }
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-top: 1px solid #eee;
  padding: 16px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  .label {
    color: #666;
  }
  
  .value {
    font-weight: 500;
    color: #333;
  }
  
  &.total-row {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #eee;
    
    .label, .value {
      font-weight: 600;
      font-size: 18px;
      color: #333;
    }
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #0055cc;
  }
  
  &:disabled {
    background-color: #a5c0e5;
    cursor: not-allowed;
  }
`;

const SearchContainer = styled.div`
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #eee;
  position: relative;
  
  input {
    width: 100%;
    padding: 10px 16px 10px 36px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  .search-icon {
    position: absolute;
    left: 26px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  
  .clear-button {
    position: absolute;
    right: 26px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    
    &:hover {
      color: #666;
    }
  }
`;

function NewOrder() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showItemDiscountModal, setShowItemDiscountModal] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState(null);
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('amount'); // 'amount' or 'percent'
  
  // Load products and customers on component mount
  useEffect(() => {
    loadProducts();
    loadCustomers();
    
    // Add event listeners for data changes
    window.addEventListener('productDataChanged', loadProducts);
    window.addEventListener('customerDataChanged', loadCustomers);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('productDataChanged', loadProducts);
      window.removeEventListener('customerDataChanged', loadCustomers);
    };
  }, []);
  
  // Filter products when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.sku?.toLowerCase().includes(query) ||
        product.barcode?.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);
  
  const loadProducts = () => {
    const productData = getProducts();
    setProducts(productData);
  };
  
  const loadCustomers = () => {
    const customerData = getCustomers();
    setCustomers(customerData);
  };
  
  const handleAddToOrder = (product) => {
    // Check if product is already in order
    const existingItemIndex = orderItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if already in order
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Add new item to order
      setOrderItems([...orderItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        discount: 0,
        discountType: 'amount'
      }]);
    }
    
    // Clear search after adding
    setSearchQuery('');
    setFilteredProducts([]);
  };
  
  const handleRemoveItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };
  
  const handleQuantityChange = (index, change) => {
    const updatedItems = [...orderItems];
    const newQuantity = updatedItems[index].quantity + change;
    
    if (newQuantity > 0) {
      updatedItems[index].quantity = newQuantity;
      setOrderItems(updatedItems);
    }
  };
  
  const handleAddCustomItem = (customItem) => {
    setOrderItems([...orderItems, {
      id: `custom-${Date.now()}`,
      name: customItem.name,
      price: customItem.price,
      quantity: 1,
      discount: 0,
      discountType: 'amount',
      isCustom: true
    }]);
    setShowCustomItemModal(false);
  };
  
  const handleApplyItemDiscount = (discount, type) => {
    if (selectedItemForDiscount === null) return;
    
    const updatedItems = [...orderItems];
    updatedItems[selectedItemForDiscount].discount = discount;
    updatedItems[selectedItemForDiscount].discountType = type;
    setOrderItems(updatedItems);
    setShowItemDiscountModal(false);
    setSelectedItemForDiscount(null);
  };
  
  const handleApplyOrderDiscount = (discount, type) => {
    setOrderDiscount(discount);
    setDiscountType(type);
    setShowDiscountModal(false);
  };
  
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
  };
  
  const calculateItemTotal = (item) => {
    let itemTotal = item.price * item.quantity;
    
    if (item.discount > 0) {
      if (item.discountType === 'amount') {
        // Fixed amount discount per item
        itemTotal -= item.discount * item.quantity;
      } else {
        // Percentage discount
        itemTotal -= (itemTotal * (item.discount / 100));
      }
    }
    
    return Math.max(0, itemTotal);
  };
  
  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };
  
  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    
    if (orderDiscount <= 0) return 0;
    
    if (discountType === 'amount') {
      return Math.min(orderDiscount, subtotal);
    } else {
      return subtotal * (orderDiscount / 100);
    }
  };
  
  const calculateTax = () => {
    // Assuming tax is applied after discounts
    const taxableAmount = calculateSubtotal() - calculateDiscount();
    // Using a fixed tax rate of 8.25% for this example
    const taxRate = 0.0825;
    return taxableAmount * taxRate;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };
  
  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };
  
  const handleCompleteOrder = (paymentDetails) => {
    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      items: orderItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        discountType: item.discountType,
        total: calculateItemTotal(item)
      })),
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      discountType,
      tax: calculateTax(),
      total: calculateTotal(),
      customer: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerId: selectedCustomer ? selectedCustomer.id : null,
      status: 'completed',
      paymentMethod: paymentDetails.method,
      paymentDetails
    };
    
    // Save order
    saveOrder(order);
    
    // Reset order state
    setOrderItems([]);
    setSelectedCustomer(null);
    setOrderDiscount(0);
    setDiscountType('amount');
    
    // Close checkout modal
    setShowCheckoutModal(false);
    
    return order;
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredProducts([]);
  };
  
  return (
    <>
      <OrderContainer>
        <OrderHeader>
          <OrderTitle>New Order</OrderTitle>
        </OrderHeader>
        
        <CustomerSection>
          <FiUser className="customer-icon" />
          <div className="customer-info">
            <div className="label">Customer</div>
            <div className="name">{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</div>
          </div>
          <button onClick={() => setShowCustomerModal(true)}>
            {selectedCustomer ? 'Change' : 'Add'}
          </button>
        </CustomerSection>
        
        <SearchContainer>
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products by name, SKU, or barcode..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-button" onClick={handleClearSearch}>
              <FiX />
            </button>
          )}
        </SearchContainer>
        
        {filteredProducts.length > 0 && (
          <div className="search-results">
            {filteredProducts.map(product => (
              <OrderItem key={product.id}>
                <div className="item-details">
                  <div className="item-name">{product.name}</div>
                  <div className="item-price">${product.price.toFixed(2)}</div>
                </div>
                <button 
                  onClick={() => handleAddToOrder(product)}
                  style={{ 
                    marginLeft: 'auto', 
                    background: 'var(--primary-color)', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  <FiPlus size={16} />
                </button>
              </OrderItem>
            ))}
          </div>
        )}
        
        <OrderItemsContainer>
          {orderItems.length === 0 ? (
            <EmptyOrderMessage>
              <FiShoppingCart />
              <p>No items in order yet</p>
              <div className="suggestion">Search for products above or add a custom item</div>
            </EmptyOrderMessage>
          ) : (
            orderItems.map((item, index) => (
              <OrderItem key={index}>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">
                    {item.discount > 0 && (
                      <span className="original-price">${item.price.toFixed(2)}</span>
                    )}
                    ${(item.discount > 0 
                      ? (item.discountType === 'amount' 
                        ? item.price - item.discount 
                        : item.price * (1 - item.discount / 100))
                      : item.price).toFixed(2)}
                    {item.discount > 0 && (
                      <span className="discount-badge">
                        {item.discountType === 'amount' 
                          ? `-$${item.discount.toFixed(2)}` 
                          : `-${item.discount}%`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="item-quantity">
                  <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                </div>
                <div className="item-total">
                  ${calculateItemTotal(item).toFixed(2)}
                </div>
                <div className="item-actions">
                  <button 
                    onClick={() => {
                      setSelectedItemForDiscount(index);
                      setShowItemDiscountModal(true);
                    }}
                    title="Apply discount"
                  >
                    <FiPercent />
                  </button>
                  <button 
                    onClick={() => handleRemoveItem(index)}
                    title="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </OrderItem>
            ))
          )}
        </OrderItemsContainer>
        
        <OrderActionsBar>
          <button onClick={() => setShowCustomItemModal(true)}>
            <FiPlus size={16} />
            Custom Item
          </button>
          <button onClick={() => setShowDiscountModal(true)}>
            <FiPercent size={16} />
            Discount
          </button>
        </OrderActionsBar>
        
        <OrderSummary>
          <SummaryRow>
            <div className="label">Subtotal</div>
            <div className="value">${calculateSubtotal().toFixed(2)}</div>
          </SummaryRow>
          <SummaryRow>
            <div className="label">
              Discount
              {orderDiscount > 0 && (
                <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>
                  ({discountType === 'amount' ? `$${orderDiscount.toFixed(2)}` : `${orderDiscount}%`})
                </span>
              )}
            </div>
            <div className="value">-${calculateDiscount().toFixed(2)}</div>
          </SummaryRow>
          <SummaryRow>
            <div className="label">Tax (8.25%)</div>
            <div className="value">${calculateTax().toFixed(2)}</div>
          </SummaryRow>
          <SummaryRow className="total-row">
            <div className="label">Total</div>
            <div className="value">${calculateTotal().toFixed(2)}</div>
          </SummaryRow>
          
          <CheckoutButton 
            onClick={handleCheckout}
            disabled={orderItems.length === 0}
          >
            <FiDollarSign size={18} />
            Checkout
          </CheckoutButton>
        </OrderSummary>
      </OrderContainer>
      
      {/* Modals */}
      <CheckoutModal 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        orderTotal={calculateTotal()}
        subtotal={calculateSubtotal()}
        discount={calculateDiscount()}
        tax={calculateTax()}
        onCompleteOrder={handleCompleteOrder}
      />
      
      <CustomerModal 
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customers={customers}
        onSelectCustomer={handleSelectCustomer}
        selectedCustomer={selectedCustomer}
      />
      
      <DiscountModal 
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApplyDiscount={handleApplyOrderDiscount}
        currentDiscount={orderDiscount}
        currentType={discountType}
        subtotal={calculateSubtotal()}
      />
      
      <ItemDiscountModal 
        isOpen={showItemDiscountModal}
        onClose={() => {
          setShowItemDiscountModal(false);
          setSelectedItemForDiscount(null);
        }}
        onApplyDiscount={handleApplyItemDiscount}
        item={selectedItemForDiscount !== null ? orderItems[selectedItemForDiscount] : null}
      />
      
      <CustomItemModal 
        isOpen={showCustomItemModal}
        onClose={() => setShowCustomItemModal(false)}
        onAddCustomItem={handleAddCustomItem}
      />
    </>
  );
}

export default NewOrder;
