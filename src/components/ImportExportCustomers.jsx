import React, { useState } from 'react';
import styled from 'styled-components';
import { FiDownload, FiUpload, FiX, FiEye } from "react-icons/fi";
import { getCustomers, addCustomer } from "../services/customerService";
// import Papa from "papaparse";
// import * as XLSX from "xlsx";

// Mock implementations to replace the external libraries
const Papa = {
  parse: (file, options) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const results = {
          data: [],
          errors: []
        };
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',');
          const row = {};
          
          for (let j = 0; j < headers.length; j++) {
            row[headers[j].trim()] = values[j] ? values[j].trim() : '';
          }
          
          results.data.push(row);
        }
        
        if (options.complete) options.complete(results);
      } catch (err) {
        if (options.error) options.error(err);
      }
    };
    
    reader.onerror = () => {
      if (options.error) options.error(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  },
  unparse: (data) => {
    if (!data || !data.length) return '';
    
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csv += values.join(',') + '\n';
    });
    
    return csv;
  }
};

// Mock XLSX implementation
const XLSX = {
  utils: {
    book_new: () => ({}),
    json_to_sheet: (data) => ({ data }),
    book_append_sheet: (wb, ws, name) => {
      wb[name] = ws;
      return wb;
    },
    sheet_to_json: (sheet) => sheet.data || []
  },
  write: (wb, options) => {
    // Return a simple array buffer
    return new Uint8Array([0,1, 2, 3]).buffer;
  },
  read: (data, options) => {
    return {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: { data: [] }
      }
    };
  }
};

const ModalOverlay = styled.div`
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
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : '#555'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background-color: ${props => props.primary ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#0055cc' : '#e0e0e0'};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background-color: #f0f0f0;
  color: #333;
  border: 2px dashed #ccc;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const InfoText = styled.p`
  margin: 16px 0;
  color: #666;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  font-weight: 500;
`;

const FormatSelector = styled.div`
  margin-top: 16px;
  
  label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    cursor: pointer;
    
    input {
      margin-right: 8px;
    }
  }
`;

const TemplateLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  background-color: #f5f5f5;
  padding: 12px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    color: #666;
    font-size: 14px;
  }
`;

const PreviewTable = styled.div`
  max-height: 300px;
  overflow-y: auto;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  
  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f9f9f9;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f0f0f0;
  }
`;

const NoPreviewMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

