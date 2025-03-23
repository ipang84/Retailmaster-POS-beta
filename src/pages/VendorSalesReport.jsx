import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiChevronLeft, 
  FiDownload, 
  FiSearch, 
  FiBarChart2, 
  FiPieChart,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import { getVendors } from '../services/vendorService';
import { getProducts } from '../services/productService';
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

const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const SummarySubtitle = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const VendorTable = styled.div`
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
      cursor: pointer;
      
      .sort-icon {
        margin-left: 4px;
        vertical-align: middle;
      }
    }
    
    tr:hover td {
      background-color: #f5f5f5;
    }
    
    .vendor-name {
      font-weight: 500;
    }
    
    .sales-value {
      font-weight: 500;
    }
    
    .percentage {
      color: #666;
      font-size: 12px;
    }
    
    .trend {
      display: flex;
      align-items: center;
      
      &.positive {
        color: #2e7d32;
      }
      
      &.negative {
        color: #d32f2f;
      }
      
      svg {
        margin-right: 4px;
      }
    }
  }
`;

const ChartContainer = styled.div`
  margin-top: 32px;
  
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
  
  .chart-type-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    color: #666;
    cursor: pointer;
    
    &.active {
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }
    
    &:hover:not(.active) {
      background-color: #f5f5f5;
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

function VendorSalesReport() {
  const navigate = useNavigate();
  
  // State for data
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendorSales, setVendorSales] = useState([]);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  
  // State for sorting
  const [sortField, setSortField] = useState('sales');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State for chart
  const [chartType, setChartType] = useState('bar');
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      const ordersData = getOrders();
      const vendorsData = getVendors();
      const productsData = getProducts();
      
      setOrders(ordersData);
      setVendors(vendorsData);
      setProducts(productsData);
    };
    
    loadData();
  }, []);
  
  // Process data when orders, vendors, or products change
  useEffect(() => {
    if (!orders.length || !vendors.length || !products.length) return;
    
    // Process data to calculate sales by vendor
    calculateVendorSales();
  }, [orders, vendors, products, timeRange, startDate, endDate]);
  
  // Filter vendor sales when search term changes
  useEffect(() => {
    if (!vendorSales.length) return;
    
    const filteredSales = vendorSales.filter(vendor => 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort the filtered sales
    sortVendorSales(filteredSales);
  }, [searchTerm, vendorSales, sortField, sortDirection]);
  
  // Calculate sales by vendor
  const calculateVendorSales = () => {
    // Create a map to store sales by vendor
    const salesByVendor = {};
    
    // Initialize sales for all vendors
    vendors.forEach(vendor => {
      salesByVendor[vendor.id] = {
        id: vendor.id,
        name: vendor.name,
        contact: vendor.contact,
        sales: 0,
        itemsSold: 0,
        orderCount: 0,
        products: {}
      };
    });
    
    // Filter orders by date range if specified
    let filteredOrders = [...orders];
    
    if (timeRange === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === today;
      });
    } else if (timeRange === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === yesterdayStr;
      });
    } else if (timeRange === 'last7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filteredOrders = filteredOrders.filter(order => {
        return new Date(order.date) >= sevenDaysAgo;
      });
    } else if (timeRange === 'last30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filteredOrders = filteredOrders.filter(order => {
        return new Date(order.date) >= thirtyDaysAgo;
      });
    } else if (timeRange === 'custom' && startDate) {
      const start = new Date(startDate);
      filteredOrders = filteredOrders.filter(order => {
        return new Date(order.date) >= start;
      });
      
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59'); // End of the selected day
        filteredOrders = filteredOrders.filter(order => {
          return new Date(order.date) <= end;
        });
      }
    }
    
    // Process each order
    filteredOrders.forEach(order => {
      // Skip refunded orders
      if (order.status === 'refunded') return;
      
      // Process each item in the order
      order.items.forEach(item => {
        // Skip custom items (they don't have a vendor)
        // FIX: Add type checking before calling startsWith
        if (item.id && typeof item.id === 'string' && item.id.startsWith('custom-')) return;
        
        // Find the product to get its vendor
        const product = products.find(p => p.id === item.id);
        if (!product || !product.vendor) return;
        
        const vendorId = product.vendor;
        
        // Skip if vendor doesn't exist in our list
        if (!salesByVendor[vendorId]) return;
        
        // Calculate item total (considering partial refunds)
        let itemTotal = item.price * item.quantity;
        
        // Check if this item was partially refunded
        if (order.refunds && order.refunds.length > 0) {
          order.refunds.forEach(refund => {
            const refundedItem = refund.items.find(ri => ri.id === item.id);
            if (refundedItem) {
              // Subtract refunded amount
              const refundedTotal = refundedItem.price * refundedItem.quantity;
              itemTotal -= refundedTotal;
            }
          });
        }
        
        // Add to vendor sales
        salesByVendor[vendorId].sales += itemTotal;
        salesByVendor[vendorId].itemsSold += item.quantity;
        
        // Track products sold
        if (!salesByVendor[vendorId].products[item.id]) {
          salesByVendor[vendorId].products[item.id] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            sales: 0
          };
        }
        
        salesByVendor[vendorId].products[item.id].quantity += item.quantity;
        salesByVendor[vendorId].products[item.id].sales += itemTotal;
      });
      
      // Count unique orders per vendor
      const vendorsInOrder = new Set();
      order.items.forEach(item => {
        // FIX: Add type checking before calling startsWith
        if (item.id && typeof item.id !== 'string') return;
        if (item.id && typeof item.id === 'string' && item.id.startsWith('custom-')) return;
        
        const product = products.find(p => p.id === item.id);
        if (product && product.vendor) {
          vendorsInOrder.add(product.vendor);
        }
      });
      
      // Increment order count for each vendor in this order
      vendorsInOrder.forEach(vendorId => {
        if (salesByVendor[vendorId]) {
          salesByVendor[vendorId].orderCount++;
        }
      });
    });
    
    // Convert to array and calculate percentages
    const totalSales = Object.values(salesByVendor).reduce((sum, vendor) => sum + vendor.sales, 0);
    
    const vendorSalesArray = Object.values(salesByVendor).map(vendor => ({
      ...vendor,
      percentage: totalSales > 0 ? (vendor.sales / totalSales) * 100 : 0,
      // Convert products object to array
      productList: Object.values(vendor.products).sort((a, b) => b.sales - a.sales)
    }));
    
    // Sort by sales (descending) by default
    const sortedSales = vendorSalesArray.sort((a, b) => b.sales - a.sales);
    
    setVendorSales(sortedSales);
  };
  
  // Sort vendor sales
  const sortVendorSales = (sales) => {
    const sorted = [...sales].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'sales':
          aValue = a.sales;
          bValue = b.sales;
          break;
        case 'percentage':
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        case 'itemsSold':
          aValue = a.itemsSold;
          bValue = b.itemsSold;
          break;
        case 'orderCount':
          aValue = a.orderCount;
          bValue = b.orderCount;
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
    
    return sorted;
  };
  
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
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <FiArrowUp className="sort-icon" size={12} /> : 
      <FiArrowDown className="sort-icon" size={12} />;
  };
  
  // Calculate summary statistics
  const totalSales = vendorSales.reduce((sum, vendor) => sum + vendor.sales, 0);
  const totalItems = vendorSales.reduce((sum, vendor) => sum + vendor.itemsSold, 0);
  const totalOrders = new Set(orders.map(order => order.id)).size;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Get top vendors (for chart)
  const topVendors = [...vendorSales]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);
  
  // Calculate max sales for chart scaling
  const maxSales = topVendors.length > 0 ? topVendors[0].sales : 0;
  
  // Filter vendors based on search
  const filteredVendors = vendorSales.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort filtered vendors
  const sortedVendors = sortVendorSales(filteredVendors);

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/reports')}>
          <FiChevronLeft />
          Back to Reports
        </BackButton>
        <Title>Sales by Vendor</Title>
      </PageHeader>
      
      <ReportContainer>
        <ReportContent>
          <SearchContainer>
            <div className="search-input">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search vendors..." 
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
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
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
          </FilterContainer>
          
          <SummaryCards>
            <StatsCard title="Total Vendor Sales">
              <SummaryValue>{formatCurrency(totalSales)}</SummaryValue>
              <SummarySubtitle>{vendorSales.length} vendors</SummarySubtitle>
            </StatsCard>
            
            <StatsCard title="Items Sold">
              <SummaryValue>{totalItems}</SummaryValue>
              <SummarySubtitle>Total quantity</SummarySubtitle>
            </StatsCard>
            
            <StatsCard title="Average Order Value">
              <SummaryValue>{formatCurrency(averageOrderValue)}</SummaryValue>
              <SummarySubtitle>Per transaction</SummarySubtitle>
            </StatsCard>
            
            <StatsCard title="Top Vendor">
              <SummaryValue>
                {topVendors.length > 0 ? topVendors[0].name : 'N/A'}
              </SummaryValue>
              <SummarySubtitle>
                {topVendors.length > 0 ? formatCurrency(topVendors[0].sales) : '$0.00'}
              </SummarySubtitle>
            </StatsCard>
          </SummaryCards>
          
          {sortedVendors.length > 0 ? (
            <>
              <VendorTable>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')}>
                        Vendor {renderSortIcon('name')}
                      </th>
                      <th onClick={() => handleSort('sales')}>
                        Sales {renderSortIcon('sales')}
                      </th>
                      <th onClick={() => handleSort('percentage')}>
                        % of Total {renderSortIcon('percentage')}
                      </th>
                      <th onClick={() => handleSort('itemsSold')}>
                        Items Sold {renderSortIcon('itemsSold')}
                      </th>
                      <th onClick={() => handleSort('orderCount')}>
                        Orders {renderSortIcon('orderCount')}
                      </th>
                      <th>Top Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedVendors.map(vendor => (
                      <tr key={vendor.id}>
                        <td className="vendor-name">{vendor.name}</td>
                        <td className="sales-value">{formatCurrency(vendor.sales)}</td>
                        <td>
                          <div className="percentage">{vendor.percentage.toFixed(1)}%</div>
                        </td>
                        <td>{vendor.itemsSold}</td>
                        <td>{vendor.orderCount}</td>
                        <td>
                          {vendor.productList.length > 0 ? (
                            <div>
                              <div>{vendor.productList[0].name}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {vendor.productList[0].quantity} sold ({formatCurrency(vendor.productList[0].sales)})
                              </div>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </VendorTable>
              
              <ChartContainer>
                <div className="chart-header">
                  <div className="chart-title">Top 10 Vendors by Sales</div>
                  <div className="chart-actions">
                    <button 
                      className={`chart-type-button ${chartType === 'bar' ? 'active' : ''}`}
                      onClick={() => setChartType('bar')}
                    >
                      <FiBarChart2 />
                    </button>
                    <button 
                      className={`chart-type-button ${chartType === 'pie' ? 'active' : ''}`}
                      onClick={() => setChartType('pie')}
                    >
                      <FiPieChart />
                    </button>
                  </div>
                </div>
                
                {chartType === 'bar' && (
                  <BarChart>
                    {topVendors.map(vendor => (
                      <div key={vendor.id} className="bar-container">
                        <div className="bar-label" title={vendor.name}>{vendor.name}</div>
                        <div className="bar-wrapper">
                          <div 
                            className="bar" 
                            style={{ width: `${(vendor.sales / maxSales) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-value">{formatCurrency(vendor.sales)}</div>
                      </div>
                    ))}
                  </BarChart>
                )}
                
                {chartType === 'pie' && (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Pie chart visualization would be implemented here.</p>
                    <p>For a production app, we would use a library like Chart.js or Recharts.</p>
                  </div>
                )}
              </ChartContainer>
            </>
          ) : (
            <EmptyState>
              <div className="icon"><FiBarChart2 /></div>
              <div className="title">No vendor sales data found</div>
              <div className="description">
                {vendorSales.length === 0 
                  ? "There are no sales recorded yet. Sales will appear here when you complete orders with products from vendors."
                  : "No vendors match your current search. Try adjusting your search term to see more results."}
              </div>
            </EmptyState>
          )}
        </ReportContent>
      </ReportContainer>
    </PageContainer>
  );
}

export default VendorSalesReport;
