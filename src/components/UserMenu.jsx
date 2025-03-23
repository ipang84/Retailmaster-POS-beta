import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const UserMenuContainer = styled.div`
  position: relative;
  margin-left: auto;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-right: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-right: 8px;
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 14px;
`;

const UserRole = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: var(--card-background);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  margin-top: 8px;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: var(--text-color);
  
  svg {
    margin-right: 12px;
    color: var(--text-secondary);
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--border-color);
  margin: 4px 0;
`;

const TenantInfo = styled.div`
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--border-color);
`;

const TenantName = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
`;

const TenantPlan = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  
  span {
    display: inline-block;
    padding: 2px 6px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 12px;
    font-size: 10px;
    margin-left: 6px;
    text-transform: uppercase;
  }
`;

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  if (!user) return null;
  
  return (
    <UserMenuContainer ref={menuRef}>
      <UserButton onClick={() => setIsOpen(!isOpen)}>
        <UserAvatar>{getInitials()}</UserAvatar>
        <UserInfo>
          <UserName>{user.name}</UserName>
          <UserRole>{user.role}</UserRole>
        </UserInfo>
        <FiChevronDown />
      </UserButton>
      
      {isOpen && (
        <DropdownMenu>
          {tenant && (
            <TenantInfo>
              <TenantName>{tenant.name}</TenantName>
              <TenantPlan>
                {tenant.plan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
                <span>{tenant.plan}</span>
              </TenantPlan>
            </TenantInfo>
          )}
          
          <MenuItem onClick={handleSettings}>
            <FiSettings />
            Settings
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <FiLogOut />
            Logout
          </MenuItem>
        </DropdownMenu>
      )}
    </UserMenuContainer>
  );
}

export default UserMenu;