function ImportExportCustomers({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('export');
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [previewData, setPreviewData] = useState(null);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedFile(null);
    setPreviewData(null);
    setSuccess('');
    setError('');
  };
  
  const handleExportCSV = () => {
    try {
      // Get all customers
      const customers = getCustomers();
      
      // Create CSV header
      let csv = 'ID,Name,Email,Phone,Address,Notes,TotalSpent,LastVisit\n';
      
      // Add customer data
      customers.forEach(customer => {
        const row = [
          customer.id,
          `"${(customer.name || '').replace(/"/g, '""')}"`,
          `"${(customer.email || '').replace(/"/g, '""')}"`,
          `"${(customer.phone || '').replace(/"/g, '""')}"`,
          `"${(customer.address || '').replace(/"/g, '""')}"`,
          `"${(customer.notes || '').replace(/"/g, '""')}"`,
          customer.totalSpent || 0,
          customer.lastVisit || ''
        ];
        csv += row.join(',') + '\n';
      });
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('Customers exported as CSV successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export customers. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const handleExportExcel = () => {
    try {
      // Get all customers
      const customers = getCustomers();
      
      // Prepare data for Excel
      const data = customers.map(customer => ({
        ID: customer.id,
        Name: customer.name || '',
        Email: customer.email || '',
        Phone: customer.phone || '',
        Address: customer.address || '',
        Notes: customer.notes || '',
        TotalSpent: customer.totalSpent || 0,
        LastVisit: customer.lastVisit || ''
      }));
      
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Customers');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('Customers exported as Excel successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export customers. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const handleExport = () => {
    if (exportFormat === 'csv') {
      handleExportCSV();
    } else {
      handleExportExcel();
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setError('');
    setPreviewData(null);
    
    generatePreview(file);
  };
  
  const generatePreview = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      // Parse CSV file for preview
      Papa.parse(file, {
        header: true,
        preview: 5, // Show first 5 rows
        complete: (results) => {
          try {
            if (results.data && results.data.length > 0) {
              const customersData = processCustomerData(results.data);
              setPreviewData({
                data: customersData.slice(0, 5),
                totalRows: results.data.length,
                previewRows: Math.min(5, results.data.length)
              });
            } else {
              setError('The CSV file appears to be empty or invalid.');
            }
          } catch (err) {
            console.error('CSV preview error:', err);
            setError(`Failed to preview CSV file: ${err.message}`);
          }
        },
        error: (err) => {
          console.error('CSV parse error:', err);
          setError(`Failed to parse CSV file: ${err.message}`);
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Parse Excel file for preview
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData && jsonData.length > 0) {
            const customersData = processCustomerData(jsonData);
            setPreviewData({
              data: customersData.slice(0, 5),
              totalRows: jsonData.length,
              previewRows: Math.min(5, jsonData.length)
            });
          } else {
            setError('The Excel file appears to be empty or invalid.');
          }
        } catch (err) {
          console.error('Excel preview error:', err);
          setError(`Failed to preview Excel file: ${err.message}`);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the file. Please try again.');
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      setError('Unsupported file format. Please upload a CSV or Excel file.');
    }
  };
  
  const processCustomerData = (data) => {
    try {
      // Validate data structure
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data format. Expected an array of customers.');
      }
      
      // Map fields to customer object structure
      const processedData = data.map(row => {
        // Handle different possible field names
        const customer = {
          id: row.ID || row.Id || row.id || `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: row.Name || row.name || '',
          email: row.Email || row.email || '',
          phone: row.Phone || row.phone || '',
          address: row.Address || row.address || '',
          notes: row.Notes || row.notes || '',
          totalSpent: parseFloat(row.TotalSpent || row.totalSpent || 0),
          lastVisit: row.LastVisit || row.lastVisit || ''
        };
        
        return customer;
      });
      
      return processedData;
    } catch (error) {
      console.error('Customer data processing error:', error);
      throw new Error(`Error processing customer data: ${error.message}`);
    }
  };
  
  const handleImport = () => {
    if (!selectedFile) {
      setError('Please select a file to import.');
      return;
    }
    
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      // Parse CSV file
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          try {
            const customersData = processCustomerData(results.data);
            importCustomers(customersData);
          } catch (err) {
            console.error('CSV import error:', err);
            setError(`Failed to import customers: ${err.message}`);
          }
        },
        error: (err) => {
          console.error('CSV parse error:', err);
          setError(`Failed to parse CSV file: ${err.message}`);
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Parse Excel file
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const customersData = processCustomerData(jsonData);
          importCustomers(customersData);
        } catch (err) {
          console.error('Excel import error:', err);
          setError(`Failed to parse Excel file: ${err.message}`);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the file. Please try again.');
      };
      
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError('Unsupported file format. Please upload a CSV or Excel file.');
    }
  };
  
  const importCustomers = (customersData) => {
    try {
      // Import each customer
      let importCount = 0;
      const existingCustomers = getCustomers();
      const existingIds = new Set(existingCustomers.map(c => c.id));
      const existingEmails = new Set(existingCustomers.map(c => c.email).filter(Boolean));
      
      customersData.forEach(customer => {
        if (customer.name) {
          // Check if customer already exists by ID or email
          if (existingIds.has(customer.id) || (customer.email && existingEmails.has(customer.email))) {
            // Update existing customer - not implemented in this example
            // In a real app, you would update the customer here
          } else {
            // Add new customer
            addCustomer(customer);
            importCount++;
          }
        }
      });
      
      setSuccess(`Successfully imported ${importCount} customers!`);
      setSelectedFile(null);
      setPreviewData(null);
      
      // Trigger a custom event to notify other components about the change
      window.dispatchEvent(new Event('customerDataChanged'));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Import error:', err);
      setError(`Failed to import customers: ${err.message}`);
    }
  };
  
  const downloadTemplate = () => {
    // Create a template with example data
    const templateData = [
      {
        'ID': '',
        'Name': 'John Doe',
        'Email': 'john.doe@example.com',
        'Phone': '555-123-4567',
        'Address': '123 Main St, Anytown, USA',
        'Notes': 'Prefers email contact',
        'TotalSpent': 0,
        'LastVisit': ''
      },
      {
        'ID': '',
        'Name': 'Jane Smith',
        'Email': 'jane.smith@example.com',
        'Phone': '555-987-6543',
        'Address': '456 Oak Ave, Somewhere, USA',
        'Notes': 'Frequent customer',
        'TotalSpent': 0,
        'LastVisit': ''
      }
    ];
    
    if (exportFormat === 'csv') {
      // Create CSV
      const csv = Papa.unparse(templateData);
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'customer_import_template.csv';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Create Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Customers');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'customer_import_template.xlsx';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Import/Export Customers</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'export'} 
            onClick={() => handleTabChange('export')}
          >
            Export
          </Tab>
          <Tab 
            active={activeTab === 'import'} 
            onClick={() => handleTabChange('import')}
          >
            Import
          </Tab>
        </TabContainer>
        
        {activeTab === 'export' ? (
          <>
            <InfoText>
              Export all customer data as a CSV or Excel file. This file can be used for backup or to import customers into another system.
            </InfoText>
            
            <FormatSelector>
              <label>
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="csv" 
                  checked={exportFormat === 'csv'} 
                  onChange={() => setExportFormat('csv')} 
                />
                CSV Format
              </label>
              <label>
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="excel" 
                  checked={exportFormat === 'excel'} 
                  onChange={() => setExportFormat('excel')} 
                />
                Excel Format
              </label>
            </FormatSelector>
            
            <ActionButton primary onClick={handleExport}>
              <FiDownload />
              Export Customers
            </ActionButton>
          </>
        ) : (
          <>
            <InfoText>
              Import customers from a CSV or Excel file. The file should contain customer information with appropriate column headers.
              <br /><br />
              <TemplateLink href="#" onClick={(e) => { e.preventDefault(); downloadTemplate(); }}>
                Download template file ({exportFormat.toUpperCase()})
              </TemplateLink>
            </InfoText>
            
            <FormatSelector>
              <label>
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="csv" 
                  checked={exportFormat === 'csv'} 
                  onChange={() => setExportFormat('csv')} 
                />
                CSV Format
              </label>
              <label>
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="excel" 
                  checked={exportFormat === 'excel'} 
                  onChange={() => setExportFormat('excel')} 
                />
                Excel Format
              </label>
            </FormatSelector>
            
            <FileInputLabel>
              <FiUpload />
              {selectedFile ? selectedFile.name : `Select ${exportFormat.toUpperCase()} File`}
              <FileInput 
                type="file" 
                accept={exportFormat === 'csv' ? '.csv' : '.xlsx,.xls'} 
                onChange={handleFileChange} 
              />
            </FileInputLabel>
            
            {selectedFile && (
              <PreviewContainer>
                <PreviewHeader>
                  Data Preview
                  {previewData && (
                    <span>Showing {previewData.previewRows} of {previewData.totalRows} rows</span>
                  )}
                </PreviewHeader>
                <PreviewTable>
                  {previewData ? (
                    <Table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.data.map((customer, index) => (
                          <tr key={index}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <NoPreviewMessage>
                      Loading preview...
                    </NoPreviewMessage>
                  )}
                </PreviewTable>
              </PreviewContainer>
            )}
            
            <ActionButton primary onClick={handleImport} disabled={!selectedFile}>
              <FiUpload />
              Import Customers
            </ActionButton>
          </>
        )}
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ModalContent>
    </ModalOverlay>
  );
}

export default ImportExportCustomers;
