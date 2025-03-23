import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiPercent, 
  FiChevronRight,
  FiFilter,
  FiCreditCard,
  FiHome,
  FiRefreshCw,
  FiSmartphone,
  FiPieChart
} from 'react-icons/fi';
import { getFinancialData, getTopSellingItems } from '../services/orderService';
import { getProducts } from '../services/productService';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #002855;
`;

const DateFilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
`;

const DateFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateFilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const DateInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  margin-left: auto;
  
  &:hover {
    background-color: #e9e9e9;
  }
  
  svg {
    font-size: 16px;
  }
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background-color: ${props => props.bgColor || '#f0f7ff'};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .icon {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    color: ${props => props.iconColor || '#0066ff'};
    font-size: 20px;
  }
  
  .value {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 14px;
    color: #666;
  }
`;

const SectionContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  .payment-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: ${props => props.iconBg || '#e6f7ff'};
      color: ${props => props.iconColor || '#0066ff'};
      font-size: 20px;
    }
    
    .details {
      .name {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }
      
      .description {
        font-size: 13px;
        color: #666;
      }
    }
  }
  
  .payment-amount {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #333;
    
    .chevron {
      color: #999;
    }
  }
`;

const RefundItem = styled(PaymentItem)`
  .payment-info .icon {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  .payment-amount {
    color: #d32f2f;
  }
`;

const StoreItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  
  .store-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #fff0e6;
      color: #ff6600;
      font-size: 20px;
    }
    
    .details {
      .name {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }
      
      .description {
        font-size: 13px;
        color: #666;
      }
    }
  }
  
  .store-amount {
    font-weight: 600;
    color: #333;
  }
`;

const EmptyState = styled.div`
  padding: 30px 20px;
  text-align: center;
  color: #666;
  
  p {
    margin-bottom: 8px;
  }
  
  .icon {
    font-size: 24px;
    margin-bottom: 12px;
    color: #999;
  }
