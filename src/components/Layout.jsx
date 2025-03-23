import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import { ThemeContext } from '../App';
import { getAppSettings } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentContainer = styled.main`
  flex: 1;
  overflow-y: auto;
  background-color: var(--background-color);
`;

const NavbarContainer = styled.div`
  background-color: var(--card-background);
  border-top: 1px solid var(--border-color);
`;

function Layout() {
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show sidebar on login and unauthorized pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/unauthorized';
  
  useEffect(() => {
    // Apply theme to body element
    document.body.setAttribute('data-theme', theme);
    
    // Check for system preference changes if theme is set to 'system'
    const settings = getAppSettings();
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      
      // Set initial value
      handleChange(mediaQuery);
      
      // Add listener
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  return (
    <LayoutContainer>
      <Header />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
      {isAuthenticated && !isAuthPage && (
        <NavbarContainer>
          <Sidebar />
        </NavbarContainer>
      )}
    </LayoutContainer>
  );
}

export default Layout;
