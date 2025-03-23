import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const UnauthorizedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px;
  text-align: center;
`;

const UnauthorizedCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 500px;
  max-width: 90%;
  padding: 32px;
`;

const IconWrapper = styled.div`
  font-size: 64px;
  color: var(--warning-color);
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  color: var(--text-color);
`;

const Message = styled.p`
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  
  &:hover {
    background-color: #0055cc;
  }
`;

function Unauthorized() {
  const { user } = useAuth();
  
  return (
    <UnauthorizedContainer>
      <UnauthorizedCard>
        <IconWrapper>
          <FiAlertTriangle />
        </IconWrapper>
        
        <Title>Access Denied</Title>
        
        <Message>
          You don't have permission to access this page. 
          {user ? 
            ` Your current role (${user.role}) doesn't have the required permissions.` : 
            ' Please log in to continue.'}
        </Message>
        
        <BackButton to={user ? '/' : '/login'}>
          <FiArrowLeft />
          {user ? 'Back to Dashboard' : 'Go to Login'}
        </BackButton>
      </UnauthorizedCard>
    </UnauthorizedContainer>
  );
}

export default Unauthorized;
