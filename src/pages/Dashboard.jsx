import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiDollarSign, FiPackage, FiAlertTriangle, FiClock, FiBarChart2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import RegisterSessionModal from '../components/RegisterSessionModal';
import EndRegisterSessionModal from '../components/EndRegisterSessionModal';
import { hasActiveSession, getCurrentSession } from '../services/registerService';
import { getFinancialData, getTopSellingItems } from '../services/orderService';
import { getLowStockProducts, getTotalInventoryValue, getTotalRetailValue } from '../services/productService';
import LowStockAlert from '../components/LowStockAlert';

const DashboardContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.primary ? 'white' : 'var(--primary-color)'};
  border: 1px solid ${props => props.primary ? 'var(--primary-color)' : 'var(--border-color)'};
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
`;

const LinkButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.primary ? 'white' : 'var(--primary-color)'};
  border: 1px solid ${props => props.primary ? 'var(--primary-color)' : 'var(--border-color)'};
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  svg {
    margin-right: 8px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
`;

const StatContent = styled.div``;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.bgColor || 'rgba(0, 102, 255, 0.1)'};
  color: ${props => props.color || 'var(--primary-color)'};
`;

const DetailSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const DetailCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  svg {
    margin-right: 8px;
    color: var(--text-secondary);
  }
`;

const DetailTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
`;

const InventoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 0;
  color: var(--text-color);
`;

const TableCellRight = styled(TableCell)`
  text-align: right;
`;

const ProfitValue = styled.div`
  color: #00cc66;
  font-weight: 600;
`;

const TopSellingItem = styled.div`
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div``;

const ItemName = styled.div`
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
`;

const ItemQuantity = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

const ItemPrice = styled.div`
  font-weight: 500;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ViewDetails = styled.a`
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
`;

