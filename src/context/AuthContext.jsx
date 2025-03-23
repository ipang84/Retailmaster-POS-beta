import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCurrentUser, 
  login, 
  logout, 
  isAuthenticated, 
  hasPermission, 
  getUserRole,
  getCurrentTenant,
  createTenant,
  updateTenantSettings
} from '../services/authService';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    const currentTenant = getCurrentTenant();
    
    if (currentUser) {
      setUser(currentUser);
    }
    
    if (currentTenant) {
      setTenant(currentTenant);
    }
    
    setLoading(false);
  }, []);

  // Login function
  const handleLogin = async (username, password) => {
    try {
      const user = login(username, password);
      setUser(user);
      
      // Set tenant
      const currentTenant = getCurrentTenant();
      if (currentTenant) {
        setTenant(currentTenant);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const handleLogout = () => {
    logout();
    setUser(null);
    setTenant(null);
  };

  // Check permission
  const checkPermission = (permission) => {
    return hasPermission(permission);
  };

  // Get user role
  const getRole = () => {
    return getUserRole();
  };
  
  // Create new tenant and owner account
  const handleCreateTenant = async (tenantData, ownerData) => {
    try {
      const result = createTenant(tenantData, ownerData);
      
      // Auto login after signup
      setUser(result.owner);
      setTenant(result.tenant);
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(result.owner));
      localStorage.setItem('currentTenant', JSON.stringify(result.tenant));
      
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  // Update tenant settings
  const handleUpdateTenantSettings = (newSettings) => {
    if (!tenant) return false;
    
    const success = updateTenantSettings(tenant.id, newSettings);
    if (success) {
      // Update local state
      setTenant(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...newSettings
        }
      }));
    }
    
    return success;
  };

  // Context value
  const value = {
    user,
    tenant,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    loading,
    hasPermission: checkPermission,
    role: user ? user.role : null,
    getRole,
    createTenant: handleCreateTenant,
    updateTenantSettings: handleUpdateTenantSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
