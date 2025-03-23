import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>RetailMaster POS</h1>
        <p>Welcome to the RetailMaster Point of Sale System</p>
      </div>
    </Router>
  );
}

export default App;
