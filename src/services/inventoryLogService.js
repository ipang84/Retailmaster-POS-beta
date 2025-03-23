// inventoryLogService.js
const INVENTORY_LOGS_KEY = 'retailmaster_inventory_logs';

// Get all inventory logs
export const getInventoryLogs = () => {
  const logs = localStorage.getItem(INVENTORY_LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
};

// Add a new inventory log
export const addInventoryLog = (logData) => {
  // Get current logs
  const logs = getInventoryLogs();
  
  // Create new log entry
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    productId: logData.productId,
    productName: logData.productName,
    productSku: logData.productSku || null,
    previousQuantity: logData.previousQuantity || 0,
    quantityChange: logData.quantityChange,
    newQuantity: logData.previousQuantity + logData.quantityChange,
    reasonType: logData.reasonType,
    reason: logData.reason,
    userName: logData.userId || 'system',
    referenceNumber: logData.referenceNumber || null,
    notes: logData.notes || null
  };
  
  // Add to logs array
  logs.unshift(newLog); // Add to beginning for chronological order
  
  // Save to localStorage
  localStorage.setItem(INVENTORY_LOGS_KEY, JSON.stringify(logs));
  
  return newLog;
};

// Get reason types for inventory changes
export const getReasonTypes = () => {
  return [
    { id: 'purchase', name: 'Purchase' },
    { id: 'sale', name: 'Sale' },
    { id: 'return', name: 'Return' },
    { id: 'damage', name: 'Damage/Loss' },
    { id: 'adjustment', name: 'Adjustment' },
    { id: 'count', name: 'Inventory Count' },
    { id: 'transfer', name: 'Transfer' },
    { id: 'other', name: 'Other' }
  ];
};

// Get logs for a specific product
export const getLogsByProductId = (productId) => {
  const logs = getInventoryLogs();
  return logs.filter(log => log.productId === productId);
};

// Get logs by reason type
export const getLogsByReasonType = (reasonType) => {
  const logs = getInventoryLogs();
  return logs.filter(log => log.reasonType === reasonType);
};

// Get logs within a date range
export const getLogsByDateRange = (startDate, endDate) => {
  const logs = getInventoryLogs();
  
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return logs.filter(log => {
    const logDate = new Date(log.timestamp).getTime();
    return logDate >= start && logDate <= end;
  });
};

// Clear all logs (for testing/development)
export const clearAllLogs = () => {
  localStorage.removeItem(INVENTORY_LOGS_KEY);
};