function Dashboard() {
  const [inventoryStats, setInventoryStats] = useState({
    retailValue: '$0.00',
    costValue: '$0.00',
    potentialProfit: '$0.00'
  });
  
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [todaySales, setTodaySales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(7);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  
  useEffect(() => {
    // Check if there's an active session
    const activeSession = hasActiveSession();
    setIsActiveSession(activeSession);
    
    if (activeSession) {
      setCurrentSession(getCurrentSession());
    }
    
    // Load today's sales data
    loadTodaySales();
    
    // Load other dashboard data
    loadDashboardData();
  }, []);
  
  const loadTodaySales = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get financial data from orderService
    const financialData = getFinancialData();
    
    // Get today's sales if available
    if (financialData && financialData[today]) {
      setTodaySales(financialData[today].sales || 0);
    } else {
      setTodaySales(0);
    }
  };
  
  const loadDashboardData = () => {
    // This would normally fetch data from an API
    // For now, we'll use mock data or localStorage
    
    // Get products count from localStorage
    try {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        setTotalProducts(products.length);
        
        // Get low stock items using the service function
        const lowStockItems = getLowStockProducts();
        setLowStockItems(lowStockItems.length);
        setLowStockProducts(lowStockItems);
      }
    } catch (error) {
      console.error('Error loading products data:', error);
    }
    
    // Get pending orders count from localStorage
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const pending = orders.filter(order => order.status === 'pending').length;
        setPendingOrders(pending);
      }
    } catch (error) {
      console.error('Error loading orders data:', error);
    }
    
    // Load inventory value data
    loadInventoryValueData();
    
    // Load top selling items
    loadTopSellingItems();
  };
  
  const loadInventoryValueData = () => {
    try {
      // Get total retail value and cost value from product service
      const retailValue = getTotalRetailValue();
      const costValue = getTotalInventoryValue();
      
      // Calculate potential profit
      const potentialProfit = retailValue - costValue;
      
      // Update inventory stats state
      setInventoryStats({
        retailValue: formatCurrency(retailValue),
        costValue: formatCurrency(costValue),
        potentialProfit: formatCurrency(potentialProfit)
      });
    } catch (error) {
      console.error('Error loading inventory value data:', error);
    }
  };
  
  const loadTopSellingItems = () => {
    try {
      // Get top 5 selling items for the last 30 days
      const topItems = getTopSellingItems(30, 5);
      setTopSellingItems(topItems);
    } catch (error) {
      console.error('Error loading top selling items:', error);
    }
  };
  
  const handleStartRegisterSession = () => {
    setShowRegisterModal(true);
  };
  
  const handleEndRegisterSession = () => {
    setShowEndSessionModal(true);
  };
  
  const handleSessionStarted = (session) => {
    setIsActiveSession(true);
    setCurrentSession(session);
    
    // Reload dashboard data after session starts
    loadTodaySales();
  };
  
  const handleSessionEnded = () => {
    setIsActiveSession(false);
    setCurrentSession(null);
    
    // Reload dashboard data after session ends
    loadTodaySales();
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <ActionButtons>
          {isActiveSession ? (
            <ActionButton primary onClick={handleEndRegisterSession}>
              <span>End Register Session</span>
            </ActionButton>
          ) : (
            <ActionButton primary onClick={handleStartRegisterSession}>
              <span>Start Register Session</span>
            </ActionButton>
          )}
          <LinkButton to="/inventory">
            <span>Manage Inventory</span>
          </LinkButton>
          <LinkButton to="/orders/new">
            <span>New Order</span>
          </LinkButton>
        </ActionButtons>
      </PageHeader>
      
      <StatsGrid>
        <StatCard>
          <StatContent>
            <StatLabel>Today's Sales</StatLabel>
            <StatValue>{formatCurrency(todaySales)}</StatValue>
          </StatContent>
          <StatIcon bgColor="rgba(0, 102, 255, 0.1)" color="#0066ff">
            <FiDollarSign size={20} />
          </StatIcon>
        </StatCard>
        
        <StatCard>
          <StatContent>
            <StatLabel>Total Products</StatLabel>
            <StatValue>{totalProducts}</StatValue>
          </StatContent>
          <StatIcon bgColor="rgba(0, 204, 102, 0.1)" color="#00cc66">
            <FiPackage size={20} />
          </StatIcon>
        </StatCard>
        
        <StatCard>
          <StatContent>
            <StatLabel>Low Stock Items</StatLabel>
            <StatValue>{lowStockItems}</StatValue>
          </StatContent>
          <StatIcon bgColor="rgba(255, 153, 0, 0.1)" color="#ff9900">
            <FiAlertTriangle size={20} />
          </StatIcon>
        </StatCard>
        
        <StatCard>
          <StatContent>
            <StatLabel>Pending Orders</StatLabel>
            <StatValue>{pendingOrders}</StatValue>
          </StatContent>
          <StatIcon bgColor="rgba(153, 102, 255, 0.1)" color="#9966ff">
            <FiClock size={20} />
          </StatIcon>
        </StatCard>
      </StatsGrid>
      
      <DetailSection>
        <DetailCard>
          <DetailHeader>
            <FiBarChart2 size={18} />
            <DetailTitle>Inventory Value</DetailTitle>
          </DetailHeader>
          
          <InventoryTable>
            <tbody>
              <TableRow>
                <TableCell>Retail Value</TableCell>
                <TableCellRight>{inventoryStats.retailValue}</TableCellRight>
              </TableRow>
              <TableRow>
                <TableCell>Cost Value</TableCell>
                <TableCellRight>{inventoryStats.costValue}</TableCellRight>
              </TableRow>
              <TableRow>
                <TableCell>Potential Profit</TableCell>
                <TableCellRight>
                  <ProfitValue>{inventoryStats.potentialProfit}</ProfitValue>
                </TableCellRight>
              </TableRow>
            </tbody>
          </InventoryTable>
        </DetailCard>
        
        <DetailCard>
          <DetailHeader>
            <FiShoppingBag size={18} />
            <DetailTitle>Top Selling Items (30 Days)</DetailTitle>
          </DetailHeader>
          
          {topSellingItems.map((item, index) => (
            <TopSellingItem key={index}>
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
              </ItemInfo>
              <ItemPrice>
                {item.price}
              </ItemPrice>
            </TopSellingItem>
          ))}
        </DetailCard>
      </DetailSection>
      
      {/* Register Session Modal */}
      <RegisterSessionModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSessionStart={handleSessionStarted}
      />
      
      {/* End Register Session Modal */}
      <EndRegisterSessionModal 
        isOpen={showEndSessionModal} 
        onClose={() => setShowEndSessionModal(false)}
        onSessionEnd={handleSessionEnded}
        currentSession={currentSession}
      />
      
      {/* Low Stock Alert */}
      <LowStockAlert />
    </DashboardContainer>
  );
}

export default Dashboard;
