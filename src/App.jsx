import React, { useState, useEffect, createContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Create a context for theme management
export const ThemeContext = createContext();

function App() {
  // Get theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  
  // Apply theme to document when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Outlet />
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;
