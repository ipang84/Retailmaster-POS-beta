// authService.js - Handles authentication and user management

// Mock user data - In a real application, this would be stored in a database
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // In production, use hashed passwords
    name: 'Admin User',
    role: 'admin',
    email: 'admin@example.com',
    status: 'Active',
    tenantId: 'default'
  },
  {
    id: 2,
    username: 'manager',
    password: 'manager123',
    name: 'Store Manager',
    role: 'manager',
    email: 'manager@example.com',
    status: 'Active',
    tenantId: 'default'
  },
  {
    id: 3,
    username: 'cashier',
    password: 'cashier123',
    name: 'Cashier Staff',
    role: 'cashier',
    email: 'cashier@example.com',
    status: 'Active',
    tenantId: 'default'
  }
];

// Mock tenants data - In a real application, this would be stored in a database
const tenants = [
  {
    id: 'default',
    name: 'Demo Store',
    owner: {
      email: 'admin@example.com',
      name: 'Admin User'
    },
    plan: 'basic',
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z',
    settings: {
      storeName: 'Demo Store',
      storeAddress: '123 Main St, Anytown, USA',
      storePhone: '(555) 123-4567',
      storeEmail: 'contact@demostore.com',
      storeLogo: null,
      theme: 'light',
      currency: 'USD',
      taxRate: 0.07
    }
  }
];

// Role permissions
const rolePermissions = {
  admin: {
    description: 'Full system access',
    canManageUsers: true,
    canManageProducts: true,
    canManageInventory: true,
    canManageCustomers: true,
    canViewReports: true,
    canManageSettings: true,
    canProcessSales: true,
    canProcessRefunds: true,
    canManageVendors: true,
    canViewFinances: true
  },
  manager: {
    description: 'Manage inventory, reports, and staff',
    canManageUsers: false,
    canManageProducts: true,
    canManageInventory: true,
    canManageCustomers: true,
    canViewReports: true,
    canManageSettings: false,
    canProcessSales: true,
    canProcessRefunds: true,
    canManageVendors: true,
    canViewFinances: true
  },
  cashier: {
    description: 'Process sales and manage customers',
    canManageUsers: false,
    canManageProducts: false,
    canManageInventory: false,
    canManageCustomers: true,
    canViewReports: false,
    canManageSettings: false,
    canProcessSales: true,
    canProcessRefunds: false,
    canManageVendors: false,
    canViewFinances: false
  },
  owner: {
    description: 'Store owner with full access',
    canManageUsers: true,
    canManageProducts: true,
    canManageInventory: true,
    canManageCustomers: true,
    canViewReports: true,
    canManageSettings: true,
    canProcessSales: true,
    canProcessRefunds: true,
    canManageVendors: true,
    canViewFinances: true,
    canManageTenant: true
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Get current tenant from localStorage
export const getCurrentTenant = () => {
  const tenantJson = localStorage.getItem('currentTenant');
  return tenantJson ? JSON.parse(tenantJson) : null;
};

// Login function
export const login = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Create a sanitized user object (without password)
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    
    // Add permissions to user object
    sanitizedUser.permissions = rolePermissions[user.role];
    
    // Get tenant information
    const tenant = tenants.find(t => t.id === user.tenantId);
    if (tenant) {
      localStorage.setItem('currentTenant', JSON.stringify(tenant));
    }
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(sanitizedUser));
    return sanitizedUser;
  }
  
  throw new Error('Invalid username or password');
};

// Logout function
export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentTenant');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Check if user has specific permission
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  return user.permissions[permission] === true;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Get all available roles
export const getRoles = () => {
  return Object.keys(rolePermissions);
};

// Get permissions for a specific role
export const getRolePermissions = (role) => {
  return rolePermissions[role] || {};
};

