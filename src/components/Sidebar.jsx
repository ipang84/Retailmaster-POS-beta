import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiBox, 
  FiUsers, 
  FiShoppingCart, 
  FiBarChart2, 
  FiSettings,
  FiDollarSign,
  FiPackage,
  FiUserCheck
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 12px;
  
  svg {
    font-size: 20px;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 12px;
  }
  
  &.active {
    color: var(--primary-color);
    font-weight: 500;
  }
`;

function Sidebar() {
  const { hasPermission } = useAuth();
  
  return (
    <NavbarContainer>
      <StyledNavLink to="/" end>
        <FiHome />
        <span>Home</span>
      </StyledNavLink>
      
      {hasPermission('canProcessSales') && (
        <StyledNavLink to="/orders">
          <FiShoppingCart />
          <span>Orders</span>
        </StyledNavLink>
      )}
      
      {hasPermission('canManageProducts') && (
        <StyledNavLink to="/products">
          <FiBox />
          <span>Products</span>
        </StyledNavLink>
      )}
      
      {hasPermission('canManageInventory') && (
        <StyledNavLink to="/inventory">
          <FiPackage />
          <span>Inventory</span>
        </StyledNavLink>
      )}
      
      {hasPermission('canManageCustomers') && (
        <StyledNavLink to="/customers">
          <FiUsers />
          <span>Customers</span>
        </StyledNavLink>
      )}
      
      {hasPermission('canViewFinances') && (
        <StyledNavLink to="/finances">
          <FiDollarSign />
          <span>Finances</span>
        </StyledNavLink>
      )}
      
      {hasPermission('canViewReports') && (
        <StyledNavLink to="/reports">
          <FiBarChart2 />
          <span>Reports</span>
        </StyledNavLink>
      )}
      
      {hasPermission('canManageUsers') && (
        <StyledNavLink to="/users">
          <FiUserCheck />
          <span>Users</span>
        </StyledNavLink>
      )}
      
      {hasPermission('canManageSettings') && (
        <StyledNavLink to="/settings">
          <FiSettings />
          <span>Settings</span>
        </StyledNavLink>
      )}
    </NavbarContainer>
  );
}

export default Sidebar;
