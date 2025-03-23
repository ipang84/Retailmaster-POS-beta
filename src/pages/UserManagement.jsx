import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUserCheck, FiPlus, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getUsersByTenant, addUser, updateUser, deleteUser, getRoles } from '../services/authService';

const UserManagementContainer = styled.div`
  padding: 20px;
`;

const UserManagementHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 12px;
    }
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #0055cc;
  }
`;

const UserTable = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    background-color: rgba(0, 0, 0, 0.02);
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover td {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.active {
    background-color: rgba(0, 204, 102, 0.1);
    color: var(--success-color);
  }
  
  &.inactive {
    background-color: rgba(153, 153, 153, 0.1);
    color: var(--text-secondary);
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.admin, &.owner {
    background-color: rgba(255, 77, 77, 0.1);
    color: var(--danger-color);
  }
  
  &.manager {
    background-color: rgba(0, 102, 255, 0.1);
    color: var(--primary-color);
  }
  
  &.cashier {
    background-color: rgba(0, 204, 102, 0.1);
    color: var(--success-color);
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-right: 8px;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--primary-color);
  }
  
  &.delete:hover {
    color: var(--danger-color);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-secondary);
    
    &:hover {
      color: var(--text-color);
    }
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--card-background);
    color: var(--text-color);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: #0055cc;
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  
  &.danger {
    background-color: var(--danger-color);
    color: white;
    
    &:hover {
      background-color: #d32f2f;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: var(--danger-color);
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: rgba(255, 77, 77, 0.1);
  border-radius: 4px;
  
  svg {
    margin-right: 8px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  
  svg {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    margin-bottom: 8px;
    color: var(--text-color);
  }
`;

function UserManagement() {
  const { tenant, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'cashier',
    status: 'Active'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Load users and roles on component mount
  useEffect(() => {
    if (tenant) {
      // Get users for this tenant
      const tenantUsers = getUsersByTenant(tenant.id);
      setUsers(tenantUsers);
      
      // Get available roles
      setRoles(getRoles().filter(role => role !== 'owner' || user.role === 'owner'));
    }
  }, [tenant, user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'cashier',
      status: 'Active'
    });
    setError('');
    setShowModal(true);
  };
  
  const openEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    });
    setError('');
    setShowModal(true);
  };
  
  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setCurrentUser(null);
  };
  
  const validateForm = () => {
    if (!formData.username || !formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (modalMode === 'add' && !formData.password) {
      setError('Password is required for new users');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (modalMode === 'add' && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      if (modalMode === 'add') {
        // Add new user
        const newUser = {
          ...formData,
          tenantId: tenant.id
        };
        
        addUser(newUser);
        
        // Update local state
        setUsers(prev => [...prev, {
          ...newUser,
          id: Math.max(...prev.map(u => u.id), 0) + 1
        }]);
      } else {
        // Update existing user
        const updatedUser = {
          ...currentUser,
          username: formData.username,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        };
        
        // If password was provided, update it
        if (formData.password) {
          updatedUser.newPassword = formData.password;
        }
        
        updateUser(updatedUser);
        
        // Update local state
        setUsers(prev => prev.map(u => 
          u.id === currentUser.id ? updatedUser : u
        ));
      }
      
      closeModal();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = () => {
    setIsLoading(true);
    
    try {
      deleteUser(currentUser.id);
      
      // Update local state
      setUsers(prev => prev.filter(u => u.id !== currentUser.id));
      
      closeModal();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <UserManagementContainer>
      <UserManagementHeader>
        <h1>
          <FiUserCheck size={24} />
          User Management
        </h1>
        
        <AddButton onClick={openAddModal}>
          <FiPlus />
          Add User
        </AddButton>
      </UserManagementHeader>
      
      <UserTable>
        {users.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <RoleBadge className={user.role.toLowerCase()}>
                      {user.role}
                    </RoleBadge>
                  </td>
                  <td>
                    <StatusBadge className={user.status.toLowerCase()}>
                      {user.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton onClick={() => openEditModal(user)}>
                      <FiEdit2 size={18} />
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => openDeleteModal(user)}
                      disabled={user.role === 'owner'} // Can't delete owner
                    >
                      <FiTrash2 size={18} />
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            <FiUserCheck size={48} />
            <h3>No Users Found</h3>
            <p>Add users to your store to allow them to access the POS system.</p>
          </EmptyState>
        )}
      </UserTable>
      
      {/* Add/Edit User Modal */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h2>
              <button onClick={closeModal}>&times;</button>
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
              <ModalBody>
                {error && (
                  <ErrorMessage>
                    <FiAlertCircle />
                    {error}
                  </ErrorMessage>
                )}
                
                <FormGroup>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="password">
                    {modalMode === 'add' ? 'Password *' : 'New Password (leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalMode === 'add'}
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="role">Role *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </FormGroup>
              </ModalBody>
              
              <ModalFooter>
                <Button 
                  type="button" 
                  className="secondary"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : modalMode === 'add' ? 'Add User' : 'Update User'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>Delete User</h2>
              <button onClick={closeModal}>&times;</button>
            </ModalHeader>
            
            <ModalBody>
              <p>Are you sure you want to delete the user <strong>{currentUser?.name}</strong>?</p>
              <p>This action cannot be undone.</p>
            </ModalBody>
            
            <ModalFooter>
              <Button 
                type="button" 
                className="secondary"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete User'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </UserManagementContainer>
  );
}

export default UserManagement;
