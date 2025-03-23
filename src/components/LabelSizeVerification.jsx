import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiPrinter, FiCheck, FiX } from 'react-icons/fi';

const VerificationContainer = styled.div`
  max-width: 800px;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
`;

const Title = styled.h3`
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

const Description = styled.p`
  margin-bottom: 20px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const TestLabelContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const TestLabelButton = styled.button`
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
  margin-bottom: 20px;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #0055cc;
  }
`;

const SizeOption = styled.div`
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: ${props => props.selected ? 'rgba(0, 102, 255, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: var(--primary-color);
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const FeedbackContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  background-color: ${props => props.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
  color: ${props => props.type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const CalibrationInstructions = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  color: #856404;
`;

const LabelSizeVerification = () => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [feedbackType, setFeedbackType] = useState(null);
  const [showCalibration, setShowCalibration] = useState(false);
  
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setFeedbackType(null);
    setShowCalibration(false);
  };
  
  const handlePrintTestLabel = () => {
    // Get dimensions based on selected size
    const dimensions = getLabelDimensions();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Check if window was successfully created
    if (!printWindow) {
      alert("Please allow pop-ups for this website to print test labels.");
      return;
    }
    
    // Generate the HTML content for the print window
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Label Size Test</title>
        <style>
          @media print {
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .test-label {
              width: ${dimensions.width}mm;
              height: ${dimensions.height}mm;
              border: 0.2mm solid black;
              margin: 5mm;
              position: relative;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .size-info {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              font-family: Arial, sans-serif;
              font-size: 10px;
            }
            .ruler-horizontal {
              position: absolute;
              bottom: 2mm;
              left: 0;
              width: 100%;
              height: 1mm;
              background: repeating-linear-gradient(
                to right,
                #000,
                #000 1mm,
                transparent 1mm,
                transparent 2mm
              );
            }
            .ruler-vertical {
              position: absolute;
              top: 0;
              right: 2mm;
              height: 100%;
              width: 1mm;
              background: repeating-linear-gradient(
                to bottom,
                #000,
                #000 1mm,
                transparent 1mm,
                transparent 2mm
              );
            }
            .corner-marks {
              position: absolute;
              width: 100%;
              height: 100%;
            }
            .corner-mark {
              position: absolute;
              width: 2mm;
              height: 2mm;
            }
            .top-left {
              top: 0;
              left: 0;
              border-top: 0.2mm solid black;
              border-left: 0.2mm solid black;
            }
            .top-right {
              top: 0;
              right: 0;
              border-top: 0.2mm solid black;
              border-right: 0.2mm solid black;
            }
            .bottom-left {
              bottom: 0;
              left: 0;
              border-bottom: 0.2mm solid black;
              border-left: 0.2mm solid black;
            }
            .bottom-right {
              bottom: 0;
              right: 0;
              border-bottom: 0.2mm solid black;
              border-right: 0.2mm solid black;
            }
          }
        </style>
      </head>
      <body>
        <div class="test-label">
          <div class="size-info">
            <strong>${dimensions.width} × ${dimensions.height} mm</strong><br>
            ${getSizeName(selectedSize)}
          </div>
          <div class="ruler-horizontal"></div>
          <div class="ruler-vertical"></div>
          <div class="corner-marks">
            <div class="corner-mark top-left"></div>
            <div class="corner-mark top-right"></div>
            <div class="corner-mark bottom-left"></div>
            <div class="corner-mark bottom-right"></div>
          </div>
        </div>
        <script>
          window.onload = function() {
            // Print after a short delay
            setTimeout(function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 300);
          };
        </script>
      </body>
      </html>
    `;
    
    try {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    } catch (error) {
      console.error("Error opening print window:", error);
      alert("There was an error opening the print window. Please check your browser settings.");
    }
  };
  
  const handleFeedback = (type) => {
    setFeedbackType(type);
    if (type === 'error') {
      setShowCalibration(true);
    }
  };
  
  // Get dimensions based on selected label size
  const getLabelDimensions = () => {
    switch (selectedSize) {
      case 'small':
        return { width: 37, height: 22 };
      case 'medium':
        return { width: 50, height: 25 };
      case 'large':
        return { width: 62, height: 29 };
      case 'custom':
        // You can add custom size inputs if needed
        return { width: 50, height: 25 };
      default:
        return { width: 50, height: 25 };
    }
  };
  
  const getSizeName = (size) => {
    switch (size) {
      case 'small':
        return 'Small Label';
      case 'medium':
        return 'Medium Label';
      case 'large':
        return 'Large Label';
      case 'custom':
        return 'Custom Label';
      default:
        return 'Medium Label';
    }
  };
  
  return (
    <VerificationContainer>
      <Title>
        <FiPrinter size={18} />
        Label Size Verification
      </Title>
      
      <Description>
        This tool helps you verify if the label sizes are correctly configured for your printer. 
        Select a label size, print a test label, and measure it to ensure it matches the expected dimensions.
      </Description>
      
      <SizeGrid>
        <SizeOption 
          selected={selectedSize === 'small'} 
          onClick={() => handleSizeSelect('small')}
        >
          <strong>Small Label</strong>
          <div>37mm × 22mm</div>
        </SizeOption>
        
        <SizeOption 
          selected={selectedSize === 'medium'} 
          onClick={() => handleSizeSelect('medium')}
        >
          <strong>Medium Label</strong>
          <div>50mm × 25mm</div>
        </SizeOption>
        
        <SizeOption 
          selected={selectedSize === 'large'} 
          onClick={() => handleSizeSelect('large')}
        >
          <strong>Large Label</strong>
          <div>62mm × 29mm</div>
        </SizeOption>
      </SizeGrid>
      
      <TestLabelContainer>
        <TestLabelButton onClick={handlePrintTestLabel}>
          <FiPrinter size={16} />
          Print Test Label
        </TestLabelButton>
        
        <div>
          <p>After printing, please verify:</p>
          <ul>
            <li>The label has the correct dimensions (use a ruler to measure)</li>
            <li>The printed size matches the selected size</li>
            <li>The rulers on the edges have accurate 1mm markings</li>
          </ul>
          
          <div style={{ marginTop: '20px' }}>
            <p>Did the test label print with the correct dimensions?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => handleFeedback('success')}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: 'var(--success-color)', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Yes, it's correct
              </button>
              <button 
                onClick={() => handleFeedback('error')}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: 'var(--error-color)', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                No, the size is wrong
              </button>
            </div>
          </div>
        </div>
      </TestLabelContainer>
      
      {feedbackType === 'success' && (
        <FeedbackContainer type="success">
          <FiCheck size={18} />
          <div>
            <strong>Great!</strong> Your label sizes are correctly configured. You can now print product labels with confidence.
          </div>
        </FeedbackContainer>
      )}
      
      {feedbackType === 'error' && (
        <FeedbackContainer type="error">
          <FiX size={18} />
          <div>
            <strong>There seems to be an issue with the label size.</strong> The printed dimensions don't match the expected size.
          </div>
        </FeedbackContainer>
      )}
      
      {showCalibration && (
        <CalibrationInstructions>
          <h4>Calibration Instructions:</h4>
          <ol>
            <li>Measure the actual printed label width and height in millimeters</li>
            <li>Calculate the scaling factor: expected size ÷ actual size</li>
            <li>Go to Settings → Label Settings and adjust the custom size using the calculated scaling factor</li>
            <li>For example, if a 50mm label prints as 45mm, set the custom width to 55.5mm (50 ÷ 45 × 50)</li>
            <li>Print another test label to verify the calibration</li>
          </ol>
          <p>Note: Printer settings like "Scale to fit" or "Actual size" can also affect the printed dimensions.</p>
        </CalibrationInstructions>
      )}
    </VerificationContainer>
  );
};

export default LabelSizeVerification;
