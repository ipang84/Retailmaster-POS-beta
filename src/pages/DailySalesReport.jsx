import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiChevronLeft, 
  FiDownload, 
  FiSearch, 
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiShoppingCart
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import StatsCard from '../components/StatsCard';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-right: 16px;
  
  &:hover {
    color: var(--primary-color);
  }
  
  svg {
    margin-right: 4px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ReportContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

const ReportContent = styled.div`
  padding: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .search-input {
    position: relative;
    flex: 1;
    margin-right: 16px;
    
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
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  .date-input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: #0055cc;
    }
  }
  
  &.secondary {
    background-color: #f0f9ff;
    color: var(--primary-color);
    border: none;
    
    &:hover {
      background-color: #e0f0ff;
    }
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const SalesTable = styled.div`
  width: 100%;
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background-color: #f9f9f9;
      font-weight: 600;
      color: #333;
    }
    
    tr:hover td {
      background-color: #f5f5f5;
    }
    
    .order-id {
      font-weight: 500;
      color: var(--primary-color);
    }
    
    .sales-value {
      font-weight: 500;
    }
    
    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      
      &.completed {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      
      &.refunded {
        background-color: #ffebee;
        color: #c62828;
      }
      
      &.partial-refund {
        background-color: #fff8e1;
        color: #f57c00;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #ccc;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .description {
    font-size: 14px;
    max-width: 400px;
    margin: 0 auto;
  }
`;

function DailySalesReport() {
  const navigate = useNavigate();
  
  // State for data
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [paymentType, setPaymentType] = useState('all');
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      const ordersData = getOrders();
      setOrders(ordersData);
      
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    };
    
    loadData();
  }, []);
  
  // Filter orders when filters change
  useEffect(() => {
    if (!orders.length) return;
    
    let filtered = [...orders];
    
    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === selectedDate;
      });
    }
    
    // Filter by payment type
    if (paymentType !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod === paymentType);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, selectedDate, paymentType, searchTerm]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Calculate summary statistics
  const totalSales = filteredOrders.reduce((sum, order) => {
    // Skip refunded orders
    if (order.status === 'refunded') return sum;
    
    // Calculate order total (considering partial refunds)
    let orderTotal = order.total;
    
    // Subtract refunded amounts
    if (order.refunds && order.refunds.length > 0) {
      const refundedTotal = order.refunds.reduce((refundSum, refund) => refundSum + refund.total, 0);
      orderTotal -= refundedTotal;
    }
    
    return sum + orderTotal;
  }, 0);
  
  const orderCount = filteredOrders.length;
  const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
  
  // Get order status
  const getOrderStatus = (order) => {
    if (order.status === 'refunded') return 'refunded';
    if (order.refunds && order.refunds.length > 0) return 'partial-refund';
    return 'completed';
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'refunded': return 'Refunded';
      case 'partial-refund': return 'Partial Refund';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/reports')}>
          <FiChevronLeft />
          Back to Reports
        </BackButton>
        <Title>Daily Detailed Sales</Title>
      </PageHeader>
      
      <ReportContainer>
        <ReportContent>
          <SearchContainer>
            <div className="search-input">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search by order ID or customer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ActionButton className="secondary">
              <FiDownload />
              Export
            </ActionButton>
          </SearchContainer>
          
          <FilterContainer>
            <input 
              type="date" 
              className="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            
            <select 
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="all">All Payment Types</option>
              <option value="cash">Cash</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="gift_card">Gift Card</option>
              <option value="other">Other</option>
            </select>
          </FilterContainer>
          
          <SummaryCards>
            <StatsCard title="Total Sales" icon={<FiDollarSign />}>
              {formatCurrency(totalSales)}
            </StatsCard>
            
            <StatsCard title="Orders" icon={<FiShoppingCart />}>
              {orderCount}
            </StatsCard>
            
            <StatsCard title="Average Order" icon={<FiDollarSign />}>
              {formatCurrency(averageOrderValue)}
            </StatsCard>
            
            <StatsCard title="Date" icon={<FiCalendar />}>
              {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'All Dates'}
            </StatsCard>
          </SummaryCards>
          
          {filteredOrders.length > 0 ? (
            <SalesTable>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Time</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const status = getOrderStatus(order);
                    return (
                      <tr key={order.id}>
                        <td className="order-id">{order.id}</td>
                        <td>{formatDate(order.date)}</td>
                        <td>{order.customer ? order.customer.name : 'Guest'}</td>
                        <td>{order.items.length} items</td>
                        <td>{order.paymentMethod}</td>
                        <td className="sales-value">{formatCurrency(order.total)}</td>
                        <td>
                          <span className={`status ${status}`}>
                            {getStatusLabel(status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </SalesTable>
          ) : (
            <EmptyState>
              <div className="icon"><FiBarChart2 /></div>
              <div className="title">No sales data found</div>
              <div className="description">
                {orders.length === 0 
                  ? "There are no sales recorded yet. Sales will appear here when you complete orders."
                  : "No sales match your current filters. Try adjusting your date or payment type filters to see more results."}
              </div>
            </EmptyState>
          )}
        </ReportContent>
      </ReportContainer>
    </PageContainer>
  );
}

export default DailySalesReport;
