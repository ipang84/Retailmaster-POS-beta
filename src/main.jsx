import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import Reports from './pages/Reports';
import ProductSalesReport from './pages/ProductSalesReport';
import VendorSalesReport from './pages/VendorSalesReport';
import DailySalesReport from './pages/DailySalesReport';
import SalesOverTimeReport from './pages/SalesOverTimeReport';
import Settings from './pages/Settings';
import Finances from './pages/Finances';
import Payouts from './pages/Payouts';
import RegisterSessions from './pages/RegisterSessions';
import NewTask from './pages/NewTask';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import UserManagement from './pages/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

// Create placeholder components for missing report pages
const PaymentTypeReport = () => <div style={{padding: "24px"}}><h1>Payment Type Report</h1><p>This report page is under development.</p></div>;
const ReturnsReport = () => <div style={{padding: "24px"}}><h1>Returns Report</h1><p>This report page is under development.</p></div>;
const TaxesReport = () => <div style={{padding: "24px"}}><h1>Taxes Report</h1><p>This report page is under development.</p></div>;
const InventoryValuationReport = () => <div style={{padding: "24px"}}><h1>Inventory Valuation Report</h1><p>This report page is under development.</p></div>;
const InventoryMovementReport = () => <div style={{padding: "24px"}}><h1>Inventory Movement Report</h1><p>This report page is under development.</p></div>;
const StockTurnoverReport = () => <div style={{padding: "24px"}}><h1>Stock Turnover Report</h1><p>This report page is under development.</p></div>;
const LowStockReport = () => <div style={{padding: "24px"}}><h1>Low Stock Report</h1><p>This report page is under development.</p></div>;
const CustomerPurchaseHistoryReport = () => <div style={{padding: "24px"}}><h1>Customer Purchase History Report</h1><p>This report page is under development.</p></div>;
const CustomerAcquisitionReport = () => <div style={{padding: "24px"}}><h1>Customer Acquisition Report</h1><p>This report page is under development.</p></div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />
      },
      {
        path: '/',
        element: (
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: 'products',
            element: (
              <PrivateRoute requiredPermission="canManageProducts">
                <Products />
              </PrivateRoute>
            )
          },
          {
            path: 'products/add',
            element: (
              <PrivateRoute requiredPermission="canManageProducts">
                <AddProduct />
              </PrivateRoute>
            )
          },
          {
            path: 'products/edit/:id',
            element: (
              <PrivateRoute requiredPermission="canManageProducts">
                <EditProduct />
              </PrivateRoute>
            )
          },
          {
            path: 'inventory',
            element: (
              <PrivateRoute requiredPermission="canManageInventory">
                <Inventory />
              </PrivateRoute>
            )
          },
          {
            path: 'customers',
            element: (
              <PrivateRoute requiredPermission="canManageCustomers">
                <Customers />
              </PrivateRoute>
            )
          },
          {
            path: 'orders',
            element: (
              <PrivateRoute requiredPermission="canProcessSales">
                <Orders />
              </PrivateRoute>
            )
          },
          {
            path: 'orders/new',
            element: (
              <PrivateRoute requiredPermission="canProcessSales">
                <NewOrder />
              </PrivateRoute>
            )
          },
          {
            path: 'reports',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <Reports />
              </PrivateRoute>
            )
          },
          // Report routes
          {
            path: 'reports/daily-sales',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <DailySalesReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/sales-over-time',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <SalesOverTimeReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/product-sales',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <ProductSalesReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/vendor-sales',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <VendorSalesReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/payment-type',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <PaymentTypeReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/returns',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <ReturnsReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/taxes',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <TaxesReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/inventory-valuation',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <InventoryValuationReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/inventory-movement',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <InventoryMovementReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/stock-turnover',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <StockTurnoverReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/low-stock',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <LowStockReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/customer-purchase-history',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <CustomerPurchaseHistoryReport />
              </PrivateRoute>
            )
          },
          {
            path: 'reports/customer-acquisition',
            element: (
              <PrivateRoute requiredPermission="canViewReports">
                <CustomerAcquisitionReport />
              </PrivateRoute>
            )
          },
          {
            path: 'settings',
            element: (
              <PrivateRoute requiredPermission="canManageSettings">
                <Settings />
              </PrivateRoute>
            )
          },
          {
            path: 'finances',
            element: (
              <PrivateRoute requiredPermission="canViewFinances">
                <Finances />
              </PrivateRoute>
            )
          },
          {
            path: 'payouts',
            element: (
              <PrivateRoute requiredPermission="canViewFinances">
                <Payouts />
              </PrivateRoute>
            )
          },
          {
            path: 'register-sessions',
            element: (
              <PrivateRoute requiredPermission="canProcessSales">
                <RegisterSessions />
              </PrivateRoute>
            )
          },
          {
            path: 'tasks/new',
            element: (
              <PrivateRoute>
                <NewTask />
              </PrivateRoute>
            )
          },
          {
            path: 'users',
            element: (
              <PrivateRoute requiredPermission="canManageUsers">
                <UserManagement />
              </PrivateRoute>
            )
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
