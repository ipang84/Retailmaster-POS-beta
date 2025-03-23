import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiDollarSign, 
  FiClock, 
  FiUser, 
  FiCalendar, 
  FiSearch, 
  FiFilter, 
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiCheck,
  FiX,
  FiChevronLeft
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getRegisterSessions } from '../services/registerService';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  
  .back-link {
    display: flex;
    align-items: center;
    margin-right: 12px;
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
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

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
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

const SessionsTable = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
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
      cursor: pointer;
      
      .sort-icon {
        margin-left: 4px;
        vertical-align: middle;
      }
    }
    
    tr:hover td {
      background-color: #f5f5f5;
    }
    
    .amount {
      font-weight: 500;
      
      &.positive {
        color: #2e7d32;
      }
      
      &.negative {
        color: #d32f2f;
      }
    }
    
    .status-tag {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      
      &.active {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      
      &.closed {
        background-color: #e0f2f1;
        color: #00796b;
      }
    }
    
    .actions {
      display: flex;
      gap: 8px;
      
      button {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 14px;
        padding: 4px 8px;
        border-radius: 4px;
        
        &:hover {
          background-color: #f0f9ff;
        }
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
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

const SessionDetailsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SessionDetailsHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .session-id {
    font-weight: 600;
    color: #333;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #333;
    }
  }
`;

const SessionDetailsContent = styled.div`
  padding: 20px;
`;

const SessionInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const SessionInfoItem = styled.div`
  .label {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    
    &.positive {
      color: #2e7d32;
    }
    
    &.negative {
      color: #d32f2f;
    }
  }
`;

const CashCountSection = styled.div`
  margin-top: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }
`;

const CashCountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CashCountColumn = styled.div`
  .column-title {
    font-size: 14px;
    font-weight: 500;
    color: #555;
    margin-bottom: 12px;
  }
`;

const CashCountTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 500;
    color: #666;
    background-color: #f9f9f9;
  }
  
  td {
    color: #333;
  }
  
  .denomination {
    font-weight: 500;
    color: var(--primary-color);
  }
  
  .count {
    text-align: center;
  }
  
  .amount {
    text-align: right;
    font-weight: 500;
  }
  
  .total-row {
    font-weight: 600;
    
    td {
      border-top: 2px solid #eee;
      padding-top: 12px;
    }
    
    .amount {
      color: var(--primary-color);
    }
  }
`;

const TransactionsSection = styled.div`
  margin-top: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .transaction-count {
      font-size: 14px;
      color: #666;
      font-weight: normal;
    }
  }
`;

const TransactionsList = styled.div`
  .transaction-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .transaction-info {
      .time {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      
      .description {
        font-weight: 500;
        color: #333;
      }
      
      .payment-method {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }
    }
    
    .transaction-amount {
      font-weight: 600;
      
      &.positive {
        color: #2e7d32;
      }
      
      &.negative {
        color: #d32f2f;
      }
    }
  }
`;

// Helper function to format date
const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Helper function to calculate session duration
const calculateDuration = (startTime, endTime) => {
  if (!endTime) return 'Active';
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

function RegisterSessions() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState('startTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedSession, setSelectedSession] = useState(null);
  
  useEffect(() => {
    // Load register sessions
    const allSessions = getRegisterSessions();
    setSessions(allSessions);
    setFilteredSessions(allSessions);
  }, []);
  
  // Filter sessions when search or filters change
  useEffect(() => {
    if (!sessions.length) return;
    
    let filtered = [...sessions];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        session.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter(session => new Date(session.startTime).getTime() >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate + 'T23:59:59').getTime(); // End of the selected day
      filtered = filtered.filter(session => new Date(session.startTime).getTime() <= end);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'startTime':
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
          break;
        case 'endTime':
          // Handle null endTime (active sessions)
          aValue = a.endTime ? new Date(a.endTime).getTime() : Number.MAX_SAFE_INTEGER;
          bValue = b.endTime ? new Date(b.endTime).getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case 'startingCash':
          aValue = a.startingCash;
          bValue = b.startingCash;
          break;
        case 'endingCash':
          aValue = a.endingCash || 0;
          bValue = b.endingCash || 0;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter, startDate, endDate, sortField, sortDirection]);
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <FiArrowUp className="sort-icon" size={12} /> : 
      <FiArrowDown className="sort-icon" size={12} />;
  };
  
  // Calculate cash difference
  const calculateDifference = (session) => {
    if (!session.endingCash) return null;
    
    // Expected cash = starting cash + cash sales - cash refunds
    let expectedCash = session.startingCash;
    
    // Add cash sales and subtract refunds
    if (session.transactions) {
      session.transactions.forEach(transaction => {
        if (transaction.type === 'sale' && transaction.paymentMethod === 'cash') {
          expectedCash += transaction.amount;
        } else if (transaction.type === 'refund' && transaction.paymentMethod === 'cash') {
          expectedCash -= transaction.amount;
        }
      });
    }
    
    return session.endingCash - expectedCash;
  };
  
  // View session details
  const viewSessionDetails = (session) => {
    setSelectedSession(session);
  };
  
  // Close session details
  const closeSessionDetails = () => {
    setSelectedSession(null);
  };
  
  // Calculate total for cash counts
  const calculateTotal = (cashCounts) => {
    if (!cashCounts) return 0;
    
    let total = 0;
    
    // Bills
    total += (cashCounts['1'] || 0) * 1;
    total += (cashCounts['5'] || 0) * 5;
    total += (cashCounts['10'] || 0) * 10;
    total += (cashCounts['20'] || 0) * 20;
    total += (cashCounts['50'] || 0) * 50;
    total += (cashCounts['100'] || 0) * 100;
    
    // Coins
    total += (cashCounts['1.00'] || 0) * 1.00;
    total += (cashCounts['0.25'] || 0) * 0.25;
    total += (cashCounts['0.10'] || 0) * 0.10;
    total += (cashCounts['0.05'] || 0) * 0.05;
    total += (cashCounts['0.01'] || 0) * 0.01;
    
    return total;
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>
          <Link to="/reports" className="back-link">
            <FiChevronLeft />
            Reports
          </Link>
          Register Sessions
        </Title>
      </PageHeader>
      
      {selectedSession ? (
        <SessionDetailsCard>
          <SessionDetailsHeader>
            <div className="session-id">Session Details: {selectedSession.id}</div>
            <button className="close-button" onClick={closeSessionDetails}>
              <FiX size={20} />
            </button>
          </SessionDetailsHeader>
          
          <SessionDetailsContent>
            <SessionInfoGrid>
              <SessionInfoItem>
                <div className="label">Start Time</div>
                <div className="value">{formatDate(selectedSession.startTime)}</div>
              </SessionInfoItem>
              
              <SessionInfoItem>
                <div className="label">End Time</div>
                <div className="value">
                  {selectedSession.endTime ? formatDate(selectedSession.endTime) : 'Active'}
                </div>
              </SessionInfoItem>
              
              <SessionInfoItem>
                <div className="label">Duration</div>
                <div className="value">
                  {calculateDuration(selectedSession.startTime, selectedSession.endTime)}
                </div>
              </SessionInfoItem>
              
              <SessionInfoItem>
                <div className="label">Starting Cash</div>
                <div className="value">{formatCurrency(selectedSession.startingCash)}</div>
              </SessionInfoItem>
              
              <SessionInfoItem>
                <div className="label">Ending Cash</div>
                <div className="value">
                  {selectedSession.endingCash ? formatCurrency(selectedSession.endingCash) : 'N/A'}
                </div>
              </SessionInfoItem>
              
              <SessionInfoItem>
                <div className="label">Difference</div>
                <div className={`value ${calculateDifference(selectedSession) > 0 ? 'positive' : 'negative'}`}>
                  {calculateDifference(selectedSession) !== null 
                    ? formatCurrency(calculateDifference(selectedSession)) 
                    : 'N/A'}
                </div>
              </SessionInfoItem>
            </SessionInfoGrid>
            
            <CashCountSection>
              <div className="section-title">Cash Counts</div>
              
              <CashCountGrid>
                <CashCountColumn>
                  <div className="column-title">Starting Cash</div>
                  <CashCountTable>
                    <thead>
                      <tr>
                        <th>Denomination</th>
                        <th>Count</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Bills */}
                      <tr>
                        <td className="denomination">$1</td>
                        <td className="count">{selectedSession.cashCounts['1'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['1'] || 0) * 1).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$5</td>
                        <td className="count">{selectedSession.cashCounts['5'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['5'] || 0) * 5).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$10</td>
                        <td className="count">{selectedSession.cashCounts['10'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['10'] || 0) * 10).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$20</td>
                        <td className="count">{selectedSession.cashCounts['20'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['20'] || 0) * 20).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$50</td>
                        <td className="count">{selectedSession.cashCounts['50'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['50'] || 0) * 50).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$100</td>
                        <td className="count">{selectedSession.cashCounts['100'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['100'] || 0) * 100).toFixed(2)}</td>
                      </tr>
                      
                      {/* Coins */}
                      <tr>
                        <td className="denomination">$1.00</td>
                        <td className="count">{selectedSession.cashCounts['1.00'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['1.00'] || 0) * 1).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$0.25</td>
                        <td className="count">{selectedSession.cashCounts['0.25'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['0.25'] || 0) * 0.25).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$0.10</td>
                        <td className="count">{selectedSession.cashCounts['0.10'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['0.10'] || 0) * 0.10).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$0.05</td>
                        <td className="count">{selectedSession.cashCounts['0.05'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['0.05'] || 0) * 0.05).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="denomination">$0.01</td>
                        <td className="count">{selectedSession.cashCounts['0.01'] || 0}</td>
                        <td className="amount">${((selectedSession.cashCounts['0.01'] || 0) * 0.01).toFixed(2)}</td>
                      </tr>
                      
                      {/* Total */}
                      <tr className="total-row">
                        <td>Total</td>
                        <td></td>
                        <td className="amount">${calculateTotal(selectedSession.cashCounts).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </CashCountTable>
                </CashCountColumn>
                
                {selectedSession.endCashCounts && (
                  <CashCountColumn>
                    <div className="column-title">Ending Cash</div>
                    <CashCountTable>
                      <thead>
                        <tr>
                          <th>Denomination</th>
                          <th>Count</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Bills */}
                        <tr>
                          <td className="denomination">$1</td>
                          <td className="count">{selectedSession.endCashCounts['1'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['1'] || 0) * 1).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$5</td>
                          <td className="count">{selectedSession.endCashCounts['5'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['5'] || 0) * 5).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$10</td>
                          <td className="count">{selectedSession.endCashCounts['10'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['10'] || 0) * 10).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$20</td>
                          <td className="count">{selectedSession.endCashCounts['20'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['20'] || 0) * 20).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$50</td>
                          <td className="count">{selectedSession.endCashCounts['50'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['50'] || 0) * 50).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$100</td>
                          <td className="count">{selectedSession.endCashCounts['100'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['100'] || 0) * 100).toFixed(2)}</td>
                        </tr>
                        
                        {/* Coins */}
                        <tr>
                          <td className="denomination">$1.00</td>
                          <td className="count">{selectedSession.endCashCounts['1.00'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['1.00'] || 0) * 1).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$0.25</td>
                          <td className="count">{selectedSession.endCashCounts['0.25'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['0.25'] || 0) * 0.25).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$0.10</td>
                          <td className="count">{selectedSession.endCashCounts['0.10'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['0.10'] || 0) * 0.10).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$0.05</td>
                          <td className="count">{selectedSession.endCashCounts['0.05'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['0.05'] || 0) * 0.05).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="denomination">$0.01</td>
                          <td className="count">{selectedSession.endCashCounts['0.01'] || 0}</td>
                          <td className="amount">${((selectedSession.endCashCounts['0.01'] || 0) * 0.01).toFixed(2)}</td>
                        </tr>
                        
                        {/* Total */}
                        <tr className="total-row">
                          <td>Total</td>
                          <td></td>
                          <td className="amount">${calculateTotal(selectedSession.endCashCounts).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </CashCountTable>
                  </CashCountColumn>
                )}
              </CashCountGrid>
            </CashCountSection>
            
            {selectedSession.transactions && selectedSession.transactions.length > 0 && (
              <TransactionsSection>
                <div className="section-title">
                  Transactions
                  <span className="transaction-count">
                    ({selectedSession.transactions.length} transactions)
                  </span>
                </div>
                
                <TransactionsList>
                  {selectedSession.transactions.map((transaction, index) => (
                    <div key={index} className="transaction-item">
                      <div className="transaction-info">
                        <div className="time">{formatDate(transaction.timestamp)}</div>
                        <div className="description">
                          {transaction.type === 'sale' ? 'Sale' : 'Refund'}
                          {transaction.orderId && ` - Order #${transaction.orderId}`}
                        </div>
                        <div className="payment-method">
                          Payment Method: {transaction.paymentMethod}
                        </div>
                      </div>
                      <div className={`transaction-amount ${transaction.type === 'sale' ? 'positive' : 'negative'}`}>
                        {transaction.type === 'sale' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </TransactionsList>
              </TransactionsSection>
            )}
          </SessionDetailsContent>
        </SessionDetailsCard>
      ) : (
        <>
          <SearchContainer>
            <div className="search-input">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search sessions..." 
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
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
            
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
          </FilterContainer>
          
          {filteredSessions.length > 0 ? (
            <SessionsTable>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('startTime')}>
                      Start Time {renderSortIcon('startTime')}
                    </th>
                    <th onClick={() => handleSort('endTime')}>
                      End Time {renderSortIcon('endTime')}
                    </th>
                    <th onClick={() => handleSort('startingCash')}>
                      Starting Cash {renderSortIcon('startingCash')}
                    </th>
                    <th onClick={() => handleSort('endingCash')}>
                      Ending Cash {renderSortIcon('endingCash')}
                    </th>
                    <th>Difference</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map(session => {
                    const difference = calculateDifference(session);
                    
                    return (
                      <tr key={session.id}>
                        <td>{formatDate(session.startTime)}</td>
                        <td>{session.endTime ? formatDate(session.endTime) : 'Active'}</td>
                        <td>{formatCurrency(session.startingCash)}</td>
                        <td>{session.endingCash ? formatCurrency(session.endingCash) : 'N/A'}</td>
                        <td>
                          {difference !== null ? (
                            <span className={`amount ${difference >= 0 ? 'positive' : 'negative'}`}>
                              {formatCurrency(difference)}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td>
                          <span className={`status-tag ${session.status}`}>
                            {session.status === 'active' ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button onClick={() => viewSessionDetails(session)}>
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </SessionsTable>
          ) : (
            <EmptyState>
              <div className="icon"><FiDollarSign /></div>
              <div className="title">No Register Sessions Found</div>
              <div className="description">
                {sessions.length === 0 
                  ? "There are no register sessions recorded yet. Start a register session from the Dashboard."
                  : "No sessions match your current filters. Try adjusting your search or filters to see more results."}
              </div>
            </EmptyState>
          )}
        </>
      )}
    </PageContainer>
  );
}

export default RegisterSessions;
