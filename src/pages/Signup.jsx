import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiMail, FiLock, FiShoppingBag, FiMapPin, FiPhone, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px;
`;

const SignupCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 600px;
  max-width: 100%;
  padding: 32px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0 12px;
  
  &:focus-within {
    border-color: var(--primary-color);
  }
  
  svg {
    color: #999;
    margin-right: 8px;
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 0;
  background: none;
  color: var(--text-color);
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0055cc;
  }
  
  &:disabled {
    background-color: #cccccc;
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

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 18px;
    margin-bottom: 16px;
    color: var(--text-color);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 16px;
  color: var(--text-secondary);
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const Step = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  font-weight: 500;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    width: 16px;
    height: 2px;
    background-color: var(--border-color);
    transform: translateY(-50%);
  }
  
  &:last-child::after {
    display: none;
  }
`;

function Signup() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Owner information
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Store information
  const [storeData, setStoreData] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    currency: 'USD',
    taxRate: 7 // Stored as percentage for user input
  });
  
  const { createTenant } = useAuth();
  const navigate = useNavigate();
  
  const handleOwnerDataChange = (e) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStoreDataChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateStep1 = () => {
    if (!ownerData.name || !ownerData.email || !ownerData.password || !ownerData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (ownerData.password !== ownerData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (ownerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (!storeData.storeName) {
      setError('Store name is required');
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    setError('');
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Convert tax rate from percentage to decimal
      const tenantData = {
        ...storeData,
        taxRate: storeData.taxRate / 100
      };
      
      await createTenant(tenantData, ownerData);
      
      // Redirect to dashboard after successful signup
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account');
      setIsLoading(false);
    }
  };
  
  return (
    <SignupContainer>
      <SignupCard>
        <Logo>RetailMaster POS</Logo>
        
        <StepIndicator>
          <Step active={step === 1}>1</Step>
          <Step active={step === 2}>2</Step>
        </StepIndicator>
        
        {error && (
          <ErrorMessage>
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        )}
        
        <Form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
          {step === 1 && (
            <FormSection>
              <h3>Owner Account Information</h3>
              
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <InputWrapper>
                  <FiUser />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={ownerData.name}
                    onChange={handleOwnerDataChange}
                    placeholder="Enter your full name"
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <InputWrapper>
                  <FiMail />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={ownerData.email}
                    onChange={handleOwnerDataChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <InputWrapper>
                  <FiLock />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={ownerData.password}
                    onChange={handleOwnerDataChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputWrapper>
                  <FiLock />
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={ownerData.confirmPassword}
                    onChange={handleOwnerDataChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                </InputWrapper>
              </FormGroup>
            </FormSection>
          )}
          
          {step === 2 && (
            <FormSection>
              <h3>Store Information</h3>
              
              <FormGroup>
                <Label htmlFor="storeName">Store Name</Label>
                <InputWrapper>
                  <FiShoppingBag />
                  <Input
                    id="storeName"
                    type="text"
                    name="storeName"
                    value={storeData.storeName}
                    onChange={handleStoreDataChange}
                    placeholder="Enter your store name"
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="storeAddress">Store Address (Optional)</Label>
                <InputWrapper>
                  <FiMapPin />
                  <Input
                    id="storeAddress"
                    type="text"
                    name="storeAddress"
                    value={storeData.storeAddress}
                    onChange={handleStoreDataChange}
                    placeholder="Enter your store address"
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="storePhone">Store Phone (Optional)</Label>
                  <InputWrapper>
                    <FiPhone />
                    <Input
                      id="storePhone"
                      type="text"
                      name="storePhone"
                      value={storeData.storePhone}
                      onChange={handleStoreDataChange}
                      placeholder="Enter store phone number"
                    />
                  </InputWrapper>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="storeEmail">Store Email (Optional)</Label>
                  <InputWrapper>
                    <FiMail />
                    <Input
                      id="storeEmail"
                      type="email"
                      name="storeEmail"
                      value={storeData.storeEmail}
                      onChange={handleStoreDataChange}
                      placeholder="Enter store email"
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    name="currency"
                    value={storeData.currency}
                    onChange={handleStoreDataChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--card-background)',
                      color: 'var(--text-color)'
                    }}
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="CAD">Canadian Dollar (C$)</option>
                    <option value="AUD">Australian Dollar (A$)</option>
                  </select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <InputWrapper>
                    <FiDollarSign />
                    <Input
                      id="taxRate"
                      type="number"
                      name="taxRate"
                      min="0"
                      max="100"
                      step="0.01"
                      value={storeData.taxRate}
                      onChange={handleStoreDataChange}
                      placeholder="Enter default tax rate"
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>
            </FormSection>
          )}
          
          <div style={{ display: 'flex', justifyContent: step === 1 ? 'flex-end' : 'space-between' }}>
            {step === 2 && (
              <Button type="button" onClick={handlePrevStep} style={{ backgroundColor: 'var(--text-secondary)' }}>
                Back
              </Button>
            )}
            
            <Button type="submit" disabled={isLoading}>
              {step === 1 ? 'Next' : isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </Form>
        
        <LoginLink>
          Already have an account? <Link to="/login">Login</Link>
        </LoginLink>
      </SignupCard>
    </SignupContainer>
  );
}

export default Signup;
