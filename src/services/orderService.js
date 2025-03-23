// Order service functions

// Function to get financial data
export function getFinancialData() {
  // Try to get orders from localStorage first
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      
      // Group orders by date and calculate totals
      const financialData = {};
      
      orders.forEach(order => {
        // Extract date portion (YYYY-MM-DD) from ISO string or use date field
        let orderDate;
        if (order.date) {
          if (order.date.includes('T')) {
            orderDate = order.date.split('T')[0];
          } else {
            orderDate = order.date.substring(0, 10); // Assume YYYY-MM-DD format or similar
          }
        } else {
          orderDate = new Date().toISOString().split('T')[0];
        }
        
        // Initialize date entry if it doesn't exist
        if (!financialData[orderDate]) {
          financialData[orderDate] = {
            sales: 0,
            refunds: 0,
            netRevenue: 0,
            cashPayments: 0,
            cardPayments: 0,
            digitalPayments: 0
          };
        }
        
        // Add order total to sales if order is completed
        if (order.status === 'completed') {
          financialData[orderDate].sales += parseFloat(order.total) || 0;
          
          // Update payment method totals if available
          if (order.paymentMethod === 'cash') {
            financialData[orderDate].cashPayments += parseFloat(order.total) || 0;
          } else if (order.paymentMethod === 'card') {
            financialData[orderDate].cardPayments += parseFloat(order.total) || 0;
          } else if (order.paymentMethod === 'digital') {
            financialData[orderDate].digitalPayments += parseFloat(order.total) || 0;
          }
          
          // Calculate refunds if any
          if (order.refunds && order.refunds.length > 0) {
            const refundTotal = order.refunds.reduce((total, refund) => total + (parseFloat(refund.amount) || 0), 0);
            financialData[orderDate].refunds += refundTotal;
          }
          
          // Calculate net revenue
          financialData[orderDate].netRevenue = financialData[orderDate].sales - financialData[orderDate].refunds;
        }
      });
      
      return financialData;
    }
  } catch (error) {
    console.error('Error calculating financial data from localStorage:', error);
  }
  
  // If no orders in localStorage or error occurred, return mock data
  return {
    '2023-04-01': {
      sales: 1250.75,
      refunds: 125.50,
      netRevenue: 1125.25,
      cashPayments: 450.25,
      cardPayments: 650.50,
      digitalPayments: 150.00
    },
    '2023-04-02': {
      sales: 980.25,
      refunds: 75.00,
      netRevenue: 905.25,
      cashPayments: 300.00,
      cardPayments: 580.25,
      digitalPayments: 100.00
    },
    '2023-04-03': {
      sales: 1450.00,
      refunds: 200.00,
      netRevenue: 1250.00,
      cashPayments: 500.00,
      cardPayments: 750.00,
      digitalPayments: 200.00
    }
  };
}

// Function to get top selling items for a given period
export function getTopSellingItems(days = 30, limit = 5) {
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      
      // Calculate the date threshold (e.g., 30 days ago)
      const now = new Date();
      const threshold = new Date(now.setDate(now.getDate() - days));
      
      // Filter orders by date and status
      const recentOrders = orders.filter(order => {
        // Parse order date
        const orderDate = new Date(order.date);
        return orderDate >= threshold && order.status === 'completed';
      });
      
      // Aggregate items sold
      const itemsSold = {};
      
      recentOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const itemId = item.id || item.name; // Use id or name as identifier
            
            if (!itemsSold[itemId]) {
              itemsSold[itemId] = {
                id: item.id,
                name: item.name,
                quantity: 0,
                totalSales: 0
              };
            }
            
            // Add to quantity and sales
            itemsSold[itemId].quantity += parseInt(item.quantity) || 0;
            itemsSold[itemId].totalSales += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
          });
        }
      });
      
      // Convert to array and sort by quantity
      const topItems = Object.values(itemsSold)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, limit)
        .map(item => ({
          ...item,
          price: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(item.totalSales)
        }));
      
      if (topItems.length > 0) {
        return topItems;
      }
    }
  } catch (error) {
    console.error('Error calculating top selling items:', error);
  }
  
  // Return mock data if no real data available
  return [
    {
      id: 'iphone-13',
      name: 'iPhone 13',
      quantity: 12,
      price: '$9,599.88'
    },
    {
      id: 'samsung-s21',
      name: 'Samsung Galaxy S21',
      quantity: 8,
      price: '$5,599.92'
    },
    {
      id: 'macbook-air',
      name: 'MacBook Air M1',
      quantity: 5,
      price: '$4,999.95'
    },
    {
      id: 'sony-wh1000xm4',
      name: 'Sony WH-1000XM4',
      quantity: 4,
      price: '$1,399.96'
    },
    {
      id: 'logitech-mx-master',
      name: 'Logitech MX Master 3',
      quantity: 3,
      price: '$299.97'
    }
  ];
}

