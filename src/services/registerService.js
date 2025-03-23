// registerService.js
const REGISTER_SESSIONS_KEY = 'register_sessions';
const CURRENT_SESSION_KEY = 'current_register_session';

// Get all register sessions from localStorage
export const getRegisterSessions = () => {
  const sessions = localStorage.getItem(REGISTER_SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

// Save register sessions to localStorage
export const saveRegisterSessions = (sessions) => {
  localStorage.setItem(REGISTER_SESSIONS_KEY, JSON.stringify(sessions));
};

// Get current active session
export const getCurrentSession = () => {
  const session = localStorage.getItem(CURRENT_SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

// Save current active session
export const saveCurrentSession = (session) => {
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
};

// Start a new register session
export const startRegisterSession = (cashCounts) => {
  const sessions = getRegisterSessions();
  
  // Create new session
  const newSession = {
    id: `session-${Date.now()}`,
    startTime: new Date().toISOString(),
    startingCash: calculateTotalCash(cashCounts),
    cashCounts: cashCounts,
    endTime: null,
    endingCash: null,
    status: 'active',
    transactions: []
  };
  
  // Add to sessions list
  sessions.push(newSession);
  saveRegisterSessions(sessions);
  
  // Set as current session
  saveCurrentSession(newSession);
  
  return newSession;
};

// End current register session
export const endRegisterSession = (endCashCounts) => {
  const currentSession = getCurrentSession();
  if (!currentSession) {
    throw new Error('No active register session found');
  }
  
  // Update session
  currentSession.endTime = new Date().toISOString();
  currentSession.endingCash = calculateTotalCash(endCashCounts);
  currentSession.endCashCounts = endCashCounts;
  currentSession.status = 'closed';
  
  // Update in sessions list
  const sessions = getRegisterSessions();
  const updatedSessions = sessions.map(session => 
    session.id === currentSession.id ? currentSession : session
  );
  
  saveRegisterSessions(updatedSessions);
  
  // Clear current session
  localStorage.removeItem(CURRENT_SESSION_KEY);
  
  return currentSession;
};

// Calculate total cash from denomination counts
export const calculateTotalCash = (cashCounts) => {
  if (!cashCounts) return 0;
  
  let total = 0;
  
  // Bills
  total += (cashCounts['1'] || 0) * 1;
  total += (cashCounts['5'] || 0) * 5;
  total += (cashCounts['10'] || 0) * 10;
  total += (cashCounts['20'] || 0) * 20;
  total += (cashCounts['50'] || 0) * 50;
  total += (cashCounts['100'] || 0) * 100;
  
  // Coins
  total += (cashCounts['1.00'] || 0) * 1.00;
  total += (cashCounts['0.25'] || 0) * 0.25;
  total += (cashCounts['0.10'] || 0) * 0.10;
  total += (cashCounts['0.05'] || 0) * 0.05;
  total += (cashCounts['0.01'] || 0) * 0.01;
  
  return total;
};

// Add transaction to current session
export const addTransactionToSession = (transaction) => {
  const currentSession = getCurrentSession();
  if (!currentSession) {
    throw new Error('No active register session found');
  }
  
  // Add transaction
  currentSession.transactions.push({
    ...transaction,
    timestamp: new Date().toISOString()
  });
  
  // Update in sessions list
  const sessions = getRegisterSessions();
  const updatedSessions = sessions.map(session => 
    session.id === currentSession.id ? currentSession : session
  );
  
  saveRegisterSessions(updatedSessions);
  saveCurrentSession(currentSession);
  
  return currentSession;
};

// Check if there's an active register session
export const hasActiveSession = () => {
  const currentSession = getCurrentSession();
  return currentSession !== null && currentSession.status === 'active';
};
