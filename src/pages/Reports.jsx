import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FiMonitor, 
  FiDollarSign, 
  FiCalendar, 
  FiTrendingUp, 
  FiTruck, 
  FiShoppingBag,
  FiCreditCard,
  FiRefreshCw,
  FiFileText,
  FiPackage,
  FiBarChart2,
  FiAlertTriangle,
  FiUsers,
  FiShoppingCart,
  FiUserPlus
} from 'react-icons/fi';

const ReportsContainer = styled.div`
  padding: 24px;
`;

const ReportsHeader = styled.div`
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }
`;

const ReportSection = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: ${props => props.bgColor || 'rgba(0, 102, 255, 0.1)'};
    color: ${props => props.iconColor || 'var(--primary-color)'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }
  
  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .description {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
  }
`;

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
`;

const ReportItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 16px;
  text-decoration: none;
  color: var(--text-color);
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: #666;
  }
  
  .title {
    font-size: 14px;
    font-weight: 500;
  }
`;

function Reports() {
  return (
    <ReportsContainer>
      <ReportsHeader>
        <h1>Reports</h1>
      </ReportsHeader>
      
      <ReportSection>
        <SectionHeader bgColor="rgba(0, 102, 255, 0.1)" iconColor="var(--primary-color)">
          <div className="icon">
            <FiMonitor />
          </div>
          <div>
            <div className="title">Register Sessions</div>
            <div className="description">Track cash drawer sessions, balances, and transactions.</div>
          </div>
        </SectionHeader>
        
        <ReportList>
          <ReportItem to="/register-sessions">
            <div className="icon">
              <FiMonitor />
            </div>
            <div className="title">Register Sessions</div>
          </ReportItem>
        </ReportList>
      </ReportSection>
      
      <ReportSection>
        <SectionHeader bgColor="rgba(76, 175, 80, 0.1)" iconColor="#4CAF50">
          <div className="icon">
            <FiDollarSign />
          </div>
          <div>
            <div className="title">Sales</div>
            <div className="description">Make business decisions by comparing sales across products, supplier, and more.</div>
          </div>
        </SectionHeader>
        
        <ReportList>
          <ReportItem to="/reports/daily-sales">
            <div className="icon">
              <FiCalendar />
            </div>
            <div className="title">Daily Detailed Sales</div>
          </ReportItem>
          
          <ReportItem to="/reports/sales-over-time">
            <div className="icon">
              <FiTrendingUp />
            </div>
            <div className="title">Sales over time</div>
          </ReportItem>
          
          <ReportItem to="/reports/vendor-sales">
            <div className="icon">
              <FiTruck />
            </div>
            <div className="title">Sales by vendor</div>
          </ReportItem>
          
          <ReportItem to="/reports/product-sales">
            <div className="icon">
              <FiShoppingBag />
            </div>
            <div className="title">Sales by product</div>
          </ReportItem>
        </ReportList>
      </ReportSection>
      
      <ReportSection>
        <SectionHeader bgColor="rgba(33, 150, 243, 0.1)" iconColor="#2196F3">
          <div className="icon">
            <FiDollarSign />
          </div>
          <div>
            <div className="title">Finances</div>
            <div className="description">View your store's finances including sales, returns, taxes, and payment.</div>
          </div>
        </SectionHeader>
        
        <ReportList>
          <ReportItem to="/reports/payment-type">
            <div className="icon">
              <FiCreditCard />
            </div>
            <div className="title">Payment type</div>
          </ReportItem>
          
          <ReportItem to="/reports/returns">
            <div className="icon">
              <FiRefreshCw />
            </div>
            <div className="title">Returns</div>
          </ReportItem>
          
          <ReportItem to="/reports/taxes">
            <div className="icon">
              <FiFileText />
            </div>
            <div className="title">Taxes</div>
          </ReportItem>
        </ReportList>
      </ReportSection>
      
      <ReportSection>
        <SectionHeader bgColor="rgba(255, 152, 0, 0.1)" iconColor="#FF9800">
          <div className="icon">
            <FiPackage />
          </div>
          <div>
            <div className="title">Inventory</div>
            <div className="description">Track inventory levels, movements, and valuation across your store.</div>
          </div>
        </SectionHeader>
        
        <ReportList>
          <ReportItem to="/reports/inventory-valuation">
            <div className="icon">
              <FiBarChart2 />
            </div>
            <div className="title">Inventory Valuation</div>
          </ReportItem>
          
          <ReportItem to="/reports/inventory-movement">
            <div className="icon">
              <FiTrendingUp />
            </div>
            <div className="title">Inventory Movement</div>
          </ReportItem>
          
          <ReportItem to="/reports/stock-turnover">
            <div className="icon">
              <FiRefreshCw />
            </div>
            <div className="title">Stock Turnover</div>
          </ReportItem>
          
          <ReportItem to="/reports/low-stock">
            <div className="icon">
              <FiAlertTriangle />
            </div>
            <div className="title">Low Stock Report</div>
          </ReportItem>
        </ReportList>
      </ReportSection>
      
      <ReportSection>
        <SectionHeader bgColor="rgba(156, 39, 176, 0.1)" iconColor="#9C27B0">
          <div className="icon">
            <FiUsers />
          </div>
          <div>
            <div className="title">Customers</div>
            <div className="description">Analyze customer behavior, purchase history, and loyalty metrics</div>
          </div>
        </SectionHeader>
        
        <ReportList>
          <ReportItem to="/reports/customer-purchase-history">
            <div className="icon">
              <FiShoppingCart />
            </div>
            <div className="title">Customer Purchase History</div>
          </ReportItem>
          
          <ReportItem to="/reports/customer-acquisition">
            <div className="icon">
              <FiUserPlus />
            </div>
            <div className="title">Customer Acquisition</div>
          </ReportItem>
        </ReportList>
      </ReportSection>
    </ReportsContainer>
  );
}

export default Reports;
