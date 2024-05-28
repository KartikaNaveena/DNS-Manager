import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DomainPage from './pages/DomainPage';
import RecordsPage from './pages/RecordPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>DNS Manager</h1>
        <Routes>
          <Route path="/" element={<DomainPage />} />
          <Route path="/records//hostedzone/:zoneId" element={<RecordsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