// Get all users (for admin purposes)
export const getUsers = () => {
  // Return a copy of the users array without passwords
  return users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

// Update user
export const updateUser = (updatedUser) => {
  const index = users.findIndex(user => user.id === updatedUser.id);
  
  if (index !== -1) {
    // If a new password was provided, update it
    if (updatedUser.newPassword) {
      users[index].password = updatedUser.newPassword;
      delete updatedUser.newPassword;
    }
    
    // Update other user properties
    users[index] = {
      ...users[index],
      ...updatedUser
    };
    
    // If the updated user is the current user, update localStorage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      const updatedCurrentUser = {
        ...currentUser,
        ...updatedUser,
        permissions: rolePermissions[updatedUser.role]
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
    
    return true;
  }
  
  return false;
};

// Update role permissions
export const updateRole = (updatedRole) => {
  const roleName = updatedRole.name.toLowerCase();
  
  // Update role permissions
  if (rolePermissions[roleName]) {
    rolePermissions[roleName] = {
      ...updatedRole.permissions,
      description: updatedRole.description
    };
    
    // Update all users with this role to have the new permissions
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role === roleName) {
      currentUser.permissions = rolePermissions[roleName];
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return true;
  }
  
  // If it's a new role, add it
  rolePermissions[roleName] = {
    ...updatedRole.permissions,
    description: updatedRole.description
  };
  
  return true;
};

// Add a new user
export const addUser = (newUser) => {
  // Generate a new ID
  const newId = Math.max(...users.map(user => user.id)) + 1;
  
  // Add the new user
  users.push({
    id: newId,
    ...newUser
  });
  
  return true;
};

// Delete a user
export const deleteUser = (userId) => {
  const index = users.findIndex(user => user.id === userId);
  
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  
  return false;
};

// Create a new tenant and owner account
export const createTenant = (tenantData, ownerData) => {
  // Check if email already exists
  const emailExists = users.some(user => user.email === ownerData.email);
  if (emailExists) {
    throw new Error('Email already in use');
  }
  
  // Generate tenant ID (in a real app, use a more robust method)
  const tenantId = `tenant_${Date.now()}`;
  
  // Create the tenant
  const newTenant = {
    id: tenantId,
    name: tenantData.storeName,
    owner: {
      email: ownerData.email,
      name: ownerData.name
    },
    plan: 'basic',
    status: 'active',
    createdAt: new Date().toISOString(),
    settings: {
      storeName: tenantData.storeName,
      storeAddress: tenantData.storeAddress || '',
      storePhone: tenantData.storePhone || '',
      storeEmail: tenantData.storeEmail || ownerData.email,
      storeLogo: null,
      theme: 'light',
      currency: tenantData.currency || 'USD',
      taxRate: tenantData.taxRate || 0.07
    }
  };
  
  // Create the owner user
  const newOwner = {
    id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
    username: ownerData.email.split('@')[0], // Simple username generation
    password: ownerData.password,
    name: ownerData.name,
    role: 'owner',
    email: ownerData.email,
    status: 'Active',
    tenantId: tenantId
  };
  
  // Add to our mock databases
  tenants.push(newTenant);
  users.push(newOwner);
  
  // Return the created tenant and sanitized owner
  const { password, ...ownerWithoutPassword } = newOwner;
  return {
    tenant: newTenant,
    owner: {
      ...ownerWithoutPassword,
      permissions: rolePermissions.owner
    }
  };
};

// Get tenant by ID
export const getTenantById = (tenantId) => {
  return tenants.find(t => t.id === tenantId);
};

// Update tenant settings
export const updateTenantSettings = (tenantId, newSettings) => {
  const tenantIndex = tenants.findIndex(t => t.id === tenantId);
  if (tenantIndex === -1) return false;
  
  tenants[tenantIndex].settings = {
    ...tenants[tenantIndex].settings,
    ...newSettings
  };
  
  // Update localStorage if this is the current tenant
  const currentTenant = getCurrentTenant();
  if (currentTenant && currentTenant.id === tenantId) {
    currentTenant.settings = tenants[tenantIndex].settings;
    localStorage.setItem('currentTenant', JSON.stringify(currentTenant));
  }
  
  return true;
};

// Get users for a specific tenant
export const getUsersByTenant = (tenantId) => {
  return users
    .filter(user => user.tenantId === tenantId)
    .map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
};
