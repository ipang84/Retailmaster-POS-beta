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
import { getProducts, getCategoryById } from '../services/productService';
import { getVendorById } from '../services/vendorService';
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

const ProductTable = styled.div`
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
    
    .product-info {
      display: flex;
      align-items: center;
      
      .product-image {
        width: 40px;
        height: 40px;
        background-color: #f5f5f5;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        overflow: hidden;
        
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      
      .product-details {
        display: flex;
        flex-direction: column;
        
        .product-name {
          font-weight: 500;
        }
        
        .product-sku {
          font-size: 12px;
          color: #666;
        }
      }
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

function ProductSalesReport() {
  const navigate = useNavigate();
  
  // State for data
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSales, setProductSales] = useState([]);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  
  // State for sorting
  const [sortField, setSortField] = useState('sales');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State for chart
  const [chartType, setChartType] = useState('bar');
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      const ordersData = getOrders();
      const productsData = getProducts();
      
      setOrders(ordersData);
      setProducts(productsData);
    };
    
    loadData();
  }, []);
  
  // Process data when orders or products change
  useEffect(() => {
    if (!orders.length || !products.length) return;
    
    // Process data to calculate sales by product
    calculateProductSales();
  }, [orders, products, timeRange, startDate, endDate, selectedCategory, selectedVendor]);
  
  // Filter product sales when search term changes
  useEffect(() => {
    if (!productSales.length) return;
    
    const filteredSales = productSales.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Sort the filtered sales
    sortProductSales(filteredSales);
  }, [searchTerm, productSales, sortField, sortDirection]);
  
  // Calculate sales by product
  const calculateProductSales = () => {
    // Create a map to store sales by product
    const salesByProduct = {};
    
    // Initialize sales for all products
    products.forEach(product => {
      // Skip if filtered by category or vendor
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return;
      if (selectedVendor !== 'all' && product.vendor !== selectedVendor) return;
      
      salesByProduct[product.id] = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        categoryName: getCategoryById(product.category)?.name || product.category,
        vendor: product.vendor,
        vendorName: getVendorById(product.vendor)?.name || product.vendor,
        sales: 0,
        quantity: 0,
        orderCount: 0,
        cost: product.cost || 0,
        price: product.price || 0,
        profit: 0,
        profitMargin: 0
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
        // Skip custom items - FIX: Safely check if item.id exists and is a string before calling startsWith
        if (item.id && typeof item.id === 'string' && item.id.startsWith('custom-')) return;
        
        // Skip if product doesn't exist in our list (might have been filtered out)
        if (!salesByProduct[item.id]) return;
        
        // Calculate item total (considering partial refunds)
        let itemTotal = item.price * item.quantity;
        let itemQuantity = item.quantity;
        
        // Check if this item was partially refunded
        if (order.refunds && order.refunds.length > 0) {
          order.refunds.forEach(refund => {
            const refundedItem = refund.items.find(ri => ri.id === item.id);
            if (refundedItem) {
              // Subtract refunded amount and quantity
              const refundedTotal = refundedItem.price * refundedItem.quantity;
              itemTotal -= refundedTotal;
              itemQuantity -= refundedItem.quantity;
            }
          });
        }
        
        // Add to product sales
        salesByProduct[item.id].sales += itemTotal;
        salesByProduct[item.id].quantity += itemQuantity;
        
        // Calculate profit
        const itemCost = salesByProduct[item.id].cost * itemQuantity;
        const itemProfit = itemTotal - itemCost;
        salesByProduct[item.id].profit += itemProfit;
      });
      
      // Count unique orders per product
      const productsInOrder = new Set();
      order.items.forEach(item => {
        // FIX: Safely check if item.id exists and is a string before calling startsWith
        if (item.id && typeof item.id !== 'string') return;
        if (item.id && typeof item.id === 'string' && item.id.startsWith('custom-')) return;
        if (salesByProduct[item.id]) {
          productsInOrder.add(item.id);
        }
      });
      
      // Increment order count for each product in this order
      productsInOrder.forEach(productId => {
        if (salesByProduct[productId]) {
          salesByProduct[productId].orderCount++;
        }
      });
    });
    
    // Convert to array and calculate percentages
    const totalSales = Object.values(salesByProduct).reduce((sum, product) => sum + product.sales, 0);
    
    const productSalesArray = Object.values(salesByProduct)
      .filter(product => product.sales > 0 || product.quantity > 0) // Only include products with sales
      .map(product => ({
        ...product,
        percentage: totalSales > 0 ? (product.sales / totalSales) * 100 : 0,
        profitMargin: product.sales > 0 ? (product.profit / product.sales) * 100 : 0
      }));
    
    // Sort by sales (descending) by default
    const sortedSales = productSalesArray.sort((a, b) => b.sales - a.sales);
    
    setProductSales(sortedSales);
  };
  
  // Sort product sales
  const sortProductSales = (sales) => {
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
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'profit':
          aValue = a.profit;
          bValue = b.profit;
          break;
        case 'profitMargin':
          aValue = a.profitMargin;
          bValue = b.profitMargin;
          break;
        case 'orderCount':
          aValue = a.orderCount;
          bValue = b.orderCount;
          break;
        case 'category':
          aValue = a.categoryName.toLowerCase();
          bValue = b.categoryName.toLowerCase();
          break;
        case 'vendor':
          aValue = a.vendorName.toLowerCase();
          bValue = b.vendorName.toLowerCase();
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
  const totalSales = productSales.reduce((sum, product) => sum + product.sales, 0);
  const totalQuantity = productSales.reduce((sum, product) => sum + product.quantity, 0);
  const totalProfit = productSales.reduce((sum, product) => sum + product.profit, 0);
  const averageProfitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  
  // Get unique categories and vendors for filters
  const categories = [...new Set(products.map(product => product.category))]
    .map(categoryId => {
      const category = getCategoryById(categoryId);
      return { id: categoryId, name: category ? category.name : categoryId };
    });
  
  const vendors = [...new Set(products.map(product => product.vendor))]
    .map(vendorId => {
      const vendor = getVendorById(vendorId);
      return { id: vendorId, name: vendor ? vendor.name : vendorId };
    });
  
  // Get top products (for chart)
  const topProducts = [...productSales]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);
  
  // Calculate max sales for chart scaling
  const maxSales = topProducts.length > 0 ? topProducts[0].sales : 0;
  
  // Filter products based on search
  const filteredProducts = productSales.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort filtered products
  const sortedProducts = sortProductSales(filteredProducts);

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/reports')}>
          <FiChevronLeft />
          Back to Reports
        </BackButton>
        <Title>Sales by Product</Title>
      </PageHeader>
      
      <ReportContainer>
        <ReportContent>
          <SearchContainer>
            <div className="search-input">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search products by name or SKU..." 
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
            
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select 
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
            >
              <option value="all">All Vendors</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
          </FilterContainer>
          
          <SummaryCards>
            <StatsCard title="Total Product Sales">
              <SummaryValue>{formatCurrency(totalSales)}</SummaryValue>
              <SummarySubtitle>{productSales.length} products</SummarySubtitle>
            </StatsCard>
            
            <StatsCard title="Items Sold">
              <SummaryValue>{totalQuantity}</SummaryValue>
              <SummarySubtitle>Total quantity</SummarySubtitle>
            </StatsCard>
            
            <StatsCard title="Total Profit">
              <SummaryValue>{formatCurrency(totalProfit)}</SummaryValue>
              <SummarySubtitle>Gross profit</SummarySubtitle>
            </StatsCard>
            
            <StatsCard title="Profit Margin">
              <SummaryValue>{averageProfitMargin.toFixed(1)}%</SummaryValue>
              <SummarySubtitle>Average margin</SummarySubtitle>
            </StatsCard>
          </SummaryCards>
          
          {sortedProducts.length > 0 ? (
            <>
              <ProductTable>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')}>
                        Product {renderSortIcon('name')}
                      </th>
                      <th onClick={() => handleSort('sales')}>
                        Sales {renderSortIcon('sales')}
                      </th>
                      <th onClick={() => handleSort('quantity')}>
                        Quantity {renderSortIcon('quantity')}
                      </th>
                      <th onClick={() => handleSort('profit')}>
                        Profit {renderSortIcon('profit')}
                      </th>
                      <th onClick={() => handleSort('profitMargin')}>
                        Margin {renderSortIcon('profitMargin')}
                      </th>
                      <th onClick={() => handleSort('category')}>
                        Category {renderSortIcon('category')}
                      </th>
                      <th onClick={() => handleSort('vendor')}>
                        Vendor {renderSortIcon('vendor')}
                      </th>
                      <th onClick={() => handleSort('orderCount')}>
                        Orders {renderSortIcon('orderCount')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-info">
                            <div className="product-image">
                              {/* Placeholder for product image */}
                              <div style={{ fontSize: '18px', color: '#aaa' }}>
                                {product.name.charAt(0)}
                              </div>
                            </div>
                            <div className="product-details">
                              <div className="product-name">{product.name}</div>
                              {product.sku && <div className="product-sku">SKU: {product.sku}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="sales-value">{formatCurrency(product.sales)}</td>
                        <td>{product.quantity}</td>
                        <td>{formatCurrency(product.profit)}</td>
                        <td>
                          <div className={`trend ${product.profitMargin > 0 ? 'positive' : 'negative'}`}>
                            {product.profitMargin > 0 ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                            {product.profitMargin.toFixed(1)}%
                          </div>
                        </td>
                        <td>{product.categoryName}</td>
                        <td>{product.vendorName}</td>
                        <td>{product.orderCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ProductTable>
              
              <ChartContainer>
                <div className="chart-header">
                  <div className="chart-title">Top 10 Products by Sales</div>
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
                    {topProducts.map(product => (
                      <div key={product.id} className="bar-container">
                        <div className="bar-label" title={product.name}>{product.name}</div>
                        <div className="bar-wrapper">
                          <div 
                            className="bar" 
                            style={{ width: `${(product.sales / maxSales) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-value">{formatCurrency(product.sales)}</div>
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
              <div className="title">No product sales data found</div>
              <div className="description">
                {productSales.length === 0 
                  ? "There are no sales recorded yet. Sales will appear here when you complete orders with products."
                  : "No products match your current search or filters. Try adjusting your search term or filters to see more results."}
              </div>
            </EmptyState>
          )}
        </ReportContent>
      </ReportContainer>
    </PageContainer>
  );
}

export default ProductSalesReport;
