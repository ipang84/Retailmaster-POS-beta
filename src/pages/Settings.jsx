import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSettings, FiPrinter, FiFileText, FiTag, FiUsers, FiSliders } from 'react-icons/fi';
import LabelSettings from '../components/LabelSettings';
import ReceiptSettings from '../components/ReceiptSettings';
import LabelSizeVerification from '../components/LabelSizeVerification';
import UserManagement from './UserManagement';
import { getAppSettings, saveAppSettings } from '../services/settingsService';

const SettingsContainer = styled.div`
  padding: 20px;
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 10px;
    }
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Tab = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

const GeneralSettingsContainer = styled.div`
  max-width: 800px;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--text-color);
  }
  
  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    background-color: var(--card-background);
    color: var(--text-color);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  label {
    margin-left: 10px;
    margin-bottom: 0;
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: var(--primary-color);
  }
  
  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #0055cc;
  }
`;

const StatusMessage = styled.div`
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  
  &.success {
    background-color: rgba(76, 175, 80, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(76, 175, 80, 0.2);
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--text-color);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const GeneralSettings = () => {
  const [settings, setSettings] = useState(() => getAppSettings());
  const [statusMessage, setStatusMessage] = useState('');
  
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    saveAppSettings(settings);
    setStatusMessage('General settings saved successfully!');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };
  
  return (
    <GeneralSettingsContainer>
      <SectionTitle>
        <FiSliders size={18} />
        General Application Settings
      </SectionTitle>
      
      <form onSubmit={handleSettingsSubmit}>
        <FormGroup>
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleSettingsChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={handleSettingsChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={settings.currency}
            onChange={handleSettingsChange}
          >
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
            <option value="CAD">Canadian Dollar (C$)</option>
            <option value="AUD">Australian Dollar (A$)</option>
            <option value="JPY">Japanese Yen (¥)</option>
          </select>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="dateFormat">Date Format</label>
          <select
            id="dateFormat"
            name="dateFormat"
            value={settings.dateFormat}
            onChange={handleSettingsChange}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="timeFormat">Time Format</label>
          <select
            id="timeFormat"
            name="timeFormat"
            value={settings.timeFormat}
            onChange={handleSettingsChange}
          >
            <option value="12h">12-hour (AM/PM)</option>
            <option value="24h">24-hour</option>
          </select>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="autoLogout">Auto Logout (minutes)</label>
          <input
            type="number"
            id="autoLogout"
            name="autoLogout"
            min="0"
            max="240"
            value={settings.autoLogout}
            onChange={handleSettingsChange}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Set to 0 to disable auto logout
          </p>
        </FormGroup>
        
        <ToggleGroup>
          <ToggleSwitch>
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={settings.notifications}
              onChange={handleSettingsChange}
            />
            <span className="slider"></span>
          </ToggleSwitch>
          <label htmlFor="notifications">Enable Notifications</label>
        </ToggleGroup>
        
        <ToggleGroup>
          <ToggleSwitch>
            <input
              type="checkbox"
              id="compactView"
              name="compactView"
              checked={settings.compactView}
              onChange={handleSettingsChange}
            />
            <span className="slider"></span>
          </ToggleSwitch>
          <label htmlFor="compactView">Use Compact View</label>
        </ToggleGroup>
        
        <SaveButton type="submit">
          Save General Settings
        </SaveButton>
        
        {statusMessage && (
          <StatusMessage className="success">
            {statusMessage}
          </StatusMessage>
        )}
      </form>
    </GeneralSettingsContainer>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('labels');
  
  return (
    <SettingsContainer>
      <SettingsHeader>
        <h1>
          <FiSettings size={22} />
          Settings
        </h1>
      </SettingsHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'general'} 
          onClick={() => setActiveTab('general')}
        >
          <FiSliders size={16} />
          General Settings
        </Tab>
        <Tab 
          active={activeTab === 'labels'} 
          onClick={() => setActiveTab('labels')}
        >
          <FiTag size={16} />
          Label Settings
        </Tab>
        <Tab 
          active={activeTab === 'receipts'} 
          onClick={() => setActiveTab('receipts')}
        >
          <FiFileText size={16} />
          Receipt Settings
        </Tab>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          <FiUsers size={16} />
          Users & Roles
        </Tab>
      </TabsContainer>
      
      {activeTab === 'general' && <GeneralSettings />}
      
      {activeTab === 'labels' && (
        <>
          <LabelSizeVerification />
          <LabelSettings />
        </>
      )}
      
      {activeTab === 'receipts' && (
        <ReceiptSettings />
      )}
      
      {activeTab === 'users' && (
        <UserManagement />
      )}
    </SettingsContainer>
  );
};

export default Settings;