`;

function Finances() {
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [financialData, setFinancialData] = useState({});
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalRefunds: 0,
    netRevenue: 0,
    cashPayments: 0,
    cardPayments: 0,
    digitalPayments: 0,
    grossProfit: 0,
    grossProfitMargin: 0
  });

  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Load financial data
  useEffect(() => {
    loadFinancialData();
  }, [startDate, endDate]);

  const loadFinancialData = () => {
    const data = getFinancialData();
    setFinancialData(data);
    
    // Calculate summary for the selected date range
    calculateSummary(data);
  };

  const calculateSummary = (data) => {
    let totalRevenue = 0;
    let totalRefunds = 0;
    let netRevenue = 0;
    let cashPayments = 0;
    let cardPayments = 0;
    let digitalPayments = 0;
    
    // Convert date strings to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day
    
    // Iterate through each day in the data
    Object.entries(data).forEach(([dateStr, dayData]) => {
      const currentDate = new Date(dateStr);
      
      // Check if the date is within the selected range
      if (currentDate >= start && currentDate <= end) {
        totalRevenue += dayData.sales || 0;
        totalRefunds += dayData.refunds || 0;
        netRevenue += dayData.netRevenue || 0;
        cashPayments += dayData.cashPayments || 0;
        cardPayments += dayData.cardPayments || 0;
        digitalPayments += dayData.digitalPayments || 0;
      }
    });
    
    // Calculate gross profit
    const grossProfit = calculateGrossProfit(start, end);
    const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    setSummary({
      totalRevenue,
      totalRefunds,
      netRevenue,
      cashPayments,
      cardPayments,
      digitalPayments,
      grossProfit,
      grossProfitMargin
    });
  };

  // Calculate gross profit (revenue - cost of goods sold)
  const calculateGrossProfit = (startDate, endDate) => {
    try {
      // Get top selling items for the date range
      const topItems = getTopSellingItems(30, 100); // Get a large number to include most items
      
      // Get all products to access their cost
      const products = getProducts();
      
      // Calculate total cost of goods sold
      let costOfGoodsSold = 0;
      
      topItems.forEach(item => {
        // Find the product to get its cost
        const product = products.find(p => p.id === item.id || p.name === item.name);
        
        if (product) {
          const itemCost = product.cost || 0;
          costOfGoodsSold += itemCost * item.quantity;
        }
      });
      
      // Calculate gross profit (revenue - cost of goods sold)
      return summary.totalRevenue - costOfGoodsSold;
    } catch (error) {
      console.error('Error calculating gross profit:', error);
      return 0;
    }
  };

  // Calculate profit margin
  const profitMargin = summary.totalRevenue > 0 
    ? ((summary.netRevenue / summary.totalRevenue) * 100).toFixed(2) 
    : '0.00';

  return (
    <PageContainer>
      <PageHeader>
        <Title>Finance</Title>
      </PageHeader>
      
      <DateFilterContainer>
        <DateFilterGroup>
          <DateFilterLabel>Start Date</DateFilterLabel>
          <DateInput 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </DateFilterGroup>
        
        <DateFilterGroup>
          <DateFilterLabel>End Date</DateFilterLabel>
          <DateInput 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </DateFilterGroup>
        
        <RefreshButton onClick={loadFinancialData}>
          <FiRefreshCw />
          Refresh Data
        </RefreshButton>
      </DateFilterContainer>
      
      <MetricsContainer>
        <MetricCard bgColor="#f0f7ff" iconColor="#0066ff">
          <div className="icon">
            <FiDollarSign />
          </div>
          <div className="value">${summary.totalRevenue.toFixed(2)}</div>
          <div className="label">Total revenue from all sales</div>
        </MetricCard>
        
        <MetricCard bgColor="#f0fff0" iconColor="#00cc66">
          <div className="icon">
            <FiTrendingUp />
          </div>
          <div className="value">${summary.netRevenue.toFixed(2)}</div>
          <div className="label">Revenue minus refunds</div>
        </MetricCard>
        
        <MetricCard bgColor="#f5f0ff" iconColor="#6633cc">
          <div className="icon">
            <FiPercent />
          </div>
          <div className="value">{profitMargin}%</div>
          <div className="label">Net revenue as percentage of total</div>
        </MetricCard>
        
        <MetricCard bgColor="#fff0f5" iconColor="#cc3366">
          <div className="icon">
            <FiPieChart />
          </div>
          <div className="value">${summary.grossProfit.toFixed(2)}</div>
          <div className="label">Gross profit (revenue - cost of goods)</div>
        </MetricCard>
      </MetricsContainer>
      
      <div className="sections-grid">
        <div className="section-row">
          <SectionContainer>
            <SectionHeader>
              <div className="title">Payment Breakdown</div>
            </SectionHeader>
            
            <PaymentItem iconBg="#e6ffe6" iconColor="#00cc66">
              <div className="payment-info">
                <div className="icon">
                  <FiDollarSign />
                </div>
                <div className="details">
                  <div className="name">Cash Payments</div>
                  <div className="description">Total cash transactions</div>
                </div>
              </div>
              <div className="payment-amount">
                ${summary.cashPayments.toFixed(2)}
                <FiChevronRight className="chevron" />
              </div>
            </PaymentItem>
            
            <PaymentItem iconBg="#e6f7ff" iconColor="#0066ff">
              <div className="payment-info">
                <div className="icon">
                  <FiCreditCard />
                </div>
                <div className="details">
                  <div className="name">Card Payments</div>
                  <div className="description">Credit/Debit card transactions</div>
                </div>
              </div>
              <div className="payment-amount">
                ${summary.cardPayments.toFixed(2)}
                <FiChevronRight className="chevron" />
              </div>
            </PaymentItem>
            
            <PaymentItem iconBg="#f0f0ff" iconColor="#6633cc">
              <div className="payment-info">
                <div className="icon">
                  <FiSmartphone />
                </div>
                <div className="details">
                  <div className="name">Digital Payments</div>
                  <div className="description">Mobile and online payments</div>
                </div>
              </div>
              <div className="payment-amount">
                ${summary.digitalPayments.toFixed(2)}
                <FiChevronRight className="chevron" />
              </div>
            </PaymentItem>
            
            <RefundItem>
              <div className="payment-info">
                <div className="icon">
                  <FiRefreshCw />
                </div>
                <div className="details">
                  <div className="name">Refunds</div>
                  <div className="description">Total refunded amount</div>
                </div>
              </div>
              <div className="payment-amount">
                -${summary.totalRefunds.toFixed(2)}
                <FiChevronRight className="chevron" />
              </div>
            </RefundItem>
          </SectionContainer>
          
          <SectionContainer>
            <SectionHeader>
              <div className="title">Sales by Category</div>
              <div className="actions">
                <FilterButton>
                  <FiFilter />
                  Filter
                </FilterButton>
              </div>
            </SectionHeader>
            
            <EmptyState>
              <div className="icon">📊</div>
              <p>No category data available for the selected period.</p>
              <p>Complete some sales to see data here.</p>
            </EmptyState>
          </SectionContainer>
        </div>
        
        <SectionContainer>
          <SectionHeader>
            <div className="title">Store Location</div>
          </SectionHeader>
          
          <StoreItem>
            <div className="store-info">
              <div className="icon">
                <FiHome />
              </div>
              <div className="details">
                <div className="name">Main Store</div>
                <div className="description">Current location net sales</div>
              </div>
            </div>
            <div className="store-amount">
              ${summary.netRevenue.toFixed(2)}
            </div>
          </StoreItem>
        </SectionContainer>
      </div>
    </PageContainer>
  );
}

export default Finances;
