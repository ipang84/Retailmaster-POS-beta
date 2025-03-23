import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiFilter, FiEye, FiTrash2, FiRefreshCcw, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/orderService';
import OrderActionsModal from '../components/OrderActionsModal';

const PageContainer = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
`;

const NewOrderButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #0055cc;
  }
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
  
  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  svg {
    color: #666;
  }
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    color: #555;
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
  
  .order-id {
    color: var(--primary-color);
    font-weight: 500;
  }
  
  .status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    
    &.completed {
      background-color: #e6f7e6;
      color: #2e7d32;
    }
    
    &.pending {
      background-color: #fff8e1;
      color: #f57c00;
    }
    
    &.cancelled {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    &.refunded {
      background-color: #e8eaf6;
      color: #3f51b5;
    }
    
    &.partial-refunded {
      background-color: #fff3e0;
      color: #e65100;
    }
  }
  
  .actions {
    display: flex;
    gap: 8px;
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: none;
      background-color: #f0f0f0;
      cursor: pointer;
      color: #555;
      
      &:hover {
        background-color: #e0e0e0;
      }
      
      &.view {
        background-color: #e3f2fd;
        color: #1976d2;
        
        &:hover {
          background-color: #bbdefb;
        }
      }
      
      &.delete {
        background-color: #ffebee;
        color: #d32f2f;
        
        &:hover {
          background-color: #ef9a9a;
        }
      }
      
      &.refund {
        background-color: #e8eaf6;
        color: #3f51b5;
        
        &:hover {
          background-color: #c5cae9;
        }
      }
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  h3 {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 24px;
  }
  
  button {
    padding: 10px 16px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      background-color: #0055cc;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  
  .pagination-info {
    color: #666;
    font-size: 14px;
  }
  
  .pagination-controls {
    display: flex;
    gap: 8px;
    
    button {
      padding: 8px 12px;
      border: 1px solid #ddd;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover:not(:disabled) {
        background-color: #f5f5f5;
      }
      
      &:disabled {
        cursor: not-allowed;
        color: #ccc;
      }
      
      &.active {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
    }
  }
`;

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format status text
const formatStatusText = (status) => {
  if (status === 'partial-refunded') return 'Partially Refunded';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Helper function to calculate the actual total after refunds
const calculateAdjustedTotal = (order) => {
  if (!order.refunds || order.refunds.length === 0) {
    return order.total;
  }
  
  // Calculate total refunded amount
  const totalRefunded = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  
  // Return the adjusted total (original total minus refunded amount)
  return Math.max(0, order.total - totalRefunded);
};

// Helper function to check if an order can be refunded
const canOrderBeRefunded = (order) => {
  // Only completed orders can be refunded
  // Orders that are already fully refunded cannot be refunded again
  return order.status === 'completed' || order.status === 'partial-refunded';
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  
  // Load orders from localStorage
  useEffect(() => {
    const loadedOrders = getOrders();
    // Sort orders by date (newest first)
    loadedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(loadedOrders);
    setFilteredOrders(loadedOrders);
  }, []);
  
  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = orders.filter(order => 
        order.id.toLowerCase().includes(term) ||
        (order.customer && order.customer.toLowerCase().includes(term)) ||
        order.status.toLowerCase().includes(term)
      );
      setFilteredOrders(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, orders]);
  
  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  
  const handleOrderUpdate = (orderId, newStatus, newCustomerName = null) => {
    // Update orders state
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newCustomerName) {
          updatedOrder.customer = newCustomerName;
        }
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setFilteredOrders(
      searchTerm.trim() === '' ? updatedOrders : 
      updatedOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  
  const handleOrderDelete = (orderId) => {
    // Remove order from state
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    setFilteredOrders(
      searchTerm.trim() === '' ? updatedOrders : 
      updatedOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  
  const handleDeleteOrder = (orderId, e) => {
    e.stopPropagation(); // Prevent row click event
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      deleteOrder(orderId);
      handleOrderDelete(orderId);
    }
  };
  
  const handleRefundOrder = (order, e) => {
    e.stopPropagation(); // Prevent row click
    // Only completed orders can be refunded
    if (canOrderBeRefunded(order)) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    } else {
      alert('Only completed orders can be refunded.');
    }
  };
  
  return (
    <>
      <PageContainer>
        <PageHeader>
          <h1>Orders</h1>
          <NewOrderButton to="/orders/new">
            <FiPlus size={18} />
            New Order
          </NewOrderButton>
        </PageHeader>
        
        <SearchFilterContainer>
          <SearchInput>
            <FiSearch size={18} />
            <input 
              type="text" 
              placeholder="Search orders by ID, customer, or status..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          <FilterButton>
            <FiFilter size={18} />
            Filter
          </FilterButton>
        </SearchFilterContainer>
        
        {filteredOrders.length > 0 ? (
          <>
            <OrdersTable>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} onClick={() => handleViewOrder(order)}>
                    <td className="order-id">{order.id}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.customer || 'Walk in customer'}</td>
                    <td>{order.items ? order.items.length : 0}</td>
                    <td>${calculateAdjustedTotal(order).toFixed(2)}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {formatStatusText(order.status)}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="view" onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order);
                      }}>
                        <FiEye size={16} />
                      </button>
                      
                      {/* Only show refund button for orders that can be refunded */}
                      {canOrderBeRefunded(order) && (
                        <button className="refund" onClick={(e) => handleRefundOrder(order, e)}>
                          <FiRefreshCcw size={16} />
                        </button>
                      )}
                      
                      <button className="delete" onClick={(e) => handleDeleteOrder(order.id, e)}>
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </OrdersTable>
            
            <Pagination>
              <div className="pagination-info">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="pagination-controls">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                >
                  Next
                </button>
              </div>
            </Pagination>
          </>
        ) : (
          <EmptyState>
            <h3>No Orders Found</h3>
            <p>There are no orders matching your search criteria.</p>
            <Link to="/orders/new" style={{ textDecoration: 'none' }}>
              <button>
                <FiPlus size={16} style={{ marginRight: '8px' }} />
                Create New Order
              </button>
            </Link>
          </EmptyState>
        )}
      </PageContainer>
      
      <OrderActionsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        onOrderUpdate={handleOrderUpdate}
        onOrderDelete={handleOrderDelete}
      />
    </>
  );
}

export default Orders;
