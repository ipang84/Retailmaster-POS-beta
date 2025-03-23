import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiChevronLeft, 
  FiDownload, 
  FiBarChart2, 
  FiTrendingUp,
  FiCalendar,
  FiDollarSign
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

const ChartContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .chart-actions {
    display: flex;
    gap: 8px;
  }
`;

// Simple bar chart component
const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  
  .bar-container {
    display: flex;
    align-items: center;
  }
  
  .bar-label {
    width: 120px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .bar-wrapper {
    flex: 1;
    height: 24px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 16px;
  }
  
  .bar {
    height: 100%;
    background-color: var(--primary-color);
    border-radius: 4px;
  }
  
  .bar-value {
    width: 80px;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
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

function SalesOverTimeReport() {
  const navigate = useNavigate();
  
  // State for data
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  
  // State for filters
  const [timeRange, setTimeRange] = useState('last30days');
  const [groupBy, setGroupBy] = useState('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      const ordersData = getOrders();
      setOrders(ordersData);
      
      // Set default dates for custom range
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    };
    
    loadData();
  }, []);
  
  // Process data when filters change
  useEffect(() => {
    if (!orders.length) return;
    
    // Filter orders by date range
    let filteredOrders = [...orders];
    let start, end;
    
    switch (timeRange) {
      case 'last7days':
        start = new Date();
        start.setDate(start.getDate() - 7);
        filteredOrders = filteredOrders.filter(order => new Date(order.date) >= start);
        break;
      case 'last30days':
        start = new Date();
        start.setDate(start.getDate() - 30);
        filteredOrders = filteredOrders.filter(order => new Date(order.date) >= start);
        break;
      case 'last90days':
        start = new Date();
        start.setDate(start.getDate() - 90);
        filteredOrders = filteredOrders.filter(order => new Date(order.date) >= start);
        break;
      case 'thisYear':
        start = new Date(new Date().getFullYear(), 0, 1);
        filteredOrders = filteredOrders.filter(order => new Date(order.date) >= start);
        break;
      case 'custom':
        if (startDate) {
          start = new Date(startDate);
          filteredOrders = filteredOrders.filter(order => new Date(order.date) >= start);
        }
        if (endDate) {
          end = new Date(endDate + 'T23:59:59');
          filteredOrders = filteredOrders.filter(order => new Date(order.date) <= end);
        }
        break;
    }
    
    // Group orders by selected time period
    const salesByPeriod = {};
    
    filteredOrders.forEach(order => {
      // Skip refunded orders
      if (order.status === 'refunded') return;
      
      const date = new Date(order.date);
      let periodKey;
      
      switch (groupBy) {
        case 'day':
          periodKey = date.toISOString().split('T')[0];
          break;
        case 'week':
          // Get the week number
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          periodKey = `${date.getFullYear()}-W${weekNum}`;
          break;
        case 'month':
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          periodKey = `${date.getFullYear()}-Q${quarter}`;
          break;
        case 'year':
          periodKey = `${date.getFullYear()}`;
          break;
      }
      
      if (!salesByPeriod[periodKey]) {
        salesByPeriod[periodKey] = {
          period: periodKey,
          sales: 0,
          orders: 0,
          date: date
        };
      }
      
      // Calculate order total (considering partial refunds)
      let orderTotal = order.total;
      
      // Subtract refunded amounts
      if (order.refunds && order.refunds.length > 0) {
        const refundedTotal = order.refunds.reduce((refundSum, refund) => refundSum + refund.total, 0);
        orderTotal -= refundedTotal;
      }
      
      salesByPeriod[periodKey].sales += orderTotal;
      salesByPeriod[periodKey].orders++;
    });
    
    // Convert to array and sort by date
    const salesArray = Object.values(salesByPeriod).sort((a, b) => a.date - b.date);
    
    // Format period labels
    salesArray.forEach(item => {
      switch (groupBy) {
        case 'day':
          item.label = new Date(item.period).toLocaleDateString();
          break;
        case 'week':
          const [year, week] = item.period.split('-W');
          item.label = `Week ${week}, ${year}`;
          break;
        case 'month':
          const [yearMonth, monthNum] = item.period.split('-');
          const monthDate = new Date(parseInt(yearMonth), parseInt(monthNum) - 1, 1);
          item.label = monthDate.toLocaleDateString('default', { month: 'short', year: 'numeric' });
          break;
        case 'quarter':
          const [yearQ, quarter] = item.period.split('-Q');
          item.label = `Q${quarter} ${yearQ}`;
          break;
        case 'year':
          item.label = item.period;
          break;
      }
    });
    
    setSalesData(salesArray);
  }, [orders, timeRange, groupBy, startDate, endDate]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Calculate summary statistics
  const totalSales = salesData.reduce((sum, period) => sum + period.sales, 0);
  const totalOrders = salesData.reduce((sum, period) => sum + period.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Calculate max sales for chart scaling
  const maxSales = salesData.length > 0 ? Math.max(...salesData.map(period => period.sales)) : 0;

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/reports')}>
          <FiChevronLeft />
          Back to Reports
        </BackButton>
        <Title>Sales Over Time</Title>
      </PageHeader>
      
      <ReportContainer>
        <ReportContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <ActionButton className="secondary">
              <FiDownload />
              Export
            </ActionButton>
          </div>
          
          <FilterContainer>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {timeRange === 'custom' && (
              <>
                <input 
                  type="date" 
                  className="date-input"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                
                <input 
                  type="date" 
                  className="date-input"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </>
            )}
            
            <select 
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="day">Group by Day</option>
              <option value="week">Group by Week</option>
              <option value="month">Group by Month</option>
              <option value="quarter">Group by Quarter</option>
              <option value="year">Group by Year</option>
            </select>
          </FilterContainer>
          
          <SummaryCards>
            <StatsCard title="Total Sales" icon={<FiDollarSign />}>
              {formatCurrency(totalSales)}
            </StatsCard>
            
            <StatsCard title="Total Orders" icon={<FiBarChart2 />}>
              {totalOrders}
            </StatsCard>
            
            <StatsCard title="Average Order" icon={<FiDollarSign />}>
              {formatCurrency(averageOrderValue)}
            </StatsCard>
            
            <StatsCard title="Time Period" icon={<FiCalendar />}>
              {timeRange === 'custom' ? 'Custom Range' : 
                timeRange === 'last7days' ? 'Last 7 Days' :
                timeRange === 'last30days' ? 'Last 30 Days' :
                timeRange === 'last90days' ? 'Last 90 Days' : 'This Year'}
            </StatsCard>
          </SummaryCards>
          
          {salesData.length > 0 ? (
            <ChartContainer>
              <div className="chart-header">
                <div className="chart-title">Sales Trend</div>
                <div className="chart-actions">
                  <ActionButton className="secondary">
                    <FiTrendingUp />
                    View as Line Chart
                  </ActionButton>
                </div>
              </div>
              
              <BarChart>
                {salesData.map(period => (
                  <div key={period.period} className="bar-container">
                    <div className="bar-label" title={period.label}>{period.label}</div>
                    <div className="bar-wrapper">
                      <div 
                        className="bar" 
                        style={{ width: `${(period.sales / maxSales) * 100}%` }}
                      ></div>
                    </div>
                    <div className="bar-value">{formatCurrency(period.sales)}</div>
                  </div>
                ))}
              </BarChart>
            </ChartContainer>
          ) : (
            <EmptyState>
              <div className="icon"><FiBarChart2 /></div>
              <div className="title">No sales data found</div>
              <div className="description">
                {orders.length === 0 
                  ? "There are no sales recorded yet. Sales will appear here when you complete orders."
                  : "No sales match your current filters. Try adjusting your date range to see more results."}
              </div>
            </EmptyState>
          )}
        </ReportContent>
      </ReportContainer>
    </PageContainer>
  );
}

export default SalesOverTimeReport;
