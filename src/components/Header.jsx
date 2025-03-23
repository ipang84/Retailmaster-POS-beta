import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiSearch, FiMoon, FiSun } from 'react-icons/fi';
import { ThemeContext } from '../App';
import UserMenu from './UserMenu';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  border-radius: 4px;
  padding: 8px 12px;
  margin-left: 16px;
  flex: 1;
  max-width: 400px;
  
  svg {
    color: var(--text-secondary);
    margin-right: 8px;
  }
  
  input {
    border: none;
    background: none;
    outline: none;
    color: var(--text-color);
    width: 100%;
    font-size: 14px;
    
    &::placeholder {
      color: var(--text-secondary);
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: 16px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

function Header({ toggleSidebar }) {
  const themeContext = React.useContext(ThemeContext);
  
  return (
    <HeaderContainer>
      <MenuButton onClick={toggleSidebar}>
        <FiMenu />
      </MenuButton>
      
      <SearchContainer>
        <FiSearch />
        <input type="text" placeholder="Search..." />
      </SearchContainer>
      
      <ThemeToggle onClick={themeContext.toggleTheme}>
        {themeContext.theme === 'dark' ? <FiSun /> : <FiMoon />}
      </ThemeToggle>
      
      <UserMenu />
    </HeaderContainer>
  );
}

export default Header;