// Function to get refunds
export function getRefunds() {
  // Try to get orders from localStorage first
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      
      // Extract refunds from all orders
      const refunds = [];
      
      orders.forEach(order => {
        if (order.refunds && order.refunds.length > 0) {
          order.refunds.forEach(refund => {
            refunds.push({
              id: refund.id || `REF-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
              orderId: order.id,
              date: refund.date || order.date,
              amount: parseFloat(refund.amount) || 0,
              reason: refund.reason || 'No reason provided',
              items: refund.items || []
            });
          });
        }
      });
      
      if (refunds.length > 0) {
        return refunds;
      }
    }
  } catch (error) {
    console.error('Error retrieving refunds from localStorage:', error);
  }
  
  // If no refunds in localStorage or error occurred, return mock data
  return [
    {
      id: 'REF-001',
      orderId: 'ORD-001',
      date: '2023-04-03',
      amount: 25.50,
      reason: 'Customer dissatisfied',
      items: [
        { id: 2, name: 'Product B', quantity: 1, price: 25.50 }
      ]
    },
    {
      id: 'REF-002',
      orderId: 'ORD-003',
      date: '2023-04-02',
      amount: 37.00,
      reason: 'Damaged product',
      items: [
        { id: 4, name: 'Product D', quantity: 1, price: 37.00 }
      ]
    },
    {
      id: 'REF-003',
      orderId: 'ORD-004',
      date: '2023-04-01',
      amount: 100.00,
      reason: 'Wrong item shipped',
      items: [
        { id: 5, name: 'Product E', quantity: 2, price: 50.00 }
      ]
    }
  ];
}

// Function to process refund
export function processRefund(refundData) {
  // This would normally send to an API, but for now we'll update localStorage
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      let orders = JSON.parse(savedOrders);
      
      // Find the order
      const orderIndex = orders.findIndex(order => order.id === refundData.orderId);
      if (orderIndex !== -1) {
        // Create refund object
        const refund = {
          id: 'REF-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
          amount: parseFloat(refundData.amount) || 0,
          subtotal: parseFloat(refundData.subtotal) || 0,
          tax: parseFloat(refundData.tax) || 0,
          items: refundData.items || [],
          method: refundData.method || 'cash',
          note: refundData.note || '',
          timestamp: refundData.timestamp || new Date().toISOString()
        };
        
        // Add refund to order
        if (!orders[orderIndex].refunds) {
          orders[orderIndex].refunds = [];
        }
        orders[orderIndex].refunds.push(refund);
        
        // Update order status based on refund amount
        const totalRefunded = orders[orderIndex].refunds.reduce(
          (sum, ref) => sum + (parseFloat(ref.amount) || 0), 
          0
        );
        
        // If total refunded equals or exceeds order total, mark as fully refunded
        if (totalRefunded >= parseFloat(orders[orderIndex].total)) {
          orders[orderIndex].status = 'refunded';
        } else if (totalRefunded > 0) {
          orders[orderIndex].status = 'partial-refunded';
        }
        
        // Save back to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Update inventory for items marked as "new" condition
        const inventoryUpdated = updateInventoryForRefund(refundData.items);
        
        return {
          success: true,
          refundId: refund.id,
          amount: refund.amount,
          timestamp: refund.timestamp,
          inventoryUpdated: inventoryUpdated,
          inventoryErrors: false
        };
      }
    }
  } catch (error) {
    console.error('Error processing refund in localStorage:', error);
  }
  
  // If order not found in localStorage or error occurred, just log
  console.log('Processing refund (mock):', refundData);
  return {
    success: true,
    refundId: 'REF-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    amount: refundData.amount,
    timestamp: new Date().toISOString(),
    inventoryUpdated: false,
    inventoryErrors: false
  };
}

// Helper function to update inventory for refunded items
function updateInventoryForRefund(refundItems) {
  if (!refundItems || !Array.isArray(refundItems)) return false;
  
  try {
    // Only update inventory for items with "new" condition
    const newConditionItems = refundItems.filter(item => 
      item.condition === 'new' && item.quantity > 0
    );
    
    if (newConditionItems.length === 0) return false;
    
    // Get products from localStorage
    const savedProducts = localStorage.getItem('products');
    if (!savedProducts) return false;
    
    let products = JSON.parse(savedProducts);
    let updated = false;
    
    // Update inventory for each refunded item
    newConditionItems.forEach(refundItem => {
      // Find matching product
      const productIndex = products.findIndex(p => 
        p.id === refundItem.id || p.name === refundItem.name
      );
      
      if (productIndex !== -1) {
        // Increase stock by refunded quantity
        products[productIndex].stock = (products[productIndex].stock || 0) + refundItem.quantity;
        updated = true;
        
        // Log inventory change
        try {
          const { addInventoryLog } = require('./inventoryLogService');
          addInventoryLog({
            productId: products[productIndex].id,
            productName: products[productIndex].name,
            productSku: products[productIndex].sku,
            previousQuantity: (products[productIndex].stock || 0) - refundItem.quantity,
            quantityChange: refundItem.quantity,
            reasonType: 'return',
            reason: 'Order refund - returned to inventory'
          });
        } catch (logError) {
          console.error('Error logging inventory change:', logError);
        }
      }
    });
    
    if (updated) {
      // Save updated products back to localStorage
      localStorage.setItem('products', JSON.stringify(products));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating inventory for refund:', error);
    return false;
  }
}

// Function to get orders
export function getOrders() {
  // Try to get orders from localStorage first
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
  } catch (error) {
    console.error('Error retrieving orders from localStorage:', error);
  }
  
  // If no orders in localStorage or error occurred, return mock data
  return [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      date: '2023-04-03',
      total: 125.50,
      status: 'completed',
      items: [
        { id: 1, name: 'Product A', quantity: 2, price: 45.00 },
        { id: 2, name: 'Product B', quantity: 1, price: 35.50 }
      ]
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      date: '2023-04-02',
      total: 78.25,
      status: 'completed',
      items: [
        { id: 3, name: 'Product C', quantity: 1, price: 78.25 }
      ]
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      date: '2023-04-01',
      total: 156.00,
      status: 'pending',
      items: [
        { id: 1, name: 'Product A', quantity: 1, price: 45.00 },
        { id: 4, name: 'Product D', quantity: 3, price: 37.00 }
      ]
    }
  ];
}

// Function to save an order
export function saveOrder(orderData) {
  // Generate order ID if not provided
  const orderId = orderData.id || ('ORD-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
  const timestamp = new Date().toISOString();
  
  // Create complete order object
  const completeOrder = {
    ...orderData,
    id: orderId,
    date: orderData.date || timestamp,
    timestamp: timestamp,
    status: orderData.status || 'completed' // Default to completed if not specified
  };
  
  // This would normally send to an API, but for now we'll save to localStorage
  console.log('Saving order:', completeOrder);
  
  try {
    // Get existing orders
    let orders = [];
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      orders = JSON.parse(savedOrders);
    }
    
    // Add new order
    orders.push(completeOrder);
    
    // Save back to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return {
      success: true,
      orderId: orderId,
      timestamp: timestamp
    };
  } catch (error) {
    console.error('Error saving order to localStorage:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to get order by ID
export function getOrderById(orderId) {
  // Try to get orders from localStorage first
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const order = orders.find(order => order.id === orderId);
      if (order) {
        return order;
      }
    }
  } catch (error) {
    console.error('Error retrieving order from localStorage:', error);
  }
  
  // If not found in localStorage or error occurred, check mock data
  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      date: '2023-04-03',
      total: 125.50,
      status: 'completed',
      items: [
        { id: 1, name: 'Product A', quantity: 2, price: 45.00 },
        { id: 2, name: 'Product B', quantity: 1, price: 35.50 }
      ]
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      date: '2023-04-02',
      total: 78.25,
      status: 'completed',
      items: [
        { id: 3, name: 'Product C', quantity: 1, price: 78.25 }
      ]
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      date: '2023-04-01',
      total: 156.00,
      status: 'pending',
      items: [
        { id: 1, name: 'Product A', quantity: 1, price: 45.00 },
        { id: 4, name: 'Product D', quantity: 3, price: 37.00 }
      ]
    }
  ];
  
  return mockOrders.find(order => order.id === orderId) || null;
}

// Function to get remaining balance for an order
export function getRemainingBalance(order) {
  if (!order) return 0;
  
  // Calculate total refunded amount
  const totalRefunded = getTotalRefundedAmount(order.id);
  
  // Return the remaining balance (original total minus refunded amount)
  return Math.max(0, parseFloat(order.total) - totalRefunded);
}

// Function to get total refunded amount for an order
export function getTotalRefundedAmount(orderId) {
  // If orderId is an object (order), extract the id
  const id = typeof orderId === 'object' ? orderId.id : orderId;
  
  // Try to get the order from localStorage first
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const order = orders.find(order => order.id === id);
      if (order && order.refunds && order.refunds.length > 0) {
        return order.refunds.reduce((total, refund) => total + (parseFloat(refund.amount) || 0), 0);
      }
    }
  } catch (error) {
    console.error('Error calculating refund amount from localStorage:', error);
  }
  
  // If not found in localStorage or error occurred, use mock data
  const refundData = {
    'ORD-001': 25.50,
    'ORD-002': 0,
    'ORD-003': 37.00,
  };
  
  return refundData[id] || 0;
}

// Function to create a new order
export function createOrder(orderData) {
  return saveOrder(orderData);
}

// Function to update an order
export function updateOrder(orderId, orderData) {
  // This would normally send to an API, but for now we'll update localStorage
  try {
    // Get existing orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      let orders = JSON.parse(savedOrders);
      
      // Find and update the order
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...orderData };
        
        // Save back to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
        
        return {
          success: true,
          orderId: orderId,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // If order not found, just log
    console.log('Updating order (mock):', orderId, orderData);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating order in localStorage:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to update order status
export function updateOrderStatus(orderId, status) {
  return updateOrder(orderId, { status });
}

// Function to update customer for an order
export function updateOrderCustomer(orderId, customerId) {
  return updateOrder(orderId, { customer: customerId });
}

// Function to delete an order
export function deleteOrder(orderId) {
  // This would normally send to an API, but for now we'll update localStorage
  try {
    // Get existing orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      let orders = JSON.parse(savedOrders);
      
      // Filter out the order to delete
      orders = orders.filter(order => order.id !== orderId);
      
      // Save back to localStorage
      localStorage.setItem('orders', JSON.stringify(orders));
      
      return {
        success: true
      };
    }
    
    // If no orders in localStorage, just log
    console.log('Deleting order (mock):', orderId);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting order from localStorage:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
